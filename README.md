
# Music Pal

Since Spotify, one of the most popular music apps, doesn’t provide users with genre information (and it’s also unavailable through their API), large, disorganized playlists can sometimes become less enjoyable to listen to as a whole, even if the individual tracks are favorites. That's why offering a one-click solution to reorganize them by similarities is a great idea. The other two features—playlist population and user matching—came to mind after starting the project, as they also offer fun ways to enhance the music experience.

## Demo
https://youtu.be/q5MCEn0nC1I

## Usage
**1-Music Classification:** Connect your Spotify account, select a playlist, and let MusicPal automatically sort your songs into similar groups.

**2-Playlist Population:** Select a few tracks that capture your mood, and MusicPal will recommend songs to fill out a playlist. You can choose how many songs you want (10-50), and a new playlist will be created directly on your Spotify account.

**3-User Match:** View a list of users who have similar music tastes to you, see their match percentage, and explore their playlists. You can discover new music and connect with other users who enjoy the same kind of tunes.

## How it works
Music classification in MusicPal is powered by a dataset from Hugging Face, which contains over 100,000 Spotify tracks (available here). A custom model is trained using scikit-learn and is deployed via a simple Python API built with Flask. Using Spotify OAuth, the app exchanges access tokens to create and organize playlists on Spotify with a single click.

Playlist population works by selecting a few tracks (up to 5) and analyzing their audio features and genres, determined by the custom music classifier model. Based on this data, the app fetches track recommendations from the Spotify API to fill out the playlist.

The user matching feature leverages a cosine similarity algorithm in the Go backend. Audio features of each track in a user's playlist are sent to the backend, where the classifier model determines the genre. After genre matching, the cosine similarity is calculated between the audio features of each track to find users with similar music tastes.

## Used Tools and Languages.
<p align="left"> <a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="typescript" width="40" height="40"/> </a> <a href="https://golang.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/go/go-original.svg" alt="go" width="40" height="40"/> </a> <a href="https://www.mysql.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original-wordmark.svg" alt="mysql" width="40" height="40"/> </a> <a href="https://www.python.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" alt="python" width="40" height="40"/> </a> <a href="https://reactjs.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" width="40" height="40"/> </a> <a href="https://scikit-learn.org/" target="_blank" rel="noreferrer"> <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg" alt="scikit_learn" width="40" height="40"/> </a>  </p>

Frontend: Next.js (TypeScript)  
Backend: Go (Database, JWT Authentication, User Matching), Python (Track Classification)  
Database: MySQL  
Authentication: Spotify OAuth, JWT-based authentication  
Music API: Spotify API to get Audio Features  
Machine Learning: scikit-learn (Python) - Random forest classifier  

## Audio Features
Audio Features | danceability | energy | loudness | speechiness | acousticness | insturmentalness | liveness | valence | tempo |
--- | --- | --- | --- |--- |--- |--- |--- |--- |--- |
Values | 0.63 | 0.002133 | 0.536329 | 0.3214 | 0.00056 | 0.7897 | 0.9965 | 0.675 | 0.00045 |

