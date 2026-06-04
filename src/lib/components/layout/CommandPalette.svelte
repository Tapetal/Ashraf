<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { projects } from '$lib/utils/data';

	let isOpen = $state(false);
	let search = $state('');
	let selectedIndex = $state(0);

	const actions = [
		{ name: 'Home', href: '/', icon: '🏠' },
		{ name: 'Projects', href: '/projects', icon: '🚀' },
		{ name: 'About', href: '/about', icon: '👤' },
		{ name: 'Contact', href: '/contact', icon: '📧' },
		...projects.map((p) => ({ name: `Project: ${p.title}`, href: `/projects#${p.id}`, icon: p.icon }))
	];

	let filteredActions = $derived(
		actions.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()))
	);

	function handleKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
			e.preventDefault();
			isOpen = !isOpen;
		}

		if (!isOpen) return;

		if (e.key === 'Escape') isOpen = false;
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			selectedIndex = (selectedIndex + 1) % filteredActions.length;
		}
		if (e.key === 'ArrowUp') {
			e.preventDefault();
			selectedIndex = (selectedIndex - 1 + filteredActions.length) % filteredActions.length;
		}
		if (e.key === 'Enter') {
			navigate(filteredActions[selectedIndex].href);
		}
	}

	function navigate(href: string) {
		goto(href);
		isOpen = false;
		search = '';
	}

	function toggleOpen() {
		isOpen = !isOpen;
		if (!isOpen) search = '';
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});
</script>

<!-- Floating Action Button -->
<div class="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">

	<!-- Command Palette Panel  pops up above the FAB -->
	{#if isOpen}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			transition:fade={{ duration: 120 }}
			class="fixed inset-0 z-[99] bg-black/40 backdrop-blur-sm"
			onclick={toggleOpen}
		></div>

		<div
			transition:fly={{ y: 16, duration: 250 }}
			class="relative z-[101] w-[min(92vw,380px)] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl shadow-black/60"
			onclick={(e) => e.stopPropagation()}
		>
			<!-- Search input -->
			<div class="flex items-center border-b border-white/5 px-4 py-3">
				<span class="mr-3 text-white/40 text-sm">🔍</span>
				<input
					bind:value={search}
					type="text"
					placeholder="Search pages or projects..."
					class="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25"
					autofocus
				/>
				<kbd class="ml-2 shrink-0 rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-white/40 border border-white/10">ESC</kbd>
			</div>

			<!-- Results list -->
			<div class="max-h-[50vh] overflow-y-auto p-1.5">
				{#each filteredActions as action, i}
					<button
						class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors
						{i === selectedIndex ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5'}"
						onclick={() => navigate(action.href)}
						onmouseenter={() => (selectedIndex = i)}
					>
						<span class="text-base">{action.icon}</span>
						<span class="flex-1 text-sm font-medium">{action.name}</span>
						{#if i === selectedIndex}
							<span class="text-[10px] uppercase tracking-widest text-white/30">↵</span>
						{/if}
					</button>
				{:else}
					<div class="py-8 text-center text-xs text-white/20">No results for "{search}"</div>
				{/each}
			</div>

			<!-- Footer -->
			<div class="flex items-center justify-between border-t border-white/5 bg-white/[0.02] px-4 py-2 text-[10px] text-white/25 uppercase tracking-tighter">
				<div class="flex gap-3">
					<span><kbd class="bg-white/5 px-1 rounded">↑↓</kbd> Navigate</span>
					<span><kbd class="bg-white/5 px-1 rounded">↵</kbd> Select</span>
				</div>
				<span>Ashraf_OS v1.0</span>
			</div>
		</div>
	{/if}

	<!-- FAB trigger button -->
	<button
		onclick={toggleOpen}
		aria-label="Open command palette"
		class="group relative flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-[#0d1117] shadow-xl shadow-black/40 transition-all duration-200 hover:scale-105 hover:border-emerald-500/40 hover:shadow-emerald-500/10 hover:shadow-2xl active:scale-95"
	>
		<!-- Glow ring on hover -->
		<span class="absolute inset-0 rounded-full bg-emerald-500/0 transition-all duration-300 group-hover:bg-emerald-500/10"></span>

		{#if isOpen}
			<!-- X icon when open -->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5 text-white/70 transition-transform duration-200"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
			</svg>
		{:else}
			<!-- Command / terminal icon when closed -->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5 text-emerald-400 transition-transform duration-200"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M8 9l3 3-3 3m5 0h3" />
				<rect x="3" y="3" width="18" height="18" rx="3" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		{/if}

		<!-- Tooltip label -->
		<span class="pointer-events-none absolute right-16 whitespace-nowrap rounded-lg border border-white/10 bg-[#0a0a0a] px-2.5 py-1 text-[11px] font-medium text-white/60 opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
			Command Palette
			<kbd class="ml-1.5 rounded bg-white/5 px-1 py-0.5 text-[10px] text-white/30 border border-white/10">⌘K</kbd>
		</span>
	</button>
</div>