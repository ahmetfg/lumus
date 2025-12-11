import './style.css'

// HTML Şablonunu JS ile basıyoruz (Daha temiz)
document.querySelector('#app').innerHTML = `
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
`

// Değişkenler
const container = document.getElementById('game-container');
const closeBtn = document.getElementById('close-btn');
const gameButtons = document.querySelectorAll('.game-btn');
let activeIframe = null;

// Oyun Açma Fonksiyonu
const openGame = (url) => {
  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.sandbox = "allow-scripts allow-same-origin allow-popups allow-forms allow-pointer-lock";
  iframe.allow = "autoplay; fullscreen";
  
  container.appendChild(iframe);
  container.style.display = 'block';
  activeIframe = iframe;

  iframe.onload = () => iframe.contentWindow.focus();
}

// Oyun Kapatma Fonksiyonu
const closeGame = () => {
  if (activeIframe) {
    activeIframe.remove();
    activeIframe = null;
  }
  container.style.display = 'none';
}

// Event Listener'lar
gameButtons.forEach(btn => {
  btn.addEventListener('click', () => openGame(btn.dataset.url));
});

closeBtn.addEventListener('click', closeGame);