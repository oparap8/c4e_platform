import {
  Lightbulb,
  SearchCheck,
  Box,
  Users,
  TrendingUp,
  CheckSquare,
  Compass,
  Tag
} from 'lucide-react'

export const AI_FEATURES = [
  {
    title: 'Overview & Insights',
    description: 'A warm review of your idea and specific areas to explore.',
    icon: Lightbulb,
    colorClass: 'bg-blue-50 text-blue-600'
  },
  {
    title: 'Stage Recommendation',
    description: 'Clear, actionable next steps to move your idea forward.',
    icon: CheckSquare,
    colorClass: 'bg-emerald-50 text-emerald-600'
  },
  {
    title: 'Approach Analysis',
    description: 'Clarity on whether you are leading with a problem or a solution.',
    icon: Compass,
    colorClass: 'bg-amber-50 text-amber-600'
  },
  {
    title: 'Industry Tag',
    description: 'Categorization of your startup sector (e.g., EdTech, FinTech).',
    icon: Tag,
    colorClass: 'bg-purple-50 text-purple-600'
  }
]

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

export const MEMO_STATUS_COLORS = {
  complete: 'bg-green-500',
  'needs-work': 'bg-destructive',
  edited: 'bg-yellow-500',
  'not-started': 'bg-border'
} as const

export const MEMO_SECTIONS = [
  { name: 'Purpose', status: 'complete' },
  { name: 'Problem', status: 'edited' },
  { name: 'Solution', status: 'needs-work' },
  { name: 'Why Now', status: 'complete' },
  { name: 'Market Potential', status: 'not-started' },
  { name: 'Competition', status: 'complete' },
  { name: 'Business Model', status: 'edited' },
  { name: 'Team', status: 'not-started' },
  { name: 'Traction', status: 'needs-work' },
  { name: 'What You Need', status: 'not-started' },
  { name: 'Vision', status: 'complete' }
] as const
