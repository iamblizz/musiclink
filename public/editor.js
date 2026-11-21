import {sb,st,$,app,toast,doc,load,esc,PLATFORMS,SOCIALS} from '/state.js';
let cur=null;
async function shrink(file){ // center-crop square, max 1000px, WebP ≈ 60–120 KB
 const bm=await createImageBitmap(file),side=Math.min(bm.width,bm.height),out=Math.min(1000,side),c=document.createElement('canvas');c.width=c.height=out;
 c.getContext('2d').drawImage(bm,(bm.width-side)/2,(bm.height-side)/2,side,side,0,0,out,out);
 return new Promise(r=>c.toBlob(r,'image/webp',.82));
}
const pso=v=>['spotify','apple','amazon'].map(k=>`<option value="${k}" ${k==v?'selected':''}>${PLATFORMS[k][0]}</option>`).join('');
const opts=v=>Object.entries(PLATFORMS).map(([k,[n]])=>`<option value="${k}" ${k==v?'selected':''}>${n}</option>`).join('');
const loc=t=>t?new Date(+new Date(t)-new Date(t).getTimezoneOffset()*6e4).toISOString().slice(0,16):'';
const slugify=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,40);
export function edit(l){
 l.presave=l.presave||[];cur=l;const isNew=!l.id,prev=()=>{$('#pv').srcdoc=doc(cur)};
 app(`<div class="wrap"><div class="hd"><div><a class="hint" href="#/">← All smartlinks</a><h1 class="t">${isNew?'New smartlink':esc(l.title||'Edit smartlink')}</h1></div></div>
 <div class="ed"><div id="ed">
 <section class="sec"><h2>Release</h2><div class="f"><label>Title<input data-k="title" value="${esc(l.title)}"></label><label>Artist<input data-k="artist" value="${esc(l.artist)}"></label></div>
 <label>Cover art<span class="drop"><img id="th" alt="" src="${esc(l.cover_url)}"><span id="cvt">Tap to choose an image. It is resized and compressed automatically.</span><input type="file" id="cv" accept="image/*"></span></label>
 <div class="f"><label>Link name<input data-k="slug" value="${esc(l.slug)}" placeholder="my-new-song"></label><label>Accent color<input type="color" data-k="accent" value="${l.accent}"></label></div>
 <p class="hint" id="url">${location.host}/l/${esc(l.slug||'…')}</p></section>
 <section class="sec"><h2>Where to listen</h2><div id="pl">${l.links.map((x,i)=>`<div class="pr"><select data-i="${i}" data-k="platform">${opts(x.platform)}</select><input data-i="${i}" data-k="url" value="${esc(x.url)}" placeholder="https://"><button data-rm="${i}" aria-label="Remove">×</button></div>`).join('')}</div><button class="ghost" id="add">Add platform</button></section>
 <section class="sec"><h2>Follow links</h2><p class="hint">Fans see these under the listen buttons.</p><div class="f">${Object.entries(SOCIALS).map(([k,n])=>`<label>${n}<input data-soc="${k}" value="${esc(l.socials?.[k]||'')}" placeholder="https://"></label>`).join('')}</div></section>
 <section class="sec"><h2>Pre-release and pre-save</h2><p class="hint">Before the release date, fans see a countdown, your pre-save buttons and an email box. After it, your listen links appear automatically.</p>
 <label>Release date and time<input type="datetime-local" data-k="release_at" value="${loc(l.release_at)}"></label>${l.release_at?'<button class="ghost" id="clr">Remove release date</button>':''}
 <h2 style="margin-top:20px">Pre-save links</h2><p class="hint">Get these from your distributor and paste them here.</p>
 <div>${l.presave.map((x,i)=>`<div class="pr"><select data-ps="${i}" data-k="platform">${pso(x.platform)}</select><input data-ps="${i}" data-k="url" value="${esc(x.url)}" placeholder="https://"><button data-rmp="${i}" aria-label="Remove">×</button></div>`).join('')}</div><button class="ghost" id="addps">Add pre-save link</button></section>
 <section class="sec"><h2>Meta Pixel</h2><p class="hint">Find the ID in Meta Events Manager under Data sources. We track page views, streaming clicks, follow clicks and email sign-ups.</p><label>Pixel ID<input data-k="pixel_id" inputmode="numeric" value="${esc(l.pixel_id||'')}" placeholder="1234567890123456"></label></section>
 <section class="sec"><label style="grid-template-columns:auto 1fr;align-items:center"><input type="checkbox" data-k="published" ${l.published?'checked':''} style="width:20px"> Published (visible to fans)</label>
 ${isNew?'':`<button class="ghost" id="del">Delete this smartlink</button>`}</section></div>
 <div class="sticky"><div class="phone"><iframe id="pv" title="Live preview"></iframe></div></div></div></div>
 <div class="bar"><span class="grow" id="sv"></span><a class="ghost" href="#/">Cancel</a><button class="pri" id="save">${isNew?'Publish smartlink':'Save changes'}</button></div>`);
 let touched=!isNew;
 $('#ed').oninput=e=>{const t=e.target,k=t.dataset.k;
  if(t.dataset.ps!=null){cur.presave[t.dataset.ps][t.dataset.k]=t.value;return prev()}
  if(t.dataset.soc){cur.socials[t.dataset.soc]=t.value.trim();return prev()}
  if(!k)return;
  if(t.dataset.i!=null)cur.links[t.dataset.i][k]=t.value;
  else if(k=='published')cur.published=t.checked;
  else if(k=='release_at')cur.release_at=t.value?new Date(t.value).toISOString():null;
  else if(k=='pixel_id')cur.pixel_id=t.value.replace(/\D/g,'');
  else if(k=='slug'){touched=true;cur.slug=slugify(t.value)}
  else cur[k]=t.value;
  if(k=='title'&&!touched){cur.slug=slugify(cur.title);$('[data-k=slug]').value=cur.slug}
  $('#url').textContent=`${location.host}/l/${cur.slug||'…'}`;prev()};
 $('#ed').onclick=e=>{const t=e.target;if(t.dataset.rm!=null){cur.links.splice(t.dataset.rm,1);edit(cur)}if(t.dataset.rmp!=null){cur.presave.splice(t.dataset.rmp,1);edit(cur)}};
 $('#addps').onclick=()=>{cur.presave.push({platform:'spotify',url:''});edit(cur)};
 $('#add').onclick=()=>{cur.links.push({platform:'apple',url:''});edit(cur)};
 if($('#clr'))$('#clr').onclick=()=>{cur.release_at=null;edit(cur)};
 $('#cv').onchange=async e=>{const f=e.target.files[0];if(!f)return;$('#cvt').textContent='Compressing…';
  try{const b=await shrink(f),p=`${st.user.id}/${Date.now()}.webp`;
   const{error}=await sb.storage.from('covers').upload(p,b,{contentType:'image/webp',cacheControl:'31536000'});if(error)throw error;
   if(cur._new)sb.storage.from('covers').remove([cur._new]);else cur._old=cur.cover_url;
   cur._new=p;cur.cover_url=sb.storage.from('covers').getPublicUrl(p).data.publicUrl;$('#th').src=cur.cover_url;
   $('#cvt').textContent=`${(f.size/1024).toFixed(0)} KB → ${(b.size/1024).toFixed(0)} KB. Tap to change.`;prev()}catch(x){$('#cvt').textContent='Upload failed';toast(x.message)}};
 $('#save').onclick=async()=>{const{id,created_at,user_id,_old,_new,...row}=cur;row.links=row.links.filter(x=>x.url);row.presave=(row.presave||[]).filter(x=>x.url);
  row.socials=Object.fromEntries(Object.entries(row.socials||{}).filter(([,v])=>v));row.pixel_id=row.pixel_id||null;
  if(!row.title||!row.artist||row.slug.length<2)return toast('Add a title, artist and link name');
  $('#save').disabled=true;
  const{error}=await(id?sb.from('smartlinks').update(row).eq('id',id):sb.from('smartlinks').insert(row));
  if(error){$('#save').disabled=false;return toast(error.code=='23505'?'That link name is taken. Try another.':error.message)}
  if(_old&&_old.includes('/covers/'))sb.storage.from('covers').remove([_old.split('/covers/')[1]]);
  await load();location.hash='#/';toast(id?'Saved':'Published')};
 if(!isNew)$('#del').onclick=async()=>{if(!confirm('Delete this smartlink and its stats?'))return;
  await sb.from('smartlinks').delete().eq('id',l.id);if(l.cover_url?.includes('/covers/'))sb.storage.from('covers').remove([l.cover_url.split('/covers/')[1]]);await load();location.hash='#/';toast('Deleted')};
 prev();
}
