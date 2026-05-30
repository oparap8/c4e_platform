<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '@/store/appStore'
import ScenarioModeler from '@/components/dataroom/ScenarioModeler.vue'
import { frappeGetList, frappeInsert, frappeSetValue, frappeCall, frappeUploadFile } from '@/utils/frappe'

const store = useAppStore()

// ── Section definitions ─────────────────────────────────────────────────────
// frappefield : used for set_value when saving text
// apiKey      : passed as `key` to data_room_feedback (= hint doctype fieldname)
//               defaults to frappefield — only differs for company_hook/narrative
// attachField : Frappe Attach fieldname (only for file-upload subs)
const DR_SECTIONS = [
  {
    key: 'market', name: 'Market Research', group: 'core',
    info: 'Prove you understand your customer deeply.',
    subs: [
      { frappefield: 'problem',            apiKey: 'problem',            label: 'Problem and Customer',          desc: 'Who is your customer and what problem do they have?',        ph: 'e.g. Farmers lose 30–50% income to middlemen who control buyer access.' },
      { frappefield: 'market_size',        apiKey: 'market_size',        label: 'Market Size (TAM / SAM / SOM)', desc: 'How big is the opportunity?',                               ph: 'e.g. TAM: 200K+ farmers in Rwanda (NISR 2023). SOM Year 1: 500 farmers.' },
      { frappefield: 'competition_and_edge', apiKey: 'competition_and_edge', label: 'Competition and Your Edge', desc: 'Who else is solving this and why will customers choose you?', ph: 'e.g. No direct SMS-based competitor in Rwanda. Middlemen are the status quo.' },
      { frappefield: 'discovery',          apiKey: 'discovery',          label: 'Customer Conversations',        desc: 'What did you learn from talking to real customers?',         ph: 'e.g. 47 farmers interviewed. 82% said price uncertainty was their biggest problem.' },
    ]
  },
  {
    key: 'product', name: 'Product', group: 'core',
    info: 'Show that your solution exists and is improving based on real feedback.',
    subs: [
      { frappefield: 'stage',    apiKey: 'stage',    label: 'Where You Are Now', desc: 'What stage is the product at?',                    ph: 'e.g. MVP live on WhatsApp. 12 farmers using it weekly.' },
      { frappefield: 'features', apiKey: 'features', label: 'What It Does',      desc: 'Core features today.',                             ph: 'e.g. SMS registration, weekly availability posting, SMS order confirmation.' },
      { frappefield: 'testing',  apiKey: 'testing',  label: 'What Users Said',   desc: 'Feedback you received and what you changed.',      ph: 'e.g. Farmers wanted bulk order option. Added in Week 3.' },
    ]
  },
  {
    key: 'sales', name: 'Sales and Marketing', group: 'core',
    info: 'How do you find customers, convince them, and keep them?',
    subs: [
      { frappefield: 'uvp',              apiKey: 'uvp',              label: 'Why Customers Choose You', desc: 'The one reason a customer picks you over everything else.',  ph: 'e.g. Only platform that gets fair prices to farmers without a smartphone.' },
      { frappefield: 'gtm_strategy',     apiKey: 'gtm_strategy',     label: 'How You Reach Customers',  desc: 'Your channels and approach.',                               ph: 'e.g. Cooperatives, direct farm visits, restaurant procurement managers.' },
      { frappefield: 'traction',         apiKey: 'traction',         label: 'Traction and Revenue',     desc: 'Users, sales, pilots, partnerships — anything real.',       ph: 'e.g. 47 farmers, 12 buyers, 23 orders, RWF 1.2M in 8 weeks.' },
      { frappefield: 'marketing_assets', apiKey: 'marketing_assets', label: 'Marketing Assets',         desc: 'Key marketing materials and brand assets you have created.', ph: 'e.g. Brand identity kit, pitch one-pager, demo video.', upload: true, uploadLabel: 'Attach assets' },
    ]
  },
  {
    key: 'finance', name: 'Finance', group: 'core',
    info: 'Show you understand your numbers.',
    subs: [
      { frappefield: 'financial_history', apiKey: 'financial_history', label: 'Money In and Out So Far', desc: 'What have you spent and where did the money come from?',   ph: 'e.g. Spent RWF 450,000 to date. Bootstrapped from savings.' },
      { frappefield: 'projections',       apiKey: 'projections',       label: 'Next 3 Years',            desc: 'Revenue and cost projections with clear assumptions.',     ph: 'e.g. Year 1: 500 farmers, 2% fee = RWF 10M revenue.' },
      { frappefield: 'unit_economics',    apiKey: 'unit_economics',    label: 'Unit Economics',          desc: 'What it costs to get a customer and what they are worth.', ph: 'e.g. CAC: RWF 8,000. LTV: RWF 60,000. Ratio: 7.5:1.' },
      { frappefield: 'ask',               apiKey: 'ask',               label: 'What You Are Raising',    desc: 'How much and what it will be spent on.',                  ph: 'e.g. Raising RWF 15M pre-seed. 40% engineering, 30% outreach, 30% ops.' },
    ]
  },
  {
    key: 'legal', name: 'Legal', group: 'core',
    info: 'Investors need to know the business is clean and protected.',
    subs: [
      { frappefield: 'business_registration', apiKey: 'business_registration', label: 'Business Registration',     desc: 'Is the business legally registered?',                           ph: 'e.g. Registered as SARL in Rwanda. RDB Certificate No. XXX.',    upload: true, uploadLabel: 'Attach certificate', attachField: 'registration_certificate' },
      { frappefield: 'contracts',             apiKey: 'contracts',             label: 'Agreements',                desc: 'Written agreements with co-founders, team, key suppliers.',     ph: 'e.g. Founder agreement: 60/40 split, 4-year vest, 1-year cliff.', upload: true, uploadLabel: 'Attach agreement',   attachField: 'agreement_contracts' },
      { frappefield: 'ip',                    apiKey: 'ip',                    label: 'IP Protection',             desc: 'Key assets and how you are protecting them.',                  ph: 'e.g. AgriLink trademark filed with OPIC Rwanda (pending).',       upload: true, uploadLabel: 'Attach filing',     attachField: 'ip_filing' },
      { frappefield: 'compliance',            apiKey: 'compliance',            label: 'Regulatory and Compliance', desc: 'Licenses, permits, or regulatory requirements for your sector.', ph: 'e.g. Fintech license application filed with BNR.' },
      { frappefield: 'cap_table',             apiKey: 'cap_table',             label: 'Cap Table',                 desc: 'Current ownership structure.',                                 ph: 'e.g. Founder A: 60%, Founder B: 40%. No external equity yet.',   upload: true, uploadLabel: 'Attach cap table',  attachField: 'cap_table_atttach' },
    ]
  },
  {
    key: 'impact', name: 'Impact and Partnerships', group: 'core',
    info: 'Show the broader impact of your venture and strategic partnerships.',
    subs: [
      { frappefield: 'partnerships',   apiKey: 'partnerships',   label: 'Key Partnerships',  desc: 'Strategic partners, MOUs, pilot agreements, or institutional backing.', ph: 'e.g. MOU with Rwanda Agriculture Board. Pilot with 3 cooperatives in Gasabo.', upload: true, uploadLabel: 'Attach MOU or agreement', attachField: 'signed_agreements' },
      { frappefield: 'impact_metrics', apiKey: 'impact_metrics', label: 'Impact Metrics',    desc: 'How will you measure and report your impact?',                         ph: 'e.g. Number of farmers with improved income. Tonnes of food waste reduced per quarter.' },
      { frappefield: 'testimonials',   apiKey: 'testimonials',   label: 'Testimonials',      desc: 'Quotes or endorsements from users, customers, or partners.',          ph: 'e.g. "This platform gave me a fair price for the first time." — Farmer, Gasabo.' },
    ]
  },
  {
    key: 'pitch', name: 'Pitch Deck', group: 'frontdoor',
    info: '10 to 12 slides covering problem, solution, market, traction, model, team, financials, ask.',
    subs: [
      { frappefield: 'pitch_deck_link', apiKey: null,        label: 'Deck Link',   desc: 'Paste a Canva or Google Slides link.',            ph: 'e.g. https://www.canva.com/design/…', upload: true, uploadLabel: 'Upload deck file', attachField: 'slides' },
      // company_hook saves to Frappe field 'company_hook' but uses apiKey 'narrative' for hint lookup
      { frappefield: 'company_hook',    apiKey: 'narrative', label: 'Your Hook',   desc: 'The one thing investors should remember.',        ph: 'e.g. A farmer can grow 500kg and earn less than the person driving the truck.' },
    ]
  },
]

