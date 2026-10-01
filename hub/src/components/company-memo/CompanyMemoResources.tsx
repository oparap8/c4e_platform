import { FolderOpen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { VideoPlayer } from '../video-player'
import CompanyMemoAttachments from './CompanyMemoAttachments'

export default function CompanyMemoResources() {
  return (
    <Card className="my-5 shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <FolderOpen className="text-muted-foreground h-4 w-4" />
          <span>Resources from your coach</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 pb-5 md:flex-row md:gap-4">
        <div className="flex w-full flex-col justify-start md:w-2/5">
          <VideoPlayer
            src="https://samplelib.com/mp4/sample-5s.mp4"
            poster="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg"
            title="How to size your market in ten minutes"
            description="A walk-through of top-down and bottom-up estimates, and where to find a source you can cite. Shared by Claudine for Market Potential."
            className="border-border aspect-video w-full rounded-lg border shadow-xs"
            autoPlay={false}
          />
        </div>

        <div className="w-full md:w-3/5">
          <CompanyMemoAttachments />
        </div>
      </CardContent>
    </Card>
  )
}
