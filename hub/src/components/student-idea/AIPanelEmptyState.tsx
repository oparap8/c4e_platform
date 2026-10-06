import { Sparkles } from 'lucide-react'
import { IDEA_AI_FEATURES } from '@/constants'

export default function AIPanelEmptyState() {
  return (
    <>
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
                <p className="text-xs text-slate-500 dark:text-slate-400">{feature.description}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex min-h-55 flex-col items-center justify-center gap-3 rounded-2xl bg-slate-100/60 p-6 text-center dark:bg-slate-800/40">
        <Sparkles className="text-primary h-7 w-7" />
        <div className="space-y-1.5">
          <p className="text-primary text-sm font-medium">Your AI feedback will appear here...</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Fill in the form and click "Get AI Feedback"
          </p>
        </div>
      </div>
    </>
  )
}
