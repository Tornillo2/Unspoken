const btnAudio = document.getElementById('btn-audio');
const àudioBosc = document.getElementById('sound-effect');
const zonaSeguent = document.getElementById('zona-seguent');
const botonsResposta = document.querySelectorAll('.btn-resposta');

let reproduint = false;

// Funció del lector de veu (TTS)
function parlar(text, callback) {
    window.speechSynthesis.cancel();
    const missatge = new SpeechSynthesisUtterance(text);
    missatge.lang = 'ca-ES';
    missatge.rate = 1.0;
    if (callback) missatge.onend = callback;
    window.speechSynthesis.speak(missatge);
}

// Inicialitzar lectors de veu en passar el ratolí o fer focus
function actualitzarLectorsVeu() {
    const totsElements = document.querySelectorAll('[data-tts]');
    totsElements.forEach(element => {
        element.onmouseenter = () => { parlar(element.getAttribute('data-tts')); };
        element.onfocus = () => { parlar(element.getAttribute('data-tts')); };
    });
}
actualitzarLectorsVeu();

// Control del reproductor (Escotar el Bosc)
btnAudio.addEventListener('click', () => {
    if (!reproduint) {
        àudioBosc.play();
        btnAudio.querySelector('.text').innerText = "Aturar el Bosc";
        btnAudio.querySelector('.icon').innerText = "⏹️";
        btnAudio.setAttribute('data-tts', "Botó de so. Prem per aturar el so del bosc.");
        reproduint = true;
        parlar("Iniciant el so del bosc. Escolta el vent i el cruixit de les fulles.");
    } else {
        àudioBosc.pause();
        btnAudio.querySelector('.text').innerText = "Escotar el Bosc";
        btnAudio.querySelector('.icon').innerText = "🍃";
        btnAudio.setAttribute('data-tts', "Botó de so. Prem per escoltar el vent entre els arbres.");
        reproduint = false;
        parlar("So del bosc aturat.");
    }
});

// Lògica de les respostes de les preguntes del Nivell 2
botonsResposta.forEach(boto => {
    boto.addEventListener('click', () => {
        if (boto.classList.contains('correcta')) {
            // Resposta correcta (Verda)
            boto.style.backgroundColor = "#1e8449";
            boto.style.borderColor = "#52be80";
            boto.style.color = "#ffffff";
            
            // Mostrem el botó per passar al següent nivell
            zonaSeguent.style.display = "block";
            actualitzarLectorsVeu();
            parlar("Molt bé! Resposta correcta. És un mantell de fulles seques. Prem el botó de baix per continuar el camí.");
        } else {
            // Resposta incorrecta (Vermella)
            boto.style.backgroundColor = "#641e1e";
            boto.style.borderColor = "#ec7063";
            parlar("Aquesta no és la resposta correcta. Escolta la descripció i torna-ho a provar.");
        }
    });
});