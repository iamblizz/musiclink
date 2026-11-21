// Shared by the Cloudflare function (public page) and the dashboard (live preview)
export const PLATFORMS={spotify:['Spotify','#1DB954'],apple:['Apple Music','#FA243C'],youtube:['YouTube','#FF3355'],ytmusic:['YouTube Music','#FF4E45'],audiomack:['Audiomack','#FFA200'],boomplay:['Boomplay','#2E7BFF'],soundcloud:['SoundCloud','#FF5500'],amazon:['Amazon Music','#25D1DA'],deezer:['Deezer','#A238FF'],tidal:['Tidal','#E8E8E8'],bandcamp:['Bandcamp','#1DA0C3'],tiktok:['TikTok Sound','#25F4EE']};
export const SOCIALS={instagram:'Instagram',tiktok:'TikTok',x:'X',facebook:'Facebook',youtube:'YouTube',snapchat:'Snapchat',website:'Website'};
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safe=u=>/^https?:\/\//i.test(u)?u:'#';
const col=c=>/^#[0-9a-f]{6}$/i.test(c)?c:'#FF3D81';
export function card(l){
  const a=col(l.accent),img=l.cover_url?esc(l.cover_url):'';
  const pre=l.release_at&&new Date(l.release_at)>new Date();
  const rows=(l.links||[]).filter(x=>PLATFORMS[x.platform]&&x.url).map(x=>{const[n,c]=PLATFORMS[x.platform];
    return `<a class="row" data-p="${x.platform}" href="${esc(safe(x.url))}" target="_blank" rel="noopener" style="--c:${c}"><i></i><span>${n}</span><b>Play</b></a>`}).join('');
  const prerows=(l.presave||[]).filter(x=>PLATFORMS[x.platform]&&x.url).map(x=>{const[n,c]=PLATFORMS[x.platform];
    return `<a class="row" data-p="ps:${x.platform}" href="${esc(safe(x.url))}" target="_blank" rel="noopener" style="--c:${c}"><i></i><span>${n}</span><b>Pre-save</b></a>`}).join('');
  const body=pre?`<div class="pre"><p>Out in</p><div class="cd" data-t="${+new Date(l.release_at)}">${['days','hrs','min','sec'].map(u=>`<div><b data-u>00</b><small>${u}</small></div>`).join('')}</div>
${prerows?`<nav class="rows" style="margin:0 auto 18px">${prerows}</nav><p class="hint2">Or get a reminder</p>`:''}<form class="sub"><input type="email" required placeholder="Your email" aria-label="Email"><button>Notify me</button></form></div>`
   :`<nav class="rows">${rows||'<p class="empty">Add a platform to see it here.</p>'}</nav>`;
  const soc=Object.entries(SOCIALS).filter(([k])=>l.socials?.[k]).map(([k,n])=>`<a class="chip" data-s="${k}" href="${esc(safe(l.socials[k]))}" target="_blank" rel="noopener">${n}</a>`).join('');
  return `<main class="sl" data-slug="${esc(l.slug||'')}" style="--a:${a}"><div class="aura" style="${img?`background-image:url('${img}')`:''}"></div>
<section class="stage"><div class="disc"></div>${img?`<img class="cover" src="${img}" alt="${esc(l.title)} cover art">`:`<div class="cover ph"></div>`}</section>
<h1>${esc(l.title||'Untitled')}</h1><p class="by">${esc(l.artist||'Artist')}</p>${body}
${soc?`<div class="soc"><small>Follow ${esc(l.artist)}</small>${soc}</div>`:''}<footer><a href="/" target="_blank">Made with Spinlink</a></footer></main>`;
}
export const SL_JS=`(()=>{const m=document.querySelector('.sl'),s=m.dataset.slug,send=(u,b)=>s&&navigator.sendBeacon(u,JSON.stringify({slug:s,...b})),cd=document.querySelector('[data-t]');
if(cd){const t=+cd.dataset.t,u=cd.querySelectorAll('[data-u]'),M=[1e9,24,60,60],V=[864e5,36e5,6e4,1e3];
const k=()=>{const d=t-Date.now();if(d<=0){s&&location.reload();return}u.forEach((e,i)=>e.textContent=String(Math.floor(d/V[i])%M[i]).padStart(2,'0'))};k();setInterval(k,1e3)}
document.addEventListener('click',e=>{const a=e.target.closest('[data-p],[data-s]');if(!a)return;const p=a.dataset.p||'s:'+a.dataset.s;send('/api/track',{platform:p});window.fbq&&fbq('trackCustom',a.dataset.p?(p.startsWith('ps:')?'PreSaveClick':'StreamClick'):'SocialClick',{platform:p})});
const f=document.querySelector('.sub');if(f)f.onsubmit=async e=>{e.preventDefault();if(s){const r=await fetch('/api/subscribe',{method:'POST',body:JSON.stringify({slug:s,email:f.querySelector('input').value})});if(!r.ok){f.querySelector('button').textContent='Try again';return}window.fbq&&fbq('track','Lead')}f.innerHTML='<p class="ok">Done. You are on the list for release day.</p>'}})()`;

