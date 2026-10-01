import type { UseFormReturn } from 'react-hook-form'
import type { IdeaFormData } from '@/schemas/ideaSchema'
import { Field, FieldError, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '../ui/textarea'
import { StageSelector } from './StageSelector'

interface IdeaFormFieldsProps {
  form: UseFormReturn<IdeaFormData>
}

export function IdeaFormFields({ form }: IdeaFormFieldsProps) {
  return (
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
  )
}
