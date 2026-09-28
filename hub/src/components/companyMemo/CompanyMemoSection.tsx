import { Button } from '@/components/ui/button'
import { MEMO_SECTIONS, type MemoSectionName } from '@/constants'
import { useCompanyMemoSection } from '@/hooks/useCompanyMemoSection'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import CompanyMemoAiFeedbackCard from './CompanyMemoAiFeedbackCard'
import CompanyMemoEditorCard from './CompanyMemoEditorCard'
import { useParams } from 'react-router-dom'

interface CompanyMemoSectionProps {
  sectionKey: MemoSectionName
}

export default function CompanyMemoSection({ sectionKey }: CompanyMemoSectionProps) {
  const { id } = useParams()
  const {
    config,
    isLoading,
    isSaving,
    isSaved,
    isAiLoading,
    textValue,
    setTextValue,
    setIsSaved,
    stats,
    aiResult,
    coveredCount,
    prevSection,
    nextSection,
    handleSave,
    handleAiReview,
    navigate
  } = useCompanyMemoSection(sectionKey)

  if (isLoading) {
    return (
      <div className="text-muted-foreground flex h-64 items-center justify-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Loading memo section...</span>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-7 xl:col-span-8">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight capitalize">{config.title}</h1>
            <span className="text-muted-foreground text-xs font-medium">
              Section {config.index} of {MEMO_SECTIONS.length}
            </span>
          </div>
          <p className="text-muted-foreground text-sm">{config.subtitle}</p>
        </div>

        <CompanyMemoEditorCard
          textValue={textValue}
          stats={stats}
          isSaving={isSaving}
          isSaved={isSaved}
          onChange={(val) => {
            setTextValue(val)
            setIsSaved(false)
          }}
          onSave={handleSave}
        />

        <div className="flex items-center justify-between pt-2">
          {prevSection ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                navigate(
                  `/company-memo/${id}/${prevSection.name.toLowerCase().replace(/\s+/g, '-')}`
                )
              }
              className="text-muted-foreground hover:text-foreground gap-1.5"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>{prevSection.name}</span>
            </Button>
          ) : (
            <div />
          )}
          {nextSection && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                navigate(
                  `/company-memo/${id}/${nextSection.name.toLowerCase().replace(/\s+/g, '-')}`
                )
              }
              className="text-muted-foreground hover:text-foreground gap-1.5"
            >
              <span>{nextSection.name}</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4 lg:col-span-5 xl:col-span-4">
        <CompanyMemoAiFeedbackCard
          criteria={config.criteria}
          coveredCount={coveredCount}
          aiResult={aiResult}
          isAiLoading={isAiLoading}
          hasText={!!textValue.trim()}
          onReview={handleAiReview}
        />
      </div>
    </div>
  )
}
