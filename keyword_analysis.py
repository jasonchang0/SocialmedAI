import pandas as pd
import numpy as np
from nltk.tokenize import word_tokenize


def keyword_analysis(data, factor='text'):
    weighted_glossary = {}

    for image in data:
        df = pd.DataFrame.from_dict(data[image])

        mean_likes = np.mean(np.array(df.likes))

        for _ in df.index.values:
            row = df.loc[_]
            inf = row.likes - mean_likes

            if factor == 'text':
                word_lst = word_tokenize(row[factor])
                word_lst = [x for x in word_lst if x != '#' and x != '@']
            else:
                word_lst = row[factor]

            for word in word_lst:
                if word not in weighted_glossary:
                    weighted_glossary[word] = inf
                    continue

                weighted_glossary[word] += inf

    sorted_glossary = sorted(weighted_glossary.items(), reverse=True, key=lambda kv: kv[1])

    return np.array(sorted_glossary)[:, 0]


class Profile:
    def __init__(self, username, posts):
        self._username = username
        self._posts = posts
        self._hashRank = keyword_analysis(posts, factor='text')
        self._imageRank = keyword_analysis(posts, factor='image')

    def get_iRank(self):
        return self._imageRank

    def get_hRank(self):
        return self._hashRank

    def evaluate_posts(self):
        output = {key: {'score': 0, 'success': False, 'misalignment':False, 'keywords': []} for key in self._posts}

        for post in self._posts:








