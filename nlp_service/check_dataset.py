import pandas as pd

df = pd.read_csv("app/data/train.tsv", sep="\t")

print(df.head())
print("\nColumns:")
print(df.columns)
print("\nRows:", len(df))