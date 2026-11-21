import {sb,st,$,app,esc,PLATFORMS,SOCIALS,plabel} from '/state.js';
const bars=(arr,lab=x=>x)=>{const m={};arr.forEach(x=>{if(x)m[x]=(m[x]||0)+1});const r=Object.entries(m).sort((a,b)=>b[1]-a[1]).slice(0,6),mx=r[0]?.[1]||1;
 return r.length?`<div class="bl">${r.map(([k,n])=>`<div><span>${esc(lab(k))}</span><i style="width:${n/mx*100}%"></i><em>${n}</em></div>`).join('')}</div>`:'<p class="hint">No data yet.</p>'};
export async function stats(l){
 const e=st.ev.filter(x=>x.link_id==l.id),v=e.filter(x=>x.type=='view'),c=e.filter(x=>x.type=='click');
 const days=[...Array(30)].map((_,i)=>({d:new Date(Date.now()-(29-i)*864e5).toISOString().slice(0,10),v:0,c:0})),ix=Object.fromEntries(days.map((x,i)=>[x.d,i]));
 e.forEach(x=>{const i=ix[x.created_at.slice(0,10)];if(i!=null)days[i][x.type=='view'?'v':'c']++});
 const mx=Math.max(1,...days.map(d=>d.v)),W=600,H=150,bw=W/30;
 const svg=`<svg class="ch" viewBox="0 0 ${W} ${H+18}" role="img" aria-label="Views and clicks per day">${days.map((d,i)=>`<rect x="${i*bw+2}" y="${H-d.v/mx*H}" width="${bw-4}" height="${Math.max(d.v/mx*H,1)}" rx="3" fill="${l.accent}" opacity=".85"/><rect x="${i*bw+2}" y="${H-d.c/mx*H}" width="${bw-4}" height="${Math.max(d.c/mx*H,0)}" rx="3" fill="#F3EEE6"/>`).join('')}
  <text x="0" y="${H+14}" fill="#fff9" font-size="11">${days[0].d.slice(5)}</text><text x="${W}" y="${H+14}" fill="#fff9" font-size="11" text-anchor="end">${days[29].d.slice(5)}</text></svg>`;
 let rn;try{rn=new Intl.DisplayNames(['en'],{type:'region'})}catch{}
 const ctr=v.length?(c.length/v.length*100).toFixed(1):'0';
 app(`<div class="wrap"><div class="hd"><div><a class="hint" href="#/">← All smartlinks</a><h1 class="t">${esc(l.title)}</h1><p class="hint">${esc(l.artist)}, last 30 days</p></div><a class="ghost" href="#/edit/${l.id}">Edit</a></div>
 <div class="kpi"><div><b>${v.length}</b><small>Page views</small></div><div><b>${c.length}</b><small>Link clicks</small></div><div><b>${ctr}%</b><small>Click rate</small></div><div><b id="sc">…</b><small>Email sign-ups</small></div></div>
 <section class="sec"><h2>Views and clicks per day</h2>${svg}<p class="hint">Colored bars are views, light bars are clicks.</p></section>
 <div class="two"><section class="sec"><h2>Where fans click</h2>${bars(c.map(x=>x.platform),plabel)}</section><section class="sec"><h2>Countries</h2>${bars(v.map(x=>x.country),k=>rn?.of(k)||k)}</section>
 <section class="sec"><h2>Traffic sources</h2>${bars(v.map(x=>x.referrer||'Direct'))}</section><section class="sec"><h2>Devices</h2>${bars(v.map(x=>x.device))}</section></div>
 <section class="sec"><h2>Fan emails</h2><p class="hint">Collected from your pre-release page.</p><button class="ghost" id="csv" disabled>Download CSV</button></section></div>`);
 const{data}=await sb.from('subscribers').select('email,created_at').eq('link_id',l.id).order('created_at',{ascending:false});
 if(!$('#sc'))return;$('#sc').textContent=data?.length||0;
 if(data?.length){$('#csv').disabled=false;$('#csv').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['email,signed_up\n'+data.map(r=>`${r.email},${r.created_at}`).join('\n')],{type:'text/csv'}));a.download=`${l.slug}-emails.csv`;a.click()}}
}
