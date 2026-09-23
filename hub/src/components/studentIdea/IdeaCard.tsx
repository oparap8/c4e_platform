import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import type { C4EStudentIdea } from '@/types/C4EPlatform/C4EStudentIdea'
import { Link } from 'react-router-dom'

export default function IdeaCard({ idea }: { idea: C4EStudentIdea }) {
  return (
    <Card
      asChild
      className="group hover:border-primary focus-visible:ring-ring h-full transition-all duration-300 hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <Link to={`/idea/${idea.name}`} className="flex w-full flex-col text-left">
        <CardHeader className="w-full pb-3 text-left">
          <div className="mb-2 flex items-start">
            <span className="bg-secondary text-secondary-foreground inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
              {idea.stage}
            </span>
          </div>
          <CardTitle className="line-clamp-1 text-lg leading-tight">{idea.student_idea}</CardTitle>
        </CardHeader>

        <CardContent className="w-full flex-1 pb-4 text-left">
          <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
            {idea.onboarding_problem}
          </p>
        </CardContent>

        <CardFooter className="text-muted-foreground mt-auto w-full border-t py-3 text-xs">
          Last modified: {formatDate(idea.modified || '')}
        </CardFooter>
      </Link>
    </Card>
  )
}
