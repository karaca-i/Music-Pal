

'use client';


import React, { useEffect, useState } from 'react';
import  Lottie  from 'lottie-react';
import Loading2 from '@/public/Loading2.json';
import { Topbar } from '@/_components/topbar';
import PopulatedText from '@/_components/text-populated';
import PopulateListButton from '@/_components/populate-list-button';
import { SpotifyTrackFunctional } from '@/_components/spotify-track-functional';


export default function PopulateClientComponent({ playlistId ,limit}:{
  playlistId: string;
  limit: number;
}) {
  /*

  */
  const [loading, setLoading] = useState(true);
  const [recommendedTracks, setRecommendedTracks] = useState<any>(); 
  const [excludedTracks,setExcludedTracks] = useState<string[]>([]); // array of track ids string

  useEffect(() => {
    async function populatePlaylists() {
      try {
        const response = await fetch(`/api/spotify-populate/${playlistId}?limit=${limit}`);
        if (!response.ok) {
          throw new Error('Failed to fetch recommendation tracks.');
        }

        const data = await response.json();
  

        setRecommendedTracks(data)
      } catch (err) {
        
      } finally {
        setLoading(false)
      }
    }
  
    populatePlaylists();
  }, [playlistId]);

  if (loading) {
    return (
        <div className='loading-div'>
          <Topbar></Topbar>
          
          <div className='lottie-div'>
              <Lottie animationData={Loading2} className='lottie-animation'></Lottie>
              <p className='loading-text'>
                  Creating new tracks...
              </p>
          </div>
        </div>
    )
  }

  // if track is already excluded, it will be included. If it is not, it will be excluded.
  const exclude_func = (track:any) => {
    if (excludedTracks.includes(track.id)) {
      setExcludedTracks(excludedTracks.filter((item) => item !== track.id))

    }
    else{
      setExcludedTracks([...excludedTracks, track.id])

    }
    
  };


  return (
    <div className='populate-div'>
        <Topbar></Topbar>

        {
          recommendedTracks ? <>
           
            <PopulatedText trackCount={recommendedTracks.length}></PopulatedText> 
            <div className='recommended-tracks-div'>
              {
                recommendedTracks.map((item: any) => {
                  return (
                    <SpotifyTrackFunctional key={item.id} track={item} exclude={() => exclude_func(item)}></SpotifyTrackFunctional>
                  )
                })
              }
            </div>
            
            <PopulateListButton data={recommendedTracks.filter((track:any)=>{
              return !excludedTracks?.includes(track.id)
            }).map((track:any)=> track.id)} playlistId={playlistId}></PopulateListButton>
          </>
          : 'Loading...'
        }
    </div>
  );
}
