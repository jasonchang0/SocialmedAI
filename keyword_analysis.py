import pandas as pd
import numpy as np
import scipy as sp
import statistics
from nltk.tokenize import word_tokenize
import pickle
import sentiment_module as s_mod


def Merge(dict1, dict2):
    for key in dict2:
        if key in dict1:
            lst = [dict1[key], dict2[key]]

            dict1[key] = statistics.mean(lst)
            # dict1[key] = reduce(lambda x, y: x + y, lst) / len(lst)

            continue

        dict1[key] = dict2[key]

    return dict1


class Profile:
    def __init__(self, posts, username=None):
        self._username = username
        self._posts = posts
        self._df = None

        hashGlossary, self._hashRank = self.keyword_analysis(posts, factor='text')
        imageGlossary, self._imageRank = self.keyword_analysis(posts, factor='clarifai_result')

        # combinedGlossary = hashGlossary + imageGlossary
        combinedGlossary = Merge(hashGlossary, imageGlossary)

        self._combinedRank = sorted(combinedGlossary.items(), reverse=True, key=lambda kv: kv[1])
        self._combinedRank = np.array(self._combinedRank)[:, 0]

    def get_username(self):
        return self._username

    def get_posts(self):
        return self._posts

    def get_iRank(self):
        return self._imageRank

    def get_hRank(self):
        return self._hashRank

    def get_cRank(self):
        return self._combinedRank

    def keyword_analysis(self, data, factor='text'):
        if self._df is None:
            self._df = pd.DataFrame(columns=['likes', 'image_url', 'clarifai_result', 'text'])
            like_array = []

            for _ in data:
                image = data[_]
                like_array += [image['likes']]

            like_array = np.array(like_array)
            print(like_array)

            self._std = np.std(like_array)
            self._range = np.max(like_array) - np.min(like_array)
            self._mean_likes = np.mean(like_array)

        for image in data:
            weighted_glossary = {}
            row = data[image]
            inf = row['likes'] - self._mean_likes

            if factor == 'text':
                word_lst = word_tokenize(row[factor])
                word_lst = [x for x in word_lst if x != '#' and x != '@']
            else:
                word_lst = row[factor]

            if isinstance(word_lst, str):
                word_lst = [word_lst]

            for word in word_lst:
                if word not in weighted_glossary:
                    weighted_glossary[word] = inf
                    continue

                weighted_glossary[word] += inf

            new_row = pd.DataFrame({key: row[key] for key in self._df.columns})
            self._df.append(new_row, ignore_index=False)

        sorted_glossary = sorted(weighted_glossary.items(), reverse=True, key=lambda kv: kv[1])

        return weighted_glossary, np.array(sorted_glossary)[:, 0]

    def evaluate_posts(self):
        output = {key: {'score': 0, 'success': False, 'misalignment': False, 'keywords': []} for key in
                  self.get_posts()}

        for key in self.get_posts():
            print(key)

            post = self.get_posts()[key]
            print(post)
            print(self._mean_likes)

            score = post['likes'] - self._mean_likes
            print(score)

            success = (post['likes'] - self._mean_likes) > 0
            print(success)

            text_keywords = [key for key in self.get_cRank() if key in post['text']]
            image_keywords = [key for key in self.get_cRank() if key in post['clarifai_result']]

            z_scores = (post['likes'] - self._mean_likes) / self._std
            print(z_scores)

            try:
                score = sp.stats.norm.cdf(z_scores)
                # score = sp.stats.norm.sf(abs(z_scores)) * 2
                print(score)

                score = int((score - 0.5) * 100 // 5)

            except ValueError as e:
                print(z_scores)
                print(post['likes'])
                print(self._mean_likes)
                print(self._std)

            image_sentiment, image_confidence = s_mod.sentiment(post['clarifai_result'])
            text_sentiment, text_confidence = s_mod.sentiment(post['text'])

            print('Image Confidence: {}'.format(image_confidence))
            print('Text Confidence: {}'.format(text_confidence))

            misaligned = image_sentiment == text_sentiment

            output[key] = {'score': score, 'success': success, 'misalignment': misaligned,
                           'image_keywords': image_keywords, 'text_keywords': text_keywords,
                           'image_url': post['image_url'], 'likes': post['likes']}
            print(output[key])

        return output


open_file = open('./userdata.pickle', 'rb')

userdata = pickle.load(open_file)
open_file.close()

user = Profile(posts=userdata)

print(user.get_hRank()[:10])
print(user.get_iRank()[:10])

print(user.evaluate_posts())







