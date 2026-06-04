<script lang="ts">
  import { me } from '$lib/utils/data';
  import DotGrid from '$lib/components/DotGrid.svelte';

  const tickerItems = [
    'AVAILABLE FOR HIRE',
    'FULL STACK ENGINEER',
    'NEXT.JS · NODE.JS',
    'MONGODB · AWS',
    'WEB3 · HEDERA',
  ];
</script>

<section class="relative overflow-hidden min-h-[92vh] flex items-center
  bg-transparent
  text-zinc-900 dark:text-white">

  <!-- Interactive dot-grid -->
  <DotGrid />

  <!-- Top accent glow -->
  <div class="pointer-events-none absolute inset-0 z-0"
    style="background:radial-gradient(ellipse 70% 45% at 50% -5%, rgba(16,185,129,0.10) 0%, transparent 70%)"
    aria-hidden="true" />

  <div class="relative z-10 mx-auto w-full max-w-6xl px-5 py-28 sm:px-8 sm:py-32 lg:py-36">
    <div class="max-w-2xl space-y-8">

      <!-- Name -->
      <div class="space-y-2">
        <p class="text-sm font-mono uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
          Hey, I'm
        </p>
        <h1 class="text-5xl font-black tracking-tight leading-none sm:text-6xl lg:text-7xl
          text-zinc-900 dark:text-white">
          {me.name}
        </h1>
        <p class="text-base leading-8 text-zinc-500 dark:text-zinc-400 sm:text-lg max-w-xl pt-2">
          {me.heroBio}
        </p>
      </div>

      <!-- Info cards  light-mode aware -->
      <div class="grid gap-3 sm:grid-cols-3">
        {#each [
          { label: 'Availability', val: 'Freelance, Full-time & Contract' },
          { label: 'Stack',        val: 'Next.js · Node · MongoDB'    },
          { label: 'Focus',        val: 'Fullstack + Web3'             },
        ] as card}
          <div class="rounded-2xl border px-4 py-3.5
            border-black/8 bg-white/60 backdrop-blur-sm
            dark:border-white/8 dark:bg-white/[0.04]">
            <p class="text-[9px] font-mono uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-500 mb-1.5">
              {card.label}
            </p>
            <p class="text-xs font-semibold text-zinc-800 dark:text-white">{card.val}</p>
          </div>
        {/each}
      </div>

      <!-- CTAs -->
      <div class="flex flex-wrap gap-3">
        <a href="/projects" class="cta-primary">View featured work</a>
        <a href={me.resume} target="_blank" rel="noopener noreferrer" class="cta-ghost">
          Download resume
        </a>
      </div>

      <!-- Social icons -->
      <div class="flex items-center gap-2 pt-1">
        <!-- GitHub -->
        <a href={me.github} target="_blank" rel="noopener noreferrer"
          aria-label="GitHub" class="social-btn">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.79-.26.79-.58v-2.23c-3.34.73-4.03-1.42-4.03-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23A11.5 11.5 0 0 1 12 6.84c1.02.005 2.05.14 3.01.34 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.19.69.8.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        </a>
        <!-- LinkedIn -->
        <a href={me.linkedin} target="_blank" rel="noopener noreferrer"
          aria-label="LinkedIn" class="social-btn">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zm1.78 13.02H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46C23.2 24 24 23.23 24 22.27V1.73C24 .77 23.2 0 22.23 0z"/>
          </svg>
        </a>
        <!-- X / Twitter -->
        <a href={me.twitter} target="_blank" rel="noopener noreferrer"
          aria-label="X / Twitter" class="social-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        <!-- Email -->
        <a href={`mailto:${me.email}`} aria-label="Email" class="social-btn">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
        </a>
      </div>
    
    </div>

    <!-- Ticker -->
    <div class="mt-16 overflow-hidden rounded-full border py-3 px-4
      border-black/8 bg-white/40 backdrop-blur-sm
      dark:border-white/8 dark:bg-black/30">
      <div class="ticker-track flex items-center gap-10 whitespace-nowrap
        text-[10px] font-mono uppercase tracking-[0.28em] text-zinc-400 dark:text-zinc-600">
        {#each Array(6) as _}
          <span>{tickerItems.join('  ·  ')}</span>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  .cta-primary {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 11px 26px; border-radius: 12px;
    background: #10b981; color: #030712;
    font-size: 13px; font-weight: 600; text-decoration: none;
    transition: background 0.2s;
  }
  .cta-primary:hover { background: #34d399; }

  .cta-ghost {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 11px 26px; border-radius: 12px;
    border: 0.5px solid rgba(0,0,0,0.12);
    background: rgba(0,0,0,0.04);
    color: #3f3f46;
    font-size: 13px; font-weight: 600; text-decoration: none;
    transition: background 0.2s, color 0.2s;
  }
  .cta-ghost:hover { background: rgba(0,0,0,0.07); color: #18181b; }
  :global(.dark) .cta-ghost {
    border-color: rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.05);
    color: rgba(255,255,255,0.7);
  }
  :global(.dark) .cta-ghost:hover { background: rgba(255,255,255,0.09); color: #fff; }

  .social-btn {
    display: flex; align-items: center; justify-content: center;
    width: 38px; height: 38px; border-radius: 10px; text-decoration: none;
    border: 0.5px solid rgba(0,0,0,0.1);
    background: rgba(0,0,0,0.04);
    color: #52525b;
    transition: all 0.2s;
  }
  .social-btn:hover {
    background: rgba(16,185,129,0.1);
    border-color: rgba(16,185,129,0.3);
    color: #10b981;
  }
  :global(.dark) .social-btn {
    border-color: rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.05);
    color: rgba(255,255,255,0.55);
  }
  :global(.dark) .social-btn:hover {
    background: rgba(16,185,129,0.15);
    border-color: rgba(16,185,129,0.3);
    color: #10b981;
  }

  .ticker-track { animation: ticker 28s linear infinite; }
  @keyframes ticker {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
</style>