import React, { useEffect, useState } from 'react'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import { Routes, Route } from 'react-router-dom'

import SignUp from './pages/SignUp'
import LogIn from './pages/LogIn'
import Homepage from './pages/Homepage'
import TravelPlan from './pages/TravelPlan'
import AdminUsers from './pages/admin/AdminUsers'
import PlansList from './pages/PlansList'
import RestrictedRoute from './components/common/RestrictedRoute'

import StatusContext from './components/status/StatusContext'
import StatusSnackbar from './components/status/StatusSnackbar'

import AuthContext from './components/auth/AuthContext'

import './App.css'

function App() {

  const [appStatus, setAppStatus] = useState({
    open: false,
    severity: 'info',
    message: '',
  })

  // USER STATUS MANAGEMENT (logged in or not)
  const initialUserState = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : { username: "", isLoggedIn: false };

  const [user, setUser] = useState(initialUserState)

  useEffect(() => {
    if (document.cookie.includes('CHECKER')) {
      const username =
        document.cookie
          .split('; ')
          .find(row => row.startsWith('CHECKER'))
          .split('=')[1];

      const userData = { username: username, isLoggedIn: true };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      setUser({ username: "", isLoggedIn: false });
      localStorage.removeItem('user');
    }
  }, []);

  return (
    <>
      <AuthContext.Provider value={{ user, setUser }}>
        <StatusContext.Provider value={{ appStatus, setAppStatus }}>
          <Header />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/plans-list" element={<PlansList />} />
            <Route path="/plan/:id" element={
              <RestrictedRoute user={user}>
                <TravelPlan />
              </RestrictedRoute>}
            />
            <Route path="/admin" element={
              <RestrictedRoute user={user} admin>
                <AdminUsers />
              </RestrictedRoute>}
            />
          </Routes>
          {/* {window.location.pathname !== '/signup' && <Footer /> } */}
          <Footer />
          <StatusSnackbar />
        </StatusContext.Provider>
      </AuthContext.Provider>
    </>
  )
}

export default App
