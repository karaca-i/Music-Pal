'use client'

import { Topbar } from '@/_components/topbar';
import { match } from 'assert';
import Lottie from 'lottie-react';
import { useRouter } from 'next/navigation';
import { SyntheticEvent, useState, useEffect } from 'react';
import Pal from '@/public/Pal.json';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
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
    const response = await fetch(backendUrl + '/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
        name: name,
        tastematch: false,
      }),
    });

    if (response.ok) {
      // If registration is successful, redirect to the login page
      router.push('/user/login');
    } else {
      // If registration fails, show the error message to the user
      const errorData = await response.json(); // Assuming the API sends back an error message
      setError(errorData.message || 'Failed to register user');
    }
  };

  return (
    <div className='login-register-outer'>
      <Topbar></Topbar>
      <div
        className={`login-outer-div flex-col-ja-c-c ${isVisible ? 'visible' : 'hidden'}`}
      >
        <div className='pal-lottie-div'>
          <Lottie animationData={Pal} className='pal-lottie'></Lottie>
        </div>
        <h1 className='pal-text'>MUSIC-PAL</h1>

        <form onSubmit={handleSubmit} className='login-design flex-col-ja-c-c'>
          <input
            className='name-input'
            type='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Name'
            required
          />
          <input
            className='email-input'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
            required
          />
          <input
            className='password-input'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
            required
          />
          <button type='submit' className='submit-button'>
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
