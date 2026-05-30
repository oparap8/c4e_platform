<script setup>
import { ref } from 'vue'

const props = defineProps({
  label:       { type: String,  default: 'Attach file' },
  placeholder: { type: Boolean, default: false },        // grayed-out "coming soon" state
  hint:        { type: String,  default: '' }
})

const emit     = defineEmits(['file-selected'])
const file     = ref(null)
const dragging = ref(false)
const inputRef = ref(null)

function onDrop(e) {
  dragging.value = false
  if (props.placeholder) return
  const f = e.dataTransfer?.files?.[0]
  if (f) { file.value = f; emit('file-selected', f) }
}

function onPick(e) {
  const f = e.target.files?.[0]
  if (f) { file.value = f; emit('file-selected', f) }
}
</script>

<template>
  <div
    class="upload-zone"
    :class="{ 'has-file': !!file, placeholder, dragging }"
    @click="!placeholder && inputRef?.click()"
    @dragover.prevent="!placeholder && (dragging = true)"
    @dragleave="dragging = false"
    @drop.prevent="onDrop"
  >
    <span style="font-size:18px">{{ file ? '📎' : placeholder ? '🔒' : '⬆' }}</span>
    <div>
      <div style="font-size:12px;font-weight:600;color:var(--navy)">
        {{ file ? file.name : placeholder ? label + ' (coming soon)' : label }}
      </div>
      <div v-if="hint && !file" style="font-size:11px;color:var(--stone);margin-top:2px">{{ hint }}</div>
      <div v-if="file" style="font-size:11px;color:var(--stone);margin-top:2px">{{ (file.size/1024).toFixed(1) }} KB</div>
    </div>
    <input ref="inputRef" type="file" style="display:none" @change="onPick" />
  </div>
</template>
