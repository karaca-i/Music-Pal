'use client'

import { useRouter } from 'next/navigation';
import { SyntheticEvent, useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const router = useRouter();
  const backendUrl = 'http://127.0.0.1:4000';

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
    <form onSubmit={handleSubmit}>
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
      <button type="submit">Login</button>
    </form>
  );
}
