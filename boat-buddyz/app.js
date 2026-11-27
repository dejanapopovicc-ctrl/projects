(function(){
var bl=document.getElementById('bl'),hg=document.getElementById('hg'),len=document.getElementById('len');
function u(){var v=+bl.value;len.textContent=v+' m';var s=.35+.65*(v-1)/29;hg.style.transform='scale('+s.toFixed(3)+')'}
bl.addEventListener('input',u);u();
document.getElementById('qf').addEventListener('submit',function(e){e.preventDefault();
var n=document.getElementById('nm').value.trim(),p=document.getElementById('ph').value.trim(),m=document.getElementById('msg');
if(!n||!p){m.textContent='Add your name and phone so we can reply.';return}
m.textContent='Thanks '+n+'. This is a demo, so nothing was sent.'});
var s=document.querySelector('.stk'),q=document.getElementById('quote');
if(s&&'IntersectionObserver' in window){new IntersectionObserver(function(a){s.classList.toggle('off',a[0].isIntersecting)},{threshold:.15}).observe(q)}
})();
(function(){var g=document.getElementById('wkg');if(!g)return;var a=[];try{a=JSON.parse(localStorage.getItem('bbjobs')||'[]')}catch(e){}
var all=a.concat(window.SEED||[]);g.innerHTML=all.map(function(j){var d=document.createElement('div');d.textContent=j.t;var t=d.innerHTML;d.textContent=j.s;return '<figure class="wc"><img loading="lazy" alt="'+t.replace(/"/g,'&quot;')+'" src="'+j.u+'"><b>'+t+'</b><span>'+d.innerHTML+'</span></figure>'}).join('')})();
