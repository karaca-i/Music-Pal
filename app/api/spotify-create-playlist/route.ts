

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createPlaylistsFromData, getSpotifyPlaylists } from '@/app/lib/spotifyTools';

interface Playlist {
    name: string;
    id: string;
    tracks: {
      total: number;
    };
    images: Array<{ url: string }>;
  }


export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Retrieve the Spotify access token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get('spotify_access_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No access token found. Please log in.' }, { status: 401 });
    }

    const all_playlists: Playlist[] | null = await getSpotifyPlaylists();

    const playlist_map = new Map<string,string>(); // name, id 
        all_playlists?.forEach((item)=>{
        const pl_name = item.name;
        const pl_id = item.id;
        playlist_map.set(pl_name,pl_id);
    })

    // DATA : {playlist_id : [ track ids],  ...}
    await createPlaylistsFromData(data, playlist_map);

    return NextResponse.json({ message: 'Playlists created successfully' });

  } catch (error) {
    //console.error('Error fetching tracks:', error);
    return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 });
  }
}
