import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { PlayerProvider } from './contexts/PlayerContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Layout from './components/Layout'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Library from './pages/Library'
import PlaylistDetail from './pages/PlaylistDetail'
import CreatePlaylist from './pages/CreatePlaylist'
import AuthCallback from './pages/AuthCallback'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <AuthProvider>
        <PlayerProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/library" element={
                <ProtectedRoute>
                  <Library />
                </ProtectedRoute>
              } />
              <Route path="/playlist/:id" element={<PlaylistDetail />} />
              <Route path="/create" element={
                <ProtectedRoute>
                  <CreatePlaylist />
                </ProtectedRoute>
              } />
              <Route path="/auth-success" element={<AuthCallback />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Layout>
          <ToastContainer position="bottom-right" theme="dark" />
        </PlayerProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
