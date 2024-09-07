
'use client';
import React, { useState } from 'react';

export default function CreateListButton({data}:{data:any}) {

  const [loading, setLoading] = useState(false);



  const handleClick = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/spotify-create-playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Send the result data in the body
      });

      if (!response.ok) {
        throw new Error('Failed to create list');
      }

      // Handle success (e.g., show a success message, update UI, etc.)

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='create-list-button-div'>
      <a href='#' className='create-list-button' onClick={(e) => {
        e.preventDefault();
        handleClick();}} style={{pointerEvents: loading? 'none' : 'auto', cursor: loading ? 'default': 'pointer'}}>

        <div className='create-list-img-div'>
            <img src='/spotify-icon.png' className='img2'></img>
        </div>
        <p className='button-text'>
            {loading ? 'Creating...' : 'Generate Lists on Spotify'}
        </p>
      </a>
    </div>
  );
}
