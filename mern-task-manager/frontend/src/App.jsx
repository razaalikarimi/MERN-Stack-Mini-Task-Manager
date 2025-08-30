import React, { useContext } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import TasksList from './pages/TasksList';
import TaskDetails from './pages/TaskDetails';
import TaskForm from './pages/TaskForm';
import AdminUsers from './pages/AdminUsers';
import { AuthContext } from './contexts/AuthContext';

function PrivateRoute({ children, roles }) {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <div>Forbidden</div>;
  return children;
}

export default function App(){
  const { user, logout } = useContext(AuthContext);
  return (
    <div style={{padding:20}}>
      <header style={{display:'flex', gap:10, marginBottom:16}}>
        <Link to="/">Tasks</Link>
        {user?.role === 'admin' && <Link to="/admin">Users</Link>}
        <div style={{marginLeft:'auto'}}>{user ? <>
          <span>{user.name} ({user.role})</span>
          <button onClick={logout} style={{marginLeft:8}}>Logout</button>
        </> : <>
          <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
        </>}
        </div>
      </header>

      <Routes>
        <Route path="/" element={<PrivateRoute><TasksList /></PrivateRoute>} />
        <Route path="/tasks/new" element={<PrivateRoute><TaskForm /></PrivateRoute>} />
        <Route path="/tasks/:id" element={<PrivateRoute><TaskDetails /></PrivateRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<PrivateRoute roles={['admin']}><AdminUsers /></PrivateRoute>} />
      </Routes>
    </div>
  );
}
