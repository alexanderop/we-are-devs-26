<script lang="ts">
import Dexie, { type Table } from 'dexie'

export interface Todo {
  id?: number
  title: string
  completed: boolean
  createdAt: Date
}

class TodoDB extends Dexie {
  todos!: Table<Todo>

  constructor() {
    super('SlideTodoDB')
    this.version(1).stores({
      todos: '++id, title, completed, createdAt',
    })
  }
}

// Module-scope singleton: Slidev can mount multiple instances of this
// component at once (overview mode, presenter mode, print), so every
// instance should share one Dexie connection instead of opening its own.
// Guarded for SSR — IndexedDB doesn't exist outside the browser.
const db: TodoDB | null = typeof window !== 'undefined' ? new TodoDB() : null

export { db }
</script>

<script setup lang="ts">
import { liveQuery, type Subscription } from 'dexie'
import { onMounted, onUnmounted, ref } from 'vue'

const { title = 'todos' } = defineProps<{
  title?: string
}>()

const todos = ref<Todo[]>([])
const newTitle = ref('')
let subscription: Subscription | undefined

onMounted(() => {
  if (!db) return
  subscription = liveQuery(() =>
    db!.todos.orderBy('createdAt').toArray(),
  ).subscribe({
    next: (value) => {
      todos.value = value
    },
    error: (err) => {
      console.error('DexieTodoApp liveQuery error:', err)
    },
  })
})

onUnmounted(() => {
  subscription?.unsubscribe()
})

async function addTodo() {
  const value = newTitle.value.trim()
  if (!value || !db) return
  await db.todos.add({
    title: value,
    completed: false,
    createdAt: new Date(),
  })
  newTitle.value = ''
}

async function toggleTodo(todo: Todo) {
  if (!db || todo.id === undefined) return
  await db.todos.update(todo.id, { completed: !todo.completed })
}

async function deleteTodo(id?: number) {
  if (!db || id === undefined) return
  await db.todos.delete(id)
}

async function resetAll() {
  if (!db) return
  await db.todos.clear()
}
</script>

<template>
  <div class="dexie-todo-app">
    <!-- Header -->
    <div class="app-header">
      <span class="app-title">{{ title }}</span>
      <span class="app-badge">IndexedDB · SlideTodoDB</span>
    </div>

    <!-- Input row -->
    <div class="input-row">
      <input
        v-model="newTitle"
        type="text"
        placeholder="What needs doing?"
        class="todo-input"
        @keyup.enter="addTodo"
      >
      <button class="add-btn" @click="addTodo">
        Add
      </button>
    </div>

    <!-- List -->
    <div class="todo-list">
      <div v-if="todos.length === 0" class="empty-state">
        No todos yet — add one above.
      </div>
      <div
        v-for="todo in todos"
        :key="todo.id"
        class="todo-row"
      >
        <label class="todo-check">
          <input
            type="checkbox"
            :checked="todo.completed"
            @change="toggleTodo(todo)"
          >
        </label>
        <span class="todo-title" :class="{ 'todo-title--done': todo.completed }">
          {{ todo.title }}
        </span>
        <button class="delete-btn" title="Delete" @click="deleteTodo(todo.id)">
          ✕
        </button>
      </div>
    </div>

    <!-- Footer -->
    <div class="app-footer">
      <span class="count-label">
        {{ todos.filter(t => !t.completed).length }} open · {{ todos.length }} total
      </span>
      <button class="reset-btn" @click="resetAll">
        Reset
      </button>
    </div>
  </div>
</template>

<style scoped>
.dexie-todo-app {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  overflow: hidden;
  font-family: 'Geist', sans-serif;
}

/* ---- Header ---- */
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.app-title {
  font-family: 'Geist', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: rgba(234, 237, 243, 0.95);
}

.app-badge {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: rgba(255, 107, 237, 0.85);
  background: rgba(255, 107, 237, 0.1);
  border: 1px solid rgba(255, 107, 237, 0.2);
  padding: 3px 8px;
  border-radius: 999px;
  white-space: nowrap;
}

/* ---- Input row ---- */
.input-row {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.todo-input {
  flex: 1;
  min-width: 0;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 7px 10px;
  font-family: 'Geist', sans-serif;
  font-size: 13px;
  color: rgba(234, 237, 243, 0.95);
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.todo-input::placeholder {
  color: rgba(234, 237, 243, 0.35);
}

.todo-input:focus {
  border-color: rgba(255, 107, 237, 0.6);
  box-shadow: 0 0 0 3px rgba(255, 107, 237, 0.15);
}

.add-btn {
  font-family: 'Geist', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: rgba(20, 10, 18, 0.95);
  background: rgba(255, 107, 237, 0.9);
  border: none;
  border-radius: 8px;
  padding: 7px 14px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.add-btn:hover {
  background: rgba(255, 107, 237, 1);
}

/* ---- List ---- */
.todo-list {
  display: flex;
  flex-direction: column;
  max-height: 220px;
  overflow-y: auto;
  padding: 4px 0;
}

.empty-state {
  padding: 20px 16px;
  text-align: center;
  font-size: 12px;
  color: rgba(234, 237, 243, 0.35);
  font-style: italic;
}

.todo-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 16px;
  transition: background 0.1s ease;
}

.todo-row:hover {
  background: rgba(255, 255, 255, 0.03);
}

.todo-row:hover .delete-btn {
  opacity: 1;
}

.todo-check input[type='checkbox'] {
  width: 15px;
  height: 15px;
  accent-color: rgb(255, 107, 237);
  cursor: pointer;
}

.todo-title {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  color: rgba(234, 237, 243, 0.9);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.todo-title--done {
  text-decoration: line-through;
  color: rgba(234, 237, 243, 0.35);
}

.delete-btn {
  opacity: 0;
  flex-shrink: 0;
  background: transparent;
  border: none;
  color: rgba(248, 113, 113, 0.7);
  font-size: 12px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: opacity 0.15s ease, background 0.15s ease;
}

.delete-btn:hover {
  background: rgba(248, 113, 113, 0.12);
  color: rgba(248, 113, 113, 0.95);
}

/* ---- Footer ---- */
.app-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.count-label {
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  color: rgba(234, 237, 243, 0.45);
}

.reset-btn {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(234, 237, 243, 0.5);
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  padding: 3px 8px;
  cursor: pointer;
  transition: color 0.15s ease, border-color 0.15s ease;
}

.reset-btn:hover {
  color: rgba(248, 113, 113, 0.9);
  border-color: rgba(248, 113, 113, 0.4);
}
</style>
