from pathlib import Path
import argparse
import pandas as pd


def parse_args():
    parser = argparse.ArgumentParser(description="Merge teacher corrections into a base dataset")
    parser.add_argument("--base", type=str, default="app/data/train_clean.csv")
    parser.add_argument("--corrections", type=str, default="app/data/teacher_corrections.csv")
    parser.add_argument("--output", type=str, default="app/data/train_with_corrections.csv")
    return parser.parse_args()


def main():
    args = parse_args()
    base_path = Path(args.base)
    corrections_path = Path(args.corrections)

    if not base_path.exists():
        raise FileNotFoundError(f"Base dataset not found: {base_path}")
    if not corrections_path.exists():
        raise FileNotFoundError(f"Corrections not found: {corrections_path}")

    base_df = pd.read_csv(base_path)
    corrections_df = pd.read_csv(corrections_path)

    if "teacher_score" in corrections_df.columns and "score" in base_df.columns:
        corrections_df = corrections_df.rename(columns={"teacher_score": "score"})

    for col in ["student_answer", "score"]:
        if col not in corrections_df.columns:
            raise ValueError(f"Corrections missing required column: {col}")

    merged = pd.concat([base_df, corrections_df], ignore_index=True)
    merged.to_csv(args.output, index=False)

    print("Base rows:", len(base_df))
    print("Corrections rows:", len(corrections_df))
    print("Merged rows:", len(merged))
    print("Output:", args.output)


if __name__ == "__main__":
    main()
