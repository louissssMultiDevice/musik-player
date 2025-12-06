import { createContext, useContext, useState, useCallback } from 'react'
import { toast } from 'react-toastify'

const PlayerContext = createContext()

export const usePlayer = () => {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider')
  }
  return context
}

export const PlayerProvider = ({ children }) => {
  const [queue, setQueue] = useState([])
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(80)
  const [repeat, setRepeat] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(null)

  const playTrack = useCallback((track) => {
    setQueue([track])
    setCurrentTrackIndex(0)
    setCurrentTrack(track)
    setIsPlaying(true)
  }, [])

  const playPlaylist = useCallback((tracks, startIndex = 0) => {
    setQueue(tracks)
    setCurrentTrackIndex(startIndex)
    setCurrentTrack(tracks[startIndex])
    setIsPlaying(true)
    toast.success(`Playing playlist - ${tracks.length} tracks`)
  }, [])

  const play = useCallback(() => {
    setIsPlaying(true)
  }, [])

  const pause = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const nextTrack = useCallback(() => {
    if (queue.length === 0) return

    let nextIndex
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length)
    } else {
      nextIndex = (currentTrackIndex + 1) % queue.length
    }

    if (!repeat && nextIndex === 0) {
      setIsPlaying(false)
      return
    }

    setCurrentTrackIndex(nextIndex)
    setCurrentTrack(queue[nextIndex])
  }, [queue, currentTrackIndex, repeat, shuffle])

  const prevTrack = useCallback(() => {
    if (queue.length === 0) return

    const prevIndex = currentTrackIndex === 0 ? queue.length - 1 : currentTrackIndex - 1
    setCurrentTrackIndex(prevIndex)
    setCurrentTrack(queue[prevIndex])
  }, [queue, currentTrackIndex])

  const addToQueue = useCallback((track) => {
    setQueue(prev => [...prev, track])
    toast.success('Added to queue')
  }, [])

  const clearQueue = useCallback(() => {
    setQueue([])
    setCurrentTrack(null)
    setIsPlaying(false)
  }, [])

  const toggleRepeat = useCallback(() => {
    setRepeat(prev => !prev)
  }, [])

  const toggleShuffle = useCallback(() => {
    setShuffle(prev => !prev)
  }, [])

  const value = {
    queue,
    currentTrack,
    isPlaying,
    volume,
    repeat,
    shuffle,
    playTrack,
    playPlaylist,
    play,
    pause,
    nextTrack,
    prevTrack,
    addToQueue,
    clearQueue,
    setVolume,
    toggleRepeat,
    toggleShuffle
  }

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  )
}
