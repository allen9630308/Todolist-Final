<script setup>
import { ref, computed, onMounted } from 'vue'
import { Toast } from '@/utils/toast'
import TodoForm from '@/components/TodoForm.vue'
import TodoList from '@/components/TodoList.vue'
import { todoApi } from '@/utils/api'

const todos = ref([])
const loading = ref(true)
const filterStatus = ref('all')
const remaining = computed(() => todos.value.filter((t) => !t.completed).length)

function normalize(t) {
  // 盡量容錯：常見欄位都對應起來
  return {
    id: t.id ?? t._id ?? t.uuid ?? String(Math.random()),
    content: t.content ?? t.title ?? '',
    completed: Boolean(t.completed ?? t.status ?? t.isDone ?? false),
  }
}

async function fetchTodos() {
  loading.value = true
  try {
    const data = await todoApi.getTodos()
    const list = Array.isArray(data) ? data : (data.todos ?? data.data ?? [])
    todos.value = list.map(normalize)
  } catch (e) {
    Toast.fire({ icon: 'error', text: e?.message ?? '讀取清單失敗' })
  } finally {
    loading.value = false
  }
}

async function addTodo(content) {
  try {
    await todoApi.create({ content })
    await fetchTodos() // 簡單保險
    Toast.fire({ icon: 'success', title: '新增成功' })
  } catch (e) {
    Toast.fire({ icon: 'error', text: e?.message ?? '新增失敗' })
  }
}

async function removeTodo(id) {
  try {
    await todoApi.remove(id)
    // 本地更新，減少一次請求
    todos.value = todos.value.filter((t) => t.id !== id)
  } catch (e) {
    Toast.fire({ icon: 'error', text: e?.message ?? '刪除失敗' })
  }
}

async function toggleTodo(id) {
  try {
    await todoApi.toggle(id)
    const t = todos.value.find((x) => x.id === id)
    if (t) t.completed = !t.completed
  } catch (e) {
    Toast.fire({ icon: 'error', text: e?.message ?? '切換狀態失敗' })
  }
}

onMounted(fetchTodos)
</script>

<template>
  <div class="todo-shell">
    <TodoForm @add-todo="addTodo" />

    <div class="card">
      <div class="tabs">
        <button :class="{ active: filterStatus === 'all' }" @click="filterStatus = 'all'">
          全部
        </button>
        <button :class="{ active: filterStatus === 'active' }" @click="filterStatus = 'active'">
          待完成
        </button>
        <button :class="{ active: filterStatus === 'done' }" @click="filterStatus = 'done'">
          已完成
        </button>
      </div>
      <p v-if="loading">載入中…</p>

      <TodoList
        v-else
        :todos="todos"
        :filter-status="filterStatus"
        @remove-todo="removeTodo"
        @toggle-todo="toggleTodo"
      />

      <div class="footer">{{ remaining }} 個未完成項目</div>
    </div>
  </div>
</template>

<style scoped>
.todo-shell {
  max-width: 760px;
  margin: 1.25rem auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.card {
  background: rgba(15, 23, 42, 0.6); /* #0F172A 60% */
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  color: #f8fafc; /* 幾乎白 */
  border: 1px solid rgba(148, 163, 184, 0.35);
}
.tabs {
  display: flex;
  justify-content: space-between; /* 三個等距 */
  gap: 0; /* 不要留空隙 */
  border-bottom: 1px solid #eee;
  margin-bottom: 1rem;
}

.tabs button {
  flex: 1;
  text-align: center;
  appearance: none;
  background: transparent;
  border: 0;
  padding: 1rem 0;
  color: #9e9e9e;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  color: #cdc8c8;
}

.tabs button.active {
  color: #222;
  position: relative;
}
.tabs button.active::after {
  content: '';
  position: absolute;
  left: 20%;
  right: 20%;
  bottom: -1px;
  height: 3px;
  background: #222;
  border-radius: 3px;
}
.footer {
  padding: 1rem 0;
  color: #cdc8c8;
  font-weight: bold;
  font-size: 1.1rem;
  text-align: center;
}
</style>
