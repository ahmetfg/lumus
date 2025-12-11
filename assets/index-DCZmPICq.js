(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function c(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerPolicy&&(o.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?o.credentials="include":e.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(e){if(e.ep)return;e.ep=!0;const o=c(e);fetch(e.href,o)}})();document.querySelector("#app").innerHTML=`
  <div id="main-menu">
    <h1>ARCADE ZONE (Vite)</h1>
    <div class="game-grid">
      <!-- DİKKAT: public klasörünü yazmıyoruz, direkt kökten başlıyoruz -->
      <button class="game-btn" data-url="/games/snake/index.html">
        🐍 Yılan Oyunu
      </button>
    </div>
  </div>

  <div id="game-container">
    <button id="close-btn">ÇIKIŞ</button>
  </div>
`;const i=document.getElementById("game-container"),a=document.getElementById("close-btn"),d=document.querySelectorAll(".game-btn");let r=null;const u=n=>{const t=document.createElement("iframe");t.src=n,t.sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-pointer-lock",t.allow="autoplay; fullscreen",i.appendChild(t),i.style.display="block",r=t,t.onload=()=>t.contentWindow.focus()},m=()=>{r&&(r.remove(),r=null),i.style.display="none"};d.forEach(n=>{n.addEventListener("click",()=>u(n.dataset.url))});a.addEventListener("click",m);
