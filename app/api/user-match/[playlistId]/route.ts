import { analyzePlaylist, getSpotifyPlaylistTracks, getTrackAudioFeatures, getUserMatchScores } from "@/app/lib/spotifyTools";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest,{ params }: { params: { playlistId: string } }){
    try{
        const { playlistId } = params;

        /*
        */
        const data = await getUserMatchScores(playlistId);
        return NextResponse.json(data);
    }
    catch(err){
        console.error("user-match error")
        return NextResponse.json("Fail user-match route",{status:500});
    }
}