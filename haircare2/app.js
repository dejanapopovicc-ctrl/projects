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

  var bg=document.querySelector('.burger'),links=document.querySelector('.nav .links');
  if(bg)bg.addEventListener('click',function(){links.classList.toggle('open')});

  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:0,rootMargin:'0px 0px -30px 0px'});
    document.querySelectorAll('.rv').forEach(function(el){io.observe(el)});
  setTimeout(function(){document.querySelectorAll('.rv').forEach(function(el){el.classList.add('in')})},2500);
  }else{document.querySelectorAll('.rv').forEach(function(el){el.classList.add('in')})}


  var chip=document.getElementById('chip');
  if(chip){try{var p=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Belgrade',weekday:'short',hour:'2-digit',hour12:false}).formatToParts(new Date());
    var d=p.find(function(x){return x.type==='weekday'}).value,h=parseInt(p.find(function(x){return x.type==='hour'}).value,10);
    if(d!=='Sun'&&h>=9&&h<19)chip.classList.add('open')}catch(e){}}
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
