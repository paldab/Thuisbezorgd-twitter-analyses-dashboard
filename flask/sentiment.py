from utils.stopwords import dutch_stopwords as stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score,recall_score,precision_score,f1_score
from sklearn.metrics import confusion_matrix
from nltk.stem import WordNetLemmatizer, SnowballStemmer
from wordcloud import WordCloud
from gensim.utils import simple_preprocess
import wordcloud
import nltk
import pandas as pd
import emoji

nltk.download('wordnet')
stemmer = SnowballStemmer("dutch")
def lemmatize_stemming(text):
    return stemmer.stem(WordNetLemmatizer().lemmatize(text, pos="v"))

def preprocess(text):
    # tune_text = text.replace(emoji.get_emoji_regexp(), "", reggex=True)
    
    processed_list = [lemmatize_stemming(token) for token in simple_preprocess(text)
            if token not in stopwords]
    return " ".join(processed_list) 
    
def display_model_stats(test, pred):
    print('Accuracy Score : ' + str(accuracy_score(test,pred)))
    print('Precision Score : ' + str(precision_score(test,pred)))
    print('Recall Score : ' + str(recall_score(test,pred)))
    print('F1 Score : ' + str(f1_score(test,pred)))

    print('Confusion Matrix : \n' + str(confusion_matrix(test,pred)))


df = pd.DataFrame(["testing and delivering this person", "training", "helping", "delivering"], columns=["text"])
df["processed_text"] = df["text"].map(preprocess)
df["label"] = 1

# print(df["processed_text"])

X = df["processed_text"]
y = df["label"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Vectorizer
vectorizer = TfidfVectorizer(max_features=1500, ngram_range=(1, 3))

Xbase = vectorizer.fit_transform(X_train)
Xtest = vectorizer.transform(X_test)

# Model
model = LogisticRegression()

model.fit(Xbase, y_train)

predict = model.predict(Xtest)

display_model_stats(y_train, predict)