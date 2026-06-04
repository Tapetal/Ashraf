<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let scrolled = false;
  let menuOpen = false;
  let cmdOpen = false;
  let theme: 'light' | 'dark' = 'dark';
  let search = '';
  $: currentPath = $page.url.pathname;

  const links = [
    { href: '/',         label: 'Home'     },
    { href: '/projects', label: 'Projects' },
    { href: '/about',    label: 'About'    },
    { href: '/contact',  label: 'Contact'  },
  ];

  const navActions = [
    { name: 'Home',      href: '/'         },
    { name: 'Projects',  href: '/projects' },
    { name: 'About',     href: '/about'    },
    { name: 'Contact',   href: '/contact'  },
    { name: 'Light mode', command: 'light' as const },
    { name: 'Dark mode',  command: 'dark'  as const },
  ];

  $: filteredActions = navActions.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  function isActive(href: string) {
    if (href === '/') return currentPath === '/';
    return currentPath.startsWith(href);
  }

  function applyTheme(mode: 'light' | 'dark') {
    theme = mode;
    if (mode === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', mode);
  }

  function handleAction(a: { name: string; href?: string; command?: 'light' | 'dark' }) {
    if (a.command) applyTheme(a.command);
    else if (a.href) goto(a.href);
    cmdOpen = false; menuOpen = false; search = '';
  }

  function handleLink(href: string) { menuOpen = false; goto(href); }

  onMount(() => {
    const onScroll = () => { scrolled = window.scrollY > 24; };
    window.addEventListener('scroll', onScroll, { passive: true });

    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    theme = stored === 'light' ? 'light' : stored === 'dark' ? 'dark' : prefersDark ? 'dark' : 'light';
    applyTheme(theme);

    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); cmdOpen = !cmdOpen; }
      if (e.key === 'Escape') { cmdOpen = false; menuOpen = false; }
    };
    window.addEventListener('keydown', onKey, { capture: true });
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('keydown', onKey, { capture: true }); };
  });
</script>

