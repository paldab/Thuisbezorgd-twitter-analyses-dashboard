from utils.stopwords import dutch_stopwords as stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import LabelBinarizer
from gensim.utils import simple_preprocess
from spacy.lang.nl.examples import sentences
import numpy as np
import sklearn.metrics as skm
import nltk
import pandas as pd
import spacy
import joblib

# nltk.download('wordnet')
nlp = spacy.load("nl_core_news_md")

def preprocess(sentence):    
    return nlp(sentence).text

def multiclass_roc_auc_score(y_test, y_pred, average="macro"):
    lb = LabelBinarizer()
    lb.fit(y_test)
    y_test = lb.transform(y_test)
    y_pred = lb.transform(y_pred)
    return skm.roc_auc_score(y_test, y_pred, average=average)
        
def label_rating(rating):
    if rating < 3:
        return 0
    if rating > 3:
        return 2
    return 1
    
def display_model_stats(test, pred):
    print('Accuracy Score : ' + str(skm.accuracy_score(test, pred)))
    print('Precision Score : ' + str(skm.precision_score(test, pred, average="macro")))
    print('Recall Score : ' + str(skm.recall_score(test, pred, average="macro")))
    print('F1 Score : ' + str(skm.f1_score(test, pred, average="macro")))
    print('Roc Score : ' + str(multiclass_roc_auc_score(test, pred)))

    print("\n")

    print('Confusion Matrix : \n' + str(skm.confusion_matrix(test, pred)))

df = pd.read_csv("./datasets/reviews.csv")
df["processed_text"] = df["review"].map(preprocess)
df["label"] = df["rating"].apply(lambda x: label_rating(x))

# Equal the amount of input variables
df.drop(df[df["label"] == 2].index[0:22000], inplace=True)

X = df["processed_text"]
y = df["label"]

param_grid = {
    'C': np.logspace(-4, 4)
}

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)

# Vectorizer
vectorizer = TfidfVectorizer(ngram_range=(1, 2))
Xbase = vectorizer.fit_transform(X_train)
Xtest = vectorizer.transform(X_test)

# Model
model = LogisticRegression(multi_class="multinomial", max_iter=2000)
gridsearch = GridSearchCV(model, param_grid, n_jobs=-1, verbose=1)

gridsearch.fit(Xbase, y_train)

predict = gridsearch.predict(Xtest)

roc = multiclass_roc_auc_score(y_test, predict)

# save model
with open("ml-models/sentiment-model-gridsearch.sav", "wb") as f:
    joblib.dump(model, f)

# with open("ml-vectorizer/tldf-vectorizer.sav", "wb") as f:
#     joblib.dump(vectorizer, f)
    
display_model_stats(y_test, predict)