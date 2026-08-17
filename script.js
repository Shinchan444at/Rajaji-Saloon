// 1. ADD YOUR DOWNLOADED SONGS HERE
const songs = [
    { title: "Mera chand mujhe aaya hai nazar", src: "songs/mera-chand-mujhe-aaya-hai-nazar.mp3" },
    { title: "Kisi din banoongi main raja ki raani", src: "songs/kisi-din-banoongi-main-raja.mp3" },
    { title: "Aksar is duniya mein", src: "songs/aksar-is-duniya-mein.mp3" },
    { title: "Phool maangu na bahaar maangu", src: "songs/phool-maangu-na-bahaar-maangu.mp3" },
    { title: "Sochenge tumhe pyaar", src: "songs/sochenge-tumhe-pyar.mp3" },
    { title: "Kahin door jab din dhal jaaye", src: "songs/kahin-door-jab-din-dhal-jaye.mp3" },
    { title: "Sheesha ho ya dil ho", src: "songs/sheesha-ho-ya-dil-ho.mp3" },
    { title: "Jeeta tha jiske liye", src: "songs/jeeta-tha-jiske-liye.mp3" },
    { title: "Is tarah aashiqui ka", src: "songs/is-tarah-aashiqui-ka.mp3" },
    { title: "Dekhne waalon ne", src: "songs/dekhne-waalon-ne.mp3" },
    { title: "Bas ek sanam chahiye aashiqui ke liye", src: "songs/bas-ek-sanam-chahiye-aashiqui-ke-liye.mp3" },
    { title: "Aye mere humsafar", src: "songs/aye-mere-humsafar.mp3" },
    { title: "Aaye ho meri zindagi mein", src: "songs/aaye-ho-meri-zindagi-mein.mp3" },
    { title: "Aankh hai bhari bhari", src: "songs/aankh-hai-bhari-bhari.mp3" },
    { title: "Tune zindagi mein", src: "songs/tune-zindagi-mein.mp3" },
    { title: "Tumhein dekhe meri", src: "songs/tumhein-dekhe-meri.mp3" },
    { title: "Tumhe apna bnane ki kasam", src: "songs/tumhe-apna-banane-ki-kasam.mp3" },
    { title: "Tum dil ki dhadkan mein", src: "songs/tum-dil-ki-dhadkan-mein.mp3" },
    { title: "Tujhe na dekhu toh chain", src: "songs/tujhe-na-dekhu-toh-chain.mp3" },
    { title: "Kisi se tum pyar karo", src: "songs/kisi-se-tum-pyar-karo.mp3" }
];


// DOM Element Selections
const audio = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const seekBar = document.getElementById('seek-bar');
const volumeBar = document.getElementById('volume-bar');
const muteBtn = document.getElementById('mute-btn');
const songTitle = document.getElementById('song-title');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const blackoutBtn = document.getElementById('blackout-btn');
const blackoutScreen = document.getElementById('blackout-screen');
const musicBar = document.querySelector('.music-bar');
const clockHoursEl = document.getElementById('clock-hours');
const clockMinutesEl = document.getElementById('clock-minutes');

let currentSongIndex = 0;
let isPlaying = false;

// --- Backspace Key Shortcut (Play / Pause even on cold start) ---
window.addEventListener('keydown', (e) => {
    // Standard Backspace check across different platforms & browsers
    if (e.key === 'Backspace' || e.keyCode === 8) {
        e.preventDefault(); // Prevent browser back navigation
        
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    }
});

// --- Real-time Digital Clock (12-Hour Format) ---
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    
    hours = hours % 12;
    hours = hours ? hours : 12; // Converts 0 to 12
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    
    if (clockHoursEl && clockMinutesEl) {
        clockHoursEl.textContent = hours;
        clockMinutesEl.textContent = formattedMinutes;
    }
}
setInterval(updateClock, 1000);
updateClock();

// --- Dynamic Motion & Spring-Back Effect ---
let barOffsetY = 0;
let scrollTimeout = null;
let isDraggingBar = false;
let startY = 0;

