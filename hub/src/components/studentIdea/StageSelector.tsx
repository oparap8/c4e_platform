import { Controller, type Control } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { type IdeaFormData } from '@/schemas/ideaSchema'
import { STAGE_OPTIONS } from '@/contants'

export function StageSelector({ control }: { control: Control<IdeaFormData> }) {
  return (
    <Controller
      name="stage"
      control={control}
      render={({ field }) => (
        <div className="space-y-3 pt-2">
          <Label>Maturity Lifecycle Stage</Label>
          <div className="flex w-full items-center justify-between gap-1 rounded-lg p-2 dark:bg-slate-900">
            {STAGE_OPTIONS.map((option) => {
              const Icon = option.icon
              const isActive = field.value === option.value

              return (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => field.onChange(option.value)}
                  className={cn(
                    'flex flex-1 flex-col items-center justify-center gap-1.5 rounded-md px-1 py-3 text-[10px] font-semibold tracking-wider transition-all sm:text-xs',
                    isActive
                      ? 'bg-secondary text-secondary-foreground shadow-sm'
                      : 'hover:text-primary dark:hover:text-primary text-slate-500 dark:text-slate-400'
                  )}
                >
                  <Icon className="mb-0.5 h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>
      )}
    />
  )
}
