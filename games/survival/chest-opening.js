/**
 * Chest Opening System
 * Handles the Treasure Chest object and the opening interface sequence.
 */

// Current chest state
let currentChestRarity = 1;
let chestTapCount = 0;

// Sprite Sheet Configuration
const CHEST_SPRITE = {
    img: null,
    loaded: false,
    frameWidth: 194, // 2910 / 15
    frameHeight: 191,
    totalFrames: 15,
    tapFrames: [0, 1, 2], // Frames for each tap (0=initial, 1=tap1, 2=tap2)
    openFrames: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] // Frames for opening animation
};

// Load sprite sheet
(function loadChestSprite() {
    CHEST_SPRITE.img = new Image();
    CHEST_SPRITE.img.onload = () => {
        CHEST_SPRITE.loaded = true;
        console.log('Chest sprite sheet loaded');
    };
    CHEST_SPRITE.img.onerror = () => {
        console.warn('Chest sprite sheet failed to load, using fallback');
    };
    CHEST_SPRITE.img.src = 'chestOpenSheet.webp';
})();

class Chest {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 15;
        this.color = '#ffd700';
        this.bobOffset = Math.random() * Math.PI * 2;
    }

    update() {
        // Accesses global player, GAME_CONFIG, gameState
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distSq = dx * dx + dy * dy;
        const pickupSq = GAME_CONFIG.pickupRadius * GAME_CONFIG.pickupRadius;

        if (distSq < pickupSq) {
            gameState.paused = true; // Pause Game
            startChestSequence(); // Trigger Event
            return true; // Remove from list
        }
        return false;
    }

    draw() {
        // Accesses global camera, CANVAS, gameState, CTX
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        if (screenX < -50 || screenX > CANVAS.width + 50 ||
            screenY < -50 || screenY > CANVAS.height + 50) return;

        const bobY = Math.sin((gameState.frames / 20) + this.bobOffset) * 5;

        CTX.save();
        CTX.translate(screenX, screenY + bobY);
        CTX.shadowColor = '#ffd700';
        CTX.shadowBlur = 20;

        // Use sprite sheet frame 0 if loaded, fallback to emoji
        if (CHEST_SPRITE.loaded && CHEST_SPRITE.img) {
            const { img, frameWidth, frameHeight } = CHEST_SPRITE;
            const drawSize = 40; // Display size
            CTX.drawImage(
                img,
                0, 0, // Frame 0
                frameWidth, frameHeight,
                -drawSize / 2, -drawSize / 2,
                drawSize, drawSize
            );
        } else {
            CTX.font = "24px Arial";
            CTX.textAlign = "center";
            CTX.textBaseline = "middle";
            CTX.fillText("🎁", 0, 0);
        }

        CTX.restore();
    }
}

// Draw a specific frame from the sprite sheet onto the canvas
function drawChestFrame(frameIndex) {
    const canvas = document.getElementById('chest-canvas');
    if (!canvas || !CHEST_SPRITE.loaded) return;

    const ctx = canvas.getContext('2d');
    const { img, frameWidth, frameHeight } = CHEST_SPRITE;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
        img,
        frameIndex * frameWidth, 0, // Source position
        frameWidth, frameHeight, // Source size
        0, 0, // Destination position
        canvas.width, canvas.height // Destination size
    );
}

function startChestSequence() {
    const modal = document.getElementById('chest-screen');
    if (!modal) {
        initChestUI();
        return startChestSequence();
    }
    modal.classList.remove('hidden');

    // Reset UI state
    chestTapCount = 0;
    const chestDisplay = document.getElementById('chest-display');
    chestDisplay.style.display = 'block';
    chestDisplay.style.transform = 'scale(1)';
    // Reset idle classes and start with idle-1
    chestDisplay.classList.remove('chest-idle-1', 'chest-idle-2', 'chest-idle-3');
    chestDisplay.classList.add('chest-idle-1');

    // Draw initial frame (frame 0)
    drawChestFrame(0);

    document.getElementById('chest-rewards').innerHTML = '';
    document.getElementById('chest-rewards').classList.add('hidden');
    document.getElementById('chest-hint').innerText = "TAP TO OPEN";
    document.getElementById('chest-close-btn').classList.add('hidden');

    const feedbackText = document.getElementById('chest-feedback-text');
    if (feedbackText) {
        feedbackText.innerText = "TAP NOW!";
        feedbackText.className = "vibrate-1";
    }

    // Generate Beams based on rarity (determined now for visual)
    generateChestBeams();
}