<!-- ── HEADER ──────────────────────────────────────────────────── -->
<header class="fixed inset-x-0 top-0 z-50" class:scrolled>
  <div class="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">

    <!-- Mobile logo -->
    <a href="/" on:click|preventDefault={() => handleLink('/')} class="flex-shrink-0 md:hidden">
      <img
        src={theme === 'dark' ? '/logo-white.png' : '/logo-black.png'}
        alt="Ashraf Aminu"
        class="h-8 w-auto"
      />
    </a>

    <!-- Desktop nav -->
    <div class="hidden md:flex items-center justify-center w-full">
      <div class="flex items-center justify-between gap-2 max-w-2xl w-full px-2 py-1.5 rounded-full border bg-white/70 dark:bg-white/5 dark:border-white/10 backdrop-blur-md">

        <!-- Logo -->
        <a href="/" on:click|preventDefault={() => handleLink('/')} class="flex items-center pl-2 pr-4">
          <img
            src={theme === 'dark' ? '/logo-white.png' : '/logo-black.png'}
            alt="logo"
            class="h-10 w-auto"
          />
        </a>

        <!-- Links -->
        <nav class="flex items-center gap-4">
          {#each links as { href, label }}
            <a
              href={href}
              on:click|preventDefault={() => handleLink(href)}
              class="nav-pill"
              class:nav-pill-active={isActive(href)}
            >
              {label}
            </a>
          {/each}
        </nav>

        <!-- Theme toggle (FIXED) -->
        <div class="flex items-center gap-2 pr-2">
          <button
            type="button"
            on:click={() => applyTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
            class="icon-btn text-zinc-700 dark:text-zinc-200"
          >
            {#if theme === 'dark'}
              <!-- Sun icon -->
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" />
              </svg>
            {:else}
              <!-- Moon icon -->
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />
              </svg>
            {/if}
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile actions -->
    <div class="flex items-center gap-2 md:hidden">

      <!-- Theme toggle (FIXED) -->
      <button
        type="button"
        on:click={() => applyTheme(theme === 'dark' ? 'light' : 'dark')}
        aria-label="Toggle theme"
        class="icon-btn text-zinc-700 dark:text-zinc-200"
      >
        {#if theme === 'dark'}
          <!-- Sun -->
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4 12H2M22 12h-2" />
          </svg>
        {:else}
          <!-- Moon -->
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />
          </svg>
        {/if}
      </button>

      <!-- Hamburger -->
      <button
        type="button"
        class="icon-btn text-zinc-700 dark:text-zinc-200"
        on:click={() => (menuOpen = !menuOpen)}
        aria-label="Menu"
        aria-expanded={menuOpen}
      >
        {#if menuOpen}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 18L18 6M6 6l12 12"/>
          </svg>
        {:else}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        {/if}
      </button>
    </div>
  </div>

  <!-- Mobile menu -->
  {#if menuOpen}
    <div class="mobile-menu">
      {#each links as { href, label }}
        <button
          type="button"
          on:click={() => handleLink(href)}
          class="mobile-link"
          class:mobile-active={isActive(href)}
        >
          {label}
        </button>
      {/each}
    </div>
  {/if}
</header>

<!-- ── COMMAND PALETTE FAB ─────────────────────────────────────── -->
<div class="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[100]">

  {#if cmdOpen}
    <!-- Backdrop -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="fixed inset-0 z-[99] bg-black/50 backdrop-blur-sm"
      on:click={() => { cmdOpen = false; search = ''; }}></div>

    <!-- Palette  fixed centered on ALL screen sizes -->
    <div class="fixed z-[101]
      left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
      w-[min(92vw,420px)]
      rounded-2xl overflow-hidden shadow-2xl
      border border-white/10 dark:border-white/10
      bg-white dark:bg-[#0d1117]"
      role="dialog"
      on:click|stopPropagation={() => {}}
      on:keydown|stopPropagation={() => {}}
    >
      <!-- Search row -->
      <div class="flex items-center gap-3 px-4 py-3 border-b border-black/8 dark:border-white/6">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="text-zinc-400 flex-shrink-0">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input bind:value={search} type="text" placeholder="Search pages…"
          class="flex-1 bg-transparent text-sm outline-none
            text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
          autofocus />
        <kbd class="text-[10px] px-1.5 py-0.5 rounded border
          text-zinc-500 dark:text-zinc-600
          border-zinc-200 dark:border-zinc-700
          bg-zinc-100 dark:bg-zinc-800">ESC</kbd>
      </div>

      <!-- Results -->
      <div class="max-h-[50vh] overflow-y-auto p-1.5">
        {#each filteredActions as action (action.name)}
          <button type="button" on:click={() => handleAction(action)} class="palette-result">
            <span class="flex-1 font-medium">{action.name}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="palette-icon">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        {/each}
        {#if filteredActions.length === 0}
          <div class="py-8 text-center text-xs text-zinc-400 dark:text-zinc-600">No results</div>
        {/if}
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between border-t border-black/6 dark:border-white/5 px-4 py-2
        bg-zinc-50 dark:bg-white/[0.02]
        text-[10px] text-zinc-400 dark:text-zinc-600 uppercase tracking-wider">
        <div class="flex gap-3">
          <span><kbd class="bg-zinc-100 dark:bg-white/5 px-1 rounded">↑↓</kbd> Navigate</span>
          <span><kbd class="bg-zinc-100 dark:bg-white/5 px-1 rounded">↵</kbd> Select</span>
        </div>
        <span>⌘K</span>
      </div>
    </div>
  {/if}

  <!-- FAB -->
  <button type="button" on:click={() => { cmdOpen = !cmdOpen; }}
    aria-label="Command palette"
    class="group relative flex h-12 w-12 items-center justify-center rounded-full shadow-xl transition-all duration-200
      border border-black/10 bg-white dark:border-white/10 dark:bg-[#0d1117]
      hover:scale-105 hover:border-accent-500/40 hover:shadow-accent-500/10 active:scale-95">
    <span class="absolute inset-0 rounded-full bg-accent-500/0 transition-all duration-300 group-hover:bg-accent-500/8"></span>
    {#if cmdOpen}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="text-zinc-600 dark:text-white/70">
        <path d="M18 6l-12 12M6 6l12 12"/>
      </svg>
    {:else}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="text-accent-500">
        <path d="M8 9l3 3-3 3m5 0h3"/>
        <rect x="3" y="3" width="18" height="18" rx="3"/>
      </svg>
    {/if}
    <!-- Tooltip (desktop only) -->
    <span class="pointer-events-none absolute right-14 whitespace-nowrap rounded-lg px-2.5 py-1
      text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity shadow-lg
      border border-black/8 dark:border-white/10
      bg-white dark:bg-[#0a0a0a]
      text-zinc-700 dark:text-white/60
      hidden sm:block">
      Command palette <kbd class="ml-1 text-[10px] opacity-50">⌘K</kbd>
    </span>
  </button>
</div>

<style>
  /* ── Header ────────────────────────────────────────────────── */
  header { background: transparent; }

  header.scrolled {
    background: rgba(248, 250, 252, 0.88);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0 1px 20px rgba(0, 0, 0, 0.06);
  }
  :global(.dark) header.scrolled {
    background: rgba(7, 11, 15, 0.88);
    border-bottom-color: rgba(255, 255, 255, 0.07);
    box-shadow: 0 1px 20px rgba(0, 0, 0, 0.3);
  }

  /* ── Nav pills (sveltefolio style) ─────────────────────────── */
  .nav-pill {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    padding: 5px 14px;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.01em;
    color: #52525b;
    text-decoration: none;
    border-radius: 999px;
    transition: color 0.15s, background 0.15s;
  }
  .nav-pill:hover {
    color: #18181b;
    background: rgba(0, 0, 0, 0.05);
  }
  .nav-pill-active {
    color: #18181b;
    font-weight: 600;
  }
  .nav-pill-active::after {
    content: '';
    display: block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #000; /* black in light mode */
    margin-top: -2px;
  }
  :global(.dark) .nav-pill { color: rgba(255,255,255,0.45); }
  :global(.dark) .nav-pill:hover { color: #fff; background: rgba(255,255,255,0.06); }
  :global(.dark) .nav-pill-active { color: #fff; }
  :global(.dark) .nav-pill-active::after { background: #fff; }

  /* ── Icon button ───────────────────────────────────────────── */
  .icon-btn {
    display: flex; align-items: center; justify-content: center;
    width: 34px; height: 34px; border-radius: 9px; cursor: pointer;
    border: 0.5px solid rgba(0,0,0,0.1);
    background: rgba(0,0,0,0.04);
    color: #52525b;
    transition: background 0.15s, color 0.15s;
  }
  .icon-btn:hover { background: rgba(0,0,0,0.08); color: #18181b; }
  :global(.dark) .icon-btn {
    border-color: rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.05);
    color: rgba(255,255,255,0.7);
  }
  :global(.dark) .icon-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }

  /* Command palette result styles */
  .palette-result {
    display:flex; align-items:center; gap:0.75rem; width:100%;
    padding:10px 12px; border-radius:10px; text-align:left; font-size:14px;
    background:transparent; color:#52525b; border:none; cursor:pointer;
    transition:background 0.12s, color 0.12s;
  }
  .palette-result:hover { background: rgba(16,185,129,0.08); color: #065f46; }
  :global(.dark) .palette-result { color: rgba(255,255,255,0.8); }
  :global(.dark) .palette-result:hover { background: rgba(16,185,129,0.12); color: #fff; }
  .palette-icon { color: rgba(148,163,184,0.6); }
  :global(.dark) .palette-icon { color: rgba(255,255,255,0.28); }

  /* ── Mobile menu ───────────────────────────────────────────── */
  .mobile-menu {
    padding: 8px 16px 14px;
    background: rgba(248,250,252,0.97);
    backdrop-filter: blur(20px);
    border-top: 0.5px solid rgba(0,0,0,0.07);
    display: flex; flex-direction: column; gap: 3px;
  }
  :global(.dark) .mobile-menu {
    background: rgba(7,11,15,0.97);
    border-top-color: rgba(255,255,255,0.07);
  }
  .mobile-link {
    width: 100%; text-align: left;
    padding: 10px 14px; border-radius: 10px;
    font-size: 13px; font-weight: 500;
    color: #52525b; background: transparent; border: none; cursor: pointer;
    transition: background 0.12s, color 0.12s;
  }
  .mobile-link:hover, .mobile-link.mobile-active {
    background: rgba(0,0,0,0.05); color: #18181b;
  }
  :global(.dark) .mobile-link { color: rgba(255,255,255,0.5); }
  :global(.dark) .mobile-link:hover,
  :global(.dark) .mobile-link.mobile-active {
    background: rgba(255,255,255,0.06); color: #fff;
  }
</style>