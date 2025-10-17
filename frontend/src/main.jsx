import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home.jsx"
import Events from "./pages/Events.jsx"
import Organizers from "./pages/Organizers.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import Venues from "./pages/Venues.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import RegisterUser from './pages/RegisterUser.jsx';
import LoginUser from './pages/LoginUser.jsx';
import OrganizerLogin from './pages/OrganizerLogin.jsx';
import OrganizerRegister from './pages/OrganizerRegister.jsx';
import OwnerRegister from './pages/OwnerRegister.jsx';
import OwnerLogin from './pages/OwnerLogin.jsx';
import AuthRoute from './components/AuthRoute.jsx';
import CreateEvent from "./pages/CreateEvent.jsx"
import CreateVenue from './pages/CreateVenue.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/events' element={<Events />} />


        <Route path='/register' element={
          <AuthRoute>
            <RegisterUser />
          </AuthRoute>
        } />
        <Route path='/login' element={
          <AuthRoute>
            <LoginUser />
          </AuthRoute>
        } />
        <Route path='/organizerLogin' element={
          <AuthRoute>
            <OrganizerLogin />
          </AuthRoute>
        } />
        <Route path='/organizerRegister' element={
          <AuthRoute>
            <OrganizerRegister />
          </AuthRoute>
        } />
        <Route path='/ownerRegister' element={
          <AuthRoute>
            <OwnerRegister />
          </AuthRoute>
        } />
        <Route path='/ownerLogin' element={
          <AuthRoute>
            <OwnerLogin />
          </AuthRoute>
        } />

        <Route path='/dashboard' element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path='/organizers/' element={<Organizers />} />
        <Route path='/organizers/create' element={<CreateEvent />} />



        <Route path='/owners' element={<Venues />} />
        <Route path='/owners/create' element={<CreateVenue />} />


        <Route path='/venues' element={<Venues />} />
        <Route path='/dashboard' element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>

    </BrowserRouter>
  </StrictMode>,
)
