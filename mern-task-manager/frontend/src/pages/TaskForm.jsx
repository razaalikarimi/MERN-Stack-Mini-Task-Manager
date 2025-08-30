import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { request } from '../api';
import { useNavigate } from 'react-router-dom';

export default function TaskForm(){
  const { token } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState('');
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const body = { title, description, priority, dueDate: dueDate || undefined, tags: tags ? tags.split(',').map(t=>t.trim()) : undefined };
      await request('/tasks', 'POST', body, token);
      nav('/');
    } catch (err) { alert(err.data?.message || 'Error'); }
  }

  return (
    <div style={{maxWidth:600}}>
      <h2>Create Task</h2>
      <form onSubmit={submit}>
        <div><input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required/></div>
        <div><textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} /></div>
        <div>
          <label>Priority</label>
          <select value={priority} onChange={e=>setPriority(e.target.value)}>
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
        </div>
        <div><input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} /></div>
        <div><input placeholder="tags (comma separated)" value={tags} onChange={e=>setTags(e.target.value)} /></div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
