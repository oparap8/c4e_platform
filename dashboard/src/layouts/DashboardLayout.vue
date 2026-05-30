<script setup>
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/store/appStore'

const store  = useAppStore()
const router = useRouter()
const route  = useRoute()

const notifOpen  = ref(false)
const filesOpen  = ref(false)
const myFiles    = ref([])
const extracted  = ref(false)
const extracting = ref(false)

const isBuilder = computed(() => store.user?.roles?.includes('C4E Builder') ?? false)

function addFiles(e) {
  const incoming = Array.from(e.target.files || [])
  myFiles.value = [...myFiles.value, ...incoming]
  extracted.value = false
  e.target.value = ''
}

function removeFile(i) {
  myFiles.value = myFiles.value.filter((_, idx) => idx !== i)
  if (myFiles.value.length === 0) extracted.value = false
}

function extract() {
  if (extracting.value || myFiles.value.length === 0) return
  extracting.value = true
  const handler = () => {
    extracting.value = false
    extracted.value  = true
    window.removeEventListener('c4e:extractdone', handler)
  }
  window.addEventListener('c4e:extractdone', handler)
  window.dispatchEvent(new CustomEvent('c4e:extract', { detail: { files: myFiles.value } }))
  setTimeout(() => {
    if (extracting.value) {
      extracting.value = false
      extracted.value  = true
      window.removeEventListener('c4e:extractdone', handler)
    }
  }, 8000)
}

const initials = computed(() => {
  const name = store.user?.full_name || store.user?.name || ''
  return name.slice(0, 2).toUpperCase() || '?'
})

const avatarColor = computed(() => {
  const colors = ['#173a70', '#c11633', '#1a5c3a', '#856404', '#1e4d94']
  const seed = (store.user?.email || '').charCodeAt(0) || 0
  return colors[seed % colors.length]
})

const activeNav = computed(() => {
  if (route.name === 'dashboard') return 'home'
  if (route.name === 'idea-memo' || route.name === 'idea-overview') return 'memo'
  if (route.name === 'dataroom') return 'dr'
  return 'home'
})

const contextIdeaId = computed(() => route.params.id ?? store.ideas[0]?.name ?? null)

function navigate(key) {
  if (key === 'home') { router.push({ name: 'dashboard' }); return }
  if (key === 'dr')   { router.push({ name: 'dataroom' });   return }
  if (!contextIdeaId.value) { router.push({ name: 'dashboard' }); return }
  if (key === 'memo') router.push({ name: 'idea-memo', params: { id: contextIdeaId.value } })
}

const NOTIFICATIONS = []

async function logout() {
  await store.logout()
  router.push('/')
}
</script>

