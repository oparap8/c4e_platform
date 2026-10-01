import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFrappeCreateDoc, useFrappeUpdateDoc } from 'frappe-react-sdk'
import { toast } from 'sonner'
import { ideaSchema, type IdeaFormData } from '@/schemas/ideaSchema'
import { getFrappeErrorMessage } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Banner } from '../Banner'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Sparkles } from 'lucide-react'
import { IdeaFormFields } from './IdeaFormFields'
import { useNavigate } from 'react-router-dom'

interface IdeaFormProps {
  onSuccess?: () => void
  setIsLoading: (value: boolean) => void
  defaultValues?: IdeaFormData & { last_modified?: string }
  action: 'Create' | 'Update'
  docName?: string
}

export default function IdeaForm({
  onSuccess,
  setIsLoading,
  defaultValues,
  action,
  docName
}: IdeaFormProps) {
  const { createDoc, loading: createLoading, error: createError } = useFrappeCreateDoc()
  const { updateDoc, loading: updateLoading, error: updateError } = useFrappeUpdateDoc()
  const navigate = useNavigate()

  const form = useForm<IdeaFormData>({
    resolver: zodResolver(ideaSchema),
    defaultValues: {
      onboarding_problem: defaultValues?.onboarding_problem || '',
      onboarding_solution: defaultValues?.onboarding_solution || '',
      stage: defaultValues?.stage,
      student_idea: defaultValues?.student_idea || ''
    }
  })

  async function onSubmit(data: IdeaFormData) {
    try {
      setIsLoading(true)
      if (action === 'Create') {
        const doc = await createDoc('C4E Student Idea', data)
        navigate(`/idea/${doc.name}`, { replace: true })
      } else {
        if (!docName) throw new Error('Document ID is required for updates')
        await updateDoc('C4E Student Idea', docName, data)
      }
      toast.success(`Idea ${action.toLowerCase()}d successfully!`)
      onSuccess?.()
    } catch (err) {
      toast.error(`Failed to ${action.toLowerCase()} idea. Please try again.`)
      console.error(`${action} error:`, err)
    } finally {
      setIsLoading(false)
    }
  }

  const loading = action === 'Create' ? createLoading : updateLoading
  const error = action === 'Create' ? createError : updateError

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{action === 'Create' ? 'Enter your idea' : 'Update your idea'}</CardTitle>
        <CardDescription>
          {action === 'Create'
            ? 'Fill out the details below to submit a new idea.'
            : 'Modify the details of your idea below.'}
        </CardDescription>
      </CardHeader>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-6 pb-6">
          {error && (
            <Banner
              variant="error"
              title={`Error ${action.toLowerCase()}ing idea`}
              description={getFrappeErrorMessage(error)}
            />
          )}
          <IdeaFormFields form={form} />
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button disabled={loading} type="submit" className="w-full">
            <Sparkles className="mr-2" /> Get AI Feedback
          </Button>
          <div className="text-muted-foreground text-sm">
            Last modified: {defaultValues?.last_modified}
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
