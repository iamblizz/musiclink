// Shared by the Cloudflare function (public page) and the dashboard (live preview)
export const PLATFORMS={spotify:['Spotify','#1DB954'],apple:['Apple Music','#FA243C'],youtube:['YouTube Music','#FF3355'],soundcloud:['SoundCloud','#FF5500'],amazon:['Amazon Music','#25D1DA'],deezer:['Deezer','#A238FF'],tidal:['Tidal','#E8E8E8'],bandcamp:['Bandcamp','#1DA0C3']};
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safe=u=>/^https?:\/\//i.test(u)?u:'#';
const col=c=>/^#[0-9a-f]{6}$/i.test(c)?c:'#FF3D81';
export function card(l){
  const a=col(l.accent),img=l.cover_url?esc(l.cover_url):'';
  const rows=(l.links||[]).filter(x=>PLATFORMS[x.platform]&&x.url).map(x=>{const[n,c]=PLATFORMS[x.platform];
    return `<a class="row" data-p="${x.platform}" href="${esc(safe(x.url))}" target="_blank" rel="noopener" style="--c:${c}"><i></i><span>${n}</span><b>Play</b></a>`}).join('');
  return `<main class="sl" style="--a:${a}"><div class="aura" style="${img?`background-image:url('${img}')`:''}"></div>
<section class="stage"><div class="disc"></div>${img?`<img class="cover" src="${img}" alt="${esc(l.title)} cover art">`:`<div class="cover ph"></div>`}</section>
<h1>${esc(l.title||'Untitled')}</h1><p class="by">${esc(l.artist||'Artist')}</p>
<nav class="rows">${rows||'<p class="empty">Add a platform to see it here.</p>'}</nav>
<footer><a href="/" target="_blank">Made with Spinlink</a></footer></main>`;
}
