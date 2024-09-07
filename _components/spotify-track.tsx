'use client';
import { useState } from 'react';

const colorPalettes = [
    // Palette 1448
    '#999999', '#777777', '#555555', '#333333', '#121217',
  ];


/*
    id: track.id,
    name: track.name,
    artists: track.artists.map((artist: any) => artist.name).join(', '),
    image: track.album.images[0].url,
*/

export function SpotifyTrack({track,height}:{track: any,height:number}) {

  return (
    <div className='spotify-normal-track-div'>

        <div className='top-div'>

            <div className='img-div'>
                <img className='track-img' src={`${track.image}`}></img>
            </div>

            <div className='name-div'>
                <p>
                    {track.name}
                </p>
            </div>


        </div>

        <div className='bot-div'>
            <div className='artist-div'>
                <p>
                    {track.artists}
                </p>
            </div>
        </div>
    </div>
  )
}
