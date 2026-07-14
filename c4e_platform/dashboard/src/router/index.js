import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from '@/store/appStore'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      { path: '', name: 'signup', component: () => import('@/views/SignUp.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('@/layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/Dashboard.vue')
      },
      {
        path: 'idea/:id',
        component: () => import('@/views/IdeaHub.vue'),
        children: [
          {
            path: '',
            name: 'idea-overview',
            component: () => import('@/views/IdeaOverview.vue')
          },
          {
            path: 'memo',
            name: 'idea-memo',
            component: () => import('@/views/MemoView.vue')
          }
        ]
      },
      {
        path: 'dataroom',
        name: 'dataroom',
        component: () => import('@/views/DataRoomView.vue'),
        meta: { requiresAuth: true, requiresBuilder: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory('/dashboard'),
  routes
})

router.beforeEach((to) => {
  const store = useAppStore()

  if (to.meta.requiresAuth && !store.user) {
    return { name: 'signup', query: { redirect: to.fullPath } }
  }

  if (to.meta.requiresBuilder && store.user) {
    const isBuilder = store.user.roles?.includes('C4E Builder')
    if (!isBuilder) return { name: 'dashboard' }
  }
})

export default router
