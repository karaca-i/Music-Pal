// app/playlist/[playlistId]/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import  Lottie  from 'lottie-react';
import Loading2 from '@/public/Loading2.json';
import { Topbar } from '@/_components/topbar';
import AnalyzedText from '@/_components/text-analyzed';
import { NewPlaylist } from '@/_components/new-playlist';
import CreateListButton from '@/_components/create-list-button';

export default function PlaylistsClientComponent({ playlistId }:{
    playlistId: string;
}) {
 
 const [loading, setLoading] = useState(true);
 const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function analyzePlaylists() {
      try {
        const response = await fetch(`/api/analyze/${playlistId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch tracksq');
        }

        const data = await response.json();

        setData(data)
      } catch (err) {
        
      } finally {
        setLoading(false);
      }
    }
  
    analyzePlaylists();
  }, [playlistId]);


  if (loading) {
    return (
        <div className='analyzed-loading-div'>
        <Topbar></Topbar>
        
        <div className='lottie-div'>
            <Lottie animationData={Loading2} className='lottie-animation'></Lottie>
            <p className='loading-text'>
                Analyzing your playlist...
            </p>
        </div>
    </div>
        
    )
  }

  return (
    <div className='loaded-div'>
        <Topbar></Topbar>
        <AnalyzedText></AnalyzedText>
        <div className='new-playlist-wrapper'>
            {
              data &&
              Object.entries(data).map(([key, trackIds]) => { // key is playlist name, trackIds is array of track ids
                      return (
                          <NewPlaylist playlistName={key} tracks={trackIds as string[]}></NewPlaylist>
                      )
              })
            }
        </div>
        <CreateListButton data={data}></CreateListButton>
    </div>
  );
}
