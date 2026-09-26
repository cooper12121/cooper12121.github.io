const canvas = document.querySelector('#latent');
const ctx = canvas.getContext('2d');
const motion = document.querySelector('#motion');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
let paused = reduced.matches, width = 0, height = 0, rotation = 0, frame = 0, visible = true;
const pointer = {x:0,y:0}, eased = {x:0,y:0};
const points = Array.from({length:1500}, (_, i) => {
  const u = i / 1500, theta = Math.acos(1 - 2 * u), phi = i * 2.3999632297;
  const ripple = 1 + .10 * Math.sin(theta * 9 + phi * 2) + .04 * Math.cos(phi * 5);
  return {x:Math.sin(theta)*Math.cos(phi)*ripple,y:Math.cos(theta)*ripple,z:Math.sin(theta)*Math.sin(phi)*ripple,i};
});
function resize(){const rect=canvas.getBoundingClientRect();width=rect.width;height=rect.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);draw();}
function draw(){
  ctx.clearRect(0,0,width,height);
  const scale=Math.min(width*.35,height*.38), a=rotation+eased.x*.35, tilt=-.24+eased.y*.2;
  const ca=Math.cos(a),sa=Math.sin(a),ct=Math.cos(tilt),st=Math.sin(tilt);
  const projected=points.map(p=>{const x=p.x*ca+p.z*sa,z=-p.x*sa+p.z*ca,y=p.y*ct-z*st,depth=p.y*st+z*ct;return{x:width/2+x*scale,y:height/2+y*scale,z:depth,i:p.i};}).sort((a,b)=>a.z-b.z);
  ctx.lineWidth=.5;
  for(let j=0;j<projected.length;j++){const p=projected[j],alpha=.15+(p.z+1.2)/2.4*.72;
    ctx.fillStyle=`rgba(199,238,145,${alpha})`;ctx.beginPath();ctx.arc(p.x,p.y,p.z>.4?1.2:.75,0,Math.PI*2);ctx.fill();
    if(p.i%7===0&&j+1<projected.length){const q=projected[j+1],d=Math.hypot(p.x-q.x,p.y-q.y);if(d<40){ctx.strokeStyle=`rgba(164,197,127,${alpha*.23})`;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}}
  }
  ctx.strokeStyle='rgba(164,197,127,.12)';ctx.beginPath();ctx.ellipse(width/2,height/2,scale*1.32,scale*.42,-.4,0,Math.PI*2);ctx.stroke();
}
let last=0;
function animate(t){frame=0;if(paused||!visible||document.hidden)return;const delta=last?Math.min(t-last,50):16;last=t;rotation+=delta*.00009;eased.x+=(pointer.x-eased.x)*.035;eased.y+=(pointer.y-eased.y)*.035;draw();frame=requestAnimationFrame(animate);}
function start(){if(!frame&&!paused&&visible&&!document.hidden){last=0;frame=requestAnimationFrame(animate);}}
function updateButton(){motion.setAttribute('aria-pressed',String(paused));motion.setAttribute('aria-label',paused?'Play animation':'Pause animation');motion.innerHTML=paused?'▷ <span>Play motion</span>':'Ⅱ <span>Pause motion</span>';}
motion.addEventListener('click',()=>{paused=!paused;updateButton();if(paused){cancelAnimationFrame(frame);frame=0;}else start();});
canvas.addEventListener('pointermove',e=>{const r=canvas.getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width-.5;pointer.y=(e.clientY-r.top)/r.height-.5;});
canvas.addEventListener('pointerleave',()=>{pointer.x=0;pointer.y=0;});
new ResizeObserver(resize).observe(canvas);
new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)start();else{cancelAnimationFrame(frame);frame=0;}},{threshold:0}).observe(canvas);
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else start();});
reduced.addEventListener('change',e=>{paused=e.matches;updateButton();if(paused){cancelAnimationFrame(frame);frame=0;draw();}else start();});
const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObserver.unobserve(e.target);}}),{threshold:.08});
document.querySelectorAll('.about-main,.section-heading,.focus-grid,.journey-main,.footer-title').forEach(el=>{el.classList.add('reveal');revealObserver.observe(el);});
updateButton();resize();start();

