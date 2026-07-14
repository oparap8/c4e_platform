<script setup>
import { inject, ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { frappeGetList, frappeSetValue, frappeCall, frappeUpdate } from '@/utils/frappe'

const idea   = inject('idea')
const router = useRouter()
const route  = useRoute()

// 11 sections — keys are Frappe fieldnames (also used as check_memo key argument)
const MEMO_SECTIONS = [
  { key: 'purpose',          name: 'Purpose',          required: true,  info: 'Describe your venture in one clear sentence. Who is it for and what does it do?' },
  { key: 'problem',          name: 'Problem',           required: true,  info: 'What specific problem are you solving? Be concrete — vague problems produce vague solutions.' },
  { key: 'solution',         name: 'Solution',          required: true,  info: 'Explain how your solution fixes the problem. Connect it directly to what you described above.' },
  { key: 'why_now',          name: 'Why Now',           required: true,  info: 'What has changed recently that makes this the right time? Technology, regulation, behaviour shift?' },
  { key: 'market_potential', name: 'Market Potential',  required: true,  info: 'How many people have this problem and how much would they pay to solve it?' },
  { key: 'competition',      name: 'Competition',       required: true,  info: "Who else is trying to solve this? What do you do that they don't?" },
  { key: 'business_model',   name: 'Business Model',    required: true,  info: 'Who pays you, what do they pay for, and roughly how much?' },
  { key: 'team',             name: 'Team',              required: true,  info: 'Who is building this and why are you the right people?' },
  { key: 'traction',         name: 'Traction',          required: false, info: 'What have you done so far? Users, pilots, revenue, partnerships, interviews.' },
  { key: 'what_you_need',    name: 'What Do You Need?', required: false, info: 'What specific help are you looking for from C4E? Be precise, not general.' },
  { key: 'vision',           name: 'Vision',            required: true,  info: 'Where is this going in 5 years? What does success look like at scale?' },
]

// Maps AI criterion keys → doctype checkbox fieldnames + exact doctype labels
const SECTION_CRITERIA = {
  purpose: [
    { criterion: 'person_named',  fieldname: 'has_who_is_helped',           label: "Who you help is named (a specific type of person or business, not 'everyone')" },
    { criterion: 'outcome_clear', fieldname: 'is_described_in_plain_terms', label: 'What you help them do is described in plain terms' },
    { criterion: 'one_sentence',  fieldname: 'is_one_sentence',             label: 'It fits in one sentence' },
  ],
  problem: [
    { criterion: 'problem_described_concretely', fieldname: 'is_problem_described_concretely', label: 'The problem is described concretely — what actually happens' },
    { criterion: 'who_affected',                 fieldname: 'is_who_in_problem',               label: 'You mention who experiences this problem' },
    { criterion: 'significance_shown',           fieldname: 'is_problem_significant',          label: 'You give a sense of how significant the problem is (frequency, cost, frustration)' },
  ],
  solution: [
    { criterion: 'what_it_does_clear',         fieldname: 'is_solution_described_clearly',    label: 'What the product or service does is described in plain terms' },
    { criterion: 'links_to_problem',           fieldname: 'is_solution_aligned_with_problem', label: "It's clear how the solution connects to the problem you described" },
    { criterion: 'user_benefit_not_just_tech', fieldname: 'is_user_value_clear',              label: "You haven't only described the technology — you've described what it does for the user" },
  ],
  why_now: [
    { criterion: 'named_recent_change',          fieldname: 'something_changed', label: "You've named something that has recently changed" },
    { criterion: 'change_makes_solution_needed', fieldname: 'solution_possible', label: "You've explained why that change makes your solution possible or more urgent now" },
  ],
  market_potential: [
    { criterion: 'market_number_estimate_provided', fieldname: 'estimated_number', label: "You've given a number or an estimate (not just 'a large market')" },
    { criterion: 'target_market_mentioned',          fieldname: 'market_person',   label: "You've described who is in the market — not just how big it is" },
    { criterion: 'data_source_mentioned',            fieldname: 'number_source',   label: "You've mentioned where your number comes from, even if it's an estimate" },
  ],
  competition: [
    { criterion: 'competitor_named',               fieldname: 'alternative_named', label: "You've named at least one alternative (including doing nothing or using a manual method)" },
    { criterion: 'competitive_advantage_explained', fieldname: 'specific_reason',  label: "You've explained one specific reason customers would choose you over it" },
  ],
  business_model: [
    { criterion: 'who_pays',                    fieldname: 'payer_named',     label: "You've named who pays" },
    { criterion: 'what_they_pay_for',           fieldname: 'pay_description', label: "You've described what they pay for" },
    { criterion: 'amount_or_pricing_structure', fieldname: 'amount_provided', label: "You've given a rough amount or pricing structure" },
  ],
  team: [
    { criterion: 'everyone_working_named',    fieldname: 'team_named',       label: "You've named everyone actively working on this" },
    { criterion: 'role_description_for_each', fieldname: 'team_description', label: "You've described what each person contributes" },
    { criterion: 'team_skills_match_problem', fieldname: 'suitable_solver',  label: "There's at least one sentence on why you are suited to solve this particular problem" },
  ],
  traction: [
    { criterion: 'one_concrete_thing_done', fieldname: 'concrete_thing',  label: "You've described at least one concrete thing you've done" },
    { criterion: 'if_user_revenue_stated',  fieldname: 'number_provided', label: "If you have users or revenue, you've given a number" },
  ],
  what_you_need: [
    { criterion: 'stated_what_needed',   fieldname: 'need_stated', label: "You've stated at least one specific thing you're asking for" },
    { criterion: 'what_want_next_clear', fieldname: 'need_next',   label: "It's clear what you want next" },
  ],
  vision: [
    { criterion: 'future_bigger_than_now_described', fieldname: 'future_described',   label: "You've described a future state that's bigger than where you are now" },
    { criterion: 'connection_to_current_solution',   fieldname: 'logical_connection', label: 'It connects logically to what you\'re building today' },
  ],
}

const ALL_CHECKBOX_FIELDS = Object.values(SECTION_CRITERIA).flat().map(c => c.fieldname)

const REQUIRED = MEMO_SECTIONS.filter(s => s.required)

const memoName = ref(null)
const data     = ref({})  // { [sectionKey]: string }
const aiFb     = ref({})  // { [sectionKey]: { [criterion]: { pass, reason } } }
const aiLoad   = ref({})
const saved    = ref({})
const checks   = ref({})

const active    = ref('purpose')
const activeSec = computed(() => MEMO_SECTIONS.find(s => s.key === active.value))
const text      = computed(() => data.value[active.value] || '')
const mentorComments = ref([])

function formatDate(dt) {
  if (!dt) return ''
  // Frappe datetime strings are UTC — normalise for consistent parsing across browsers
  const date = new Date(dt.replace(' ', 'T') + 'Z')
  const diffMs = Date.now() - date.getTime()
  const mins  = Math.floor(diffMs / 60_000)
  const hours = Math.floor(diffMs / 3_600_000)
  const days  = Math.floor(diffMs / 86_400_000)
  const weeks = Math.floor(days / 7)

  if (mins < 1)   return 'just now'
  if (mins < 60)  return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7)   return `${days}d ago`
  if (weeks < 4)  return `${weeks}w ago`

  const d = date.getDate()
  const suffix = [11, 12, 13].includes(d) ? 'th'
    : d % 10 === 1 ? 'st' : d % 10 === 2 ? 'nd' : d % 10 === 3 ? 'rd' : 'th'
  return `${d}${suffix} ${date.toLocaleDateString('en-GB', { month: 'long' })}`
}

