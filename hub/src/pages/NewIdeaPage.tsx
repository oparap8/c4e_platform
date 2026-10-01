import { PageContainer, PageHeader } from '@/components/Page'
import AIAssistantPanel from '@/components/student-idea/AIAssistantPanel'
import IdeaForm from '@/components/student-idea/IdeaForm'
import { useState } from 'react'
import mockData from '../ai_response.json'

interface IdeaFeedback {
  industry_tag: string
  approach: string
  ai_stage_recommendation: string
  overview: string
}

export default function NewIdeaPage() {
  const [isCreating, setIsCreating] = useState(false)
  const [isResponseLoading, setIsResponseLoading] = useState(false)
  const [response, setResponse] = useState<IdeaFeedback | undefined>(undefined)

  async function get_idea_feedback() {
    setIsResponseLoading(true)
    const data = mockData.get_idea_feedback
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setResponse(data)
    setIsResponseLoading(false)
  }

  const isLoading = isCreating || isResponseLoading

  return (
    <PageContainer>
      <PageHeader
        title="New Idea"
        subtitle="Tell us about your idea and get AI-powered feedback, tips and next steps"
      />
      <div className="grid gap-5 md:grid-cols-5">
        <div className="md:col-span-2">
          <IdeaForm onSuccess={get_idea_feedback} setIsLoading={setIsCreating} />
        </div>
        <div className="md:col-span-3">
          <AIAssistantPanel isLoading={isLoading} response={response} />
        </div>
      </div>
    </PageContainer>
  )
}
