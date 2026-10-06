import { Sparkles, Tag, Compass, CheckSquare, Lightbulb } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { IDEA_AI_FEATURES } from '@/constants'
import ReactMarkdown from 'react-markdown'

interface AIAssistantPanelProps {
  isLoading: boolean
  response?: {
    industry_tag: string
    approach: string
    ai_stage_recommendation: string
    overview: string
  }
}

const RESPONSE_STYLE_MAP: Record<string, { icon: React.ElementType; colorClass: string }> = {
  industry_tag: {
    icon: Tag,
    colorClass: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400'
  },
  approach: {
    icon: Compass,
    colorClass: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
  },
  ai_stage_recommendation: {
    icon: CheckSquare,
    colorClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
  }
}

export default function AIAssistantPanel({ isLoading, response }: AIAssistantPanelProps) {
  const { overview, ...shortData } = response || {}

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
          <div className="flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:border dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            {Object.entries(shortData).map(([key, value], index) => {
              const style = RESPONSE_STYLE_MAP[key] || {
                icon: Lightbulb,
                colorClass: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
              }
              const Icon = style.icon

              return (
                <div key={index} className="flex items-start gap-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${style.colorClass}`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2.5} />
                  </div>
                  <div className="space-y-0.5 pt-0.5">
                    <h4 className="text-sm font-semibold text-slate-900 capitalize dark:text-slate-200">
                      {key.replace(/_/g, ' ')}
                    </h4>
                    <p className="text-xs leading-relaxed whitespace-pre-wrap text-slate-600 dark:text-slate-400">
                      {value as string}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex flex-col rounded-2xl bg-slate-50 p-6 shadow-inner dark:border dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-none">
            <div className="w-full text-left text-sm text-slate-600 dark:text-slate-300 [&>h3]:mt-6 [&>h3]:mb-3 [&>h3]:text-base [&>h3]:font-semibold [&>h3]:text-slate-900 first:[&>h3]:mt-0 dark:[&>h3]:text-slate-100 [&>li]:leading-relaxed [&>p]:mb-4 [&>p]:leading-relaxed last:[&>p]:mb-0 [&>strong]:font-semibold [&>strong]:text-slate-900 dark:[&>strong]:text-slate-100 [&>ul]:mb-4 [&>ul]:list-outside [&>ul]:list-disc [&>ul]:space-y-2 [&>ul]:pl-5 last:[&>ul]:mb-0">
              <ReactMarkdown>{overview}</ReactMarkdown>
            </div>
          </div>
        </CardContent>
      ) : (
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:border dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            {IDEA_AI_FEATURES.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="flex items-start gap-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${feature.colorClass}`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2.5} />
                  </div>
                  <div className="space-y-0.5 pt-0.5">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex min-h-55 flex-col items-center justify-center gap-3 rounded-2xl bg-slate-100/60 p-6 text-center dark:bg-slate-800/40">
            <Sparkles className="text-primary h-7 w-7" />
            <div className="space-y-1.5">
              <p className="text-primary text-sm font-medium">
                Your AI feedback will appear here...
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Fill in the form and click "Get AI Feedback"
              </p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