function setText(val) {
  data.value = { ...data.value, [active.value]: val }
}

function isSectionComplete(key) {
  return (data.value[key] || '').length > 20
}

function hasDraft(key) {
  return (data.value[key] || '').length > 5
}

const completed = computed(() => MEMO_SECTIONS.filter(s => isSectionComplete(s.key)))
const reqDone   = computed(() => REQUIRED.filter(s => isSectionComplete(s.key)).length)
const canSubmit = computed(() => reqDone.value === REQUIRED.length)

const fb        = computed(() => aiFb.value[active.value] || null)
const isLoading = computed(() => !!aiLoad.value[active.value])
const isSaved   = computed(() => !!saved.value[active.value])

// Load memo record on mount
onMounted(async () => {
  try {
    const list = await frappeGetList('C4E Company Memo', {
      filters: { idea: idea.value?.name },
      fields: ['name', ...MEMO_SECTIONS.map(s => s.key), ...ALL_CHECKBOX_FIELDS],
      limit: 1,
    })
    if (list?.[0]) {
      memoName.value = list[0].name
      const populated = {}
      MEMO_SECTIONS.forEach(s => { populated[s.key] = list[0][s.key] || '' })
      data.value = populated
      const loadedChecks = {}
      ALL_CHECKBOX_FIELDS.forEach(f => { loadedChecks[f] = list[0][f] ? 1 : 0 })
      checks.value = loadedChecks

      try {
        mentorComments.value = await frappeCall('c4e_platform.api.get_comments.get_company_memo_comments', { doc_name: memoName.value }) || []
      } catch { /* no comments */ }
    }
  } catch (e) {
    console.error('Failed to load memo', e)
  }
})

