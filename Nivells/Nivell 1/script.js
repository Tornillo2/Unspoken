document.addEventListener("DOMContentLoaded", () => {
  const speechSupported =
    "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

  if (!speechSupported) {
    return;
  }

  const btnTornar = document.getElementById("btn-tornar");
  const btnAudio = document.getElementById("btn-audio");
  const audioRiu = document.getElementById("sound-effect");
  const zonaSeguent = document.getElementById("zona-seguent");
  const titolPregunta = document.getElementById("titol-pregunta");
  const textPregunta = document.getElementById("pregunta-text");
  const contenidorOpcions = document.getElementById("quiz-options");
  const btnSeguent = document.getElementById("btn-seguent");
  const descriptionCard = document.querySelector(".description-card");

  let reproduint = false;

  const preguntesNivell1 = [
    {
      pregunta: "Com és el so d'aquest rierol de muntanya?",
      opcions: [
        {
          text: "A) Fort i brusc, com una cascada gegant.",
          correcta: false,
          tts: "Opció A: És un soroll molt fort i brusc, com una cascada gegant.",
        },
        {
          text: "B) Un murmuri continu, com un secret entre les roques.",
          correcta: true,
          tts: "Opció B: És un murmuri continu, com un secret entre les roques.",
        },
        {
          text: "C) Un so silenciós que gairebé no es pot sentir.",
          correcta: false,
          tts: "Opció C: És un so silenciós que gairebé no es pot sentir.",
        },
      ],
    },
    {
      pregunta: "Com està l'aigua d'aquest rierol de muntanya?",
      opcions: [
        {
          text: "A) Està tèbia i plena de fang.",
          correcta: false,
          tts: "Opció A: Està tèbia i plena de fang.",
        },
        {
          text: "B) Està molt calenta per l'estiu.",
          correcta: false,
          tts: "Opció B: Està molt calenta per l'estiu.",
        },
        {
          text: "C) És freda i pura.",
          correcta: true,
          tts: "Opció C: És freda i pura.",
        },
      ],
    },
    {
      pregunta: "Sobre quin tipus de superfície llisca l'aigua?",
      opcions: [
        {
          text: "A) Sobre pedres llises i arrodonides.",
          correcta: true,
          tts: "Opció A: Sobre pedres llises i arrodonides.",
        },
        {
          text: "B) Sobre sorra tova de la platja.",
          correcta: false,
          tts: "Opció B: Sobre sorra tova de la platja.",
        },
        {
          text: "C) Sobre branques seques i punxegudes.",
          correcta: false,
          tts: "Opció C: Sobre branques seques i punxegudes.",
        },
      ],
    },
  ];

  function parlar(text, callback) {
    window.speechSynthesis.cancel();
    const missatge = new SpeechSynthesisUtterance(text);
    missatge.lang = "ca-ES";
    missatge.rate = 1.0;
    if (callback) {
      missatge.onend = callback;
    }
    window.speechSynthesis.speak(missatge);
  }

  function actualitzarLectorsVeu() {
    const totsElements = document.querySelectorAll("[data-tts]");
    totsElements.forEach((element) => {
      element.onmouseenter = () => {
        parlar(element.getAttribute("data-tts"));
      };
      element.onfocus = () => {
        parlar(element.getAttribute("data-tts"));
      };
    });
  }

  function seededRandom(seed) {
    let str = String(seed);
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    const req = Math.sin(h) * 10000;
    return req - Math.floor(req);
  }

  function carregarPreguntaAleatoria() {
    const llavor = localStorage.getItem("seed");
    const numeroAleatori = seededRandom(llavor);
    const indexAleatori = Math.floor(numeroAleatori * preguntesNivell1.length);
    const dadesPregunta = preguntesNivell1[indexAleatori];

    textPregunta.innerText = dadesPregunta.pregunta;
    titolPregunta.setAttribute(
      "data-tts",
      "Pregunta del nivell: " + dadesPregunta.pregunta,
    );
    contenidorOpcions.innerHTML = "";

    dadesPregunta.opcions.forEach((opcio) => {
      const boto = document.createElement("button");
      boto.type = "button";
      boto.className = "btn-resposta";
      boto.innerText = opcio.text;
      boto.setAttribute("data-tts", opcio.tts);

      boto.addEventListener("click", () => {
        if (opcio.correcta) {
          // Si és correcta, desactivem TOTS els botons per evitar més clics
          const botons = contenidorOpcions.querySelectorAll(".btn-resposta");
          botons.forEach((b) => {
            b.disabled = true;
          });

          boto.classList.add("is-correct");
          boto.setAttribute("aria-invalid", "false");
          boto.style.backgroundColor = "#285834";
          boto.style.borderColor = "#85e39d";
          boto.style.color = "#ffffff";
          zonaSeguent.style.display = "block";
          actualitzarLectorsVeu();
          guardarProgresNivell();
          parlar("Correcte.", () => {
            parlar("Carregant el següent nivell.", () => {
              window.location.href = "../Nivell 2/index.html";
            });
          });
        } else {
          // Si és incorrecta, NO els desactivem. Deixem que continuï provant.
          boto.classList.add("is-failed");
          boto.setAttribute("aria-invalid", "true");
          boto.style.backgroundColor = "#5c1d1d";
          boto.style.borderColor = "#e74c3c";
          boto.style.color = "#ffffff";

          // Forcem que el focus es quedi en aquest botó fallat
          boto.focus();

          parlar(
            "Oh, aquesta no és correcta. Continua intentant-ho amb les altres opcions.",
          );
        }
      });

      contenidorOpcions.appendChild(boto);
    });

    actualitzarLectorsVeu();
  }

  function guardarProgresNivell() {
    const nivellActual = 2;
    $.ajax({
      url: "https://fun.codelearn.cat/hackathon/game/store_progress",
      type: "POST",
      contentType: "application/json", // Indica al servidor que envies JSON
      data: JSON.stringify({
        game_id: localStorage.getItem("currentGameID"),
        data: { nivell: nivellActual },
      }), // Converteix l'objecte a format JSON de text
    })
      .done((response) => {
        console.log("Progrés guardat correctament:", response);
      })
      .fail((error) => {
        console.error("Error guardant el progrés:", error);
      });
  }


  if (btnAudio) {
    btnAudio.addEventListener("click", () => {
      if (!reproduint) {
        parlar("Iniciant el so del riu.");
        setTimeout(() => {
          audioRiu.play();
          btnAudio.querySelector(".text").innerText = "Aturar el so";
          btnAudio.querySelector(".icon").innerText = "⏹️";
          btnAudio.setAttribute(
            "data-tts",
            "Botó de so. Prem per aturar el murmuri del riu.",
          );
          reproduint = true;
        }, 2000);
      } else {
        audioRiu.pause();
        btnAudio.querySelector(".text").innerText = "Escotar el so";
        btnAudio.querySelector(".icon").innerText = "🔊";
        btnAudio.setAttribute(
          "data-tts",
          "Botó de so. Prem per escoltar el murmuri del riu.",
        );
        reproduint = false;
        parlar("So aturat.");
      }
    });
  }


  actualitzarLectorsVeu();
  carregarPreguntaAleatoria();

  // Tornem a carregar els botons del menú després de generar-los dinàmicament
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
      // 'speakOption' s'ha eliminat perquè 'actualitzarLectorsVeu()' ja s'encarrega del focus i del TTS
    });

    button.addEventListener("blur", () => {
      button.classList.remove("is-active");
      button.removeAttribute("aria-current");
    });
  });

  // CONTROLADOR GLOBAL PEL TECLAT
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
