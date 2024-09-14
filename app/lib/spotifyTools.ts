import { cookies } from "next/headers";
import { NextResponse } from "next/server";


interface Playlist {
    name: string;
    id: string;
    tracks: {
      total: number;
    };
    images: Array<{ url: string }>;
  }

  type User = {
    name: string;
}

  interface Track {
    id: string;
    name: string;
    artists: Array<{ name: string }>;
    album: {
      images: Array<{ url: string }>;
    };
  }

  interface AudioFeatures{
    id: string,
    duration_ms: number;
    danceability: number;
    energy: number;
    loudness: number;
    speechiness: number;
    acousticness: number;
    instrumentalness: number;
    liveness: number;
    valence: number;
    tempo: number;
}

export async function LoginTool(email: string, password: string) {
  const backendUrl = 'http://127.0.0.1:4000';
  const response = await fetch(backendUrl + '/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
    credentials: 'include', // Ensures cookies from backend are included in the response
  });

  if (response.ok) {
    // No need to manually set the JWT token. It's already stored as an HTTP-only cookie by the backend.
    const data = await response.json();

  } else {
    // Handle login error (e.g., incorrect credentials)
    console.log('Login failed');

  }
}

export async function UserTool({func}:{func: any}) {
  const backendUrl = 'http://127.0.0.1:4000';
  const response = await fetch(backendUrl + '/api/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Ensures cookies from backend are included in the response
  });

  if (response.ok) {
    // No need to manually set the JWT token. It's already stored as an HTTP-only cookie by the backend.
    const data = await response.json();
    func(data);
  } else {
    // Handle login error (e.g., incorrect credentials)
    console.log('Login failed');
    func(null)
  }
}

export async function getUserMatchScores(playlistId: string,id:number) {
    try {
      

      const cookieStore = cookies();
      let token = cookieStore.get('spotify_access_token')?.value;
      const expiration = cookieStore.get('spotify_token_expiration')?.value;
  
      if (!token) {
        throw new Error('No access token found. Please log in.');
      }
  
      if (expiration && Date.now() > parseInt(expiration)) {
        // Token is expired, refresh it
        const refreshResponse = await fetch('/api/refresh-token');
        if (!refreshResponse.ok) {
          throw new Error('Failed to refresh access token.');
        }
  
        // Retrieve the new token from the cookies after refresh
        const refreshedToken = cookieStore.get('spotify_access_token')?.value;
  
        if (!refreshedToken) {
          throw new Error('Failed to retrieve refreshed access token.');
        }
  
        token = refreshedToken;
      }

      const tracks = await getSpotifyPlaylistTracks(playlistId);

      if (!tracks){
          throw new Error('Fail1');
      }
      
      const trackCount = tracks.length;
      const trackIds = tracks.map(track => track.id);
      const audioFeaturesArray = await Promise.all(trackIds.map(async (trackId) => {
          const audioFeatures = await getTrackAudioFeatures(trackId);
          return audioFeatures;
        }));

      const response = await fetch('http://127.0.0.1:5000/genre_scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tracks: audioFeaturesArray,
          track_count: trackCount,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze playlist');
      }
    
      const genre_scores = await response.json();

      // get the audio features for the playlist

      const go_response = await fetch('http://127.0.0.1:4000/api/user-match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          genre_scores: genre_scores,
          audio_features: audioFeaturesArray,
          id: Number(id),
        }),
      });

      if (!go_response.ok){
        throw new Error('Failed to fetch user match scores from go backend' + go_response.statusText);
      }

      // this data includes the sorted version of other users with match percentage
      const go_data = await go_response.json();
      //console.log(go_data)

      return go_data;

    } catch (error) {
      console.error('Failed to fetch user match scoresx:',error);
      return null;
    }
  }

export async function analyzePlaylist(trackData: any[], totalTracks: number){
    const response = await fetch('http://127.0.0.1:5000/analyze_playlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tracks: trackData,
        track_count: totalTracks,
      }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to analyze playlist');
    }
  
    const result = await response.json();
    return result;
}


