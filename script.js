document.addEventListener('DOMContentLoaded', () => {
    const speechSupported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

    if (!speechSupported) {
        return;
    }

    const instructions = [
        "Benvingut a Introspoken.",
        "Aquest joc està pensat per funcionar amb el teclat i l'àudio.",
        "Prem les fletxes o les tecles W, A, S i D per moure't entre les opcions, i Enter o Espai per activar-les.",
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
        const message = button.dataset.tts;

        console.log('Speaking option:', message);

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
    const instructionsDialog = document.getElementById('instruccions-dialog');
    const closeDialogButton = document.querySelector('.instructions-dialog__close');

    const setActiveButton = (button) => {
        menuButtons.forEach((menuButton) => {
            menuButton.classList.remove('is-active');
            menuButton.removeAttribute('aria-current');
        });

        button.classList.add('is-active');
        button.setAttribute('aria-current', 'true');
    };

    const moveFocus = (currentButton, direction) => {
        const buttons = Array.from(menuButtons);
        const currentIndex = buttons.indexOf(currentButton);

        if (currentIndex === -1) {
            return;
        }

        const nextIndex = (currentIndex + direction + buttons.length) % buttons.length;
        buttons[nextIndex].focus();
    };

    menuButtons.forEach((button) => {
        button.addEventListener('focus', () => {
            setActiveButton(button);
            speakOption(button);
        });
        button.addEventListener('blur', () => {
            button.classList.remove('is-active');
            button.removeAttribute('aria-current');
        });
        button.addEventListener('keydown', (event) => {
            const key = event.key.toLowerCase();

            if (key === 'arrowdown' || key === 's' || key === 'arrowright' || key === 'd') {
                event.preventDefault();
                moveFocus(button, 1);
            }

            if (key === 'arrowup' || key === 'w' || key === 'arrowleft' || key === 'a') {
                event.preventDefault();
                moveFocus(button, -1);
            }
        });
    });

    document.addEventListener('keydown', (event) => {
        if (instructionsDialog && instructionsDialog.open) {
            return;
        }

        const key = event.key.toLowerCase();
        const activeElement = document.activeElement;

        if (!activeElement || !activeElement.classList || !activeElement.classList.contains('menu-btn')) {
            return;
        }

        if (key === 'arrowdown' || key === 's' || key === 'arrowright' || key === 'd') {
            event.preventDefault();
            moveFocus(activeElement, 1);
        }

        if (key === 'arrowup' || key === 'w' || key === 'arrowleft' || key === 'a') {
            event.preventDefault();
            moveFocus(activeElement, -1);
        }
    });

    if (instructionsDialog && closeDialogButton) {
        closeDialogButton.addEventListener('click', () => {
            instructionsDialog.close();
        });
    }

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

function navigateTo(page) {
    switch (page) {
        case 'continuar':
            //mirar localStorage per veure quin nivell s'ha de continuar
            const currentLevel = localStorage.getItem('currentLevel') || '1';
            window.location.href = `nivells${currentLevel}.html`;
            break;
        case 'nivells':
            window.location.href = 'nivells';
            break;
        case 'instruccions':
            //obrir el dialog d'instruccions
            const dialog = document.getElementById('instruccions-dialog');
            if (dialog) {
                dialog.showModal();
                const closeButton = dialog.querySelector('.instructions-dialog__close');
                if (closeButton) {
                    closeButton.focus();
                }
            }

            break;
        default:
            console.error('Unknown page:', page);
    };
}