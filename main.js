// Lista de 8 pares de emojis (duplicados)
    const emojis = ['🍕','🍕','🚗','🚗','🐶','🐶','🎲','🎲','🎈','🎈','👻','👻','🍎','🍎','🎩','🎩'];

    // Mezclamos las cartas aleatoriamente
    const cartasMezcladas = emojis.sort(() => Math.random() - 0.5);

    // Elementos del DOM
    const tablero = document.getElementById('tablero');
    const tiempoEl = document.getElementById('tiempo');
    const intentosEl = document.getElementById('intentos');
    const mensajeEl = document.getElementById('mensaje');

    // Variables de control
    let cartasVolteadas = []; // cartas seleccionadas
    let intentos = 0;
    let paresEncontrados = 0;
    let tiempo = 0;
    let intervalo = null;
    let bloqueo = false;
    let temporizadorActivo = false;

    // Función que inicia el temporizador
    function iniciarTemporizador() {
      intervalo = setInterval(() => {
        tiempo++;
        tiempoEl.textContent = tiempo;
      }, 1000);
    }

    // Crear las cartas en el DOM
    cartasMezcladas.forEach((emoji, index) => {
      const carta = document.createElement('div');
      carta.classList.add('carta');
      carta.dataset.valor = emoji; // para comparar luego
      carta.dataset.id = index;    // ID único
      carta.textContent = '';      // vacía al inicio
      tablero.appendChild(carta);
    });

    // Manejador de clic en cartas
    tablero.addEventListener('click', (e) => {
      const carta = e.target;

      // Validaciones para evitar errores
      if (!carta.classList.contains('carta') ||
          carta.classList.contains('volteada') ||
          carta.classList.contains('completada') ||
          bloqueo) return;

      // Iniciar temporizador en el primer clic
      if (!temporizadorActivo) {
        iniciarTemporizador();
        temporizadorActivo = true;
      }

      // Voltear la carta y mostrar el emoji
      carta.classList.add('volteada');
      carta.textContent = carta.dataset.valor;
      cartasVolteadas.push(carta);

      // Si ya hay dos cartas volteadas
      if (cartasVolteadas.length === 2) {
        intentos++;
        intentosEl.textContent = intentos;
        bloqueo = true; // bloquea más clics

        const [c1, c2] = cartasVolteadas;

        // Si son iguales
        if (c1.dataset.valor === c2.dataset.valor) {
          c1.classList.add('completada');
          c2.classList.add('completada');
          cartasVolteadas = [];
          bloqueo = false;
          paresEncontrados++;

          // Verifica si el juego ha terminado
          if (paresEncontrados === emojis.length / 2) {
            clearInterval(intervalo);
            mensajeEl.textContent = `🎉 ¡Ganaste en ${intentos} intentos y ${tiempo} segundos!`;
          }

        } else {
          // Si no son iguales, ocultarlas después de 1 segundo
          setTimeout(() => {
            c1.classList.remove('volteada');
            c2.classList.remove('volteada');
            c1.textContent = '';
            c2.textContent = '';
            cartasVolteadas = [];
            bloqueo = false;
          }, 1000);
        }
      }
    });