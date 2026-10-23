// Click-to-move navigation: side dots with labels + a floating "next section" button.
// Sections opt in with data-nav="label".
(function(){
  const secs=[...document.querySelectorAll('[data-nav]')];
  if(secs.length<2)return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const go=el=>el.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});

  const rail=document.createElement('nav');
  rail.className='rail';rail.setAttribute('aria-label','أقسام الصفحة');
  rail.innerHTML=secs.map((s,i)=>`<button type="button" data-i="${i}" aria-label="${s.dataset.nav}"><span>${s.dataset.nav}</span></button>`).join('');
  document.body.appendChild(rail);

  const step=document.createElement('div');
  step.className='stepper';
  step.innerHTML=`<button type="button" class="st-prev" aria-label="القسم السابق"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 15l6-6 6 6"/></svg></button>
  <button type="button" class="st-next"><span class="st-label"></span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></button>
  <span class="st-count" aria-hidden="true"></span>`;
  document.body.appendChild(step);

  const dots=[...rail.children],prev=step.querySelector('.st-prev'),next=step.querySelector('.st-next'),
        label=step.querySelector('.st-label'),count=step.querySelector('.st-count');
  let cur=0;
  function current(){
    const y=innerHeight*.35;let c=0;
    secs.forEach((s,i)=>{if(s.getBoundingClientRect().top<=y)c=i});
    return c;
  }
  function paint(){
    cur=current();
    dots.forEach((d,i)=>d.toggleAttribute('aria-current',i===cur));
    const last=cur===secs.length-1;
    label.textContent=last?'العودة للأعلى':'التالي: '+secs[cur+1].dataset.nav;
    next.setAttribute('aria-label',label.textContent);
    prev.disabled=cur===0;
    count.textContent=(cur+1)+' / '+secs.length;
  }
  dots.forEach(d=>d.onclick=()=>go(secs[+d.dataset.i]));
  next.onclick=()=>go(secs[cur===secs.length-1?0:cur+1]);
  prev.onclick=()=>cur>0&&go(secs[cur-1]);
  addEventListener('scroll',paint,{passive:true});addEventListener('resize',paint);paint();
  // keyboard: J/K or Alt+arrows move between sections (plain arrows stay for sliders/tabs)
  addEventListener('keydown',e=>{
    if(e.target.closest('input,textarea,select,[role=tab]'))return;
    if(e.key==='j'||(e.altKey&&e.key==='ArrowDown')){e.preventDefault();next.click()}
    if(e.key==='k'||(e.altKey&&e.key==='ArrowUp')){e.preventDefault();prev.click()}
  });
})();
