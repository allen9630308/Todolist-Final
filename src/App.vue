<template>
  <div class="app-wrapper">
    <a v-if="showLogout" href="#" class="logout-link" @click="logout">登出</a>
    <nav>
      <router-link to="/">TodoList</router-link> | <router-link to="/login">Login</router-link> |
      <router-link to="/register">Register</router-link>
    </nav>
    <h1 class="page-title">歡迎來到我的 ToDo List</h1>
  </div>
  <router-view :key="$route.fullPath" />
</template>

<style>
body {
  background-image: url('@/assets/background.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
}
.page-title {
  text-align: center;
  font-size: 2rem;
  margin: 30px auto;
  color: #ffffff;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.7);
}

.logout-link {
  position: absolute;
  top: 10px;
  right: 12px;
  z-index: 99999;
  font-size: 1.3rem;
  font-weight: bold;
  color: #00ffff;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
}

.logout-link:hover {
  color: orange;
}
</style>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
import { authApi, clearToken } from '@/utils/api'

const router = useRouter()
const route = useRoute()

const showLogout = computed(() => route.name !== 'Login' && route.name !== 'Register')

async function onLogout(e) {
  e?.preventDefault()
  try {
    await authApi.signOut()
  } catch (err) {
    console.error('signOut error:', err)
  } finally {
    clearToken()
    router.replace({ name: 'Login' })
  }
}

const logout = onLogout
</script>
