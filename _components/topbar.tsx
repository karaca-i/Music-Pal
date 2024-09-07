import { Github } from "./github";
import HomeButton from "./home-button";
import { Linkedin } from "./linkedin";
import SpotifyInfo from "./spotify-info";




export function Topbar(){


    return (
        <div className="topbar-div">
            <div className="left">
                <HomeButton></HomeButton>
            </div>

            <div className="mid">
                <SpotifyInfo></SpotifyInfo>
            </div>

            <div className="right">
                <Github></Github>
                <Linkedin></Linkedin>
            </div>
        </div>
    )
}