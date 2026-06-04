<script lang="ts">
  import { projects } from '$lib/utils/data';
  import type { Project } from '$lib/utils/data';
  import DotGrid from '$lib/components/DotGrid.svelte';

  type Category = 'all' | Project['category'];
  let activeFilter: Category = 'all';

  $: filtered = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  const categories: { val: Category; label: string }[] = [
    { val: 'all',       label: 'All'        },
    { val: 'fullstack', label: 'Full-Stack'  },
    { val: 'mobile',    label: 'Mobile'      },
    { val: 'security',  label: 'Security'    },
    { val: 'frontend',  label: 'Frontend'    },
  ];
</script>

<svelte:head>
  <title>Projects  Ashraf Aminu</title>
</svelte:head>

<main class="relative pt-24 pb-24 px-4 sm:px-6 min-h-screen">
  <DotGrid />
  <div class="max-w-5xl mx-auto">

    <!-- Header -->
    <div class="mb-12">
      <p class="text-xs font-mono text-accent-500 uppercase tracking-widest mb-3">// portfolio</p>
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 dark:text-zinc-100 mb-4">All Projects</h1>
      <p class="text-zinc-500 text-sm sm:text-base max-w-lg leading-relaxed">
        A collection of projects I've built  from Web3 platforms and encrypted messaging to inventory systems and mobile apps.
      </p>
    </div>

    <!-- Filter pills -->
    <div class="flex flex-wrap gap-2 mb-8">
      {#each categories as { val, label }}
        <button
          on:click={() => activeFilter = val}
          class="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all duration-200
            {activeFilter === val
              ? 'bg-accent-500 text-white border-accent-500 shadow-lg shadow-accent-500/20'
              : 'text-zinc-500 dark:text-zinc-500 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-surface-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-300'}"
        >
          {label}
        </button>
      {/each}
    </div>

    <!-- Project grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
      {#each filtered as project (project.id)}
        <article class="group rounded-2xl border overflow-hidden flex flex-col transition-all duration-300
          border-zinc-200 dark:border-zinc-800
          bg-white dark:bg-surface-800
          hover:border-zinc-300 dark:hover:border-zinc-700
          hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/30">

          <!-- Accent top bar -->
          <div class="h-1 w-full flex-shrink-0" style="background: linear-gradient(90deg, {project.accent}, {project.accent}55)"></div>

          <div class="p-5 sm:p-6 flex flex-col flex-1">

            <!-- Top row -->
            <div class="flex items-start justify-between gap-3 mb-4">
              <div class="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style="background:{project.accent}15; border:1px solid {project.accent}25">
                {project.icon}
              </div>
              <div class="flex items-center gap-2 flex-wrap justify-end">
                {#if project.featured}
                  <span class="text-[10px] font-black font-mono px-2 py-0.5 rounded-full"
                    style="color:#10b981; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.2)">
                    FEATURED
                  </span>
                {/if}
                {#if project.category === 'mobile'}
                  <span class="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full"
                    style="color:#14b8a6; background:rgba(20,184,166,0.1); border:1px solid rgba(20,184,166,0.2)">
                    MOBILE
                  </span>
                {/if}
                <span class="text-[11px] font-mono text-zinc-400 dark:text-zinc-700">{project.year}</span>
              </div>
            </div>

            <h2 class="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-zinc-700 dark:group-hover:text-white transition-colors">
              {project.title}
            </h2>
            <p class="text-xs sm:text-sm text-zinc-500 leading-relaxed flex-1 mb-4">{project.description}</p>

            <!-- Tags -->
            <div class="flex flex-wrap gap-1.5 mb-5">
              {#each project.tags.slice(0, 4) as tag}
                <span class="text-[10px] font-mono px-2 py-0.5 rounded-md
                  bg-zinc-100 dark:bg-zinc-900
                  border border-zinc-200 dark:border-zinc-800
                  text-zinc-500 dark:text-zinc-500">
                  {tag}
                </span>
              {/each}
              {#if project.tags.length > 4}
                <span class="text-[10px] font-mono px-2 py-0.5 rounded-md
                  bg-zinc-100 dark:bg-zinc-900
                  border border-zinc-200 dark:border-zinc-800
                  text-zinc-400 dark:text-zinc-600">
                  +{project.tags.length - 4}
                </span>
              {/if}
            </div>

            <!-- Links -->
            <div class="flex items-center gap-3 mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800">
              {#if project.demo}
                <a href={project.demo} target="_blank" rel="noopener"
                  class="flex items-center gap-1.5 text-xs font-semibold transition-colors hover:opacity-80"
                  style="color:{project.accent}">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  Live demo
                </a>
              {/if}
              {#if project.repo}
                <a href={project.repo} target="_blank" rel="noopener"
                  class="flex items-center gap-1.5 text-xs font-semibold transition-colors ml-auto
                    text-zinc-400 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-300">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                  GitHub
                </a>
              {/if}
            </div>
          </div>
        </article>
      {/each}
    </div>

    {#if filtered.length === 0}
      <div class="text-center py-20 text-zinc-400 dark:text-zinc-700">
        <p class="text-4xl mb-3">🔍</p>
        <p class="font-mono text-sm">No projects in this category yet</p>
      </div>
    {/if}
  </div>
</main>