// ── State ───────────────────────────────────────────────────────────────────
const drName     = ref(null)   // Frappe doc name once loaded/created
const venture    = ref('')     // venture_name field
const industry   = ref('')     // industry field
const program    = ref('')     // c4e_program link

const programs   = ref([])     // list of available C4E Programs
const creating   = ref(false)  // show creation form
const saveError  = ref('')

const activeSec = ref('market')
const fd        = ref({})      // { [frappefield]: string }
const secStatus = ref({})
const aiFb      = ref({})      // { [frappefield]: { ack, adv, flag } }
const aiLoad    = ref({})
const uploads   = ref({})      // { [frappefield]: fileName }

const loading = ref(true)

const sec         = computed(() => DR_SECTIONS.find(s => s.key === activeSec.value))
const st          = computed(() => secStatus.value[activeSec.value] || 'Saved')
const isReviewed  = computed(() => st.value === 'Reviewed')
const isSubmitted = computed(() => st.value === 'Submitted')

function getPct(sKey) {
  const s = DR_SECTIONS.find(x => x.key === sKey)
  if (!s) return 0
  const textSubs = s.subs.filter(f => f.apiKey !== null)
  if (!textSubs.length) return 0
  return Math.round(
    textSubs.filter(f => (fd.value[f.frappefield] || '').trim().length > 20).length / textSubs.length * 100
  )
}

