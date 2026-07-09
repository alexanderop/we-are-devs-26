---
theme: '@alexop/slidev-theme-brand'
addons:
  - '@alexop/slidev-addon-utils'
title: 'How to Build Local-First Apps with Vue'
transition: slide-left
mdc: true
drawings:
  persist: false
info: |
  ## How to Build Local-First Apps with Vue

  Local-First is a software design philosophy built on the idea of building apps where users have more control over their data. It is related to the offline-first concept, but takes it a step further. In this talk, I will explain what Local-First means and how we can build applications with Vue and Dexie.js.
hideFooter: true
layout: image
image: /we-are-devs-2026.png
backgroundSize: contain
---

---

<div class="flex items-center justify-center h-full">
  <img src="/thanks-for-being-early.png" class="max-h-full max-w-full rounded-lg" />
</div>

---
layout: center
hideFooter: true
---

<div class="flex flex-col items-center gap-6">
  <div class="text-2xl font-bold">Scan to follow along</div>
  <Card glow class="!p-4">
    <div class="bg-white p-3 rounded-lg">
      <img src="/slides-qr.png" class="w-72 h-72" />
    </div>
  </Card>
  <div class="text-sm op-60">alexanderop.github.io/we-are-devs-26</div>
</div>

---

<PartSlide title="How to Build Local-First Apps with Vue" subtitle="WeAreDevelopers 2026 - Alexander Opalic" />

<!--
[breathe] [scan room]

Excited to be here -- favorite topic
Local-first + Vue

Newer community, growing FAST
Introductory talk -- build your own by the end

TRANSITION: Quick intro...
-->


---

# About me

<About
  avatar="/alex-speaking.png"
  :items="[
    '🚀 8 years as a Full Stack Developer',
    '💼 Developer at Otto Payments',
    '🏡 Based near Munich, Bavaria 🇩🇪',
    '✍️ Blogging at alexop.dev  Vue, testing & AI',
    '🎤 Speaking about local-first, Vue & the craft of building',
  ]"
/>

<!--
Quick intro from my side

Alexander Opalic -- Vue 8+ years, backend too
Germany, OTTO Payments -- e-commerce
Blog posts + talks on topics I love

TRANSITION: Quick show of hands...
-->

---
layout: statement
transition: fade-out
---

# Raise your hand if you've ever built an app that works offline

<v-click>

## Keep it up if you've heard of local-first

</v-click>

<v-click>

## And who has actually built a local-first app?

</v-click>

<!--
[scan room]

Quick survey -- how familiar are you?

[wait 3 seconds]

[click] Way fewer hands -- THAT gap is why we're here

[click] Even fewer -- and that's totally fine, that's exactly why this talk exists

[pause]
-->

---

<PyramidOutline :items="[
  { title: 'The Status Quo', subtitle: 'Vue abstracts the DOM, not the data' },
  { title: 'Offline-First', subtitle: 'The app that works without WiFi' },
  { title: 'Sync Engines', subtitle: 'The new data layer' },
  { title: 'Local-First', subtitle: 'More than just offline' },
  { title: 'Dexie', subtitle: 'Local-first Vue in practice' }
]" />

<!--
Overview -- universe is big, structured like this:

- Status quo -- how apps are built today
- Offline-first -- work without WiFi
- Sync engines -- the new data layer
- Local-first -- what it really means
- Dexie -- build it for real

TRANSITION: Let's start at the bottom -- the status quo.
-->

---
transition: fade
---

<PartSlide part="0" title="The Status Quo" subtitle="Vue Abstracts the DOM, Not the Data" />

<!--
[scan room]

Where we are NOW -- how most Vue apps are built
-->

---
clicks: 2
---

<div class="flex items-center justify-center h-full">
<DuplicatedArchDiagram
  :panels="[
    {
      title: 'FRONTEND',
      click: 1,
      items: [
        { id: 'ref', label: 'ref([])', click: 1 },
        { id: 'loading', label: 'loading = true', click: 1 },
        { id: 'try', label: 'try { ... }', click: 1 },
        { id: 'catch', label: 'catch { ... }', click: 1 },
        { id: 'finally', label: 'finally { ... }', click: 1 },
        { id: 'cache', label: 'invalidateCache()', click: 1 },
      ],
      warnings: [
        { text: '⚠ validation' },
        { text: '⚠ auth checks' },
        { text: '⚠ error types' },
      ],
      warningClick: 2,
    },
    {
      title: 'BACKEND',
      click: 1,
      items: [
        { id: 'get', label: 'app.get(\'/todos\')', click: 1 },
        { id: 'validate', label: 'validate(...)', click: 1 },
        { id: 'insert', label: 'db.insert(...)', click: 1 },
        { id: 'auth', label: 'authorize(...)', click: 1 },
      ],
      warnings: [
        { text: '⚠ validation' },
        { text: '⚠ auth checks' },
        { text: '⚠ error types' },
      ],
      warningClick: 2,
    },
  ]"
  :connections="[
    { label: 'GET', click: 1 },
    { label: 'POST', click: 1 },
  ]"
  :database="{ label: 'query / write', click: 1 }"
  :callout="{ label: 'DUPLICATED', click: 2, variant: 'danger' }"
  :seed="150"
/>
</div>

<!--
Classical 3-tier -- state DUPLICATED in two places
Frontend: refs, Pinia
Database: also the state

Even simple CRUD = lots of code

CLICK

Duplicated: validation, auth, error types
Frontend doing TOO much -- leads to bugs

TRANSITION: Kyle Mathews has a great analogy...
-->

---
layout: quote
transition: fade
---

<QuoteCard author="Kyle Mathews - Co-founder of ElectricSQL, creator of Gatsby" highlight="jQuery era of data">
  We're in the jQuery era of data.
</QuoteCard>

<!--
QUOTE: Kyle Mathews -- Gatsby founder, now ElectricSQL
Source: Sync Conf panel discussion

[slow down]
jQuery = fiddling with DOM manually
Vue freed us

BUT -- same dance with DATA
Fetch, cache, retry, invalidate

[pause] History repeating

TRANSITION: Where we are in this evolution...
-->

---
---

# But Who Solves Data Sync?

<FlowDiagram
  :nodes="[
    { id: 'jquery', label: 'jQuery Era', subtitle: 'YOU → DOM', variant: 'muted' },
    { id: 'vue', label: 'Vue Era', subtitle: 'ref() → VDOM → DOM' },
    { id: 'now', label: 'Now', subtitle: '??? → ??? → DB', variant: 'accent' },
  ]"
  :edges="[
    { from: 'jquery', to: 'vue' },
    { from: 'vue', to: 'now' },
  ]"
/>

- jQuery era: **YOU** were the sync engine for the DOM
- Vue era: **Vue** became the sync engine for the DOM
- Now: Who's the sync engine for **DATA**?

<!--
jQuery -- YOU were the sync engine
getElementById, appendChild, manual everything

Vue -- FRAMEWORK syncs the DOM
Declarative. Reactive.

Now -- who syncs the DATA?

[pause]
Same pattern, one layer UP
Vue solved rendering -- need something for data

TRANSITION: What about tools you already use?
-->

---

# "But I Already Use TanStack Query / Pinia?"

<div class="grid grid-cols-2 gap-4 mt-3">

<div v-click>
<div class="font-bold text-brand mb-2 text-sm">TanStack Query - server cache</div>

```ts
const { data } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
})
// edit a todo → mutate → refetch
await updateTodo(1, body)
client.invalidateQueries(['todos'])
```

</div>

<div v-click>
<div class="font-bold text-brand mb-2 text-sm">Pinia - client state</div>

