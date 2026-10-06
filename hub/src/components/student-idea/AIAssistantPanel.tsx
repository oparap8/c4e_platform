import { Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import AIPanelEmptyState from './AIPanelEmptyState'
import AIAssistantReponse from './AIAssistantResponse'

interface AIAssistantPanelProps {
  isLoading: boolean
  response?: {
    industry_tag: string
    approach: string
    ai_stage_recommendation: string
    overview: string
  }
}

export default function AIAssistantPanel({ isLoading, response }: AIAssistantPanelProps) {
  return (
    <Card className="bg-secondary flex h-full w-full flex-col gap-6 px-1 py-4 md:p-4 lg:p-6 dark:border-slate-800 dark:bg-slate-950">
      <CardHeader className="space-y-3">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-primary h-6 w-6" strokeWidth={2.5} />
          <span className="dark:text-slate-100">AI Assistant</span>
        </CardTitle>
        <CardDescription className="dark:text-slate-400">
          Once you submit your idea, I'll analyze it and give you personalized feedback, including:
        </CardDescription>
      </CardHeader>

      {isLoading ? (
        <CardContent className="flex min-h-55 items-center justify-center">
          <div className="animate-pulse font-medium text-slate-500 dark:text-slate-400">
            Loading AI Feedback....
          </div>
        </CardContent>
      ) : response ? (
        <CardContent className="space-y-4">
          <AIAssistantReponse response={response} />
        </CardContent>
      ) : (
        <CardContent className="space-y-4">
          <AIPanelEmptyState />
        </CardContent>
      )}
    </Card>
  )
}