const overall = computed(() =>
  Math.round(DR_SECTIONS.reduce((a, s) => a + getPct(s.key), 0) / DR_SECTIONS.length)
)

function stColor(s) {
  return s === 'Reviewed' ? '#1a5c3a' : s === 'Submitted' ? '#c49000' : '#7a6e62'
}
function stClass(s) {
  return s === 'Reviewed' ? 'tag-green' : s === 'Submitted' ? 'tag-amber' : 'tag-stone'
}

// ── Load on mount ───────────────────────────────────────────────────────────
onMounted(async () => {
  // Fetch available programs (show latest pre-selected)
  try {
    const progs = await frappeGetList('C4E Program', {
      fields: ['name', 'program'],
      limit: 20,
      orderBy: 'creation desc',
    })
    programs.value = progs
    if (progs.length) program.value = progs[0].name
  } catch { /* no programs yet */ }

  // Find existing data room owned by current user
  try {
    const allFields = DR_SECTIONS.flatMap(s => s.subs.map(f => f.frappefield))
    const list = await frappeGetList('C4E Data Room', {
      filters: { owner: store.user?.email },
      fields: ['name', 'venture_name', 'industry', 'c4e_program', ...allFields],
      limit: 1,
      orderBy: 'creation desc',
    })
    if (list?.[0]) {
      const rec       = list[0]
      drName.value    = rec.name
      venture.value   = rec.venture_name || ''
      industry.value  = rec.industry || ''
      program.value   = rec.c4e_program || program.value
      const populated = {}
      DR_SECTIONS.forEach(s => s.subs.forEach(f => {
        populated[f.frappefield] = rec[f.frappefield] || ''
      }))
      fd.value = populated
    } else {
      creating.value = true
    }
  } catch {
    creating.value = true
  }
  loading.value = false
})

// ── Create new data room ────────────────────────────────────────────────────
async function createDataRoom() {
  saveError.value = ''
  if (!venture.value.trim() || !industry.value.trim() || !program.value) {
    saveError.value = 'Please fill in venture name, industry, and select a program.'
    return
  }
  try {
    const doc = await frappeInsert({
      doctype:       'C4E Data Room',
      venture_name:  venture.value.trim(),
      industry:      industry.value.trim(),
      c4e_program:   program.value,
    })
    drName.value   = doc.name
    creating.value = false
  } catch (e) {
    saveError.value = e.message
  }
}

