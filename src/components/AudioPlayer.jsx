import { useState, useEffect, useRef } from 'react'
import { Howl } from 'howler'
import { motion } from 'framer-motion'
import {
  Play, Pause, SkipBack, SkipForward,
  Volume2, Heart, Repeat, Shuffle
} from 'lucide-react'
import { usePlayer } from '../contexts/PlayerContext'

const AudioPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    volume,
    repeat,
    shuffle,
    play,
    pause,
    nextTrack,
    prevTrack,
    setVolume,
    toggleRepeat,
    toggleShuffle
  } = usePlayer()

  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const soundRef = useRef(null)

  useEffect(() => {
    if (currentTrack && currentTrack.url) {
      if (soundRef.current) {
        soundRef.current.unload()
      }

      soundRef.current = new Howl({
        src: [currentTrack.url],
        html5: true,
        volume: volume / 100,
        onplay: () => play(),
        onpause: () => pause(),
        onend: () => nextTrack(),
        onload: () => setDuration(soundRef.current.duration())
      })

      if (isPlaying) {
        soundRef.current.play()
      }

      const updateProgress = () => {
        if (soundRef.current && soundRef.current.playing()) {
          setProgress(soundRef.current.seek())
        }
        requestAnimationFrame(updateProgress)
      }
      requestAnimationFrame(updateProgress)
    }

    return () => {
      if (soundRef.current) {
        soundRef.current.unload()
      }
    }
  }, [currentTrack])

  const handlePlayPause = () => {
    if (!soundRef.current) return

    if (isPlaying) {
      soundRef.current.pause()
    } else {
      soundRef.current.play()
    }
  }

  const handleSeek = (e) => {
    const value = parseFloat(e.target.value)
    setProgress(value)
    if (soundRef.current) {
      soundRef.current.seek(value)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!currentTrack) return null

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-black border-t border-gray-800 p-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Track Info */}
          <div className="flex items-center space-x-4 flex-1">
            <img
              src={currentTrack.thumbnail || '/default-thumbnail.jpg'}
              alt={currentTrack.title}
              className="w-14 h-14 rounded-md object-cover"
            />
            <div>
              <h4 className="font-semibold text-white">{currentTrack.title}</h4>
              <p className="text-sm text-gray-400">{currentTrack.artist}</p>
            </div>
            <button className="text-gray-400 hover:text-pink-500 transition">
              <Heart size={20} />
            </button>
          </div>

          {/* Player Controls */}
          <div className="flex flex-col items-center flex-1">
            <div className="flex items-center space-x-6 mb-2">
              <button
                onClick={toggleShuffle}
                className={`${shuffle ? 'text-green-500' : 'text-gray-400'} hover:text-white`}
              >
                <Shuffle size={20} />
              </button>
              <button onClick={prevTrack} className="text-gray-400 hover:text-white">
                <SkipBack size={24} />
              </button>
              <button
                onClick={handlePlayPause}
                className="bg-white text-black rounded-full p-3 hover:scale-105 transition"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <button onClick={nextTrack} className="text-gray-400 hover:text-white">
                <SkipForward size={24} />
              </button>
              <button
                onClick={toggleRepeat}
                className={`${repeat ? 'text-green-500' : 'text-gray-400'} hover:text-white`}
              >
                <Repeat size={20} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center space-x-4 w-full max-w-2xl">
              <span className="text-xs text-gray-400">{formatTime(progress)}</span>
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={progress}
                onChange={handleSeek}
                className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
              <span className="text-xs text-gray-400">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-2 flex-1 justify-end">
            <Volume2 size={20} className="text-gray-400" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default AudioPlayer
