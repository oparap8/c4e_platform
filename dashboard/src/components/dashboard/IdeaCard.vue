<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  id:          { type: String, required: true },
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  date:        { type: String, default: '' },
  stage:       { type: String, default: '' }
})

const router = useRouter()
</script>

<template>
  <div class="idea-card" @click="router.push(`/idea/${props.id}`)">
    <div v-if="stage" class="idea-card-stage">{{ stage }}</div>
    <div class="idea-card-title">{{ title }}</div>
    <div class="idea-card-desc">{{ description }}</div>
    <div v-if="date" class="idea-card-date">{{ date }}</div>
  </div>
</template>
