
import { Feature } from "@/_components/feature";
import { Login } from "@/_components/login";
import { MainAbout } from "@/_components/main-about";
import { SignUp } from "@/_components/sign-up";
import { Topbar } from "@/_components/topbar";
import { cookies } from "next/headers";

// TEST IMPORTS

export default function Home() {

  const cookieStore = cookies();
  const token = cookieStore.get('spotify_access_token')?.value;
  const testing = false;


  return (
    <>
      {
        !testing ? 
        <div className="homepage-wrapper">
          <Topbar></Topbar>
          <MainAbout></MainAbout>
          {
            token ? <Feature></Feature> : 
            <div className="spotify-access-login">
              <h1>No access token found</h1>
              <p>Please login to access your Spotify data.</p>

              <div className="spotify-button-div">
                <a href="/api/spotify-login" className="spotify-a">
                  <img src='spotify-icon.png' className="spotify-button-img"></img>
                  <span>Spotify Auth</span>
                </a>
              </div>
            </div>
          }
        </div>
        /* TESTING COMPONENTS */
        : 
        <>
          <Login></Login>
          <SignUp></SignUp>
        </>
      }
    </> 
  )
}


