import { MEMO_SECTIONS, MEMO_SECTION_CONFIG, type MemoSectionName } from '@/constants'
import type { C4ECompanyMemo } from '@/types/C4EPlatform/C4ECompanyMemo'
import { useFrappeGetDoc, useFrappePostCall, useFrappeUpdateDoc } from 'frappe-react-sdk'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export function useCompanyMemoSection(sectionKey: MemoSectionName) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const config = MEMO_SECTION_CONFIG[sectionKey] || {
    title: sectionKey.replace(/_/g, ' '),
    subtitle: 'Fill out this section to refine your venture memo.',
    index: 1,
    criteria: []
  }

  const { data, isLoading, mutate } = useFrappeGetDoc<C4ECompanyMemo>('C4E Company Memo', id)
  const { updateDoc, loading: isSaving } = useFrappeUpdateDoc()
  const { call: triggerAICheck, loading: isAiLoading } = useFrappePostCall(
    'c4e_platform.api.company_memo.check_memo'
  )

  const [textValue, setTextValue] = useState<string>('')
  const [isSaved, setIsSaved] = useState(false)
  const [aiResult, setAiResult] = useState<Record<
    string,
    { pass: boolean; reason: string | null }
  > | null>(null)

  const [syncedState, setSyncedState] = useState<{ id?: string; key?: string; val?: string }>({})
  const fetchedValue = data?.[sectionKey as keyof C4ECompanyMemo] as string | undefined

  if (
    data &&
    (syncedState.id !== id || syncedState.key !== sectionKey || syncedState.val !== fetchedValue)
  ) {
    setSyncedState({ id, key: sectionKey, val: fetchedValue })
    setTextValue(fetchedValue || '')
  }

  const stats = useMemo(() => {
    const trimmed = textValue.trim()
    return { words: trimmed ? trimmed.split(/\s+/).length : 0, characters: textValue.length }
  }, [textValue])

  const handleSave = async () => {
    if (!id) return
    try {
      await updateDoc('C4E Company Memo', id, { [sectionKey]: textValue })
      await mutate()
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 3000)
    } catch (err) {
      console.error('Save failed:', err)
    }
  }

  const handleAiReview = async () => {
    try {
      const res = await triggerAICheck({ key: sectionKey, field: textValue })
      if (res?.message?.[sectionKey]) setAiResult(res.message[sectionKey])
    } catch (err) {
      console.error('AI check failed:', err)
    }
  }

  const coveredCount = useMemo(() => {
    return aiResult ? Object.values(aiResult).filter((i) => i.pass).length : 0
  }, [aiResult])

  const currentIndex = MEMO_SECTIONS.findIndex(
    (s) => s.name.toLowerCase().replace(/\s+/g, '_') === sectionKey
  )

  return {
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
    prevSection: MEMO_SECTIONS[currentIndex - 1],
    nextSection: MEMO_SECTIONS[currentIndex + 1],
    handleSave,
    handleAiReview,
    navigate
  }
}
