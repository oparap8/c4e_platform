<script setup>
import { ref, inject } from 'vue'

const idea    = inject('idea')
const story   = ref('')
const loading = ref(false)
const error   = ref('')

const FIELDS = [
  { key: 'problem',  label: 'Problem',       ph: 'Who is hurt by this and how?' },
  { key: 'solution', label: 'Solution',       ph: 'What do you do about it?' },
  { key: 'traction', label: 'Traction',       ph: 'What have you proved so far?' },
  { key: 'ask',      label: 'What you need',  ph: 'What are you asking C4E for?' }
]

const inputs = ref({ problem: '', solution: '', traction: '', ask: '' })

async function generate() {
  if (loading.value) return
  loading.value = true
  error.value   = ''
  story.value   = ''

  const filled = FIELDS.filter(f => inputs.value[f.key]?.trim())
  if (!filled.length) { error.value = 'Fill in at least one field above.'; loading.value = false; return }

  const prompt = `You are a pitch writing coach at a university entrepreneurship center.
A student has shared details about their venture "${idea.value?.title}".

${FIELDS.map(f => inputs.value[f.key] ? `${f.label}: ${inputs.value[f.key]}` : '').filter(Boolean).join('\n')}

Write a compelling 3-4 sentence venture narrative they can use in their pitch deck or memo introduction.
Make it punchy, human, and investor-ready. No bullet points, no preamble. Just the story.`

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': '',
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        messages: [{ role: 'user', content: prompt }]
      })
    })
    const data = await res.json()
    story.value = data.content?.find(b => b.type === 'text')?.text || 'Could not generate story.'
  } catch {
    error.value = 'Network error — check your API key and connection.'
  }
  loading.value = false
}
</script>

<template>
  <div class="story-panel">
    <div style="font-size:13px;font-weight:700;color:var(--navy);margin-bottom:4px">Venture Story Generator</div>
    <div style="font-size:11px;color:var(--stone);margin-bottom:16px;line-height:1.6">
      Fill in the fields and let AI craft your narrative.
    </div>

    <div v-for="f in FIELDS" :key="f.key" style="margin-bottom:10px">
      <div class="sf-lbl" style="margin-bottom:4px">{{ f.label }}</div>
      <textarea class="ta" rows="2" :placeholder="f.ph" v-model="inputs[f.key]" style="min-height:56px;font-size:12px" />
    </div>

    <button class="btn btn-primary" style="width:100%;justify-content:center;margin-top:4px" :disabled="loading" @click="generate">
      <span v-if="loading"><span class="td"></span><span class="td"></span><span class="td"></span></span>
      <span v-else>✦ Generate Story</span>
    </button>

    <div v-if="error" style="margin-top:10px;font-size:12px;color:var(--red)">{{ error }}</div>

    <div v-if="story" class="ai-adv fi" style="margin-top:14px">
      <div class="ai-adv-lbl">✦ Your Venture Story</div>
      <div class="ai-txt">{{ story }}</div>
    </div>
  </div>
</template>
