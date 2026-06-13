// Elements de la interfície DOM
const btnAudio = document.getElementById('btn-audio');
const àudioOcells = document.getElementById('sound-effect');
const zonaSeguent = document.getElementById('zona-seguent');

let reproduint = false;

// Motor del Lector de Veu (SpeechSynthesis)
function parlar(text, callback) {
    window.speechSynthesis.cancel();
    const missatge = new SpeechSynthesisUtterance(text);
    missatge.lang = 'ca-ES';
    missatge.rate = 1.0;
    if (callback) missatge.onend = callback;
    window.speechSynthesis.speak(missatge);
}

// Configura el lector de veu (TTS) per a elements amb focus o ratolí
function actualitzarLectorsVeu() {
    const totsElements = document.querySelectorAll('[data-tts]');
    totsElements.forEach(element => {
        element.onmouseenter = () => { parlar(element.getAttribute('data-tts')); };
        element.onfocus = () => { parlar(element.getAttribute('data-tts')); };
    });
}

// Control del reproductor d'àudio (Activar / Aturar els ocells)
btnAudio.addEventListener('click', () => {
    if (!reproduint) {
        àudioOcells.play();
        btnAudio.querySelector('.text').innerText = "Aturar Ocells";
        btnAudio.querySelector('.icon').innerText = "⏹️";
        btnAudio.setAttribute('data-tts', "Botó de so. Prem per aturar el cant dels ocells.");
        reproduint = true;
        parlar("Iniciant el cant dels ocells al bosc.");
    } else {
        àudioOcells.pause();
        btnAudio.querySelector('.text').innerText = "Escotar els Ocells";
        btnAudio.querySelector('.icon').innerText = "🐦";
        btnAudio.setAttribute('data-tts', "Botó de so. Prem per escoltar el cant dels ocells.");
        reproduint = false;
        parlar("So dels ocells aturat.");
    }
});

// Inicialització al carregar la pàgina
window.onload = () => {
    // Mostrem directament la zona per passar de nivell, ja que no hi ha preguntes
    if (zonaSeguent) {
        zonaSeguent.style.display = "block";
    }
    actualitzarLectorsVeu();
};