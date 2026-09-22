import { Banner } from '@/components/Banner'
import { IdeaCard, IdeaCardSkeleton, NewIdeaCard } from '@/components/studentIdea'
import { Button } from '@/components/ui/button'
import type { C4EStudentIdea } from '@/types/C4EPlatform/C4EStudentIdea'
import { useFrappeAuth, useFrappeGetDocList, type GetDocListArgs } from 'frappe-react-sdk'
import { PlusCircle } from 'lucide-react'
import { PageContainer, PageHeader } from '@/components/Page'
import { Link } from 'react-router-dom'

const IdeaListPage = () => {
  const { currentUser } = useFrappeAuth()

  const args: GetDocListArgs<C4EStudentIdea> = {
    fields: ['name', 'student_idea', 'modified', 'onboarding_problem', 'stage'],
    filters: [['student', '=', currentUser || '']],
    limit: 3
  }

  const { data, isLoading, error } = useFrappeGetDocList<C4EStudentIdea>('C4E Student Idea', args)

  const subtitle = data
    ? `${data.length} idea${data.length === 1 ? ' of 3' : 's of 3'}`
    : 'Loading...'

  return (
    <PageContainer>
      <PageHeader
        title={'Your Ideas'}
        subtitle={subtitle}
        action={
          <>
            <Button size={'lg'} render={<Link to="new" />}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Idea
            </Button>
          </>
        }
      />

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
    </PageContainer>
  )
}

export default IdeaListPage
