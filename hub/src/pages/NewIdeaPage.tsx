import { PageContainer, PageHeader } from '@/components/Page'
import AIAssistantPanel from '@/components/student-idea/AIAssistantPanel'
import IdeaForm from '@/components/student-idea/IdeaForm'
import { useState } from 'react'

export default function NewIdeaPage() {
  const [isCreating, setIsCreating] = useState(false)

  const isLoading = isCreating

  return (
    <PageContainer>
      <PageHeader
        title="New Idea"
        subtitle="Tell us about your idea and get AI-powered feedback, tips and next steps"
      />
      <div className="grid gap-5 md:grid-cols-5">
        <div className="md:col-span-2">
          <IdeaForm setIsLoading={setIsCreating} action="Create" />
        </div>
        <div className="md:col-span-3">
          <AIAssistantPanel isLoading={isLoading} />
        </div>
      </div>
    </PageContainer>
  )
}
