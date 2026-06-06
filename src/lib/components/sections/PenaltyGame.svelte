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

  // ── Goal geometry ─────────────────────────────────────────────────────────
  const GOAL = {
    cx: LW / 2,
    cy: LH * 0.10,   // top of goal (crossbar)
    w:  LW * 0.46,
    h:  LH * 0.17,   // slightly taller for easier targeting
    post: 6,
  };

  // ── inGoal bounds — generous so bottom/corners register correctly ─────────
  const GOAL_HIT = {
    l: GOAL.cx - GOAL.w / 2 + GOAL.post,
    r: GOAL.cx + GOAL.w / 2 - GOAL.post,
    t: GOAL.cy,
    b: GOAL.cy + GOAL.h + 28,   // match visual post length (ground level)
  };

  const BALL_HOME = { x: LW / 2, y: LH * 0.80 };

  type Zone = 'left' | 'center' | 'right';

  function getZone(x: number): Zone {
    const third = GOAL.w / 3;
    if (x < GOAL_HIT.l + third)      return 'left';
    if (x < GOAL_HIT.l + third * 2)  return 'center';
    return 'right';
  }
  

  let ball = {
    x: BALL_HOME.x, y: BALL_HOME.y,
    tx: 0, ty: 0, progress: 0, speed: 0,
    active: false, done: false, spin: 0,
    shotZone: 'center' as Zone,
  };

  let keeper = {
    x: LW / 2 - 28, y: GOAL.cy + GOAL.post + 2,
    w: 58, h: 18,
    diveTargetX: LW / 2 - 28, diveTargetY: GOAL.cy + GOAL.post + 2,
    diveProgress: 0, diveSpeed: 0.055,
    diving: false, reactionTimer: 0, reacted: false,
    diveAngle: 0, diveZone: 'center' as Zone,
  };

  interface Particle { x:number;y:number;vx:number;vy:number;r:number;color:string;alpha:number;decay:number; }
  let particles: Particle[] = [];
  let shake = { x:0,y:0,mag:0,dur:0,t:0 };
  let flashColor = '', flashAlpha = 0;
  let bigText = { text:'', color:'#fff', alpha:0 };
  let shotHistory: Zone[] = [];

  const lerp    = (a:number,b:number,t:number) => a+(b-a)*t;
  const easeOut = (t:number) => 1-(1-t)**3;
  const easeIn  = (t:number) => t*t*t;
  const clamp   = (v:number,lo:number,hi:number) => Math.min(hi,Math.max(lo,v));

  function updateHUD() { accuracy = attempts > 0 ? `${Math.round((goals/attempts)*100)}%` : ''; }
  function addShake(mag:number, dur:number) { shake={x:0,y:0,mag,dur,t:0}; }
  function addParticles(x:number, y:number, color:string, n=18) {
    for (let i=0;i<n;i++) {
      const a=Math.random()*Math.PI*2, sp=1.5+Math.random()*4;
      particles.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,r:1.5+Math.random()*3,color,alpha:1,decay:0.016+Math.random()*0.012});
    }
  }

  // ── Keeper AI ─────────────────────────────────────────────────────────────
  function decideKeeperDive(shotZone: Zone) {
    let diveZone: Zone;
    const others = (['left','center','right'] as Zone[]).filter(z => z !== shotZone);

    if (attempts < 3) {
      diveZone = shotZone;
    } else if (attempts === 3) {
      diveZone = others[Math.floor(Math.random() * others.length)];
    } else {
      const recentMisses = Math.max(0, attempts - goals);
      let keeperSkill = 0.68;
      if (recentMisses >= 3) keeperSkill = 0.40;
      if (recentMisses >= 5) keeperSkill = 0.28;
      if (streak >= 3)       keeperSkill = 0.78;
      if (streak >= 6)       keeperSkill = 0.88;
      const recent = shotHistory.slice(-6);
      const sameCount = recent.filter(z => z === shotZone).length;
      if (recent.length >= 3) keeperSkill += (sameCount / recent.length) * 0.18;
      keeperSkill = clamp(keeperSkill, 0.20, 0.92);
      diveZone = Math.random() < keeperSkill
        ? shotZone
        : others[Math.floor(Math.random() * others.length)];
    }

    keeper.diveZone = diveZone;
    const third = GOAL.w / 3;
    let diveX: number;
    if      (diveZone === 'left')   diveX = GOAL_HIT.l + third * 0.4  - keeper.w / 2;
    else if (diveZone === 'center') diveX = GOAL.cx                    - keeper.w / 2;
    else                            diveX = GOAL_HIT.l + third * 2.6  - keeper.w / 2;

    const diveY = GOAL.cy + GOAL.h * (power > 0.72 ? 0.05 : 0.15 + Math.random() * 0.35);
    keeper.diveTargetX   = diveX;
    keeper.diveTargetY   = diveY;
    keeper.diveAngle     = diveZone === 'left' ? -0.75 : diveZone === 'right' ? 0.75 : 0;
    keeper.diveSpeed     = attempts < 3 ? 0.09 : clamp(0.045 + goals * 0.006, 0.045, 0.10);
    keeper.reactionTimer = attempts < 3 ? 8   : clamp(26 - goals * 2, 8, 26);
    keeper.reacted = false; keeper.diving = false; keeper.diveProgress = 0;
  }

  function startGame()   { phase='aim'; resetBall(); resetKeeperStand(); sideMessage='Aim · Hold to charge · Release to shoot'; }
  function resetSession(){ goals=0;attempts=0;streak=0;bestStreak=0;lastResult='';shotHistory=[];updateHUD();startGame(); }
  function resetBall()   { ball={...ball,x:BALL_HOME.x,y:BALL_HOME.y,active:false,done:false,progress:0};power=0; }
  function resetKeeperStand() {
    keeper.x=LW/2-keeper.w/2; keeper.y=GOAL.cy+GOAL.post+2;
    keeper.diving=false; keeper.diveProgress=0; keeper.reacted=false;
  }

  function shoot() {
    if (phase !== 'aim') return;

    // No clamping — ball goes exactly where player aimed
    const tx = mouseX;
    const ty = mouseY;

    ball.tx=tx; ball.ty=ty; ball.progress=0; ball.active=true; ball.done=false;
    ball.speed = 0.024 + power * 0.038;
    ball.spin  = (mouseX - LW/2) * 0.004;

    const sz = getZone(tx);
    ball.shotZone = sz;
    shotHistory.push(sz);
    if (shotHistory.length > 8) shotHistory.shift();

    decideKeeperDive(sz);
    if (power > 0.72) addShake(6, 14);
    phase = 'shooting'; sideMessage = '';
  }

  function resolveShot() {
    attempts++;

    // Generous hit detection — full goal height, no trim
    const inGoal = ball.tx >= GOAL_HIT.l && ball.tx <= GOAL_HIT.r
                && ball.ty >= GOAL_HIT.t && ball.ty <= GOAL_HIT.b;

    const shotZone = ball.shotZone;
    const saved    = inGoal && (keeper.diveZone === shotZone);

    if (inGoal && !saved) {
      goals++; streak++; if (streak > bestStreak) bestStreak = streak;
      flashColor='rgba(16,185,129,1)'; flashAlpha=1;
      bigText={text:'GOAL',color:'#4ade80',alpha:1.2};
      addParticles(ball.tx,ball.ty,'rgba(16,185,129,0.9)',22);
      addShake(4,14);
      lastResult  = streak>=3 ? `GOAL · ${streak} in a row` : 'GOAL';
      sideMessage = streak>=3 ? `On fire! ${streak} in a row` : 'Clinical finish!';
    } else if (saved) {
      streak=0; flashColor='rgba(239,68,68,1)'; flashAlpha=1;
      bigText={text:'SAVED',color:'#f87171',alpha:1.2};
      addParticles(ball.tx,ball.ty,'rgba(239,68,68,0.8)',14);
      lastResult='SAVED'; sideMessage='Keeper guessed your zone. Mix it up.';
    } else {
      streak=0; bigText={text:'MISSED',color:'#fbbf24',alpha:1.2};
      lastResult='MISSED'; sideMessage='Aim inside the goal — corners are hardest to save.';
    }

    updateHUD(); phase='resolving';
    setTimeout(()=>{
      ball.active=false;ball.done=false;ball.progress=0;power=0;
      resetKeeperStand();phase='aim';
      sideMessage='Aim · Hold to charge · Release to shoot';
    },1200);
  }

  // ── 3D PERSPECTIVE DRAWING ────────────────────────────────────────────────
  //
  // Vanishing point sits above the goal at (LW/2, VP_Y).
  // All pitch lines converge there, giving a proper 3D stadium feel.
  //
  const VP = { x: LW / 2, y: -LH * 0.35 }; // vanishing point above canvas

  function drawStadium() {
    if (!ctx) return;

    // ── Sky / night atmosphere ──
    const sky = ctx.createLinearGradient(0,0,0,LH*0.38);
    sky.addColorStop(0, '#0a0e1a');
    sky.addColorStop(1, '#0d1a10');
    ctx.fillStyle = sky;
    ctx.fillRect(0,0,LW,LH*0.38);

    // Stadium floodlights glow
    const lights: [number,number][] = [[LW*0.15,0],[LW*0.85,0],[LW*0.05,LH*0.05],[LW*0.95,LH*0.05]];
    lights.forEach(([lx,ly])=>{
      const g = ctx!.createRadialGradient(lx,ly,0,lx,ly,LH*0.5);
      g.addColorStop(0,'rgba(255,245,200,0.18)');
      g.addColorStop(1,'rgba(255,245,200,0)');
      ctx!.fillStyle=g; ctx!.fillRect(0,0,LW,LH);
    });

    // Crowd silhouette — two tiers
    ctx.fillStyle='rgba(20,28,20,0.9)';
    ctx.beginPath();
    ctx.moveTo(0,LH*0.32);
    for(let x=0;x<=LW;x+=6){
      const h=LH*0.04+Math.sin(x*0.08+13)*LH*0.012+Math.sin(x*0.22)*LH*0.006;
      ctx.lineTo(x, LH*0.28-h);
    }
    ctx.lineTo(LW,LH*0.32); ctx.closePath(); ctx.fill();

    ctx.fillStyle='rgba(15,22,15,0.95)';
    ctx.beginPath();
    ctx.moveTo(0,LH*0.38);
    for(let x=0;x<=LW;x+=4){
      const h=LH*0.05+Math.sin(x*0.07+7)*LH*0.015+Math.sin(x*0.19+3)*LH*0.008;
      ctx.lineTo(x, LH*0.33-h);
    }
    ctx.lineTo(LW,LH*0.38); ctx.closePath(); ctx.fill();
  }

  function drawPitch() {
    if (!ctx) return;

    // ── Perspective grass using VP ──
    // The pitch is a trapezoid: narrow at top, full width at bottom
    const pitchTop  = LH * 0.32;
    const pitchBot  = LH;
    const topLeft   = LW * 0.08, topRight  = LW * 0.92;
    const botLeft   = -LW * 0.1, botRight  = LW * 1.1;

    // Base grass gradient
    const grass = ctx.createLinearGradient(0,pitchTop,0,pitchBot);
    grass.addColorStop(0, '#0d2b0e');
    grass.addColorStop(0.4,'#112e12');
    grass.addColorStop(1, '#0a2209');
    ctx.fillStyle=grass;
    ctx.beginPath();
    ctx.moveTo(botLeft,pitchBot);
    ctx.lineTo(topLeft,pitchTop);
    ctx.lineTo(topRight,pitchTop);
    ctx.lineTo(botRight,pitchBot);
    ctx.closePath(); ctx.fill();

    // Perspective stripes
    const stripeCount = 10;
    for(let i=0;i<stripeCount;i++){
      if(i%2!==0) continue;
      const t1=i/stripeCount, t2=(i+1)/stripeCount;
      const x1l=lerp(botLeft,topLeft,t1), x1r=lerp(botRight,topRight,t1);
      const x2l=lerp(botLeft,topLeft,t2), x2r=lerp(botRight,topRight,t2);
      const y1=lerp(pitchBot,pitchTop,t1), y2=lerp(pitchBot,pitchTop,t2);
      ctx.fillStyle='rgba(255,255,255,0.025)';
      ctx.beginPath();
      ctx.moveTo(x1l,y1); ctx.lineTo(x1r,y1);
      ctx.lineTo(x2r,y2); ctx.lineTo(x2l,y2);
      ctx.closePath(); ctx.fill();
    }

    // Perspective pitch lines converging to VP
    function perspLine(bx:number, alpha:number){
      const fraction = (bx - botLeft)/(botRight - botLeft);
      const tx2 = topLeft + fraction*(topRight-topLeft);
      const ty2 = pitchTop;
      ctx!.strokeStyle=`rgba(255,255,255,${alpha})`;
      ctx!.lineWidth=0.8;
      ctx!.beginPath();
      ctx!.moveTo(bx,pitchBot);
      ctx!.lineTo(tx2,ty2);
      ctx!.stroke();
    }
    const linePositions=[0.15,0.28,0.42,0.5,0.58,0.72,0.85];
    linePositions.forEach(p=>perspLine(botLeft+p*(botRight-botLeft),0.06));

    // Horizontal lines (penalty area, centre)
    function perspHLine(frac:number, alpha:number, w=1){
      const xl=lerp(botLeft,topLeft,frac), xr=lerp(botRight,topRight,frac);
      const y=lerp(pitchBot,pitchTop,frac);
      ctx!.strokeStyle=`rgba(255,255,255,${alpha})`;
      ctx!.lineWidth=w;
      ctx!.beginPath(); ctx!.moveTo(xl,y); ctx!.lineTo(xr,y); ctx!.stroke();
    }
    perspHLine(0.28, 0.08);  // penalty area line
    perspHLine(0.14, 0.06);  // six-yard box
    perspHLine(0.52, 0.06);  // centre line

    // Penalty spot
    ctx.fillStyle='rgba(255,255,255,0.55)';
    ctx.beginPath(); ctx.arc(BALL_HOME.x,BALL_HOME.y,4,0,Math.PI*2); ctx.fill();

    // Penalty arc (perspective ellipse)
    ctx.strokeStyle='rgba(255,255,255,0.06)'; ctx.lineWidth=1;
    ctx.beginPath();
    ctx.ellipse(LW/2, BALL_HOME.y, 80, 22, 0, 0, Math.PI*2);
    ctx.stroke();
  }

  function drawGoal3D() {
    if (!ctx) return;
    const gx  = GOAL.cx - GOAL.w/2;
    const gy  = GOAL.cy;
    const gw  = GOAL.w;
    const gh  = GOAL.h;
    const pw  = GOAL.post;
    const DEPTH = 18; // depth of goal in px

    // ── Net back wall ──
    ctx.fillStyle='rgba(255,255,255,0.04)';
    ctx.fillRect(gx+pw, gy+pw, gw-pw*2, gh);

    // ── Net — vertical lines ──
    ctx.strokeStyle='rgba(255,255,255,0.09)'; ctx.lineWidth=0.5;
    for(let i=0;i<=12;i++){
      const nx=gx+pw+(i/12)*(gw-pw*2);
      ctx.beginPath(); ctx.moveTo(nx,gy); ctx.lineTo(nx,gy+gh+DEPTH*0.7); ctx.stroke();
    }
    // ── Net — horizontal lines ──
    for(let j=0;j<=5;j++){
      const ny=gy+(j/5)*gh;
      ctx.beginPath(); ctx.moveTo(gx+pw,ny); ctx.lineTo(gx+gw-pw,ny); ctx.stroke();
    }

    // Goal flash when ball hits
    if(flashColor==='rgba(16,185,129,1)' && flashAlpha>0){
      ctx.fillStyle=`rgba(16,185,129,${flashAlpha*0.25})`;
      ctx.fillRect(gx+pw,gy,gw-pw*2,gh);
    }

    // ── 3D depth sides (top bar side faces) ──
    // Left post side
    ctx.fillStyle='rgba(180,180,180,0.55)';
    ctx.beginPath();
    ctx.moveTo(gx,            gy);
    ctx.lineTo(gx+DEPTH*0.6, gy-DEPTH*0.5);
    ctx.lineTo(gx+DEPTH*0.6, gy+gh-DEPTH*0.5);
    ctx.lineTo(gx,            gy+gh);
    ctx.closePath(); ctx.fill();

    // Right post side
    ctx.beginPath();
    ctx.moveTo(gx+gw,            gy);
    ctx.lineTo(gx+gw-DEPTH*0.6, gy-DEPTH*0.5);
    ctx.lineTo(gx+gw-DEPTH*0.6, gy+gh-DEPTH*0.5);
    ctx.lineTo(gx+gw,            gy+gh);
    ctx.closePath(); ctx.fill();

    // Crossbar top face
    ctx.fillStyle='rgba(200,200,200,0.45)';
    ctx.beginPath();
    ctx.moveTo(gx,           gy);
    ctx.lineTo(gx+gw,        gy);
    ctx.lineTo(gx+gw-DEPTH*0.6, gy-DEPTH*0.5);
    ctx.lineTo(gx+DEPTH*0.6, gy-DEPTH*0.5);
    ctx.closePath(); ctx.fill();

    // ── Front posts (white, sharp) ──
    ctx.shadowColor='rgba(255,255,255,0.5)'; ctx.shadowBlur=6;
    ctx.strokeStyle='#ffffff'; ctx.lineWidth=pw; ctx.lineJoin='round'; ctx.lineCap='round';
    ctx.beginPath();
    ctx.moveTo(gx,    gy+gh+28);
    ctx.lineTo(gx,    gy);
    ctx.lineTo(gx+gw, gy);
    ctx.lineTo(gx+gw, gy+gh+28);
    ctx.stroke();
    ctx.shadowBlur=0;

    // Post ground shadows
    ctx.fillStyle='rgba(0,0,0,0.35)';
    ctx.beginPath(); ctx.ellipse(gx,    gy+gh+28, 8,3,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(gx+gw, gy+gh+28, 8,3,0,0,Math.PI*2); ctx.fill();
  }

  function drawKeeper() {
    if (!ctx || phase==='intro') return;
    let kx=keeper.x, ky=keeper.y, angle=0;
    if (keeper.diving) {
      keeper.diveProgress=Math.min(1,keeper.diveProgress+keeper.diveSpeed);
      const t=easeOut(keeper.diveProgress);
      kx=lerp(keeper.x,keeper.diveTargetX,t);
      ky=lerp(keeper.y,keeper.diveTargetY,t);
      angle=keeper.diveAngle*Math.min(keeper.diveProgress*1.4,1);
    }
    const kw=keeper.w, kh=keeper.h;

    ctx.save(); ctx.translate(kx+kw/2, ky+kh/2); ctx.rotate(angle);

    // Body shadow
    ctx.fillStyle='rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.ellipse(0,kh/2+4,kw*0.6,4,0,0,Math.PI*2); ctx.fill();

    // Kit body — gradient for 3D feel
    const bodyGrad=ctx.createLinearGradient(-kw/2,0,kw/2,0);
    bodyGrad.addColorStop(0,'#e68a00');
    bodyGrad.addColorStop(0.5,'#f59e0b');
    bodyGrad.addColorStop(1,'#b36b00');
    ctx.fillStyle=bodyGrad;
    ctx.fillRect(-kw/2,-kh/2,kw,kh);

    // Kit stripe
    ctx.fillStyle='rgba(0,0,0,0.22)'; ctx.fillRect(-kw*0.12,-kh/2,kw*0.24,kh);

    // Highlight
    ctx.fillStyle='rgba(255,255,255,0.14)'; ctx.fillRect(-kw/2+2,-kh/2+2,kw*0.4,2);

    // Head
    const headGrad=ctx.createRadialGradient(-2,-kh/2-10,1,-2,-kh/2-10,10);
    headGrad.addColorStop(0,'#fde4b0'); headGrad.addColorStop(1,'#c8974d');
    ctx.beginPath(); ctx.arc(0,-kh/2-9,10,0,Math.PI*2);
    ctx.fillStyle=headGrad; ctx.fill();

    // Gloves
    ctx.fillStyle='#fde68a';
    ctx.beginPath(); ctx.arc(-kw/2-4,0,5.5,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(kw/2+4,0,5.5,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='rgba(0,0,0,0.2)'; ctx.lineWidth=0.5;
    ctx.beginPath(); ctx.arc(-kw/2-4,0,5.5,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(kw/2+4,0,5.5,0,Math.PI*2); ctx.stroke();

    ctx.restore();
  }

  function drawBall() {
    if (!ctx) return;
    let bx=BALL_HOME.x, by=BALL_HOME.y, scale=1;
    const rot=frame*0.22*Math.sign(ball.spin||1);

    if (ball.active) {
      const t=easeIn(Math.min(ball.progress,1));
      bx=lerp(BALL_HOME.x,ball.tx,t);
      by=lerp(BALL_HOME.y,ball.ty,t);
      scale=lerp(1,0.32,t); // shrink more — stronger perspective
    } else if (phase==='resolving') return;

    const r=12*scale;

    // Ground shadow — perspective ellipse that shrinks with ball
    const shadowY=BALL_HOME.y+2;
    const shadowScaleX=lerp(1,0,easeIn(Math.min(ball.progress,1)));
    ctx.save();
    ctx.globalAlpha=0.35*shadowScaleX;
    ctx.beginPath();
    ctx.ellipse(BALL_HOME.x, shadowY, 14*shadowScaleX, 5*shadowScaleX, 0, 0, Math.PI*2);
    ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.fill();
    ctx.restore();

    ctx.save(); ctx.translate(bx,by); ctx.rotate(rot);

    // Ball glow (powershot)
    if (ball.active && power > 0.6) {
      ctx.beginPath(); ctx.arc(0,0,r+5,0,Math.PI*2);
      const glow=ctx.createRadialGradient(0,0,r,0,0,r+8);
      glow.addColorStop(0,`rgba(255,160,50,${(power-0.6)*0.5})`);
      glow.addColorStop(1,'rgba(255,160,50,0)');
      ctx.fillStyle=glow; ctx.fill();
    }

    // Main ball sphere with gradient
    const ballGrad=ctx.createRadialGradient(-r*0.3,-r*0.35,r*0.05,-r*0.1,-r*0.1,r*1.1);
    ballGrad.addColorStop(0,'#ffffff');
    ballGrad.addColorStop(0.4,'#f0f0f0');
    ballGrad.addColorStop(1,'#b0b0b0');
    ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2);
    ctx.fillStyle=ballGrad; ctx.fill();

    // Pentagon patches
    const patches=[[0,0],[0.42,0],[-.42,0],[0,.44],[0,-.44]];
    patches.forEach(([px,py])=>{
      ctx.beginPath(); ctx.arc(px*r,py*r,r*0.23,0,Math.PI*2);
      ctx.fillStyle='rgba(20,20,20,0.28)'; ctx.fill();
    });

    // Specular highlight
    ctx.beginPath(); ctx.arc(-r*0.3,-r*0.38,r*0.2,0,Math.PI*2);
    ctx.fillStyle='rgba(255,255,255,0.55)'; ctx.fill();

    ctx.restore();
  }

  function drawAimLine() {
    if (!ctx||!aimVisible||phase!=='aim') return;
    const inGoal=mouseX>=GOAL_HIT.l&&mouseX<=GOAL_HIT.r&&mouseY>=GOAL_HIT.t&&mouseY<=GOAL_HIT.b;
    ctx.save(); ctx.setLineDash([5,8]);
    ctx.strokeStyle=inGoal?'rgba(16,185,129,0.35)':'rgba(255,255,255,0.16)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(BALL_HOME.x,BALL_HOME.y); ctx.lineTo(mouseX,mouseY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle=inGoal?'rgba(16,185,129,0.75)':'rgba(255,255,255,0.45)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.arc(mouseX,mouseY,6,0,Math.PI*2); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(mouseX-13,mouseY); ctx.lineTo(mouseX+13,mouseY);
    ctx.moveTo(mouseX,mouseY-13); ctx.lineTo(mouseX,mouseY+13);
    ctx.stroke(); ctx.restore();
  }

  function drawPowerBar() {
    if (!ctx||!mouseHeld||phase!=='aim') return;
    const bx=BALL_HOME.x-64, by=BALL_HOME.y+22, bw=128, bh=5;
    ctx.fillStyle='rgba(0,0,0,0.55)'; ctx.fillRect(bx-1,by-1,bw+2,bh+2);
    ctx.fillStyle='rgba(0,0,0,0.35)'; ctx.fillRect(bx,by,bw,bh);
    const col=power>0.72?'#ef4444':power>0.45?'#f59e0b':'#10b981';
    ctx.fillStyle=col; ctx.fillRect(bx,by,bw*power,bh);
    ctx.fillStyle='rgba(255,255,255,0.4)'; ctx.font='500 8px "JetBrains Mono",monospace'; ctx.textAlign='center';
    ctx.fillText(power>0.72?'POWERSHOT':power>0.45?'STRONG':'PLACED',BALL_HOME.x,by+16);
  }

  function drawParticles() {
    if (!ctx) return;
    particles=particles.filter(p=>{
      p.x+=p.vx;p.y+=p.vy;p.vy+=0.09;p.vx*=0.97;p.alpha-=p.decay;
      if(p.alpha<=0) return false;
      ctx!.globalAlpha=p.alpha; ctx!.beginPath(); ctx!.arc(p.x,p.y,p.r,0,Math.PI*2); ctx!.fillStyle=p.color; ctx!.fill(); ctx!.globalAlpha=1;
      return true;
    });
  }

  function drawBigText() {
    if (!ctx||bigText.alpha<=0) return;
    ctx.save();
    ctx.globalAlpha=Math.min(bigText.alpha,1);
    // Shadow for legibility
    ctx.shadowColor='rgba(0,0,0,0.7)'; ctx.shadowBlur=12;
    ctx.font='700 46px "Inter",sans-serif'; ctx.fillStyle=bigText.color; ctx.textAlign='center';
    ctx.fillText(bigText.text,LW/2,LH*0.5);
    ctx.restore();
    bigText.alpha-=0.020;
  }

  function drawIntro() {
    if (!ctx) return;
    ctx.fillStyle='rgba(5,8,5,0.80)'; ctx.fillRect(0,0,LW,LH);
    ctx.font='700 34px "Inter",sans-serif'; ctx.fillStyle='#fff'; ctx.textAlign='center';
    ctx.shadowColor='rgba(16,185,129,0.6)'; ctx.shadowBlur=20;
    ctx.fillText('Penalty Lab',LW/2,LH/2-18);
    ctx.shadowBlur=0;
    ctx.font='11px "JetBrains Mono",monospace'; ctx.fillStyle='rgba(255,255,255,0.4)';
    ctx.fillText('AIM  ·  HOLD TO CHARGE  ·  RELEASE',LW/2,LH/2+12);
    ctx.fillStyle='rgba(255,255,255,0.2)'; ctx.font='10px "JetBrains Mono",monospace';
    ctx.fillText('Tap or click to begin',LW/2,LH/2+34);
  }

  function loop() {
    rafId=requestAnimationFrame(loop); frame++;
    if (!ctx) return;
    if (shake.dur>0){shake.t++;const p=shake.t/shake.dur,m=shake.mag*(1-p);shake.x=(Math.random()-0.5)*m;shake.y=(Math.random()-0.5)*m;if(shake.t>=shake.dur)shake.dur=0;}
    else{shake.x=0;shake.y=0;}
    if (mouseHeld&&phase==='aim') power=clamp((performance.now()-holdStart)/1000*1.3,0,1);
    if (phase==='shooting'&&ball.active){
      ball.progress+=ball.speed;
      if(!keeper.reacted){keeper.reactionTimer--;if(keeper.reactionTimer<=0){keeper.reacted=true;keeper.diving=true;}}
      if(ball.progress>=1&&!ball.done){ball.done=true;resolveShot();}
    }
    if(flashAlpha>0) flashAlpha-=0.035;

    ctx.save(); ctx.translate(shake.x,shake.y);
    ctx.clearRect(0,0,LW,LH);

    drawStadium();
    drawPitch();
    if(flashAlpha>0){ctx.fillStyle=flashColor;ctx.globalAlpha=flashAlpha*0.18;ctx.fillRect(0,0,LW,LH);ctx.globalAlpha=1;}
    drawGoal3D();
    drawKeeper();
    drawAimLine();
    drawBall();
    drawPowerBar();
    drawParticles();
    drawBigText();
    if(phase==='intro') drawIntro();
    ctx.restore();
  }

  function setupCanvas() {
    if (!canvas||!wrapper) return;
    const dpr=window.devicePixelRatio||1;
    canvas.width=Math.round(LW*dpr); canvas.height=Math.round(LH*dpr);
    ctx=canvas.getContext('2d');
    if(ctx) ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  function toLogical(clientX:number,clientY:number){
    const rect=canvas.getBoundingClientRect();
    return{x:(clientX-rect.left)*(LW/rect.width),y:(clientY-rect.top)*(LH/rect.height)};
  }

  function onMouseMove(e:MouseEvent){const{x,y}=toLogical(e.clientX,e.clientY);mouseX=x;mouseY=y;aimVisible=true;}
  function onMouseLeave(){aimVisible=false;if(mouseHeld&&phase==='aim'){mouseHeld=false;shoot();}}
  function onMouseDown(){if(phase==='intro'){startGame();return;}if(phase==='resolving')return;if(phase!=='aim')return;mouseHeld=true;holdStart=performance.now();power=0;}
  function onMouseUp(){if(!mouseHeld)return;mouseHeld=false;if(phase==='aim')shoot();}

  onMount(()=>{
    setupCanvas(); loop();
    canvas.addEventListener('mousemove',onMouseMove);
    canvas.addEventListener('mouseleave',onMouseLeave);
    canvas.addEventListener('mousedown',onMouseDown);
    canvas.addEventListener('mouseup',onMouseUp);
    canvas.addEventListener('touchmove',(e)=>{e.preventDefault();const t=e.touches[0];const{x,y}=toLogical(t.clientX,t.clientY);mouseX=x;mouseY=y;aimVisible=true;},{passive:false});
    canvas.addEventListener('touchstart',(e)=>{e.preventDefault();const t=e.touches[0];const{x,y}=toLogical(t.clientX,t.clientY);mouseX=x;mouseY=y;if(phase==='intro'){startGame();return;}if(phase!=='aim')return;mouseHeld=true;holdStart=performance.now();power=0;},{passive:false});
    canvas.addEventListener('touchend',()=>{if(!mouseHeld)return;mouseHeld=false;if(phase==='aim')shoot();});
    window.addEventListener('resize',setupCanvas,{passive:true});
    return()=>{cancelAnimationFrame(rafId);window.removeEventListener('resize',setupCanvas);};
  });
  onDestroy(()=>{if(typeof window!=='undefined')cancelAnimationFrame(rafId);});
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
        class="w-full rounded-[28px] overflow-hidden border border-gray-200 dark:border-white/10 shadow-2xl"
        style="aspect-ratio:680/400; background:#08100a">
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
          <p class="text-sm font-semibold text-zinc-900 dark:text-white">{lastResult||'No shots yet'}</p>
          <p class="mt-1 text-xs text-zinc-500 leading-relaxed">{sideMessage}</p>
        </div>

        <div class="rounded-[24px] border border-white/8 bg-white/5 p-4">
          <p class="text-[9px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-2">How it works</p>
          <ul class="space-y-1.5 text-xs text-zinc-500 leading-relaxed">
            <li><span class="text-zinc-800 dark:text-white font-medium">Aim</span> — move cursor to the goal</li>
            <li><span class="text-zinc-800 dark:text-white font-medium">Power</span> — hold to charge</li>
            <li><span class="text-zinc-800 dark:text-white font-medium">Shoot</span> — release to fire</li>
            <li class="pt-1 text-zinc-400 dark:text-zinc-500">Keeper picks a zone. Right guess = save. Wrong = goal.</li>
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

<style>canvas{display:block;}</style>