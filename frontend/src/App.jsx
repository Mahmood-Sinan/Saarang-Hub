import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';

import Home from './pages/Home';
import EventDetail from './pages/EventDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import MyRegistrations from './pages/MyRegistrations';
import AdminDashboard from './pages/AdminDashboard';
import AdminEventForm from './pages/AdminEventForm.jsx';
import { useState } from 'react';

function App() {

  // user means current state value
  // setUsername is a function to change it
  const [username, setUsername] = useState('');
  useEffect(()=>{
    const storedUser = localStorage.getItem('username');
    if(storedUser){
      setUsername(storedUser);
    }
    console.log(`user is ${username}`);
  },[])
  return (
    <BrowserRouter>
      <Navbar username={username} setUsername={setUsername}></Navbar>
      <main className='main-content'>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route element={<Login username={username} setUsername={setUsername}/>} path="/login"></Route>
          <Route element={<EventDetail/>} path="/events/:id"></Route>
          <Route element={<Register username={username} setUsername={setUsername}/>} path="/register"></Route>
          <Route element={<MyRegistrations/>} path="/my-registrations"></Route>
          <Route element={<AdminDashboard username={username} setUsername={setUsername}/>} path="/admin"></Route>
          <Route element={<AdminEventForm username={username} setUsername={setUsername}/>} path="/admin/events/:id/edit"></Route>
          <Route element={<AdminEventForm username={username} setUsername={setUsername}/>} path="/admin/events/new"></Route>
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;