
import { NextResponse } from 'next/server';

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const nextResponse = NextResponse.redirect(`${baseUrl}`);

  // Clear the Spotify-related cookies
  nextResponse.cookies.delete('spotify_access_token');
  nextResponse.cookies.delete('spotify_refresh_token');
  nextResponse.cookies.delete('spotify_token_expiration');

  return nextResponse;
}
