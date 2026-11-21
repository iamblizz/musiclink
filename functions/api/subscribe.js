export async function onRequestPost({request,env}){
  const b=await request.json().catch(()=>null);
  if(!b?.slug||!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(b.email||'')||b.email.length>200)return new Response(null,{status:400});
  const r=await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/add_subscriber`,{method:'POST',headers:{apikey:env.SUPABASE_ANON_KEY,'content-type':'application/json'},
    body:JSON.stringify({p_slug:b.slug,p_email:b.email})});
  return new Response(null,{status:r.ok?204:500});
}
