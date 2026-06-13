document.addEventListener('DOMContentLoaded', () => {
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

  // Seleccionem tots els elements interactius del camí (botons, títols amb focus, etc.)
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
    const buttons = Array.from(menuButtons);
    const currentIndex = buttons.indexOf(currentButton);

    if (currentIndex === -1) {
      buttons[0].focus();
      return;
    }

    const nextIndex =
      (currentIndex + direction + buttons.length) % buttons.length;
    buttons[nextIndex].focus();
  };

  menuButtons.forEach((button) => {
    button.addEventListener("focus", () => {
      setActiveButton(button);
      speakOption(button);
    });

    button.addEventListener("blur", () => {
      button.classList.remove("is-active");
      button.removeAttribute("aria-current");
    });
  });

  // UN SOL CONTROLADOR GLOBAL PEL TECLAT
  document.addEventListener("keydown", (event) => {
    // 1. Si l'usuari prem qualsevol tecla per primer cop, es llegeixen les instruccions
    // i s'atura l'esdeveniment perquè no es mogui el menú de cop ni es talli la veu.

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