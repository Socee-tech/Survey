import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Survey from './pages/survey'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/dashboard'


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Survey />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}