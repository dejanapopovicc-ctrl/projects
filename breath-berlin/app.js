(function(){
"use strict";
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
var REEL=/[?&]reel=1/.test(location.search);
if(REEL)document.documentElement.classList.add("reel");
var SESS={intro:{n:"Intro call",d:"20 min",w:["online"],t:["10:00","10:30","11:00","11:30","13:00","13:30","15:00","15:30","17:00","17:30"]},
somatic:{n:"Somatic session",d:"60 min",w:["studio","online"],t:["10:00","11:30","13:00","14:30","16:00","17:30"]},
breath:{n:"Breathwork session",d:"75 min",w:["studio"],t:["10:00","12:00","14:00","16:00"]}};
var WHERE={studio:["Studio","Kreuzberg"],online:["Online","Video call"]};

/* ---------- sound ---------- */
var snd=$("#snd"),sl=$(".sl",snd),ac=null,master=null,on=false,stopT=null,lvl=.5;
function build(){
var C=window.AudioContext||window.webkitAudioContext;if(!C)return false;ac=new C();
master=ac.createGain();master.gain.value=0;master.connect(ac.destination);
var len=ac.sampleRate*4,buf=ac.createBuffer(1,len,ac.sampleRate),d=buf.getChannelData(0),last=0;
for(var i=0;i<len;i++){var wn=Math.random()*2-1;last=(last+.02*wn)/1.02;d[i]=last*3.5}
var src=ac.createBufferSource();src.buffer=buf;src.loop=true;
var lp=ac.createBiquadFilter();lp.type="lowpass";lp.frequency.value=520;lp.Q.value=.4;
var ng=ac.createGain();ng.gain.value=.9;src.connect(lp);lp.connect(ng);ng.connect(master);
var lfo=ac.createOscillator();lfo.frequency.value=.1;var lg=ac.createGain();lg.gain.value=260;lfo.connect(lg);lg.connect(lp.frequency);
var lg2=ac.createGain();lg2.gain.value=.25;lfo.connect(lg2);lg2.connect(ng.gain);
[[98,.05],[146.8,.03],[196,.015]].forEach(function(p){var o=ac.createOscillator();o.type="sine";o.frequency.value=p[0];var g=ac.createGain();g.gain.value=p[1];o.connect(g);g.connect(master);o.start()});
src.start();lfo.start();return true}
function ramp(v,s){if(!ac)return;var t=ac.currentTime;master.gain.cancelScheduledValues(t);master.gain.setValueAtTime(master.gain.value,t);master.gain.linearRampToValueAtTime(v,t+s)}
function setSnd(v){on=v;snd.setAttribute("aria-pressed",v?"true":"false");sl.textContent=v?"Sound on":"Sound off";
if(v){if(!ac&&!build()){on=false;snd.setAttribute("aria-pressed","false");sl.textContent="Sound off";return}
clearTimeout(stopT);if(ac.resume)ac.resume();ramp(lvl,2.5)}
else if(ac){ramp(0,1.4);stopT=setTimeout(function(){if(!on&&ac.suspend)ac.suspend()},1600)}}
function setLevel(v){if(v===lvl)return;lvl=v;if(on)ramp(lvl,3)}
snd.addEventListener("click",function(){setSnd(!on)});
var dc=null;
function ding(){try{var C=window.AudioContext||window.webkitAudioContext;if(!C)return;dc=dc||new C();if(dc.resume)dc.resume();var t=dc.currentTime;
[[880,0],[1318.5,.16]].forEach(function(p){var o=dc.createOscillator(),g=dc.createGain();o.type="sine";o.frequency.value=p[0];g.gain.setValueAtTime(0,t+p[1]);g.gain.linearRampToValueAtTime(.14,t+p[1]+.02);g.gain.exponentialRampToValueAtTime(.0001,t+p[1]+1.2);o.connect(g);g.connect(dc.destination);o.start(t+p[1]);o.stop(t+p[1]+1.3)})}catch(e){}}

/* ---------- header, label, theme, dots ---------- */
var hdr=$("#hdr"),sk=$("#stick"),bkEl=$("#book");
var bl=$("#bl");if(bl){(function loop(){bl.textContent="Breathe in";setTimeout(function(){bl.textContent="Breathe out"},4000);setTimeout(loop,10000)})()}
if("IntersectionObserver" in window){
var po=new IntersectionObserver(function(es){es.forEach(function(e){var st=e.isIntersecting?"running":"paused",t=e.target;
if(t.id==="top")$$("#h1,.hbg img,.r,.bline b",t).forEach(function(a){a.style.animationPlayState=st});
if(t.id==="end"){var b=$("#big");if(b)b.style.animationPlayState=st}})},{threshold:0});
["#top","#end"].forEach(function(s){var el=$(s);if(el)po.observe(el)});
var to=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){document.body.setAttribute("data-theme",e.target.getAttribute("data-theme"));setLevel(e.target.id==="book"?.72:.5)}})},{rootMargin:"0px 0px -92% 0px"});
$$("section[data-theme]").forEach(function(s){to.observe(s)});
var dots=$$(".dots a");
var dobs=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){dots.forEach(function(d){d.setAttribute("aria-current",d.getAttribute("data-t")===e.target.id?"true":"false")})}})},{rootMargin:"-45% 0px -50% 0px"});
dots.forEach(function(d){var s=document.getElementById(d.getAttribute("data-t"));if(s)dobs.observe(s)})}

