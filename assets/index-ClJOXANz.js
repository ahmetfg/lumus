(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const a of t.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function s(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function i(e){if(e.ep)return;e.ep=!0;const t=s(e);fetch(e.href,t)}})();const c="/lumus/";document.querySelector("#app").innerHTML=`
  <div id="main-menu">
    <h1>ARCADE ZONE</h1>
    <div class="game-grid">
      
      <!-- OYUN 1: SNAKE -->
      <div class="game-card" data-url="games/snake/index.html">
        <span class="icon">👾</span>
        <span class="title">JOMP</span>
      </div>
      
      <!-- OYUN 2: 2048 -->
      <div class="game-card" data-url="games/2048/index.html">
        <span class="icon">♦️</span>
        <span class="title">2048</span>
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
`;const r=document.getElementById("game-container"),d=document.getElementById("close-btn"),u=document.querySelectorAll(".game-card");let l=null;const m=n=>{if(!n)return;const o=`${c}${n}`,s=document.createElement("iframe");s.src=o,s.sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-pointer-lock",s.allow="autoplay; fullscreen; clipboard-write",r.appendChild(s),r.style.display="block",l=s,s.onload=()=>s.contentWindow.focus()},p=()=>{l&&(l.src="about:blank",l.remove(),l=null),r.style.display="none"};u.forEach(n=>{n.addEventListener("click",()=>{n.classList.contains("locked")||m(n.dataset.url)})});d.addEventListener("click",p);
