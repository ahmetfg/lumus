(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))c(e);new MutationObserver(e=>{for(const s of e)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&c(i)}).observe(document,{childList:!0,subtree:!0});function a(e){const s={};return e.integrity&&(s.integrity=e.integrity),e.referrerPolicy&&(s.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?s.credentials="include":e.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function c(e){if(e.ep)return;e.ep=!0;const s=a(e);fetch(e.href,s)}})();const r="/lumus/";document.querySelector("#app").innerHTML=`
  <div id="main-menu">
    <h1>ARCADE ZONE</h1>
    <div class="game-grid">
      
      <div class="game-card" data-url="games/snake/index.html">
        <span class="icon">👾</span>
        <span class="title">JOMP</span>
      </div>
      
      <div class="game-card" data-url="games/2048/index.html">
        <span class="icon">♦️</span>
        <span class="title">2048</span>
      </div>
      
      <div class="game-card" data-url="games/survival/index.html">
        <span class="icon">🧛🏻‍♂️</span>
        <span class="title">survivors</span>
      </div>
      
      <div class="game-card" data-url="games/pacman/index.html">
        <span class="icon">ᗧ···</span>
        <span class="title">pacman</span>
      </div>
      
      <div class="game-card" data-url="games/ninja/index.html">
        <span class="icon">🥷🏿</span>
        <span class="title">ninja</span>
      </div>

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
`;const o=document.getElementById("game-container"),d=document.getElementById("close-btn"),u=document.querySelectorAll(".game-card");let l=null;const p=n=>{if(!n)return;const t=`${r}${n}`,a=document.createElement("iframe");a.src=t,a.sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-pointer-lock",a.allow="autoplay; fullscreen; clipboard-write",o.appendChild(a),o.style.display="block",l=a,a.onload=()=>a.contentWindow.focus()},m=()=>{l&&(l.src="about:blank",l.remove(),l=null),o.style.display="none"};u.forEach(n=>{n.addEventListener("click",()=>{n.classList.contains("locked")||p(n.dataset.url)})});d.addEventListener("click",m);
