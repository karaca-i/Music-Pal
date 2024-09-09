'use client';

import { SpotifyPlaylist } from "@/_components/spotify-playlist";
import IdentityText from "@/_components/text-identity-list";
import MatchedText from "@/_components/text-matched";
import { Topbar } from "@/_components/topbar";
import { Topbar2 } from "@/_components/topbar2";
import Lottie from "lottie-react";
import { setDefaultAutoSelectFamily } from "net";
import { useEffect, useState } from "react";
import Loading2 from '@/public/Loading2.json';
import MatchedUsers from "@/_components/matched-users";
import { Topbar3 } from "@/_components/topbar3";



export default function MatchedClientComponent({playlistId,user_id}:{playlistId: string,user_id:number}){

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [taste, setTaste] = useState<any>(null);

    useEffect(() => {
        setLoading(true);

        const fetchData = async () => {
            const response = await fetch(`/api/user-match/${playlistId}`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({id:user_id}),
            }); // bunu post request yapıp buraya ID ver

            if (response.ok){
                const data = await response.json();
                setData(data.user_similarities);
                setTaste(data.taste);
            }

            setLoading(false);
        }
        fetchData();
    }, []); 
    
    if (loading) {
        return (
            <div className='analyzed-loading-div'>
            {taste && <Topbar3 taste={taste}></Topbar3>}
            
            <div className='lottie-div'>
                <Lottie animationData={Loading2} className='lottie-animation'></Lottie>
                <p className='loading-text'>
                    Matching with other users...
                </p>
            </div>
        </div>
            
        )
      }

    return (
        <div className="analyze-wrapper">
            <Topbar3 taste={taste}></Topbar3>
            <MatchedText></MatchedText>
            <MatchedUsers data={data}></MatchedUsers>
        </div>
    )
}