```ts
const ui = useUiStore()
ui.sidebarOpen = true
ui.formDraft = 'Buy milk'
ui.theme = 'dark'
// page refresh?
// formDraft is gone
// no persistence, no sync
```

</div>

</div>

<div v-click class="mt-3 mx-auto w-2/3">
<div class="font-bold text-brand mb-2 text-sm">Sync engine - local truth</div>

```ts
const todos = useLiveQuery(() => db.todos.toArray())
db.todos.add({ title: 'Buy milk' })
// instant - local DB write | works offline | syncs to all devices
```

</div>

<!--
"I already use TanStack / Pinia" -- why something else?

CLICK -- TanStack = server cache. Fetch, cache, invalidate, repeat. Yes, it has optimistic mutations -- but you're still duct-taping over the round-trip.

CLICK -- Pinia = client state. Refresh? Gone.

CLICK -- Sync engine = DIFFERENT layer. Write locally, instant, offline, syncs everywhere.

Replace the fetch-cache-invalidate cycle ENTIRELY.

TRANSITION: Where that leaves us on the scorecard...
-->

---

# The Status Quo Scorecard

<Scorecard mode="intro" :achieved="[]" :show-summary="false" />

<div v-click="8" class="mt-4 text-center text-gray-500">

Vue solved **rendering**. But the data layer? Still the jQuery era. **0 out of 7.**

</div>

<div v-click="9" class="mt-6 text-center">
  <span class="text-sm text-gray-400 italic">The 7 ideals from </span>
  <a href="https://www.inkandswitch.com/essay/local-first/" target="_blank" class="text-sm font-semibold italic" style="color: #ff6bed">"Local-First Software"</a>
  <span class="text-sm text-gray-400 italic"> - Ink & Switch, 2019</span>
</div>

<!--
Not random criteria -- these are the 7 ideals from the Ink & Switch local-first paper, 2019.

[click] Fast -- no spinners, instant response
[click] Multi-device -- your work on any device
[click] Works offline -- the network is optional
[click] Collaboration -- seamless real-time teamwork
[click] Longevity -- your work survives even the company shutting down
[click] Privacy -- your device holds only your own data
[click] User control -- copy it, modify it, no company restricts you

[click] Typical Vue app? ZERO out of seven.

[click] Source: the Ink & Switch essay -- the founding document of this movement.

[pause] [look up]
Rendering = solved. Data layer = not started. Let's change that.

TRANSITION: Let's start fixing this -- offline-first.
-->

---
transition: fade
---

<PartSlide part="1" title="Offline-First" subtitle="The App That Works Without WiFi" />

<!--
[scan room]

Flip the model -- data lives on CLIENT first
Syncs to server when it can
-->

---
clicks: 5
---

# Local Storage Options

<StorageFunnelDiagram
  :rejected="[
    { id: 'ss', label: 'sessionStorage', subtitles: ['Tab-scoped only', 'Gone on close', '~5 MB limit'], status: 'rejected', click: 1 },
    { id: 'ls', label: 'localStorage', subtitles: ['~5 MB limit', 'Sync API (blocks UI)', 'Strings only'], status: 'rejected', click: 1 },
    { id: 'ck', label: 'Cookies', subtitles: ['~4 KB limit', 'Sent with every request', 'Not for app data'], status: 'rejected', click: 1 },
  ]"
  :accepted="[
    { id: 'idb', label: 'IndexedDB', subtitles: ['Generous storage quota', 'Async API', 'Structured data'], status: 'accepted', click: 2 },
    { id: 'sql', label: 'SQLite (WASM)', subtitles: ['Full SQL queries', 'OPFS persistence', '~900KB bundle'], status: 'accepted', click: 3 },
    { id: 'pg', label: 'PGlite (Postgres WASM)', subtitles: ['Full Postgres in the browser', 'pgvector & extensions', '<3MB gzipped'], status: 'accepted', click: 4 },
  ]"
  summary="For local-first: IndexedDB (native), SQLite WASM (SQL power), or PGlite (full Postgres)"
  :summary-click="5"
/>

<!--
[click] The usual suspects -- all dead ends. sessionStorage dies with the tab. localStorage: 5 MB, blocking, strings only. Cookies: 4 KB, sent with every request. None can hold app data.

[click] IndexedDB. NOW we're talking. Generous quota, async, structured.
Remember this one -- Dexie is built on it.

[click] SQLite WASM. Full SQL in WebAssembly. Uses OPFS -- Origin Private File System -- for persistence.

[click] PGlite. Full Postgres in WASM, <3MB gzipped. pgvector + extensions.

[click] Bottom line: IndexedDB, SQLite WASM, or PGlite.
Most sync engines pick one for you.

(If browser SQLite intrigues you: Conrad Hofmeyr's "SQLite Persistence on the Web" talk -- it's in my awesome-local-first repo, QR at the end.)

TRANSITION: So data can live locally. Here's the architecture around it...
-->

---
clicks: 2
---

# The Offline-First Architecture

<SplitDiagram
  :panels="[
    {
      title: 'ONLINE',
      click: 1,
      nodes: [
        { id: 'local', label: 'Local Store', subtitle: '(IndexedDB / SQLite)', variant: 'accent', leftLabel: '◀── read', rightLabel: 'write ──▶', click: 1 },
        { id: 'server', label: 'Server DB', variant: 'success', click: 1 },
      ],
      edges: [
        { from: 'local', to: 'server', label: 'sync ↕', click: 1 },
      ],
    },
    {
      title: 'OFFLINE',
      click: 2,
      nodes: [
        { id: 'local2', label: 'Local Store', subtitle: '(IndexedDB / SQLite)', variant: 'accent', leftLabel: '◀── read', rightLabel: 'write ──▶', click: 2 },
        { id: 'pending', label: 'Pending Writes', variant: 'muted', click: 2 },
      ],
      edges: [
        { from: 'local2', to: 'pending', label: 'saved locally', click: 2 },
      ],
      badges: [
        { text: '✗ no network', position: 'inline', variant: 'danger', click: 2 },
        { text: 'Still works! → syncs when back online', position: 'bottom', variant: 'success', click: 2 },
      ],
    },
  ]"
  :seed="200"
/>

<!--
[gesture] Online side: read/write LOCAL. Sync in background.

Offline side: network drops - app writes to IndexedDB first.
Transactions are saved locally as pending writes.
When connectivity returns, they sync to the server automatically.

[look up] App NEVER stops working

TRANSITION: But there's a gotcha most people miss...
-->

---
clicks: 2
---

# The PWA Gotcha

<PwaDiagram
  :panels="[
    {
      title: 'WITHOUT PWA',
      titleIcon: '❌',
      click: 1,
      boxes: [
        { id: 'error', label: '🦕 Chrome Dino', subtitle: 'No Internet', variant: 'danger', click: 1 },
      ],
      arrows: [],
      annotations: [
        { text: 'IndexedDB has data...', variant: 'muted', click: 1 },
        { text: 'but who cares?', variant: 'muted', click: 1 },
        { text: 'App cannot even load.', variant: 'danger', click: 1 },
      ],
    },
    {
      title: 'WITH PWA',
      titleIcon: '✅',
      click: 2,
      boxes: [
        { id: 'sw', label: 'Service Worker', subtitle: 'intercepts fetch', variant: 'accent', click: 2 },
        { id: 'cache', label: 'Cache Storage', subtitle: 'HTML, JS, CSS, WASM', variant: 'default', click: 2 },
      ],
      arrows: [
        { from: 'sw', to: 'cache', click: 2 },
      ],
      annotations: [],
      resultText: 'App loads!',
      resultIcon: '🚀',
      resultVariant: 'success',
      resultClick: 2,
    },
  ]"
  :seed="300"
  :panelHeight="280"