function openChest() {
    const chest = document.getElementById('chest-display');
    const modalContent = document.querySelector('#chest-screen .modal-content');
    const feedbackText = document.getElementById('chest-feedback-text');

    chestTapCount++;

    // Visual feedback on each tap
    const baseScale = 1;
    const addedScale = chestTapCount * 0.15; // Incremental growth
    const finalScale = baseScale + addedScale;
    const randomRotation = (Math.random() * 10 - 5); // Slight random tilt

    // 0. Update sprite frame based on tap count
    if (chestTapCount <= 3) {
        drawChestFrame(CHEST_SPRITE.tapFrames[chestTapCount - 1] + 1); // tapFrames[0]=0, so tap1=frame1, tap2=frame2, tap3=frame3
    }

    // 0.5 Update idle vibration intensity
    chest.classList.remove('chest-idle-1', 'chest-idle-2', 'chest-idle-3');
    if (chestTapCount === 1) chest.classList.add('chest-idle-2');
    else if (chestTapCount >= 2) chest.classList.add('chest-idle-3');

    // 1. Shake Chest (Outer Wrapper)
    chest.style.transform = `rotate(${randomRotation + 10}deg) scale(${finalScale})`;
    setTimeout(() => chest.style.transform = `rotate(${randomRotation - 10}deg) scale(${finalScale})`, 50);
    setTimeout(() => chest.style.transform = `rotate(${randomRotation}deg) scale(${finalScale})`, 100);

    // 2. Dynamic Feedback Text & Vibration
    if (feedbackText) {
        if (chestTapCount === 1) {
            feedbackText.innerText = "ALMOST THERE!";
            feedbackText.className = "vibrate-2";
        } else if (chestTapCount === 2) {
            feedbackText.innerText = "UNLEASH THE POWER!!!";
            feedbackText.className = "vibrate-3";
        } else {
            feedbackText.innerText = "";
        }
    }

    // 3. Screen Shake on Modal Content only (not full screen)
    const shakeClass = (chestTapCount < 3) ? 'screen-shake-light' : 'screen-shake-heavy';
    modalContent.classList.remove('screen-shake-light', 'screen-shake-heavy');
    void modalContent.offsetWidth; // Trigger reflow
    modalContent.classList.add(shakeClass);

    // Proceed only after 3 taps
    if (chestTapCount < 3) return;

    // 4. Achievement Feedback (Confetti Burst)
    if (typeof spawnConfetti === 'function') {
        spawnConfetti();
    }

    // 5. Play opening animation (frames 3-14)
    playChestOpenAnimation(() => {
        // OPEN!
        chest.style.display = 'none';

        // EXPLOSION SHAKE - Shake only the modal content on opening
        modalContent.classList.remove('screen-shake-light', 'screen-shake-heavy');
        void modalContent.offsetWidth; // Force reflow to restart animation
        modalContent.classList.add('screen-shake-heavy');

        // Trigger Ring Burst
        triggerRingBurst();

        // Show Rewards
        document.getElementById('chest-hint').innerText = "";
        showChestRewards();
    });
}

// Play the opening animation using frames 3-14
function playChestOpenAnimation(callback) {
    const frames = CHEST_SPRITE.openFrames;
    let currentFrameIndex = 0;
    const frameDelay = 20; // ms per frame

    function animate() {
        if (currentFrameIndex >= frames.length) {
            callback();
            return;
        }

        drawChestFrame(frames[currentFrameIndex]);
        currentFrameIndex++;
        setTimeout(animate, frameDelay);
    }

    animate();
}

function showChestRewards() {
    const container = document.getElementById('chest-rewards');
    container.classList.remove('hidden');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '10px';
    container.style.alignItems = 'center';

    // Use pre-determined rarity from rays
    const count = currentChestRarity;

    // Rarity Label
    let rarityLabel = 'COMMON';
    let rarityColor = '#aaa';
    if (count === 3) { rarityLabel = 'RARE'; rarityColor = '#9966ff'; }
    if (count === 5) { rarityLabel = 'LEGENDARY'; rarityColor = '#ff00ff'; }

    let html = `<h2 style="color: ${rarityColor}; text-shadow: 0 0 15px ${rarityColor};">${rarityLabel} CHEST x${count}!</h2>`;

    const rewards = [
        { type: 'gold', val: 100, text: '100 GOLD', icon: '💰' },
        { type: 'food', val: 50, text: 'CHICKEN (50 HP)', icon: '🍗' },
        { type: 'xp', val: 200, text: 'BIG XP BOOK', icon: '📘' }
    ];

    for (let i = 0; i < count; i++) {
        const r = rewards[Math.floor(Math.random() * rewards.length)];
        applyChestReward(r);
        html += `
            <div style="background: rgba(255,255,255,0.1); padding: 10px; border: 2px solid ${rarityColor}; border-radius: 8px; width: 100%; animation: popIn 0.3s ease-out ${i * 0.1}s both;">
                <span style="font-size: 20px;">${r.icon}</span> 
                <span style="color: white; font-size: 14px;">${r.text}</span>
            </div>
         `;
    }

    container.innerHTML = html;
    document.getElementById('chest-close-btn').classList.remove('hidden');
}

