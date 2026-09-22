import { Lightbulb, SearchCheck, Box, Users, TrendingUp } from 'lucide-react'

export const STAGE_OPTIONS = [
  {
    value: 'Just an idea in my head',
    label: 'IDEATION',
    icon: Lightbulb
  },
  {
    value: "I know the problem well, haven't built anything",
    label: 'VALIDATION',
    icon: SearchCheck
  },
  {
    value: 'I have a prototype — something people can see or try',
    label: 'PROTOTYPING',
    icon: Box
  },
  {
    value: "I've tested it with real users and have feedback",
    label: 'TESTING',
    icon: Users
  },
  {
    value: 'I already have customers or people using it',
    label: 'TRACTION',
    icon: TrendingUp
  }
]
