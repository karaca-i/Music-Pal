'use client';

import Lottie from "lottie-react";
import Pal from '@/public/Pal.json';


export default function MainIntro() {



    return (
        <div className='main-intro-outer-div'>
            <div className="top flex-col-ja-c-c">
                <div className='pal-lottie-div'>
                    <Lottie animationData={Pal} className='pal-lottie'></Lottie>
                </div>
                <h1 className="pal-text">
                    MUSIC-PAL
                </h1>
                <p> 
                    Welcome to <strong>Music Pal</strong>, a tool for elevating your music experience...
                </p>
            </div>
        </div>
    )
}