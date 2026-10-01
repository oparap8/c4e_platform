import { Slider } from '@/components/ui/slider'
import { formatTime } from '@/lib/utils'

interface VideoProgressBarProps {
  currentTime: number
  duration: number
  progress: number
  onSeek: (value: number | readonly number[]) => void
}

export function VideoProgressBar({
  currentTime,
  duration,
  progress,
  onSeek
}: VideoProgressBarProps) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="w-10 text-right text-xs font-medium text-white/90">
        {formatTime(currentTime)}
      </span>
      <Slider
        value={[progress]}
        max={100}
        step={0.1}
        onValueChange={onSeek}
        className="cursor-pointer **:[[role=slider]]:h-3 **:[[role=slider]]:w-3"
      />
      <span className="w-10 text-xs font-medium text-white/90">{formatTime(duration)}</span>
    </div>
  )
}
