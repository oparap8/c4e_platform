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

export type MemoSectionName =
  | 'purpose'
  | 'problem'
  | 'solution'
  | 'why_now'
  | 'market_potential'
  | 'competition'
  | 'business_model'
  | 'team'
  | 'traction'
  | 'what_you_need'
  | 'vision'

export interface CriteriaItem {
  key: string
  label: string
}

export interface SectionConfigItem {
  title: string
  subtitle: string
  index: number
  criteria: CriteriaItem[]
}

export const MEMO_SECTION_CONFIG: Record<string, SectionConfigItem> = {
  purpose: {
    title: 'Purpose',
    subtitle: "Write one sentence: We help [who] do [what]. That's it.",
    index: 1,
    criteria: [
      { key: 'has_who_is_helped', label: 'Who you help is named' },
      {
        key: 'is_described_in_plain_terms',
        label: 'What you help them do is described in plain terms'
      },
      { key: 'is_one_sentence', label: 'It fits in one sentence' }
    ]
  },
  problem: {
    title: 'Problem',
    subtitle:
      'Describe the problem your customers face. Be specific — what happens, how often, and what it costs them.',
    index: 2,
    criteria: [
      {
        key: 'is_problem_described_concretely',
        label: 'Problem described concretely — what actually happens'
      },
      { key: 'is_who_in_problem', label: 'Who experiences this problem is mentioned' },
      { key: 'is_problem_significant', label: 'Significance shown (frequency, cost, frustration)' }
    ]
  },
  solution: {
    title: 'Solution',
    subtitle:
      "Describe what you've built or are building. Focus on what it does, not what technology it uses.",
    index: 3,
    criteria: [
      {
        key: 'is_solution_described_clearly',
        label: 'What the product/service does is described in plain terms'
      },
      {
        key: 'is_solution_aligned_with_problem',
        label: 'Solution connects clearly to the problem described'
      },
      { key: 'is_user_value_clear', label: 'User value is clear (not just technology)' }
    ]
  },
  why_now: {
    title: 'Why Now',
    subtitle:
      'Why is this the right time to build this? Something has recently changed — in technology, behaviour, regulation, or the market.',
    index: 4,
    criteria: [
      { key: 'something_changed', label: 'Something recently changed is named' },
      {
        key: 'solution_possible',
        label: 'Explains why the change makes your solution possible/urgent now'
      }
    ]
  },
  market_potential: {
    title: 'Market Potential',
    subtitle:
      'How many people or businesses have this problem? Give your best estimate and say where it comes from.',
    index: 5,
    criteria: [
      { key: 'estimated_number', label: 'Gives a number or estimate (not just "a large market")' },
      { key: 'market_person', label: 'Describes who is in the market (not just market size)' },
      { key: 'number_source', label: 'Mentions source of the number/estimate' }
    ]
  },
  competition: {
    title: 'Competition',
    subtitle: 'Who else is solving this problem, and why would customers choose you instead?',
    index: 6,
    criteria: [
      {
        key: 'alternative_named',
        label: 'Names at least one alternative (including doing nothing)'
      },
      {
        key: 'specific_reason',
        label: 'Explains one specific reason customers choose you over alternatives'
      }
    ]
  },
  business_model: {
    title: 'Business Model',
    subtitle: 'How does this make money? Be direct.',
    index: 7,
    criteria: [
      { key: 'payer_named', label: 'Names who pays' },
      { key: 'pay_description', label: 'Describes what they pay for' },
      { key: 'amount_provided', label: 'Gives a rough amount or pricing structure' }
    ]
  },
  team: {
    title: 'Team',
    subtitle: 'Who is working on this and what does each person bring?',
    index: 8,
    criteria: [
      { key: 'team_named', label: 'Names everyone actively working on this' },
      { key: 'team_description', label: 'Describes what each person contributes' },
      {
        key: 'suitable_solver',
        label: 'Explains why you are suited to solve this particular problem'
      }
    ]
  },
  traction: {
    title: 'Traction',
    subtitle:
      'What have you done so far? Users, pilots, interviews, revenue, prototypes — anything counts.',
    index: 9,
    criteria: [
      { key: 'concrete_thing', label: 'Describes at least one concrete milestone achieved' },
      {
        key: 'number_provided',
        label: 'Provides numbers for users, interviews, or revenue if applicable'
      }
    ]
  },
  what_you_need: {
    title: 'What You Need',
    subtitle:
      'What specifically are you asking for? Mentorship, network connections, workshop access, program application — be direct.',
    index: 10,
    criteria: [
      { key: 'need_stated', label: 'States at least one specific request' },
      { key: 'need_next', label: 'Clear on next steps desired' }
    ]
  },
  vision: {
    title: 'Vision',
    subtitle: 'Where is this in 3 to 5 years if it works?',
    index: 11,
    criteria: [
      { key: 'future_described', label: 'Describes a future state bigger than present day' },
      { key: 'logical_connection', label: 'Connects logically to what is being built today' }
    ]
  }
}
