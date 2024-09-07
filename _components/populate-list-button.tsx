'use client';

import React, { useState } from 'react';


interface Track { // this is data
    id: string;
    name: string;
    artists: string[];
    img_url: string;
  }

export default function PopulateListButton({data,playlistId}:{data:any,playlistId:string}) {

  const [loading, setLoading] = useState(false);



  const handleClick = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/spotify-populate/final/${playlistId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Send the result data in the body
      });

      if (!response.ok) {
        throw new Error('Failed to populate list');
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

        <div className='img-div'>
            <img src='/populate-button-icon.png' className='img2'></img>
        </div>
        <p className='button-text'>
            {loading ? 'Populating...' : 'Populate'}
        </p>
      </a>
    </div>
  );
}
