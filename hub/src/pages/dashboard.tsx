import { Banner } from '@/components/Banner'
import { IdeaCard, IdeaCardSkeleton, NewIdeaCard } from '@/components/studentIdea'
import { Button } from '@/components/ui/button'
import type { C4EStudentIdea } from '@/types/C4EPlatform/C4EStudentIdea'
import { useFrappeAuth, useFrappeGetDocList, type GetDocListArgs } from 'frappe-react-sdk'
import { PlusCircle } from 'lucide-react'

const Dashboard = () => {
  const { currentUser } = useFrappeAuth()

  const args: GetDocListArgs<C4EStudentIdea> = {
    fields: ['name', 'student_idea', 'modified', 'onboarding_problem', 'stage'],
    filters: [['student', '=', currentUser || '']],
    limit: 3
  }

  const { data, isLoading, error } = useFrappeGetDocList<C4EStudentIdea>('C4E Student Idea', args)

  return (
    <div className="p-2 md:p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-primary text-lg font-semibold">My Ideas</h3>
          <p className="text-muted-foreground font-mono text-xs">
            {data ? `${data.length} idea${data.length === 1 ? ' of 3' : 's of 3'}` : 'Loading...'}
          </p>
        </div>
        <Button size={'lg'}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Idea
        </Button>
      </div>

      {error ? (
        <Banner
          variant="error"
          title="Failed to load ideas"
          description={error.message || 'Please check your connection and try again.'}
        />
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <IdeaCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
          {data && data.map((idea) => <IdeaCard idea={idea} />)}

          {data && data.length < 3 && <NewIdeaCard />}
        </div>
      )}
    </div>
  )
}

export default Dashboard