/>

<!--
Data in IndexedDB -- but app shell can't LOAD offline?
None of it matters. Chrome dino.

Without PWA = dino
With PWA = Service Worker intercepts, serves from cache

[look up] PWA is the foundation. Data layer sits on top.

(I have a blog post on PWA + Vue 3 + Vite -- 4 steps, alexop.dev, QR at the end.)

TRANSITION: Stack all three layers and it looks like this...
-->

---

<OfflineStackDiagram />

<!--
[gesture] Three layers:
- Top: Vue / Nuxt components
- Middle: IndexedDB or SQLite WASM
- Bottom: Service Worker -- caches the shell

vite-plugin-pwa or @vite-pwa/nuxt -- easy to add

TRANSITION: What does offline-first already give us?
-->

---

# What Offline-First Already Gives Us

<Scorecard :achieved="['fast', 'offline']" :descriptions="{
  fast: 'Data is local. Reads are instant. No waiting for the network.',
  offline: 'The whole point. Read and write without connectivity.'
}" />

<!--
CLICK -- Two things FREE: speed (local reads) + offline capability

CLICK -- Five question marks still open

CLICK -- 2 out of 7. Good progress, NOT enough.

TRANSITION: What's holding us back?
-->

---
clicks: 5
---

# The Missing Piece: How Do You Sync?

<TodoSyncConflictDemo :roughness="1.2" :seed="900" />

<!--
Data stored locally -- great. But TWO devices, same todo.

CLICK -- Both go offline. Can't see each other.

CLICK -- Device A: "Buy oat milk"

CLICK -- Device B: "Buy almond milk"

CLICK -- Reconnect. Now what? Which wins?

CLICK -- Distributed systems problem. Needs a SYNC ENGINE.
-->

---
transition: fade
---

<PartSlide part="2" title="Sync Engines" subtitle="The New Data Layer" />

<!--
[scan room]

Now things get REALLY interesting
-->

---
clicks: 1
---

<div class="relative h-full">

<div v-click-hide="1" class="absolute inset-0 flex items-center justify-center">

<ClientServerDiagram
  :clients="[
    { title: 'Client A', layers: [{ label: 'App code' }] },
    { title: 'Client B', layers: [{ label: 'App code' }] },
  ]"
  server-label="API server"
  connection-label="fetch()"
  server-db-label="SQL"
  database-label="Database"
  caption="Sharing data with APIs"
  :seed="300"
/>

</div>

<div v-click="1" class="absolute inset-0 flex items-center justify-center">

<ClientServerDiagram
  :clients="[
    {
      title: 'Client A',
      layers: [
        { label: 'App code' },
        { label: 'Sync client', variant: 'accent' },
        { label: 'Local DB', variant: 'success' },
      ],
    },
    {
      title: 'Client B',
      layers: [
        { label: 'App code' },
        { label: 'Sync client', variant: 'accent' },
        { label: 'Local DB', variant: 'success' },
      ],
    },
  ]"
  server-label="Sync server"
  connection-label="Sync"
  server-db-label="SQL"
  database-label="Database"
  caption="Sharing data with sync"
  :seed="310"
/>

</div>

</div>

<!--
[gesture] Traditional: every client talks to the server via HTTP.
Server = single source of truth. Works -- but network goes away?

[click] Now: each client has a LOCAL DB + sync layer.
Read/write locally -- instant. Sync client replicates in the background.

THIS is what sync engines give you.

But it raises the fundamental question: two devices go offline, both edit the same data -- how do you merge?

TRANSITION: Turns out there's a whole spectrum of answers...
-->

---
clicks: 3
---

# Conflict Resolution: It's a Spectrum

<div class="h-75">
<ConflictSpectrumDiagram
  :items="[
    { id: 'lww', label: 'Last-Write-Wins', subtitle: 'Fastest', pro: 'Simple & fast', con: 'Loses data', variant: 'danger', weight: 1 },
    { id: 'crdt', label: 'CRDTs', subtitle: 'Auto-converge', pro: 'No server', con: 'Complex types', variant: 'success', click: 1, weight: 3 },
    { id: 'hybrid', label: 'Hybrid / Manual', subtitle: 'User decides', pro: 'Full control', con: 'UX complexity', variant: 'accent', click: 2, weight: 5 },
  ]"
  :roughness="1.2"
  :seed="777"
/>
</div>

<Callout v-click="3" type="info">

Dexie Cloud takes the pragmatic path: **last-write-wins — but per field, not per record**. We'll see exactly how that works.

</Callout>

<!--
Full picture -- the spectrum of conflict resolution approaches.

LWW -- simplest. Last save wins. Fast, but LOSES data.

CLICK -- CRDTs. Math guarantees convergence. No server needed.
Yjs, Automerge, Jazz live here.

CLICK -- Hybrid. Surface conflict to user (like Git merge).

CLICK -- Dexie's answer: LWW, but FIELD-level. Most of LWW's simplicity, much less data loss. We'll dig into it in part 4.

TRANSITION: But WHERE does this resolution happen?
-->

---
clicks: 2
---

# The Hardest Problem: Where Do You Resolve Conflicts?

<div class="grid grid-cols-2 gap-8 mt-6">

<div v-click="1">

<Card size="lg" glow>

<div class="text-sm font-bold text-brand mb-2 flex items-center gap-2"><div class="i-ph-cloud-bold" /> Server-Side Resolution</div>

- Server decides who wins
- Simpler, familiar mental model
- **But:** requires a trusted server

<div class="mt-2 text-xs op-50">Zero, Dexie Cloud, traditional APIs</div>

</Card>

</div>

<div v-click="2">

<Card variant="muted" size="lg">

<div class="text-sm font-bold text-brand mb-2 flex items-center gap-2"><div class="i-ph-devices-bold" /> Client-Side Resolution</div>

- Every client merges independently
- Works offline & peer-to-peer
- **But:** needs math that always converges

<div class="mt-2 text-xs op-50">Yjs, Jazz, Automerge (CRDTs)</div>

</Card>

</div>

</div>

<!--
Two places conflict resolution can live

CLICK -- Server decides. POST, validate, pick winner.
Simpler -- one source of truth. But: NEEDS a server.
Zero + Dexie Cloud = this approach.
THIS is the path we'll take today -- pragmatic, familiar.

CLICK -- Client decides. Every device resolves on its own.
Server = dumb relay. Can go fully P2P.
Hard part: merges must ALWAYS converge.
Yjs + Jazz = this approach.

TRANSITION: What does that buy us on the scorecard?
-->

---
---

# What Sync Engines Add

<Scorecard :achieved="['fast', 'offline', 'multi-device', 'collaboration']" :descriptions="{
  fast: 'Local reads, optimistic writes. UI never waits for the server.',
  offline: 'Sync engines queue changes and reconcile when back online.',
  'multi-device': 'State syncs across devices via the server in real time.',
  collaboration: 'Multiple users edit the same document - conflicts resolved automatically.'
}" />

<!--
CLICK -- Four things covered now: speed, offline, multi-device, collaboration.
Sync engines are POWERFUL.

CLICK -- But three question marks remain: longevity, privacy, user control.
If Linear shuts down -- your data is gone. Server owns it.

CLICK -- 4 out of 7. Great engineering, but not truly local-first yet.

TRANSITION: Let's look at the apps you already love...
-->

---

# Sync Engines in the Wild

<div class="grid grid-cols-3 gap-6 mt-6">

