import { setupLayouts } from 'virtual:generated-layouts'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'

import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router/auto'
import App from './App.vue'
import type { UserModule } from './types'

import '@unocss/reset/tailwind-compat.css'
import './styles/main.scss'
import 'uno.css'

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(),
  extendRoutes: routes => setupLayouts(routes),
})

Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }))
  .forEach(i => i.install?.({
    app,
    isClient: true,
    router,
  }))

const pinia = createPinia()

app
  .use(pinia)
  .use(router)
  .use(PrimeVue)
  .use(ToastService)
app.mount('#app')
