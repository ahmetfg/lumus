(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))c(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&c(l)}).observe(document,{childList:!0,subtree:!0});function n(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?s.credentials="include":t.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function c(t){if(t.ep)return;t.ep=!0;const s=n(t);fetch(t.href,s)}})();const v="/lumus/";document.addEventListener("gesturestart",function(e){e.preventDefault()});document.addEventListener("dblclick",function(e){e.preventDefault()},{passive:!1});document.body.addEventListener("touchmove",function(e){e.target.closest(".carousel-track")||e.preventDefault()},{passive:!1});const i=[{id:"Survivors",title:"Pixle Knight Quest",desc:"How long can you survive against endless waves of enemies?",category:"Roguelike",tags:["Roguelike","Action"],image:"games/survival/image.png",hero:"games/survival/hero.png",path:"games/survival/index.html",locked:!1},{id:"jomp",title:"JOMP",desc:"Test your reflexes! Bounce over obstacles and reach new heights.",category:"Arcade",tags:["Arcade","Skill"],image:"games/snake/icon.png",hero:"games/snake/hero.png",path:"games/snake/index.html",locked:!1},{id:"2048",title:"2048",desc:"Merge the numbers, build your strategy, and reach the 2048 tile.",category:"Puzzle",tags:["Puzzle","Logic"],image:"games/2048/image.png",hero:"games/2048/hero.png",path:"games/2048/index.html",locked:!1},{id:"Pacman",title:"Pacman",desc:"The classic maze chase. Eat the dots and avoid the ghosts!",category:"Arcade",tags:["Arcade","Classic"],image:"games/pacman/image.png",hero:"games/pacman/hero.png",path:"games/pacman/index.html",locked:!1},{id:"6",title:"Coming Soon",desc:"New games are arriving here very soon!",tags:["Coming Soon"],image:"https://placehold.co/600x600/e5e7eb/9ca3af?text=...",hero:"https://placehold.co/1920x1080/e5e7eb/9ca3af?text=SOON",locked:!0},{id:"7",title:"Coming Soon",desc:"New games are arriving here very soon!",tags:["Coming Soon"],image:"https://placehold.co/600x600/e5e7eb/9ca3af?text=...",hero:"https://placehold.co/1920x1080/e5e7eb/9ca3af?text=SOON",locked:!0}];document.querySelector("#app").innerHTML=`
  <div class="hero-background" id="hero-bg"></div>

  <header class="app-header">
    <div class="brand-logo-background">
      <div class="brand-logo">LUMUS<span>GAMES</span></div>
    </div>
    <div class="user-avatar"><img src="https://placehold.co/100x100/ffff/fffff?text=U"></div>
  </header>

  <div id="carousel-container">
    <div class="carousel-track" id="track">
        ${i.map((e,a)=>`
            <div class="game-card ${a===0?"active":""} ${e.locked?"locked":""}">
                <img src="${e.image}">
            </div>
        `).join("")}
    </div>
  </div>

  <div class="info-section">
    <h1 class="game-title-large" id="d-title">${i[0].title}</h1>
    <div class="tags-row" id="d-tags"></div>
    <p class="game-description" id="d-desc">${i[0].desc}</p>
  </div>

  <div class="bottom-bar">
    <button class="fav-btn">★ Favorite</button>
    <button class="play-action-btn" id="play-btn">PLAY NOW</button>
  </div>

  <div id="game-container">
    <button id="close-btn">✕</button>
  </div>
`;let o=0;const y=document.getElementById("track"),g=document.querySelectorAll(".game-card"),b=document.getElementById("hero-bg"),k=document.getElementById("d-title"),w=document.getElementById("d-desc"),E=document.getElementById("d-tags");function L(){return window.innerWidth>=1024?{cardWidth:150,gap:20,activeGrowth:0}:{cardWidth:140,gap:20,activeGrowth:20}}function d(e){g.forEach(t=>t.classList.remove("active")),g[e].classList.add("active");const a=L(),n=e*(a.cardWidth+a.gap);y.style.transform=`translateX(-${n}px)`;const c=i[e];k.innerText=c.title,w.innerText=c.desc,E.innerHTML=c.tags.map(t=>`<span class="tag-badge">${t}</span>`).join(""),b.innerHTML=`<img src="${c.hero}" class="hero-image" style="animation: fadeIn 0.4s">`}d(0);window.addEventListener("resize",()=>d(o));let h=0,u=!1;const f=document.getElementById("carousel-container");f.addEventListener("touchstart",e=>{h=e.touches[0].clientX,u=!0},{passive:!0});f.addEventListener("touchend",e=>{if(!u)return;const a=h-e.changedTouches[0].clientX;Math.abs(a)>30&&(a>0&&o<i.length-1?o++:a<0&&o>0&&o--,d(o)),u=!1});const m=document.getElementById("game-container"),x=document.getElementById("close-btn"),I=document.getElementById("play-btn");let r=null;function p(){const e=i[o];if(e.locked||!e.path)return;const a=`${v}${e.path}`,n=document.createElement("iframe");n.src=a,n.sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-pointer-lock",n.allow="autoplay; fullscreen",m.appendChild(n),m.style.display="block",r=n,n.onload=()=>n.contentWindow.focus()}g.forEach((e,a)=>{e.addEventListener("click",()=>{o=a,d(o),window.innerWidth>=1024&&p()})});I.addEventListener("click",p);x.addEventListener("click",()=>{r&&(r.src="about:blank",r.remove(),r=null),m.style.display="none"});
