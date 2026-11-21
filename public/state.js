import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import {card,esc,PLATFORMS,SOCIALS,SL_JS} from '/render.js';
export const sb=createClient(CFG.url,CFG.key),$=s=>document.querySelector(s),app=h=>$('#app').innerHTML=h;
export const st={user:null,links:[],ev:[]};
export {esc,PLATFORMS,SOCIALS};
export const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),2400)};
export const doc=l=>`<!doctype html><meta name=viewport content="width=device-width,initial-scale=1"><link rel=stylesheet href=/smartlink.css><base target=_blank><body>${card(l)}<script>${SL_JS}<\/script>`;
export const blank=()=>({title:'',artist:'',slug:'',accent:'#FF3D81',cover_url:'',links:[{platform:'spotify',url:''}],presave:[],socials:{},pixel_id:'',release_at:null,published:true});
const since=new Date(Date.now()-30*864e5).toISOString();
export const cnt=(id,t)=>st.ev.filter(x=>x.link_id==id&&x.type==t).length;
export const status=l=>!l.published?['Draft','c-d']:l.release_at&&new Date(l.release_at)>new Date()?['Pre-release','c-p']:['Live','c-l'];
export const plabel=p=>p.startsWith('ps:')?(PLATFORMS[p.slice(3)]?.[0]||p)+' (pre-save)':p.startsWith('s:')?(SOCIALS[p.slice(2)]||p)+' (follow)':PLATFORMS[p]?.[0]||p;
export async function load(){
 const [a,b]=await Promise.all([sb.from('smartlinks').select('*').eq('user_id',st.user.id).order('created_at',{ascending:false}),
  sb.from('events').select('link_id,type,platform,country,referrer,device,created_at').gte('created_at',since).limit(20000)]);
 st.links=a.data||[];st.ev=b.data||[];
}
