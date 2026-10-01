import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { CriteriaItem } from '@/constants'
import { CircleAlert, CircleCheck, RotateCw, Sparkles } from 'lucide-react'

interface CompanyMemoAiFeedbackCardProps {
  criteria: CriteriaItem[]
  coveredCount: number
  aiResult: Record<string, { pass: boolean; reason: string | null }> | null
  isAiLoading: boolean
  hasText: boolean
  onReview: () => void
}

export default function CompanyMemoAiFeedbackCard({
  criteria,
  coveredCount,
  aiResult,
  isAiLoading,
  hasText,
  onReview
}: CompanyMemoAiFeedbackCardProps) {
  return (
    <div className="bg-card border-border space-y-4 rounded-xl border p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs font-semibold">
          <Sparkles className="text-primary h-3.5 w-3.5" /> AI feedback
        </Badge>
        <span className="text-muted-foreground text-xs font-semibold">
          {coveredCount} of {criteria.length || 3} covered
        </span>
      </div>

      <p className="text-foreground text-sm font-medium">
        {coveredCount === criteria.length
          ? 'Great job! All criteria covered.'
          : coveredCount > 0
            ? 'Good start. One thing is still missing.'
            : 'Click review to test your section criteria.'}
      </p>

      <div className="space-y-3 pt-1">
        {criteria.map((item) => {
          const res = aiResult?.[item.key]
          const isPassed = res?.pass ?? true

          return (
            <div key={item.key} className="space-y-2">
              {isPassed ? (
                <div className="text-foreground flex items-center gap-2.5 text-sm font-semibold">
                  <CircleCheck className="h-4 w-4 shrink-0 text-emerald-500" />
                  <span>{item.label}</span>
                </div>
              ) : (
                <div className="space-y-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-amber-900 dark:text-amber-200">
                  <div className="flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-400">
                    <CircleAlert className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  <p className="pl-6 text-xs leading-relaxed opacity-90">
                    <strong className="font-bold">Try this:</strong>{' '}
                    {res?.reason || 'Include details or concrete statistics.'}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="border-border space-y-2 border-t pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onReview}
          disabled={isAiLoading || !hasText}
          className="w-full gap-2 font-medium"
        >
          <RotateCw className={`h-4 w-4 ${isAiLoading ? 'animate-spin' : ''}`} />
          <span>{isAiLoading ? 'Analyzing...' : 'Review again'}</span>
        </Button>
        <p className="text-muted-foreground text-center text-[11px]">
          Checks your current text against this section's criteria.
        </p>
      </div>
    </div>
  )
}
