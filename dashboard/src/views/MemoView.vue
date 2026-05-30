<script setup>
import { inject, ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { frappeGetList, frappeSetValue, frappeCall } from '@/utils/frappe'

const idea   = inject('idea')
const router = useRouter()
const route  = useRoute()

// 11 sections — keys are Frappe fieldnames (also used as check_memo key argument)
const MEMO_SECTIONS = [
  { key: 'purpose',        name: 'Purpose',          required: true,  info: 'Describe your venture in one clear sentence. Who is it for and what does it do?',
    checklist: ['Who is it for?', 'What does it do in one sentence?', 'Is it plain language?'] },
  { key: 'problem',        name: 'Problem',           required: true,  info: 'What specific problem are you solving? Be concrete — vague problems produce vague solutions.',
    checklist: ['What specific problem are you solving?', 'Who experiences this problem?', 'What evidence do you have?'] },
  { key: 'solution',       name: 'Solution',          required: true,  info: 'Explain how your solution fixes the problem. Connect it directly to what you described above.',
    checklist: ['What is your proposed solution?', 'How does it connect to the problem?', 'What makes it work?'] },
  { key: 'why_now',        name: 'Why Now',           required: false, info: 'What has changed recently that makes this the right time? Technology, regulation, behaviour shift?',
    checklist: ['What has changed recently?', 'Why hasn\'t this been solved before?'] },
  { key: 'market_potential', name: 'Market Potential', required: true, info: 'How many people have this problem and how much would they pay to solve it?',
    checklist: ['How big is the market?', 'What is your initial target segment?', 'What is your revenue opportunity?'] },
  { key: 'competition',    name: 'Competition',       required: true,  info: 'Who else is trying to solve this? What do you do that they don\'t?',
    checklist: ['Who else is solving this?', 'Why will customers choose you?', 'What is your unfair advantage?'] },
  { key: 'business_model', name: 'Business Model',    required: true,  info: 'Who pays you, what do they pay for, and roughly how much?',
    checklist: ['Who pays you?', 'What do they pay for?', 'Approximately how much?'] },
  { key: 'team',           name: 'Team',              required: true,  info: 'Who is building this and why are you the right people?',
    checklist: ['Who is on your team?', 'Why are you the right people?', 'What relevant experience?'] },
  { key: 'traction',       name: 'Traction',          required: false, info: 'What have you done so far? Users, pilots, revenue, partnerships, interviews.',
    checklist: ['What have you built or tested?', 'Have you spoken to potential customers?', 'Any early results?'] },
  { key: 'what_you_need',  name: 'What Do You Need?', required: true,  info: 'What specific help are you looking for from C4E? Be precise, not general.',
    checklist: ['What specific support are you looking for?', 'What would help most right now?'] },
  { key: 'vision',         name: 'Vision',            required: false, info: 'Where is this going in 5 years? What does success look like at scale?',
    checklist: ['Where do you want this in 5 years?', 'What is the bigger impact?'] },
]

// Checklist criteria per section (from check_memo API response)
const CRITERIA_LABELS = {
  purpose:          { person_named: 'Person or customer named', outcome_clear: 'Outcome is clear', one_sentence: 'Fits in one sentence' },
  problem:          { problem_described_concretely: 'Problem described concretely', who_affected: 'Who is affected', significance_shown: 'Significance shown' },
  solution:         { what_it_does_clear: 'What it does is clear', links_to_problem: 'Links to the problem', user_benefit_not_just_tech: 'User benefit, not just technology' },
  why_now:          { named_recent_change: 'Named a recent change', change_makes_solution_needed: 'Change makes solution needed' },
  market_potential: { market_number_estimate_provided: 'Market number or estimate given', target_market_mentioned: 'Target market mentioned', data_source_mentioned: 'Data source mentioned' },
  competition:      { competitor_named: 'Competitor named', competitive_advantage_explained: 'Competitive advantage explained' },
  business_model:   { who_pays: 'Who pays is named', what_they_pay_for: 'What they pay for is clear', amount_or_pricing_structure: 'Amount or pricing structure given' },
  team:             { everyone_working_named: 'Everyone working is named', role_description_for_each: 'Role described for each', team_skills_match_problem: 'Skills match the problem' },
  traction:         { one_concrete_thing_done: 'One concrete thing done', if_user_revenue_stated: 'Users or revenue stated (if any)' },
  what_you_need:    { stated_what_needed: 'Stated what is needed', what_want_next_clear: 'What you want next is clear' },
  vision:           { future_bigger_than_now_described: 'Future bigger than now described', connection_to_current_solution: 'Connection to current solution' },
}

const REQUIRED = MEMO_SECTIONS.filter(s => s.required)

const memoName = ref(null)
const data     = ref({})  // { [sectionKey]: string }
const aiFb     = ref({})  // { [sectionKey]: { [criterion]: { pass, reason } } }
const aiLoad   = ref({})
const saved    = ref({})

const active    = ref('purpose')
const activeSec = computed(() => MEMO_SECTIONS.find(s => s.key === active.value))
const text      = computed(() => data.value[active.value] || '')

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
      fields: ['name', ...MEMO_SECTIONS.map(s => s.key)],
      limit: 1,
    })
    if (list?.[0]) {
      memoName.value = list[0].name
      const populated = {}
      MEMO_SECTIONS.forEach(s => { populated[s.key] = list[0][s.key] || '' })
      data.value = populated
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

        <!-- Guide checklist (static prompts) -->
        <div class="card" style="margin-bottom:14px">
          <div style="font-size:11px;font-weight:600;color:var(--stone);letter-spacing:.08em;text-transform:uppercase;margin-bottom:9px">What to cover</div>
          <div v-for="(item, i) in activeSec?.checklist" :key="i" class="ck-item">
            <div class="ck-box"></div>
            <div class="ck-txt">{{ item }}</div>
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
                {{ CRITERIA_LABELS[active]?.[criterion] || criterion }}
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
      </div>
    </div>

  </div>
</template>
