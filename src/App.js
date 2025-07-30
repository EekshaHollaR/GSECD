import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CrossCutting from './pages/CrossCutting';
import Food from './pages/Food';
import Energy from './pages/Energy';
import Finance from './pages/Finance';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Prediction from './pages/prediction';



function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cross-cutting" element={<CrossCutting />} />
            <Route path="/food" element={<Food />} />
            <Route path="/energy" element={<Energy />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path='/prediction' element={<Prediction />}/>
            {/* Optionally, a catch-all 404 page could go here */}
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
