<script setup>
import { computed } from 'vue'
import TodoItem from './TodoItem.vue'

const props = defineProps({
  todos: { type: Array, required: true },
  filterStatus: { type: String, default: 'all' }, // 'all' | 'active' | 'done'
})
defineEmits(['remove-todo', 'toggle-todo'])

const filtered = computed(() => {
  if (props.filterStatus === 'active') return props.todos.filter((t) => !t.completed)
  if (props.filterStatus === 'done') return props.todos.filter((t) => t.completed)
  return props.todos
})
</script>

<template>
  <ul v-if="filtered.length">
    <TodoItem
      v-for="t in filtered"
      :key="t.id"
      :todo="t"
      @remove-todo="$emit('remove-todo', $event)"
      @toggle-todo="$emit('toggle-todo', $event)"
    />
  </ul>
  <p v-else class="empty">目前尚無待辦事項</p>
</template>

<style scoped>
.empty {
  color: #999;
  padding: 1.25rem 0;
  text-align: center;
}
</style>
