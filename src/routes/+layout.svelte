<script lang="ts">
  import '../app.css';
  import Nav from '$lib/components/layout/Nav.svelte';
  import { afterNavigate } from '$app/navigation';

  afterNavigate(() => {
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'instant' });
  });
</script>

<div class="min-h-screen bg-[var(--body-bg)] text-[var(--body-text)]">
  <Nav />
  <main class="pt-[68px]">
    <slot />
  </main>

  <footer class="border-t border-black/8 dark:border-zinc-900 py-8 px-5 sm:px-8">
    <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
      <p class="text-[11px] font-mono text-zinc-500">
        Built and designed by Ashraf Aminu 
      </p>
      <div class="flex items-center gap-1.5 text-[11px] font-mono text-zinc-500"> 
        All rights reserved. © {new Date().getFullYear()}
      </div>
    </div>
  </footer>
</div>
