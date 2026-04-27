/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music2 } from 'lucide-react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Drive',
    artist: 'AI Synth Ensemble',
    url: 'https://cdn.pixabay.com/audio/2022/02/22/audio_1f89c67675.mp3', // Synthwave style
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&h=300&auto=format&fit=crop',
    duration: 145
  },
  {
    id: '2',
    title: 'Cyber City',
    artist: 'Neural Beats',
    url: 'https://cdn.pixabay.com/audio/2022/01/21/audio_24e031b26a.mp3', // Electronic
    cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=300&h=300&auto=format&fit=crop',
    duration: 182
  },
  {
    id: '3',
    title: 'Midnight Horizon',
    artist: 'Vector Wave',
    url: 'https://cdn.pixabay.com/audio/2021/11/23/audio_0c9508544d.mp3', // Chillwave
    cover: 'https://images.unsplash.com/photo-1511447333015-45b65e570d37?q=80&w=300&h=300&auto=format&fit=crop',
    duration: 210
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleTrackEnd = () => {
    nextTrack();
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTime = audioRef.current ? audioRef.current.currentTime : 0;

  return (
    <div className="h-20 shrink-0 border-t border-[#0ff]/40 bg-black flex items-center px-6 gap-8 z-20 font-mono" id="music-player">
      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />
      
      <div className="flex items-center gap-6 min-w-fit">
        <button 
          onClick={prevTrack}
          className="text-[#0ff]/60 hover:text-[#0ff] transition-colors"
        >
          <SkipBack fill="currentColor" size={18} />
        </button>
        
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 border border-[#0ff] text-[#0ff] flex items-center justify-center shadow-[0_0_10px_#0ff] transition-all hover:bg-[#0ff] hover:text-black active:scale-95"
        >
          {isPlaying ? (
            <Pause fill="currentColor" size={20} />
          ) : (
            <Play fill="currentColor" size={20} className="ml-1" />
          )}
        </button>

        <button 
          onClick={nextTrack}
          className="text-[#0ff]/60 hover:text-[#0ff] transition-colors"
        >
          <SkipForward fill="currentColor" size={18} />
        </button>
      </div>
      
      <div className="hidden sm:flex flex-col flex-1 gap-1">
        <div className="flex justify-between text-[9px] uppercase font-bold tracking-widest">
          <span className="text-[#f0f]">{formatTime(currentTime)}</span>
          <span className="text-[#0ff] glitch-text" data-text={`BUFFERING: ${currentTrack.title} // ${currentTrack.artist}`}>
            BUFFERING: {currentTrack.title} // {currentTrack.artist}
          </span>
          <span className="text-[#f0f]">{formatTime(currentTrack.duration)}</span>
        </div>
        <div className="w-full h-[2px] bg-[#0ff]/10 relative group">
          <div 
            className="absolute left-0 top-0 bottom-0 bg-[#0ff] shadow-[0_0_5px_#0ff]"
            style={{ width: `${progress}%` }}
          />
          <input 
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => {
              const newProgress = Number(e.target.value);
              if (audioRef.current) {
                audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
              }
            }}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
      </div>

      <div className="hidden md:flex items-center gap-4 w-32 shrink-0">
        <Volume2 className="text-[#0ff]/40" size={14} />
        <div className="flex-1 h-[1px] bg-[#0ff]/20 relative">
          <div 
            className="absolute h-full bg-[#0ff]"
            style={{ width: `${volume * 100}%` }}
          />
          <input 
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
