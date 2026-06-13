document.addEventListener('DOMContentLoaded', () => {
    const speechSupported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

    if (!speechSupported) {
        return;
    }

    const instructions = [
        "Benvingut a Introspoken.",
        "Aquest joc està pensat per funcionar amb el teclat i l'àudio.",
        "Prem Tab per moure't entre les opcions, i Enter o Espai per activar-les.",
        "En posar-te a cada opció, s'escoltarà una descripció de que consta.",
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

    const speakOption = (button) => {
        const title = button.querySelector('.text')?.textContent?.trim() || '';
        const description = button.querySelector('.subtext')?.textContent?.trim() || '';
        const message = [title, description].filter(Boolean).join(' ');

        if (!message) {
            return;
        }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = 'ca-ES';
        utterance.rate = 0.95;
        utterance.pitch = 1;
        utterance.volume = 1;

        window.speechSynthesis.speak(utterance);
    };

    const menuButtons = document.querySelectorAll('.menu-btn');

    menuButtons.forEach((button) => {
        button.addEventListener('mouseenter', () => speakOption(button));
        button.addEventListener('focus', () => speakOption(button));
    });

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