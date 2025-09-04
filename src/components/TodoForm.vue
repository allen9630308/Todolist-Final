<script setup>
import { ref } from 'vue'

const emit = defineEmits(['add-todo'])
const content = ref('')

function submit() {
  const v = content.value.trim()
  if (!v) return
  emit('add-todo', v)
  content.value = ''
}
</script>

<template>
  <form class="todo-form" @submit.prevent="submit">
    <input v-model="content" placeholder="輸入待辦事項..." class="todo-input" />
    <button type="submit" class="add-btn" aria-label="新增">＋</button>
  </form>
</template>

<style scoped>
.todo-form {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.todo-input {
  flex: 1;
  padding: 0.8rem 1rem;
  font-size: 1.2rem;
  border: 4px solid #06d826;
  border-radius: 0.8rem;
  background: #e6fffa;
  color: #0f3d36;
  text-align: center;
}
.todo-input::placeholder {
  font-size: 1.05rem;
}

.add-btn {
  width: 3rem;
  height: 3rem;
  border-radius: 0.8rem;
  border: 0;
  background: #222;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
}
.add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
