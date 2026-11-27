(function(){
var li=[].slice.call(document.querySelectorAll('#chk li'));
if(matchMedia('(prefers-reduced-motion:reduce)').matches){li.forEach(function(x){x.classList.add('on')})}
else{li.forEach(function(x,i){setTimeout(function(){x.classList.add('on')},700+i*520)})}
var ph=document.getElementById('ph'),th=document.getElementById('th'),dc=document.getElementById('dc');
ph.addEventListener('change',function(){th.innerHTML='';var f=[].slice.call(ph.files).slice(0,6);dc.textContent=f.length?f.length+' photo'+(f.length>1?'s':'')+' added. Tap to change.':'Tap to take or choose pictures';
f.forEach(function(file){var i=new Image();i.alt='';i.src=URL.createObjectURL(file);th.appendChild(i)})});
document.getElementById('rf').addEventListener('submit',function(e){e.preventDefault();var n=document.getElementById('nm').value.trim(),p=document.getElementById('tl').value.trim(),m=document.getElementById('msg');
if(!n||!p){m.style.color='#a33';m.textContent='Add your name and phone so we can reply.';return}
m.style.color='';m.textContent='Thanks '+n+'. This is a demo, so nothing was sent.'});
var s=document.querySelector('.stk'),q=document.getElementById('request');
if(s&&'IntersectionObserver' in window){new IntersectionObserver(function(a){s.classList.toggle('off',a[0].isIntersecting)},{threshold:.15}).observe(q)}
})();
