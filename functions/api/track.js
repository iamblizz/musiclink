export async function onRequestPost({request,env}){
  const b=await request.json().catch(()=>null);
  if(!b?.slug)return new Response(null,{status:400});
  await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/track_event`,{method:'POST',
    headers:{apikey:env.SUPABASE_ANON_KEY,'content-type':'application/json'},
    body:JSON.stringify({p_slug:b.slug,p_type:'click',p_platform:String(b.platform||'').slice(0,20),p_country:request.cf?.country||null,p_referrer:request.headers.get('referer')})});
  return new Response(null,{status:204});
}
