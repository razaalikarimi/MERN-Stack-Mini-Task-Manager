import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { request } from '../api';

export default function AdminUsers(){
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  async function load(){
    try {
      const res = await request('/users', 'GET', null, token);
      setUsers(res);
    } catch (e) { console.error(e); }
  }
  useEffect(()=>{ load(); }, []);

  async function toggleRole(u) {
    const newRole = u.role === 'admin' ? 'member' : 'admin';
    try {
      await request(`/users/${u._id}/role`, 'PATCH', { role: newRole }, token);
      load();
    } catch (e) { alert('Error'); }
  }

  return (
    <div>
      <h2>Users (Admin)</h2>
      <div>
        {users.map(u => (
          <div key={u._id} style={{border:'1px solid #ddd', padding:8, marginTop:8}}>
            <div>{u.name} — {u.email} — {u.role}</div>
            <button onClick={()=>toggleRole(u)}>Toggle Role</button>
          </div>
        ))}
      </div>
    </div>
  );
}
