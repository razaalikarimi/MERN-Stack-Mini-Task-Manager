import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { request } from '../api';
import { AuthContext } from '../contexts/AuthContext';

export default function TaskDetails(){
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [task, setTask] = useState(null);
  const nav = useNavigate();

  async function load() {
    try {
      const res = await request(`/tasks/${id}`, 'GET', null, token);
      setTask(res);
    } catch (e) { alert('Error'); }
  }
  useEffect(()=>{ load(); }, [id]);

  async function remove() {
    if (!confirm('Delete?')) return;
    try {
      await request(`/tasks/${id}`, 'DELETE', null, token);
      nav('/');
    } catch (e) { alert('Error'); }
  }

  if (!task) return <div>Loading...</div>;
  return (
    <div>
      <h2>{task.title}</h2>
      <div>{task.description}</div>
      <div>Status: {task.status}</div>
      <div>Priority: {task.priority}</div>
      <div>Assignee: {task.assignee ? task.assignee.name : '—'}</div>
      <div>Created by: {task.createdBy?.name}</div>
      <div style={{marginTop:10}}>
        <button onClick={()=>nav(`/tasks/new`)}>Edit (use create page for simplicity)</button>
        <button onClick={remove} style={{marginLeft:8}}>Delete</button>
      </div>
    </div>
  );
}
