import React, { useRef } from 'react'
import { cn } from '@/lib/utils'
import { useVideoPlayer } from '@/hooks'
import { VideoControls } from './VideoControls'

export interface VideoPlayerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string
  poster?: string
  className?: string
}

export function VideoPlayer({ src, poster, className, ...props }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const {
    isPlaying,
    setIsPlaying,
    progress,
    currentTime,
    duration,
    volume,
    isMuted,
    isFullscreen,
    togglePlay,
    handleTimeUpdate,
    handleSeek,
    handleVolumeChange,
    toggleMute,
    toggleFullscreen,
    handleLoadedMetadata
  } = useVideoPlayer({ videoRef, containerRef })

  return (
    <div
      ref={containerRef}
      className={cn('group relative overflow-hidden rounded-lg bg-black', className)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="h-full w-full cursor-pointer object-contain"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        {...props}
      />

      <VideoControls
        isPlaying={isPlaying}
        progress={progress}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        isFullscreen={isFullscreen}
        onTogglePlay={togglePlay}
        onSeek={handleSeek}
        onToggleMute={toggleMute}
        onVolumeChange={handleVolumeChange}
        onToggleFullscreen={toggleFullscreen}
      />
    </div>
  )
}
