import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Skeleton } from '../ui/skeleton'

export default function IdeaCardSkeleton() {
  return (
    <Card aria-hidden="true">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-5 w-3/4" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          <Skeleton className="h-4 w-full" />
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-4 w-1/2" />
      </CardFooter>
    </Card>
  )
}