/* ---------- scroll frame: header, parallax, hour line, sticky ---------- */
var par=$$("[data-par]"),tick=false,hl=$("#hl"),hsteps=$$(".hs"),hbox=$("#hsteps");
function parallax(){if(reduce||innerWidth<700){par.forEach(function(el){el.style.transform=""});return}var h=innerHeight;par.forEach(function(el){var r=el.getBoundingClientRect();if(r.bottom<-200||r.top>h+200)return;var c=r.top+r.height/2-h/2;el.style.transform="translate3d(0,"+(-c*parseFloat(el.getAttribute("data-par"))).toFixed(1)+"px,0)"})}
function prog(){if(!hbox)return;var r=hbox.getBoundingClientRect(),vh=innerHeight;var p=Math.max(0,Math.min(1,(vh*.62-r.top)/r.height));hl.style.transform="scaleY("+p.toFixed(3)+")";hsteps.forEach(function(s){s.classList.toggle("on",s.getBoundingClientRect().top<vh*.62)})}
var jr=$("#journey"),jw=jr?$$(".jwords span",jr):[],jbg=jr?$(".jbg",jr):null,jbEl=$("#jb"),jh=$("#jh"),jv=jr?$(".jv",jr):null;
function journey(){if(!jr||reduce)return;var r=jr.getBoundingClientRect(),tot=r.height-innerHeight;if(r.bottom<-50||r.top>innerHeight+50)return;
var p=Math.max(0,Math.min(1,-r.top/tot));jbEl.style.transform="scaleX("+p.toFixed(3)+")";
jbg.style.transform="scale("+(1.02+p*.22).toFixed(3)+")";jh.style.opacity=p<.06?1:0;
jw.forEach(function(w,i){var c=(i+.5)/jw.length,a=Math.max(0,Math.min(1,(.125-Math.abs(p-c))/.04));a=a*a*(3-2*a);if(i===0&&p<c)a=1;if(i===jw.length-1&&p>c)a=1;
w.style.opacity=a.toFixed(3);w.style.filter="blur("+((1-a)*6).toFixed(1)+"px)";
w.style.transform="translate(-50%,calc(-50% + "+((p-c)*-140).toFixed(1)+"px)) scale("+(.96+a*.04).toFixed(3)+")"})}
function frame(){tick=false;hdr.classList.toggle("sc",scrollY>40);parallax();prog();journey();
if(sk&&bkEl){sk.classList.toggle("on",scrollY>innerHeight*.7&&bkEl.getBoundingClientRect().top>innerHeight*.75)}}
function rq(){if(!tick){tick=true;requestAnimationFrame(frame)}}
window.addEventListener("scroll",rq,{passive:true});window.addEventListener("resize",rq);frame();

