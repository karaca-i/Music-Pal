import { Topbar } from "@/_components/topbar";
import { getSpotifyPlaylists } from "../lib/spotifyTools";
import AnalyzeText from "@/_components/text-analyze";
import { SpotifyPlaylist } from "@/_components/spotify-playlist";

export default async function AnalyzePage() {
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
        <div className= "analyze-wrapper">
            <Topbar></Topbar>
            <AnalyzeText></AnalyzeText>
            <div className='playlists'>
                {playlists.map((playlist, index) => (
                    <SpotifyPlaylist 
                    key={playlist.id} 
                    playlistNo={index} 
                    playlistName={playlist.name}
                    playlistId={playlist.id}
                    images={playlist.images} 
                    />
                ))}
            </div> 
        </div>
    )
}

