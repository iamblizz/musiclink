import {card,esc} from '../../public/render.js';
export async function onRequestGet({params,env,request,waitUntil}){
  const h={apikey:env.SUPABASE_ANON_KEY,'content-type':'application/json'};
  const r=await fetch(`${env.SUPABASE_URL}/rest/v1/smartlinks?slug=eq.${encodeURIComponent(params.slug)}&published=eq.true&select=*`,{headers:h});
  const [l]=r.ok?await r.json():[];
  if(!l)return new Response('Smartlink not found',{status:404});
  waitUntil(fetch(`${env.SUPABASE_URL}/rest/v1/rpc/track_event`,{method:'POST',headers:h,body:JSON.stringify({
    p_slug:l.slug,p_type:'view',p_platform:null,p_country:request.cf?.country||null,p_referrer:request.headers.get('referer')})}));
  const t=`${l.title} – ${l.artist}`,d=`Listen to ${l.title} by ${l.artist} on your favorite platform.`;
  return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(t)}</title><meta name="description" content="${esc(d)}"><meta property="og:title" content="${esc(t)}"><meta property="og:description" content="${esc(d)}">
${l.cover_url?`<meta property="og:image" content="${esc(l.cover_url)}">`:''}<meta name="twitter:card" content="summary_large_image"><meta name="theme-color" content="#0E0B14">
<link rel="stylesheet" href="/smartlink.css"></head><body>${card(l)}
<script>document.addEventListener('click',e=>{const a=e.target.closest('[data-p]');if(a)navigator.sendBeacon('/api/track',JSON.stringify({slug:${JSON.stringify(l.slug)},platform:a.dataset.p}))})</script></body></html>`,
  {headers:{'content-type':'text/html;charset=utf-8','cache-control':'public, max-age=60'}});
}
