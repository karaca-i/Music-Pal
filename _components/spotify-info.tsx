'use client'

import { useEffect, useState } from 'react';

export default function SpotifyInfo() {

    const [authorized,setAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const [country, setCountry] = useState('');

    const textColor = loading ? 'white' : authorized ? 'white' : '#F06969';

    useEffect(() => {
        setLoading(true)
        async function checkAuth() {
            try {
                const response = await fetch('/api/spotify-user-info');
                if (!response.ok) {
                    throw new Error('failed to fetch spotify-user-info');
                }

                const data = await response.json();

                setAuthorized(data.authorized)
                setProfilePic(data.profilePic)
                setUserName(data.name)
                setCountry(data.country)
            } catch (err) {
                console.error(err);
            }
            finally{
                setLoading(false);
            }
        }

        checkAuth();
    }, []);
    

  return (
    <div className='spotify-info-outer-div'>
        <div className="spotify-info-div">
            {
                loading ? <div className='spotify-img-div'>
                <img className='spotify-img' src='/spotify-icon.png'></img>
            </div> : authorized ?
                <div className='spotify-img-div'>
                    <img className='spotify-img' src='/spotify-icon.png'></img>
                </div>
                : <></>
            }
            <div className='authorized-text' style={{color:textColor}}>
                {
                    loading ? 'Authorized' : authorized ? 'Authorized': 'Spotify is not authorized'
                }
            </div>
            {
                loading || authorized ? 
                <a className='spotify-logout-div' href='/api/spotify-logout'>
                    <img className='spotify-logout-img' src='/spotify-logout-icon.png'></img>
                </a> : <></>
            }
        </div>
        {
            authorized ? 
            <div className='hover-info'>
                
                <div className='user-img-div'>
                    <img src={profilePic} className='user-img'></img>
                </div>

                <div className='user-name-div'>
                    <p>
                        {userName} {`(${country})`}
                    </p>
                </div>
            </div> : <></>
        }
    </div>
  )
}
