import React from 'react'
import { BrowserRouter, Route, Routes, useLocation} from 'react-router-dom'
import Navbar from './Components/Navbar'
import Wrapper from './Components/Wrapper'
import ResetPassword from './Components/ResetPassword'
import Login from './Pages/Login'
import Dashboard from './Pages/Dashboard'
import Register from './Pages/Register'
import Doctors from './Components/Doctors'
import Profile from './Pages/Profile'
import Footer from './Pages/Footer'
import HOD from './Components/HOD'
import Home from './Pages/Home'
import Services from './Pages/Service'
import ProfileCompletion from './Pages/ProfileCompletion'
import About from './Pages/About'
import TrusteeDashboard from './Pages/TrusteeDashboard'
import Doctorchat from './Pages/Doctorchat'

// Layout component that conditionally renders Navbar and Footer
const Layout = ({ children }) => {
  const location = useLocation();
  const isDoctorChatPage = location.pathname === '/doctorchat';
  
  return (
    <>
      {!isDoctorChatPage && <Navbar />}
      {!isDoctorChatPage && (<><br /><br /></>)}
      {children}
      {!isDoctorChatPage && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/dashboard' element={
            <Wrapper>
            <Dashboard />
            </Wrapper>}/>
          <Route path='/signup' element={<Register />}/>
          <Route path='/update-password' element={<ResetPassword />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/about' element={<About />}/>
          <Route path='/doctors' element={
            <Wrapper>
            <Doctors />
            </Wrapper>}/>
          <Route path='/hods' element={<HOD />}/>
          <Route path='/services' element={<Services />}/>
          <Route path='/profile-completion' element={<ProfileCompletion />}/>
          <Route path='/profile' element={<Profile />}/>
          <Route path='/trustee-dashboard' element={<TrusteeDashboard />}/>
          <Route path='/doctorchat' element={<Doctorchat />}/>
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App