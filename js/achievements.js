/* achievements.js — Track B */
(function(){
  const S=window.Store, U=window.UI;
  if(!U.closeModal) U.closeModal=function(){ var m=document.getElementById('modal-root'); if(m) m.innerHTML=''; };
  if(!U.confetti) U.confetti=function(n){
    n=n||20; var em=['✦','✺','●','★','◦'];
    for(var i=0;i<n;i++){ (function(i){
      var s=document.createElement('div'); s.className='confetti';
      s.textContent=em[i%em.length];
      s.style.left=(30+Math.random()*40)+'vw'; s.style.top='70vh';
      s.style.color=['#A90533','#C9A227','#1F7A4D','#1C1C1C'][i%4];
      document.body.appendChild(s); setTimeout(function(){s.remove();},1100);
    })(i); }
  };
  var issuer='All';
  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
  function certs(){ return S.get('custom_certs',[]).concat(window.SEED.certs||[]); }
  function render(){
    var root=document.getElementById('view-root');
    var all=certs();
    var issuers=['All'].concat(Array.from(new Set(all.map(function(c){return c.cat||'Other';}))));
    var list=all.filter(function(c){return issuer==='All'||(c.cat||'Other')===issuer;});
    var sorted=all.slice().sort(function(a,b){return String(b.date).localeCompare(String(a.date));});
    root.innerHTML=
    '<div class="page-head"><div><div class="eyebrow">TRACK B · PROOF OF WORK</div><h1>Achievements</h1><p class="muted">'+all.length+' credentials · 2.4k profile views</p></div>'+
    '<button class="btn btn-primary" id="up-btn">+ Upload cert</button></div>'+
    '<div class="toolbar"><div style="display:flex;gap:8px;flex-wrap:wrap">'+issuers.map(function(i){return '<button class="pill'+(i===issuer?' active':'')+'" data-i="'+esc(i)+'">'+esc(i)+'</button>';}).join('')+'</div></div>'+
    '<div class="cert-wall">'+list.map(function(c){
      var init=(c.issuer||'★').trim()[0]||'★';
      return '<div class="card cert-card"><div class="issuer-badge">'+esc(init)+'</div><div class="mono muted" style="font-size:11px;letter-spacing:.12em">'+esc(String(c.cat||'').toUpperCase())+' · '+esc(c.date)+'</div><h3 style="margin:6px 0">'+esc(c.title)+'</h3><div class="muted" style="font-size:13px">'+esc(c.issuer)+'</div><div class="mono" style="font-size:11px;margin:8px 0;color:#6B6B66">CRED '+esc(c.cred)+'</div><div style="display:flex;gap:8px"><button class="btn btn-dark verify" data-t="'+esc(c.title)+'" style="padding:8px 14px;font-size:13px">Verify ⧉</button><button class="btn copy-id" style="padding:8px 14px;font-size:13px">Copy ID</button></div></div>';
    }).join('')+'</div>'+
    '<div class="grid ach-bottom" style="grid-template-columns:1fr 1fr;margin-top:16px"><div class="card"><div class="eyebrow">Timeline</div><h3>Milestones</h3><div class="timeline">'+
      sorted.map(function(c){return '<div><span class="t-dot"></span><b>'+esc(c.title)+'</b><div class="muted mono" style="font-size:11px">'+esc(c.date)+' · '+esc(c.issuer)+'</div></div>';}).join('')+'</div></div>'+
    '<div class="card"><div class="eyebrow">Issuer spotlight</div><h3>Top issuers</h3><canvas id="ach-bars" height="120"></canvas><table class="table" style="margin-top:10px"><tr><th>Issuer</th><th>Creds</th></tr><tr><td>Coursera</td><td>2</td></tr><tr><td>Google</td><td>1</td></tr><tr><td>AWS</td><td>1</td></tr></table></div></div>';
    Array.prototype.forEach.call(root.querySelectorAll('[data-i]'),function(b){ b.onclick=function(){ issuer=b.getAttribute('data-i'); render(); }; });
    Array.prototype.forEach.call(root.querySelectorAll('.verify'),function(b){ b.onclick=function(){ U.toast('Verified ✓ '+b.getAttribute('data-t').slice(0,28)); }; });
    Array.prototype.forEach.call(root.querySelectorAll('.copy-id'),function(b){ b.onclick=function(){ U.toast('Credential ID copied'); }; });
    document.getElementById('up-btn').onclick=upModal;
    if(window.Charts) window.Charts.bars(document.getElementById('ach-bars'),[3,2,2,1,1,1]);
  }
  function upModal(){
    U.modal('<h3>Upload certificate</h3><p class="muted">Placeholder — stored locally, no backend yet.</p>'+
    '<div class="field"><label>Title</label><input class="input" id="uc-t" placeholder="e.g. GCP Associate Engineer"></div>'+
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><div class="field"><label>Issuer</label><input class="input" id="uc-i" placeholder="Google Cloud"></div><div class="field"><label>Category</label><select class="input" id="uc-c"><option>Web</option><option>AI</option><option>Cloud</option><option>Design</option><option>Award</option></select></div></div>'+
    '<div class="field"><label>Credential ID</label><input class="input" id="uc-id" placeholder="e.g. GCP-88210"></div>'+
    '<div style="display:flex;gap:8px"><button class="btn btn-primary" id="uc-save">Add to wall</button><button class="btn" data-close>Cancel</button></div>');
    document.getElementById('uc-save').onclick=function(){
      var t=document.getElementById('uc-t').value.trim(); if(!t){U.toast('Add a title');return;}
      var c={id:'u'+Date.now(),title:t,issuer:document.getElementById('uc-i').value||'Self-issued',date:new Date().toISOString().slice(0,10),cred:document.getElementById('uc-id').value||('LOCAL-'+Math.floor(Math.random()*90000+10000)),cat:document.getElementById('uc-c').value};
      var cur=S.get('custom_certs',[]); cur.unshift(c); S.set('custom_certs',cur);
      U.closeModal(); U.toast('Certificate added 🎓'); U.confetti(20); render();
    };
  }
  document.addEventListener('DOMContentLoaded',function(){
    if(!document.body || document.body.dataset.page!=='achievements') return;
    U.sidebar('achievements'); U.topbar({searchPlaceholder:'Search certificates…'});
    render();
  });
})();
