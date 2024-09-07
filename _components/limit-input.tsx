'use client';

import { useState } from 'react';
import { SpotifyPlaylist } from './spotify-playlist';

export default function LimitInput({ playlists }: { playlists: Array<any> }) {
    const [limit, setLimit] = useState<number>(10); // Default limit to 10

    return (
        <>
            <div className='limit-input-div'>
                <label>
                    <input
                        className='limit-input'
                        type="number"
                        placeholder="Enter count"
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}
                        min={10}
                        max={50}
                    />
                </label>
            </div>

            <div className='spotify-playlist-list'>
                {playlists.map((playlist, index) => {
                    /*
                    const size = playlist.tracks.total;
                    if (size < 5 || size > 10){
                        return null;
                    }
                    */
                    return (
                        <SpotifyPlaylist 
                        key={playlist.id} 
                        playlistNo={index} 
                        playlistName={playlist.name}
                        playlistId={playlist.id}
                        images={playlist.images} 
                        href_={`/populate/${playlist.id}?limit=${limit}`}
                        />
                    )
                }).filter((item) => item != null)}
            </div> 
        </>
    );
}