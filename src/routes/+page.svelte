<script lang="ts">
  import { me }           from '$lib/utils/data';
  import Hero             from '$lib/components/sections/Hero.svelte';
  import FeaturedProjects from '$lib/components/sections/FeaturedProjects.svelte';
  import Skills           from '$lib/components/sections/Skills.svelte';
  import Timeline         from '$lib/components/sections/Timeline.svelte';
  import ContactSection   from '$lib/components/sections/ContactSection.svelte';
  import PenaltyGame      from '$lib/components/sections/PenaltyGame.svelte';
</script>

<svelte:head><title>{me.name}</title></svelte:head>

<Hero />
<FeaturedProjects />
<Skills />
<Timeline />
<PenaltyGame />
<ContactSection />