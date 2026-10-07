import { PageContainer, PageHeader } from '@/components/Page'
import AIAssistantPanel from '@/components/student-idea/AIAssistantPanel'
import IdeaForm from '@/components/student-idea/IdeaForm'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useFrappeGetDoc, useFrappeGetDocList, useFrappePostCall } from 'frappe-react-sdk'
import type { C4EStudentIdea } from '@/types/C4EPlatform/C4EStudentIdea'
import { DeleteIdeaAlertDialog } from '@/components/student-idea'
import { formatDate } from '@/lib/utils'
import type { IdeaFormData } from '@/schemas/ideaSchema'
import { Button } from '@/components/ui/button'
import type { C4ECompanyMemo } from '@/types/C4EPlatform/C4ECompanyMemo'

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

  const { data: memoList } = useFrappeGetDocList<C4ECompanyMemo>('C4E Company Memo', {
    fields: ['name'],
    filters: data?.name ? [['idea', '=', data.name]] : undefined,
    limit: 1
  })

  const memoData = memoList?.[0]

  const values: IdeaFormData & { last_modified: string } = {
    onboarding_problem: data?.onboarding_problem || '',
    stage: (data?.stage as IdeaFormData['stage']) || 'Just an idea in my head',
    student_idea: data?.student_idea || '',
    onboarding_solution: data?.onboarding_solution || '',
    last_modified: formatDate(data?.modified || '')
  }

  const existingAiResponse: IdeaFeedback | undefined = data?.ai_feedback
    ? {
        ai_stage_recommendation: data.ai_stage_recommendation || '',
        approach: data.approach || '',
        industry_tag: data.industry || '',
        overview: data.ai_feedback || ''
      }
    : undefined

  const [isCreating, setIsCreating] = useState(false)

  const {
    call,
    loading: aiLoading,
    result
  } = useFrappePostCall<IdeaFeedback>('c4e_platform.api.ai_feedback.get_idea_feedback')

  const handleAIFeedback = async () => {
    try {
      await call({
        doc_name: id
      })
    } catch (err) {
      console.error('AI Feedback failed: ', err)
    }
  }

  const isLoading = isCreating || aiLoading

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
        action={
          <>
            <Button variant={'link'} render={<Link to={`/company-memo/${memoData?.name || ''}`} />}>
              Company Memo
            </Button>
            <DeleteIdeaAlertDialog id={id || ''} />
          </>
        }
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
              onSuccess={handleAIFeedback}
            />
          )}
        </div>
        <div className="md:col-span-3">
          <AIAssistantPanel isLoading={isLoading} response={result ?? existingAiResponse} />
        </div>
      </div>
    </PageContainer>
  )
}
