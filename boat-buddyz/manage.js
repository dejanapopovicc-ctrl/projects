(function(){var K='bbjobs',$=function(i){return document.getElementById(i)},data='';
function get(){try{return JSON.parse(localStorage.getItem(K)||'[]')}catch(e){return[]}}
function put(a){try{localStorage.setItem(K,JSON.stringify(a));return true}catch(e){return false}}
function esc(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML}
function list(){var a=get();$('jl').innerHTML=a.length?a.map(function(j,i){return '<li><img alt="" src="'+j.u+'"><div><b>'+esc(j.t)+'</b>'+esc(j.s)+'</div><button type="button" data-i="'+i+'">Delete</button></li>'}).join(''):'<li><div>No jobs yet.</div></li>'}
$('pf').addEventListener('change',function(e){var f=e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(){var im=new Image();im.onload=function(){var m=800,s=Math.min(1,m/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=im.width*s;c.height=im.height*s;c.getContext('2d').drawImage(im,0,0,c.width,c.height);data=c.toDataURL('image/jpeg',.72);$('pp').src=data;$('pp').hidden=false;$('pt').hidden=true};im.src=r.result};r.readAsDataURL(f)});
$('mf').addEventListener('submit',function(e){e.preventDefault();var t=$('tt').value.trim(),m=$('mm');if(!data){m.textContent='Add a photo first.';return}if(!t){m.textContent='Say what you did.';return}
var a=get();a.unshift({t:t,s:$('sv').value,u:data});if(!put(a)){m.textContent='Could not save, browser storage is full.';return}
data='';$('pp').hidden=true;$('pt').hidden=false;$('tt').value='';$('pf').value='';m.textContent='Added. It now shows on the site.';list()});
$('jl').addEventListener('click',function(e){var i=e.target.getAttribute&&e.target.getAttribute('data-i');if(i===null)return;var a=get();a.splice(+i,1);put(a);list()});
$('rs').addEventListener('click',function(){put([]);list()});list()})();
