/* projects.js — Track B */
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
  var cat='All', q='', sort='Recent';
  function custom(){ return S.get('custom_projects',[]); }
  function allProjects(){ return custom().concat((window.SEED.projects||[])); }
  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
  function filtered(){
    var list=allProjects().slice();
    if(cat!=='All') list=list.filter(function(p){return p.cat===cat;});
    if(q) list=list.filter(function(p){return ((p.title||'')+' '+(p.desc||'')+' '+((p.stack||[]).join(' '))).toLowerCase().indexOf(q.toLowerCase())>=0;});
    list.sort(function(a,b){ return sort==='Stars' ? (b.stars-a.stars) : String(b.updated).localeCompare(String(a.updated)); });
    return list;
  }
  function card(p){
    return '<article class="card proj-card" data-id="'+p.id+'"><div class="proj-cover" style="background:'+(p.grad||'linear-gradient(135deg,#1C1C1C,#A90533)')+'"><span>'+esc((p.cat||'').toUpperCase())+' / '+esc(String(p.updated||'').slice(0,7))+'</span><span class="status">'+esc(p.status||'WIP')+'</span></div>'+
    '<div class="proj-body"><h3>'+esc(p.title)+'</h3><p>'+esc(p.desc)+'</p><div class="proj-meta">'+((p.stack||[]).map(function(s){return '<span class="tag">'+esc(s)+'</span>';}).join(''))+'</div>'+
    '<div class="proj-foot"><span class="stars">★ '+p.stars+'</span><span>'+esc(p.updated||'')+' →</span></div></div></article>';
  }
  function render(){
    var root=document.getElementById('view-root');
    var list=filtered();
    var totalStars=allProjects().reduce(function(a,p){return a+(+p.stars||0);},0);
    root.innerHTML=
      '<div class="page-head"><div><div class="eyebrow">TRACK B · BUILD</div><h1>Projects</h1><p class="muted">'+list.length+' projects · '+totalStars+' total stars</p></div>'+
      '<button class="btn btn-primary" id="new-proj">+ New Project</button></div>'+
      '<div class="toolbar"><div style="display:flex;gap:8px;flex-wrap:wrap">'+['All','Web','AI','Design'].map(function(c){return '<button class="pill'+(c===cat?' active':'')+'" data-cat="'+c+'">'+c+'</button>';}).join('')+'</div>'+
      '<div class="spacer"></div><div class="search" style="max-width:260px"><span>⌕</span><input id="pq" placeholder="Search stack, title…" value="'+esc(q)+'"></div>'+
      '<select class="input" id="psort" style="max-width:150px"><option'+(sort==='Recent'?' selected':'')+'>Recent</option><option'+(sort==='Stars'?' selected':'')+'>Stars</option></select></div>'+
      '<div class="proj-grid">'+list.map(card).join('')+'</div>';
    Array.prototype.forEach.call(root.querySelectorAll('[data-cat]'),function(b){ b.onclick=function(){cat=b.getAttribute('data-cat');render();}; });
    var qi=root.querySelector('#pq');
    qi.oninput=function(e){ q=e.target.value; var pos=e.target.selectionStart; render(); var n=document.getElementById('pq'); n.focus(); try{n.setSelectionRange(pos,pos);}catch(_){} };
    root.querySelector('#psort').onchange=function(e){ sort=e.target.value; render(); };
    Array.prototype.forEach.call(root.querySelectorAll('.proj-card'),function(c){ c.onclick=function(){ detail(c.getAttribute('data-id')); }; });
    document.getElementById('new-proj').onclick=newModal;
  }
  function detail(id){
    var p=allProjects().filter(function(x){return x.id===id;})[0]; if(!p) return;
    U.modal('<div class="detail-cover" style="background:'+(p.grad||'#1C1C1C')+'">'+esc(p.title)+'</div>'+
      '<div class="mono muted" style="font-size:11px;letter-spacing:.14em">'+esc(String(p.cat||'').toUpperCase())+' · ★ '+p.stars+' · '+esc(p.status)+'</div>'+
      '<p style="margin:10px 0">'+esc(p.desc)+'</p><div class="proj-meta">'+((p.stack||[]).map(function(s){return '<span class="tag">'+esc(s)+'</span>';}).join(''))+'</div>'+
      '<div style="display:flex;gap:8px;margin-top:14px"><button class="btn btn-dark" id="star-btn">★ Star</button><button class="btn" data-close>Close</button></div>');
    document.getElementById('star-btn').onclick=function(){ U.toast('★ Starred '+String(p.title).slice(0,24)+'!'); U.closeModal(); };
  }
  function newModal(){
    U.modal('<h3>New Project</h3><p class="muted" style="margin-top:4px">Ship something cool. Saves to store.</p>'+
    '<div class="field"><label>Title</label><input class="input" id="np-title" placeholder="e.g. HostelHub"></div>'+
    '<div class="field"><label>Description</label><textarea class="input" id="np-desc" placeholder="What does it do?"></textarea></div>'+
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><div class="field"><label>Category</label><select class="input" id="np-cat"><option>Web</option><option>AI</option><option>Design</option></select></div>'+
    '<div class="field"><label>Stack (comma)</label><input class="input" id="np-stack" placeholder="React, Node"></div></div>'+
    '<div style="display:flex;gap:8px"><button class="btn btn-primary" id="np-save">Save project</button><button class="btn" data-close>Cancel</button></div>');
    document.getElementById('np-save').onclick=function(){
      var t=document.getElementById('np-title').value.trim();
      if(!t){ U.toast('Give it a title first'); return; }
      var p={id:'u'+Date.now(),title:t,desc:document.getElementById('np-desc').value||'No description yet.',cat:document.getElementById('np-cat').value,stack:document.getElementById('np-stack').value.split(',').map(function(s){return s.trim();}).filter(Boolean),stars:0,status:'In Progress',updated:new Date().toISOString().slice(0,10),grad:'linear-gradient(135deg,#1C1C1C,#A90533)'};
      var c=custom(); c.unshift(p); S.set('custom_projects',c);
      U.closeModal(); U.toast('Project saved ✓'); U.confetti(16); render();
    };
  }
  document.addEventListener('DOMContentLoaded',function(){
    if(!document.body || document.body.dataset.page!=='projects') return;
    U.sidebar('projects'); U.topbar({searchPlaceholder:'Search projects…'});
    render();
  });
})();
