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
          ctx.strokeStyle = `rgba(13,148,136,${(1-d/120)*.16})`;
          ctx.lineWidth=1;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
    }
    for(const p of points){
      ctx.fillStyle='rgba(147,51,234,.45)';
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

  // ---------- Search experience ----------
  // The actual <input>/<button> are rendered async by GoDaddy's widget, so we
  // wait for them to exist before wiring anything up.
  (function initSearchExperience(){
    const searchCard = document.querySelector('.search-card');
    const widgetRoot = document.querySelector('.rstore-domain-search');
    if(!searchCard || !widgetRoot) return;

    const nativeInputSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    function setReactInputValue(input, value){
      nativeInputSetter.call(input, value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function getFields(){
      return {
        input: widgetRoot.querySelector('.search-field'),
        button: widgetRoot.querySelector('.search-submit')
      };
    }

    function runSearch(value){
      const { input, button } = getFields();
      if(!input || !button) return;
      setReactInputValue(input, value);
      button.click();
    }

    function nudge(){
      searchCard.classList.remove('nudge');
      void searchCard.offsetWidth; // restart animation
      searchCard.classList.add('nudge');
      setTimeout(() => searchCard.classList.remove('nudge'), 420);
      const { input } = getFields();
      if(input) input.focus();
    }

    // Suggestion chips: fill + search immediately
    document.querySelectorAll('.suggest-chip').forEach(chip => {
      chip.addEventListener('click', () => runSearch(chip.dataset.example));
    });

    // Popular TLD rail: append/swap TLD onto whatever's typed, or nudge if empty
    document.querySelectorAll('.rail-item[data-tld]').forEach(btn => {
      btn.addEventListener('click', () => {
        const { input } = getFields();
        const current = (input && input.value || '').trim();
        const base = current.replace(/\.[a-z]{2,}$/i, '');
        if(!base){ nudge(); return; }
        runSearch(base + btn.dataset.tld);
      });
    });

    // Rotating placeholder — pauses once the field has focus or a value
    const rotatingExamples = ['yourbrand', 'clickflame', 'mechanicrank', 'getstarted', 'yourname'];
    let rotateIdx = 0;
    let focused = false;
    setInterval(() => {
      const { input } = getFields();
      if(!input || focused || input.value) return;
      rotateIdx = (rotateIdx + 1) % rotatingExamples.length;
      input.setAttribute('placeholder', rotatingExamples[rotateIdx]);
    }, 2400);

    // Focus glow state + "/" keyboard shortcut
    function attachFocusHandlers(){
      const { input } = getFields();
      if(!input || input.dataset.axionWired) return;
      input.dataset.axionWired = '1';
      input.addEventListener('focus', () => { focused = true; searchCard.classList.add('is-focused'); });
      input.addEventListener('blur', () => { focused = false; searchCard.classList.remove('is-focused'); });
    }
    attachFocusHandlers();

    document.addEventListener('keydown', (e) => {
      if(e.key !== '/' ) return;
      const tag = (document.activeElement && document.activeElement.tagName) || '';
      if(tag === 'INPUT' || tag === 'TEXTAREA') return;
      e.preventDefault();
      searchCard.scrollIntoView({ behavior:'smooth', block:'center' });
      const { input } = getFields();
      if(input) input.focus();
    });

    // Staggered entrance for results as the widget renders them, and re-attach
    // focus handlers in case the widget re-renders its own input node.
    let resultIndex = 0;
    const observer = new MutationObserver(() => {
      attachFocusHandlers();
      const results = widgetRoot.querySelectorAll('.domain-result:not(.axion-in)');
      results.forEach(el => {
        el.style.animationDelay = (resultIndex * 60) + 'ms';
        el.classList.add('axion-in');
        resultIndex++;
      });
      if(widgetRoot.querySelectorAll('.domain-result').length === 0) resultIndex = 0;
    });
    observer.observe(widgetRoot, { childList:true, subtree:true });
  })();
