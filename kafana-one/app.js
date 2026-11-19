(function(){
  var html=document.documentElement;
  function setLang(l){
    html.setAttribute('lang',l);
    try{localStorage.setItem('lang',l)}catch(e){}
    document.querySelectorAll('.lang button').forEach(function(b){b.classList.toggle('on',b.dataset.l===l)});
    document.querySelectorAll('[data-sr]').forEach(function(el){
      var v=el.getAttribute('data-'+l);if(v===null)return;
      if(el.tagName==='IMG')el.setAttribute('alt',v);
      else if(el.tagName==='OPTION')el.textContent=v;
      else if(el.tagName==='INPUT'||el.tagName==='TEXTAREA')el.setAttribute('placeholder',v);
      else el.textContent=v;
    });
    var tt=document.body.getAttribute('data-title-'+l);if(tt)document.title=tt;
  }
  document.querySelectorAll('.lang button').forEach(function(b){b.addEventListener('click',function(){setLang(b.dataset.l)})});
  setLang(html.getAttribute('lang')||'sr');

  var bg=document.querySelector('.burger'),links=document.getElementById('links');
  if(bg)bg.addEventListener('click',function(){links.classList.toggle('open')});

  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:0,rootMargin:'0px 0px -30px 0px'});
    document.querySelectorAll('.rv').forEach(function(el){io.observe(el)});
  setTimeout(function(){document.querySelectorAll('.rv').forEach(function(el){el.classList.add('in')})},2500);
  }else{document.querySelectorAll('.rv').forEach(function(el){el.classList.add('in')})}



  try{var fm=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Belgrade',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date());
    var dn=fm.find(function(x){return x.type==='weekday'}).value,hh=parseInt(fm.find(function(x){return x.type==='hour'}).value,10)%24;
    var di={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6}[dn];
    var li=document.querySelector('.board li[data-d="'+di+'"]');if(li)li.classList.add('today');
    var oh=di===0?12:9,ch=di===0?20:23,open=hh>=oh&&hh<ch,st=document.getElementById('status');
    if(st){var lg=document.documentElement.lang==='en'?'en':'sr';
      function txt(l){var nx=hh<oh?oh:(di===6?12:9);return open?st.dataset[l+'Open']+' '+ch+':00':st.dataset[l+'Closed']+' '+nx+':00'}
      function setSt(){var l=document.documentElement.lang==='en'?'en':'sr';st.classList.toggle('closed',!open);st.textContent=txt(l);st.dataset.txtSr=txt('sr');st.dataset.txtEn=txt('en')}
      setSt();document.querySelectorAll('.lang button').forEach(function(b){b.addEventListener('click',function(){setTimeout(setSt,0)})});}
  }catch(e){}
  var hd=document.getElementById('hdr');function sc(){if(hd)hd.classList.toggle('solid',window.scrollY>40)}sc();window.addEventListener('scroll',sc,{passive:true});
  var secs=document.querySelectorAll('section[id]'),nl=document.querySelectorAll('nav a');
  if('IntersectionObserver' in window){var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){nl.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-40% 0px -55% 0px'});secs.forEach(function(s){so.observe(s)})}
  nl.forEach(function(a){a.addEventListener('click',function(){var l=document.getElementById('links');if(l)l.classList.remove('open')})});

  var chips=document.querySelectorAll('.chips button'),ans=document.querySelectorAll('.ans');
  chips.forEach(function(b){b.addEventListener('click',function(){
    chips.forEach(function(x){x.classList.toggle('on',x===b)});
    ans.forEach(function(p){p.classList.toggle('on',p.dataset.k===b.dataset.k)});
    if(b.dataset.k==='sada'){var st=document.getElementById('status'),na=document.querySelector('#nowans');if(st&&na){na.querySelector('.sr').textContent=st.dataset.txtSr;na.querySelector('.en').textContent=st.dataset.txtEn}}
  })});
  var f=document.getElementById('exam');
  if(f)f.addEventListener('submit',function(ev){
    ev.preventDefault();var ok=true;
    f.querySelectorAll('[data-req]').forEach(function(w){
      var i=w.querySelector('input,textarea');var v=i.value.trim();
      var bad=!v||(i.type==='email'&&!/^\S+@\S+\.\S+$/.test(v));
      w.classList.toggle('bad',bad);if(bad)ok=false;
    });
    if(ok){f.style.display='none';document.getElementById('thanks').style.display='block'}
    /* ZAMENI: povezati sa Formspree/Netlify Forms ili e-mailom ordinacije */
  });
})();