/* ---------- hero: press and hold to breathe ---------- */
(function(){var hero=$("#top"),orb=$("#orb"),hint=$(".h2");if(!hero||!orb||reduce)return;
var tx=0,ty=0,cx=0,cy=0,s=1,ts=1,pressed=false,run=false,inside=false;
function loop(){cx+=(tx-cx)*.14;cy+=(ty-cy)*.14;s+=(ts-s)*(pressed?.022:.05);
orb.style.transform="translate("+(cx-45).toFixed(1)+"px,"+(cy-45).toFixed(1)+"px) scale("+s.toFixed(3)+")";
if(inside||pressed||s>1.02)requestAnimationFrame(loop);else run=false}
function go(){if(!run){run=true;requestAnimationFrame(loop)}}
function pos(e){var r=hero.getBoundingClientRect();tx=e.clientX-r.left;ty=e.clientY-r.top}
hero.addEventListener("pointermove",function(e){if(e.pointerType==="touch")return;pos(e);if(!inside){inside=true;cx=tx;cy=ty;orb.classList.add("on")}go()});
hero.addEventListener("pointerleave",function(){inside=false;if(!pressed)orb.classList.remove("on")});
hero.addEventListener("pointerdown",function(e){if(e.target.closest("a,button"))return;pos(e);if(e.pointerType==="touch"){cx=tx;cy=ty}pressed=true;ts=3.6;orb.classList.add("on");if(hint)hint.textContent="In... slowly";go()});
function rel(){if(!pressed)return;pressed=false;ts=1;if(hint)hint.textContent="Out... let go";setTimeout(function(){if(!pressed){if(hint)hint.textContent="Press and hold anywhere";if(!inside)orb.classList.remove("on")}},3000)}
window.addEventListener("pointerup",rel);window.addEventListener("pointercancel",rel)})();


