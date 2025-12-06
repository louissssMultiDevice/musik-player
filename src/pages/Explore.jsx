import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Heart, Users, Clock } from 'lucide-react'
import axios from 'axios'
import { usePlayer } from '../contexts/PlayerContext'

const Explore = () => {
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const { playPlaylist } = usePlayer()

  useEffect(() => {
    fetchPublicPlaylists()
  }, [])

  const fetchPublicPlaylists = async () => {
    try {
      const response = await axios.get('/api/playlists/public')
      setPlaylists(response.data)
    } catch (error) {
      console.error('Error fetching playlists:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePlayPlaylist = (playlist) => {
    if (playlist.songs.length > 0) {
      playPlaylist(playlist.songs, 0)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Explore Playlists</h1>
        <p className="text-gray-400">Discover amazing playlists from the community</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {playlists.map((playlist, index) => (
          <motion.div
            key={playlist.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-gray-900 rounded-xl p-4 hover:bg-gray-800 transition-all cursor-pointer group"
            onClick={() => handlePlayPlaylist(playlist)}
          >
            <div className="relative mb-4">
              <img
                src={playlist.songs[0]?.thumbnail || '/default-playlist.jpg'}
                alt={playlist.title}
                className="w-full h-48 object-cover rounded-lg"
              />
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg"
              >
                <button className="bg-green-500 text-white rounded-full p-4 hover:scale-110 transition">
                  <Play size={24} fill="white" />
                </button>
              </motion.div>
            </div>

            <div>
              <h3 className="font-bold text-white text-lg mb-1 truncate">
                {playlist.title}
              </h3>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                {playlist.description || 'No description'}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Users size={14} className="mr-1" />
                    <span>{playlist.user.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Heart size={14} className="mr-1" />
                    <span>{playlist._count?.likes || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <Play size={14} className="mr-1" />
                    <span>{playlist.plays || 0}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  <span>
                    {Math.floor(
                      playlist.songs.reduce((acc, song) => acc + song.duration, 0) / 60
                    )} min
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Explore
