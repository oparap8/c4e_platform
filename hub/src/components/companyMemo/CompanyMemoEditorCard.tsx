import { Textarea } from '@/components/ui/textarea'
import { Check, Loader2 } from 'lucide-react'

interface CompanyMemoEditorCardProps {
  textValue: string
  stats: { words: number; characters: number }
  isSaving: boolean
  isSaved: boolean
  onChange: (value: string) => void
  onSave: () => void
}

export default function CompanyMemoEditorCard({
  textValue,
  stats,
  isSaving,
  isSaved,
  onChange,
  onSave
}: CompanyMemoEditorCardProps) {
  return (
    <div className="bg-card border-border focus-within:ring-ring rounded-xl border shadow-sm transition-all focus-within:ring-1">
      <Textarea
        value={textValue}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onSave}
        placeholder="Type your response here..."
        className="min-h-65 resize-y border-0 bg-transparent p-5 text-base leading-relaxed shadow-none focus-visible:ring-0"
      />

      <div className="border-border text-muted-foreground flex items-center justify-between border-t px-5 py-3 text-xs">
        <span>
          {stats.words} words · {stats.characters} characters
        </span>
        <div className="flex items-center gap-2">
          {isSaving ? (
            <span className="text-primary flex items-center gap-1.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
            </span>
          ) : isSaved ? (
            <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
              <Check className="h-3.5 w-3.5" /> Saved
            </span>
          ) : (
            <span>Saved</span>
          )}
        </div>
      </div>
    </div>
  )
}
