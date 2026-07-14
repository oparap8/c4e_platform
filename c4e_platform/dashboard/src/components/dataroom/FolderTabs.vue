<script setup>
defineProps({
  sections:   { type: Array,  required: true }, // [{ key, name, group }]
  modelValue: { type: String, required: true }  // active section key
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="dr-tabs">
    <div class="dr-tab-group">
      <div style="font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--stone);margin-bottom:6px;padding:0 4px">
        Core Sections
      </div>
      <button
        v-for="sec in sections.filter(s => s.group === 'core')"
        :key="sec.key"
        class="dr-tab"
        :class="{ active: modelValue === sec.key }"
        @click="$emit('update:modelValue', sec.key)"
      >
        {{ sec.name }}
      </button>
    </div>

    <div class="dr-tab-group" style="margin-top:16px">
      <div style="font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--stone);margin-bottom:6px;padding:0 4px">
        Front Door
      </div>
      <button
        v-for="sec in sections.filter(s => s.group === 'frontdoor')"
        :key="sec.key"
        class="dr-tab"
        :class="{ active: modelValue === sec.key }"
        @click="$emit('update:modelValue', sec.key)"
      >
        {{ sec.name }}
      </button>
    </div>
  </div>
</template>
