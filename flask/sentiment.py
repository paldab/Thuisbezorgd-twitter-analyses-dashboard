# from utils.stopwords import dutch_stopwords as stopwords
from sklearn.cluster import KMeans
from sklearn.feature_extraction.text import HashingVectorizer
from nltk.stem import WordNetLemmatizer, SnowballStemmer
from wordcloud import WordCloud
from gensim.utils import simple_preprocess
from textblob import TextBlob
import wordcloud
import nltk
import pandas as pd
import gensim

nltk.download('wordnet')
stemmer = SnowballStemmer("dutch")
stopwords = stopwords()

def lemmatize_stemming(text):
    return stemmer.stem(WordNetLemmatizer().lemmatize(text, pos="v"))

def preprocess(text):
    return [lemmatize_stemming(token) for token in simple_preprocess(text)
            if token not in stopwords and len(token) > 3]

# make a function that returns string instead of lost 
# preprocess_word
def getPolarity(text):
    blob = TextBlob(text).translate(from_lang="nl" ,to="en")
    return str(blob)

train_df = pd.read_parquet("sentiment/dutch-restaurant-reviews.parquet", engine="pyarrow")

train_df["text"] = train_df["reviewText"]
# remove stopwords
preprocess_data = train_df["text"].map(preprocess)

df = pd.DataFrame(train_df["text"])
df["sentiment"] = df["text"].apply(lambda x:getPolarity(x))
print(df["sentiment"])

# w2vec = gensim.models.Word2Vec(preprocess_data, vector_size=100,
#                                window=3, workers=6, epochs=3, min_count=1)
# w2vec = HashingVectorizer(ngram_range=(1, 3), preprocessor=preprocess)

# w_trans = w2vec.fit_transform(df["text"])
# kmeans = KMeans(n_clusters=2).fit(X=w2vec.wv.vectors)

# print(w2vec.wv.key_to_index)

# positive_cluster = kmeans.cluster_centers_[0]
# negative_cluster = kmeans.cluster_centers_[1]

# vector_df = pd.DataFrame(w2vec.wv.key_to_index.keys())
# print(vector_df.tail(20))

# print(w2vec.wv.similar_by_vector(positive_cluster, topn=50))
# print(w2vec.wv.similar_by_vector(negative_cluster, topn=50))

# positive_cluster_list = pd.DataFrame([words[0] for words in w2vec.wv.similar_by_vector(positive_cluster, topn=5000)])
# print(positive_cluster_list.head(100))



