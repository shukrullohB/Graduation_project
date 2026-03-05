import pandas as pd
from sklearn.model_selection import train_test_split

df = pd.read_csv("app/data/train.tsv", sep="\t")

print("Original rows:", len(df))

df["score"] = (df["Score1"] + df["Score2"]) / 2

df = df[["EssayText", "score"]]

df = df.rename(columns={
    "EssayText": "student_answer"
})

df = df.dropna()

train_df, test_df = train_test_split(
    df,
    test_size=0.2,
    random_state=42
)

train_df.to_csv("app/data/train_clean.csv", index=False)
test_df.to_csv("app/data/test_clean.csv", index=False)

print("Dataset prepared!")
print("Train size:", len(train_df))
print("Test size:", len(test_df))