// A deterministic, local generative-art sketch. No model or network requests.
const art = document.querySelector('#word-art');
const artContext = art.getContext('2d');
const phraseInput = document.querySelector('#art-seed');
const chaosInput = document.querySelector('#art-chaos');
let sketch = 1;
function drawWordArt() {
  const phrase = phraseInput.value.trim() || 'a quiet kind of intelligence';
  const chaos = Number(chaosInput.value) / 100;
  let seed = 2166136261;
  for (const char of phrase) seed = Math.imul(seed ^ char.codePointAt(0), 16777619);
  function random() { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t ^= t + Math.imul(t ^ t >>> 7, 61 | t); return ((t ^ t >>> 14) >>> 0) / 4294967296; }
  const {width:w,height:h} = art.getBoundingClientRect();
  const dpr = Math.min(devicePixelRatio || 1, 2);
  art.width = w * dpr; art.height = h * dpr;
  artContext.setTransform(dpr,0,0,dpr,0,0);
  artContext.fillStyle = '#10140f'; artContext.fillRect(0,0,w,h);
  const radius = Math.min(w,h) * .34, frequency = 2 + Math.floor(random()*5), phase = random()*Math.PI*2;
  for (let line=0;line<90;line++) {
    const offset = line / 90;
    artContext.beginPath();
    artContext.strokeStyle = line%9===0 ? 'rgba(218,178,144,.7)' : `rgba(199,238,145,${.12+offset*.3})`;
    artContext.lineWidth = line%9===0 ? 1 : .65;
    for(let i=0;i<=220;i++) {
      const t=i/220*Math.PI*2;
      const r=radius*(.22+offset*.78)*(1+chaos*.28*Math.sin(t*frequency+phase+offset*5));
      const x=w/2+r*Math.cos(t+chaos*offset*2);
      const y=h*.46+r*Math.sin(t)*(.78+chaos*.15)+Math.sin(t*3+offset*7)*chaos*22;
      if(i===0)artContext.moveTo(x,y);else artContext.lineTo(x,y);
    }
    artContext.closePath(); artContext.stroke();
  }
  document.querySelector('#art-title').textContent=phrase;
  document.querySelector('#art-number').textContent=`SKETCH ${String(sketch).padStart(3,'0')}`;
  art.setAttribute('aria-label',`Generative line drawing for “${phrase}”, serendipity ${chaosInput.value}%`);
}
document.querySelector('#art-form').addEventListener('submit',event=>{event.preventDefault();sketch++;drawWordArt();});
chaosInput.addEventListener('input',drawWordArt);
const prompts=['the mountain remembers the rain','a library of unwritten dreams','the silence between two tokens','a bicycle at the edge of summer','a conversation with the moon'];
let promptIndex=0;
document.querySelector('#art-surprise').addEventListener('click',()=>{phraseInput.value=prompts[promptIndex++%prompts.length];sketch++;drawWordArt();});
document.querySelector('#art-save').addEventListener('click',()=>{art.toBlob(blob=>{if(!blob)return;const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=`qiang-gao-sketch-${sketch}.png`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);},'image/png');});
new ResizeObserver(drawWordArt).observe(art);

// Recent activity is authored in activity.json, newest dates appear first.
async function loadActivity() {
  const list = document.querySelector('#activity-list');
  try {
    const response = await fetch('activity.json');
    if (!response.ok) throw new Error('Activity unavailable');
    const entries = await response.json();
    if(!Array.isArray(entries)) throw new Error('Invalid activity data');
    const valid = entries.filter(item=>item && /^\d{4}-\d{2}-\d{2}$/.test(item.date) && !Number.isNaN(Date.parse(item.date)) && typeof item.text==='string');
    valid.sort((a,b)=>b.date.localeCompare(a.date));
    list.replaceChildren();
    for (const item of valid.slice(0,8)) {
      const li=document.createElement('li');
      const time=document.createElement('time'); time.dateTime=item.date;
      time.textContent=new Intl.DateTimeFormat('en',{year:'numeric',month:'short',timeZone:'UTC'}).format(new Date(item.date+'T00:00:00Z'));
      const text=document.createElement('p');text.textContent=item.text;
      li.append(time,text);
      if(item.url){try{const url=new URL(item.url);if(['https:','http:'].includes(url.protocol)){const link=document.createElement('a');link.href=url.href;link.textContent=item.linkLabel||'Read more ↗';li.append(link);}}catch{}}
      list.append(li);
    }
    if(!valid.length)list.textContent='A quiet moment. New notes will appear here.';
  } catch {
    list.textContent='Recent notes are temporarily unavailable.';
  }
}
loadActivity();
