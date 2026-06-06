<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  let goals = 0, attempts = 0, streak = 0, bestStreak = 0;
  let lastResult = '';
  let sideMessage = 'Aim · Hold to charge · Release to shoot';
  let accuracy = '';

  let canvas: HTMLCanvasElement;
  let wrapper: HTMLDivElement;
  let ctx: CanvasRenderingContext2D | null = null;
  let rafId = 0, frame = 0;

  const LW = 680, LH = 400;

  type Phase = 'intro' | 'aim' | 'shooting' | 'resolving';
  let phase: Phase = 'intro';

  let mouseX = LW / 2, mouseY = LH * 0.8;
  let aimVisible = false;
  let mouseHeld = false, holdStart = 0, power = 0;

  const GOAL = { cx: LW / 2, cy: LH * 0.14, w: LW * 0.44, h: LH * 0.155, post: 5 };
  const BALL_HOME = { x: LW / 2, y: LH * 0.78 };

  type Zone = 'left' | 'center' | 'right';

  function getZone(x: number): Zone {
    const gL = GOAL.cx - GOAL.w / 2;
    const third = GOAL.w / 3;
    if (x < gL + third)     return 'left';
    if (x < gL + third * 2) return 'center';
    return 'right';
  }

  let ball = {
    x: BALL_HOME.x, y: BALL_HOME.y,
    tx: 0, ty: 0, progress: 0, speed: 0,
    active: false, done: false, spin: 0,
    shotZone: 'center' as Zone, // stored at shoot time, used in resolveShot
  };

  let keeper = {
    x: LW / 2 - 28, y: GOAL.cy + GOAL.post + 2,
    w: 56, h: 16,
    diveTargetX: LW / 2 - 28, diveTargetY: GOAL.cy + GOAL.post + 2,
    diveProgress: 0, diveSpeed: 0.055,
    diving: false, reactionTimer: 0, reacted: false,
    diveAngle: 0, diveZone: 'center' as Zone,
  };

  interface Particle { x:number;y:number;vx:number;vy:number;r:number;color:string;alpha:number;decay:number; }
  let particles: Particle[] = [];
  let shake = { x:0, y:0, mag:0, dur:0, t:0 };
  let flashColor = '', flashAlpha = 0;
  let bigText = { text:'', color:'#fff', alpha:0 };
  let shotHistory: Zone[] = [];

  const lerp    = (a:number,b:number,t:number) => a+(b-a)*t;
  const easeOut = (t:number) => 1-(1-t)**3;
  const easeIn  = (t:number) => t*t*t;
  const clamp   = (v:number,lo:number,hi:number) => Math.min(hi,Math.max(lo,v));

  function updateHUD() { accuracy = attempts > 0 ? `${Math.round((goals/attempts)*100)}%` : ''; }
  function addShake(mag:number, dur:number) { shake = {x:0,y:0,mag,dur,t:0}; }
  function addParticles(x:number, y:number, color:string, n=16) {
    for (let i=0;i<n;i++) {
      const a=Math.random()*Math.PI*2, sp=1.5+Math.random()*4;
      particles.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,r:1.5+Math.random()*3,color,alpha:1,decay:0.018+Math.random()*0.012});
    }
  }

  // ── Keeper AI — pure zone prediction, no random save rolls ───────────────
  //
  // Difficulty comes entirely from how accurately the keeper predicts your zone.
  // keeperSkill = probability keeper guesses the correct zone.
  //
  // Rubber-band system:
  //   - First 3 shots: keeper always correct (builds early tension)
  //   - 4th shot: keeper always wrong (rewards player with first goal)
  //   - After: dynamic skill based on your performance + pattern reading
  //
  // If keeper guesses right  → guaranteed save  (no dice roll)
  // If keeper guesses wrong  → guaranteed goal  (no dice roll)
  // This makes the game feel fair and readable.
  //
  function decideKeeperDive(shotZone: Zone) {
    let diveZone: Zone;
    const others = (['left','center','right'] as Zone[]).filter(z => z !== shotZone);

    if (attempts < 3) {
      // First 3 shots: keeper reads you perfectly — earn the goal
      diveZone = shotZone;

    } else if (attempts === 3) {
      // 4th shot: guaranteed goal — keeper dives wrong
      diveZone = others[Math.floor(Math.random() * others.length)];

    } else {
      // Dynamic difficulty rubber-band:
      const recentMisses = Math.max(0, attempts - goals);
      let keeperSkill = 0.68; // base: keeper guesses right 68% of time → hard but fair

      // Struggling? Make keeper easier
      if (recentMisses >= 3) keeperSkill = 0.40;
      if (recentMisses >= 5) keeperSkill = 0.28;

      // On a hot streak? Keeper gets harder
      if (streak >= 3) keeperSkill = 0.78;
      if (streak >= 6) keeperSkill = 0.88;

      // Pattern bias: if you've been shooting the same zone, keeper leans that way
      const recent    = shotHistory.slice(-6);
      const sameCount = recent.filter(z => z === shotZone).length;
      if (recent.length >= 3) {
        keeperSkill += (sameCount / recent.length) * 0.18;
      }
      keeperSkill = clamp(keeperSkill, 0.20, 0.92);

      diveZone = Math.random() < keeperSkill
        ? shotZone                                              // keeper reads you correctly
        : others[Math.floor(Math.random() * others.length)];   // keeper guesses wrong
    }

    keeper.diveZone = diveZone;

    // Position keeper's dive target in the correct zone
    const gL    = GOAL.cx - GOAL.w / 2;
    const third = GOAL.w / 3;
    let diveX: number;
    if      (diveZone === 'left')   diveX = gL + third * 0.5  - keeper.w / 2;
    else if (diveZone === 'center') diveX = GOAL.cx            - keeper.w / 2;
    else                            diveX = gL + third * 2.5   - keeper.w / 2;

    // Powershots go higher — keeper adjusts dive height
    const diveY = GOAL.cy + GOAL.h * (power > 0.72 ? 0.08 : 0.15 + Math.random() * 0.35);

    keeper.diveTargetX   = diveX;
    keeper.diveTargetY   = diveY;
    keeper.diveAngle     = diveZone === 'left' ? -0.7 : diveZone === 'right' ? 0.7 : 0;
    keeper.diveSpeed     = attempts < 3
      ? 0.09  // first 3 shots: fast dive to show off
      : clamp(0.045 + goals * 0.006, 0.045, 0.10);
    keeper.reactionTimer = attempts < 3
      ? 8     // first 3: quick reaction (intimidating)
      : clamp(26 - goals * 2, 8, 26);
    keeper.reacted      = false;
    keeper.diving       = false;
    keeper.diveProgress = 0;
  }

  // ── Game flow ──────────────────────────────────────────────────────────────
  function startGame() {
    phase = 'aim'; resetBall(); resetKeeperStand();
    sideMessage = 'Aim · Hold to charge · Release to shoot';
  }
  function resetSession() {
    goals=0; attempts=0; streak=0; bestStreak=0;
    lastResult=''; shotHistory=[]; updateHUD(); startGame();
  }
  function resetBall() {
    ball = {...ball, x:BALL_HOME.x, y:BALL_HOME.y, active:false, done:false, progress:0};
    power = 0;
  }
  function resetKeeperStand() {
    keeper.x = LW/2 - keeper.w/2;
    keeper.y = GOAL.cy + GOAL.post + 2;
    keeper.diving = false; keeper.diveProgress = 0; keeper.reacted = false;
  }

  function shoot() {
    if (phase !== 'aim') return;
 
    const tx = mouseX;
 
    const ty = clamp(mouseY, 0, BALL_HOME.y - 10);
 
    ball.tx = tx;
    ball.ty = ty;
    ball.progress = 0;
    ball.active   = true;
    ball.done     = false;
    ball.speed    = 0.026 + power * 0.036;
    ball.spin     = (mouseX - LW / 2) * 0.004;

    const sz = getZone(tx);
    ball.shotZone = sz;
    shotHistory.push(sz);
    if (shotHistory.length > 8) shotHistory.shift();
    decideKeeperDive(sz);
    if (power > 0.72) addShake(5, 14);
    phase = 'shooting';
    sideMessage = '';
  }

  function resolveShot() {
    attempts++;

    const gL = GOAL.cx - GOAL.w/2 + GOAL.post + 4;
    const gR = GOAL.cx + GOAL.w/2 - GOAL.post - 4;
    const gT = GOAL.cy + 3, gB = GOAL.cy + GOAL.h - 3;
    const inGoal = ball.tx>=gL && ball.tx<=gR && ball.ty>=gT && ball.ty<=gB;

    // Use the zone stored at shoot time — no recalculation, no mismatch
    const shotZone = ball.shotZone;

    // ── PURE ZONE LOGIC — no random dice rolls ──────────────────────────────
    // Keeper guessed correct zone → save (always)
    // Keeper guessed wrong zone   → goal (always)
    // What makes it hard is keeper skill (guessing right 68–88% of time)
    // What makes it feel fair is that visual and result always match
    // ───────────────────────────────────────────────────────────────────────
    let saved = false;
    if (inGoal) {
      saved = (keeper.diveZone === shotZone);
    }

    if (inGoal && !saved) {
      goals++; streak++; if (streak > bestStreak) bestStreak = streak;
      flashColor = 'rgba(16,185,129,1)'; flashAlpha = 1;
      bigText = { text:'GOAL', color:'#4ade80', alpha:1.2 };
      addParticles(ball.tx, ball.ty, 'rgba(16,185,129,0.9)', 22);
      addShake(4, 14);
      lastResult  = streak >= 3 ? `GOAL · ${streak} in a row` : 'GOAL';
      sideMessage = streak >= 3 ? `On fire! ${streak} in a row` : 'Clinical finish!';
    } else if (saved) {
      streak = 0; flashColor = 'rgba(239,68,68,1)'; flashAlpha = 1;
      bigText = { text:'SAVED', color:'#f87171', alpha:1.2 };
      addParticles(ball.tx, ball.ty, 'rgba(239,68,68,0.8)', 14);
      lastResult  = 'SAVED';
      sideMessage = 'Keeper guessed your zone. Try mixing it up.';
    } else {
      streak = 0;
      bigText = { text:'MISSED', color:'#fbbf24', alpha:1.2 };
      lastResult  = 'MISSED';
      sideMessage = 'Aim inside the goal — corners are safest.';
    }

    updateHUD();
    phase = 'resolving';
    setTimeout(() => {
      ball.active=false; ball.done=false; ball.progress=0; power=0;
      resetKeeperStand();
      phase = 'aim';
      sideMessage = 'Aim · Hold to charge · Release to shoot';
    }, 1200);
  }

  // ── Drawing ────────────────────────────────────────────────────────────────
  function drawPitch() {
    if (!ctx) return;
    ctx.fillStyle='#0f1f10'; ctx.fillRect(0,0,LW,LH);
    for (let i=0;i<12;i++) { if(i%2===0){ctx.fillStyle='rgba(255,255,255,0.018)';ctx.fillRect((i/12)*LW,0,LW/12,LH);} }
    const sp=ctx.createRadialGradient(LW/2,-80,40,LW/2,-80,LH*1.1);
    sp.addColorStop(0,'rgba(255,245,200,0.08)'); sp.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=sp; ctx.fillRect(0,0,LW,LH);
    ctx.strokeStyle='rgba(255,255,255,0.07)'; ctx.lineWidth=1;
    ctx.strokeRect((LW-GOAL.w*1.65)/2,0,GOAL.w*1.65,LH*0.40);
    ctx.strokeRect((LW-GOAL.w*1.1)/2,0,GOAL.w*1.1,LH*0.18);
    ctx.fillStyle='rgba(255,255,255,0.45)';
    ctx.beginPath(); ctx.arc(BALL_HOME.x,BALL_HOME.y,3.5,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.05)';
    ctx.beginPath(); ctx.arc(LW/2,LH*0.78,60,0,Math.PI*2); ctx.stroke();
  }

  function drawNet() {
    if (!ctx) return;
    const gx=GOAL.cx-GOAL.w/2+GOAL.post, gy=GOAL.cy+GOAL.post, gw=GOAL.w-GOAL.post*2, gh=GOAL.h;
    const wave=ball.active&&ball.progress>0.88?Math.sin(frame*0.4)*2.5:0;
    ctx.strokeStyle='rgba(255,255,255,0.10)'; ctx.lineWidth=0.6;
    for (let c=0;c<=10;c++) { const nx=gx+(c/10)*gw+(ball.active&&ball.progress>0.88?wave*0.3:0); ctx.beginPath();ctx.moveTo(nx,gy);ctx.lineTo(nx,gy+gh);ctx.stroke(); }
    for (let r=0;r<=4;r++) { const ny=gy+(r/4)*gh; ctx.beginPath();ctx.moveTo(gx,ny+(r>0?wave:0));ctx.lineTo(gx+gw,ny+(r>0?wave:0));ctx.stroke(); }
  }

  function drawGoalPosts() {
    if (!ctx) return;
    ctx.shadowColor='rgba(0,0,0,0.5)'; ctx.shadowBlur=8;
    ctx.strokeStyle='#fff'; ctx.lineWidth=GOAL.post; ctx.lineJoin='round'; ctx.lineCap='round';
    ctx.beginPath();
    ctx.moveTo(GOAL.cx-GOAL.w/2,GOAL.cy+GOAL.h+24); ctx.lineTo(GOAL.cx-GOAL.w/2,GOAL.cy);
    ctx.lineTo(GOAL.cx+GOAL.w/2,GOAL.cy); ctx.lineTo(GOAL.cx+GOAL.w/2,GOAL.cy+GOAL.h+24);
    ctx.stroke(); ctx.shadowBlur=0;
  }

  function drawKeeper() {
    if (!ctx || phase==='intro') return;
    let kx=keeper.x, ky=keeper.y, angle=0;
    if (keeper.diving) {
      keeper.diveProgress=Math.min(1,keeper.diveProgress+keeper.diveSpeed);
      const t=easeOut(keeper.diveProgress);
      kx=lerp(keeper.x,keeper.diveTargetX,t); ky=lerp(keeper.y,keeper.diveTargetY,t);
      angle=keeper.diveAngle*Math.min(keeper.diveProgress*1.4,1);
    }
    ctx.save(); ctx.translate(kx+keeper.w/2,ky+keeper.h/2); ctx.rotate(angle);
    ctx.fillStyle='#f59e0b'; ctx.fillRect(-keeper.w/2,-keeper.h/2,keeper.w,keeper.h);
    ctx.fillStyle='rgba(0,0,0,0.28)'; ctx.fillRect(-keeper.w/2+keeper.w*0.32,-keeper.h/2,keeper.w*0.36,keeper.h);
    ctx.fillStyle='rgba(255,255,255,0.12)'; ctx.fillRect(-keeper.w/2+2,-keeper.h/2+2,keeper.w-4,3);
    ctx.beginPath(); ctx.arc(0,-keeper.h/2-9,9,0,Math.PI*2); ctx.fillStyle='#f5d0a0'; ctx.fill();
    ctx.fillStyle='#fde68a';
    ctx.beginPath(); ctx.arc(-keeper.w/2-3,0,5,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(keeper.w/2+3,0,5,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }

  function drawBall() {
    if (!ctx) return;
    let bx=BALL_HOME.x, by=BALL_HOME.y, scale=1;
    const rot=frame*0.2*Math.sign(ball.spin||1);
    if (ball.active) {
      const t=easeIn(Math.min(ball.progress,1));
      bx=lerp(BALL_HOME.x,ball.tx,t); by=lerp(BALL_HOME.y,ball.ty,t); scale=lerp(1,0.36,t);
    } else if (phase==='resolving') return;
    const r=11*scale;
    ctx.save(); ctx.translate(bx,by); ctx.rotate(rot);
    ctx.beginPath(); ctx.ellipse(0,r+2,r*0.8,r*0.25,0,0,Math.PI*2); ctx.fillStyle='rgba(0,0,0,0.22)'; ctx.fill();
    ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.fillStyle='#fff'; ctx.fill();
    ctx.strokeStyle='rgba(0,0,0,0.1)'; ctx.lineWidth=0.5; ctx.stroke();
    for (let i=0;i<5;i++) { const a=(i/5)*Math.PI*2; ctx.beginPath();ctx.arc(Math.cos(a)*r*0.44,Math.sin(a)*r*0.44,r*0.24,0,Math.PI*2);ctx.fillStyle='rgba(20,20,20,0.22)';ctx.fill(); }
    ctx.restore();
  }

  function drawAimLine() {
    if (!ctx||!aimVisible||phase!=='aim') return;
    const inGoal=mouseX>GOAL.cx-GOAL.w/2&&mouseX<GOAL.cx+GOAL.w/2&&mouseY>GOAL.cy-10&&mouseY<GOAL.cy+GOAL.h+40;
    ctx.save(); ctx.setLineDash([5,8]);
    ctx.strokeStyle=inGoal?'rgba(16,185,129,0.3)':'rgba(255,255,255,0.14)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(BALL_HOME.x,BALL_HOME.y); ctx.lineTo(mouseX,mouseY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle=inGoal?'rgba(16,185,129,0.7)':'rgba(255,255,255,0.4)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.arc(mouseX,mouseY,6,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(mouseX-13,mouseY);ctx.lineTo(mouseX+13,mouseY);ctx.moveTo(mouseX,mouseY-13);ctx.lineTo(mouseX,mouseY+13); ctx.stroke();
    ctx.restore();
  }

  function drawPowerBar() {
    if (!ctx||!mouseHeld||phase!=='aim') return;
    const bx=BALL_HOME.x-60, by=BALL_HOME.y+22, bw=120, bh=5;
    ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.fillRect(bx,by,bw,bh);
    ctx.fillStyle=power>0.72?'#ef4444':power>0.45?'#f59e0b':'#10b981';
    ctx.fillRect(bx,by,bw*power,bh);
    ctx.fillStyle='rgba(255,255,255,0.38)'; ctx.font='500 8px "JetBrains Mono",monospace'; ctx.textAlign='center';
    ctx.fillText(power>0.72?'POWERSHOT':power>0.45?'STRONG':'PLACED',BALL_HOME.x,by+16);
  }

  function drawParticles() {
    if (!ctx) return;
    particles=particles.filter(p=>{
      p.x+=p.vx;p.y+=p.vy;p.vy+=0.09;p.vx*=0.97;p.alpha-=p.decay;
      if(p.alpha<=0) return false;
      ctx!.globalAlpha=p.alpha;ctx!.beginPath();ctx!.arc(p.x,p.y,p.r,0,Math.PI*2);ctx!.fillStyle=p.color;ctx!.fill();ctx!.globalAlpha=1;
      return true;
    });
  }

  function drawBigText() {
    if (!ctx||bigText.alpha<=0) return;
    ctx.save(); ctx.globalAlpha=Math.min(bigText.alpha,1);
    ctx.font='500 44px "Inter",sans-serif'; ctx.fillStyle=bigText.color; ctx.textAlign='center';
    ctx.fillText(bigText.text,LW/2,LH*0.5); ctx.restore();
    bigText.alpha-=0.022;
  }

  function drawIntro() {
    if (!ctx) return;
    ctx.fillStyle='rgba(8,10,8,0.82)'; ctx.fillRect(0,0,LW,LH);
    ctx.font='500 32px "Inter",sans-serif'; ctx.fillStyle='#fff'; ctx.textAlign='center';
    ctx.fillText('Penalty Lab',LW/2,LH/2-20);
    ctx.font='10px "JetBrains Mono",monospace'; ctx.fillStyle='rgba(255,255,255,0.38)';
    ctx.fillText('AIM  ·  HOLD TO CHARGE  ·  RELEASE',LW/2,LH/2+12);
    ctx.fillStyle='rgba(255,255,255,0.18)';
    ctx.fillText('Tap or click to start',LW/2,LH/2+34);
  }

  function loop() {
    rafId=requestAnimationFrame(loop); frame++;
    if (!ctx) return;
    if (shake.dur>0) { shake.t++; const p=shake.t/shake.dur,m=shake.mag*(1-p); shake.x=(Math.random()-0.5)*m; shake.y=(Math.random()-0.5)*m; if(shake.t>=shake.dur)shake.dur=0; }
    else { shake.x=0; shake.y=0; }
    if (mouseHeld&&phase==='aim') power=clamp((performance.now()-holdStart)/1000*1.3,0,1);
    if (phase==='shooting'&&ball.active) {
      ball.progress+=ball.speed;
      if (!keeper.reacted) { keeper.reactionTimer--; if(keeper.reactionTimer<=0){keeper.reacted=true;keeper.diving=true;} }
      if (ball.progress>=1&&!ball.done) { ball.done=true; resolveShot(); }
    }
    if (flashAlpha>0) flashAlpha-=0.04;
    ctx.save(); ctx.translate(shake.x,shake.y);
    ctx.clearRect(0,0,LW,LH);
    drawPitch(); drawNet();
    if (flashAlpha>0) { ctx.fillStyle=flashColor; ctx.globalAlpha=flashAlpha*0.2; ctx.fillRect(0,0,LW,LH); ctx.globalAlpha=1; }
    drawGoalPosts(); drawKeeper(); drawAimLine(); drawBall(); drawPowerBar(); drawParticles(); drawBigText();
    if (phase==='intro') drawIntro();
    ctx.restore();
  }

  function setupCanvas() {
    if (!canvas||!wrapper) return;
    const dpr=window.devicePixelRatio||1;
    canvas.width=Math.round(LW*dpr); canvas.height=Math.round(LH*dpr);
    ctx=canvas.getContext('2d');
    if (ctx) ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  function toLogical(clientX:number, clientY:number) {
    const rect=canvas.getBoundingClientRect();
    return { x:(clientX-rect.left)*(LW/rect.width), y:(clientY-rect.top)*(LH/rect.height) };
  }

  function onMouseMove(e:MouseEvent)  { const {x,y}=toLogical(e.clientX,e.clientY); mouseX=x; mouseY=y; aimVisible=true; }
  function onMouseLeave()              { aimVisible=false; if(mouseHeld&&phase==='aim'){mouseHeld=false;shoot();} }
  function onMouseDown()               { if(phase==='intro'){startGame();return;} if(phase==='resolving')return; if(phase!=='aim')return; mouseHeld=true;holdStart=performance.now();power=0; }
  function onMouseUp()                 { if(!mouseHeld)return; mouseHeld=false; if(phase==='aim')shoot(); }

  onMount(()=>{
    setupCanvas(); loop();
    canvas.addEventListener('mousemove',  onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('mousedown',  onMouseDown);
    canvas.addEventListener('mouseup',    onMouseUp);
    canvas.addEventListener('touchmove',(e)=>{e.preventDefault();const t=e.touches[0];const{x,y}=toLogical(t.clientX,t.clientY);mouseX=x;mouseY=y;aimVisible=true;},{passive:false});
    canvas.addEventListener('touchstart',(e)=>{e.preventDefault();const t=e.touches[0];const{x,y}=toLogical(t.clientX,t.clientY);mouseX=x;mouseY=y;if(phase==='intro'){startGame();return;}if(phase!=='aim')return;mouseHeld=true;holdStart=performance.now();power=0;},{passive:false});
    canvas.addEventListener('touchend',()=>{if(!mouseHeld)return;mouseHeld=false;if(phase==='aim')shoot();});
    window.addEventListener('resize',setupCanvas,{passive:true});
    return ()=>{ cancelAnimationFrame(rafId); window.removeEventListener('resize',setupCanvas); };
  });
  onDestroy(()=>{ if(typeof window!=='undefined') cancelAnimationFrame(rafId); });
</script>

<section class="py-16 sm:py-20 px-4 sm:px-6">
  <div class="mx-auto max-w-6xl">

    <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-8">
      <div>
        <p class="text-xs font-mono uppercase tracking-[0.35em] text-accent-500 mb-2">// Playground</p>
        <h2 class="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-100">Penalty Lab</h2>
      </div>
      <p class="max-w-sm text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
        Aim and shoot. The keeper reads your patterns — mix up your zones to score.
      </p>
    </div>

    <div class="flex flex-col gap-5 lg:grid lg:grid-cols-[1fr_260px] items-start">

      <div bind:this={wrapper}
        class="w-full rounded-[28px] overflow-hidden border border-gray-200 dark:border-white/10 shadow-2xl bg-[#0f1f10]"
        style="aspect-ratio:680/400">
        <canvas bind:this={canvas} class="block w-full h-full cursor-crosshair touch-none select-none"></canvas>
      </div>

      <div class="flex flex-col gap-3 w-full">

        <div class="rounded-[24px] border border-white/8 bg-white/5 p-4">
          <p class="text-[9px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-3">Performance</p>
          <div class="grid grid-cols-3 gap-2 text-center mb-2">
            {#each [[goals,'Goals'],[attempts,'Shots'],[streak,'Streak']] as [v,l]}
              <div class="rounded-xl bg-zinc-100 dark:bg-[#111827] p-3">
                <p class="text-xl font-bold text-zinc-900 dark:text-white">{v}</p>
                <p class="text-[8px] uppercase tracking-[0.25em] text-zinc-400 mt-0.5">{l}</p>
              </div>
            {/each}
          </div>
          <div class="grid grid-cols-2 gap-2">
            {#each [[accuracy||'—','Accuracy'],[bestStreak,'Best streak']] as [v,l]}
              <div class="rounded-xl bg-zinc-100 dark:bg-[#111827] px-3 py-2.5 text-center">
                <p class="text-base font-bold text-zinc-900 dark:text-white">{v}</p>
                <p class="text-[8px] uppercase tracking-[0.25em] text-zinc-400 mt-0.5">{l}</p>
              </div>
            {/each}
          </div>
        </div>

        <div class="rounded-[24px] border border-white/8 bg-white/5 p-4">
          <p class="text-[9px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-2">Report</p>
          <p class="text-sm font-semibold text-zinc-900 dark:text-white">{lastResult || 'No shots yet'}</p>
          <p class="mt-1 text-xs text-zinc-500 leading-relaxed">{sideMessage}</p>
        </div>

        <div class="rounded-[24px] border border-white/8 bg-white/5 p-4">
          <p class="text-[9px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-2">How it works</p>
          <ul class="space-y-1.5 text-xs text-zinc-500 leading-relaxed">
            <li><span class="text-zinc-800 dark:text-white font-medium">Aim</span> — move cursor / drag finger</li>
            <li><span class="text-zinc-800 dark:text-white font-medium">Power</span> — hold to charge</li>
            <li><span class="text-zinc-800 dark:text-white font-medium">Shoot</span> — release to fire</li>
            <li class="pt-1 text-zinc-400 dark:text-zinc-500">Keeper picks a zone. Right guess = save. Wrong guess = goal. Mix your shots.</li>
          </ul>
        </div>

        <button type="button" on:click={resetSession}
          class="w-full rounded-xl border border-zinc-200 dark:border-white/10 bg-transparent px-4 py-3
            text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400
            transition hover:bg-zinc-100 dark:hover:bg-white/8 hover:text-zinc-900 dark:hover:text-white">
          Reset session
        </button>
      </div>
    </div>
  </div>
</section>

<style>canvas { display: block; }</style>