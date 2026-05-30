import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { useAppStore } from './store/appStore'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const store = useAppStore()

// Restore session before mounting so the router guard sees the correct
// user state on first load instead of always redirecting to signup.
store.restoreSession().finally(() => {
	app.mount('#app')
})
