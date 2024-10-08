'use client';

import { SpotifyPlaylist } from "@/_components/spotify-playlist";
import IdentityText from "@/_components/text-identity-list";
import { Topbar2 } from "@/_components/topbar2";
import { setDefaultAutoSelectFamily } from "net";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type User = {
    name: string;
    id: number;
}

export default function MatchClientComponent({playlists}:{playlists: any}){

    const [distances, setDistances] = useState([]);
    const [data, setData] = useState({});
    const[user, setUser] = useState<User|null>(null);
    const router = useRouter()

    /*
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`/api/user-match/7iLvPoXXSgpKCAsR7CdY9t`);
            const data = await response.json();
            setData(data);
        }
        fetchData();
    }, []); 
    */
   
   return (
       <>
            <Topbar2 func={(arg:User|null) => {setUser(arg)}}></Topbar2>
            {
                user ?
                <>
                    <IdentityText></IdentityText>
                    <div className='playlists'>
                        {playlists.map((playlist:any, index:any) => (
                            <SpotifyPlaylist 
                            key={playlist.id} 
                            playlistNo={index} 
                            playlistName={playlist.name}
                            playlistId={playlist.id}
                            images={playlist.images} 
                            href_={`/match/${playlist.id}?id=${user.id}`}
                            />
                        ))}
                    </div> 
                </> :
                <>
                    <h1>You must be logged in to use this feature.</h1>
                </>
            }
        </>
    )
}