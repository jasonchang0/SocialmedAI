import nltk
import random
from nltk.classify.scikitlearn import SklearnClassifier
import pickle
from sklearn.naive_bayes import MultinomialNB, BernoulliNB
from sklearn.linear_model import LogisticRegression, SGDClassifier
from sklearn.svm import SVC, LinearSVC, NuSVC
from nltk.classify import ClassifierI
from statistics import mode
from nltk.tokenize import word_tokenize


class VoteClassifier(ClassifierI):
    def __init__(self, *classifiers):
        self._classifiers = classifiers

    def classify(self, features):
        votes = []
        for c in self._classifiers:
            v = c.classify(features)
            votes.append(v)
        return mode(votes)

    def confidence(self, features):
        votes = []
        for c in self._classifiers:
            v = c.classify(features)
            votes.append(v)

        choice_votes = votes.count(mode(votes))
        conf = choice_votes / len(votes)
        return conf


dir = '/Users/jasonchang/Desktop/PycharmProjects/natural-language-processing/pickled_algorithms/'

documents_file = open('documents.pickle', 'rb')
documents = pickle.load(documents_file)
documents_file.close()

word_features_file = open('word_features.pickle', 'rb')
word_features = pickle.load(word_features_file)
word_features_file.close()


def find_features(words):
    # words = word_tokenize(document)
    features = {}
    for w in word_features:
        features[w] = (w in words)

    return features


feature_sets_file = open('feature_sets.pickle', 'rb')
feature_sets = pickle.load(feature_sets_file)
feature_sets_file.close()

random.shuffle(feature_sets)
print(len(feature_sets))

testing_set = feature_sets[10000:]
training_set = feature_sets[:10000]

open_file = open(dir + 'naivebayes_sentence.pickle', 'rb')
classifier = pickle.load(open_file)
open_file.close()

open_file = open(dir + 'MNB_classifier.pickle', 'rb')
MNB_classifier = pickle.load(open_file)
open_file.close()

open_file = open(dir + 'BernoulliNB_classifier.pickle', 'rb')
BernoulliNB_classifier = pickle.load(open_file)
open_file.close()

open_file = open(dir + 'LogisticRegression_classifier.pickle', 'rb')
LogisticRegression_classifier = pickle.load(open_file)
open_file.close()

open_file = open(dir + 'SGDC_classifier.pickle', 'rb')
SGDC_classifier = pickle.load(open_file)
open_file.close()

open_file = open(dir + 'LinearSVC_classifier.pickle', 'rb')
LinearSVC_classifier = pickle.load(open_file)
open_file.close()

open_file = open(dir + 'NuSVC_classifier.pickle', 'rb')
NuSVC_classifier = pickle.load(open_file)
open_file.close()

voted_classifier = VoteClassifier(
    classifier,
    MNB_classifier,
    BernoulliNB_classifier,
    LogisticRegression_classifier,
    SGDC_classifier,
    LinearSVC_classifier,
    NuSVC_classifier)


def sentiment(words):
    feats = find_features(words)
    return voted_classifier.classify(feats), voted_classifier.confidence(feats)









