(function(){
  var html=document.documentElement;
  var MSG={sr:'Zdravo, zanima me predlog sajta za moj biznis. Bavim se: ',en:'Hi, I would like a website proposal for my business. What I do: '};
  function setMsg(l){var m=encodeURIComponent(MSG[l]||MSG.sr);
    document.querySelectorAll('a.msg.wa').forEach(function(a){a.href=a.href.split('?')[0]+'?text='+m});
    document.querySelectorAll('a.msg.vb').forEach(function(a){a.href=a.href.split('&draft=')[0]+'&draft='+m})}
  function setLang(l){html.setAttribute('lang',l);try{localStorage.setItem('lang',l)}catch(e){}
    document.querySelectorAll('[data-sr]').forEach(function(el){var v=el.getAttribute('data-'+l);if(v!==null)el.textContent=v});
    var tt=document.body.getAttribute('data-title-'+l);if(tt)document.title=tt;setMsg(l)}
  document.querySelectorAll('.lang button').forEach(function(b){b.addEventListener('click',function(){setLang(b.dataset.l)})});
  setLang(html.getAttribute('lang')||'sr');
  var bg=document.querySelector('.burger'),links=document.getElementById('links');
  if(bg)bg.addEventListener('click',function(){links.classList.toggle('open')});
  var nl=document.querySelectorAll('#links a');
  nl.forEach(function(a){a.addEventListener('click',function(){links.classList.remove('open')})});
  if('IntersectionObserver' in window){var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)nl.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id)})})},{rootMargin:'-40% 0px -55% 0px'});document.querySelectorAll('section[id]').forEach(function(s){so.observe(s)})}
  // cursor readout
  var xy=document.getElementById('xy');
  function pad(n){n=Math.round(n);return ('000'+n).slice(-3)}
  window.addEventListener('mousemove',function(e){if(xy)xy.textContent='x '+pad(e.clientX)+' y '+pad(e.clientY)},{passive:true});
  // desk: drag, scatter, tidy
  var board=document.getElementById('board');if(!board)return;
  var wins=[].slice.call(board.querySelectorAll('.win')),z=10;
  var mq=window.matchMedia('(max-width:768px)');
  function px(w){var b=board.getBoundingClientRect();return {l:w.offsetLeft,t:w.offsetTop,bw:b.width,bh:b.height}}
  wins.forEach(function(w){
    var bar=w.querySelector('.bar'),sx,sy,ol,ot,on=false;
    bar.addEventListener('pointerdown',function(e){if(mq.matches)return;on=true;w.classList.remove('anim');w.classList.add('drag');w.style.zIndex=++z;
      var p=px(w);w.style.left=p.l+'px';w.style.top=p.t+'px';sx=e.clientX;sy=e.clientY;ol=p.l;ot=p.t;bar.setPointerCapture(e.pointerId)});
    bar.addEventListener('pointermove',function(e){if(!on)return;var bw=board.clientWidth,bh=board.clientHeight;
      var nl=Math.max(0,Math.min(bw-w.offsetWidth,ol+e.clientX-sx)),nt=Math.max(0,Math.min(bh-w.offsetHeight,ot+e.clientY-sy));
      w.style.left=nl+'px';w.style.top=nt+'px'});
    function up(){on=false;w.classList.remove('drag')}
    bar.addEventListener('pointerup',up);bar.addEventListener('pointercancel',up);
  });
  function place(fn){if(mq.matches)return;wins.forEach(function(w,i){w.classList.add('anim');var r=fn(w,i);w.style.left=r.l+'px';w.style.top=r.t+'px';w.style.setProperty('--r',r.r+'deg')})}
  var sc=document.getElementById('scatter'),td=document.getElementById('tidy');
  if(sc)sc.addEventListener('click',function(){var bw=board.clientWidth,bh=board.clientHeight;
    place(function(w){return {l:Math.random()*(bw-w.offsetWidth),t:Math.random()*(bh-w.offsetHeight),r:(Math.random()*12-6).toFixed(1)}})});
  if(td)td.addEventListener('click',function(){var bw=board.clientWidth,cw=wins[0].offsetWidth,gap=(bw-3*cw)/2;
    place(function(w,i){return {l:(i%3)*(cw+gap),t:Math.floor(i/3)*(w.offsetHeight+50)+10,r:0}})});
})();
(function(){var p=document.getElementById('phwrap');if(!p||!('IntersectionObserver' in window))return;
  new IntersectionObserver(function(es){es.forEach(function(e){p.classList.toggle('paused',!e.isIntersecting)})},{threshold:0}).observe(p)})();
