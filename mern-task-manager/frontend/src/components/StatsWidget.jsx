import React, { useContext, useEffect, useState } from 'react';
import { request } from '../api';
import { AuthContext } from '../contexts/AuthContext';

export default function StatsWidget(){
  const { token } = useContext(AuthContext);
  const [stats, setStats] = useState(null);

  async function load() {
    try {
      const res = await request('/stats/overview', 'GET', null, token);
      setStats(res);
    } catch (e) { console.error(e); }
  }

  useEffect(()=>{ load(); }, []);

  if (!stats) return <div>Stats loading...</div>;
  return (
    <div style={{border:'1px solid #eee', padding:8}}>
      <div><strong>Overdue:</strong> {stats.overdue}</div>
      <div><strong>By Status:</strong> {stats.countByStatus.map(c => `${c._id}:${c.count}`).join(', ')}</div>
      <div><strong>By Priority:</strong> {stats.countByPriority.map(c=>`${c._id}:${c.count}`).join(', ')}</div>
    </div>
  );
}
