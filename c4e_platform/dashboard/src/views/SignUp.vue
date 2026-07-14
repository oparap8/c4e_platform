<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/store/appStore'

const router = useRouter()
const route  = useRoute()
const store  = useAppStore()

const mode     = ref('signup') // 'signup' | 'login'
const firstName = ref('')
const email    = ref('')
const password = ref('')
const confirm  = ref('')
const error    = ref('')
const loading  = ref(false)

async function submit() {
  error.value = ''

  if (mode.value === 'signup') {
    if (!firstName.value.trim())      { error.value = 'Please enter your first name.'; return }
    if (!email.value.trim())          { error.value = 'Please enter your email.'; return }
    if (password.value.length < 8)    { error.value = 'Password must be at least 8 characters.'; return }
    if (password.value !== confirm.value) { error.value = 'Passwords do not match.'; return }
    try {
      loading.value = true
      await store.register(firstName.value.trim(), email.value.trim(), password.value)
      // Auto-login after successful registration
      await store.login(email.value.trim(), password.value)
      router.push(route.query.redirect || '/dashboard')
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  } else {
    if (!email.value.trim() || !password.value) { error.value = 'Please fill in all fields.'; return }
    try {
      loading.value = true
      await store.login(email.value.trim(), password.value)
      router.push(route.query.redirect || '/dashboard')
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }
}

function toggleMode() {
  mode.value  = mode.value === 'signup' ? 'login' : 'signup'
  error.value = ''
}
</script>

<template>
  <div class="auth-card fi">
    <div class="auth-logo">
      <div class="auth-logo-name">C4E Platform</div>
      <div class="auth-logo-sub">Center for Entrepreneurship</div>
    </div>

    <template v-if="mode === 'signup'">
      <h2 class="auth-title">Create your account</h2>
      <p class="auth-sub">Join the C4E student platform</p>

      <form class="auth-form" @submit.prevent="submit">
        <input class="auth-inp" type="text" placeholder="First name" v-model="firstName" autocomplete="given-name" />
        <input class="auth-inp" type="email" placeholder="Email address" v-model="email" autocomplete="email" />
        <input class="auth-inp" type="password" placeholder="Password" v-model="password" autocomplete="new-password" />
        <input class="auth-inp" type="password" placeholder="Confirm password" v-model="confirm" autocomplete="new-password" />
        <p class="auth-error" v-if="error">{{ error }}</p>
        <button class="auth-submit" type="submit" :disabled="loading">
          {{ loading ? 'Creating account…' : 'SIGN UP' }}
        </button>
      </form>

      <p class="auth-link">Already have an account? <a @click="toggleMode">Login here</a></p>
    </template>

    <template v-else>
      <h2 class="auth-title">Welcome back</h2>
      <p class="auth-sub">Sign in to your account</p>

      <form class="auth-form" @submit.prevent="submit" style="margin-top: 16px;">
        <input class="auth-inp" type="email" placeholder="Email address" v-model="email" autocomplete="email" />
        <input class="auth-inp" type="password" placeholder="Password" v-model="password" autocomplete="current-password" />
        <p class="auth-error" v-if="error">{{ error }}</p>
        <button class="auth-submit" type="submit" :disabled="loading">
          {{ loading ? 'Signing in…' : 'LOGIN' }}
        </button>
      </form>

      <p class="auth-link">Don't have an account? <a @click="toggleMode">Sign up here</a></p>
    </template>
  </div>
</template>