function applyChestReward(reward) {
    if (reward.type === 'gold') {
        gameState.sessionGold += reward.val;
    } else if (reward.type === 'food') {
        player.hp = Math.min(player.hp + reward.val, player.maxHp);
    } else if (reward.type === 'xp') {
        player.gainXp(reward.val);
    }
}

function closeChestModal() {
    document.getElementById('chest-screen').classList.add('hidden');
    document.getElementById('chest-beams').innerHTML = ''; // Clear beams
    document.getElementById('chest-ring').style.animation = ''; // Reset ring

    // updateHUD is crucial to reflect changes
    updateHUD();

    // Fix: Do not unpause if another blocking modal (like Level Up) is open
    const isLevelUpOpen = !document.getElementById('levelup-screen').classList.contains('hidden');
    if (!isLevelUpOpen) {
        gameState.paused = false;
    }
}

function generateChestBeams() {
    const container = document.getElementById('chest-beams');
    container.innerHTML = '';

    // Determine rarity for this chest
    const rng = Math.random();
    if (rng > 0.9) currentChestRarity = 5; // Legendary
    else if (rng > 0.6) currentChestRarity = 3; // Rare
    else currentChestRarity = 1; // Common

    // Beam count and colors based on rarity
    let beamCount, colors;
    if (currentChestRarity === 5) {
        beamCount = 5;
        colors = ['#ff00ff', '#ffff00', '#00ffff', '#ff6600', '#ff0066'];
    } else if (currentChestRarity === 3) {
        beamCount = 3;
        colors = ['#6666ff', '#9966ff', '#cc66ff'];
    } else {
        beamCount = 2;
        colors = ['#888888', '#aaaaaa'];
    }

    // Beam angles spread: from -40 to +40 degrees
    const angleSpread = 80;
    const startAngle = -angleSpread / 2;

    for (let i = 0; i < beamCount; i++) {
        const beam = document.createElement('div');
        beam.className = 'chest-beam';
        const angle = startAngle + (angleSpread / (beamCount - 1 || 1)) * i;
        const color = colors[i % colors.length];
        beam.style.background = `linear-gradient(to top, ${color}, ${color}88, transparent)`;
        beam.style.transform = `translateX(-50%) rotate(${angle}deg)`;
        beam.style.animation = `beamShoot 0.8s ease-out ${i * 0.1}s forwards`;
        container.appendChild(beam);
    }
}

function triggerRingBurst() {
    const ring = document.getElementById('chest-ring');

    // Set color based on rarity
    let color = 'rgba(150,150,150,0.6)';
    if (currentChestRarity === 3) color = 'rgba(100,100,255,0.6)';
    if (currentChestRarity === 5) color = 'rgba(255,0,255,0.8)';

    ring.style.background = `radial-gradient(ellipse, ${color}, transparent 70%)`;
    ring.style.animation = 'ringBurst 0.6s ease-out forwards';
}

// Function to initialize the UI if it doesn't exist
function initChestUI() {
    if (document.getElementById('chest-screen')) return;

    const chestHTML = `
    <div id="chest-screen" class="modal hidden" style="background: rgba(0,0,0,0.95);">
        <div class="modal-content">
            <!-- Beam Effects Container -->
            <div id="chest-beams"></div>

            <!-- Ring Burst Effect -->
            <div id="chest-ring"></div>

            <h1 class="blink" style="color: #ffd700; text-shadow: 0 0 20px #ff6b6b; position: relative; z-index: 1;">
                TREASURE!</h1>

            <!-- Feedback Text -->
            <div id="chest-feedback-text" class="vibrate-1">TAP NOW!</div>

            <div id="chest-display"
                style="cursor: pointer; margin: 20px; transition: transform 0.1s; position: relative; z-index: 1;"
                onclick="openChest()">
                <canvas id="chest-canvas" width="194" height="191" style="width: 150px; height: auto;"></canvas>
            </div>

            <div id="chest-rewards" class="hidden" style="position: relative; z-index: 1;">
                <!-- Rewards injected here -->
            </div>

            <p id="chest-hint" style="font-size: 10px; color: #aaa; position: relative; z-index: 1;">TAP TO OPEN</p>

            <button id="chest-close-btn" class="retro-btn hidden" onclick="closeChestModal()"
                style="position: relative; z-index: 1;">CONTINUE</button>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', chestHTML);
}

// Automatically init the UI
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChestUI);
} else {
    initChestUI();
}
