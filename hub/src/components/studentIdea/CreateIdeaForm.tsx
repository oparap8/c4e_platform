import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFrappeCreateDoc } from 'frappe-react-sdk'
import { toast } from 'sonner'
import { ideaSchema, type IdeaFormData } from '@/schemas/ideaSchema'
import { getFrappeErrorMessage } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Field, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '../ui/textarea'
import { DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Banner } from '../Banner'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

const STAGE_VALUES = [
  'Just an idea in my head',
  "I know the problem well, haven't built anything",
  'I have a prototype — something people can see or try',
  "I've tested it with real users and have feedback",
  'I already have customers or people using it'
]

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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <Banner
          variant="error"
          title="Error creating idea"
          description={getFrappeErrorMessage(error)}
        />
      )}
      <FieldGroup>
        <Field>
          <Label htmlFor="student_idea">Idea</Label>
          <Input {...form.register('student_idea')} />
        </Field>
        <Field>
          <Label htmlFor="onboarding_problem">Problem Statement</Label>
          <Textarea {...form.register('onboarding_problem')} />
        </Field>
        <Field>
          <Label htmlFor="onboarding_solution">Solution</Label>
          <Textarea {...form.register('onboarding_solution')} />
        </Field>
        <Controller
          name="stage"
          control={form.control}
          render={({ field }) => (
            <div>
              <Label htmlFor="stage">Stage</Label>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="mt-2 w-full">
                  <SelectValue placeholder="Select a stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Stage</SelectLabel>
                    {STAGE_VALUES.map((val) => (
                      <SelectItem key={val} value={val}>
                        {val}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
        />
      </FieldGroup>
      <DialogFooter>
        <DialogClose render={<Button variant="outline">Cancel</Button>} />
        <Button disabled={loading} type="submit">
          Create Idea
        </Button>
      </DialogFooter>
    </form>
  )
}