// ── Save field + AI feedback ────────────────────────────────────────────────
async function saveField(sub) {
  if (!drName.value) return
  const txt = fd.value[sub.frappefield] || ''
  if (!txt.trim()) return

  aiLoad.value = { ...aiLoad.value, [sub.frappefield]: true }

  // 1. Save to Frappe
  try {
    await frappeSetValue('C4E Data Room', drName.value, sub.frappefield, txt)
  } catch (e) {
    aiLoad.value = { ...aiLoad.value, [sub.frappefield]: false }
    console.error('Save failed', e)
    return
  }

  // 2. AI feedback (skip if no apiKey, e.g. pitch_deck_link is a URL field)
  if (sub.apiKey) {
    try {
      const result = await frappeCall('c4e_platform.api.data_room.data_room_feedback', {
        venture_name: venture.value,
        industry:     industry.value,
        key:          sub.apiKey,
        field:        txt,
      })
      aiFb.value = { ...aiFb.value, [sub.frappefield]: result }
    } catch {
      aiFb.value = { ...aiFb.value, [sub.frappefield]: { ack: 'Saved.', adv: null, flag: null } }
    }
  }

  aiLoad.value = { ...aiLoad.value, [sub.frappefield]: false }
}

// ── File upload ─────────────────────────────────────────────────────────────
async function onFileInput(e, sub) {
  const file = e.target.files?.[0]
  e.target.value = ''
  if (!file || !drName.value || !sub.attachField) return

  try {
    const result = await frappeUploadFile(file, 'C4E Data Room', drName.value, sub.attachField)
    uploads.value = { ...uploads.value, [sub.frappefield]: file.name }
    // Also store the URL back in the text field for pitch_deck_link
    if (sub.frappefield === 'pitch_deck_link' && result?.file_url) {
      fd.value = { ...fd.value, pitch_deck_link: result.file_url }
    }
  } catch (e) {
    console.error('Upload failed', e)
  }
}

function removeFile(sub) {
  uploads.value = { ...uploads.value, [sub.frappefield]: null }
}

function submitSection() {
  secStatus.value = { ...secStatus.value, [activeSec.value]: 'Submitted' }
}
</script>

