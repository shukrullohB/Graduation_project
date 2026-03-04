from pathlib import Path
import argparse
import inspect

import numpy as np
import pandas as pd
import torch
from datasets import Dataset
from sklearn.metrics import mean_absolute_error
from transformers import AutoModelForSequenceClassification, AutoTokenizer
from transformers import Trainer, TrainingArguments


def parse_args():
    parser = argparse.ArgumentParser(description="Train BERT-style regressor for short answers")
    parser.add_argument("--model_name", type=str, default="distilbert-base-uncased")
    parser.add_argument("--epochs", type=int, default=1)
    parser.add_argument("--batch_size", type=int, default=8)
    parser.add_argument("--max_length", type=int, default=128)
    parser.add_argument("--debug_rows", type=int, default=0)
    parser.add_argument("--output_dir", type=str, default="results/bert_regressor")
    parser.add_argument("--save_steps", type=int, default=200)
    parser.add_argument("--seed", type=int, default=42)
    return parser.parse_args()


def compute_metrics(eval_pred):
    predictions, labels = eval_pred
    preds = np.squeeze(predictions)
    mae = mean_absolute_error(labels, preds)
    return {"mae": mae}


def find_latest_checkpoint(output_dir: Path):
    if not output_dir.exists():
        return None

    checkpoints = []
    for path in output_dir.iterdir():
        if path.is_dir() and path.name.startswith("checkpoint-"):
            try:
                step = int(path.name.split("-")[-1])
                checkpoints.append((step, path))
            except ValueError:
                continue

    if not checkpoints:
        return None

    checkpoints.sort(key=lambda item: item[0])
    return checkpoints[-1][1]


def main():
    args = parse_args()
    torch.manual_seed(args.seed)
    np.random.seed(args.seed)

    app_dir = Path(__file__).resolve().parents[1]
    train_path = app_dir / "data" / "train_clean.csv"
    test_path = app_dir / "data" / "test_clean.csv"

    train_df = pd.read_csv(train_path)
    test_df = pd.read_csv(test_path)

    if args.debug_rows > 0:
        train_df = train_df.sample(n=min(args.debug_rows, len(train_df)), random_state=args.seed)
        test_df = test_df.sample(n=min(max(args.debug_rows // 4, 200), len(test_df)), random_state=args.seed)

    print("Train rows:", len(train_df))
    print("Test rows:", len(test_df))
    print("Model:", args.model_name)
    print("Device:", "cuda" if torch.cuda.is_available() else "cpu")

    train_dataset = Dataset.from_pandas(train_df)
    test_dataset = Dataset.from_pandas(test_df)

    tokenizer = AutoTokenizer.from_pretrained(args.model_name)

    def preprocess(example):
        return tokenizer(
            example["student_answer"],
            truncation=True,
            padding="max_length",
            max_length=args.max_length,
        )

    train_dataset = train_dataset.map(preprocess, batched=True)
    test_dataset = test_dataset.map(preprocess, batched=True)

    train_dataset = train_dataset.rename_column("score", "labels")
    test_dataset = test_dataset.rename_column("score", "labels")

    train_dataset.set_format(type="torch", columns=["input_ids", "attention_mask", "labels"])
    test_dataset.set_format(type="torch", columns=["input_ids", "attention_mask", "labels"])

    model = AutoModelForSequenceClassification.from_pretrained(
        args.model_name,
        num_labels=1,
        problem_type="regression",
    )

    training_kwargs = {
        "output_dir": args.output_dir,
        "num_train_epochs": args.epochs,
        "per_device_train_batch_size": args.batch_size,
        "per_device_eval_batch_size": args.batch_size,
        "dataloader_pin_memory": False,
        "logging_steps": 50,
        "save_total_limit": 2,
        "seed": args.seed,
    }

    supported_params = inspect.signature(TrainingArguments.__init__).parameters

    if "evaluation_strategy" in supported_params:
        training_kwargs["evaluation_strategy"] = "epoch"
    elif "eval_strategy" in supported_params:
        training_kwargs["eval_strategy"] = "epoch"

    if "save_strategy" in supported_params:
        training_kwargs["save_strategy"] = "steps"

    if "save_steps" in supported_params:
        training_kwargs["save_steps"] = args.save_steps

    if "load_best_model_at_end" in supported_params:
        training_kwargs["load_best_model_at_end"] = True

    if "metric_for_best_model" in supported_params:
        training_kwargs["metric_for_best_model"] = "mae"

    if "greater_is_better" in supported_params:
        training_kwargs["greater_is_better"] = False

    if "report_to" in supported_params:
        training_kwargs["report_to"] = "none"

    training_args = TrainingArguments(**training_kwargs)

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=test_dataset,
        compute_metrics=compute_metrics,
    )

    output_dir = Path(args.output_dir)
    latest_checkpoint = find_latest_checkpoint(output_dir)

    print("Starting training...")
    if latest_checkpoint is not None:
        print("Resuming from checkpoint:", latest_checkpoint)
        trainer.train(resume_from_checkpoint=str(latest_checkpoint))
    else:
        trainer.train()

    print("Evaluating...")
    predictions = trainer.predict(test_dataset)
    preds = np.squeeze(predictions.predictions)

    raw_mae = mean_absolute_error(test_df["score"], preds)
    clipped_preds = np.clip(preds, 0.0, 5.0)
    clipped_mae = mean_absolute_error(test_df["score"], clipped_preds)

    print("Final MAE (raw):", raw_mae)
    print("Final MAE (clipped 0-5):", clipped_mae)

    final_dir = Path(args.output_dir) / "final"
    trainer.save_model(str(final_dir))
    tokenizer.save_pretrained(str(final_dir))
    print("Model saved to:", final_dir)


if __name__ == "__main__":
    main()