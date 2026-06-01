import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { useAppStore } from './store/appStore'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

const store = useAppStore()

store.restoreSession().finally(() => {
	app.use(router)
	app.mount('#app')
})
