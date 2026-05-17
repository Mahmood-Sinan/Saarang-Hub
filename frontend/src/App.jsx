import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';

import Home from './pages/Home';
import EventDetail from './pages/EventDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import MyRegistrations from './pages/MyRegistrations';
import { useState } from 'react';

function App() {

  // user means current state value
  // setUser is a function to change it
  const [user, setUser] = useState(null);
  useEffect(()=>{
    const storedUser = localStorage.getItem('user');
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
          <Route element={<Login user={user} setUser={setUser} />} path="/login"></Route>
          <Route element={<EventDetail/>} path="/events/:id"></Route>
          <Route element={<Register user={user} setUser={setUser} />} path="/register"></Route>
          <Route element={<MyRegistrations user={user} setUser={setUser} />} path="/my-registrations"></Route>
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;