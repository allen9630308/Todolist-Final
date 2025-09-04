<template>
  <div class="container">
    <h2>註冊帳戶</h2>
    <form @submit.prevent="onSubmit" novalidate>
      <div class="user box">
        <input v-model.trim="name" type="text" id="username" name="nickname" placeholder=" " />
        <label for="username">名稱</label>
        <span v-show="showErrors && !nameValid">不能為空白、必須在40字以內！</span>
      </div>

      <div class="email box">
        <input v-model.trim="email" type="text" id="email" name="email" placeholder=" " />
        <label for="email">信箱</label>
        <span v-show="showErrors && !emailValid">不能為空白、必須包含 @ 符號！</span>
      </div>

      <div class="password box">
        <input v-model="password" type="password" id="password" name="password" placeholder=" " />
        <label for="password">密碼</label>
        <span v-show="showErrors && !passwordValid"
          >不能為空白、必須在8字以上、必須在100字以內！</span
        >
      </div>

      <div class="password-confirm box">
        <input v-model="confirmPassword" type="password" id="confirmPassword" placeholder=" " />
        <label for="confirmPassword">再次輸入密碼</label>
        <span v-show="showErrors && password !== confirmPassword">兩次輸入的密碼不一致</span>
      </div>

      <button type="submit" id="submit" :disabled="loading">
        {{ loading ? '送出中…' : '註冊' }}
      </button>
      <button type="button" class="btn-to-login" @click="goLogin">登入</button>
    </form>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-size: 10px;
  letter-spacing: 1px;
  color: #fff;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0 auto;
  padding: 50px;
  border-radius: 12px;

  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.6);
}

.container h2 {
  margin-bottom: 50px;
  font-size: 1.5rem;
  letter-spacing: 3px;
  color: #0000c6;
}

.container button {
  display: block;
  width: 50%;
  margin: 12px auto 0;
  padding: 10px;
  background-color: transparent;
  border: 3px solid #5b00ae;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1rem;
  color: #5b00ae;
  transition: all 0.3s;
  backdrop-filter: blur(5px);
}
.container button:hover {
  border: 3px solid aqua;
  color: aqua;
  transform: scale(1.05);
}

.container .box {
  position: relative;
  margin-bottom: 28px;
}

.container .box label {
  position: absolute;
  top: 8px;
  left: 0;
  font-size: 1rem;
  color: #004b97;
  transition: all 0.25s ease;
  pointer-events: none;
}

.container .box input {
  width: 300px;
  padding: 10px 0;
  margin-bottom: 3px;
  background-color: transparent;
  border: 0;
  border-bottom: 2px solid rgba(255, 255, 255, 0.5);
  outline: none;
  font-size: 1rem;
  color: #fff;
}

.container .box input:focus ~ label,
.container .box input:not(:placeholder-shown) ~ label {
  top: -20px;
  font-size: 1rem;
  color: #ffd306;
  background-color: transparent;
}

.container .box span {
  color: red;
  transition: all 0.2s;
  font-size: 0.75rem;
}

.container .btn-to-login {
  color: black;
  border-color: black;
}
.container .btn-to-login:hover {
  border: 3px solid white;
  color: white;
  transform: scale(1.05);
}
</style>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '@/utils/api'
import { Toast } from '@/utils/toast'

const showErrors = ref(false)
const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)

const nameValid = computed(() => {
  const v = name.value.trim()
  return v.length > 0 && v.length <= 40
})
const emailValid = computed(() => {
  const v = email.value.trim()
  return v.length > 0 && v.includes('@')
})
const passwordValid = computed(() => {
  const len = password.value.length
  return len >= 8 && len <= 100
})
const confirmValid = computed(() => {
  return confirmPassword.value === password.value && confirmPassword.value.length > 0
})
function goLogin() {
  router.push('/login')
}

async function onSubmit() {
  if (!nameValid.value || !emailValid.value || !passwordValid.value || !confirmValid.value) {
    showErrors.value = true
    return
  }
  try {
    loading.value = true
    await authApi.signUp({
      email: email.value,
      password: password.value,
      nickname: name.value,
    })

    Toast.fire({ icon: 'success', title: '註冊成功，請登入' })
    router.push('/login')
  } catch (e) {
    const msg = e?.response?.data?.message || e.message || '註冊失敗，請稍後再試'
    console.error('註冊失敗:', e)
    Toast.fire({ icon: 'error', title: msg })
  } finally {
    loading.value = false
  }
}
</script>