async function saveAndFeedback() {
  const val = text.value
  if (!val?.trim() || !memoName.value) return

  aiLoad.value = { ...aiLoad.value, [active.value]: true }
  saved.value  = { ...saved.value,  [active.value]: false }

  // Save to Frappe
  try {
    await frappeSetValue('C4E Company Memo', memoName.value, active.value, val)
  } catch (e) {
    aiLoad.value = { ...aiLoad.value, [active.value]: false }
    console.error('Save failed', e)
    return
  }

  // Get AI checklist feedback
  try {
    const result = await frappeCall('c4e_platform.api.company_memo.check_memo', {
      key:   active.value,
      field: val,
    })
    // result shape: { section_key: { criterion: { pass, reason } } }
    const criteria = result?.[active.value] || {}
    aiFb.value = { ...aiFb.value, [active.value]: criteria }

    // Map AI results to doctype checkbox fields, update local state and save
    const sectionCriteria = SECTION_CRITERIA[active.value] || []
    const checkUpdates = {}
    sectionCriteria.forEach(({ criterion, fieldname }) => {
      checkUpdates[fieldname] = criteria[criterion]?.pass ? 1 : 0
    })
    checks.value = { ...checks.value, ...checkUpdates }
    if (memoName.value && Object.keys(checkUpdates).length) {
      await frappeUpdate('C4E Company Memo', memoName.value, checkUpdates)
    }
  } catch {
    aiFb.value = { ...aiFb.value, [active.value]: null }
  }

  aiLoad.value = { ...aiLoad.value, [active.value]: false }
  saved.value  = { ...saved.value,  [active.value]: true  }
  setTimeout(() => { saved.value = { ...saved.value, [active.value]: false } }, 2500)
}
</script>

