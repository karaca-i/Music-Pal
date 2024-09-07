
import { NextRequest, NextResponse } from 'next/server';
import querystring from 'querystring';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'; // Ensure this is set to your app's base URL

  const authOptions = {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: querystring.stringify({
      code: code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  };

  const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
  const data = await response.json();

  if (response.ok) {
    const nextResponse = NextResponse.redirect(`${baseUrl}`);
    
    nextResponse.cookies.set('spotify_access_token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: data.expires_in,
      path: '/',
    });

    if (data.refresh_token) {
      nextResponse.cookies.set('spotify_refresh_token', data.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      });
    }
    const expirationTime = Date.now() + data.expires_in * 1000;
    
    nextResponse.cookies.set('spotify_token_expiration', expirationTime.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return nextResponse;
  } else {
    return NextResponse.redirect(`${baseUrl}/?error=invalid_token`);
  }
}