<template>
  <div v-if="loading" style="padding:60px;text-align:center;color:var(--stone);font-size:13px">
    Loading…
  </div>

  <!-- ── Creation form ── -->
  <div v-else-if="creating" class="pb fi" style="max-width:460px;margin:0 auto;padding-top:40px">
    <div style="font-size:22px;font-weight:700;color:var(--navy);margin-bottom:6px">Set up your Data Room</div>
    <p style="font-size:13px;color:var(--stone);margin-bottom:28px;line-height:1.6">
      Your data room is a dedicated investor-facing portfolio. Fill in the details below to get started.
    </p>

    <div class="sf">
      <div class="sf-lbl">Venture Name</div>
      <input class="inp" placeholder="e.g. AgriLink" v-model="venture" />
    </div>

    <div class="sf">
      <div class="sf-lbl">Industry</div>
      <input class="inp" placeholder="e.g. AgriTech" v-model="industry" />
    </div>

    <div class="sf">
      <div class="sf-lbl">C4E Program</div>
      <select class="inp" v-model="program">
        <option value="" disabled>Select your program</option>
        <option v-for="p in programs" :key="p.name" :value="p.name">{{ p.program || p.name }}</option>
      </select>
    </div>

    <p v-if="saveError" style="color:var(--red);font-size:12px;margin-bottom:12px">{{ saveError }}</p>

    <button class="btn btn-primary" style="width:100%;justify-content:center" @click="createDataRoom">
      Create Data Room →
    </button>
  </div>

  <!-- ── Main data room view ── -->
  <div v-else>

    <!-- Page header -->
    <div class="ph" style="flex-direction:column;align-items:flex-start">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;width:100%">
        <div>
          <div style="font-size:10px;color:var(--stone);letter-spacing:.1em;text-transform:uppercase;margin-bottom:5px">
            {{ venture }} · Center for Entrepreneurship
          </div>
          <div class="ph-title">Investment Readiness Portfolio</div>
          <div class="ph-sub">Fill in each section and submit for mentor review when ready.</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:26px;font-weight:700;color:var(--navy)">{{ overall }}%</div>
          <div style="font-size:11px;color:var(--stone)">Overall</div>
          <div class="pb-bar" style="width:80px;margin-top:4px">
            <div class="pb-fill" :style="{ width: overall + '%', background: overall === 100 ? 'var(--green)' : 'var(--navy)' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Body -->
    <div class="pb">
      <div style="display:flex;gap:20px">

        <!-- Left: section list -->
        <div style="width:210px;flex-shrink:0">
          <div style="font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--light);padding:6px 12px 4px;font-weight:600">
            Core Sections
          </div>
          <div
            v-for="s in DR_SECTIONS.filter(s => s.group === 'core')" :key="s.key"
            class="sr" :class="{ active: activeSec === s.key, done: secStatus[s.key] === 'Reviewed' }"
            @click="activeSec = s.key"
          >
            <div style="flex:1;min-width:0">
              <div style="font-size:12px;font-weight:500;line-height:1.3">{{ s.name }}</div>
              <div class="pb-bar" style="margin-top:5px;height:3px">
                <div class="pb-fill" :style="{ width: getPct(s.key) + '%', background: stColor(secStatus[s.key] || 'Saved') }"></div>
              </div>
              <div style="font-size:10px;color:var(--stone);margin-top:2px;display:flex;justify-content:space-between">
                <span>{{ getPct(s.key) }}%</span>
                <span :style="{ color: stColor(secStatus[s.key] || 'Saved'), fontWeight: 500 }">{{ secStatus[s.key] || 'Saved' }}</span>
              </div>
            </div>
          </div>

          <div style="font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--light);padding:10px 12px 4px;font-weight:600">
            Investor Facing
          </div>
          <div
            v-for="s in DR_SECTIONS.filter(s => s.group === 'frontdoor')" :key="s.key"
            class="sr" :class="{ active: activeSec === s.key, done: secStatus[s.key] === 'Reviewed' }"
            @click="activeSec = s.key"
          >
            <div style="flex:1;min-width:0">
              <div style="font-size:12px;font-weight:500;line-height:1.3">{{ s.name }}</div>
              <div class="pb-bar" style="margin-top:5px;height:3px">
                <div class="pb-fill" :style="{ width: getPct(s.key) + '%', background: stColor(secStatus[s.key] || 'Saved') }"></div>
              </div>
              <div style="font-size:10px;color:var(--stone);margin-top:2px;display:flex;justify-content:space-between">
                <span>{{ getPct(s.key) }}%</span>
                <span :style="{ color: stColor(secStatus[s.key] || 'Saved'), fontWeight: 500 }">{{ secStatus[s.key] || 'Saved' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: active section -->
        <div style="flex:1;min-width:0">

          <!-- Section title row -->
          <div style="margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;gap:12px">
            <div style="display:flex;align-items:center;gap:8px">
              <div style="font-size:18px;font-weight:700;color:var(--navy)">{{ sec?.name }}</div>
              <div
                style="width:18px;height:18px;border-radius:50%;background:rgba(23,58,112,.1);display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:var(--navy);cursor:pointer;flex-shrink:0"
                :title="sec?.info"
              >i</div>
            </div>
            <span :class="['tag', stClass(st)]">{{ st }}</span>
          </div>

          <!-- Submit bar -->
          <div v-if="isReviewed" class="submit-bar reviewed" style="margin-bottom:20px">
            <div style="display:flex;align-items:center;gap:8px">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 8l4 4 8-8" stroke="#1a5c3a" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <div>
                <div style="font-size:13px;font-weight:600;color:var(--green)">Reviewed by mentor</div>
                <div style="font-size:11px;color:var(--mid)">This section is locked.</div>
              </div>
            </div>
          </div>
          <div v-else-if="isSubmitted" class="submit-bar submitted" style="margin-bottom:20px">
            <div>
              <div style="font-size:13px;font-weight:600;color:#856404">Waiting for mentor review</div>
              <div style="font-size:11px;color:var(--mid)">Your mentor will review it soon.</div>
            </div>
          </div>
          <div v-else class="submit-bar" style="margin-bottom:20px">
            <div>
              <div style="font-size:13px;font-weight:600;color:var(--navy)">Submit this section for review</div>
              <div style="font-size:11px;color:var(--mid)">When you are happy with it, send it to your mentor.</div>
            </div>
            <button
              class="btn btn-primary btn-sm"
              style="flex-shrink:0"
              :style="{ opacity: getPct(activeSec) === 0 ? 0.4 : 1, cursor: getPct(activeSec) === 0 ? 'not-allowed' : 'pointer' }"
              @click="getPct(activeSec) > 0 && submitSection()"
            >
              Submit section
            </button>
          </div>

          <!-- Finance: Scenario Modeler -->
          <ScenarioModeler v-if="activeSec === 'finance'" />

          <!-- Sub-fields -->
          <div v-for="sub in sec?.subs" :key="sub.frappefield" class="sf">

            <div style="font-size:12px;font-weight:600;color:var(--dark);margin-bottom:2px">{{ sub.label }}</div>
            <div class="sf-desc">{{ sub.desc }}</div>

            <!-- Read-only when reviewed -->
            <div
              v-if="isReviewed"
              style="font-size:13px;color:var(--dark);line-height:1.7;background:var(--navy-faint);padding:9px 12px;border-radius:7px"
            >
              <span v-if="fd[sub.frappefield]">{{ fd[sub.frappefield] }}</span>
              <span v-else style="color:var(--light);font-style:italic">Not filled in.</span>
            </div>

            <!-- Textarea -->
            <textarea
              v-else
              class="ta"
              style="min-height:72px"
              :placeholder="sub.ph"
              v-model="fd[sub.frappefield]"
            />

            <!-- Save + feedback button (only for text fields that have an apiKey or are pitch_deck_link) -->
            <div v-if="!isReviewed && sub.frappefield !== 'pitch_deck_link'" style="display:flex;align-items:center;gap:10px;margin-top:6px">
              <button
                class="btn btn-primary btn-sm"
                :disabled="aiLoad[sub.frappefield] || !(fd[sub.frappefield] || '').trim()"
                @click="saveField(sub)"
              >
                <span v-if="aiLoad[sub.frappefield]">
                  <span class="td"></span><span class="td"></span><span class="td"></span>
                  Saving…
                </span>
                <span v-else>✦ Save and check</span>
              </button>
            </div>

            <!-- AI feedback boxes -->
            <template v-if="aiFb[sub.frappefield] && !aiLoad[sub.frappefield]">
              <div v-if="aiFb[sub.frappefield].ack" class="ai-ok" style="margin-top:8px">
                <div class="ai-ok-lbl">✓ AI MENTOR</div>
                <div class="ai-txt">{{ aiFb[sub.frappefield].ack }}</div>
              </div>
              <div v-if="aiFb[sub.frappefield].flag?.item" class="ai-flag" style="margin-top:6px">
                <div class="ai-flag-lbl">⚑ {{ aiFb[sub.frappefield].flag.item }}</div>
                <div class="ai-txt">{{ aiFb[sub.frappefield].flag.prompt }}</div>
              </div>
              <div v-if="aiFb[sub.frappefield].adv" class="ai-adv" style="margin-top:6px">
                <div class="ai-adv-lbl">✦ SUGGESTION</div>
                <div class="ai-txt">{{ aiFb[sub.frappefield].adv }}</div>
              </div>
            </template>

            <!-- File upload zone -->
            <template v-if="sub.upload && !isReviewed">
              <input
                type="file"
                :id="`upload-${sub.frappefield}`"
                style="display:none"
                @change="onFileInput($event, sub)"
              />
              <label
                v-if="!uploads[sub.frappefield]"
                :for="`upload-${sub.frappefield}`"
                class="upload-zone"
                style="cursor:pointer;margin-top:6px"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--stone);flex-shrink:0">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
                </svg>
                <div>
                  <div style="font-size:12px;font-weight:500;color:var(--navy)">{{ sub.uploadLabel }}</div>
                  <div style="font-size:10px;color:var(--stone)">Click to attach a file</div>
                </div>
              </label>
              <div v-else class="upload-zone has-file" style="margin-top:6px">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" style="color:var(--green);flex-shrink:0">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <div style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;font-weight:500;color:var(--green)">
                  {{ uploads[sub.frappefield] }}
                </div>
                <button style="background:none;border:none;cursor:pointer;padding:2px;color:var(--stone)" @click="removeFile(sub)">✕</button>
              </div>
            </template>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
