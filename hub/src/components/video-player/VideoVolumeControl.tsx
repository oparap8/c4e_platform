import { Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

interface VideoVolumeControlProps {
  volume: number
  isMuted: boolean
  onToggleMute: () => void
  onVolumeChange: (value: number | readonly number[]) => void
}

export function VideoVolumeControl({
  volume,
  isMuted,
  onToggleMute,
  onVolumeChange
}: VideoVolumeControlProps) {
  return (
    <div className="group/volume flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-white hover:bg-white/20 hover:text-white"
        onClick={onToggleMute}
      >
        {isMuted || volume === 0 ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>
      <div className="w-0 overflow-hidden transition-all duration-300 ease-in-out group-hover/volume:w-20">
        <Slider
          value={[isMuted ? 0 : volume * 100]}
          max={100}
          step={1}
          onValueChange={onVolumeChange}
          className="w-20 cursor-pointer px-2 **:[[role=slider]]:h-3 **:[[role=slider]]:w-3"
        />
      </div>
    </div>
  )
}
