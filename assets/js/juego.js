const miModulo = (() => {
  "use strict";
  let deck = [];

  const tipos = ["C", "D", "H", "S"],
    especiales = ["A", "J", "Q", "K"];
  let puntosJugadores = [];

  //Referencias HTML
  const btnPedir = document.querySelector("#btnPedir"),
    btnDetener = document.querySelector("#btnDetener"),
    btnNuevo = document.querySelector("#btnNuevo"),
    puntosHtml = document.querySelectorAll("small");

  const divCartasJugadores = document.querySelectorAll(".divCartas");

  const inicializarJuego = (numJugadores = 2) => {
    deck = crearDeck();
    puntosJugadores = [];
    for (let i = 0; i < numJugadores; i++) {
      puntosJugadores.push(0);
    }

    puntosHtml.forEach((elem) => (elem.innerHTML = 0));
    divCartasJugadores.forEach((elem) => (elem.innerHTML = ""));
    btnDetener.disabled = false;
    btnPedir.disabled = false;
  };

  const crearDeck = () => {
    deck = [];
    for (let i = 2; i <= 10; i++) {
      for (let tipo of tipos) {
        deck.push(i + tipo);
      }
    }
    for (let tipo of tipos) {
      for (let especial of especiales) {
        deck.push(especial + tipo);
      }
    }
    return _.shuffle(deck);
  };

  const pedirCarta = () => {
    if (deck.length === 0) {
      throw "No hay cartas en el Deck";
    }
    return deck.pop();
  };

  const valorCarta = (carta) => {
    const valor = carta.substring(0, carta.length - 1);
    let puntos = 0;
    return isNaN(valor) ? (valor === "A" ? 11 : 10) : valor * 1;
  };

  const acumularPuntos = (carta, turno) => {
    puntosJugadores[turno] += valorCarta(carta);
    puntosHtml[turno].innerText = puntosJugadores[turno];
    return puntosJugadores[turno];
  };

  const crearCarta = (carta, turno) => {
    const imgCarta = document.createElement("img");
    imgCarta.src = `assets/cartas/${carta}.png`;
    imgCarta.classList.add("carta");
    divCartasJugadores[turno].append(imgCarta);
  };

  const determinarGanador = (puntosMinimos) => {
    const [puntosJugador, puntosComputadora] = puntosJugadores;
    setTimeout(() => {
      if (puntosComputadora === puntosJugador) {
        alert("Nadie gana");
      } else if (puntosMinimos > 21) {
        alert("Computadora Gana");
      } else if (puntosComputadora > 21) {
        alert("Jugador gana");
      } else if (puntosMinimos > puntosComputadora) {
        alert("Jugador gana");
      } else if (puntosComputadora > puntosMinimos) {
        alert("Computadora gana");
      }
    }, 50);
  };

  const turnoComputadora = (puntosMinimos) => {
    let puntosComputadora = 0;
    do {
      const carta = pedirCarta();
      puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
      crearCarta(carta, puntosJugadores.length - 1);
    } while (puntosComputadora <= 21 && puntosComputadora <= puntosMinimos);

    determinarGanador(puntosMinimos);
  };

  //Eventos
  btnPedir.addEventListener("click", () => {
    const carta = pedirCarta();
    const puntosJugador = acumularPuntos(carta, 0);
    crearCarta(carta, 0);

    if (puntosJugador > 21) {
      btnPedir.disabled = true;
      btnDetener.disabled = true;
      turnoComputadora(0);
    } else if (puntosJugador === 21) {
      btnPedir.disabled = true;
      btnDetener.disabled = true;
      turnoComputadora(puntosJugador);
    }
  });

  btnDetener.addEventListener("click", () => {
    turnoComputadora(puntosJugadores[0]);
    btnDetener.disabled = true;
    btnPedir.disabled = true;
  });

  //   btnNuevo.addEventListener("click", () => {
  //     inicializarJuego();
  //   });

  return {
    nuevoJuego: inicializarJuego,
  };
})();
