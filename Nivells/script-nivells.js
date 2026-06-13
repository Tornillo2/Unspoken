document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // LÒGICA DE BLOQUEIG DE NIVELLS (localStorage)
  // ==========================================
  // Si no hi ha cap nivell desat, per defecte l'usuari està al nivell 1
  const currentLevel = parseInt(localStorage.getItem('currentLevel')) || 1;

  // Seleccionem totes les targetes que tenen un número de nivell assignat
  const levelCards = document.querySelectorAll('.level-card[data-level]');

  levelCards.forEach((card) => {
    const cardLevel = parseInt(card.dataset.level);

    // Si el nivell de la targeta és superior al de l'usuari, es bloqueja
    if (cardLevel > currentLevel) {
      card.disabled = true;                // Desactiva el botó (evita clics i focus del teclat)
      card.removeAttribute('onclick');      // Elimina la redirecció nativa per seguretat
      card.classList.add('is-locked');     // Afegeix classe de CSS per a l'estil visual
      
      // Modifiquem el text que llegirà el motor de síntesi de veu (TTS)
      card.dataset.tts = `Nivell ${cardLevel} bloquejat. Supera els nivells anteriors per poder-hi accedir.`;
      
      // Opcional: Canvia el número del nivell visible per la icona d'un cadenat
      const numSpan = card.querySelector('.level-num');
      if (numSpan) {
        numSpan.textContent = "🔒";
      }
    }
  });
  // ==========================================


  // ==========================================
  // SÍNTESI DE VEU I ACCESSIBILITAT (El teu codi)
  // ==========================================
  const speechSupported =
    "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

  if (!speechSupported) {
    return;
  }

  const speakOption = (element) => {
    const message = element.dataset.tts;

    console.log("Speaking option:", message);

    if (!message) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "ca-ES";
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
  };

  // Seleccionem tots els elements interactius del camí que s'han de llegir
  const menuButtons = document.querySelectorAll("[data-tts]");

  const setActiveButton = (button) => {
    menuButtons.forEach((menuButton) => {
      menuButton.classList.remove("is-active");
      menuButton.removeAttribute("aria-current");
    });

    button.classList.add("is-active");
    button.setAttribute("aria-current", "true");
  };

  const moveFocus = (currentButton, direction) => {
    // Filtrem els botons per saltar-nos automàticament els que estiguin disabled (bloquejats)
    const buttons = Array.from(menuButtons).filter(btn => !btn.disabled);
    const currentIndex = buttons.indexOf(currentButton);

    if (currentIndex === -1) {
      if (buttons.length > 0) buttons[0].focus();
      return;
    }

    const nextIndex = (currentIndex + direction + buttons.length) % buttons.length;
    buttons[nextIndex].focus();
  };

  menuButtons.forEach((button) => {
    // Només configurem esdeveniments si el botó no està deshabilitat
    button.addEventListener("focus", () => {
      setActiveButton(button);
      speakOption(button);
    });

    button.addEventListener("blur", () => {
      button.classList.remove("is-active");
      button.removeAttribute("aria-current");
    });
  });

  // CONTROLADOR GLOBAL DEL TECLAT (Adaptat perquè es saltegi els bloquejats)
  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    const activeElement = document.activeElement;

    const isNextKey = ["arrowdown", "s", "arrowright", "d"].includes(key);
    const isPrevKey = ["arrowup", "w", "arrowleft", "a"].includes(key);

    if (isNextKey) {
      event.preventDefault();
      moveFocus(activeElement, 1);
    } else if (isPrevKey) {
      event.preventDefault();
      moveFocus(activeElement, -1);
    }
  });
});