<script setup>
const props = defineProps({
  todo: { type: Object, required: true }, // { id, content, completed }
})
const emit = defineEmits(['remove-todo', 'toggle-todo'])
</script>

<template>
  <li class="todo-item">
    <label class="row">
      <input
        type="checkbox"
        :checked="props.todo.completed"
        @change="emit('toggle-todo', props.todo.id)"
      />
      <span :class="{ done: props.todo.completed }">{{ props.todo.content }}</span>
    </label>
    <button class="del" @click="emit('remove-todo', todo.id)" aria-label="刪除"></button>
  </li>
</template>

<style scoped>
/* 列表行與間距 */
.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.35); /* 跟卡片風格一致 */
}
.row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.row input[type='checkbox'] {
  width: 18px;
  height: 18px;
  transform: translateY(1px);
  accent-color: #38bdf8;
}

.row span {
  font-size: 1.3rem;
  line-height: 1.6;
  color: #e2e8f0;
}
.row span.done {
  text-decoration: line-through;
  color: #a8b1c7;
}

.del {
  position: relative;
  width: 28px;
  height: 28px;
  margin-right: 12px;
  border: 0;
  background: transparent;
  cursor: pointer;
}
.del::before,
.del::after {
  content: '';
  position: absolute;
  left: 5px;
  right: 5px;
  top: 50%;
  height: 4px;
  background: #000;
  transform-origin: center;
  transition: background-color 0.15s ease;
}
.del::before {
  transform: translateY(-50%) rotate(45deg);
}
.del::after {
  transform: translateY(-50%) rotate(-45deg);
}

.del:hover::before,
.del:hover::after {
  background: #fff;
}
</style>
