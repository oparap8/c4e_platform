<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/store/appStore'
import { frappeCall, frappeInsert, frappeSetValue } from '@/utils/frappe'

const emit   = defineEmits(['close', 'created'])
const store  = useAppStore()
const router = useRouter()

const step     = ref(1)
const ideaName = ref('')
const problem  = ref('')
const solution = ref('')
const stage    = ref('')
const aiFeedback = ref('')
const aiResult   = ref(null)
const aiLoading  = ref(false)
const saving     = ref(false)
const saveError  = ref('')

// Frappe Select options — must match doctype exactly
const STAGES = [
  { key: 'Just an idea in my head',                            label: '💡 Just an idea',      desc: 'Still exploring, not validated yet' },
  { key: 'I know the problem well, haven\'t built anything',   label: '🧪 Validated concept', desc: 'Talked to potential users/customers' },
  { key: 'I have a prototype — something people can see or try', label: '🛠 Prototype / MVP', desc: 'Something built, even if rough' },
  { key: 'I\'ve tested it with real users and have feedback',  label: '💰 Early revenue',     desc: 'Real users have tried it' },
  { key: 'I already have customers or people using it',        label: '🚀 Customers',         desc: 'People are actually using it' },
]

const canNext1 = computed(() => ideaName.value.trim().length > 0)
const canNext2 = computed(() => problem.value.trim().length >= 10 && solution.value.trim().length >= 10)
const canNext3 = computed(() => stage.value !== '')

function close() { emit('close') }
function goStep(n) { step.value = n }

async function fetchAI() {
  if (aiLoading.value) return
  aiLoading.value = true
  aiFeedback.value = ''
  aiResult.value   = null
  try {
    const result = await frappeCall('c4e_platform.api.ai_feedback.get_idea_feedback', {
      student_idea:         ideaName.value.trim(),
      onboarding_problem:   problem.value.trim(),
      onboarding_solution:  solution.value.trim(),
    })
    aiResult.value   = result
    aiFeedback.value = result?.overview || ''
  } catch {
    aiFeedback.value = "Couldn't load feedback right now — but you're ready to start building. Go for it!"
  }
  aiLoading.value = false
}

function toStep4() {
  step.value = 4
  fetchAI()
}

async function saveIdea() {
  saving.value   = true
  saveError.value = ''
  try {
    const doc = await frappeInsert({
      doctype:             'C4E Student Idea',
      student_idea:        ideaName.value.trim(),
      onboarding_problem:  problem.value.trim(),
      onboarding_solution: solution.value.trim(),
      stage:               stage.value,
    })

    // Save AI feedback fields back to the record if we have results
    if (aiResult.value && doc?.name) {
      await frappeSetValue('C4E Student Idea', doc.name, 'ai_feedback', aiResult.value.overview || '')
      if (aiResult.value.industry_tag)
        await frappeSetValue('C4E Student Idea', doc.name, 'industry', aiResult.value.industry_tag)
      if (aiResult.value.approach)
        await frappeSetValue('C4E Student Idea', doc.name, 'approach', aiResult.value.approach)
      if (aiResult.value.ai_stage_recommendation)
        await frappeSetValue('C4E Student Idea', doc.name, 'ai_stage_recommendation', aiResult.value.ai_stage_recommendation)
    }

    emit('created', doc)
    close()
    router.push({ name: 'idea-memo', params: { id: doc.name } })
  } catch (e) {
    saveError.value = e.message
  }
  saving.value = false
}

function handleKeydown(e) {
  if (e.key === 'Escape') close()
}
</script>