/* ---------- hero shader field + videos ---------- */
(function(){var hero=$("#top"),cv=$("#fx");
var t0=performance.now();
/* videos: play only when visible, fade in when playing */
$$("video").forEach(function(v){v.addEventListener("playing",function(){v.classList.add("ok")});
if(reduce){v.removeAttribute("autoplay");v.pause();return}
if("IntersectionObserver" in window){new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var p=v.play();if(p&&p.catch)p.catch(function(){})}else v.pause()})},{rootMargin:"200px"}).observe(v)}else{v.play()}});
if(!hero||!cv)return;
var gl=cv.getContext("webgl",{premultipliedAlpha:true,antialias:false,alpha:true});if(!gl)return;
var vs="attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";
var fs="precision mediump float;uniform vec2 r;uniform float t,b;uniform vec3 m;"+
"float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}"+
"float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}"+
"float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p*=2.02;a*=.5;}return v;}"+
"void main(){vec2 p=(gl_FragCoord.xy-.5*r)/r.y;float asp=r.x/r.y;"+
"vec2 c=vec2(.34*asp,.0)+(m.xy-.5)*vec2(asp,1.)*.18;float d=length(p-c);"+
"vec2 q=p*1.5+vec2(t*.02,-t*.014);float w=fbm(q+fbm(q*1.3-t*.03)*1.6);"+
"float ring=0.;for(int i=0;i<3;i++){float k=float(i);float rad=.16+.15*k+.13*b*(1.+.35*k);ring+=exp(-pow((d-rad)*16.,2.))*(.62-.15*k);}"+
"float bloom=exp(-d*d*(3.4-1.8*b))*(.3+.55*b);"+
"float mist=smoothstep(.38,.88,w)*.2;"+
"vec2 pp=(m.xy-.5)*vec2(asp,1.);float pd=length(p-pp);float rip=exp(-pow((pd-(.04+m.z*.4))*13.,2.))*(.2+.45*m.z)*step(.001,m.z+.0);"+
"float glint=pow(fbm(p*3.+t*.05),3.)*.25*b;"+
"float iw=clamp((ring*.85+bloom*.6+rip+glint)*.9,0.,1.);float ms=mist;"+
"vec3 col=vec3(.97,.82,.66)*iw+vec3(.55,.75,.72)*ms;float al=clamp(iw+ms,0.,1.);"+
"gl_FragColor=vec4(min(col,vec3(al)),al);}";
function sh(type,src){var s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return gl.getShaderParameter(s,gl.COMPILE_STATUS)?s:null}
var v=sh(gl.VERTEX_SHADER,vs),f=sh(gl.FRAGMENT_SHADER,fs);if(!v||!f)return;
var pr=gl.createProgram();gl.attachShader(pr,v);gl.attachShader(pr,f);gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS))return;gl.useProgram(pr);
var buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
var loc=gl.getAttribLocation(pr,"a");gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
var U={r:gl.getUniformLocation(pr,"r"),t:gl.getUniformLocation(pr,"t"),b:gl.getUniformLocation(pr,"b"),m:gl.getUniformLocation(pr,"m")};
var mx=.5,my=.5,mz=0,tmx=.5,tmy=.5,tmz=0,vis=true,raf=0;
function size(){var k=Math.min(devicePixelRatio||1,1.5)*.6,w=Math.max(2,Math.round(cv.clientWidth*k)),h=Math.max(2,Math.round(cv.clientHeight*k));if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h;gl.viewport(0,0,w,h)}}
function ease(x){return x*x*(3-2*x)}
function breath(t){var ph=((t/1000)%10)/10;return ph<.4?ease(ph/.4):ease(1-(ph-.4)/.6)}
function draw(now){size();mx+=(tmx-mx)*.08;my+=(tmy-my)*.08;mz+=(tmz-mz)*.05;
gl.uniform2f(U.r,cv.width,cv.height);gl.uniform1f(U.t,now/1000);gl.uniform1f(U.b,breath(now-t0));gl.uniform3f(U.m,mx,my,mz);gl.drawArrays(gl.TRIANGLES,0,3)}
function loop(now){if(vis&&!document.hidden)draw(now);raf=requestAnimationFrame(loop)}
hero.classList.add("gl");
if(reduce){draw(performance.now());return}
raf=requestAnimationFrame(loop);
hero.addEventListener("pointermove",function(e){var r=hero.getBoundingClientRect();tmx=(e.clientX-r.left)/r.width;tmy=1-(e.clientY-r.top)/r.height});
hero.addEventListener("pointerdown",function(e){if(e.target.closest("a,button"))return;var r=hero.getBoundingClientRect();tmx=(e.clientX-r.left)/r.width;tmy=1-(e.clientY-r.top)/r.height;tmz=1});
window.addEventListener("pointerup",function(){tmz=0});
if("IntersectionObserver" in window)new IntersectionObserver(function(es){vis=es[0].isIntersecting},{threshold:0}).observe(hero)})();

