// Particle network
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w, h, points;

  function resize(){
    const hero = document.querySelector('.hero');
    w = canvas.width = hero.offsetWidth;
    h = canvas.height = hero.offsetHeight;
    const count = Math.min(70, Math.floor(w/22));
    points = Array.from({length:count}, () => ({
      x: Math.random()*w, y: Math.random()*h,
      vx: (Math.random()-.5)*.25, vy: (Math.random()-.5)*.25
    }));
  }
  window.addEventListener('resize', resize);
  resize();

  function draw(){
    ctx.clearRect(0,0,w,h);
    for(const p of points){
      if(!reduced){ p.x += p.vx; p.y += p.vy; }
      if(p.x<0||p.x>w) p.vx*=-1;
      if(p.y<0||p.y>h) p.vy*=-1;
    }
    for(let i=0;i<points.length;i++){
      for(let j=i+1;j<points.length;j++){
        const a=points[i], b=points[j];
        const d = Math.hypot(a.x-b.x, a.y-b.y);
        if(d<120){
          ctx.strokeStyle = `rgba(110,250,216,${(1-d/120)*.22})`;
          ctx.lineWidth=1;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
    }
    for(const p of points){
      ctx.fillStyle='rgba(199,125,255,.6)';
      ctx.beginPath(); ctx.arc(p.x,p.y,1.6,0,7); ctx.fill();
    }
    if(!reduced) requestAnimationFrame(draw);
  }
  draw();

  // Reveal on scroll
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if(en.isIntersecting) en.target.classList.add('in'); });
  }, {threshold:.15});
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
