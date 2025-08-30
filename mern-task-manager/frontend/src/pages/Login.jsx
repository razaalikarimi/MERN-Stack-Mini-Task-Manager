import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    setErr(null);
    try {
      await login(email, password);
      nav('/');
    } catch (e) {
      setErr(e.data?.message || 'Login failed');
    }
  }

  return (
    <div style={{maxWidth:400}}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div><input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div><input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <button type="submit">Login</button>
      </form>
      {err && <div style={{color:'red'}}>{JSON.stringify(err)}</div>}
    </div>
  );
}

