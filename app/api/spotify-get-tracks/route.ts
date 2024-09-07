import { getSpotifyTracksByTrackIds } from "@/app/lib/spotifyTools";
import { NextRequest, NextResponse } from "next/server";




export async function POST(request:NextRequest){

    try{
        const trackIds:string[] = await request.json();
        
        const tracks = await getSpotifyTracksByTrackIds(trackIds)
        //console.log(tracks)

        return NextResponse.json(tracks,{status:200})
    }
    catch(error){
        console.log('spotify-get-tracks api error')
        return NextResponse.json({status:500})
    }
}