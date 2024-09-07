'use client';
import { useState } from 'react';
import TrackHover from './track-hover';

const colorPalettes = [
    // Palette 1448
    '#999999', '#777777', '#555555', '#333333', '#121217',
  ];


export function SpotifyTrackFunctional({track, exclude}:{track: any, exclude: () => void}) {

    const track_name = track.name.length > 20 ?  `${track.name.substring(0, 20)}...` : track.name
    const temp = track.artists.join(', ')
    const artist_names = temp.length < track_name.length * 2 ? temp : `${temp.substring(0, track_name.length * 2 - 4)}...`

    const [bgColor, setBgColor] = useState<string>('#121217')
   const handleClick =()=>{
     exclude()
    setBgColor((oldColor)=>{
        return oldColor === '#121217' ? '#791313' : '#121217'
    })

   }

  return (
    <div className='spotify-track-div'>

        <div className='top-div' onClick={handleClick} style={{backgroundColor:bgColor}}>

            <div className='img-div'>
                <img className='track-img' src={`${track.img_url}`} style={{backgroundColor:bgColor}}></img>
            </div>

            <div className='name-div'>
                <p>
                    {track_name}
                </p>
            </div>


        </div>

        <div className='bot-div'>
            <div className='artist-div'>
                <p>
                    {artist_names}
                </p>
            </div>
        </div>

        <div className='track-hover-outer'>
            <TrackHover track={track}></TrackHover>
        </div>
    </div>
  )
}
