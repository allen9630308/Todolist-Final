# Vue 3 TodoList (Vite)

A simple Todo app with auth, route guards, and CRUD, built with Vue 3 + Vite and deployable to GitHub Pages.

## Features

Auth: Sign up / Sign in / Sign out (token in cookie)

Route guards with toasts (block / when not authed; redirect from /login & /register when authed)

Todos: list / add / delete / toggle completion

Tabs: All / Active / Completed (client-side filter)

Remaining counter + empty state message

Unified toast notifications (utils/toast.js)

## Tech

Vue 3, Vue Router (hash mode), Axios

SweetAlert2 (used via Toast)

Vite, gh-pages

## Scripts
```
npm install
npm run dev
npm run build
npm run deploy
npm run lint
```
