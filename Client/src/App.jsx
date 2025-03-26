import React from 'react'
import { BrowserRouter, Route, Routes} from 'react-router'
import Navbar from './Components/Navbar'
import SignupModel from './Components/SignupModel'
import HomePage from './pages/Home'
import Wrapper from './Components/Wrapper'
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'
import ResetPassword from './Components/ResetPassword'
import Login from './pages/Login'

const App = () => {
  return (
    <BrowserRouter>
    <Navbar />
    <SignupModel />
      <Routes>
        <Route path='/' element={<HomePage />}/>
        <Route path='/dash' element={
          <Wrapper>
          <Dashboard />
          </Wrapper>}/>
        <Route path='/signup' element={<Register />}/>
        <Route path='/update-password' element={<ResetPassword />}/>
        <Route path='/login' element={<Login />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App