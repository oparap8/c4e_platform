import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFrappeCreateDoc } from 'frappe-react-sdk'
import { toast } from 'sonner'
import { ideaSchema, type IdeaFormData } from '@/schemas/ideaSchema'
import { getFrappeErrorMessage } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '../ui/textarea'
import { Banner } from '../Banner'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { StageSelector } from './StageSelector'
import { Sparkles } from 'lucide-react'

export default function CreateIdeaForm({ onSuccess }: { onSuccess: () => void }) {
  const { createDoc, loading, error } = useFrappeCreateDoc()
  const form = useForm<IdeaFormData>({ resolver: zodResolver(ideaSchema) })

  async function onSubmit(data: IdeaFormData) {
    try {
      await createDoc('C4E Student Idea', data)
      toast.success('Idea created successfully!')
      form.reset()
      onSuccess()
    } catch (err) {
      toast.error('Failed to create idea. Please try again.')
      console.error('Creation error:', err)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Enter your idea</CardTitle>
        <CardDescription>Fill out the details below to submit a new idea.</CardDescription>
      </CardHeader>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-6 pb-6">
          {error && (
            <Banner
              variant="error"
              title="Error creating idea"
              description={getFrappeErrorMessage(error)}
            />
          )}
          <FieldGroup>
            <Field>
              <Label htmlFor="student_idea">Venture Name</Label>
              <Input {...form.register('student_idea')} />
              <FieldError className="text-sm text-red-500">
                {form.formState.errors.student_idea?.message}
              </FieldError>
            </Field>
            <Field>
              <Label htmlFor="onboarding_problem">Problem Statement</Label>
              <Textarea className="min-h-37.5" {...form.register('onboarding_problem')} />
              <FieldError className="text-sm text-red-500">
                {form.formState.errors.onboarding_problem?.message}
              </FieldError>
            </Field>
            <Field>
              <Label htmlFor="onboarding_solution">Proposed Solution</Label>
              <Textarea className="min-h-37.5" {...form.register('onboarding_solution')} />
              <FieldError className="text-sm text-red-500">
                {form.formState.errors.onboarding_solution?.message}
              </FieldError>
            </Field>

            <StageSelector control={form.control} />
            <FieldError className="text-sm text-red-500">
              {form.formState.errors.stage?.message}
            </FieldError>
          </FieldGroup>
        </CardContent>

        <CardFooter>
          <Button disabled={loading} type="submit" className="w-full">
            <Sparkles />
            Save and get AI feedback
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
