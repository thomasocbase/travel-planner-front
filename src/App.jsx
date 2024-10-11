import React, { useState } from 'react'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import { Routes, Route } from 'react-router-dom'

import SignUp from './pages/SignUp'
import LogIn from './pages/LogIn'
import Homepage from './pages/Homepage'
import TravelPlan from './pages/TravelPlan'

import StatusContext from './components/status/StatusContext'
import StatusSnackbar from './components/status/StatusSnackbar'

import './App.css'

function App() {

  const [appStatus, setAppStatus] = useState({
    open: false,
    severity: 'info',
    message: '',
  })

  return (
    <>
      <StatusContext.Provider value={{ appStatus, setAppStatus }}>
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/plan" element={<TravelPlan />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
        </Routes>
        <Footer />
        <StatusSnackbar />
      </StatusContext.Provider>
    </>
  )
}

export default App
