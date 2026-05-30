<script setup>
import { ref, provide, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { frappeGet } from '@/utils/frappe'

const route  = useRoute()
const router = useRouter()

const idea    = ref(null)
const loading = ref(true)

async function fetchIdea() {
  loading.value = true
  try {
    idea.value = await frappeGet('C4E Student Idea', route.params.id)
  } catch {
    router.replace({ name: 'dashboard' })
  } finally {
    loading.value = false
  }
}

// Re-fetch if the route param changes (user navigates between ideas)
watch(() => route.params.id, fetchIdea)
onMounted(fetchIdea)

provide('idea', idea)
</script>

<template>
  <RouterView v-if="!loading && idea" />
  <div v-else-if="loading" style="padding:40px;text-align:center;color:var(--stone);font-size:13px">
    Loading…
  </div>
</template>
