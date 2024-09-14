import spotipy
from spotipy.oauth2 import SpotifyOAuth
from flask_cors import CORS
import time

import os
import pickle
import numpy as np
from flask import Flask, request, redirect, session, url_for,jsonify

app = Flask(__name__)
CORS(app)
app.secret_key=os.getenv('GO_SECRET_KEY')


import pickle
import numpy as np

with open('model.bin', 'rb') as f_in:
    dv, rf, classes = pickle.load(f_in)

def predict_genre(audio_features):

    track_dict = audio_features

    X = dv.transform([track_dict])

    y_pred = rf.predict_proba(X)

    genre_index = np.argmax(y_pred)

    predicted_genre = classes[genre_index]
    
    return predicted_genre


@app.route('/analyze_playlist', methods=['POST'])
def analyze_playlist():
    data = request.get_json()
    track_count = data['track_count']
    tracks = data['tracks']

    genres = {}
    
    for idx, track in enumerate(tracks):
        #print(f'Analyzing track {idx+1}/{track_count}')
        if track is None:
            continue
        
        track_audio_features = track.copy()
        del track_audio_features['id']

        predicted_genre = predict_genre(track_audio_features)
 
        if predicted_genre not in genres:
            genres[predicted_genre] = []
        
        genres[predicted_genre].append(track['id'])

    return jsonify(genres)


@app.route('/genre_scores', methods=['POST'])
def genre_scores():
    data = request.get_json()
    track_count = data['track_count']
    tracks = data['tracks']

    genres = {} # genre and counts
    
    for idx, track in enumerate(tracks):
        if track is None:
            continue
        
        track_audio_features = track.copy()
        del track_audio_features['id']

        predicted_genre = predict_genre(track_audio_features)
 
        if predicted_genre not in genres:
            genres[predicted_genre] = 1
        else:
            genres[predicted_genre] += 1

    return jsonify(genres)


if __name__ == '__main__':  
    app.run(port=5000,debug=True)

