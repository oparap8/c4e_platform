import { Sparkles, Lightbulb, CheckSquare, TriangleAlert, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'

const FEATURES = [
  {
    title: 'Key insights',
    description: 'What looks good and what to improve.',
    icon: Lightbulb,
    colorClass: 'bg-blue-50 text-blue-600'
  },
  {
    title: 'Actionable tips',
    description: 'Next steps to move your idea forward.',
    icon: CheckSquare,
    colorClass: 'bg-emerald-50 text-emerald-600'
  },
  {
    title: 'Potential risks',
    description: 'Challenges to watch out for.',
    icon: TriangleAlert,
    colorClass: 'bg-amber-50 text-amber-600'
  },
  {
    title: 'Market & business considerations',
    description: 'Opportunities and factors to think about.',
    icon: TrendingUp,
    colorClass: 'bg-purple-50 text-purple-600'
  }
]

export default function AIAssistantPanel() {
  return (
    <Card className="bg-secondary flex h-full w-full flex-col gap-6 px-1 py-4 md:p-4 lg:p-6">
      <CardHeader className="space-y-3">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-primary h-6 w-6" strokeWidth={2.5} />
          <span>AI Assistant</span>
        </CardTitle>
        <CardDescription>
          Once you submit your idea, I'll analyze it and give you personalized feedback, including:
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="flex items-start gap-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${feature.colorClass}`}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.5} />
                </div>
                <div className="space-y-0.5 pt-0.5">
                  <h4 className="text-sm font-semibold text-slate-900">{feature.title}</h4>
                  <p className="text-xs text-slate-500">{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex min-h-55 flex-col items-center justify-center gap-3 rounded-2xl bg-slate-100/60 p-6 text-center">
          <Sparkles className="text-primary h-7 w-7" />
          <div className="space-y-1.5">
            <p className="text-primary text-sm font-medium">Your AI feedback will appear here...</p>
            <p className="text-xs text-slate-400">Fill in the form and click "Get AI Feedback"</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
