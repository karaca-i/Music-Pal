import { Topbar } from "@/_components/topbar";
import { getSpotifyPlaylists } from "../lib/spotifyTools";
import PopulateText from "@/_components/text-populate";
import LimitInput from "@/_components/limit-input";

export default async function PopulatePage() {
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

    /*
    <div className='get-limit-div'>
                <label>
                    <input className='limit-input'  type="text"
                            placeholder="Enter count">        
                    </input>
                </label>
            </div>
            */

    return (
        <div className= "populate-wrapper">
            <Topbar></Topbar>            
            <PopulateText></PopulateText>
            
            <LimitInput playlists={playlists}></LimitInput>

        </div>
    )
}