export async function getTrackAudioFeatures(trackId: string): Promise<AudioFeatures | null>{

  try {
      const cookieStore = cookies();
      let token = cookieStore.get('spotify_access_token')?.value;
      const expiration = cookieStore.get('spotify_token_expiration')?.value;
  
      if (!token) {
        throw new Error('No access token found. Please log in.');
      }
  
      if (expiration && Date.now() > parseInt(expiration)) {
        // Token is expired, refresh it
        const refreshResponse = await fetch('/api/refresh-token');
        if (!refreshResponse.ok) {
          throw new Error('Failed to refresh access token.');
        }
  
        // Retrieve the new token from the cookies after refresh
        const refreshedToken = cookieStore.get('spotify_access_token')?.value;
  
        if (!refreshedToken) {
          throw new Error('Failed to retrieve refreshed access token.');
        }
  
        token = refreshedToken;
      }
 
      const response = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      
        if (!response.ok) {
          throw new Error('Failed to fetch audio features');
        }
      
        const audioFeatures = await response.json();
        return {
          id: trackId,
          duration_ms: audioFeatures.duration_ms,
          danceability: audioFeatures.danceability,
          energy: audioFeatures.energy,
          loudness: audioFeatures.loudness,
          speechiness: audioFeatures.speechiness,
          acousticness: audioFeatures.acousticness,
          instrumentalness: audioFeatures.instrumentalness,
          liveness: audioFeatures.liveness,
          valence: audioFeatures.valence,
          tempo: audioFeatures.tempo,
        };

    } catch (error) {
      console.error('getTrackAudioFeatures error:');
      return null;
    }
}
  

  export async function createPlaylistsFromData(result: Record<string, string[]>, playlist_map: Map<string,string>) {
    // Iterate over each entry in the result object
    for (const [playlistName, trackIds] of Object.entries(result)) {
      try {
        // Call the createSpotifyPlaylist function for each playlist
        if (playlist_map.has(playlistName)) {
          const pl_id = playlist_map.get(playlistName) as string;
          await addTracksToPlaylist(pl_id, trackIds);
  
          continue;
        }
        await createSpotifyPlaylist({ playlistName, trackIds });
  
      } catch (error) {
        console.error(`Failed to create playlist "${playlistName}":`, error);
      }
    }
  }

  export async function createSpotifyPlaylist({ playlistName, trackIds }: { playlistName: string, trackIds: any[] }) {
    try {
        const cookieStore = cookies();
        let token = cookieStore.get('spotify_access_token')?.value;
        const expiration = cookieStore.get('spotify_token_expiration')?.value;
    
        if (!token) {
          throw new Error('No access token found. Please log in.');
        }
    
        if (expiration && Date.now() > parseInt(expiration)) {
          // Token is expired, refresh it
          const refreshResponse = await fetch('/api/refresh-token');
          if (!refreshResponse.ok) {
            throw new Error('Failed to refresh access token.');
          }
    
          // Retrieve the new token from the cookies after refresh
          const refreshedToken = cookieStore.get('spotify_access_token')?.value;
    
          if (!refreshedToken) {
            throw new Error('Failed to retrieve refreshed access token.');
          }
    
          token = refreshedToken;
        }
  
        // Fetch user profile to get user ID
        const userResponse = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
  
        const userData = await userResponse.json();
        const userId = userData.id;
  
        // Create a new playlist
        const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: playlistName,
            description: 'Created by Music-Pal',
            public: false, // Set to true if you want the playlist to be public
          }),
        });
  
        if (!playlistResponse.ok) {
          throw new Error('Failed to create playlist');
        }
  
        const playlistData = await playlistResponse.json();
        const playlistId = playlistData.id;
  
        // Add tracks to the playlist
        const trackUris = trackIds.join(',').split(',').map(id => `spotify:track:${id.trim()}`);
  
        const addTracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uris: trackUris,
          }),
        });
  
        if (!addTracksResponse.ok) {
          throw new Error('Failed to add tracks to the playlist');
        }
  
      } catch (error) {
        console.error('Error creating playlist or adding tracks:', error);
      }
}


  export async function addTracksToPlaylist(playlistId: string, trackIds: string[]) {

    try{
      const cookieStore = cookies();
      let token = cookieStore.get('spotify_access_token')?.value;
      const expiration = cookieStore.get('spotify_token_expiration')?.value;
  
      if (!token) {
        throw new Error('No access token found. Please log in.');
      }
  
      if (expiration && Date.now() > parseInt(expiration)) {
        // Token is expired, refresh it
        const refreshResponse = await fetch('/api/refresh-token');
        if (!refreshResponse.ok) {
          throw new Error('Failed to refresh access token.');
        }
  
        // Retrieve the new token from the cookies after refresh
        const refreshedToken = cookieStore.get('spotify_access_token')?.value;
  
        if (!refreshedToken) {
          throw new Error('Failed to retrieve refreshed access token.');
        }
  
        token = refreshedToken;
      }
  
      const all_tracks_in_playlist = await getSpotifyPlaylistTracks(playlistId);
      const all_tracks_set = new Set<string>(); // name, id
  
      all_tracks_in_playlist?.forEach((item) => {
        const track_id = item.id;
        all_tracks_set.add(track_id);
      });
  
      //const trackUris = trackIds.map(id => `spotify:track:${id}`);
      const trackUris = trackIds.reduce((acc, id) => {
        if (!all_tracks_set.has(id)) {
          acc.push(`spotify:track:${id}`);
        }
        return acc;
      }, [] as string[])
    
      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uris: trackUris,
        }),
      });
    
      if (!response.ok) {
        throw new Error(`Failed to add tracks to playlist: ${response.statusText}`);
      }
    
      const data = await response.json();
      return data;
    }
    catch(error){
      console.error('Error fetching playlists:', error);
      return null;
    }
  }

