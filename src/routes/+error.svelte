<script lang="ts">
  import { page } from '$app/stores';
  import DotGrid from '$lib/components/DotGrid.svelte';
</script>

<svelte:head>
  <title>{$page.status}  Tapetal Dev</title>
</svelte:head>

<main class="relative min-h-screen flex items-center justify-center px-6">
  <DotGrid />
  <div class="text-center">
    <p class="text-8xl font-black font-mono text-gradient mb-4">{$page.status}</p>
    <h1 class="text-2xl font-bold text-zinc-300 mb-3">
      {$page.status === 404 ? 'Page not found' : 'Something went wrong'}
    </h1>
    <p class="text-zinc-600 mb-8 text-sm font-mono">{$page.error?.message}</p>
    <a href="/"
      class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
      style="background:linear-gradient(135deg,#059669,#10b981)">
      ← Back home
    </a>
  </div>
</main>
