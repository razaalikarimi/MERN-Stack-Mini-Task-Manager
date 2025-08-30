import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const { register } = useContext(AuthContext);
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
  const [err,setErr]=useState(null);
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    try {
      await register(name,email,password);
      nav('/');
    } catch (e) { setErr(e.data?.message || 'Register failed'); }
  }

  return (
    <div style={{maxWidth:400}}>
      <h2>Register</h2>
      <form onSubmit={submit}>
        <div><input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} /></div>
        <div><input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div><input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <button type="submit">Register</button>
      </form>
      {err && <div style={{color:'red'}}>{err}</div>}
    </div>
  );
}
