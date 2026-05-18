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
  // setUser is a function to change it
  const [user, setUser] = useState(null);
  useEffect(()=>{
    const storedUser = localStorage.getItem('username');
    if(storedUser){
      setUser(storedUser);
    }
    console.log(`user is ${user}`);
  },[])
  return (
    <BrowserRouter>
      <Navbar user={user} setUser={setUser}></Navbar>
      <main className='main-content'>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route element={<Login/>} path="/login"></Route>
          <Route element={<EventDetail/>} path="/events/:id"></Route>
          <Route element={<Register/>} path="/register"></Route>
          <Route element={<MyRegistrations/>} path="/my-registrations"></Route>
          <Route element={<AdminDashboard/>} path="/admin"></Route>
          <Route element={<AdminEventForm/>} path="/admin/events/:id/edit"></Route>
          <Route element={<AdminEventForm/>} path="/admin/events/new"></Route>
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;