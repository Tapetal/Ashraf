<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount, onDestroy } from 'svelte';

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = null;
  let pointerX = -999;
  let pointerY = -999;
  let width = 0;
  let height = 0;
  let frame = 0;
  let rafId = 0;
  let isDark = true;
  let points: { ox: number; oy: number; phase: number }[] = [];

  const GAP = 44;

  function initCanvas() {
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const dpr = window.devicePixelRatio || 1;
    width  = parent.offsetWidth;
    height = parent.offsetHeight;
    canvas.width  = Math.round(width  * dpr);
    canvas.height = Math.round(height * dpr);
    ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    points = [];
    for (let x = 0; x < width + GAP; x += GAP) {
      for (let y = 0; y < height + GAP; y += GAP) {
        points.push({ ox: x, oy: y, phase: Math.random() * Math.PI * 2 });
      }
    }
  }

  function draw() {
    if (!ctx || !browser) return;
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = isDark ? '#070b0f' : '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    const grad = ctx.createRadialGradient(width / 2, -40, 20, width / 2, -40, height * 0.9);
    grad.addColorStop(0, 'rgba(16,185,129,0.07)');
    grad.addColorStop(1, 'rgba(16,185,129,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    const RADIUS   = 180;
    const LINE_DIST = 130;

    const rect   = canvas.getBoundingClientRect();
    const localX = pointerX - rect.left;
    const localY = pointerY - rect.top;
    const hasPtr = pointerX > -900;

    for (const p of points) {
      const wobble = Math.sin(frame * 0.007 + p.phase) * 1.2;
      const px = p.ox + wobble;
      const py = p.oy + wobble * 0.6;

      const dist      = hasPtr ? Math.hypot(px - localX, py - localY) : Infinity;
      const influence = Math.max(0, 1 - dist / RADIUS);
      const r         = 1.2 + influence * 2.2;
      const alpha     = isDark ? 0.10 + influence * 0.52 : 0.14 + influence * 0.36;

      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(16,185,129,${alpha})`;
      ctx.fill();

      if (influence > 0.12 && dist < LINE_DIST) {
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(localX, localY);
        ctx.strokeStyle = `rgba(16,185,129,${influence * (isDark ? 0.18 : 0.10)})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
    }

    if (hasPtr) {
      const glow = ctx.createRadialGradient(localX, localY, 0, localX, localY, 100);
      glow.addColorStop(0, `rgba(16,185,129,${isDark ? 0.07 : 0.04})`);
      glow.addColorStop(1, 'rgba(16,185,129,0)');
      ctx.beginPath();
      ctx.arc(localX, localY, 100, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
    }

    frame++;
    rafId = window.requestAnimationFrame(draw);
  }

  function onMove(e: MouseEvent)  { pointerX = e.clientX; pointerY = e.clientY; }
  function onLeave()               { pointerX = -999;      pointerY = -999;      }

  onMount(() => {
    isDark = document.documentElement.classList.contains('dark');

    const obs = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains('dark');
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    initCanvas();
    window.cancelAnimationFrame(rafId);
    rafId = window.requestAnimationFrame(draw);

    window.addEventListener('resize',     initCanvas, { passive: true });
    window.addEventListener('mousemove',  onMove,     { passive: true });
    window.addEventListener('mouseleave', onLeave,    { passive: true });

    return () => {
      obs.disconnect();
      window.removeEventListener('resize',     initCanvas);
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.cancelAnimationFrame(rafId);
    };
  });

  onDestroy(() => { if (browser) window.cancelAnimationFrame(rafId); });
</script>

<!-- Parent must have position:relative and a defined height -->
<canvas
  bind:this={canvas}
  class="pointer-events-none absolute inset-0 w-full h-full"
  aria-hidden="true"
></canvas>