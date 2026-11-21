import {sb,st,$,app,toast,doc,blank,cnt,status,load,esc,PLATFORMS,SOCIALS} from '/state.js';
import {edit} from '/editor.js';
import {stats} from '/stats.js';
let mode='in';
const sample={title:'Midnight Static',artist:'Nova Reyes',accent:'#FF3D81',links:[{platform:'spotify',url:'#'},{platform:'apple',url:'#'},{platform:'audiomack',url:'#'}],socials:{instagram:'#',tiktok:'#'}};
sb.auth.onAuthStateChange((_,s)=>{const u=s?.user;if(u?.id===st.user?.id&&u)return;st.user=u;go()});
addEventListener('hashchange',()=>st.user&&go());
async function go(){
 if(!st.user){$('#nav').innerHTML='';return landing()}
 $('#nav').innerHTML='<button class="ghost" id="out">Sign out</button>';$('#out').onclick=()=>sb.auth.signOut();
 if(!st.links.length&&!st.ev.length)await load();
 const[v,id]=(location.hash.slice(2)||'').split('/'),l=st.links.find(x=>x.id==id);
 if(v=='new')return edit(blank());if(v=='edit'&&l)return edit(structuredClone(l));if(v=='stats'&&l)return stats(l);home();
}
function landing(){
 app(`<section class="hero"><div><h1>One link for every place your music lives.</h1>
 <p class="lead">Build a smartlink for your next release in a minute. Add a countdown, collect fan emails, track every click and retarget with Meta Pixel.</p>
 <form class="auth" id="af"><input name="email" type="email" placeholder="Email" required autocomplete="email"><input name="pw" type="password" placeholder="Password (6+ characters)" minlength="6" required>
 <button class="pri">${mode=='in'?'Sign in':'Create your account'}</button><button type="button" class="link" id="sw">${mode=='in'?'New here? Create an account':'Have an account? Sign in'}</button></form></div>
 <div class="phone"><iframe title="Example smartlink" srcdoc="${esc(doc(sample))}"></iframe></div></section>`);
 $('#sw').onclick=()=>{mode=mode=='in'?'up':'in';landing()};
 $('#af').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target),c={email:f.get('email'),password:f.get('pw')};
  const {error,data}=mode=='in'?await sb.auth.signInWithPassword(c):await sb.auth.signUp(c);
  if(error)toast(error.message);else if(mode=='up'&&!data.session)toast('Check your email to confirm your account')};
}
function home(){
 app(`<div class="wrap"><div class="hd"><div><h1 class="t">Your smartlinks</h1><p class="hint">Stats cover the last 30 days.</p></div><a class="pri" href="#/new">New smartlink</a></div>
 ${st.links.length?`<div class="grid">${st.links.map(l=>{const[s,c]=status(l);return `<article class="lc"><div class="th" style="${l.cover_url?`background-image:url('${esc(l.cover_url)}')`:''}"></div><div class="ib">
 <span class="cp ${c}">${s}</span><h3>${esc(l.title)}</h3><p>${esc(l.artist)}</p>
 <div class="mini"><span><b>${cnt(l.id,'view')}</b>views</span><span><b>${cnt(l.id,'click')}</b>clicks</span></div>
 <div class="acts"><a class="ghost" href="#/edit/${l.id}">Edit</a><a class="ghost" href="#/stats/${l.id}">Stats</a><button class="ghost" data-copy="${esc(l.slug)}">Copy link</button></div></div></article>`}).join('')}</div>`
 :`<div class="empty2"><h2>Release something.</h2><p>Create a smartlink for your next song and share one link everywhere.</p><a class="pri" href="#/new">Create your first smartlink</a></div>`}</div>`);
 document.querySelectorAll('[data-copy]').forEach(b=>b.onclick=()=>navigator.clipboard.writeText(`${location.origin}/l/${b.dataset.copy}`).then(()=>toast('Link copied')));
}
