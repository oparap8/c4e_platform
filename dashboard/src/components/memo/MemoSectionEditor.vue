<script setup>
defineProps({
  section: {
    type: Object,
    required: true
    // { key, name, required, info, checklist: string[] }
  },
  modelValue: { type: String, default: '' }
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="memo-editor fi">
    <div class="memo-editor-head">
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:16px;font-weight:700;color:var(--navy)">{{ section.name }}</span>
        <span v-if="section.required" class="tag tag-red" style="font-size:9px">Required</span>
      </div>
      <div v-if="section.info" style="font-size:13px;color:var(--stone);margin-top:6px;line-height:1.6">
        {{ section.info }}
      </div>
    </div>

    <textarea
      class="ta memo-ta"
      :placeholder="`Write your ${section.name.toLowerCase()} here…`"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />

    <div v-if="section.checklist?.length" class="memo-checklist">
      <div style="font-size:11px;font-weight:700;color:var(--navy);margin-bottom:8px;letter-spacing:.04em;text-transform:uppercase">
        Checklist
      </div>
      <div v-for="item in section.checklist" :key="item" class="ck-item">
        <div class="ck-box" :class="{ on: modelValue?.trim().length > 10 }">
          <svg v-if="modelValue?.trim().length > 10" width="10" height="10" viewBox="0 0 10 10" fill="white">
            <path d="M1.5 5L4 7.5L8.5 3" stroke="white" stroke-width="1.5" stroke-linecap="round" fill="none"/>
          </svg>
        </div>
        <span class="ck-txt" :class="{ on: modelValue?.trim().length > 10 }">{{ item }}</span>
      </div>
    </div>
  </div>
</template>
