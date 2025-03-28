import React from 'react'
import { BrowserRouter, Route, Routes} from 'react-router'
import Navbar from './Components/Navbar'
import SignupModel from './Components/SignupModel'
import HomePage from './Pages/Home'
import Wrapper from './Components/Wrapper'
import ResetPassword from './Components/ResetPassword'
import Login from './Pages/Login'
import Home from './Pages/Home'
import Dashboard from './Pages/Dashboard'
import Register from './Pages/Register'
import Questioning from './Pages/Questioning'
import Doctors from './Components/Doctors'

const App = () => {
  return (
    <BrowserRouter>
    <Navbar />
    <SignupModel />
      <Routes>
        <Route path='/' element={<HomePage />}/>
        <Route path='/dashboard' element={
          <Wrapper>
          <Dashboard />
          </Wrapper>}/>
        <Route path='/signup' element={<Register />}/>
        <Route path='/update-password' element={<ResetPassword />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/questioning' element={<Questioning />}/>
        <Route path='/doctors' element={<Doctors />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App