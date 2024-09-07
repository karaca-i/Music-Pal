

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { addTracksToPlaylist } from '@/app/lib/spotifyTools';

export async function POST(request: NextRequest ,{ params }: { params: { playlistId: string } }) {
  try {
    const result = await request.json();
    const { playlistId } = params;

    // Retrieve the Spotify access token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get('spotify_access_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No access token found. Please log in.' }, { status: 401 });
    }

    await addTracksToPlaylist(playlistId, result);

    return NextResponse.json({ message: 'Playlists populated successfully' });

  } catch (error) {
    //console.error('Error fetching tracks:', error);
    return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 });
  }
}
