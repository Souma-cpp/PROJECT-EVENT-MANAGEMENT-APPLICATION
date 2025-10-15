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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/events' element={<Events />} />
        <Route path='/register' element={<RegisterUser />} />
        <Route path='/login' element={<LoginUser />} />
        <Route path='/dashboard' element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path='/organizers' element={<Organizers />} />
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
