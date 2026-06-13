document.addEventListener('DOMContentLoaded', () => {
    const speechSupported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

    if (!speechSupported) {
        return;
    }

    const instructions = [
        "Benvingut a Introspoken.",
        "Aquest joc està pensat per funcionar amb el teclat i àudio.",
        "Prem les fletxes o les tecles W, A, S i D per moure't entre les opcions, i Enter o Espai per activar-les.",
        "En posar-te a cada opció, s'escoltarà una descripció de que consta.",
    ].join(' ');

    // Variable de control per saber si ja hem dit la introducció
    let instructionsSpoken = false;

    const speakInstructions = () => {
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(instructions);
        utterance.lang = 'ca-ES';
        utterance.rate = 0.95;
        utterance.pitch = 1;
        utterance.volume = 1;

        window.speechSynthesis.speak(utterance);
        instructionsSpoken = true;
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
            buttons[0].focus();
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
    });

    // UN SOL CONTROLADOR GLOBAL PEL TECLAT
    document.addEventListener('keydown', (event) => {
        // 1. Si l'usuari prem qualsevol tecla per primer cop, es llegeixen les instruccions
        // i s'atura l'esdeveniment perquè no es mogui el menú de cop ni es talli la veu.
        if (!instructionsSpoken) {
            event.preventDefault();
            speakInstructions();
            return; 
        }

        // Si el diàleg està obert, bloquegem el moviment del menú del fons
        if (instructionsDialog && instructionsDialog.open) {
            return;
        }

        const key = event.key.toLowerCase();
        const activeElement = document.activeElement;

        const isNextKey = ['arrowdown', 's', 'arrowright', 'd'].includes(key);
        const isPrevKey = ['arrowup', 'w', 'arrowleft', 'a'].includes(key);

        if (isNextKey) {
            event.preventDefault();
            moveFocus(activeElement, 1);
        } else if (isPrevKey) {
            event.preventDefault();
            moveFocus(activeElement, -1);
        }
    });

    // 2. Per si de cas l'usuari prefereix fer un clic a la pantalla abans de fer servir el teclat
    document.addEventListener('click', () => {
        if (!instructionsSpoken) {
            speakInstructions();
        }
    }, { once: true }); // Aquest "once" fa que l'esdeveniment s'elimini tot sol un cop utilitzat

    if (instructionsDialog && closeDialogButton) {
        closeDialogButton.addEventListener('click', () => {
            instructionsDialog.close();
        });
    }

    //mirar si estem en partida o si hem de començar de nou
    const currentGameID = localStorage.getItem('currentGameID');
    if (currentGameID) {
        //agafar les dades de la partida i continuar
        $.get(`https://fun.codelearn.cat/hackathon/game/get_progress?game_id=${currentGameID}`, function(data) {
            // Process the game data
        });
    }

function navigateTo(page) {
    switch (page) {
        case 'continuar':
            const currentLevel = localStorage.getItem('currentLevel') || '1';
            window.location.href = `nivells${currentLevel}.html`;
            break;
        case 'nivells':
            window.location.href = 'nivells';
            break;
        case 'instruccions':
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
    }
}