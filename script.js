document.addEventListener('DOMContentLoaded', () => {
    const speechSupported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

    if (!speechSupported) {
        return;
    }

    const instructions = [
        "Benvingut a Introspoken.",
        "Aquest joc està pensat per funcionar amb el teclat i l'àudio.",
        "Prem Tab per moure't entre les opcions, i Enter o Espai per activar-les.",
        "En posar-te a cada opció, s'escoltarà una descripció de que s'hi fa.",
    ].join(' ');

    const speakInstructions = () => {
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(instructions);
        utterance.lang = 'ca-ES';
        utterance.rate = 0.95;
        utterance.pitch = 1;
        utterance.volume = 1;

        window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length > 0) {
        speakInstructions();
        return;
    }

    const voicesReady = () => {
        speakInstructions();
        window.speechSynthesis.removeEventListener('voiceschanged', voicesReady);
    };

    window.speechSynthesis.addEventListener('voiceschanged', voicesReady);
    setTimeout(speakInstructions, 250);
});