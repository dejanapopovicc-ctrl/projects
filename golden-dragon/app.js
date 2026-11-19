(function(){
  var TZ='America/Los_Angeles',OPEN_H=12,CLOSE_H=20,PHONE='+12135550142';
  function $(id){return document.getElementById(id)}

  var bg=document.querySelector('.burger'),links=$('links');
  if(bg)bg.addEventListener('click',function(){links.classList.toggle('open')});

  var rv=document.querySelectorAll('.rv');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -30px 0px'});
    rv.forEach(function(el){io.observe(el)});
  }
  rv.forEach(function(el){el.classList.add('in')});

  /* open-now status + today highlight (Pacific Time) */
  try{
    var fm=new Intl.DateTimeFormat('en-US',{timeZone:TZ,weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date());
    var dn=fm.find(function(x){return x.type==='weekday'}).value,hh=parseInt(fm.find(function(x){return x.type==='hour'}).value,10)%24;
    var di={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6}[dn];
    var li=document.querySelector('.week li[data-d="'+di+'"]');if(li)li.classList.add('today');
    var open=hh>=OPEN_H&&hh<CLOSE_H,st=$('status');
    if(st){st.classList.toggle('closed',!open);st.textContent=open?'Open now, until 8 PM':'Closed, we open at 12 PM'}
  }catch(e){}

  var hd=$('hdr');function sc(){if(hd)hd.classList.toggle('solid',window.scrollY>40)}sc();window.addEventListener('scroll',sc,{passive:true});
  var secs=document.querySelectorAll('section[id]'),nl=document.querySelectorAll('nav a');
  if('IntersectionObserver' in window){var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){nl.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-40% 0px -55% 0px'});secs.forEach(function(s){so.observe(s)})}
  nl.forEach(function(a){a.addEventListener('click',function(){links.classList.remove('open')})});

  /* idea builder */
  var Z={vrat:'neck',rame:'shoulder',nadlaktica:'upper arm',podlaktica:'forearm',grudi:'chest',rebra:'ribs',butina:'thigh',list:'calf',ledja:'back',drugo:'not sure yet'},
      SZ={mala:'small',srednja:'medium',velika:'large'},
      STY={linije:'linework',senke:'shading',boja:'color',nezna:'not sure yet'};
  var S={z:'drugo',s:'mala',st:'linije'},ta=$('msg'),hint=$('hint'),sms=$('sms');
  function render(){if(!ta)return;
    ta.value='Hi, I am interested in a tattoo. Placement: '+Z[S.z]+'. Size: '+SZ[S.s]+'. Style: '+STY[S.st]+'. When can I come in?';
    if(sms)sms.href='sms:'+PHONE+'?&body='+encodeURIComponent(ta.value);
    document.querySelectorAll('.chip').forEach(function(c){c.classList.toggle('on',S[c.dataset.g]===c.dataset.v)});
    document.querySelectorAll('.body .z').forEach(function(z){z.classList.toggle('on',z.dataset.v===S.z)})}
  document.querySelectorAll('.chip').forEach(function(c){c.addEventListener('click',function(){S[c.dataset.g]=c.dataset.v;render()})});
  document.querySelectorAll('.body .z').forEach(function(z){z.addEventListener('click',function(){S.z=z.dataset.v;render()})});
  var cp=$('copy');
  if(cp)cp.addEventListener('click',function(){
    function ok(){hint.textContent='Message copied. Paste it into a text or DM.'}
    function fail(){ta.select();hint.textContent='Select the text and copy it by hand.'}
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(ta.value).then(ok,fail)}
    else{ta.select();try{document.execCommand('copy');ok()}catch(e){fail()}}});
  render();
})();

