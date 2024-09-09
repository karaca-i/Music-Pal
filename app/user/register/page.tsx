'use client'

import { match } from 'assert';
import {useRouter} from 'next/navigation';
import { SyntheticEvent, useState } from 'react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const router = useRouter()
  const backendUrl = 'http://127.0.0.1:4000';

  const handleSubmit = async (e:SyntheticEvent) => {
      e.preventDefault();
      const response = await fetch(backendUrl+'/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          name: name,
          tastematch:false,
        }),
      });
      
      if (response.ok) {
        // If registration is successful, redirect to the login page
        router.push('/user/login');
      } else {
        // If registration fails, show the error message to the user
        const errorData = await response.json(); // Assuming the API sends back an error message
        setError(errorData.message || 'Failed to register user');
    };
  }

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="name" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        placeholder="Name" 
        required
      />
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Email" 
        required
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Password" 
        required
      />
      <button type="submit">Register</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
