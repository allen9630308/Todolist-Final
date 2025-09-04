import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import TodoListView from '@/views/TodoListView.vue'
import { getToken } from '@/utils/api'
import { Toast } from '@/utils/toast'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'Home', component: TodoListView, meta: { requiresAuth: true } },
    { path: '/login', name: 'Login', component: LoginView },
    { path: '/register', name: 'Register', component: RegisterView },
    { path: '/:pathMatch(.*)*', redirect: { name: 'Login' } },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to, from, next) => {
  const authed = !!getToken()

  if (to.meta?.title) document.title = `${to.meta.title} | Vue3 TodoList`

  if (to.meta.requiresAuth && !authed) {
    Toast.fire({ icon: 'error', title: '請先登入' })
    return next({ name: 'Login' })
  }
  if ((to.name === 'Login' || to.name === 'Register') && authed) {
    Toast.fire({ icon: 'info', title: '您已登入，無需再註冊或登入' })
    return next({ name: 'Home' })
  }
  next()
})

export default router