<Card variant="muted" size="lg">
<div class="flex items-center gap-2 text-lg font-bold text-brand mb-2"><img src="/linear-logo.svg" class="h-6 w-6" /> Linear</div>

- Syncs workspace to **IndexedDB**
- Sub-50ms page loads
- Server remains source of truth

</Card>

<Card variant="muted" size="lg">
<div class="flex items-center gap-2 text-lg font-bold text-brand mb-2"><img src="/figma-logo.svg" class="h-6 w-6" /> Figma</div>

- CRDT-**inspired**, not a true CRDT
- Central server decides ordering
- Offline limited to open files only

</Card>

<Card variant="muted" size="lg">
<div class="flex items-center gap-2 text-lg font-bold text-brand mb-2"><img src="/notion-logo.svg" class="h-6 w-6" /> Notion</div>

- **SQLite WASM** for client-side caching
- Offline mode shipped Aug 2025

</Card>

</div>

<div v-click class="mt-6 text-center text-lg op-70">

All three use sync engines. All work offline. But are they **local-first**?

</div>

<!--
Apps you USE every day -- all sync-engine powered

Linear -- sub-50ms page loads. Syncs workspace to IndexedDB.
BUT: server is the source of truth. It can reject your writes.

Figma -- CRDT-inspired, NOT a true CRDT. Central server decides ordering.
Offline? Only files already open in your tab. Can't open new ones.

Notion -- Their previous caching approach didn't scale (too slow per-row for their block model).
Switched to SQLite WASM. 33% faster in India. Offline mode shipped Aug 2025.

CLICK -- [slow down] All three. Sync engines. Fast. Some offline.
But... are they truly local-first? What happens if Linear shuts down?
Your data? Gone. Your workspace? Gone.

TRANSITION: Let's define what truly local-first means...
-->

---
transition: fade
---

<PartSlide part="3" title="Local-First" subtitle="More Than Just Offline" />

<!--
[breathe]

We just saw Linear, Figma, Notion -- incredible apps.
Sync engines, offline, fast.
But are they truly LOCAL-FIRST?

Martin Kleppmann -- Ink & Switch, Automerge -- boils it down to THREE criteria.

TRANSITION: Here they are...
-->

---
clicks: 4
---

# The Three Criteria

<ThreeCriteriaDiagram />

<!--
CLICK -- Offline reads AND writes

CLICK -- Collaboration. Multiple devices, changes merge.

CLICK -- [slow down] Data survives the developer SHUTTING DOWN

CLICK -- This separates offline-first from local-first. The dealbreaker.

Key insight: No single approach (proprietary, self-host, P2P, file sync) fully solves criterion 3. Each improves resilience but has trade-offs.

TRANSITION: Let's compare offline-first and local-first directly...
-->

---
layout: two-cols
clicks: 1
---

<div class="h-full flex flex-col justify-center items-center text-center">

## Offline-First Asks

<div class="h-18 flex items-center justify-center">"How do I keep working without a server?"</div>

<RoughSvg :width="360" :height="250" :padding="14" :seed="41" class="mt-4">
  <RoughNode id="server-off" :x="95" :y="0" :width="170" :height="70" label="Server" sublabel="the owner 👑" variant="success" />
  <RoughNode id="client-off" :x="105" :y="170" :width="150" :height="64" label="Client" sublabel="just a cache" variant="muted" />
  <RoughEdge from="client-off" to="server-off" from-side="right" to-side="right" label="write" :label-dx="34" :label-dy="0" />
  <RoughEdge from="server-off" to="client-off" from-side="left" to-side="left" label="✗ rollback" :label-dx="-44" :label-dy="0" stroke="rgba(248, 113, 113, 0.8)" stroke-dasharray="6 5" />
</RoughSvg>

<div class="mt-3 text-sm op-70">

Server rejects your write → client rolls back

</div>

</div>

::right::

<div v-click class="h-full flex flex-col justify-center items-center text-center">

## Local-First Asks

<div class="h-18 flex items-center justify-center">"Why does the server own my data at all?"</div>

<RoughSvg :width="360" :height="250" :padding="14" :seed="42" class="mt-4">
  <RoughNode id="you-loc" :x="95" :y="0" :width="170" :height="70" label="YOU" sublabel="the owner 👑" variant="accent" />
  <RoughNode id="server-loc" :x="105" :y="170" :width="150" :height="64" label="Server" sublabel="just a utility" variant="muted" />
  <RoughEdge from="you-loc" to="server-loc" from-side="right" to-side="right" label="sync" :label-dx="32" :label-dy="0" />
  <RoughEdge from="server-loc" to="you-loc" from-side="left" to-side="left" label="✓ just relays" :label-dx="-56" :label-dy="0" stroke="rgba(52, 211, 153, 0.8)" />
</RoughSvg>

<div class="mt-3 text-sm op-70">

Server can't reject → your data, your jurisdiction

</div>

</div>

<!--
Offline-first: "how do I keep working without server?"
Server = owner. Client = cache. Server rejects your write -> you roll back.

[click] Local-first: "why does the server own my data AT ALL?"

[look up]
Same two boxes -- ownership flipped. YOU are the owner. Server = utility.
Can't reject your writes -- it just relays.
No foreign kill switch -- your data stays in YOUR jurisdiction.

TRANSITION: Enough theory -- let's build one.
-->

---
transition: fade
---

<PartSlide part="4" title="Dexie 🗄️" subtitle="Local-First Vue in Practice" />

<!--
[breathe]

Now that we know what local-first MEANS -- let's build it.
The most pragmatic way in for a Vue dev: Dexie.js.

TRANSITION: Here's the website...
-->

---

<div class="h-full w-full flex items-center justify-center">
  <img src="/dexie-website.png" class="max-h-full max-w-full rounded-lg shadow-xl" />
</div>

<!--
Dexie.js -- around since 2014, one of the most battle-tested
IndexedDB libraries. ~14k GitHub stars.

"IndexedDB made simple. Add cloud sync for auth, storage,
real-time updates. No backend required."

Two pieces:
- Dexie.js -- open source wrapper around IndexedDB
- Dexie Cloud -- optional sync backend (one addon)

TRANSITION: But first -- the problem Dexie actually solves...
-->

---

# Your Browser Already Ships a Database

<div class="mt-1 text-base op-70">IndexedDB: gigabytes of real objects, in every browser since 2012. <span class="text-brand font-bold">The API is why nobody uses it.</span></div>

<div class="mt-4">

<Comparison left-title="Raw IndexedDB" right-title="Dexie">

<template #left>

```ts
const req = indexedDB.open('TodoDB', 1)
req.onupgradeneeded = () => req.result
  .createObjectStore('todos', {
    autoIncrement: true,
  })
req.onsuccess = () => {
  const tx = req.result
    .transaction('todos', 'readwrite')
  tx.objectStore('todos')
    .add({ title: 'Buy milk' })
  tx.onerror = () => console.error(tx.error)
}
```

<div class="mt-2 text-xs op-50">Requests, event handlers, manual transactions - a 2010 API</div>

</template>

<template #right>

```ts
const db = new Dexie('TodoDB')
db.version(1).stores({ todos: '++id, completed' })

await db.todos.add({
  title: 'Buy milk', completed: 0,
})

// it's a database - so query it
const open = await db.todos
  .where('completed').equals(0)
  .toArray()
```

<div class="mt-2 text-xs op-50">Same database underneath - and it answers queries, not just get/set</div>

</template>

</Comparison>

</div>

