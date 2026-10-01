import { Play, Pause, Maximize, Minimize } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VideoProgressBar } from './VideoProgressBar'
import { VideoVolumeControl } from './VideoVolumeControl'

interface VideoControlsProps {
  isPlaying: boolean
  progress: number
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  isFullscreen: boolean
  onTogglePlay: () => void
  onSeek: (value: number | readonly number[]) => void
  onToggleMute: () => void
  onVolumeChange: (value: number | readonly number[]) => void
  onToggleFullscreen: () => void
}

export function VideoControls({
  isPlaying,
  progress,
  currentTime,
  duration,
  volume,
  isMuted,
  isFullscreen,
  onTogglePlay,
  onSeek,
  onToggleMute,
  onVolumeChange,
  onToggleFullscreen
}: VideoControlsProps) {
  return (
    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus-within:opacity-100">
      <VideoProgressBar
        currentTime={currentTime}
        duration={duration}
        progress={progress}
        onSeek={onSeek}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20 hover:text-white"
            onClick={onTogglePlay}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>

          <VideoVolumeControl
            volume={volume}
            isMuted={isMuted}
            onToggleMute={onToggleMute}
            onVolumeChange={onVolumeChange}
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:bg-white/20 hover:text-white"
          onClick={onToggleFullscreen}
        >
          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}
