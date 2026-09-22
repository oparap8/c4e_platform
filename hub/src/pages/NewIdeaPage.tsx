import { PageContainer, PageHeader } from '@/components/Page'
import AIAssistantPanel from '@/components/studentIdea/AIAssistantPanel'
import CreateIdeaForm from '@/components/studentIdea/CreateIdeaForm'

export default function NewIdeaPage() {
  return (
    <PageContainer>
      <PageHeader
        title="New Idea"
        subtitle="Tell us about your idea and get AI-powered feedback, tips and next steps"
      />
      <div className="grid gap-5 md:grid-cols-5">
        <div className="md:col-span-2">
          <CreateIdeaForm onSuccess={() => {}} />
        </div>
        <div className="md:col-span-3">
          <AIAssistantPanel />
        </div>
      </div>
    </PageContainer>
  )
}