export async function getSpotifyPlaylistTracks(playlistId: string): Promise<Track[] | null> {
  try {
    const cookieStore = cookies();
    let token = cookieStore.get('spotify_access_token')?.value;
    const expiration = cookieStore.get('spotify_token_expiration')?.value;

    if (!token) {
      throw new Error('No access token found. Please log in.');
    }

    if (expiration && Date.now() > parseInt(expiration)) {
      // Token is expired, refresh it
      const refreshResponse = await fetch('/api/refresh-token');
      if (!refreshResponse.ok) {
        throw new Error('Failed to refresh access token.');
      }

      // Retrieve the new token from the cookies after refresh
      const refreshedToken = cookieStore.get('spotify_access_token')?.value;

      if (!refreshedToken) {
        throw new Error('Failed to retrieve refreshed access token.');
      }

      token = refreshedToken;
    }

    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tracks');
    }

    const data = await response.json();
    return data.items.map((item: any) => ({
        id: item.track.id,
        name: item.track.name,
        artists: item.track.artists.map((artist: any) => ({ name: artist.name })),
        album: {
          images: item.track.album.images,
        },
      })) as Track[];
  } catch (error) {
    console.error('Error fetching tracks:', error);
    return null;
  }
}

  

export async function getSpotifyPlaylists(): Promise<Playlist[] | null> {
    try {
      const cookieStore = cookies();
      let token = cookieStore.get('spotify_access_token')?.value;
      const expiration = cookieStore.get('spotify_token_expiration')?.value;
  
      if (!token) {
        throw new Error('No access token found. Please log in.');
      }
  
      if (expiration && Date.now() > parseInt(expiration)) {
        // Token is expired, refresh it
        const refreshResponse = await fetch('/api/refresh-token');
        if (!refreshResponse.ok) {
          throw new Error('Failed to refresh access token.');
        }
  
        // Retrieve the new token from the cookies after refresh
        const refreshedToken = cookieStore.get('spotify_access_token')?.value;
  
        if (!refreshedToken) {
          throw new Error('Failed to retrieve refreshed access token.');
        }
  
        token = refreshedToken;
      }
  
      const response = await fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed in getSpotifyPlaylists');
      }
  
      const data = await response.json();
      return data.items as Playlist[];
    } catch (error) {
      console.error('Error in getSpotifyPlaylists:');
      return null;
    }
  }