<!--
That [object Object] you just saw? The browser's actual answer to it has been shipping since 2012: IndexedDB. Gigabytes of quota, real JavaScript objects, async, indexed. Not a key-value store -- a mini database that can index, search, and QUERY your data.

[point left] And THIS is why nobody uses it raw. Requests, event handlers, manual transactions. Eight lines to save one object -- a 2010 API.

[point right] Dexie is the API IndexedDB should have had. Same database underneath -- two lines to save an object, it's a promise so it awaits like everything else in your Vue code. And look at the bottom: an indexed query. "All open todos" -- no stringify, no filtering an array in JS. THAT's the difference between storage and a database.

That's the whole pitch: the browser's built-in database, without hating it.

TRANSITION: Three building blocks make up the stack...
-->

---
transition: fade
---

# Building Blocks

<div class="grid grid-cols-3 gap-6 mt-6">

<div>

## Dexie.js

<div class="text-sm text-gray-400 mb-2">A typed, friendly wrapper around IndexedDB</div>

```ts
db.todos.add({
  title: 'Buy milk',
})
db.todos
  .where('completed')
  .equals(0)
  .toArray()
```

<div class="text-xs text-gray-500 mt-2">Promises instead of IndexedDB's cursor gymnastics</div>

</div>

<div>

## liveQuery

<div class="text-sm text-gray-400 mb-2">Reactive queries - like computed() for your database</div>

```ts
liveQuery(() =>
  db.todos.toArray()
)
// re-emits whenever
// the underlying
// data changes
```

<div class="text-xs text-gray-500 mt-2">Fires on local writes AND incoming synced changes</div>

</div>

<div>

## dexie-cloud-addon

<div class="text-sm text-gray-400 mb-2">Sync, auth & sharing - one addon, zero backend code</div>

```ts
new Dexie('TodoDB', {
  addons: [
    dexieCloud,
  ],
})
```

<div class="text-xs text-gray-500 mt-2">WebSocket sync, offline queue, conflict resolution included</div>

</div>

</div>

<!--
Three building blocks.

Dexie.js: the wrapper you just saw. Promises and clean queries on top of the browser's database.

liveQuery: THE key idea for Vue devs. A normal query answers once. liveQuery keeps answering -- it re-emits whenever the underlying data changes. Think computed() -- but for IndexedDB. And it doesn't care WHERE the change came from: your code, another tab, or -- later -- sync.

dexie-cloud-addon: sync as a plugin. Same API, your writes now replicate. Nothing about the first two columns changes.

For our todo app: a Dexie table for todos, liveQuery to read them reactively, cloud addon to sync. Let's build it.
-->

---
clicks: 1
---

# Zero Backend Code - But There Is a Backend

<TerminalWindow
  title="~/vue-dexie-todo"
  stepped
  :lines="[
    { cmd: 'npx dexie-cloud create', output: 'Creating database...\n✔ Database created: https://zy02f1.dexie.cloud\n✔ dexie-cloud.json + dexie-cloud.key written' },
    { cmd: 'npx dexie-cloud whitelist http://localhost:5173', output: '✔ Origin whitelisted' },
  ]"
/>

<div v-click="1" class="mt-4 text-center text-sm op-60">

Two commands. That's the entire backend setup. <span class="text-brand">Add both generated files to `.gitignore`!</span>

</div>

<!--
One thing before the code: Dexie Cloud IS a server -- you just don't write it.

npx dexie-cloud create -- provisions your database, gives you a URL.

CLICK -- whitelist your dev origin. Done.

Free tier: enough for demos and side projects. Self-hosting exists too -- but be precise: that's a PAID license, source-available, NOT open source. Hold that thought -- it comes back at the end of this part.

TRANSITION: Setup done. Before the code -- here's the finished app, running live.
-->

---
transition: fade
---

# The App We're Building

<div class="flex flex-col items-center mt-8">

<DexieTodoApp />

<div class="mt-4 text-xs op-50">Real IndexedDB, running in this browser tab right now - reload the deck and the todos are still there</div>

</div>

<!--
This isn't a mockup or a screen recording -- it's the actual app we're about to build, mounted right here in the slide, backed by real IndexedDB.

[gesture] Add a todo live. Now reload the page -- the slide remounts, the component re-renders from scratch... and the todo is still there. No server, no localStorage trick. That's IndexedDB, doing its job.

[press Seed 10k] And the party trick: ten thousand todos, bulk-inserted in a blink. Watch the footer -- the query stays at a millisecond or two. That's what an INDEXED database buys you. localStorage would stringify and re-parse the whole array on every single change -- ten thousand todos would freeze the tab.

TRANSITION: So where did that todo actually go?
-->

---
transition: fade
---

# What's Actually in There

<div class="flex flex-col items-center mt-6">

<img src="/indexeddb-devtools.png" class="rounded-lg shadow-xl border border-gray-700 max-w-full" />

<div class="mt-4 text-xs op-50">Chrome DevTools -- Application tab -- the exact IndexedDB record from the app you just saw</div>

</div>

<!--
Open DevTools, Application tab, Storage, IndexedDB. There's our database -- SlideTodoDB -- and the todos table, with the row we just added sitting right there.

No inspector plugin, no special tooling. This is built into every browser. Title, completed, createdAt -- exactly the shape we defined.

Pro-tip: it's not limited to JSON-shaped data either. IndexedDB stores Blobs natively -- images, files, audio go straight in, no base64. One rule: never INDEX a blob field. Index the metadata next to it (filename, size, date) and keep the blob as payload.

TRANSITION: Now the fun part -- the schema.
-->

---
layout: code-editor
project: vue-dexie-todo
activeFile: db.ts
tabs: db.ts
step: 1/4 Database
transition: fade
clicks: 2
files: |
  src
    main.ts
    db.ts
    composables/
      useTodos.ts
    components/
      TodoList.vue
    App.vue
  package.json
  vite.config.ts
---

````md magic-move {lines: true}
```ts
// db.ts
import Dexie, { type Table } from 'dexie'

// Plain TypeScript - no special base class
export interface Todo {
  id?: string
  title: string
  completed: boolean
  createdAt: Date
}
```
```ts
// db.ts
import Dexie, { type Table } from 'dexie'

export interface Todo {
  id?: string
  title: string
  completed: boolean
  createdAt: Date
}

// One class = one database
export class TodoDB extends Dexie {
  todos!: Table<Todo>

  constructor() {
    super('TodoDB')

    this.version(1).stores({
      // '@id' = globally unique IDs - crucial for sync!
      todos: '@id, title, completed, createdAt',
    })
  }
}
```
```ts
// db.ts - complete database definition
import Dexie, { type Table } from 'dexie'

export interface Todo {
  id?: string
  title: string
  completed: boolean
  createdAt: Date
}

export class TodoDB extends Dexie {
  todos!: Table<Todo>

  constructor() {
    super('TodoDB')

    this.version(1).stores({
      todos: '@id, title, completed, createdAt',
    })
  }
}

export const db = new TodoDB()
```
````

<!--
We start with the shape. Plain TypeScript interface - no decorators, no special base class, no schema DSL.

CLICK: The database class. One class extends Dexie, one typed table property, and the schema - version(1).stores. Look at '@id': the @ prefix tells Dexie to generate globally unique IDs. THAT's what makes records safe to create on any device without colliding. Note: you only list INDEXED fields here - not every field.

CLICK: Export a singleton. That's the entire database layer. No migrations folder, no docker-compose, no connection pool.

TRANSITION: Now let's make it sync...
-->

---
layout: code-editor
project: vue-dexie-todo
activeFile: db.ts
tabs: db.ts
step: 2/4 Cloud Sync
transition: fade
clicks: 2
files: |
  src
    main.ts
    db.ts
    composables/
      useTodos.ts
    components/
      TodoList.vue
    App.vue
  package.json
  vite.config.ts
