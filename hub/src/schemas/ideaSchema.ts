import { z } from 'zod'

export const IDEA_STAGE_OPTIONS = [
  'Just an idea in my head',
  "I know the problem well, haven't built anything",
  'I have a prototype — something people can see or try',
  "I've tested it with real users and have feedback",
  'I already have customers or people using it'
] as const

export const ideaSchema = z.object({
  student_idea: z.string().min(2, 'Venture name must be at least 2 characters'),
  onboarding_problem: z.string().min(10, 'Problem statement must be at least 10 characters'),
  onboarding_solution: z.string().min(10, 'Proposed solution must be at least 10 characters'),
  stage: z.enum(IDEA_STAGE_OPTIONS, {
    message: 'Please select a valid stage from the list.'
  })
})

export type IdeaFormData = z.infer<typeof ideaSchema>
