<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '@/store/appStore'
import IdeaCard from '@/components/dashboard/IdeaCard.vue'
import IdeaWizardModal from '@/components/dashboard/IdeaWizardModal.vue'

const store    = useAppStore()
const showModal = ref(false)

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
})

const displayName = computed(() => store.user?.full_name || store.user?.name || 'Entrepreneur')
const canAdd = computed(() => store.ideas.length < 3)

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function onIdeaCreated() {
  showModal.value = false
  store.loadIdeas()
}

onMounted(() => store.loadIdeas())
</script>

<template>
  <div class="ph">
    <div class="ph-title">{{ greeting }}, {{ displayName }}.</div>
    <div class="ph-sub">Center for Entrepreneurship</div>
  </div>

  <div class="pb">
    <div class="section-head">
      <div>
        <div class="section-title">My Ideas</div>
        <div class="section-sub">{{ store.ideas.length }} / 3 ideas used</div>
      </div>
      <button v-if="canAdd" class="btn btn-primary" @click="showModal = true">
        + Add New Idea
      </button>
    </div>

    <div class="ideas-grid">
      <IdeaCard
        v-for="idea in store.ideas"
        :key="idea.name"
        :id="idea.name"
        :title="idea.student_idea || idea.name"
        :description="idea.onboarding_problem"
        :date="formatDate(idea.modified)"
        :stage="idea.stage"
      />

      <div v-if="canAdd" class="idea-add-card" @click="showModal = true">
        <div class="idea-add-icon">+</div>
        <div class="idea-add-label">Add New Idea</div>
        <div class="idea-add-sub">{{ 3 - store.ideas.length }} slot{{ 3 - store.ideas.length !== 1 ? 's' : '' }} remaining</div>
      </div>
    </div>

    <div v-if="!canAdd" style="margin-top:16px;padding:12px 16px;background:var(--navy-faint);border-radius:10px;font-size:13px;color:var(--navy)">
      You've reached the maximum of 3 ideas. Focus on developing the ones you have!
    </div>
  </div>

  <IdeaWizardModal
    v-if="showModal"
    @close="showModal = false"
    @created="onIdeaCreated"
  />
</template>
