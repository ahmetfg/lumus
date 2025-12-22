(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const d of o.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&i(d)}).observe(document,{childList:!0,subtree:!0});function s(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(t){if(t.ep)return;t.ep=!0;const o=s(t);fetch(t.href,o)}})();const y="/";document.addEventListener("gesturestart",function(e){e.preventDefault()});document.addEventListener("dblclick",function(e){e.preventDefault()},{passive:!1});document.body.addEventListener("touchmove",function(e){e.target.closest(".carousel-track")||e.preventDefault()},{passive:!1});const r=[{id:"Survivors",title:"Pixle Knight Quest",desc:"How long can you survive against endless waves of enemies?",category:"Roguelike",tags:["Roguelike","Action"],image:"games/survival/image.png",hero:"games/survival/hero.png",path:"games/survival/index.html",locked:!1},{id:"jomp",title:"JOMP",desc:"Test your reflexes! Bounce over obstacles and reach new heights.",category:"Arcade",tags:["Arcade","Skill"],image:"games/snake/icon.png",hero:"games/snake/hero.png",path:"games/snake/index.html",locked:!1},{id:"2048",title:"2048",desc:"Merge the numbers, build your strategy, and reach the 2048 tile.",category:"Puzzle",tags:["Puzzle","Logic"],image:"games/2048/image.png",hero:"games/2048/hero.png",path:"games/2048/index.html",locked:!1},{id:"Pacman",title:"Pacman",desc:"The classic maze chase. Eat the dots and avoid the ghosts!",category:"Arcade",tags:["Arcade","Classic"],image:"games/pacman/image.png",hero:"games/pacman/hero.png",path:"games/pacman/index.html",locked:!1},{id:"Market",title:"Market Simulator",desc:"Let's serve! Build your market now!",category:"Simulator",tags:["Simulator","Pixelart"],image:"games/market/image.jpeg",hero:"",path:"games/market/index.html",locked:!1},{id:"Fruits",title:"Fruits",desc:"The classic maze chase. Eat the dots and avoid the ghosts!",category:"Arcade",tags:["Arcade","Classic"],image:"games/fruits/image.jpeg",hero:"games/fruits/hero.jpeg",path:"games/fruits/index.html",locked:!1},{id:"last protocol",title:"Last Protocol",desc:"Humanity's last chance is a robot...",tags:["Coming Soon"],image:"games/lastProtocol/image.webp",hero:"games/lastProtocol/hero.jpeg",locked:!0},{id:"6",title:"Coming Soon",desc:"New games are arriving here very soon!",tags:["Coming Soon"],image:"https://placehold.co/600x600/e5e7eb/9ca3af?text=...",hero:"https://placehold.co/1920x1080/e5e7eb/9ca3af?text=SOON",locked:!0},{id:"7",title:"Coming Soon",desc:"New games are arriving here very soon!",tags:["Coming Soon"],image:"https://placehold.co/600x600/e5e7eb/9ca3af?text=...",hero:"https://placehold.co/1920x1080/e5e7eb/9ca3af?text=SOON",locked:!0}];document.querySelector("#app").innerHTML=`
  <div class="hero-background" id="hero-bg"></div>

  <header class="app-header">
    <div class="brand-logo-background">
      <div class="brand-logo">LUMUS<span>GAMES</span></div>
    </div>
    <div class="user-avatar"><img src="https://placehold.co/100x100/ffff/fffff?text=U"></div>
  </header>

  <div id="carousel-container">
    <div class="carousel-track" id="track">
        ${r.map((e,a)=>`
            <div class="game-card ${a===0?"active":""} ${e.locked?"locked":""}">
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
`;let n=0;const b=document.getElementById("track"),g=document.querySelectorAll(".game-card"),k=document.getElementById("hero-bg"),w=document.getElementById("d-title"),E=document.getElementById("d-desc"),L=document.getElementById("d-tags"),h=document.getElementById("play-btn");function x(){return window.innerWidth>=1024?{cardWidth:150,gap:20,activeGrowth:0}:{cardWidth:140,gap:20,activeGrowth:20}}function l(e){g.forEach(t=>t.classList.remove("active")),g[e].classList.add("active");const a=x(),s=e*(a.cardWidth+a.gap);b.style.transform=`translateX(-${s}px)`;const i=r[e];w.innerText=i.title,E.innerText=i.desc,L.innerHTML=i.tags.map(t=>`<span class="tag-badge">${t}</span>`).join(""),h.textContent=i.locked?"SOON":"PLAY NOW",k.innerHTML=`<img src="${i.hero}" class="hero-image" style="animation: fadeIn 0.4s">`}l(0);window.addEventListener("resize",()=>l(n));let p=0,m=!1;const f=document.getElementById("carousel-container");f.addEventListener("touchstart",e=>{p=e.touches[0].clientX,m=!0},{passive:!0});f.addEventListener("touchend",e=>{if(!m)return;const a=p-e.changedTouches[0].clientX;Math.abs(a)>30&&(a>0&&n<r.length-1?n++:a<0&&n>0&&n--,l(n)),m=!1});const u=document.getElementById("game-container"),S=document.getElementById("close-btn");let c=null;function v(){const e=r[n];if(e.locked||!e.path)return;const a=`${y}${e.path}`,s=document.createElement("iframe");s.src=a,s.sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-pointer-lock",s.allow="autoplay; fullscreen",u.appendChild(s),u.style.display="block",c=s,s.onload=()=>s.contentWindow.focus()}g.forEach((e,a)=>{e.addEventListener("click",()=>{n=a,l(n),window.innerWidth>=1024&&v()})});h.addEventListener("click",v);S.addEventListener("click",()=>{c&&(c.src="about:blank",c.remove(),c=null),u.style.display="none"});
