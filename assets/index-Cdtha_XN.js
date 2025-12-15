(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const d of n.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&s(d)}).observe(document,{childList:!0,subtree:!0});function o(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerPolicy&&(n.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?n.credentials="include":t.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(t){if(t.ep)return;t.ep=!0;const n=o(t);fetch(t.href,n)}})();const v="/lumus/";document.addEventListener("gesturestart",function(e){e.preventDefault()});document.addEventListener("dblclick",function(e){e.preventDefault()},{passive:!1});document.body.addEventListener("touchmove",function(e){e.target.closest(".carousel-track")||e.preventDefault()},{passive:!1});const i=[{id:"Survivors",title:"Pixle Knight Quest",desc:"How long can you survive against endless waves of enemies?",category:"Roguelike",tags:["Roguelike","Action"],image:"games/survival/image.png",hero:"games/survival/hero.png",path:"games/survival/index.html",locked:!1},{id:"jomp",title:"JOMP",desc:"Test your reflexes! Bounce over obstacles and reach new heights.",category:"Arcade",tags:["Arcade","Skill"],image:"games/snake/icon.png",hero:"games/snake/hero.png",path:"games/snake/index.html",locked:!1},{id:"2048",title:"2048",desc:"Merge the numbers, build your strategy, and reach the 2048 tile.",category:"Puzzle",tags:["Puzzle","Logic"],image:"games/2048/image.png",hero:"games/2048/hero.png",path:"games/2048/index.html",locked:!1},{id:"Pacman",title:"Pacman",desc:"The classic maze chase. Eat the dots and avoid the ghosts!",category:"Arcade",tags:["Arcade","Classic"],image:"games/pacman/image.png",hero:"games/pacman/hero.png",path:"games/pacman/index.html",locked:!1},{id:"last protocol",title:"Last Protocol",desc:"New games are arriving here very soon!",tags:["Coming Soon"],image:"games/lastProtocol/image.webp",hero:"games/lastProtocol/hero.jpeg",locked:!0},{id:"6",title:"Coming Soon",desc:"New games are arriving here very soon!",tags:["Coming Soon"],image:"https://placehold.co/600x600/e5e7eb/9ca3af?text=...",hero:"https://placehold.co/1920x1080/e5e7eb/9ca3af?text=SOON",locked:!0},{id:"7",title:"Coming Soon",desc:"New games are arriving here very soon!",tags:["Coming Soon"],image:"https://placehold.co/600x600/e5e7eb/9ca3af?text=...",hero:"https://placehold.co/1920x1080/e5e7eb/9ca3af?text=SOON",locked:!0}];document.querySelector("#app").innerHTML=`
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
    <div class="play-action-btn-bg" id="play-btn-bg"> <button class="play-action-btn ${i[0].locked?"soon":""}"  id="play-btn">PLAY NOW</button> </div>
  </div>

  <div id="game-container">
    <button id="close-btn">✕</button>
  </div>
`;let c=0;const b=document.getElementById("track"),g=document.querySelectorAll(".game-card"),y=document.getElementById("hero-bg"),k=document.getElementById("d-title"),w=document.getElementById("d-desc"),E=document.getElementById("d-tags"),L=document.getElementById("play-btn-bg");function x(){return window.innerWidth>=1024?{cardWidth:150,gap:20,activeGrowth:0}:{cardWidth:140,gap:20,activeGrowth:20}}function l(e){g.forEach(t=>t.classList.remove("active")),g[e].classList.add("active");const a=x(),o=e*(a.cardWidth+a.gap);b.style.transform=`translateX(-${o}px)`;const s=i[e];k.innerText=s.title,w.innerText=s.desc,E.innerHTML=s.tags.map(t=>`<span class="tag-badge">${t}</span>`).join(""),L.innerHTML=`<button class="play-action-btn ${s.locked?"soon":""}"  id="play-btn">${s.locked?"SOON":"PLAY NOW"}</button>`,y.innerHTML=`<img src="${s.hero}" class="hero-image" style="animation: fadeIn 0.4s">`}l(0);window.addEventListener("resize",()=>l(c));let p=0,m=!1;const h=document.getElementById("carousel-container");h.addEventListener("touchstart",e=>{p=e.touches[0].clientX,m=!0},{passive:!0});h.addEventListener("touchend",e=>{if(!m)return;const a=p-e.changedTouches[0].clientX;Math.abs(a)>30&&(a>0&&c<i.length-1?c++:a<0&&c>0&&c--,l(c)),m=!1});const u=document.getElementById("game-container"),P=document.getElementById("close-btn"),B=document.getElementById("play-btn");let r=null;function f(){const e=i[c];if(e.locked||!e.path)return;const a=`${v}${e.path}`,o=document.createElement("iframe");o.src=a,o.sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-pointer-lock",o.allow="autoplay; fullscreen",u.appendChild(o),u.style.display="block",r=o,o.onload=()=>o.contentWindow.focus()}g.forEach((e,a)=>{e.addEventListener("click",()=>{c=a,l(c),window.innerWidth>=1024&&f()})});B.addEventListener("click",f);P.addEventListener("click",()=>{r&&(r.src="about:blank",r.remove(),r=null),u.style.display="none"});
