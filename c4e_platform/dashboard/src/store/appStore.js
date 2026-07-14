import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  frappeCall,
  frappeLogin,
  frappeLogout,
  frappeGetCurrentUser,
  frappeGetUserInfo,
} from '@/utils/frappe'

export const useAppStore = defineStore('app', () => {
  const user  = ref(null)  // { name, email, full_name, roles[] }
  const ideas = ref([])

  async function register(first_name, email, password) {
    await frappeCall('c4e_platform.api.auth.register', { first_name, email, password })
  }

  async function login(email, password) {
    await frappeLogin(email, password)
    await _loadSession()
  }

  async function logout() {
    await frappeLogout()
    user.value  = null
    ideas.value = []
  }

  async function loadIdeas() {
    ideas.value = await frappeCall(
      'c4e_platform.api.student_idea.get_student_ideas_for_current_user'
    )
  }

  async function restoreSession() {
    const email = await frappeGetCurrentUser()
    if (!email || email === 'Guest') {
      user.value = null
      return
    }
    await _loadSession()
  }

  async function _loadSession() {
    const email = await frappeGetCurrentUser()
    if (!email || email === 'Guest') { user.value = null; return }
    const [info, roles] = await Promise.all([
      frappeGetUserInfo(email),
      frappeCall('c4e_platform.api.auth.get_current_user_roles'),
    ])
    user.value  = {
      name:      info?.name || email,
      email,
      full_name: info?.full_name || email,
      roles:     roles || [],
    }
    await loadIdeas()
  }

  return {
    user, ideas,
    register, login, logout,
    loadIdeas, restoreSession,
  }
})
