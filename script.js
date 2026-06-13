document.addEventListener("DOMContentLoaded", () => {
  const speechSupported =
    "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

  if (!speechSupported) {
    return;
  }

  const instructions = [
    "Benvingut a Introspoken.",
    "Aquest joc està pensat per funcionar amb el teclat i àudio.",
    "Prem les fletxes o les tecles W, A, S i D per moure't entre les opcions, i Enter o Espai per activar-les.",
    "En posar-te a cada opció, s'escoltarà una descripció de que consta.",
  ].join(" ");

  // Variable de control per saber si ja hem dit la introducció
  let instructionsSpoken = false;

  const speakInstructions = () => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(instructions);
    utterance.lang = "ca-ES";
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
    instructionsSpoken = true;
  };

  const speakOption = (button) => {
    const message = button.dataset.tts;

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

  const menuButtons = document.querySelectorAll(".menu-btn");
  const instructionsDialog = document.getElementById("instruccions-dialog");
  const closeDialogButton = document.querySelector(
    ".instructions-dialog__close",
  );
  const continueButton = document.querySelector(".o-aprenentatge");

  const updateContinueButtonLabel = (currentLevel) => {
    if (!continueButton) {
      return;
    }

    const levelNumber = Number.parseInt(currentLevel, 10);
    const hasPreviousLevel = Number.isFinite(levelNumber) && levelNumber > 1;

    const titleElement = continueButton.querySelector(".text");
    const subtextElement = continueButton.querySelector(".subtext");

    if (hasPreviousLevel) {
      if (titleElement) {
        titleElement.textContent = "1. Continua el Nivell";
      }
      if (subtextElement) {
        subtextElement.textContent =
          "Segueix jugant i aprenent des del nivell on et vas quedar.";
      }
      continueButton.dataset.tts =
        "Opció 1: Continuar el nivell. Segueix jugant i aprenent des del nivell on et vas quedar.";
      return;
    }

    if (titleElement) {
      titleElement.textContent = "1. Comença";
    }
    if (subtextElement) {
      subtextElement.textContent =
        "Comença el nivell 1 i inicia l'aprenentatge de la natura.";
    }
    continueButton.dataset.tts =
      "Opció 1: Comença. Inicia el nivell 1 i aprèn els elements de la natura des del principi.";
  };

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

  // 2. Per si de cas l'usuari prefereix fer un clic a la pantalla abans de fer servir el teclat
  document.addEventListener(
    "click",
    () => {
      if (!instructionsSpoken) {
        speakInstructions();
      }
    },
    { once: true },
  ); // Aquest "once" fa que l'esdeveniment s'elimini tot sol un cop utilitzat

  if (instructionsDialog && closeDialogButton) {
    closeDialogButton.addEventListener("click", () => {
      instructionsDialog.close();
    });
  }

  //mirar si estem en partida o si hem de començar de nou
  const currentGameID = localStorage.getItem("currentGameID");
  if (currentGameID) {
    //agafar les dades de la partida i continuar
    $.get(
      `https://fun.codelearn.cat/hackathon/game/get_progress?game_id=${currentGameID}`,
      function (data) {
        //extreure el nivell actual i guardar-lo a localStorage
        if (data && data.data.nivell) {
          localStorage.setItem("currentLevel", data.data.nivell);
          console.log(
            "Continuing game with ID:",
            currentGameID,
            "at level:",
            data.data.nivell,
          );
          updateContinueButtonLabel(data.data.nivell);
        }
      },
    ).fail(function (jqXHR) {
      if (jqXHR.status === 404) {
        var json = jqXHR.responseJSON;
        if (json.ok === false && json.reason === "No progress found") {
          //encara no hi havia res guardar
        } else {
          console.log(
            "Error desconegut en extrure el progrés: " + JSON.stringify(json),
          );
        }
      } else {
        console.log("Otro tipo de error: " + jqXHR.status);
      }
    });
  } else {
    // No hi ha partida en curs, començar de nou
    $.get("https://fun.codelearn.cat/hackathon/game/new", function (data) {
      // Store the new game ID in localStorage
      if (data && data.game_id) {
        localStorage.setItem("currentGameID", data.game_id);
        localStorage.setItem("seed", data.seed);
        localStorage.setItem("currentLevel", 1);
        console.log("New game started with ID:", data.game_id);
        updateContinueButtonLabel(localStorage.getItem("currentLevel"));

        $.ajax({
          url: "https://fun.codelearn.cat/hackathon/game/store_progress",
          type: "POST",
          contentType: "application/json", // Indica al servidor que envies JSON
          data: JSON.stringify({
            game_id: data.game_id,
            data: { nivell: 1 },
          }), // Converteix l'objecte a format JSON de text
        })
          .done((response) => {
            console.log("Progrés guardat correctament:", response);
          })
          .fail((error) => {
            console.error("Error guardant el progrés:", error);
          });
      }
    });
  }

  updateContinueButtonLabel(localStorage.getItem("currentLevel"));
});

function navigateTo(page) {
  switch (page) {
    case "continuar":
      const currentLevel = localStorage.getItem("currentLevel") || "1";
      window.location.href = `nivells/nivell ${currentLevel}`;
      break;
    case "nivells":
      window.location.href = "nivells";
      break;
    case "instruccions":
      const dialog = document.getElementById("instruccions-dialog");
      if (dialog) {
        dialog.showModal();
        const closeButton = dialog.querySelector(".instructions-dialog__close");
        if (closeButton) {
          closeButton.focus();
        }
        speak(
          document.getElementsByClassName("instructions-dialog__content")[0]
            .textContent,
        );
      }
      break;
    default:
      console.error("Unknown page:", page);
  }
}

const speak = (message) => {
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