export async function getSpotifyTracksByTrackIds(trackIds:string[]){

   const len = trackIds.length;

   for (let i=0; i<len; i+= 50){
    const trackIdsSlice = trackIds.slice(i, i+50);

    try {
        const cookieStore = cookies();
        let token = cookieStore.get('spotify_access_token')?.value;
        const expiration = cookieStore.get('spotify_token_expiration')?.value;
    
        if (!token) {
          throw new Error('No access token found. Please log in.');
        }
    
        if (expiration && Date.now() > parseInt(expiration)) {
          // Token is expired, refresh it
          const refreshResponse = await fetch('/api/refresh-token');
          if (!refreshResponse.ok) {
            throw new Error('Failed to refresh access token.');
          }
    
          // Retrieve the new token from the cookies after refresh
          const refreshedToken = cookieStore.get('spotify_access_token')?.value;
    
          if (!refreshedToken) {
            throw new Error('Failed to retrieve refreshed access token.');
          }
    
          token = refreshedToken;
        }
    
        const trackIdsQuery = trackIdsSlice.join(',');
  
        const response = await fetch(`https://api.spotify.com/v1/tracks?ids=${trackIdsQuery}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
    
        if (!response.ok) {
          throw new Error('Failed to fetch tracks');
        }
    
        const data = await response.json();
        return data.tracks.map((track: any) => ({
            id: track.id,
            name: track.name,
            artists: track.artists.map((artist: any) => artist.name).join(', '),
            image: track.album.images[0].url,
          }));

      } catch (error) {
        console.error('Error fetching tracks');
        return null;
      }
  }

}

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export async function getRecommendations(playlistId:string, limit:number) {
  try {
    const cookieStore = cookies();
    let token = cookieStore.get('spotify_access_token')?.value;
    const expiration = cookieStore.get('spotify_token_expiration')?.value;

    if (!token) {
      throw new Error('No access token found. Please log in.');
    }

    if (expiration && Date.now() > parseInt(expiration)) {
      // Token is expired, refresh it
      const refreshResponse = await fetch('/api/refresh-token');
      if (!refreshResponse.ok) {
        throw new Error('Failed to refresh access token.');
      }

      // Retrieve the new token from the cookies after refresh
      const refreshedToken = cookieStore.get('spotify_access_token')?.value;

      if (!refreshedToken) {
        throw new Error('Failed to retrieve refreshed access token.');
      }

      token = refreshedToken;
    }

    const tracks_of_user = await getSpotifyPlaylistTracks(playlistId)

    const track_ids_unshuffled = tracks_of_user?.map((item)=>{
      return item.id;
    }) // old code: slice(0,5)

    const track_ids = shuffleArray(track_ids_unshuffled || []).slice(0,5)
    
    // need seed_artist, seed_genres, seed_tracks for recommendation call
    const seed_artists_promises = track_ids?.map(async (id)=>{
      const response_in = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data_in = await response_in.json();
      //const artists_in = data_in.artists.map((artist: any) => artist.id).join(',');
      const artists_in = data_in.artists[0].id;
      
      return artists_in
    });


    const temp1 = seed_artists_promises ? await Promise.all(seed_artists_promises) : [];
    //const filtered = temp1.filter((item) => item !== '').slice(0,5);
    //const seed_artists = filtered.join(',');
    
    const seed_artists = temp1.slice(0,5).join(',');

    const seed_genres = 'classical' // test
    const seed_tracks = track_ids?.join(',')
    //const limit = 10;

    // make the call to get recommendations

    /*
    */
   const recommendation_response = await fetch(`https://api.spotify.com/v1/recommendations?limit=${limit}&seed_tracks=${seed_tracks}`,{
       headers: {
         Authorization: `Bearer ${token}`,
       }
     })


    if (!recommendation_response.ok) {
      throw new Error('Failed to fetch recommendations spotify api');
    }


    const recommendation_data = await recommendation_response.json();
    //const recommended_tracks = recommendation_data.tracks.map((item: any) => item.id);
    const recommended_tracks: Track[] = recommendation_data.tracks.map((item: any) => ({
      id: item.id,
      name: item.name,
      artists: item.artists.map((artist: any) => artist.name), // Extract artist names as strings
      img_url: item.album.images[0].url, // Use the first image as the track image
    }));
    

    return recommended_tracks
  }
 catch (error) {
    
    return undefined;
  }
}