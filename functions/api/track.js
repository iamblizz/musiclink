export async function onRequestPost({request,env}){
  const b=await request.json().catch(()=>null);
  if(!b?.slug)return new Response(null,{status:400});
  let ref=null;try{ref=new URL(request.headers.get('referer')).hostname}catch{}
  const ua=request.headers.get('user-agent')||'';
  await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/track_event`,{method:'POST',headers:{apikey:env.SUPABASE_ANON_KEY,'content-type':'application/json'},
    body:JSON.stringify({p_slug:b.slug,p_type:'click',p_platform:String(b.platform||'').slice(0,30),p_country:request.cf?.country||null,p_referrer:ref,p_device:/mobi|android|iphone/i.test(ua)?'mobile':'desktop'})});
  return new Response(null,{status:204});
}
