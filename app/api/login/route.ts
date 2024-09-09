'server-only';

import { NextRequest, NextResponse } from "next/server";



export async function POST(request: NextRequest) {
    try {
      const data = await request.json();
        console.log(data)
        const backendUrl = 'http://127.0.0.1:4000';
        // Call the backend API to login the user
        const response = await fetch(backendUrl + '/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: data.email,
              password: data.password,
            }),
            credentials: 'include', // Ensures cookies from backend are included in the response
          });
        if (response.ok) {
          const nextResp = NextResponse.json({ status: 200 });

          return nextResp
        }

        return NextResponse.json({ error: 'Login failedd' }, { status: 401 });
  
    } catch (error) {
      console.error('Error fetching tracks:', error);
      return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 });
    }
  }