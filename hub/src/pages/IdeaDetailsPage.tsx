import { PageContainer, PageHeader } from '@/components/Page'
import AIAssistantPanel from '@/components/studentIdea/AIAssistantPanel'
import IdeaForm from '@/components/studentIdea/IdeaForm'
import { useEffect, useState } from 'react'
import mockData from '../ai_response.json'
import { useParams } from 'react-router-dom'
import { useFrappeGetDoc } from 'frappe-react-sdk'
import type { C4EStudentIdea } from '@/types/C4EPlatform/C4EStudentIdea'
import { DeleteIdeaAlertDialog } from '@/components/studentIdea'
import { formatDate } from '@/lib/utils'
import type { IdeaFormData } from '@/schemas/ideaSchema'

interface IdeaFeedback {
  industry_tag: string
  approach: string
  ai_stage_recommendation: string
  overview: string
}

export default function IdeaDetailsPage() {
  const { id } = useParams()

  const {
    data,
    error,
    isLoading: isFetchingDoc
  } = useFrappeGetDoc<C4EStudentIdea>('C4E Student Idea', id)

  const values: IdeaFormData & { last_modified: string } = {
    onboarding_problem: data?.onboarding_problem || '',
    stage: (data?.stage as IdeaFormData['stage']) || 'Just an idea in my head',
    student_idea: data?.student_idea || '',
    onboarding_solution: data?.onboarding_solution || '',
    last_modified: formatDate(data?.modified || '')
  }

  const [isCreating, setIsCreating] = useState(false)
  const [isResponseLoading, setIsResponseLoading] = useState(true)
  const [response, setResponse] = useState<IdeaFeedback | undefined>(undefined)

  useEffect(() => {
    const fetchFeedback = async () => {
      const mockDataResponse = mockData.get_idea_feedback
      await new Promise((resolve) => setTimeout(resolve, 3000))

      setResponse(mockDataResponse)
      setIsResponseLoading(false)
    }

    fetchFeedback()
  }, [])

  const isLoading = isCreating || isResponseLoading

  if (error) {
    return (
      <PageContainer>
        <div className="p-6 text-center text-red-500">Error loading idea details.</div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Idea Details"
        subtitle="Review your idea and get AI-powered feedback, tips and next steps"
        action={<DeleteIdeaAlertDialog id={id || ''} />}
      />
      <div className="grid gap-5 md:grid-cols-5">
        <div className="md:col-span-2">
          {isFetchingDoc ? (
            <div className="flex h-64 animate-pulse items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">
              Loading idea details...
            </div>
          ) : (
            <IdeaForm
              action="Update"
              docName={id}
              setIsLoading={setIsCreating}
              defaultValues={values}
            />
          )}
        </div>
        <div className="md:col-span-3">
          <AIAssistantPanel isLoading={isLoading} response={response} />
        </div>
      </div>
    </PageContainer>
  )
}