// Mouse Wheel Motion
window.addEventListener('wheel', (e) => {
    barOffsetY -= e.deltaY * 0.4;
    
    // Clamp movement so bar stays within visible range
    barOffsetY = Math.max(-220, Math.min(220, barOffsetY));
    
    musicBar.style.transition = 'none';
    musicBar.style.transform = `translate(-50%, calc(-50% + ${barOffsetY}px))`;
    
    clearTimeout(scrollTimeout);
    
    scrollTimeout = setTimeout(() => {
        returnToOriginalPosition();
    }, 120);
}, { passive: true });

// Mouse Drag Motion
musicBar.addEventListener('mousedown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
    isDraggingBar = true;
    startY = e.clientY - barOffsetY;
    musicBar.style.transition = 'none';
});

window.addEventListener('mousemove', (e) => {
    if (!isDraggingBar) return;
    barOffsetY = e.clientY - startY;
    musicBar.style.transform = `translate(-50%, calc(-50% + ${barOffsetY}px))`;
});

window.addEventListener('mouseup', () => {
    if (isDraggingBar) {
        isDraggingBar = false;
        returnToOriginalPosition();
    }
});

// Touch Drag Motion
musicBar.addEventListener('touchstart', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
    isDraggingBar = true;
    startY = e.touches[0].clientY - barOffsetY;
    musicBar.style.transition = 'none';
}, { passive: true });

window.addEventListener('touchmove', (e) => {
    if (!isDraggingBar) return;
    barOffsetY = e.touches[0].clientY - startY;
    musicBar.style.transform = `translate(-50%, calc(-50% + ${barOffsetY}px))`;
}, { passive: true });

window.addEventListener('touchend', () => {
    if (isDraggingBar) {
        isDraggingBar = false;
        returnToOriginalPosition();
    }
});

// Smoothly spring back to 75vh center
function returnToOriginalPosition() {
    musicBar.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    barOffsetY = 0;
    musicBar.style.transform = 'translate(-50%, -50%)';
}

// --- Player Logic ---
function loadSong(index) {
    currentSongIndex = index;
    audio.src = songs[currentSongIndex].src;
    songTitle.textContent = songs[currentSongIndex].title;
    audio.load(); // Force reload audio context for initial play
}

function playSong() {
    if (!audio.src || audio.src === "") {
        loadSong(0);
    }
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            isPlaying = true;
            playBtn.textContent = '⏸';
        }).catch(err => {
            console.warn("Autoplay / Initial playback policy restriction:", err);
            isPlaying = false;
            playBtn.textContent = '▶';
        });
    }
}

function pauseSong() {
    isPlaying = false;
    audio.pause();
    playBtn.textContent = '▶';
}

playBtn.addEventListener('click', () => {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

prevBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    playSong();
});

nextBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    playSong();
});

audio.addEventListener('ended', () => {
    nextBtn.click();
});

audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        seekBar.value = progress;
        currentTimeEl.textContent = formatTime(audio.currentTime);
        durationEl.textContent = formatTime(audio.duration);
    }
});

seekBar.addEventListener('input', () => {
    if (audio.duration) {
        audio.currentTime = (seekBar.value / 100) * audio.duration;
    }
});

volumeBar.addEventListener('input', (e) => {
    audio.volume = e.target.value / 100;
    muteBtn.textContent = audio.volume === 0 ? '🔇' : '🔊';
});

muteBtn.addEventListener('click', () => {
    if (audio.volume > 0) {
        audio.dataset.prevVolume = audio.volume;
        audio.volume = 0;
        volumeBar.value = 0;
        muteBtn.textContent = '🔇';
    } else {
        const prev = audio.dataset.prevVolume || 1;
        audio.volume = prev;
        volumeBar.value = prev * 100;
        muteBtn.textContent = '🔊';
    }
});

blackoutBtn.addEventListener('click', () => {
    blackoutScreen.classList.toggle('hidden');
    blackoutBtn.textContent = blackoutScreen.classList.contains('hidden') 
        ? '⬛ Screen Off' 
        : '💡 Screen On';
});

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Initial Preload
loadSong(0);