---

````md magic-move {lines: true}
```ts
// db.ts - local only, so far
import Dexie, { type Table } from 'dexie'

export class TodoDB extends Dexie {
  todos!: Table<Todo>

  constructor() {
    super('TodoDB')

    this.version(1).stores({
      todos: '@id, title, completed, createdAt',
    })
  }
}

export const db = new TodoDB()
```
```ts
// db.ts - add the cloud addon
import Dexie, { type Table } from 'dexie'
import dexieCloud from 'dexie-cloud-addon'

export class TodoDB extends Dexie {
  todos!: Table<Todo>

  constructor() {
    // One option turns Dexie into a sync client
    super('TodoDB', { addons: [dexieCloud] })

    this.version(1).stores({
      todos: '@id, title, completed, createdAt',
    })
  }
}

export const db = new TodoDB()

db.cloud.configure({
  databaseUrl: import.meta.env.VITE_DEXIE_CLOUD_URL,
  requireAuth: true,
})
```
```ts
// db.ts - auth is already built in
import Dexie, { type Table } from 'dexie'
import dexieCloud from 'dexie-cloud-addon'

export class TodoDB extends Dexie {
  todos!: Table<Todo>

  constructor() {
    super('TodoDB', { addons: [dexieCloud] })

    this.version(1).stores({
      todos: '@id, title, completed, createdAt',
    })
  }
}

export const db = new TodoDB()

db.cloud.configure({
  databaseUrl: import.meta.env.VITE_DEXIE_CLOUD_URL,
  requireAuth: true,
})

export const currentUser = db.cloud.currentUser  // Observable
export const login = () => db.cloud.login()      // email OTP flow
export const logout = () => db.cloud.logout()
```
````

<!--
Same file - watch how little changes.

CLICK: Import the addon, pass it to the constructor, and configure it with your database URL from the CLI. Two moves - your local database is now a sync client. requireAuth: users log in before syncing.

CLICK: And auth is already there. db.cloud.login() runs a full email OTP flow - no Auth0, no OAuth setup, no session middleware. currentUser is an observable you can bind to your UI.

[look up] Compare this mentally to the backend column from earlier: database, API, WebSockets, auth. This file replaces all of it.

TRANSITION: Now let's read data - reactively...
-->

---
layout: code-editor
project: vue-dexie-todo
activeFile: useTodos.ts
tabs: db.ts, useTodos.ts
step: 3/4 Composable
transition: fade
clicks: 3
openFolders: src, composables
files: |
  src
    main.ts
    db.ts
    composables/
      useTodos.ts
    components/
      TodoList.vue
    App.vue
  package.json
  vite.config.ts
---

````md magic-move {lines: true}
```ts
// composables/useTodos.ts
import { computed, ref } from 'vue'
import { liveQuery } from 'dexie'
import { useObservable } from '@vueuse/rxjs'
import { from } from 'rxjs'
import { db, type Todo } from '@/db'

// A standard Vue composable - no provider, no plugin
export function useTodos() {
}
```
```ts
// composables/useTodos.ts
import { computed, ref } from 'vue'
import { liveQuery } from 'dexie'
import { useObservable } from '@vueuse/rxjs'
import { from } from 'rxjs'
import { db, type Todo } from '@/db'

export function useTodos() {
  // liveQuery re-runs on every change - local OR synced
  const todos = useObservable<Todo[]>(
    from(liveQuery(() => db.todos.orderBy('createdAt').toArray())),
  )
}
```
```ts
// composables/useTodos.ts
import { computed, ref } from 'vue'
import { liveQuery } from 'dexie'
import { useObservable } from '@vueuse/rxjs'
import { from } from 'rxjs'
import { db, type Todo } from '@/db'

export function useTodos() {
  const todos = useObservable<Todo[]>(
    from(liveQuery(() => db.todos.orderBy('createdAt').toArray())),
  )

  const newTodoTitle = ref('')

  // Writes go to IndexedDB - instant, offline-safe, synced later
  async function addTodo() {
    if (!newTodoTitle.value.trim()) return
    await db.todos.add({
      title: newTodoTitle.value,
      completed: false,
      createdAt: new Date(),
    })
    newTodoTitle.value = ''
  }
}
```
```ts
// composables/useTodos.ts - the entire data layer
import { computed, ref } from 'vue'
import { liveQuery } from 'dexie'
import { useObservable } from '@vueuse/rxjs'
import { from } from 'rxjs'
import { db, type Todo } from '@/db'

export function useTodos() {
  const todos = useObservable<Todo[]>(
    from(liveQuery(() => db.todos.orderBy('createdAt').toArray())),
  )

  const newTodoTitle = ref('')

  async function addTodo() { /* db.todos.add(...) */ }

  // Plain Vue on top - one-liners, nothing Dexie-specific
  const pendingTodos = computed(
    () => todos.value?.filter(t => !t.completed) ?? [],
  )
  const toggleTodo = (todo: Todo) =>
    db.todos.update(todo.id!, { completed: !todo.completed })
  const deleteTodo = (id: string) => db.todos.delete(id)

  return { todos, newTodoTitle, addTodo, toggleTodo, deleteTodo, pendingTodos }
}
```
````

<!--
The composable - this is where Vue devs feel at home. A standard function, no provider component, no app-level plugin.

CLICK: The reactive read. liveQuery from Dexie, converted to a Vue ref with useObservable from VueUse. This query re-emits when YOU write - AND when a change syncs in from another device. Same pipeline.

CLICK: addTodo. db.todos.add - writes to IndexedDB. Instant. Offline-safe. The cloud addon queues and syncs it in the background. No try/catch-rollback dance.

CLICK: Toggle, delete, and a computed for pending - one-liners on the same table. Return reactive state. That's the ENTIRE data layer.

TRANSITION: The component is almost boring now...
-->

---
layout: code-editor
project: vue-dexie-todo
activeFile: TodoList.vue
tabs: useTodos.ts, TodoList.vue
step: 4/4 Component
transition: fade
clicks: 2
openFolders: src, composables, components
files: |
  src
    main.ts
    db.ts
    composables/
      useTodos.ts
    components/
      TodoList.vue
    App.vue
  package.json
  vite.config.ts
---

````md magic-move {lines: true}
```vue
<!-- components/TodoList.vue -->
<script setup lang="ts">
import { useTodos } from '@/composables/useTodos'

// One destructure - all logic lives in the composable
const { todos, newTodoTitle, addTodo, toggleTodo, deleteTodo }
  = useTodos()
</script>
```
```vue
<!-- components/TodoList.vue -->
<script setup lang="ts">
import { useTodos } from '@/composables/useTodos'

const { todos, newTodoTitle, addTodo, toggleTodo, deleteTodo }
  = useTodos()
</script>

<template>
  <!-- Plain v-for - todos updates on local AND remote writes -->
  <ul>
    <li v-for="todo in todos" :key="todo.id">
      <input
        type="checkbox"
        :checked="todo.completed"
        @change="toggleTodo(todo)"
      />
      {{ todo.title }}
      <button @click="deleteTodo(todo.id!)">✕</button>
    </li>
  </ul>
</template>
```
```vue
<!-- components/TodoList.vue - complete component -->
<script setup lang="ts">
import { useTodos } from '@/composables/useTodos'

const { todos, newTodoTitle, addTodo, toggleTodo, deleteTodo }
  = useTodos()
</script>

<template>
  <ul>
    <li v-for="todo in todos" :key="todo.id">
      <input
        type="checkbox"
        :checked="todo.completed"
        @change="toggleTodo(todo)"
      />
      {{ todo.title }}
      <button @click="deleteTodo(todo.id!)">✕</button>
    </li>
  </ul>

  <!-- v-model + submit - no store, no server calls -->
  <form @submit.prevent="addTodo">
    <input v-model="newTodoTitle" placeholder="What needs doing?" />
    <button type="submit">Add</button>
  </form>
</template>
```
````

