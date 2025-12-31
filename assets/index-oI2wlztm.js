(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const g of i.addedNodes)g.tagName==="LINK"&&g.rel==="modulepreload"&&n(g)}).observe(document,{childList:!0,subtree:!0});function s(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(a){if(a.ep)return;a.ep=!0;const i=s(a);fetch(a.href,i)}})();const y="/";document.addEventListener("gesturestart",function(e){e.preventDefault()});document.addEventListener("dblclick",function(e){e.preventDefault()},{passive:!1});document.body.addEventListener("touchmove",function(e){e.target.closest(".carousel-track")||e.preventDefault()},{passive:!1});const r=[{id:"caosDrift",title:"Caos Drift",desc:"Shoot your shot like a superstar",category:"Car",tags:["Car","Hypercasual"],image:"https://placehold.co/600x600/e5e7eb/9ca3af?text=CaosDrift",hero:"https://placehold.co/1920x1080/e5e7eb/9ca3af?text=SOON",path:"games/desk/index.html",locked:!1},{id:"prokick",title:"Prokick",desc:"Shoot your shot like a superstar",category:"Football",tags:["Football","Hypercasual"],image:"games/ball/image.jpeg",hero:"games/ball/hero.jpeg",path:"games/ball/index.html",locked:!1},{id:"Survivors",title:"Pixle Knight Quest",desc:"How long can you survive against endless waves of enemies?",category:"Roguelike",tags:["Roguelike","Action"],image:"games/survival/image.png",hero:"games/survival/hero.png",path:"games/survival/index.html",locked:!1},{id:"jomp",title:"JOMP",desc:"Test your reflexes! Bounce over obstacles and reach new heights.",category:"Arcade",tags:["Arcade","Skill"],image:"games/snake/icon.png",hero:"games/snake/hero.png",path:"games/snake/index.html",locked:!1},{id:"2048",title:"2048",desc:"Merge the numbers, build your strategy, and reach the 2048 tile.",category:"Puzzle",tags:["Puzzle","Logic"],image:"games/2048/image.png",hero:"games/2048/hero.png",path:"games/2048/index.html",locked:!1},{id:"Pacman",title:"Pacman",desc:"The classic maze chase. Eat the dots and avoid the ghosts!",category:"Arcade",tags:["Arcade","Classic"],image:"games/pacman/image.png",hero:"games/pacman/hero.png",path:"games/pacman/index.html",locked:!1},{id:"Market",title:"Market Simulator",desc:"Let's serve! Build your market now!",category:"Simulator",tags:["Simulator","Pixelart"],image:"games/market/image.jpeg",hero:"games/market/hero.jpeg",path:"games/market/index.html",locked:!1},{id:"Fruits",title:"Fruits",desc:"The classic maze chase. Eat the dots and avoid the ghosts!",category:"Arcade",tags:["Arcade","Classic"],image:"games/fruits/image.jpeg",hero:"games/fruits/hero.jpeg",path:"games/fruits/index.html",locked:!1},{id:"Lost_in_Space",title:"Lost in Space",desc:"Lost in Space is a game about exploration and survival in an infinite procedurally generated universe",category:"Arcade",tags:["Action","Space"],image:"games/space/image.jpeg",hero:"games/space/hero.jpeg",path:"games/space/index.html",locked:!1},{id:"last protocol",title:"Last Protocol",desc:"Humanity's last chance is a robot...",tags:["Coming Soon"],image:"games/lastProtocol/image.webp",hero:"games/lastProtocol/hero.jpeg",locked:!0},{id:"6",title:"Coming Soon",desc:"New games are arriving here very soon!",tags:["Coming Soon"],image:"https://placehold.co/600x600/e5e7eb/9ca3af?text=...",hero:"https://placehold.co/1920x1080/e5e7eb/9ca3af?text=SOON",locked:!0}];document.querySelector("#app").innerHTML=`
  <div class="hero-background" id="hero-bg"></div>

  <header class="app-header">
    <div class="brand-logo-background">
      <div class="brand-logo">LUMUS<span>GAMES</span></div>
    </div>
    <div class="user-avatar"><img src="https://placehold.co/100x100/ffff/fffff?text=U"></div>
  </header>

  <div id="carousel-container">
    <div class="carousel-track" id="track">
        ${r.map((e,t)=>`
            <div class="game-card ${t===0?"active":""} ${e.locked?"locked":""}">
                <img src="${e.image}">
            </div>
        `).join("")}
    </div>
  </div>

  <div class="info-section">
    <h1 class="game-title-large" id="d-title">${r[0].title}</h1>
    <div class="tags-row" id="d-tags"></div>
    <p class="game-description" id="d-desc">${r[0].desc}</p>
  </div>

  <div class="bottom-bar">
    <button class="fav-btn">★ Favorite</button>
    <button class="play-action-btn ${r[0].locked?"soon":""}" id="play-btn">
      PLAY NOW
    </button> 
  </div>

  <div id="game-container">
    <button id="close-btn">✕</button>
  </div>
`;let o=0;const b=document.getElementById("track"),d=document.querySelectorAll(".game-card"),k=document.getElementById("hero-bg"),w=document.getElementById("d-title"),L=document.getElementById("d-desc"),x=document.getElementById("d-tags"),p=document.getElementById("play-btn");function E(){return window.innerWidth>=1024?{cardWidth:150,gap:20,activeGrowth:0}:{cardWidth:140,gap:20,activeGrowth:20}}function c(e){d.forEach(a=>a.classList.remove("active")),d[e]&&d[e].classList.add("active");const t=E(),s=e*(t.cardWidth+t.gap);b.style.transform=`translateX(-${s}px)`;const n=r[e];w.innerText=n.title,L.innerText=n.desc,x.innerHTML=n.tags.map(a=>`<span class="tag-badge">${a}</span>`).join(""),p.textContent=n.locked?"SOON":"PLAY NOW",k.innerHTML=`<img src="${n.hero}" class="hero-image" style="animation: fadeIn 0.4s">`}let f=0,m=!1;const v=document.getElementById("carousel-container");v.addEventListener("touchstart",e=>{f=e.touches[0].clientX,m=!0},{passive:!0});v.addEventListener("touchend",e=>{if(!m)return;const t=f-e.changedTouches[0].clientX;Math.abs(t)>30&&(t>0&&o<r.length-1?o++:t<0&&o>0&&o--,c(o)),m=!1});const u=document.getElementById("game-container"),S=document.getElementById("close-btn");let l=null;function h(){const e=r[o];if(e.locked||!e.path)return;const t=`${y}${e.path}`,s=document.createElement("iframe");s.src=t,s.sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-pointer-lock",s.allow="autoplay; fullscreen",u.appendChild(s),u.style.display="block",l=s,s.onload=()=>s.contentWindow.focus()}d.forEach((e,t)=>{e.addEventListener("click",()=>{o=t,c(o),window.innerWidth>=1024&&h()})});p.addEventListener("click",h);S.addEventListener("click",()=>{l&&(l.src="about:blank",l.remove(),l=null),u.style.display="none",window.history.pushState({},document.title,window.location.pathname)});function P(){const t=new URLSearchParams(window.location.search).get("id");if(t){const s=r.findIndex(n=>n.id.toLowerCase()===t.toLowerCase());s!==-1?(o=s,c(o),r[o].locked||h()):c(0)}else c(0)}P();window.addEventListener("resize",()=>c(o));
