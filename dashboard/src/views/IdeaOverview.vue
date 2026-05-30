<script setup>
import { inject, computed, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { frappeGetList } from '@/utils/frappe'

const idea   = inject('idea')
const router = useRouter()
const route  = useRoute()

// Frappe fieldnames for the 11 memo sections
const MEMO_KEYS = [
  'purpose', 'problem', 'solution', 'why_now', 'market_potential',
  'competition', 'business_model', 'team', 'traction', 'what_you_need', 'vision'
]
const REQUIRED = [
  'purpose', 'problem', 'solution', 'market_potential',
  'competition', 'business_model', 'team', 'what_you_need'
]

const memo    = ref(null)
const memoLoading = ref(true)

onMounted(async () => {
  try {
    const list = await frappeGetList('C4E Company Memo', {
      filters: { idea: idea.value?.name },
      fields: ['name', ...MEMO_KEYS],
      limit: 1,
    })
    memo.value = list?.[0] || null
  } catch {
    memo.value = null
  } finally {
    memoLoading.value = false
  }
})

const memoPct = computed(() => {
  if (!memo.value) return 0
  const done = MEMO_KEYS.filter(k => memo.value[k]?.trim()).length
  return Math.round(done / MEMO_KEYS.length * 100)
})

const requiredDone = computed(() => {
  if (!memo.value) return 0
  return REQUIRED.filter(k => memo.value[k]?.trim()).length
})

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<template>
  <div class="pb fi">
    <!-- Progress cards -->
    <div class="grid2" style="gap:20px;margin-bottom:28px">
      <!-- Memo card -->
      <div class="card" style="cursor:pointer"
        @click="router.push({ name: 'idea-memo', params: { id: route.params.id } })">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
          <div style="font-size:14px;font-weight:700;color:var(--navy)">Company Memo</div>
          <span style="font-size:22px">📝</span>
        </div>
        <div class="pb-bar" style="margin-bottom:8px">
          <div class="pb-fill" :style="{ width: memoPct + '%' }"></div>
        </div>
        <div style="font-size:12px;color:var(--stone)">
          {{ memoLoading ? 'Loading…' : `${memoPct}% complete · ${requiredDone} / ${REQUIRED.length} required sections done` }}
        </div>
        <div style="margin-top:14px">
          <span class="btn btn-outline btn-sm">Open Memo →</span>
        </div>
      </div>
    </div>

    <!-- Idea details -->
    <div class="card">
      <div style="font-size:14px;font-weight:700;color:var(--navy);margin-bottom:16px">
        {{ idea?.student_idea || idea?.name }}
      </div>
      <div class="sf">
        <div class="sf-lbl">Problem</div>
        <div style="font-size:13px;color:var(--mid);line-height:1.6">{{ idea?.onboarding_problem || '—' }}</div>
      </div>
      <div class="sf">
        <div class="sf-lbl">Solution</div>
        <div style="font-size:13px;color:var(--mid);line-height:1.6">{{ idea?.onboarding_solution || '—' }}</div>
      </div>
      <div style="display:flex;gap:10px;margin-top:4px">
        <div>
          <div class="sf-lbl">Stage</div>
          <span class="tag tag-navy">{{ idea?.stage || '—' }}</span>
        </div>
        <div>
          <div class="sf-lbl">Created</div>
          <div style="font-size:12px;color:var(--stone);font-family:'DM Mono',monospace">
            {{ formatDate(idea?.creation) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
