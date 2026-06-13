// Elements de la interfície DOM
const btnAudio = document.getElementById('btn-audio');
const àudioVent = document.getElementById('sound-effect');
const zonaSeguent = document.getElementById('zona-seguent');
const titolPregunta = document.getElementById('titol-pregunta');

let reproduint = false;

// Motor de veu en català
function parlar(text, callback) {
    window.speechSynthesis.cancel();
    const missatge = new SpeechSynthesisUtterance(text);
    missatge.lang = 'ca-ES';
    missatge.rate = 1.0;
    if (callback) missatge.onend = callback;
    window.speechSynthesis.speak(missatge);
}

// Activa el lector de veu (TTS) per ratolí i teclat focus
function actualitzarLectorsVeu() {
    document.querySelectorAll('[data-tts]').forEach(element => {
        element.onmouseenter = () => { parlar(element.getAttribute('data-tts')); };
        element.onfocus = () => { parlar(element.getAttribute('data-tts')); };
    });
}

// Funció que tria una de les preguntes escrites a l'HTML i activa el nivell
function inicialitzarPregunta() {
    const llistaPreguntes = document.querySelectorAll('.quiz-container');
    
    if (llistaPreguntes.length === 0) return;

    // Triem un índex a l'atzar i mostrem la pregunta escollida
    const indexAleatori = Math.floor(Math.random() * llistaPreguntes.length);
    const preguntaEscollida = llistaPreguntes[indexAleatori];
    preguntaEscollida.style.display = "block";

    // Actualitzem l'enunciat de cara al lector de veu
    const textDeLaPregunta = preguntaEscollida.querySelector('.pregunta-text').innerText;
    titolPregunta.setAttribute('data-tts', "Pregunta del nivell: " + textDeLaPregunta);

    // Busquem els botons que ja estan a dins d'aquesta pregunta a l'HTML
    const botonsResposta = preguntaEscollida.querySelectorAll('.btn-resposta');

    botonsResposta.forEach(boto => {
        boto.addEventListener('click', () => {
            // Bloquegem tots els botons d'aquesta secció perquè no es pugui clicar més d'un cop
            botonsResposta.forEach(b => b.disabled = true);

            // Llegim si l'atribut data-correcta és "true"
            const esCorrecta = boto.getAttribute('data-correcta') === "true";

            if (esCorrecta) {
                boto.style.backgroundColor = "#1a365d"; // Blau encert
                boto.style.borderColor = "#98c1d9";
                boto.style.color = "#ffffff";
                zonaSeguent.style.display = "block";
                actualitzarLectorsVeu();
                parlar("Increïble! Resposta correcta. Has completat l'última pregunta del viatge!");
            } else {
                boto.style.backgroundColor = "#5c1d1d"; // Vermell error
                boto.style.borderColor = "#e74c3c";
                boto.style.color = "#ffffff";
                parlar("Aquesta resposta no és correcta. Torna a carregar la pàgina per provar-ho de nou.");
            }
        });
    });

    actualitzarLectorsVeu();
}

// Control Play/Pause del vent
btnAudio.addEventListener('click', () => {
    if (!reproduint) {
        àudioVent.play();
        btnAudio.querySelector('.text').innerText = "Aturar el Vent";
        btnAudio.querySelector('.icon').innerText = "⏹️";
        btnAudio.setAttribute('data-tts', "Botó de so. Prem per aturar el so del vent.");
        reproduint = true;
        parlar("Iniciant el so del vent dalt de la muntanya.");
    } else {
        àudioVent.pause();
        btnAudio.querySelector('.text').innerText = "Escotar el Vent";
        btnAudio.querySelector('.icon').innerText = "🌬️";
        btnAudio.setAttribute('data-tts', "Botó de so. Prem per escoltar la força del vent.");
        reproduint = false;
        parlar("So aturat.");
    }
});

// Execució inicial en obrir el nivell
window.onload = () => {
    inicialitzarPregunta();
};