<!--
The component. One destructure from the composable - all logic lives there.

CLICK: The template. A plain v-for for the list - remember, it updates when you write locally AND when your phone syncs a change in. Then a form: v-model plus submit, no loading state, no error rollback, no store.

CLICK: That's the complete component. Any Vue dev could read this - except it's offline-capable and multi-device.

TRANSITION: One question left - what happens when two devices disagree?
-->

---
clicks: 4
---

# How Dexie Cloud Handles Conflicts

<DexieFieldMergeDemo :roughness="1.2" :seed="950" />

<!--
Remember the oat milk vs almond milk problem from part 2? Here's Dexie's answer -- as a picture first.

Same todo on both devices. Both offline.

CLICK -- Device A renames the todo. Dexie doesn't record "new object" -- it records WHICH field changed: title.

CLICK -- Device B checks it off. Tracked change: completed. A DIFFERENT field.

CLICK -- Reconnect. The devices don't upload whole objects -- each syncs its update operation, carrying ONLY the changed fields.

CLICK -- The server applies them per field: title from A, completed from B. BOTH survive. A conflict only exists when the SAME field changed.

TRANSITION: So what happens when it IS the same field?
-->

---
clicks: 4
transition: fade
---

# Same Field? Last Write Wins

<DexieLwwDemo :roughness="1.2" :seed="960" />

<!--
Now the real conflict: both devices touch the SAME field.

Same setup -- same todo, both offline.

CLICK -- Device A renames the todo at 14:02.

CLICK -- Device B ALSO renames it, at 14:07. Same field -- title. This time there's nothing to merge.

CLICK -- Reconnect. Two update ops arrive for the same field. THIS is a real conflict.

CLICK -- Dexie compares timestamps (adjusted for client clock skew): the later write wins. Oat milk is GONE -- simple and predictable, but one intent is lost. Bonus rule: a delete always beats an update, so no zombie records.

That's the whole model: per-field merge when possible, last-write-wins when not, deletes win. Three rules -- no CRDT math, no merge UI.

TRANSITION: Step back and look at what we did NOT write...
-->

---
clicks: 1
---

# What You Didn't Have to Build

<div class="grid grid-cols-2 gap-8 mt-4">

<div v-click="1">

<Card variant="muted">

<div class="text-sm font-bold text-brand mb-2 flex items-center gap-2"><div class="i-ph-stack-bold" /> Traditional Stack</div>

- <div class="i-ph-database inline-block align-middle" /> Database + migrations
- <div class="i-ph-plugs inline-block align-middle" /> REST/GraphQL API
- <div class="i-ph-broadcast inline-block align-middle" /> WebSocket server
- <div class="i-ph-user-circle inline-block align-middle" /> Auth service
- <div class="i-ph-shield-check inline-block align-middle" /> Permission middleware
- <div class="i-ph-clock-counter-clockwise inline-block align-middle" /> Change tracking
- <div class="i-ph-hard-drives inline-block align-middle" /> Offline + cache layer
- <div class="i-ph-arrows-clockwise inline-block align-middle" /> Optimistic updates

</Card>

</div>

<div v-click="1">

<Card glow>

<div class="text-sm font-bold text-brand mb-2 flex items-center gap-2"><div class="i-ph-lightning-bold" /> Dexie Equivalent</div>

- `db.version(1).stores()`
- `liveQuery()` reads local
- Dexie Cloud sync (built in)
- `db.cloud.login()` - email OTP
- Realms & roles
- `$table_mutations` - automatic
- IndexedDB **is** the source
- Automatic - writes are local

</Card>

</div>

</div>

<!--
[pause] Let that sink in.

CLICK -- On the left: everything you'd normally build. Database, API, WebSockets, auth, permissions, change tracking, offline layer, optimistic updates. EIGHT services.

On the right: Dexie equivalents. A stores() call, liveQuery, cloud.login, realms and roles for sharing. Each one is a line or two. Most are automatic.

Realms, by the way, are Dexie Cloud's sharing model -- put todos in a shared realm and your team syncs the same list, with roles controlling who can write.

[look up] This isn't a shortcut. It's a different architecture. When your database lives on the client, all of this comes for free.

TRANSITION: To be fair -- let's talk about when NOT to use it...
-->

---

# Honest Trade-Offs

<Comparison left-title="✅ Dexie is enough when" right-title="🧬 Reach for CRDTs when">

<template #left>

- Conflicts are rare or low-stakes
- Field-level merge covers your data model
- "Last write wins" is acceptable
- You want a familiar, server-backed setup

<div class="mt-3 text-xs op-50">Todo apps, notes, personal tools, dashboards</div>

</template>

<template #right>

- Real-time collaborative text editing
- You can't afford to lose any user's intent
- You want E2E encryption / P2P
- The server should be a dumb relay

<div class="mt-3 text-xs op-50">Yjs, Jazz, Automerge - Google-Docs-style merging</div>

</template>

</Comparison>

<!--
Being honest about the trade-off.

Left: Dexie's sweet spot. Simple data models, rare conflicts, LWW acceptable. Which is... most CRUD apps, honestly.

Right: when you need character-by-character text merging, guaranteed intent preservation, E2E encryption, or peer-to-peer -- that's CRDT territory. Yjs, Jazz, Automerge.

Two users editing the same todo TITLE simultaneously: Dexie keeps one version. A CRDT could merge both intents.

Pick based on your data, not on hype.

TRANSITION: And one more honesty check -- remember criterion 3?
-->

---

# The Company-Disappears Test

<div class="mt-1 text-base op-70">Criterion 3, applied to our own stack: <span class="text-brand font-bold">what if Dexie shuts down tomorrow?</span></div>

<div class="mt-4">

<Comparison left-title="✅ Survives" right-title="❌ Dies" left-variant="success" right-variant="danger">

<template #left>

- **Dexie.js** - Apache-2.0, open source
- **Your data** - in IndexedDB, on every device
- **Your app** - keeps working locally, forever

<div class="mt-3 text-xs op-50">The local layer is genuinely local-first</div>

</template>

<template #right>

- **Sync** - multi-device stops
- **Auth & sharing** - login, realms, roles
- **The escape hatch** - self-host server is a <span class="font-bold">paid license</span>, source-available ≠ open source

<div class="mt-3 text-xs op-50">No fork - no community can keep it alive</div>

</template>

</Comparison>

</div>

<div v-click class="mt-6 text-center text-lg">

Your **data** outlives the company. Your **sync** doesn't.

</div>

<!--
Part 3, criterion 3: data survives the developer shutting down. Let's be honest and run that test on our OWN stack. [pause]

Left: Dexie.js itself is open source. Your data sits in IndexedDB on the user's device. The app keeps working locally -- forever. That part genuinely passes.

Right: sync, auth, sharing -- that's Dexie Cloud, and it dies with the company. And the escape hatch is weak: yes, you can self-host, but that's a PAID, source-available license. You can't fork it. If they stop selling licenses, there is no path.

CLICK -- the honest verdict. Your DATA outlives the company. Your SYNC doesn't. On our seven ideals: longevity and user control only half-count. That puts Dexie Cloud mid-spectrum -- more local-first than a classic SaaS, less than the truly open stacks.