<template>
  <div class="memo-shell" v-if="idea">

    <!-- ── Left section list sidebar ── -->
    <aside class="memo-sb">
      <div style="padding:0 12px 14px;border-bottom:1px solid var(--border);margin-bottom:10px">
        <button class="btn btn-ghost btn-sm" style="padding-left:0;margin-bottom:8px;font-size:12px"
          @click="router.push({ name: 'idea-overview', params: { id: route.params.id } })">
          ← Overview
        </button>
        <div style="font-size:11px;color:var(--stone);font-weight:600;margin-bottom:6px">
          {{ idea.student_idea || idea.name }} · Company Memo
        </div>
        <div class="pb-bar" style="margin-bottom:4px">
          <div class="pb-fill" :style="{ width: Math.round(completed.length / MEMO_SECTIONS.length * 100) + '%' }"></div>
        </div>
        <div style="font-size:11px;color:var(--stone)">{{ completed.length }} of {{ MEMO_SECTIONS.length }} sections done</div>
      </div>

      <div
        v-for="sec in MEMO_SECTIONS" :key="sec.key"
        class="sr"
        :class="{ active: active === sec.key, done: isSectionComplete(sec.key) }"
        style="margin:0 8px 3px;padding:8px 11px"
        @click="active = sec.key"
      >
        <div>
          <div style="font-size:12px;font-weight:500">{{ sec.name }}</div>
          <div v-if="!sec.required" style="font-size:10px;color:var(--stone)">Optional</div>
        </div>
        <div style="display:flex;gap:4px;align-items:center">
          <svg v-if="isSectionComplete(sec.key)" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="#1a5c3a" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span v-else-if="hasDraft(sec.key)" style="width:6px;height:6px;border-radius:50%;background:var(--yellow);display:block"></span>
        </div>
      </div>

      <div style="padding:12px;margin-top:4px;border-top:1px solid var(--border)">
        <button class="btn btn-primary btn-sm" style="width:100%;justify-content:center" :disabled="!canSubmit">
          {{ canSubmit ? 'Submit for Review' : `${REQUIRED.length - reqDone} required section${REQUIRED.length - reqDone !== 1 ? 's' : ''} left` }}
        </button>
        <div v-if="canSubmit" style="font-size:10px;color:var(--green);text-align:center;margin-top:6px">All required sections done ✓</div>
      </div>
    </aside>

    <!-- ── Main editor area ── -->
    <div class="memo-main">
      <div style="max-width:560px">
        <div style="margin-bottom:18px">
          <div style="font-size:10px;color:var(--stone);letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px">
            {{ idea.student_idea || idea.name }} · Company Memo
          </div>
          <div style="display:flex;align-items:center;gap:8px;justify-content:space-between">
            <div style="display:flex;align-items:center;gap:8px">
              <div style="font-size:22px;font-weight:700;color:var(--navy)">{{ activeSec?.name }}</div>
              <div style="width:18px;height:18px;border-radius:50%;background:rgba(23,58,112,.1);display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:var(--navy);cursor:pointer"
                :title="activeSec?.info">i</div>
            </div>
            <span v-if="!activeSec?.required" class="tag tag-stone">Optional</span>
          </div>
        </div>

        <!-- Guide checklist -->
        <div class="card" style="margin-bottom:14px">
          <div style="font-size:11px;font-weight:600;color:var(--stone);letter-spacing:.08em;text-transform:uppercase;margin-bottom:9px">What to cover</div>
          <div v-for="item in SECTION_CRITERIA[active] || []" :key="item.criterion" class="ck-item">
            <div class="ck-box" :class="{ on: checks[item.fieldname] }">
              <svg v-if="checks[item.fieldname]" width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="ck-txt" :class="{ on: checks[item.fieldname] }">{{ item.label }}</div>
          </div>
        </div>

        <!-- Textarea -->
        <textarea
          class="ta"
          style="min-height:140px;margin-bottom:12px"
          :placeholder="`Write your ${activeSec?.name} here…`"
          :value="text"
          @input="setText($event.target.value)"
        />

        <!-- Save + status row -->
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px">
          <button class="btn btn-primary" :disabled="isLoading || !text?.trim()" @click="saveAndFeedback">
            <span v-if="isLoading">
              <span class="td"></span><span class="td"></span><span class="td"></span>
              Analysing…
            </span>
            <span v-else>✦ Save and get feedback</span>
          </button>
          <span class="autosave" :class="{ saving: isLoading, saved: isSaved }">
            <template v-if="isSaved">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#1a5c3a" stroke-width="1.5" stroke-linecap="round"/></svg>
              Saved
            </template>
            <span v-else-if="!isLoading" style="font-size:11px;color:var(--stone)">Not saved yet</span>
          </span>
        </div>

        <!-- AI Checklist feedback -->
        <template v-if="fb && !isLoading">
          <div style="font-size:11px;font-weight:600;color:var(--stone);letter-spacing:.08em;text-transform:uppercase;margin-bottom:8px">AI Feedback</div>
          <div
            v-for="(result, criterion) in fb" :key="criterion"
            style="display:flex;align-items:flex-start;gap:10px;padding:10px 14px;border-radius:9px;margin-bottom:6px"
            :style="result.pass ? 'background:rgba(26,92,58,.07);border:1px solid rgba(26,92,58,.15)' : 'background:rgba(193,22,51,.05);border:1px solid rgba(193,22,51,.15)'"
          >
            <div style="margin-top:1px;flex-shrink:0">
              <svg v-if="result.pass" width="14" height="14" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="#1a5c3a" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <svg v-else width="14" height="14" viewBox="0 0 12 12" fill="none">
                <path d="M3 3l6 6M9 3l-6 6" stroke="#c11633" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <div>
              <div style="font-size:12px;font-weight:600" :style="result.pass ? 'color:#1a5c3a' : 'color:#c11633'">
                {{ SECTION_CRITERIA[active]?.find(c => c.criterion === criterion)?.label || criterion }}
              </div>
              <div v-if="!result.pass && result.reason" style="font-size:12px;color:var(--stone);margin-top:3px;line-height:1.5">
                {{ result.reason }}
              </div>
            </div>
          </div>
        </template>

        <div v-if="isLoading" style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--stone);padding:12px 0">
          <div class="spinner"></div> Getting AI feedback…
        </div>

        <!-- Mentor feedback card -->
        <div v-if="mentorComments.length" class="card" style="margin-top:20px;border-left:3px solid var(--navy)">
          <div style="font-size:11px;font-weight:600;color:var(--navy);letter-spacing:.08em;text-transform:uppercase;margin-bottom:10px">Mentor Feedback</div>
          <div
            v-for="(c, i) in mentorComments" :key="i"
            :style="i > 0 ? 'margin-top:12px;padding-top:12px;border-top:1px solid var(--border)' : ''"
          >
            <div style="font-size:13px;color:var(--dark);line-height:1.7;white-space:pre-line">{{ c.content }}</div>
            <div style="font-size:11px;color:var(--stone);margin-top:5px">{{ c.comment_by }} · {{ formatDate(c.modified) }}</div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>
