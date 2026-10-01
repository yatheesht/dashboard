/* practice.js — Track B */
(function(){
  const S=window.Store, U=window.UI;
  if(!U.closeModal) U.closeModal=function(){ var m=document.getElementById('modal-root'); if(m) m.innerHTML=''; };
  if(!U.confetti) U.confetti=function(n){
    n=n||24; var em=['✦','✺','●','★','◦'];
    for(var i=0;i<n;i++){ (function(i){
      var s=document.createElement('div'); s.className='confetti';
      s.textContent=em[i%em.length];
      s.style.left=(30+Math.random()*40)+'vw'; s.style.top='70vh';
      s.style.color=['#A90533','#C9A227','#1F7A4D','#1C1C1C'][i%4];
      document.body.appendChild(s); setTimeout(function(){s.remove();},1100);
    })(i); }
  };
  function student(){ return (S.all().student||{}); }
  function xp(){ var st=student(); return S.get('xp_total', (st.xp==null?2450:st.xp)); }
  function streak(){ var st=student(); return S.get('streak_days', (st.streak==null?24:st.streak)); }
  function level(){ return student().level||7; }
  function xpGoal(x){ if(x<3000) return 3000; return (Math.floor(x/2000)+1)*2000; }
  function activity(){
    var over=S.get('activity_override',{});
    var base=(window.SEED.activity||{});
    var out={}; Object.keys(base).forEach(function(k){out[k]=base[k];});
    Object.keys(over).forEach(function(k){out[k]=over[k];});
    return out;
  }
  function render(){
    var root=document.getElementById('view-root');
    var X=+xp()||0, ST=+streak()||0, LV=level(), GOAL=xpGoal(X), pct=Math.max(2,Math.min(100,Math.round(X/GOAL*100)));
    var langs=window.SEED.languages||[];
    root.innerHTML=
    '<div class="page-head"><div><div class="eyebrow">TRACK B · CONSISTENCY</div><h1>Practice</h1><p class="muted">Streaks, XP and deep-work hours</p></div>'+
    '<button class="btn btn-primary" id="log-btn">+ Log Session</button></div>'+
    '<div class="kpi-grid">'+
      '<div class="card"><div class="k">Day streak</div><div class="v">🔥 '+ST+'</div><div class="muted mono" style="font-size:11px">BEST 31 · KEEP GOING</div></div>'+
      '<div class="card"><div class="k">Total XP</div><div class="v">'+X.toLocaleString()+'</div><div class="progress"><i style="width:'+pct+'%"></i></div><div class="muted mono" style="font-size:11px;margin-top:6px">LEVEL '+LV+' → '+(GOAL-X).toLocaleString()+' XP TO LVL '+(LV+1)+'</div></div>'+
      '<div class="card"><div class="k">Deep hours</div><div class="v">312h</div><div class="muted mono" style="font-size:11px">+9H THIS WEEK</div></div>'+
      '<div class="card"><div class="k">Level</div><div class="v">Lv '+LV+'</div><div class="muted mono" style="font-size:11px">TOP 4% OF COHORT</div></div>'+
    '</div>'+
    '<div class="practice-hero" style="margin-top:16px"><div class="card"><div class="mono muted" style="font-size:11px;letter-spacing:.14em">20-WEEK ACTIVITY · LAST 140 DAYS</div><h3 style="margin:6px 0 12px">Consistency map</h3><div id="heatmap"></div></div>'+
    '<div class="card"><div class="mono muted" style="font-size:11px;letter-spacing:.14em">LANGUAGE SPLIT</div><h3 style="margin:6px 0">Where the hours go</h3><div style="margin:10px 0"><canvas id="langbars" height="120"></canvas></div><div>'+
    langs.map(function(l,i){return '<div class="bar-row"><span class="mono">'+l.label+'</span><div class="bar-track"><i class="'+(i<2?'hot':'')+'" style="width:'+l.v+'%"></i></div><b>'+l.v+'%</b></div>';}).join('')+'</div>'+
    '<div class="level-ring" style="margin-top:12px"><canvas id="donut" width="140" height="140"></canvas><div><b>Weekly goal</b><div class="muted" style="font-size:13px">6/8 sessions · 75%</div><div class="progress" style="margin-top:8px;width:150px"><i style="width:75%"></i></div></div></div></div></div>';
    window.Charts.heatmap(document.getElementById('heatmap'), activity());
    window.Charts.bars(document.getElementById('langbars'), langs.map(function(l){return l.v;}), langs.map(function(l){return l.label;}));
    window.Charts.donut(document.getElementById('donut'), 75);
    document.getElementById('log-btn').onclick=logModal;
  }
  function logModal(){
    U.modal('<h3>Log practice session</h3><p class="muted">+XP, updates today on the heatmap.</p>'+
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><div class="field"><label>Minutes</label><input class="input" id="lg-min" type="number" value="45"></div>'+
    '<div class="field"><label>Language</label><select class="input" id="lg-lang"><option>Python</option><option>JavaScript</option><option>C++</option><option>Dart</option><option>SQL</option></select></div></div>'+
    '<div class="field"><label>Note</label><input class="input" id="lg-note" placeholder="e.g. DP + graphs revision"></div>'+
    '<div style="display:flex;gap:8px"><button class="btn btn-primary" id="lg-save">Log session</button><button class="btn" data-close>Cancel</button></div>');
    document.getElementById('lg-save').onclick=function(){
      var mins=parseInt(document.getElementById('lg-min').value,10)||30;
      var gain=Math.round(mins*1.2);
      S.set('xp_total', xp()+gain);
      var today=new Date().toISOString().slice(0,10);
      var over=S.get('activity_override',{}); over[today]=(over[today]||activity()[today]||0)+1;
      S.set('activity_override',over);
      var sess=S.get('sessions',[]); sess.unshift({mins:mins,lang:document.getElementById('lg-lang').value,note:document.getElementById('lg-note').value,date:today});
      S.set('sessions',sess);
      U.closeModal(); U.toast('Logged! +'+gain+' XP ⚡'); U.confetti(30); render();
    };
  }
  document.addEventListener('DOMContentLoaded',function(){
    if(!document.body || document.body.dataset.page!=='practice') return;
    U.sidebar('practice'); U.topbar({searchPlaceholder:'Search sessions…'});
    render();
  });
})();