/* ---------- check-in ---------- */
var ck=$("#ck"),run=0,rec=null,rows=$$(".srow");
var Q=[{q:"How does your body feel right now?",o:["Tense and wound up","Tired and flat","Restless, hard to switch off","Fine, I want to go deeper"]},
{q:"What would help most today?",o:["Talk it through first","Quiet, guided work","Something longer and deeper","I am not sure"]}];
var ans=[];
function pickSess(a){var b=a[1];if(b===0)return"intro";if(b===1)return"somatic";if(b===2)return"breath";var f=a[0];return f===3?"breath":(f===1?"intro":"somatic")}
var RES={intro:"A short call first. We talk about what is going on and decide together what comes next.",somatic:"Slow, guided work with breath and posture. Good if you carry tension and want to feel it ease.",breath:"A longer session of guided breathing, lying down. It can be intense and it goes at your pace."};
function ckQ(i){run++;var q=Q[i];ck.innerHTML='<div class="step">Question '+(i+1)+' of 2</div><p class="q"></p><div class="copts"></div>';
$(".q",ck).textContent=q.q;var box=$(".copts",ck);
q.o.forEach(function(t,k){var b=document.createElement("button");b.type="button";b.textContent=t;b.addEventListener("click",function(){ans[i]=k;i<1?ckQ(i+1):ckBreath()});box.appendChild(b)})}
function ckBreath(){var my=++run,n=0;ck.innerHTML='<div class="res"><div class="gring" id="gr"><i></i><span id="gt">Breathe in</span></div><div><div class="step">Three slow breaths</div><h3>Follow the circle.</h3><p>In for four. Out for six. You can close your eyes.</p><button class="ghost" id="skip" type="button">Skip</button></div></div>';
var gr=$("#gr"),gt=$("#gt");$("#skip").addEventListener("click",function(){if(my===run){run++;ckRes()}});
function cyc(){if(my!==run)return;if(n>=3){ckRes();return}gt.textContent="Breathe in";gr.classList.add("in");
setTimeout(function(){if(my!==run)return;gt.textContent="Breathe out";gr.classList.remove("in");
setTimeout(function(){n++;cyc()},reduce?1200:6000)},reduce?1200:4000)}
setTimeout(cyc,400)}
function ckRes(){var s=pickSess(ans),S=SESS[s];run++;rec=s;markRec();
ck.innerHTML='<div class="res"><div class="gring"><i style="transform:scale(1)"></i><span>Well done</span></div><div><div class="step">Suggested for you</div><h3></h3><p></p><div class="row"><a class="btn" href="#book" id="rb">Book this</a><button class="ghost" id="ra" type="button">Start again</button></div></div></div>';
$("h3",ck).textContent=S.n+", "+S.d;$("p",ck).textContent=RES[s];
$("#rb").addEventListener("click",function(){choose(s)});$("#ra").addEventListener("click",function(){ans=[];rec=null;markRec();ckQ(0)})}
function markRec(){rows.forEach(function(r){r.classList.toggle("rec",r.getAttribute("data-s")===rec)});if(oS)drawS()}
if(ck)ckQ(0);

/* ---------- sessions hover ---------- */
var sl2=$(".slist"),simg=$(".simg");
if(sl2&&simg){simg.dataset.a="0";
rows.forEach(function(r,i){function a(){sl2.dataset.a=i;simg.dataset.a=i;rows.forEach(function(x){x.classList.toggle("on",x===r)})}
r.addEventListener("mouseenter",a);r.addEventListener("focus",a)});
function clr(){delete sl2.dataset.a;rows.forEach(function(x){x.classList.remove("on")})}
sl2.addEventListener("mouseleave",clr);sl2.addEventListener("focusout",function(e){if(!sl2.contains(e.relatedTarget))clr()});
$$("[data-pick]").forEach(function(a){a.addEventListener("click",function(){choose(a.getAttribute("data-pick"))})})}

