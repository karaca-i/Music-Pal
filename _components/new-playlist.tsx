'use client';

import { useEffect, useState } from "react";
import { SpotifyTrack } from "./spotify-track";

const playlist_colors = {
  'classical': 'F7BB7E',
  'country': 'E4953A',
  'r-n-b': 'E9881A',
  'dance': 'F7BB7E',
  'disco': 'F7BB7E',
  'electronic':'F7BB7E',
  'hip-hop':'F7BB7E',
  'house':'F7BB7E',
  'jazz':'F7BB7E',
  'metal':'F7BB7E',
  'pop':'F7BB7E',
  'rock':'F7BB7E',
}


export function NewPlaylist({playlistName,tracks}:{
    playlistName: string,
    tracks: string[],
}) {

    const [isExpanded, setIsExpanded] = useState(false);
    const [trackList, setTrackList] = useState([]);

    useEffect(()=>{
      const fetchTracks = async () => {
        const response = await fetch('/api/spotify-get-tracks',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(tracks),
        })

        if (!response.ok) {
          throw new Error('Failed to fetch trakcs in new-playlist.tsx');
        }

        const data = await response.json();
        setTrackList(data)
      }

      fetchTracks();

    },[])

    const img_src = `/${playlistName.toLowerCase()}-icon.png`
    const pl_name = playlistName.toUpperCase() === 'r-n-b' ? 'R & Blues' : playlistName.toUpperCase()

    const showTracks = () => {
      setIsExpanded(!isExpanded);
    };
    
  return (
    <div className='new-playlist-div' style={{ '--track-count': tracks.length } as React.CSSProperties}>
        
      <div className='top-div'  onClick={showTracks}>
      
        <div className='nn-name-div'>
            <p>
                {pl_name}
            </p>
        </div>

        <div className='new-playlist-img-div'>
            <img className='new-icon' src={img_src}></img>
        </div>

        <div className='track-count-div'>

            <p>
                ({tracks.length} tracks)
            </p>
        </div>

      </div>

      
      <div className={`bot-div ${isExpanded ? 'expanded' : ''}`}>
        {
          trackList.map((track_)=>{
            return (
              <SpotifyTrack track={track_} height={tracks.length}></SpotifyTrack>
            )
          })
        }
      </div>
 
    </div>
  )
}
