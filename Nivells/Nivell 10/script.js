document.addEventListener("DOMContentLoaded", () => {
  const speechSupported =
    "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

  if (!speechSupported) {
    return;
  }

  // Elements del DOM
  const zonaSeguent = document.getElementById("zona-seguent");
  const textPregunta = document.getElementById("pregunta-text");
  const numPreguntaTitol = document.getElementById("num-pregunta-titol");
  const contenidorOpcions = document.getElementById("quiz-options");
  const btnSeguent = document.getElementById("btn-seguent");

  // Índex de la pregunta que s'està responent (de 0 a 8)
  let indexPartida = 0; 
  // Aquí guardarem la llista de les 9 preguntes seleccionades per a aquesta partida
  let preguntesSeleccionades = [];

  // BANC DE DADES: 9 Nivells x 4 Preguntes cadascun = 36 preguntes en total
  const bancPreguntes = {
    1: [
      {
        nivell: "Nivell 1: L'Aigua",
        pregunta: "Quin so fa el riu quan l'aigua baixa tranquil·la entre les pedres?",
        opcions: [
          { text: "A) Un murmuri suau i constant.", correcta: true, tts: "Opció A: Un murmuri suau i constant." },
          { text: "B) Un soroll de vidres trencant-se.", correcta: false, tts: "Opció B: Un soroll de vidres trencant-se." }
        ]
      },
      {
        nivell: "Nivell 1: L'Aigua",
        pregunta: "Com sona una cascada gran quan l'aigua cau des de dalt de tot?",
        opcions: [
          { text: "A) Un rugit potent i continu.", correcta: true, tts: "Opció A: Un rugit potent i continu." },
          { text: "B) Un xiulet fluixet.", correcta: false, tts: "Opció B: Un xiulet fluixet." }
        ]
      },
      {
        nivell: "Nivell 1: L'Aigua",
        pregunta: "Quin so fan les gotes de rosada en caure de la fulla al matí?",
        opcions: [
          { text: "A) Un 'plop' gairebé imperceptible.", correcta: true, tts: "Opció A: Un plop gairebé imperceptible." },
          { text: "B) Un esclat fort.", correcta: false, tts: "Opció B: Un esclat fort." }
        ]
      },
      {
        nivell: "Nivell 1: L'Aigua",
        pregunta: "Si el riu baixa molt cansat i ple de fang per la inundació, com se sent?",
        opcions: [
          { text: "A) Un xipolleig enfangat i feixuc.", correcta: true, tts: "Opció A: Un xipolleig enfangat i feixuc." },
          { text: "B) Un silenci total.", correcta: false, tts: "Opció B: Un silenci total." }
        ]
      }
    ],
    2: [
      {
        nivell: "Nivell 2: Els Arbres",
        pregunta: "Quin element de la natura fa que les fulles i les branques es moguin?",
        opcions: [
          { text: "A) La força del vent.", correcta: true, tts: "Opció A: La força del vent." },
          { text: "B) La llum del sol.", correcta: false, tts: "Opció B: La llum del sol." }
        ]
      },
      {
        nivell: "Nivell 2: Els Arbres",
        pregunta: "Com sonen les fulles seques d'un roure a la tardor quan el vent les bufa?",
        opcions: [
          { text: "A) Un fregar aspre i cruixent.", correcta: true, tts: "Opció A: Un fregar aspre i cruixent." },
          { text: "B) Com campanetes de vidre.", correcta: false, tts: "Opció B: Com campanetes de vidre." }
        ]
      },
      {
        nivell: "Nivell 2: Els Arbres",
        pregunta: "Quan una branca vella i gran es trenca a l'interior del bosc, quin so fa?",
        opcions: [
          { text: "A) Un crec sec i molt fort.", correcta: true, tts: "Opció A: Un crec sec i molt fort." },
          { text: "B) Un zumzeig dolç.", correcta: false, tts: "Opció B: Un zumzeig dolç." }
        ]
      },
      {
        nivell: "Nivell 2: Els Arbres",
        pregunta: "Quin so fa el bosc de pins quan rep una brisa molt suau?",
        opcions: [
          { text: "A) Un xiulet de fons relaxant.", correcta: true, tts: "Opció A: Un xiulet de fons relaxant." },
          { text: "B) Un repicar de tambors.", correcta: false, tts: "Opció B: Un repicar de tambors." }
        ]
      }
    ],
    3: [
      {
        nivell: "Nivell 3: Ocells del Matí",
        pregunta: "A quin moment del dia els ocells fan el seu cant més alegre?",
        opcions: [
          { text: "A) Al matí, amb l'alba.", correcta: true, tts: "Opció A: Al matí, amb l'alba." },
          { text: "B) A la nit fosca.", correcta: false, tts: "Opció B: A la nit fosca." }
        ]
      },
      {
        nivell: "Nivell 3: Ocells del Matí",
        pregunta: "Quin ocell és conegut per fer un repic constant als troncs dels arbres?",
        opcions: [
          { text: "A) El picot garser.", correcta: true, tts: "Opció A: El picot garser." },
          { text: "B) L'oreneta de bosc.", correcta: false, tts: "Opció B: L'oreneta de bosc." }
        ]
      },
      {
        nivell: "Nivell 3: Ocells del Matí",
        pregunta: "Com es diu el cant curt i repetitiu dels ocells petits que avisen que surt el sol?",
        opcions: [
          { text: "A) Refilet o piulet.", correcta: true, tts: "Opció A: Refilet o piulet." },
          { text: "B) Bram salvatge.", correcta: false, tts: "Opció B: Bram salvatge." }
        ]
      },
      {
        nivell: "Nivell 3: Ocells del Matí",
        pregunta: "Quan un estol de centenars d'ocells s'enlaira de cop, quin so predomina?",
        opcions: [
          { text: "A) El bategar ràpid de moltes ales.", correcta: true, tts: "Opció A: El bategar ràpid de moltes ales." },
          { text: "B) Un silenci absolut.", correcta: false, tts: "Opció B: Un silenci absolut." }
        ]
      }
    ],
    4: [
      {
        nivell: "Nivell 4: Passos Amagats",
        pregunta: "Quin soroll fan els petits animals com l'eriçó quan es mouen pel terra?",
        opcions: [
          { text: "A) Un cruixir suau de fullaraca seca.", correcta: true, tts: "Opció A: Un cruixir suau de fullaraca seca." },
          { text: "B) Un fort rugit de lleó.", correcta: false, tts: "Opció B: Un fort rugit de lleó." }
        ]
      },
      {
        nivell: "Nivell 4: Passos Amagats",
        pregunta: "Si un conill s'espanta i surt corrents, com detectem els seus passos?",
        opcions: [
          { text: "A) Per cops ràpids i saltirons a la terra.", correcta: true, tts: "Opció A: Per cops ràpids i saltirons a la terra." },
          { text: "B) Per un xiulet agut.", correcta: false, tts: "Opció B: Per un xiulet agut." }
        ]
      },
      {
        nivell: "Nivell 4: Passos Amagats",
        pregunta: "Quin so fa una serp lliscant discretament entre l'herba alta?",
        opcions: [
          { text: "A) Un siseig tènue i continu.", correcta: true, tts: "Opció A: Un siseig tènue i continu." },
          { text: "B) Passes feixugues.", correcta: false, tts: "Opció B: Passes feixugues." }
        ]
      },
      {
        nivell: "Nivell 4: Passos Amagats",
        pregunta: "Un esquirol que puja corrents pel tronc d'un pi genera un so de:",
        opcions: [
          { text: "A) Rascar ràpid de petites unglres a l'escorça.", correcta: true, tts: "Opció A: Rascar ràpid de petites unglres a l'escorça." },
          { text: "B) Un cop metàl·lic.", correcta: false, tts: "Opció B: Un cop metàl·lic." }
        ]
      }
    ],
    5: [
      {
        nivell: "Nivell 5: La Pluja",
        pregunta: "Com ressona el xàfec suau quan les gotes toquen la terra humida?",
        opcions: [
          { text: "A) Un repic rítmic, tou i relaxant.", correcta: true, tts: "Opció A: Un repic rítmic, tou i relaxant." },
          { text: "B) Un cop sec de fusta trencada.", correcta: false, tts: "Opció B: Un cop sec de fusta trencada." }
        ]
      },
      {
        nivell: "Nivell 5: La Pluja",
        pregunta: "Com es descriu el so de la pluja intensa sobre les fulles del bosc?",
        opcions: [
          { text: "A) Com si fossin milers de tambors repicant.", correcta: true, tts: "Opció A: Com si fossin milers de tambors repicant." },
          { text: "B) Com un silenci absolut i pausat.", correcta: false, tts: "Opció B: Com un silenci absolut i pausat." }
        ]
      },
      {
        nivell: "Nivell 5: La Pluja",
        pregunta: "Quan la pluja s'atura i l'aigua escorre dels arbres, quin so s'escolta?",
        opcions: [
          { text: "A) Un degoteig lent i dispers.", correcta: true, tts: "Opció A: Un degoteig lent i dispers." },
          { text: "B) Un retruny de tempesta.", correcta: false, tts: "Opció B: Un retruny de tempesta." }
        ]
      },
      {
        nivell: "Nivell 5: La Pluja",
        pregunta: "Quin so fa la pluja quan impacta contra la superfície d'un bassal gran?",
        opcions: [
          { text: "A) Un xipolleig líquid constant.", correcta: true, tts: "Opció A: Un xipolleig líquid constant." },
          { text: "B) Un cruixit sec.", correcta: false, tts: "Opció B: Un cruixit sec." }
        ]
      }
    ],
    6: [
      {
        nivell: "Nivell 6: Bosc Nocturn",
        pregunta: "Quin animal d'ulls grans es pot escoltar cantant a la foscor?",
        opcions: [
          { text: "A) Un mussol o fagina.", correcta: true, tts: "Opció A: Un mussol o fagina." },
          { text: "B) Una àliga daurada.", correcta: false, tts: "Opció B: Una àliga daurada." }
        ]
      },
      {
        nivell: "Nivell 6: Bosc Nocturn",
        pregunta: "Quin insecte nocturn manté una melodia constant a les nits d'estiu?",
        opcions: [
          { text: "A) El grill de bosc.", correcta: true, tts: "Opció A: El grill de bosc." },
          { text: "B) La mosca de dia.", correcta: false, tts: "Opció B: La mosca de dia." }
        ]
      },
      {
        nivell: "Nivell 6: Bosc Nocturn",
        pregunta: "Com es descriu l'ambient sonor d'un bosc a la mitjanit?",
        opcions: [
          { text: "A) Un silenci profund trencat per sons misteriosos.", correcta: true, tts: "Opció A: Un silenci profund trencat per sons misteriosos." },
          { text: "B) Una cridòria constant d'ocells diürns.", correcta: false, tts: "Opció B: Una cridòria constant d'ocells diürns." }
        ]
      },
      {
        nivell: "Nivell 6: Bosc Nocturn",
        pregunta: "Quin mamífer volador emet petits sons aguts quasi imperceptibles a la nit?",
        opcions: [
          { text: "A) El ratpenat.", correcta: true, tts: "Opció A: El ratpenat." },
          { text: "B) L'esquirol vermell.", correcta: false, tts: "Opció B: L'esquirol vermell." }
        ]
      }
    ],
    7: [
      {
        nivell: "Nivell 7: Grans Animals",
        pregunta: "Quin tipus de so llança el cérvol mascle a la tardor per marcar territori?",
        opcions: [
          { text: "A) Un bram potent que ressona lluny.", correcta: true, tts: "Opció A: Un bram potent que ressona lluny." },
          { text: "B) Un refilet fluixet d'ocell.", correcta: false, tts: "Opció B: Un refilet fluixet d'ocell." }
        ]
      },
      {
        nivell: "Nivell 7: Grans Animals",
        pregunta: "Quan un porc senglar camina pel bosc sense amagar-se, com sona?",
        opcions: [
          { text: "A) Un trepitjar fort de branques i esbufecs.", correcta: true, tts: "Opció A: Un trepitjar fort de branques i esbufecs." },
          { text: "B) Passos suaus i silenciosos com un gat.", correcta: false, tts: "Opció B: Passos suaus i silenciosos com un gat." }
        ]
      },
      {
        nivell: "Nivell 7: Grans Animals",
        pregunta: "Si un os camina prop del riu, el so del seu pas denota que és un animal:",
        options: null, // Utilitzem opcions struct
        opcions: [
          { text: "A) Feixuc, gran i de trepitjada contundent.", correcta: true, tts: "Opció A: Feixuc, gran i de trepitjada contundent." },
          { text: "B) Molt lleuger que no toca el terra.", correcta: false, tts: "Opció B: Molt lleuger que no toca el terra." }
        ]
      },
      {
        nivell: "Nivell 7: Grans Animals",
        pregunta: "Quin so d'alerta fa una daina o un cabirol quan detecta perill?",
        opcions: [
          { text: "A) Un lladruc sec i brusc.", correcta: true, tts: "Opció A: Un lladruc sec i brusc." },
          { text: "B) Un zumzeig musical.", correcta: false, tts: "Opció B: Un zumzeig musical." }
        ]
      }
    ],
    8: [
      {
        nivell: "Nivell 8: Els Insectes",
        pregunta: "Quin insecte genera un zumzeig constant mentre vola buscant pol·len?",
        opcions: [
          { text: "A) L'abella obrera.", correcta: true, tts: "Opció A: L'abella obrera." },
          { text: "B) El grill amagat.", correcta: false, tts: "Opció B: El grill amagat." }
        ]
      },
      {
        nivell: "Nivell 8: Els Insectes",
        pregunta: "A les hores de màxima calor a l'estiu, quin insecte fa un soroll rítmic i estrident?",
        opcions: [
          { text: "A) La cigala.", correcta: true, tts: "Opció A: La cigala." },
          { text: "B) La tana.", correcta: false, tts: "Opció B: La tana." }
        ]
      },
      {
        nivell: "Nivell 8: Els Insectes",
        pregunta: "Com sona el vol d'un escarabat gran que passa a prop de la teva orella?",
        opcions: [
          { text: "A) Un brunzit greu, pesat i sorollós.", correcta: true, tts: "Opció A: Un brunzit greu, pesat i sorollós." },
          { text: "B) Un xiulet agut de plàstic.", correcta: false, tts: "Opció B: Un xiulet agut de plàstic." }
        ]
      },
      {
        nivell: "Nivell 8: Els Insectes",
        pregunta: "Quan hi ha un rusc d'abelles sencer treballant, quin so fan en comunitat?",
        opcions: [
          { text: "A) Un murmuri o remor vibrant col·lectiu.", correcta: true, tts: "Opció A: Un murmuri o remor vibrant col·lectiu." },
          { text: "B) Cops intermitents.", correcta: false, tts: "Opció B: Cops intermitents." }
        ]
      }
    ],
    9: [
      {
        nivell: "Nivell 9: La Tempesta",
        pregunta: "Quin és el 'grunyit de la terra' que se sent retrunyir durant la tempesta?",
        opcions: [
          { text: "A) El tro que acompanya els llamps.", correcta: true, tts: "Opció A: El tro que acompanya els llamps." },
          { text: "B) El cant i brunzit de les abelles.", correcta: false, tts: "Opció B: El cant i brunzit de les abelles." }
        ]
      },
      {
        nivell: "Nivell 9: La Tempesta",
        pregunta: "Què passa amb la temperatura de l'aire just abans de la tempesta?",
        opcions: [
          { text: "A) L'aire es torna fresc de cop i el cel s'enfosqueix.", correcta: true, tts: "Opció A: L'aire es torna fresc de cop i el cel s'enfosqueix." },
          { text: "B) Comença a fer una calor extrema que crema.", correcta: false, tts: "Opció B: Comença a fer una calor extrema que crema." }
        ]
      },
      {
        nivell: "Nivell 9: La Tempesta",
        pregunta: "Quin és el so característic del vent huracanat que bufa fort enmig de la tempesta?",
        opcions: [
          { text: "A) Un xiulet intens i furiós que fa tremolar les branques.", correcta: true, tts: "Opció A: Un xiulet intens i furiós que fa tremolar les branques." },
          { text: "B) Un murmuri dolç de bressol.", correcta: false, tts: "Opció B: Un murmuri dolç de bressol." }
        ]
      },
      {
        nivell: "Nivell 9: La Tempesta",
        pregunta: "Quan cau una pedregada forta, com ressona contra el terra de la natura?",
        opcions: [
          { text: "A) Un bombardeig de cops secs i violents.", correcta: true, tts: "Opció A: Un bombardeig de cops secs i violents." },
          { text: "B) Un frec silenciós.", correcta: false, tts: "Opció B: Un frec silenciós." }
        ]
      }
    ]
  };

  // Generador numèric a partir de la Llavor (Seed)
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

  // Funció per triar 1 pregunta de cada nivell de forma pseudoaleatòria controlada per la seed
  function prepararPartidaAmbLlavor() {
    const llavorOriginal = localStorage.getItem("seed") || "12345";
    preguntesSeleccionades = [];

    // Per cada un dels 9 nivells en triem una de les 4 preguntes
    for (let i = 1; i <= 9; i++) {
      // Modifiquem dinàmicament la llavor per a cada nivell per no obtenir sempre el mateix índex
      const llavorNivell = llavorOriginal + "-" + i;
      const r = seededRandom(llavorNivell);
      
      const llistaPreguntesDelNivell = bancPreguntes[i];
      // Triem un índex entre 0 i 3
      const indexTriat = Math.floor(r * llistaPreguntesDelNivell.length);
      
      preguntesSeleccionades.push(llistaPreguntesDelNivell[indexTriat]);
    }
  }

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

  function carregarPregunta() {
    if (indexPartida >= preguntesSeleccionades.length) {
      // S'han superat les 9 preguntes triades
      document.getElementById("zona-preguntes").style.display = "none";
      zonaSeguent.style.display = "block";
      finalitzarPartida();
      parlar("Has completat el Gran Repàs! Felicitats, explorador!", () => {
        btnSeguent.focus();
      });
      return;
    }

    const dadesPregunta = preguntesSeleccionades[indexPartida];

    // Actualització visual i de veu del contenidor
    numPreguntaTitol.innerText = `Pregunta ${indexPartida + 1} de ${preguntesSeleccionades.length} (${dadesPregunta.nivell})`;
    numPreguntaTitol.setAttribute("data-tts", `Pregunta ${indexPartida + 1} de ${preguntesSeleccionades.length}. Categoria: ${dadesPregunta.nivell}`);
    
    textPregunta.innerText = dadesPregunta.pregunta;
    textPregunta.setAttribute("data-tts", dadesPregunta.pregunta);
    
    contenidorOpcions.innerHTML = "";

    // Creació dinàmica dels botons de resposta
    dadesPregunta.opcions.forEach((opcio) => {
      const boto = document.createElement("button");
      boto.type = "button";
      boto.className = "btn-resposta";
      boto.innerText = opcio.text;
      boto.setAttribute("data-tts", opcio.tts);

      boto.addEventListener("click", () => {
        if (opcio.correcta) {
          const botons = contenidorOpcions.querySelectorAll(".btn-resposta");
          botons.forEach((b) => b.disabled = true);

          boto.classList.add("is-correct");
          boto.setAttribute("aria-invalid", "false");
          boto.style.backgroundColor = "#285834";
          boto.style.borderColor = "#85e39d";
          boto.style.color = "#ffffff";

          parlar("Correcte.", () => {
            indexPartida++;
            carregarPregunta();
          });
        } else {
          boto.classList.add("is-failed");
          boto.setAttribute("aria-invalid", "true");
          boto.style.backgroundColor = "#5c1d1d";
          boto.style.borderColor = "#e74c3c";
          boto.style.color = "#ffffff";

          boto.focus();
          parlar("Oh, aquesta no és correcta. Continua intentant-ho.");
        }
      });

      contenidorOpcions.appendChild(boto);
    });

    actualitzarLectorsVeu();
    reassignarEsdevenimentsTeclat();
  }

  function finalitzarPartida() {
    const nivellActual = 10;
    $.ajax({
      url: "https://fun.codelearn.cat/hackathon/game/finalize",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        game_id: localStorage.getItem("currentGameID"),
        data: { nivell: nivellActual },
        score: 100,
      }),
    })
      .done((response) => {
        console.log("Progrés guardat correctament:", response);
        localStorage.setItem("currentLevel", nivellActual);
      })
      .fail((error) => {
        console.error("Error guardant el progrés:", error);
      });

      //clear localStorage items related to the game
      localStorage.removeItem("currentGameID");
      localStorage.removeItem("seed");
      localStorage.removeItem("currentLevel");

      setTimeout(() => {
        //go to the first page of the game
        window.location.href = "/index.html";
      }, 5000);

  }



  // INTERACCIÓ AMB TECLAT (REASSIGNABLE)
  function reassignarEsdevenimentsTeclat() {
    const menuButtons = document.querySelectorAll("[data-tts]");

    const setActiveButton = (button) => {
      menuButtons.forEach((menuButton) => {
        menuButton.classList.remove("is-active");
        menuButton.removeAttribute("aria-current");
      });
      button.classList.add("is-active");
      button.setAttribute("aria-current", "true");
    };

    menuButtons.forEach((button) => {
      button.addEventListener("focus", () => {
        setActiveButton(button);
      });
      button.addEventListener("blur", () => {
        button.classList.remove("is-active");
        button.removeAttribute("aria-current");
      });
    });
  }

  const moveFocus = (direction) => {
    const menuButtons = Array.from(document.querySelectorAll("[data-tts]"));
    const activeElement = document.activeElement;
    const currentIndex = menuButtons.indexOf(activeElement);

    if (currentIndex === -1) {
      if (menuButtons.length > 0) menuButtons[0].focus();
      return;
    }

    const nextIndex = (currentIndex + direction + menuButtons.length) % menuButtons.length;
    menuButtons[nextIndex].focus();
  };

  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    const isNextKey = ["arrowdown", "s", "arrowright", "d"].includes(key);
    const isPrevKey = ["arrowup", "w", "arrowleft", "a"].includes(key);

    if (isNextKey) {
      event.preventDefault();
      moveFocus(1);
    } else if (isPrevKey) {
      event.preventDefault();
      moveFocus(-1);
    }
  });

  // Execució inicial del generador per llavors i arrancada
  prepararPartidaAmbLlavor();
  carregarPregunta();
});