/* ---------- booking ---------- */
var st={s:null,w:null,date:null,t:null},wk=0,weeks=[],booked={};
var oS=$("#o-s"),oW=$("#o-w"),oD=$("#o-d"),go=$("#go"),why=$("#why"),form=$("#bf"),done=$("#done");
function hash(n){n=(n^61)^(n>>>16);n=n+(n<<3);n=n^(n>>>4);n=Math.imul(n,0x27d4eb2d);n=n^(n>>>15);return Math.abs(n)}
function key(d){return d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate()}
function slotsFor(d,s){var base=SESS[s].t;if(d.getDay()===6)base=base.filter(function(t){return parseInt(t,10)<14});return base}
function taken(d,s,t){var k=key(d)+":"+t;if(booked[k])return true;return hash(key(d)*31+parseInt(t,10)*7+t.length)%100<38}
function fmt(d,o){return d.toLocaleDateString("en-GB",o)}
(function mk(){var d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+1);var map={},order=[];
for(var n=0;n<28;n++){var g=d.getDay();if(g>=2&&g<=6){var m=new Date(d);m.setDate(m.getDate()-((g+6)%7));var k=key(m);if(!map[k]){map[k]=[null,null,null,null,null];order.push(k)}map[k][g-2]=new Date(d)}d.setDate(d.getDate()+1)}
weeks=order.slice(0,3).map(function(k){return map[k]})})();
function radio(box,name,val,label,small,checked){var w=document.createElement("div");w.className="opt";var id=name+"-"+val;
w.innerHTML='<input type="radio" name="'+name+'" id="'+id+'" value="'+val+'"><label for="'+id+'"><span></span><small></small></label>';
$("span",w).textContent=label;$("small",w).textContent=small;var i=$("input",w);i.checked=!!checked;
i.addEventListener("change",function(){name==="s"?pickS(val):pickW(val)});box.appendChild(w)}
function drawS(){oS.innerHTML="";Object.keys(SESS).forEach(function(k){radio(oS,"s",k,SESS[k].n,(rec===k?"Suggested for you, ":"")+SESS[k].d,st.s===k)})}
function drawW(){oW.innerHTML="";if(!st.s){oW.innerHTML='<p class="hint">Choose a session first.</p>';return}
SESS[st.s].w.forEach(function(k){radio(oW,"w",k,WHERE[k][0],WHERE[k][1],st.w===k)})}
function drawD(){oD.innerHTML="";var w=weeks[wk],ds=w.filter(Boolean);
var nav=document.createElement("div");nav.className="wk-nav";
nav.innerHTML='<button type="button" id="wp" aria-label="Previous week">&lsaquo;</button><span id="wl"></span><button type="button" id="wn" aria-label="Next week">&rsaquo;</button>';
oD.appendChild(nav);$("#wl").textContent=fmt(ds[0],{day:"numeric",month:"short"})+" to "+fmt(ds[ds.length-1],{day:"numeric",month:"short"});
$("#wp").disabled=wk===0;$("#wn").disabled=wk===weeks.length-1;
$("#wp").onclick=function(){wk--;drawD()};$("#wn").onclick=function(){wk++;drawD()};
var g=document.createElement("div");g.className="wk-g";var s=st.s||"somatic";
w.forEach(function(d){var c=document.createElement("div");c.className="wk-c"+(d?"":" off");
if(!d){c.innerHTML='<div class="wk-h">&nbsp;<b>&nbsp;</b></div>';g.appendChild(c);return}
var h=document.createElement("div");h.className="wk-h";h.innerHTML=fmt(d,{weekday:"short"})+"<b>"+d.getDate()+"</b>";c.appendChild(h);
slotsFor(d,s).forEach(function(t){var b=document.createElement("button");b.type="button";b.className="slot";b.textContent=t;b.disabled=taken(d,s,t);
b.setAttribute("aria-pressed",st.date&&key(st.date)===key(d)&&st.t===t?"true":"false");
b.setAttribute("aria-label",fmt(d,{weekday:"long",day:"numeric",month:"long"})+" at "+t);
b.addEventListener("click",function(){st.date=d;st.t=t;drawD();upd()});c.appendChild(b)});g.appendChild(c)});
oD.appendChild(g);var p=document.createElement("p");p.className="hint";p.textContent="All times are Berlin time.";oD.appendChild(p)}
function pickS(k){st.s=k;var w=SESS[k].w;st.w=w.length===1?w[0]:(w.indexOf(st.w)>-1?st.w:null);
if(st.date&&(slotsFor(st.date,k).indexOf(st.t)<0||taken(st.date,k,st.t))){st.t=null;st.date=null}
drawS();drawW();drawD();upd()}
function pickW(k){st.w=k;drawW();upd()}
function choose(k){pickS(k)}
function valid(){var nm=$("#nm").value.trim(),em=$("#em").value.trim(),m=[];
if(!st.s)m.push("a session");else if(!st.w)m.push("where");if(!st.date||!st.t)m.push("a day and time");
if(!nm)m.push("your name");if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em))m.push("a valid email");return m}
function upd(){var m=valid();go.disabled=m.length>0;why.textContent=m.length?"Still needed: "+m.join(", ")+".":"Mara will confirm by email. Nothing is charged now."}
["#nm","#em"].forEach(function(s){$(s).addEventListener("input",upd)});

