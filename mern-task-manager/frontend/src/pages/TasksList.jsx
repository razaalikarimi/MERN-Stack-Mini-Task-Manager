import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { request } from '../api';
import { Link, useSearchParams } from 'react-router-dom';
import StatsWidget from '../components/StatsWidget';

export default function TasksList(){
  const { token } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  async function load(){
    setLoading(true);
    try {
      const res = await request(`/tasks?page=${page}&search=${encodeURIComponent(search)}&limit=6`, 'GET', null, token);
      setTasks(res.tasks);
      setTotalPages(res.pages);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  useEffect(()=>{ load(); }, [page]);

  return (
    <div>
      <h2>Tasks</h2>
      <div style={{display:'flex', gap:10, alignItems:'center'}}>
        <input placeholder="search..." value={search} onChange={e=>setSearch(e.target.value)} />
        <button onClick={()=>{ setPage(1); load(); }}>Search</button>
        <Link to="/tasks/new"><button>Create Task</button></Link>
        <StatsWidget />
      </div>

      {loading ? <div>Loading...</div> : (<div>
        {tasks.map(t => (
          <div key={t._id} style={{border:'1px solid #ddd', padding:8, marginTop:8}}>
            <Link to={`/tasks/${t._id}`}><h3>{t.title}</h3></Link>
            <div>Status: {t.status} | Priority: {t.priority} | Due: {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—'}</div>
            <div>Assignee: {t.assignee ? t.assignee.name : '—'}</div>
          </div>
        ))}
        <div style={{marginTop:12}}>
          <button onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</button>
          <span style={{margin: '0 8px'}}>Page {page} / {totalPages}</span>
          <button onClick={()=>setPage(p=>p+1)}>Next</button>
        </div>
      </div>)}
    </div>
  );
}
