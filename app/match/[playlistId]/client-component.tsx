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



export default function MatchedClientComponent({playlistId}:{playlistId: string}){

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const response = await fetch(`/api/user-match/${playlistId}`);
            const data = await response.json();
            setData(data);

            setLoading(false);
        }
        fetchData();
    }, []); 
    
    if (loading) {
        return (
            <div className='analyzed-loading-div'>
            <Topbar></Topbar>
            
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
            <Topbar></Topbar>
            <MatchedText></MatchedText>
            {
                data &&
                data.map((item:any) => {
                    return (
                        <div key={item.id}>
                            <p>{item.Name} : {item.Similarity}</p>
                        </div>
                    )
                })
            }
        </div>
    )
}