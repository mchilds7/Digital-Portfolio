/* Site enhancements: hover flyouts for top tabs, active tab, reading bar, back-to-top */
(function(){
var page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
var M={
'index.html':['Portfolio Home',[['About Me','about','Who I am and what I study'],['Education','education','Caldwell University and coursework'],['Skills','skills','What I can do and what I’m learning'],['Projects','projects','Featured class projects'],['AI Movie Agent','ai-agent','Multi-agent workflow, storyboard and movie'],['AI in Education','ai','Everyday tech and AI for school'],['Contact','contact','Get in touch']]],
'index.html#skills':['Skills',[['Critical Thinking','skills','Problem solving and logic'],['Analysis','skills','Interpreting information'],['Communication','skills','Writing, speaking, listening'],['Computer Knowledge','skills','Everyday software and systems'],['AI & Tech Tools','skills','Generative AI and productivity'],['Skills I Plan to Learn','skills','Goals for the future']]],
'index.html#projects':['Projects',[['Digital Portfolio System','projects','This site'],['Software & Computer Systems','projects','Essential software in education'],['Effective Communication','projects','Interpersonal dialogue'],['Digital Citizenship','projects','Ethics, law and responsibility'],['The Internet','projects','Architecture and protocols']]],
'index.html#ai-agent':['AI Movie Agent',[['Run Agent Workflow','ai-agent','Director → script → storyboard → edit'],['Storyboard & Movie: ECHO','echo-storyboard','Visuals plus the 3-minute horror short'],['Prompts & Workflow','echo-workflow','How the movie was made, stage by stage']]],
'digital-citizenship.html':['Digital Citizenship',[['Essential Questions','core-questions','The big ideas'],['The REP Framework','framework','Respect, Educate, Protect'],['9 Core Elements','elements','The nine elements of citizenship'],['Digital Law & Safety','legal','Privacy, copyright, online safety'],['Generative AI Ethics','ai-ethics','Using AI responsibly'],['Citizenship Quiz','quiz','Test your score'],['Action Plan','action','Habits to start today']]],
'internet.html':['The Internet',[['Part 1: Internet Technologies','part1','How the Internet works'],['Part 2: AI Chatbot','part2','Chat with NetBot AI'],['Part 3: AI Digital Person','part3','Upload a photo and chat with your digital person'],['Key Questions','core-questions','Essential questions of the Internet'],['Architecture','architecture','Cables, routers and data centers'],['Protocols','protocols','TCP/IP, DNS, HTTP'],['Web Evolution','evolution','Web 1.0 to today'],['Packet Simulator','simulator','Interactive packet and DNS demo'],['Quiz','quiz','Test your knowledge'],['Checklist','checklist','Stay safe online']]],
'software.html':['Software',[['What Is Software?','software-types','Types of software'],['5 Apps I Use','productivity','Everyday applications'],['Cloud & Collaboration','cloud','Working online'],['Safe Software Habits','safety','Staying protected']]],
'hardware.html':['Hardware',[['What Is Hardware?','what-is-hardware','The basics'],['Eight Core Parts','core-parts','CPU, RAM, GPU and more'],['How It Works Together','how-it-works','Parts as a system'],['Comparison','comparison','Side by side'],['Care & Safety','care','Keeping devices healthy']]],
'security.html':['Security',[['Passwords & Authentication','passwords','Strong logins and 2FA'],['Password Lab','password-lab','Live strength checker'],['Phishing','phishing','Spot deceptive messages'],['Malware','malware','Types and prevention'],['Privacy','privacy','Protect your data'],['AI Ethics & Verification','ai-ethics','Check before you trust']]],
'storage.html':['Storage',[['Storage Types','types','HDD, SSD, NVMe, flash, cloud and more'],['RAM vs Storage','primary-secondary','Memory vs long-term storage'],['How Saving Works','how-storage-works','What happens when you click Save'],['Capacity Units','capacity','Bits, bytes, GB and TB'],['Comparison Table','comparison','All 8 types side by side'],['Backup & Care','backup','The 3-2-1 rule and good habits']]],
'io.html':['I/O Devices',[['Input Devices','input-devices','Keyboards, mice, microphones'],['Output Devices','output-devices','Monitors, printers, speakers'],['How I/O Works Together','how-io-works','Input to output flow'],['Comparison','comparison','Side by side']]]
};
function key(a){var h=a.getAttribute('href')||'';if(h.charAt(0)=='#')return page=='index.html'?'index.html'+h:null;return h.split('?')[0].toLowerCase()}
var fly=document.createElement('div');fly.id='nav-flyout';fly.setAttribute('role','menu');document.body.appendChild(fly);
var cur=null,timer=null;
function close(){fly.classList.remove('on');if(cur){cur.classList.remove('is-open');var l=cur.querySelector('a');if(l)l.setAttribute('aria-expanded','false')}cur=null}
function open(li,k){
 if(!li.offsetParent)return;clearTimeout(timer);if(cur&&cur!==li)close();
 var d=M[k],tgt=k.split('#')[0];fly.innerHTML='';
 var h=document.createElement('div');h.className='fly-head';h.innerHTML='Inside <b></b>';h.querySelector('b').textContent=d[0];fly.appendChild(h);
 d[1].forEach(function(it){var a=document.createElement('a');a.setAttribute('role','menuitem');a.href=(tgt==page?'':tgt)+'#'+it[1];var s=document.createElement('strong');s.textContent=it[0];var p=document.createElement('span');p.textContent=it[2];a.appendChild(s);a.appendChild(p);a.addEventListener('click',close);fly.appendChild(a)});
 var r=li.getBoundingClientRect(),w=Math.min(360,innerWidth-16);
 fly.style.left=Math.max(8,Math.min(r.left,innerWidth-w-8))+'px';fly.style.top=(r.bottom+4)+'px';
 fly.classList.add('on');li.classList.add('is-open');cur=li;var l=li.querySelector('a');if(l)l.setAttribute('aria-expanded','true')}
function later(){clearTimeout(timer);timer=setTimeout(close,200)}
document.querySelectorAll('.desktop-nav .nav-links > li').forEach(function(li){
 var a=li.querySelector('a.nav-link');if(!a)return;
 var h=(a.getAttribute('href')||'').split('?')[0].toLowerCase();
 if(h==page)a.classList.add('is-current');
 var k=key(a);if(!k||!M[k]||k==page)return;
 li.classList.add('has-flyout');a.setAttribute('aria-haspopup','true');a.setAttribute('aria-expanded','false');
 var c=document.createElement('span');c.className='nav-caret';c.setAttribute('aria-hidden','true');c.textContent='▾';a.appendChild(c);
 li.addEventListener('mouseenter',function(){open(li,k)});li.addEventListener('mouseleave',later);
 a.addEventListener('focus',function(){open(li,k)});
});
fly.addEventListener('mouseenter',function(){clearTimeout(timer)});fly.addEventListener('mouseleave',later);
document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
addEventListener('scroll',close,{passive:true});addEventListener('resize',close);
document.addEventListener('focusin',function(e){if(cur&&!cur.contains(e.target)&&!fly.contains(e.target))close()});
/* reading progress + back to top */
var bar=document.createElement('div');bar.id='read-bar';document.body.appendChild(bar);
var tt=document.createElement('button');tt.id='to-top';tt.type='button';tt.setAttribute('aria-label','Back to top');tt.textContent='↑';tt.onclick=function(){scrollTo({top:0,behavior:'smooth'})};document.body.appendChild(tt);
function prog(){var h=document.documentElement,m=h.scrollHeight-h.clientHeight;bar.style.width=(m>0?Math.min(100,scrollY/m*100):0)+'%';tt.classList.toggle('on',scrollY>700)}
addEventListener('scroll',prog,{passive:true});prog();
})();
