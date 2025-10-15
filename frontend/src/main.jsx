import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ClerkProvider } from '@clerk/clerk-react'
import { SignedIn, SignedOut, SignIn } from '@clerk/clerk-react';

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}
import Home from "./pages/Home.jsx"
import Events from "./pages/Events.jsx"
import Organizers from "./pages/Organizers.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import Venues from "./pages/Venues.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/events' element={<Events />} />
          <Route path='/organizers' element={<Organizers />} />
          <Route path='/venues' element={<Venues />} />
          <Route path='/dashboard' element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
)
