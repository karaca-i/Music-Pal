'use client';
import { useEffect, useState } from "react";
import { Github } from "./github";
import HomeButton from "./home-button";
import { Linkedin } from "./linkedin";
import { Login } from "./login";
import { SignUp } from "./sign-up";
import SpotifyInfo from "./spotify-info";
import { useRouter } from "next/navigation";
import { AboutMe } from "./about-me";


type User = {
    name: string;
}

export function Topbar(){

    const[user, setUser] = useState<User|null>(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        setLoading(true);

        const fetchData = async () => {
            const response = await fetch('http://127.0.0.1:4000/api/user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                
            });

            if(response.ok){
                const data = await response.json();

                setUser(data);
            }
            else{
                const data = await response.json();
 
                setUser(null);
            }

            setLoading(false);
        }
     fetchData();
        
    },[]);

    const handleLogout = async () => {
        const response = await fetch('http://127.0.0.1:4000/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (response.ok) {
            console.log('Logged out');
        }
    }

    return (
        <div className="topbar-div">
            <div className="left">
                <HomeButton></HomeButton>
                 {  
                    loading ? <></> :
                    user ? 
                    <div className="logged-in-user-outer-div flex-col-ja-c-c">
                        <div className="logged-in-user flex-row-ja-c-c">
                            <img className="user-status" src="/green-dot.png"></img>
                            <p>{user.name}</p>
                        </div>

                        <div className='bot-div'>
                            <a className='logout-button flex-row-ja-c-c' onClick={handleLogout} href="/">
                                <p>Logout</p>
                            </a>
                        </div>
                    </div>
                    :
                    <>
                        <Login></Login>
                        <SignUp></SignUp>
                    </>
                 }
            </div>

            <div className="mid">
                <SpotifyInfo></SpotifyInfo>
            </div>

            <div className="right">
                <AboutMe></AboutMe>
                <Github></Github>
                <Linkedin></Linkedin>
            </div>
        </div>
    )
}