/* therapist phone */
var plist=$("#plist"),pb=$("#pb"),pc=$("#pcount"),ph=$(".ph"),cnt=0;
var seed=[["Tue","10:00","Somatic session","Jonas K."],["Wed","14:00","Breathwork session","Ines P."],["Thu","11:30","Intro call","Luca M."]];
function item(day,t,n,who,cls){var li=document.createElement("li");li.className="pi"+(cls?" "+cls:"");li.innerHTML='<div class="tm"></div><b></b><span></span>';
$(".tm",li).textContent=day+" "+t;$("b",li).textContent=n;$("span",li).textContent=who;return li}
seed.forEach(function(x){plist.appendChild(item(x[0],x[1],x[2],x[3]));cnt++});
function cnt_(){pc.textContent=cnt+" booked"}cnt_();
function pushPhone(){var d=st.date,nm=$("#nm").value.trim();
var li=item(fmt(d,{weekday:"short"}),st.t,SESS[st.s].n,nm+(st.w==="online"?", online":", studio"),"new");plist.insertBefore(li,plist.firstChild);cnt++;cnt_();
pb.innerHTML="<b>New booking request</b>";pb.appendChild(document.createTextNode(nm+", "+SESS[st.s].n+", "+fmt(d,{weekday:"short",day:"numeric",month:"short"})+" at "+st.t));
pb.classList.add("on");ph.classList.remove("buzz");void ph.offsetWidth;if(!reduce)ph.classList.add("buzz");
try{if(navigator.vibrate)navigator.vibrate([70,50,70])}catch(e){}ding();
setTimeout(function(){pb.classList.remove("on")},4500)}

/* ics */
function pad(n){return(n<10?"0":"")+n}
function ics(){var d=st.date,p=st.t.split(":"),mins=parseInt(SESS[st.s].d,10);
var s=new Date(d.getFullYear(),d.getMonth(),d.getDate(),+p[0],+p[1]),e=new Date(s.getTime()+mins*60000);
function f(x){return x.getFullYear()+pad(x.getMonth()+1)+pad(x.getDate())+"T"+pad(x.getHours())+pad(x.getMinutes())+"00"}
var loc=st.w==="online"?"Online (link sent by email)":"Studio, Kreuzberg, Berlin";
var t=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Mara Linden//Booking//EN","BEGIN:VEVENT","UID:"+Date.now()+"@mara-linden.example","DTSTAMP:"+f(new Date())+"Z","DTSTART;TZID=Europe/Berlin:"+f(s),"DTEND;TZID=Europe/Berlin:"+f(e),"SUMMARY:"+SESS[st.s].n+" with Mara Linden","LOCATION:"+loc,"END:VEVENT","END:VCALENDAR"].join("\r\n");
var a=document.createElement("a");a.href=URL.createObjectURL(new Blob([t],{type:"text/calendar"}));a.download="session-mara-linden.ics";document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500)}

