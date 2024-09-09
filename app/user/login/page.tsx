'use client'

import Lottie from 'lottie-react';
import { useRouter } from 'next/navigation';
import { SyntheticEvent, useEffect, useState } from 'react';
import Pal from '@/public/Pal.json';
import { Topbar } from '@/_components/topbar';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  
  const router = useRouter();
  const backendUrl = 'http://127.0.0.1:4000';

  useEffect(() => {
    // Set the visibility to true after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    
    const response = await fetch(backendUrl + '/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
      credentials: 'include', // Ensures cookies from backend are included in the response
    });

    if (response.ok) {
      // No need to manually set the JWT token. It's already stored as an HTTP-only cookie by the backend.
      const data = await response.json();
      router.push('/');
    } else {
      // Handle login error (e.g., incorrect credentials)
      console.log('Login failed');
    }
  };

  return (

    <div className='login-register-outer'>
      <Topbar></Topbar>
      <div className={`login-outer-div flex-col-ja-c-c ${isVisible ? 'visible' : 'hidden'}`} >
        <div className='pal-lottie-div'>
            <Lottie animationData={Pal} className='pal-lottie'></Lottie>
        </div>
        <h1 className="pal-text">
            MUSIC-PAL
        </h1> 

        <form onSubmit={handleSubmit} className='login-design flex-col-ja-c-c'>
          <input className='email-input'
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email" 
            required
          />
          <input className='password-input'
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
            required
          />
          <button type="submit" className='submit-button'>Login</button>
        </form>

      </div>
    </div>
  );
}
