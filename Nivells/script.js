const elementsVeu = document.querySelectorAll('[data-tts]');

function parlar(text, callback) {
    window.speechSynthesis.cancel(); // Atura la veu de l'anterior element
    const missatge = new SpeechSynthesisUtterance(text);
    missatge.lang = 'ca-ES'; // Català
    missatge.rate = 1.1;     // Velocitat

    // Si passem una funció (callback), s'executarà JUST quan la veu acabi de parlar
    if (callback) {
        missatge.onend = callback;
    }

    window.speechSynthesis.speak(missatge);
}

elementsVeu.forEach(element => {
    const textLlegir = element.getAttribute('data-tts');

    element.addEventListener('mouseenter', () => parlar(textLlegir));
    element.addEventListener('focus', () => parlar(textLlegir));

    element.addEventListener('click', () => {
        if (element.classList.contains('btn-tornar')) {
            // Primer diu la frase, i quan acaba (onend), canvia de pàgina
            parlar("Tornant al menú inicial.", () => {
                window.location.href = "index.html"; 
            });
        } else {
            const titol = element.querySelector('.level-title').innerText;
            parlar("Iniciant el " + titol + ". Escolta i imagina.");
            // Aquí aniria la lògica per carregar el joc d'aquell nivell
        }
    });
});