<template>
  <div class="modal-overlay" @click.self="close" @keydown="handleKeydown" tabindex="-1">
    <div class="modal-box">

      <!-- Step dots -->
      <div class="step-dots">
        <div v-for="n in 4" :key="n" class="step-dot"
          :class="{ active: n === step, done: n < step }" />
      </div>

      <!-- Step 1: Name -->
      <template v-if="step === 1">
        <div class="modal-title" style="margin-bottom:6px">Name your idea</div>
        <p style="font-size:13px;color:var(--stone);margin-bottom:20px;line-height:1.55">
          What are you calling this venture? You can always rename it later.
        </p>
        <div class="sf">
          <div class="sf-lbl">Idea name</div>
          <input class="inp" placeholder="e.g. AgriLink" v-model="ideaName" autofocus
            @keydown.enter="canNext1 && goStep(2)" />
        </div>
        <div class="modal-foot">
          <button class="btn btn-ghost" @click="close">Cancel</button>
          <button class="btn btn-primary" :disabled="!canNext1" @click="goStep(2)" style="flex:1;justify-content:center">
            Next →
          </button>
        </div>
      </template>

      <!-- Step 2: Problem + Solution -->
      <template v-if="step === 2">
        <div class="modal-title" style="margin-bottom:6px">The problem & solution</div>
        <p style="font-size:13px;color:var(--stone);margin-bottom:20px;line-height:1.55">
          Great ideas solve real problems. What pain point does your idea address?
        </p>
        <div class="sf">
          <div class="sf-lbl">Problem</div>
          <div class="sf-desc">What frustration or gap in the market are you targeting? (min 10 characters)</div>
          <textarea class="ta" rows="3" placeholder="e.g. Farmers lack access to real-time market prices…" v-model="problem" />
        </div>
        <div class="sf">
          <div class="sf-lbl">Your solution</div>
          <div class="sf-desc">How does your idea solve that problem? (min 10 characters)</div>
          <textarea class="ta" rows="3" placeholder="e.g. A mobile app that connects farmers directly to buyers…" v-model="solution" />
        </div>
        <div class="modal-foot">
          <button class="btn btn-ghost" @click="goStep(1)">← Back</button>
          <button class="btn btn-primary" :disabled="!canNext2" @click="goStep(3)" style="flex:1;justify-content:center">
            Next →
          </button>
        </div>
      </template>

      <!-- Step 3: Stage -->
      <template v-if="step === 3">
        <div class="modal-title" style="margin-bottom:6px">Where are you now?</div>
        <p style="font-size:13px;color:var(--stone);margin-bottom:20px;line-height:1.55">
          Be honest — there's no wrong answer. This helps your mentors guide you better.
        </p>
        <div v-for="s in STAGES" :key="s.key"
          class="stage-option"
          :class="{ active: stage === s.key }"
          @click="stage = s.key">
          <div>
            <div class="stage-name">{{ s.label }}</div>
            <div class="stage-desc">{{ s.desc }}</div>
          </div>
          <div class="stage-check"></div>
        </div>
        <div class="modal-foot">
          <button class="btn btn-ghost" @click="goStep(2)">← Back</button>
          <button class="btn btn-primary" :disabled="!canNext3" @click="toStep4" style="flex:1;justify-content:center">
            Get Feedback →
          </button>
        </div>
      </template>

      <!-- Step 4: AI Feedback -->
      <template v-if="step === 4">
        <div class="modal-title" style="margin-bottom:4px">Mentor feedback</div>
        <p style="font-size:13px;color:var(--stone);margin-bottom:16px">
          "{{ ideaName }}" · {{ STAGES.find(s => s.key === stage)?.label }}
        </p>

        <div v-if="aiLoading" style="display:flex;align-items:center;gap:10px;padding:16px 0;color:var(--stone);font-size:13px">
          <div class="spinner"></div>
          Thinking…
        </div>

        <div v-else-if="aiFeedback" class="ai-adv fi">
          <div class="ai-adv-lbl">✦ Mentor says</div>
          <div class="ai-txt" style="white-space:pre-wrap">{{ aiFeedback }}</div>
        </div>

        <div style="margin-top:20px;padding:14px 16px;background:var(--navy-faint);border-radius:12px;border:1px solid rgba(23,58,112,0.1)">
          <div style="font-size:12px;font-weight:700;color:var(--navy);margin-bottom:4px">Your idea summary</div>
          <div style="font-size:12px;color:var(--stone);line-height:1.6">
            <strong>Problem:</strong> {{ problem }}<br/>
            <strong>Solution:</strong> {{ solution }}
          </div>
        </div>

        <p v-if="saveError" style="color:var(--red);font-size:12px;margin-top:8px">{{ saveError }}</p>

        <div class="modal-foot">
          <button class="btn btn-ghost" @click="goStep(3)">← Back</button>
          <button class="btn btn-primary" @click="saveIdea" :disabled="saving || aiLoading" style="flex:1;justify-content:center">
            {{ saving ? 'Saving…' : 'Open Memo →' }}
          </button>
        </div>
      </template>

    </div>
  </div>
</template>