def stopwords():
    return [
    "aan", "aangaande", "aangezien", "achte", "achter",
    "achterna", "af", "afgelopen", "al", "aldaar", "aldus",
    "alhoewel", "alias", "alle", "allebei", "alleen",
    "alles", "als", "alsnog", "altijd", "altoos", "ander",
    "andere", "anders", "anderszins", "beetje", "behalve",
    "behoudens", "beide", "beiden", "ben", "beneden", "bent",
    "bepaald", "betreffende", "bij", "bijna", "bijv", "binnen",
    "binnenin", "blijkbaar", "blijken", "boven", "bovenal",
    "bovendien", "bovengenoemd", "bovenstaand", "bovenvermeld",
    "buiten", "bv", "daar", "daardoor", "daarheen", "daarin",
    "daarna", "daarnet", "daarom", "daarop", "daaruit", "daarvanlangs",
    "dan", "dat", "de", "deden", "deed", "der", "derde", "derhalve",
    "dertig", "deze", "dhr", "die", "dikwijls", "dit", "doch", "doe",
    "doen", "doet", "door", "doorgaand", "drie", "duizend", "dus",
    "echter", "een", "eens", "eer", "eerdat", "eerder", "eerlang", "eerst",
    "eerste", "eigen", "eigenlijk", "elk", "elke", "en", "enig", "enige",
    "enigszins", "enkel", "er", "erdoor", "erg", "ergens", "etc", "etcetera",
    "even", "eveneens", "evenwel", "gauw", "ge", "gedurende", "geen", "gehad",
    "gekund", "geleden", "gelijk", "gemoeten", "gemogen", "genoeg", "geweest",
    "gewoon", "gewoonweg", "haar", "haarzelf", "had", "hadden", "hare", "heb",
    "hebben", "hebt", "hedden", "heeft", "heel", "hem", "hemzelf", "hen",
    "het", "hetzelfde", "hier", "hierbeneden", "hierboven", "hierin",
    "hierna", "hierom", "hij", "hijzelf", "hoe", "hoewel", "honderd", "hun",
    "hunne", "ieder", "iedere", "iedereen", "iemand", "iets", "ik", "ikzelf",
    "in", "inderdaad", "inmiddels", "intussen", "inzake", "is", "ja", "je",
    "jezelf", "jij", "jijzelf", "jou", "jouw", "jouwe", "juist", "jullie",
    "kan", "klaar", "kon", "konden", "krachtens", "kun", "kunnen", "kunt",
    "laatst", "later", "liever", "lijken", "lijkt", "maak", "maakt", "maakte",
    "maakten", "maar", "mag", "maken", "me", "meer", "meest", "meestal", "men",
    "met", "mevr", "mezelf", "mij", "mijn", "mijnent", "mijner", "mijzelf",
    "minder", "miss", "misschien", "missen", "mits", "mocht", "mochten",
    "moest", "moesten", "moet", "moeten", "mogen", "mr", "mrs", "mw", "na",
    "naar", "nadat", "nam", "namelijk", "nee", "neem", "negen", "nemen",
    "nergens", "net", "niemand", "niet", "niets", "niks", "noch", "nochtans",
    "nog", "nogal", "nooit", "nu", "nv", "of", "ofschoon", "om", "omdat", "omhoog",
    "omlaag", "omstreeks", "omtrent", "omver", "ondanks", "onder", "ondertussen",
    "ongeveer", "ons", "onszelf", "onze", "onzeker", "ooit", "ook", "op", "opnieuw",
    "opzij", "over", "overal", "overeind", "overige", "overigens", "paar",
    "pas", "per", "precies", "recent", "redelijk", "reeds", "rond", "rondom",
    "samen", "sedert", "sinds", "sindsdien", "slechts", "sommige", "spoedig",
    "steeds", "tamelijk", "te", "tegen", "tegenover", "tenzij", "terwijl",
    "thans", "tien", "tiende", "tijdens", "tja", "toch", "toe", "toen", "toenmaals",
    "toenmalig", "tot", "totdat", "tussen", "twee", "tweede", "u", "uit", "uitgezonderd",
    "uw", "vaak", "vaakwat", "van", "vanaf", "vandaan", "vanuit", "vanwege", "veel",
    "veeleer", "veertig", "verder", "verscheidene", "verschillende", "vervolgens",
    "via", "vier", "vierde", "vijf", "vijfde", "vijftig", "vol", "volgend", "volgens",
    "voor", "vooraf", "vooral", "vooralsnog", "voorbij", "voordat", "voordezen",
    "voordien", "voorheen", "voorop", "voorts", "vooruit", "vrij", "vroeg", "waar",
    "waarom", "waarschijnlijk", "wanneer", "want", "waren", "was", "wat", "we", "wederom",
    "weer", "weg", "wegens", "weinig", "wel", "weldra", "welk", "welke", "werd", "werden",
    "werder", "wezen", "whatever", "wie", "wiens", "wier", "wij", "wijzelf", "wil",
    "wilden", "willen", "word", "worden", "wordt", "zal", "ze", "zei", "zeker", "zelf",
    "zelfde", "zelfs", "zes", "zeven", "zich", "zichzelf", "zij", "zijn", "zijne",
    "zijzelf", "zo", "zoals", "zodat", "zodra", "zonder", "zou", "zouden", "zowat",
    "zulk", "zulke", "zullen", "zult"
]
