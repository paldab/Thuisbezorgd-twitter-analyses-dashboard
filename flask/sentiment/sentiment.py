import pandas as pd

df = pd.read_parquet("dutch-restaurant-reviews.parquet", engine="pyarrow")

print(df["reviewScoreOverall"].head())
print(len(df.index))