(function(){var root=document.getElementById('fscr');if(!root)return;
var H=document.documentElement;function L(){return H.getAttribute('lang')==='en'?'en':'sr'}function x(a,b){return L()==='en'?b:a}
function el(h){var d=document.createElement('div');d.innerHTML=h;return d.firstChild}
var IMG=window.__FIMG||{};var toastT;function toast(h){var t=document.getElementById('toast');t.innerHTML=h;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(function(){t.classList.remove('on')},3800)}
var DN=['Ned','Pon','Uto','Sre','Čet','Pet','Sub'],DE=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
var S={day:null,slot:null,done:false,cat:'all',lb:-1,open:-1,edit:false,saved:false};
var POSTS=[{s:'Radno vreme za praznike',e:'Opening hours for the holidays',d:'12.11.',b:['Za praznike radimo skraćeno. Pogledaj raspored pre dolaska.','We work shorter hours over the holidays. Check the schedule before you come.']},{s:'Novo u ponudi',e:'New on the menu',d:'03.11.',b:['Dodali smo nove usluge. Cene su u cenovniku.','We added new services. Prices are in the price list.']},{s:'Kako izgleda prvi dolazak',e:'What the first visit looks like',d:'20.10.',b:['Dođi desetak minuta ranije. Ostalo rešavamo na licu mesta.','Come ten minutes early. We sort out the rest on the spot.']}];
var PR=[['Šišanje','Haircut',1500],['Farbanje','Colouring',4500],['Feniranje','Blow-dry',1200],['Nega kose','Hair care',2200]];
var GAL=[['c','d'],['r','p'],['p','d'],['h','p'],['k','d'],['g','d']];
function fm(n){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,'.')}
function rBook(){var p=document.getElementById('pn-book');p.innerHTML='';
 if(S.done){var d=new Date(2026,10,S.day);var nm=x(DN,DE)[0]&&(L()==='en'?DE:DN)[d.getDay()];
  p.appendChild(el('<div class="ok"><div class="ck">&#10003;</div><h4>'+x('Termin je zakazan','Booking confirmed')+'</h4><p>'+nm+' '+S.day+'.11. '+x('u','at')+' '+S.slot+'</p><button class="pbtn alt" type="button" id="bk-re">'+x('Zakaži još jedan','Book another')+'</button></div>'));
  p.querySelector('#bk-re').onclick=function(){S.day=null;S.slot=null;S.done=false;rBook()};return}
 var h='<small>'+x('Studio Lana','Studio Lana')+'</small><h4>'+x('Izaberi termin','Pick a time')+'</h4><small>'+x('Novembar 2026','November 2026')+'</small><div class="cal">';
 (L()==='en'?['M','T','W','T','F','S','S']:['P','U','S','Č','P','S','N']).forEach(function(c){h+='<i>'+c+'</i>'});
 for(var i=0;i<6;i++)h+='<span></span>';
 for(var d=1;d<=30;d++){var dow=new Date(2026,10,d).getDay();var off=d<16||dow===0;h+='<button type="button" data-d="'+d+'"'+(off?' disabled':'')+(S.day===d?' class="sel"':'')+'>'+d+'</button>'}
 h+='</div>';
 if(S.day){h+='<div class="slots">';['10:00','11:30','13:00','14:30','16:00','17:30'].forEach(function(s,i){var taken=(S.day+i)%4===0;h+='<button type="button" data-s="'+s+'"'+(taken?' disabled':'')+(S.slot===s?' class="sel"':'')+'>'+s+'</button>'});h+='</div>'}
 h+='<button class="pbtn" type="button" id="bk-ok"'+(S.day&&S.slot?'':' disabled')+'>'+x('Potvrdi termin','Confirm booking')+'</button>';
 p.innerHTML=h;
 p.querySelectorAll('[data-d]').forEach(function(b){b.onclick=function(){S.day=+b.dataset.d;S.slot=null;rBook()}});
 p.querySelectorAll('[data-s]').forEach(function(b){b.onclick=function(){S.slot=b.dataset.s;rBook()}});
 var ok=p.querySelector('#bk-ok');ok.onclick=function(){S.done=true;rBook();var d=new Date(2026,10,S.day);toast('<b>'+x('Tvoj telefon','Your phone')+'</b>'+x('Nova rezervacija: ','New booking: ')+(L()==='en'?DE:DN)[d.getDay()]+' '+S.day+'.11. '+x('u','at')+' '+S.slot)}}
function rGal(){var p=document.getElementById('pn-gal');var cats=[['all','Sve','All'],['d','Detalji','Details'],['p','Prostor','Space']];
 var h='<h4>'+x('Galerija','Gallery')+'</h4><div class="chips">';cats.forEach(function(c){h+='<button type="button" data-c="'+c[0]+'"'+(S.cat===c[0]?' class="on"':'')+'>'+x(c[1],c[2])+'</button>'});h+='</div><div class="gg">';
 var vis=GAL.filter(function(g){return S.cat==='all'||g[1]===S.cat});vis.forEach(function(g,i){h+='<button type="button" data-i="'+i+'"><img src="'+IMG[g[0]]+'" alt="" loading="lazy" decoding="async"></button>'});h+='</div>';
 h+='<div class="lb'+(S.lb>=0?' on':'')+'" id="lb">';if(S.lb>=0&&vis[S.lb]){h+='<img src="'+IMG[vis[S.lb][0]]+'" alt=""><div class="ar"><button type="button" id="lp">&larr;</button><span>'+(S.lb+1)+' / '+vis.length+'</span><button type="button" id="ln">&rarr;</button></div><button type="button" id="lx">'+x('Zatvori','Close')+'</button>'}h+='</div>';
 p.innerHTML=h;
 p.querySelectorAll('[data-c]').forEach(function(b){b.onclick=function(){S.cat=b.dataset.c;S.lb=-1;rGal()}});
 p.querySelectorAll('[data-i]').forEach(function(b){b.onclick=function(){S.lb=+b.dataset.i;rGal()}});
 var n=p.querySelector('#ln');if(n){n.onclick=function(){S.lb=(S.lb+1)%vis.length;rGal()};p.querySelector('#lp').onclick=function(){S.lb=(S.lb+vis.length-1)%vis.length;rGal()};p.querySelector('#lx').onclick=function(){S.lb=-1;rGal()}}}
function rBlog(){var p=document.getElementById('pn-blog');var h;
 if(S.open>=0){var q=POSTS[S.open];h='<button class="back" type="button" id="bb">&larr; '+x('Nazad','Back')+'</button><small>'+q.d+'</small><h4>'+(q.u?q.u:x(q.s,q.e))+'</h4><p>'+(q.u?q.ub:x(q.b[0],q.b[1]))+'</p>';p.innerHTML=h;p.querySelector('#bb').onclick=function(){S.open=-1;rBlog()};return}
 if(S.ed){h='<button class="back" type="button" id="bb">&larr; '+x('Nazad','Back')+'</button><h4>'+x('Nova novost','New post')+'</h4><input id="bt" placeholder="'+x('Naslov','Title')+'"><textarea id="bx" placeholder="'+x('Tvoj tekst','Your text')+'"></textarea><button class="pbtn" type="button" id="bp" disabled>'+x('Objavi','Publish')+'</button>';p.innerHTML=h;
  var t=p.querySelector('#bt'),b=p.querySelector('#bx'),bp=p.querySelector('#bp');function ch(){bp.disabled=!(t.value.trim()&&b.value.trim())}t.oninput=ch;b.oninput=ch;
  p.querySelector('#bb').onclick=function(){S.ed=false;rBlog()};bp.onclick=function(){POSTS.unshift({u:t.value.trim(),ub:b.value.trim().replace(/</g,'&lt;'),d:x('Danas','Today'),n:1});POSTS[0].u=POSTS[0].u.replace(/</g,'&lt;');S.ed=false;rBlog();toast('<b>'+x('Sajt','Website')+'</b>'+x('Novost je objavljena.','Your post is live.'))};return}
 h='<h4>'+x('Novosti','News')+'</h4><button class="pbtn" type="button" id="bn" style="margin-bottom:12px">+ '+x('Nova novost','New post')+'</button>';
 POSTS.forEach(function(q,i){h+='<button class="post" type="button" data-i="'+i+'"><span class="tg">'+(q.n?x('Novo','New'):x('Savet','Tip'))+'</span><b>'+(q.u?q.u:x(q.s,q.e))+'</b><small>'+q.d+'</small></button>'});
 p.innerHTML=h;p.querySelector('#bn').onclick=function(){S.ed=true;rBlog()};p.querySelectorAll('[data-i]').forEach(function(b){b.onclick=function(){S.open=+b.dataset.i;rBlog()}})}
function rPrice(){var p=document.getElementById('pn-price');var h='<h4>'+x('Cenovnik','Price list')+'</h4>';
 PR.forEach(function(r,i){h+='<div class="pr"><b>'+x(r[0],r[1])+'</b>'+(S.edit?'<input type="number" min="0" data-i="'+i+'" value="'+r[2]+'">':'<span>'+fm(r[2])+' RSD</span>')+'</div>'});
 h+='<button class="pbtn'+(S.edit?'':' alt')+'" type="button" id="pe" style="margin-top:14px">'+(S.edit?x('Sačuvaj','Save'):x('Uredi cene','Edit prices'))+'</button>';
 if(S.saved&&!S.edit)h+='<p class="note">'+x('Sačuvano. Cene na sajtu su odmah nove.','Saved. The prices on the site are new right away.')+'</p>';
 p.innerHTML=h;p.querySelector('#pe').onclick=function(){if(S.edit){p.querySelectorAll('input').forEach(function(i){var v=parseInt(i.value,10);PR[+i.dataset.i][2]=isNaN(v)?0:v});S.edit=false;S.saved=true}else{S.edit=true;S.saved=false}rPrice()}}
function all(){rBook();rGal();rBlog();rPrice()}all();
new MutationObserver(all).observe(H,{attributes:true,attributeFilter:['lang']});
document.querySelectorAll('.ft').forEach(function(b){b.onclick=function(){document.querySelectorAll('.ft').forEach(function(o){o.classList.toggle('on',o===b)});document.querySelectorAll('.pn').forEach(function(o){o.classList.toggle('on',o.id==='pn-'+b.dataset.p)})}});
})();