<template>
  <div class="shell">
    <!-- ── Sidebar ── -->
    <aside class="sidebar">

      <!-- Logo -->
      <div class="sb-logo">
        <div style="display:flex;align-items:center;gap:9px;margin-bottom:6px">
          <div style="width:26px;height:26px;border-radius:7px;background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <span style="color:#fff;font-size:11px;font-weight:700">C</span>
          </div>
          <div class="sb-logo-name">Center for<br>Entrepreneurship</div>
        </div>
        <div class="sb-logo-sub">C4E Platform · 2026</div>
      </div>

      <!-- Nav items -->
      <div class="sb-sec">
        <div class="sb-sec-label">Navigation</div>

        <div class="sb-item" :class="{ active: activeNav === 'home' }" @click="navigate('home')">
          <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
          </svg>
          <span>Dashboard</span>
        </div>

        <div class="sb-item" :class="{ active: activeNav === 'memo' }" @click="navigate('memo')">
          <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"/>
          </svg>
          <span>Company Memo</span>
        </div>

        <!-- Data Room nav only shown to C4E Builder users -->
        <div v-if="isBuilder" class="sb-item" :class="{ active: activeNav === 'dr' }" @click="navigate('dr')">
          <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
          </svg>
          <span>Data Room</span>
        </div>
      </div>

      <!-- My Files panel -->
      <div style="margin:0 10px 8px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:10px;overflow:hidden">
        <input id="sb-file-input" type="file" multiple accept=".pdf,.doc,.docx,.txt" style="display:none" @change="addFiles" />

        <div style="display:flex;align-items:center;gap:8px;padding:9px 12px;cursor:pointer;user-select:none" @click="filesOpen = !filesOpen">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
          </svg>
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:6px">
              <span style="font-size:11px;font-weight:600;color:rgba(255,255,255,.8)">My Files</span>
              <span v-if="myFiles.length > 0" style="font-size:9px;font-weight:700;background:rgba(255,255,255,.15);color:rgba(255,255,255,.7);padding:1px 6px;border-radius:8px">{{ myFiles.length }}</span>
            </div>
          </div>
          <svg width="12" height="12" viewBox="0 0 20 20" fill="rgba(255,255,255,.35)"
            :style="{ transform: filesOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .2s' }">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </div>

        <div v-if="filesOpen" style="border-top:1px solid rgba(255,255,255,.07);padding:10px 12px">
          <div v-if="myFiles.length > 0" style="margin-bottom:8px;display:flex;flex-direction:column;gap:3px">
            <div v-for="(f, i) in myFiles" :key="i"
              style="display:flex;align-items:center;gap:6px;padding:5px 8px;background:rgba(255,255,255,.06);border-radius:7px">
              <span style="font-size:10px;color:rgba(255,255,255,.65);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ f.name }}</span>
              <button @click="removeFile(i)" style="background:none;border:none;cursor:pointer;padding:2px;color:rgba(255,255,255,.3);font-size:14px">×</button>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:6px">
            <label for="sb-file-input"
              style="display:flex;align-items:center;justify-content:center;gap:5px;padding:7px 10px;border-radius:8px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.08);color:rgba(255,255,255,.75);font-size:11px;font-weight:600;cursor:pointer">
              {{ myFiles.length > 0 ? 'Add more files' : 'Add files' }}
            </label>
            <button v-if="myFiles.length > 0 && !extracted" @click="extract" :disabled="extracting"
              style="padding:7px 10px;border-radius:8px;border:none;background:rgba(74,154,232,.25);color:rgba(255,255,255,.9);font-size:11px;font-weight:600;cursor:pointer">
              {{ extracting ? 'Filling in fields…' : 'Fill in fields' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Notifications panel -->
      <div style="margin:0 10px 8px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:10px;overflow:hidden">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;cursor:pointer;user-select:none" @click="notifOpen = !notifOpen">
          <div style="display:flex;align-items:center;gap:7px">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="rgba(255,255,255,.55)">
              <path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 002 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4a1.5 1.5 0 00-3 0v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
            <span style="font-size:10px;font-weight:700;color:rgba(255,255,255,.5);letter-spacing:.08em;text-transform:uppercase">Notifications</span>
          </div>
          <svg width="12" height="12" viewBox="0 0 20 20" fill="rgba(255,255,255,.35)"
            :style="{ transform: notifOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .2s' }">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </div>
        <div v-if="notifOpen" style="padding:10px 12px">
          <div style="font-size:11px;color:rgba(255,255,255,.35);text-align:center">No notifications yet.</div>
        </div>
      </div>

      <!-- Book office hours -->
      <button class="sb-oh-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(255,255,255,.6)" style="flex-shrink:0">
          <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM7 11h5v5H7z"/>
        </svg>
        <div style="text-align:left">
          <div style="font-size:11px;font-weight:600;color:rgba(255,255,255,.75)">Book office hours</div>
          <div style="font-size:9px;color:rgba(255,255,255,.35);margin-top:1px">60 min session</div>
        </div>
      </button>

      <!-- User avatar -->
      <div class="sb-avatar">
        <div class="sb-av-circle" :style="{ background: avatarColor }">{{ initials }}</div>
        <div style="min-width:0">
          <div class="sb-av-name">{{ store.user?.full_name || store.user?.name }}</div>
          <div class="sb-av-role">{{ store.user?.roles?.[0] || 'Student' }}</div>
        </div>
        <button
          title="Sign out"
          style="margin-left:auto;background:none;border:none;cursor:pointer;color:rgba(255,255,255,.3);font-size:16px;padding:2px;flex-shrink:0"
          @click="logout"
        >×</button>
      </div>
    </aside>

    <!-- ── Main content ── -->
    <main class="main">
      <RouterView />
    </main>
  </div>
</template>
