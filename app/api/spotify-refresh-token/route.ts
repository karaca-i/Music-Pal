
import { cookies } from 'next/headers';

import { NextRequest, NextResponse } from 'next/server';
import querystring from 'querystring';

export async function GET(request: NextRequest) {

  const cookieStore = cookies();
  const refreshToken = cookieStore.get('spotify_refresh_token')?.value;

  if (!refreshToken) {
    return NextResponse.redirect('/?error=no_refresh_token');
  }

  const authOptions = {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  };

  const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
  const data = await response.json();

  if (response.ok) {
    const nextResponse = NextResponse.json({ access_token: data.access_token });

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
    return NextResponse.redirect('/?error=failed_to_refresh_token');
  }
}
