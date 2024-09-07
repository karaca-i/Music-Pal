import { getRecommendations } from '@/app/lib/spotifyTools';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(request: NextRequest, { params}: { params: { playlistId: string } }) {
  try {
    const { playlistId } = params;

    const {searchParams} = new URL(request.url);

    const limit_ = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string,10) : 25;
    const recommended_tracks = await getRecommendations(playlistId,limit_);

    return NextResponse.json(recommended_tracks);

  } catch (error) {
    console.error('Error fetching tracks in route:');
    return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 });
  }
}