import {card,esc,SL_JS} from '../../public/render.js';
export async function onRequestGet({params,env,request,waitUntil}){
  const h={apikey:env.SUPABASE_ANON_KEY,'content-type':'application/json'};
  const r=await fetch(`${env.SUPABASE_URL}/rest/v1/smartlinks?slug=eq.${encodeURIComponent(params.slug)}&published=eq.true&select=*`,{headers:h});
  const [l]=r.ok?await r.json():[];
  if(!l)return new Response('Smartlink not found',{status:404});
  let ref=null;try{ref=new URL(request.headers.get('referer')).hostname}catch{}
  const ua=request.headers.get('user-agent')||'';
  waitUntil(fetch(`${env.SUPABASE_URL}/rest/v1/rpc/track_event`,{method:'POST',headers:h,body:JSON.stringify({p_slug:l.slug,p_type:'view',p_platform:null,
    p_country:request.cf?.country||null,p_referrer:ref,p_device:/mobi|android|iphone/i.test(ua)?'mobile':'desktop'})}));
  const px=/^\d{6,20}$/.test(l.pixel_id||'')?l.pixel_id:null;
  const pixel=px?`<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${px}');fbq('track','PageView');</script>`:'';
  const t=`${l.title} – ${l.artist}`,d=`Listen to ${l.title} by ${l.artist} on your favorite platform.`;
  return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(t)}</title><meta name="description" content="${esc(d)}"><meta property="og:title" content="${esc(t)}"><meta property="og:description" content="${esc(d)}">
${l.cover_url?`<meta property="og:image" content="${esc(l.cover_url)}">`:''}<meta name="twitter:card" content="summary_large_image"><meta name="theme-color" content="#0E0B14">
<link rel="stylesheet" href="/smartlink.css">${pixel}</head><body>${card(l)}<script>${SL_JS}</script></body></html>`,
  {headers:{'content-type':'text/html;charset=utf-8','cache-control':'public, max-age=30'}});
}
