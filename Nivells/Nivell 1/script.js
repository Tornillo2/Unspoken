const elementsVeu = document.querySelectorAll('[data-tts]');
const btnAudio = document.getElementById('btn-audio');
const àudioRiu = document.getElementById('sound-effect');
const zonaPreguntes = document.getElementById('zona-preguntes');
const zonaSeguent = document.getElementById('zona-seguent');
const botonsResposta = document.querySelectorAll('.btn-resposta');

let reproduint = false;

function parlar(text, callback) {
    window.speechSynthesis.cancel();
    const missatge = new SpeechSynthesisUtterance(text);
    missatge.lang = 'ca-ES';
    missatge.rate = 1.0;
    if (callback) missatge.onend = callback;
    window.speechSynthesis.speak(missatge);
}

// Inicialitzar lectors de veu bàsics
function actualitzarLectorsVeu() {
    const totsElements = document.querySelectorAll('[data-tts]');
    totsElements.forEach(element => {
        // Evitem duplicar esdeveniments netejant-los primer si calgués, o assegurant el flux
        element.onmouseenter = () => { if (!reproduint || element.classList.contains('btn-tornar')) parlar(element.getAttribute('data-tts')); };
        element.onfocus = () => { if (!reproduint || element.classList.contains('btn-tornar')) parlar(element.getAttribute('data-tts')); };
    });
}
actualitzarLectorsVeu();

// Botó Tornar
document.querySelector('.btn-tornar').addEventListener('click', () => {
    àudioRiu.pause();
    parlar("Tornant al camí de nivells.", () => {
        window.location.href = "nivells.html";
    });
});

// Control del Reproductor del Riu
btnAudio.addEventListener('click', () => {
    if (!reproduint) {
        parlar("Iniciant el so del riu. Escolta atentament.", () => {
            àudioRiu.play();
            btnAudio.querySelector('.text').innerText = "Aturar i respondre";
            btnAudio.querySelector('.icon').innerText = "⏹️";
            btnAudio.setAttribute('data-tts', "Botó de so. Prem per aturar el so i obrir la pregunta.");
            reproduint = true;
        });
    } else {
        àudioRiu.pause();
        reproduint = false;
        btnAudio.style.display = "none"; // Amaguem el botó de reproducció perquè es concentrin en el test
        
        // Mostrem les preguntes de forma accessible
        zonaPreguntes.style.display = "block";
        actualitzarLectorsVeu();
        parlar("So aturat. Ara respon a la pregunta que ha aparegut a la pantalla.");
    }
});

// Logica de les respostes del Quiz
botonsResposta.forEach(boto => {
    boto.addEventListener('click', () => {
        if (boto.classList.contains('correcta')) {
            boto.style.backgroundColor = "#285834";
            boto.style.borderColor = "#85e39d";
            zonaSeguent.style.display = "block";
            actualitzarLectorsVeu();
            parlar("Excel·lent! Resposta correcta. Ha aparegut el botó a baix de tot per passar al següent nivell.");
        } else {
            boto.style.backgroundColor = "#5c1d1d";
            boto.style.borderColor = "#e74c3c";
            parlar("Oh, no és correcte. Torna-ho a intentar.");
        }
    });
});

// Acció del botó Següent Nivell
document.getElementById('btn-seguent').addEventListener('click', () => {
    parlar("Carregant el Nivell dos: Els Arbres.", () => {
        // Aquí enllaçaràs amb el teu fitxer 'nivell2.html' quan el tinguis creat
        window.location.href = "nivells.html"; 
    });
});