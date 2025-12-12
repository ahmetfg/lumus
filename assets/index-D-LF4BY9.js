(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))c(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const l of t.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&c(l)}).observe(document,{childList:!0,subtree:!0});function o(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function c(e){if(e.ep)return;e.ep=!0;const t=o(e);fetch(e.href,t)}})();const a="/lumus/";document.querySelector("#app").innerHTML=`
  <div id="main-menu">
    <h1>ARCADE ZONE</h1>
    <div class="game-grid">
      
      <!-- OYUN 1: SNAKE -->
      <div class="game-card" data-url="games/snake/index.html">
        <span class="icon">🐍</span>
        <span class="title">NEON SNAKE</span>
      </div>

      <!-- OYUN 2: SPACE (Gelecek Oyun) -->
      <div class="game-card locked">
        <span class="icon">🔒</span>
        <span class="title">COMING SOON</span>
      </div>

    </div>
  </div>

  <div id="game-container">
    <!-- Kapatma butonu sembol olduğu için çeviriye gerek yok -->
    <button id="close-btn">✕</button>
  </div>
`;const i=document.getElementById("game-container"),d=document.getElementById("close-btn"),u=document.querySelectorAll(".game-card");let r=null;const m=n=>{if(!n)return;const s=`${a}${n}`,o=document.createElement("iframe");o.src=s,o.sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-pointer-lock",o.allow="autoplay; fullscreen; clipboard-write",i.appendChild(o),i.style.display="block",r=o,o.onload=()=>o.contentWindow.focus()},p=()=>{r&&(r.src="about:blank",r.remove(),r=null),i.style.display="none"};u.forEach(n=>{n.addEventListener("click",()=>{n.classList.contains("locked")||m(n.dataset.url)})});d.addEventListener("click",p);
