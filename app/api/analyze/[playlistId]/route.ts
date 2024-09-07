

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { analyzePlaylist, getSpotifyPlaylistTracks, getTrackAudioFeatures } from '@/app/lib/spotifyTools';


export async function GET(request: NextRequest, { params }: { params: { playlistId: string } }) {
  try {
    const { playlistId } = params;


    // Retrieve the Spotify access token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get('spotify_access_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No access token found. Please log in.' }, { status: 401 });
    }

    const tracks = await getSpotifyPlaylistTracks(playlistId);

    if (!tracks){
        return NextResponse.json({ error: 'Track fetch failed' }, { status: 401 });
    }
    
    const trackCount = tracks.length;
    const trackIds = tracks.map(track => track.id);
    const audioFeaturesArray = await Promise.all(trackIds.map(async (trackId) => {
        const audioFeatures = await getTrackAudioFeatures(trackId);
        return audioFeatures;
      }));

      const result = await analyzePlaylist(audioFeaturesArray,trackCount);

      //await createPlaylistsFromResult(result, playlist_map);

      return NextResponse.json(result);

  } catch (error) {
    console.error('Error fetching tracks in api/analyze/playlistId');
    return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 });
  }
}