form.addEventListener("submit",function(e){e.preventDefault();if(valid().length)return;
booked[key(st.date)+":"+st.t]=1;pushPhone();
var nm=$("#nm").value.trim().split(" ")[0];
done.innerHTML='<h3></h3><p></p><div class="row"><button class="btn" id="ics" type="button">Add to calendar</button><button class="ghost" id="again" type="button">Book another</button></div>';
$("h3",done).textContent="Thank you, "+nm+".";
$("p",done).textContent=SESS[st.s].n+", "+fmt(st.date,{weekday:"long",day:"numeric",month:"long"})+" at "+st.t+", "+(st.w==="online"?"online":"in the studio")+". Mara will confirm by email within a day.";
form.hidden=true;done.hidden=false;var g=$(".bgrid");g.insertBefore(done,g.firstChild);
$("#ics").addEventListener("click",ics);
$("#again").addEventListener("click",function(){done.hidden=true;form.hidden=false;st={s:null,w:null,date:null,t:null};form.reset();drawS();drawW();drawD();upd();form.scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"})});
ph.scrollIntoView({behavior:reduce?"auto":"smooth",block:"center"})});
drawS();drawW();drawD();upd();

/* ---------- reel mode: automatic tour for screen recording ---------- */
if(REEL){
var rs=$("#rs"),fc=$("#fc"),stop=false;rs.hidden=false;
window.addEventListener("keydown",function(e){if(e.key==="Escape"){stop=true;fc.style.opacity=0}});
var sleep=function(ms){return new Promise(function(r){setTimeout(r,ms)})};
var topOf=function(el,off){return el.getBoundingClientRect().top+scrollY-(off||0)};
var glide=function(y,dur){return new Promise(function(res){var y0=scrollY,t0=performance.now();(function s(n){var k=Math.min(1,(n-t0)/dur),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;window.scrollTo(0,y0+(y-y0)*e);if(k<1&&!stop)requestAnimationFrame(s);else res()})(t0)})};
var show=function(el){var r=el.getBoundingClientRect();return glide(scrollY+r.top-innerHeight/2+r.height/2,1300)};
var moveTo=function(el){var r=el.getBoundingClientRect();fc.style.opacity=1;fc.style.transform="translate("+(r.left+r.width/2)+"px,"+(r.top+r.height/2)+"px)";return sleep(950)};
var tap=function(el){return moveTo(el).then(function(){fc.classList.add("p");el.click();return sleep(260)}).then(function(){fc.classList.remove("p")})};
var typeInto=function(el,txt){el.focus();var i=0;return new Promise(function(r){(function n(){if(i>txt.length||stop)return r();el.value=txt.slice(0,i++);el.dispatchEvent(new Event("input",{bubbles:true}));setTimeout(n,70)})()})};
var tour=async function(){
fc.style.transform="translate("+innerWidth*.6+"px,"+innerHeight+"px)";
await sleep(4500);if(stop)return;
var jy=$("#journey");await glide(topOf(jy,0),2600);await glide(topOf(jy,0)+jy.offsetHeight-innerHeight,10000);if(stop)return;
await glide(topOf($("#approach"),50),2400);await sleep(2800);if(stop)return;
var hr=$("#hour");await glide(topOf(hr,50),3000);await glide(topOf(hr,50)+hr.offsetHeight-innerHeight*.85,8000);await sleep(800);if(stop)return;
await glide(topOf($("#about"),50),3200);await sleep(3000);if(stop)return;
await glide(topOf($("#checkin"),30),3200);await sleep(800);if(stop)return;
await tap($(".copts button:nth-child(2)",ck));if(stop)return;
await sleep(500);await tap($(".copts button:nth-child(2)",ck));if(stop)return;
await sleep(5500);if(stop)return;await tap($("#skip"));await sleep(2600);if(stop)return;
await moveTo($("#rb"));fc.classList.add("p");choose(rec);await sleep(300);fc.classList.remove("p");
await glide(topOf($("#book"),60),2600);await sleep(1200);if(stop)return;
var lab=$("label[for=w-studio]");if(lab){await show(lab);await tap(lab)}if(stop)return;
var slot=$(".slot:not([disabled])",oD);await show(slot);await tap(slot);if(stop)return;
var nm=$("#nm");await show(nm);await moveTo(nm);await typeInto(nm,"Anna Weber");if(stop)return;
var em=$("#em");await moveTo(em);await typeInto(em,"anna@example.com");await sleep(600);if(stop)return;
await show(go);await tap(go);await sleep(6500);if(stop)return;
fc.style.opacity=0;await glide(topOf($("#end"),0),3200)};
$("#rsb").addEventListener("click",function(){rs.hidden=true;window.scrollTo(0,0);setSnd(true);tour()})}
})();