TRANSITION: So what if user control is non-negotiable for you?
-->

---

# Sync That Survives the Company

<div class="mt-1 text-sm op-60">Open source across the <span class="text-brand font-bold">whole</span> stack - anyone can run the server, forever</div>

<div class="grid grid-cols-3 gap-6 mt-6">

<Card variant="muted" size="lg">

<div class="text-sm font-bold text-brand mb-2 flex items-center gap-2"><div class="i-ph-graph-bold" /> No server at all</div>

**Yjs** · **Automerge** · **Loro**

<div class="text-sm text-gray-400 mt-2">Merge logic lives in the client. Sync over WebSocket, WebRTC - even files.</div>

<div class="mt-3 text-xs op-50">MIT - nothing central to shut down</div>

</Card>

<Card variant="muted" size="lg">

<div class="text-sm font-bold text-brand mb-2 flex items-center gap-2"><div class="i-ph-database-bold" /> Your own Postgres</div>

**Zero** · **ElectricSQL**

<div class="text-sm text-gray-400 mt-2">Open-source sync engines in front of a database you already run.</div>

<div class="mt-3 text-xs op-50">Apache-2.0 - client AND server</div>

</Card>

<Card variant="muted" size="lg">

<div class="text-sm font-bold text-brand mb-2 flex items-center gap-2"><div class="i-ph-lock-open-bold" /> Dexie Cloud, but open</div>

**Jazz** · **Evolu** · **TinyBase**

<div class="text-sm text-gray-400 mt-2">Sync + auth + E2E encryption, with a sync server you self-host for free.</div>

<div class="mt-3 text-xs op-50">MIT - fork it, run it, keep it alive</div>

</Card>

</div>

<div class="mt-6 text-center text-sm op-70">

The trade-off: **you** operate more of it. Dexie Cloud's convenience is exactly what the license buys.

</div>

<!--
If ideal #7 is non-negotiable, here's the open end of the spectrum. Three tiers.

CLICK -- CRDT libraries: Yjs -- the most-deployed CRDT, powers Tiptap and most collaborative editors. Automerge -- Kleppmann's own project, the reference implementation of the local-first paper. Loro -- newer, Rust-fast. No vendor server EXISTS. Sync runs over any transport.

CLICK -- sync engines over your own database: Zero by Rocicorp -- hit 1.0 this June, Apache-2 client and server, self-host against your own Postgres. ElectricSQL -- same idea, streams your Postgres to clients.

CLICK -- and the Dexie-Cloud-shaped ones, but open: Jazz -- sync, auth, permissions, E2E encryption, MIT. Evolu -- E2E-encrypted SQLite, the server literally can't read your data. TinyBase -- reactive store with pluggable sync you host yourself.

CLICK -- fairness cuts both ways: with these YOU run the server, the upgrades, the ops. Dexie Cloud's convenience is real -- that's what the license buys. Pick based on how much ideal #7 matters for YOUR app.

Full list: my awesome-local-first repo -- QR code at the end.

TRANSITION: Before you rush off and rewrite everything -- is your app even a FIT?
-->

---

# Local-First Software Fit Guide

<FitGuideDiagram />

<!--
Good fit: apps where users CREATE and OWN their data. File editing, productivity tools - the user IS the source of truth.

Bad fit: anything involving real-world resources that need a central authority.
Money: "An offline banking app that lets you initiate a transfer with an out-of-date balance is dangerous" (RxDB)
Inventory: two warehouses claiming the last item - CRDTs can't resolve this automatically.
Vehicles: ride-sharing needs central arbitration for matching.

TRANSITION: If your app fits -- here's what you can do today.
-->

---
clicks: 4
---

# What You Can Do Today

<ThreeStepsDiagram />

<!--
Historical parallels: Cypherpunks → Let's Encrypt, Free Software → GitHub + npm, Local-first ideals → ???
Idealists define vision, pragmatists build infrastructure.

[look up] Pragmatist phase. Tools not perfect. Good enough to START.

CLICK -- Pick a sync engine. Dexie = IndexedDB you already know, sync one addon away.

CLICK -- Add a DOWNLOAD button. Export data. Simplest local-first gesture.

CLICK -- Watch this space. Generic sync protocol coming.
Upgrade = config change, not rewrite.

CLICK -- [look up] Not betting on a vendor. Betting on a PATTERN.

TRANSITION: One more thing...
-->

---
transition: fade
---

<PartSlide title="Closing" subtitle="The Rendering Era Is Over" />

<!--
[breathe] [scan room]

One more thing...
-->

---
layout: center
class: flex items-center justify-center h-full
---

<Timeline
  :items="[
    { id: 'jquery', title: 'jQuery', year: '(2006)', description: 'You sync the DOM', details: ['Manual', 'getElementById', 'innerHTML'], variant: 'muted' },
    { id: 'reactive', title: 'Reactive', year: '(2014)', description: 'Vue syncs the DOM', details: ['Declarative', 'ref() + v-bind', 'computed()'] },
    { id: 'sync', title: 'Sync', year: '(2020)', description: 'Engine syncs the data', details: ['No spinners', 'No cache mgmt', 'Multi-device'], variant: 'success' },
    { id: 'local-first', title: 'Local-First', year: '(now)', description: 'User owns the data', details: ['Privacy', 'Longevity', 'Full control'], variant: 'accent' },
  ]"
/>

<!--
The whole talk in one picture. [walk the timeline left to right]

jQuery: YOU were the sync engine.
Vue: the FRAMEWORK syncs the DOM.
Sync engines: the ENGINE syncs the data.
Local-first: the USER owns the data.

[slow down] [look up]
We solved rendering. Data layer = where it's happening NOW.
Vue is perfectly POSITIONED.
-->

---
layout: end
transition: fade
---

# Thank You!

<div class="text-lg op-80 mb-6">

**alexop.dev** · **@alexanderopalic**

</div>

<div class="grid grid-cols-2 gap-6 max-w-4xl mx-auto">

<Card glow class="flex items-center gap-4 !px-5 !py-4">
  <img src="/awesome-local-first-qr.png" class="w-28 h-28 rounded-lg flex-shrink-0" />
  <div class="text-left">
    <div class="flex items-center gap-2">
      <img src="/local-first-logo.svg" class="w-8 h-8" />
      <div class="text-lg font-bold" style="color: #ff6bed">awesome-local-first</div>
    </div>
    <div class="text-xs op-60 mt-1.5">A curated collection of local-first resources, tools, frameworks & articles</div>
    <div class="mt-2 flex items-center gap-2 text-xs op-40">
      <div class="i-ph-github-logo" />
      <span>github.com/alexanderop/awesome-local-first</span>
    </div>
  </div>
</Card>

<Card variant="muted" class="!p-0 overflow-hidden h-full">
  <img src="/local-first-conf.png" class="w-full h-28 object-cover object-top" />
  <div class="px-4 py-2.5 flex items-center justify-between">
    <div>
      <div class="text-sm font-bold">Local First Conf</div>
      <div class="text-xs op-50">Berlin · 12-14 July 2026</div>
    </div>
    <div class="text-brand text-xs font-medium">localfirstconf.com <span class="i-ph-arrow-up-right-bold inline-block align-middle" /></div>
  </div>
</Card>

</div>

<!--
[breathe] [look up]

Thank you!

I created awesome-local-first -- a curated GitHub repo with all useful resources on local-first. Scan the QR code or find it on GitHub.
Also check out Local First Conf in Berlin this year -- localfirstconf.com
Come find me to chat about local-first

[pause]
-->