/* booking mockup */
(function(){
  if(!document.getElementById('zakazi'))return;
  var TZ='America/Los_Angeles';
  var WD=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],MO=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var N={S:{mala:'Small',srednja:'Medium',velika:'Large'},St:{linije:'Linework',senke:'Shading',boja:'Color'},C:{jednostavna:'Simple',srednja:'Moderate',detaljna:'Detailed'}};
  var CN={jednostavna:'Clean design, few details, no demanding gradients.',srednja:'More elements or finer detail.',detaljna:'Dense design, lots of small detail or realism.'};
  var A={marko:{n:'Marko',off:2,rate:150},ana:{n:'Ana',off:1,rate:180},luka:{n:'Luka',off:3,rate:160}};
  var MINP=200,DEP=50;
  var BASE={mala:1,srednja:2.5,velika:5},SM={linije:1,senke:1.3,boja:1.6},CM={jednostavna:1,srednja:1.4,detaljna:1.9};
  var OPEN=720,CLOSE=1200,CAP=6,DAYS=14;
  var B={a:'marko',s:'srednja',st:'linije',c:'srednja',d:null,t:null};
  function $(id){return document.getElementById(id)}
  function hash(s){var h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0)}
  function bookings(a,d){var k=a+'|'+d,n=hash(k)%3,o=[];for(var i=0;i<n;i++){var s=OPEN+30*(hash(k+'s'+i)%14),e=s+60+30*(hash(k+'l'+i)%5);o.push([s,e])}return o}
  function busy(a,d,m){return bookings(a,d).some(function(r){return m>=r[0]&&m<r[1]})}
  function total(){return Math.ceil(BASE[B.s]*SM[B.st]*CM[B.c]*2)/2}
  function fmtH(h){return h+(h===1?' hr':' hrs')}
  function tm(m){var h=Math.floor(m/60),mm=m%60,ap=h>=12?'PM':'AM';return (h%12||12)+':'+(mm?mm:'00')+' '+ap}
  function price(){var lo=Math.max(MINP,Math.round(total()*A[B.a].rate/5)*5),hi=Math.round(lo*1.15/5)*5;return [lo,hi]}
  function usd(n){return '$'+n.toLocaleString('en-US')}
  function firstLen(){return Math.min(total(),CAP)}
  function today(){
    try{var p=new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
      var g=function(t){return parseInt(p.find(function(x){return x.type===t}).value,10)};
      return Date.UTC(g('year'),g('month')-1,g('day'))}
    catch(e){var n=new Date();return Date.UTC(n.getFullYear(),n.getMonth(),n.getDate())}}
  var DL=(function(){var t=today(),o=[];for(var i=1;i<=DAYS;i++){var d=new Date(t+i*864e5);
    o.push({key:d.getUTCFullYear()+'-'+(d.getUTCMonth()+1)+'-'+d.getUTCDate(),wd:d.getUTCDay(),dn:d.getUTCDate(),mo:d.getUTCMonth()})}return o})();
  function dtxt(x){return WD[x.wd]+', '+MO[x.mo]+' '+x.dn}
  function slotsFor(x){
    if(A[B.a].off===x.wd)return [];
    var len=firstLen()*60,out=[];
    for(var m=OPEN;m+len<=CLOSE;m+=30){var ok=true;for(var y=m;y<m+len;y+=30){if(busy(B.a,x.key,y)){ok=false;break}}if(ok)out.push(m)}
    return out}
  function render(){
    [['bk-s','s'],['bk-st','st'],['bk-c','c']].forEach(function(p){
      document.querySelectorAll('#'+p[0]+' .bchip').forEach(function(b){b.classList.toggle('on',B[p[1]]===b.dataset.v)})});
    document.querySelectorAll('#bk-art .art').forEach(function(b){b.classList.toggle('on',b.dataset.v===B.a)});
    $('bk-cn').textContent=CN[B.c];
    var h=total(),n=Math.ceil(h/CAP);
    $('bk-dur').textContent='~'+fmtH(h);
    $('bk-durs').textContent=n+(n===1?' session':' sessions');
    var dw=$('bk-days'),anyFree=false;dw.innerHTML='';
    DL.forEach(function(x){var free=slotsFor(x).length>0;anyFree=anyFree||free;
      var b=document.createElement('button');b.type='button';b.className='day'+(B.d===x.key?' on':'');b.disabled=!free;
      b.innerHTML='<small>'+WD[x.wd]+'</small><b>'+x.dn+'</b><em>'+MO[x.mo]+'</em>';
      b.addEventListener('click',function(){B.d=x.key;B.t=null;render()});dw.appendChild(b)});
    var cur=DL.filter(function(x){return x.key===B.d})[0];
    if(cur&&slotsFor(cur).length===0){B.d=null;B.t=null;render();return}
    var sw=$('bk-slots');sw.innerHTML='';
    if(!cur){var e=document.createElement('span');e.className='empty';e.textContent=anyFree?'Pick a date.':'No open days in the next 14 days.';sw.appendChild(e);B.t=null}
    else{var sl=slotsFor(cur);if(sl.indexOf(B.t)<0)B.t=null;
      sl.forEach(function(m){var b=document.createElement('button');b.type='button';b.className='slot'+(B.t===m?' on':'');b.textContent=tm(m);
        b.addEventListener('click',function(){B.t=m;render()});sw.appendChild(b)})}
    var pr=price();
    $('bk-price').innerHTML='<span>Estimated price</span><b>'+usd(pr[0])+' \u2013 '+usd(pr[1])+'</b><small>Based on '+usd(A[B.a].rate)+'/hr with a '+usd(MINP)+' shop minimum.</small>';
    var len=firstLen(),rows=[['Artist',A[B.a].n],['Size',N.S[B.s]],['Style',N.St[B.st]],['Complexity',N.C[B.c]]];
    if(n>1)rows.push(['First session',fmtH(len)]);
    rows.push(['Date',cur?dtxt(cur):'–']);
    rows.push(['Time',B.t!==null?tm(B.t)+' – '+tm(B.t+len*60):'–']);
    $('bk-list').innerHTML=rows.map(function(r){return '<div><dt>'+r[0]+'</dt><dd>'+r[1]+'</dd></div>'}).join('');
    $('bk-go').disabled=B.t===null;
    $('bk-fine').textContent='Demo only: nothing is actually booked. Time and price are estimates. Your artist confirms the final quote, and a '+usd(DEP)+' deposit (applied to the final price) holds your slot.'+(n>1?' The first booking is up to 6 hrs. Further sessions are arranged with your artist.':'');
    if(!$('bk-done').hidden)renderDone();
  }
  function renderDone(){if(B.t===null)return;var cur=DL.filter(function(x){return x.key===B.d})[0];if(!cur)return;
    $('bk-ref').textContent='Request GD-'+(hash(B.a+B.d+B.t)%9000+1000);
    $('bk-dtxt').textContent=A[B.a].n+', '+dtxt(cur)+', '+tm(B.t)+' – '+tm(B.t+firstLen()*60)+' PT. Estimated price '+usd(price()[0])+' \u2013 '+usd(price()[1])+'.';
    $('bk-dnote').textContent='This is a mockup. In the live version a confirmation arrives by text message.'}
  [['bk-s','s'],['bk-st','st'],['bk-c','c']].forEach(function(p){
    document.querySelectorAll('#'+p[0]+' .bchip').forEach(function(b){b.addEventListener('click',function(){B[p[1]]=b.dataset.v;B.t=null;render()})})});
  document.querySelectorAll('#bk-art .art').forEach(function(b){b.addEventListener('click',function(){B.a=b.dataset.v;B.t=null;render()})});
  $('bk-go').addEventListener('click',function(){if(B.t===null)return;document.querySelector('.tkt').hidden=true;$('bk-done').hidden=false;renderDone();$('bk-done').scrollIntoView({behavior:'smooth',block:'center'})});
  $('bk-reset').addEventListener('click',function(){$('bk-done').hidden=true;document.querySelector('.tkt').hidden=false;B.t=null;render()});
  render();
})();
