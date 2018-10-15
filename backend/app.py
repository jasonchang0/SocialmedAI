from flask import Flask
from flask_cors import CORS
from flask import request, jsonify
import json
import pickle
import random

import instaloader
from instaloader import Profile
from clarifai.rest import ClarifaiApp
from clarifai.rest import Image as ClImage

import machine_learning.keyword_analysis as ml

# Testing machine_learning
# open_file = open('./machine_learning/userdata.pickle', 'rb')
# userdata = pickle.load(open_file)
# open_file.close()
# user = ml.Profile(posts=userdata)
# print(user.get_hRank()[:10])
# print(user.get_iRank()[:10])
# exit(1)

app = Flask(__name__)
cla_app = ClarifaiApp(api_key='f9c954e11695463180ee7969993497af')
model = cla_app.models.get('general-v1.3')

preset_data = ['jocho5899', 'noahfiner', 'jas0nchan9', 'uofmichigan', 'erictheastrojunkie',
               'lilpump', 'kimkardashian', 'ucberkeleyofficial', 'illinois1867', 'instagram']


@app.route('/analyze/<username>')
def analyze(username):
    global preset_data

    if username in preset_data:
        string_form = ''.join(open('preset_data/' + username + '.txt', 'r').readlines())
        result = json.loads(string_form)
    else:
        L = instaloader.Instaloader()
        profile = Profile.from_username(L.context, username)
        ml_input_data = {}
        posts = []

        # Data prep for ML
        i = 0
        for post in profile.get_posts():
            posts.append(post)
            print(i)
            i = i + 1

            if i == 50:
                break

        i = 0
        ml_input_data = {}
        for post in posts:
            post_data = {}
            img = ClImage(url=post.url)
            post_data['clarifai_result'] = [x['name'] for x in model.predict([img])['outputs'][0]['data']['concepts']]
            post_data['image_url'] = post.url
            post_data['likes'] = post.likes
            post_data['text'] = post.caption
            post_data['comments'] = post.comments
            ml_input_data[post.mediaid] = post_data

            print(i)
            i = i + 1

            if i == 50:
                break

        # Get user data from ML module
        user = ml.Profile(posts=ml_input_data)

        result = {"image_analysis": user.evaluate_posts(),
                  "trending_hashtag": user.get_hRank(),
                  "trending_hashtag_image": user.get_iRank()}

        r = json.dumps(result)
        loaded_r = json.loads(r)

        print('')
        print('')
        print('result: ', result)
        print('')
        print('')

    json_result = jsonify(result)

    with open('./present_data/' + username + '.txt', 'w') as outfile:
        json.dump(json_result, outfile)
        preset_data.append(username)

    return jsonify(result)


CORS(app=app)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
