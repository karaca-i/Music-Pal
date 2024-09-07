import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request:NextRequest){

    try{
        const cookieStore = cookies();
        let token = cookieStore.get('spotify_access_token')?.value;
        const expiration = cookieStore.get('spotify_token_expiration')?.value;
    
        if (!token) {
            throw new Error('No access token found. Please log in.');
        }
    
        if (expiration && Date.now() > parseInt(expiration)) {
            // Token is expired, refresh it
            const refreshResponse = await fetch('/api/spotify-refresh-token');

            if (!refreshResponse.ok) {
            throw new Error('Failed to refresh access token.');
            }
    
            // Retrieve the new token from the cookies after refresh
            const refreshedToken = cookieStore.get('spotify_access_token')?.value;
    
            if (!refreshedToken) {
            throw new Error('Failed to retrieve refreshed access token.');
            }
    
            token = refreshedToken;
        }

        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      
          if (!response.ok) {
            console.log(response.status)
            throw new Error('Failed to fetch user profile');
          }
      
          const data = await response.json();
          return NextResponse.json({
            authorized: true,
            name: data.display_name,
            profilePic: data.images && data.images.length > 0 ? data.images[0].url : null,
            country: data.country,
          })


    }
    catch (error){
        console.error('spotify-user-info route error')
        return NextResponse.json({ authorized: false }, { status: 500 });
    }
}