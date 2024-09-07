import React from 'react'

export default function TrackHover({track}:{track: any}) {
  return (
    <div className='track-hover-div'>
      <div className='hover-img-div'>
        <img className='album-img' src={track.img_url}></img>
      </div>
      <div className='th-name-div'>
        <p>
            <strong>Track Name:</strong> {track.name}
        </p>
      </div>
      <div className='th-artist-div'>
        <strong>Artist(s):</strong> {track.artists}
      </div>
    </div>
  )
}
