<script lang="ts">
  import { me } from '$lib/utils/data';
  import Skills from '$lib/components/sections/Skills.svelte';
  import Timeline from '$lib/components/sections/Timeline.svelte';
  import DotGrid from '$lib/components/DotGrid.svelte';

  const facts = [
    { label: 'Focus',     value: 'Full-Stack Dev'       },
    { label: 'Status',    value: 'Open to work'          },
    { label: 'Interests', value: 'AI · Games · Football' },
    { label: 'Stack',     value: 'React · Node · Web3'   },
  ];

  const sections = [
    {
      num: '01',
      title: 'Background',
      body: me.bio,
    },
    {
      num: '02',
      title: 'Expertise',
      body: 'I design and develop full-stack web applications using modern technologies like JavaScript, TypeScript, React.js, Node.js, MySQL, MongoDB & Firebase. I enjoy transforming ideas into high-performing digital solutions  from responsive web apps to cloud-powered services.',
    },
    {
      num: '03',
      title: 'Motivation',
      body: 'Technology gives me a way to solve problems that matter  faster workflows, automated systems, and tools that help people. I love seeing how software can turn complex processes into simple, scalable, and smarter solutions. Every project is a chance to learn, improve, and contribute something valuable.',
    },
  ];
</script>

<svelte:head><title>About  {me.name}</title></svelte:head>

<div class="relative min-h-screen pt-20 pb-32 bg-[#f8fafc] dark:bg-[#070b0f]">
  <DotGrid />

  <div class="relative z-10">

    <!-- Hero -->
    <section class="px-5 sm:px-8 pt-12 pb-16">
      <div class="max-w-4xl mx-auto">
        <p class="text-xs font-mono text-accent-500 uppercase tracking-[0.25em] mb-6">// about me</p>

        <div class="mb-10">
          <h1 class="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-zinc-100 leading-tight mb-3">
            Get to know<br/>
            <span class="text-gradient">me better.</span>
          </h1>
          <p class="text-zinc-500 dark:text-zinc-400 text-sm max-w-md leading-relaxed">
            Developer, builder, and problem-solver.
          </p>
        </div>

        <!-- Facts -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {#each facts as f}
            <div
              class="rounded-2xl border px-4 py-3
            border-white/10 bg-white/10 backdrop-blur-md
            dark:border-white/10 dark:bg-white/5"
            >
              <p class="text-[9px] font-mono uppercase tracking-[0.25em] text-zinc-600 dark:text-zinc-300 mb-1">{f.label}</p>
              <p class="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{f.value}</p>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <!-- Story -->
    <section class="px-5 sm:px-8 pb-20">
      <div class="max-w-4xl mx-auto space-y-4">
        {#each sections as s}
          <div class="rounded-3xl border p-6 sm:p-8
            border-zinc-200 dark:border-white/6
            bg-white dark:bg-surface-800
            hover:shadow-lg transition-shadow">
            <div class="flex items-start gap-5">
              <span class="font-mono text-4xl font-black text-zinc-100 dark:text-zinc-800 flex-shrink-0 leading-none mt-0.5">{s.num}</span>
              <div>
                <h2 class="text-base font-bold text-zinc-800 dark:text-zinc-100 mb-2">{s.title}</h2>
                <p class="text-sm leading-7 text-zinc-500 dark:text-zinc-400">{s.body}</p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </section>

    <section class="px-5 sm:px-8 pb-20"><div class="max-w-4xl mx-auto"><Skills /></div></section>
    <section class="px-5 sm:px-8"><div class="max-w-4xl mx-auto"><Timeline /></div></section>
  </div>
</div>