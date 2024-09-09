

import { SpotifyPlaylist } from "@/_components/spotify-playlist";
import { getSpotifyPlaylists } from "../lib/spotifyTools";
import MatchClientComponent from "./client-component";



export default async function MatchPage(){

    /*
    */
    const playlists = await getSpotifyPlaylists();

    if (!playlists) {
        return (
          <div>
            <h1>Error</h1>
            <p>Could not retrieve playlists. Please log in with spotify again or try later.</p>
          </div>
        );
    }

    return (
        <div className="analyze-wrapper">
            <MatchClientComponent playlists={playlists}></MatchClientComponent>
        </div>
    )
}