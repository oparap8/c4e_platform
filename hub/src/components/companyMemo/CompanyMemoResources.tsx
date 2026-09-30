import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { VideoPlayer } from '../videoPlayer'

export default function CompanyMemoResources() {
  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">Resources</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-4">
        <div className="flex-2/5">
          <VideoPlayer
            src="/files/Screencast from 2026-06-11 17-48-43.webm"
            poster="/files/Screenshot from 2026-08-28 11-50-51.png"
            className="border-border max-h-70 border shadow-md"
            autoPlay={false}
          />
        </div>
        <div className="flex-3/5"></div>
      </CardContent>
    </Card>
  )
}
