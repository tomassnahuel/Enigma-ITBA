/**
 * Módulo de la Interfaz de Usuario (CLI) basada en Node.js readline nativo.
 * Incluye navegación interactiva por teclado (flechas arriba/abajo y selección por número)
 * con formateo ANSI estilizado.
 */

const readline = require('readline');

// Códigos de estilo y color ANSI nativos
const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  brightCyan: '\x1b[96m',
  green: '\x1b[32m',
  brightGreen: '\x1b[92m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  brightRed: '\x1b[91m',
  magenta: '\x1b[35m',
  gray: '\x1b[90m',
  white: '\x1b[97m'
};

/**
 * Crea una interfaz readline conectada a process.stdin y process.stdout.
 * @returns {readline.Interface}
 */
function crearInterfaz() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

/**
 * Realiza una pregunta simple al usuario con formateo ANSI.
 * @param {readline.Interface} rl 
 * @param {string} promptText 
 * @returns {Promise<string>}
 */
function preguntar(rl, promptText) {
  return new Promise((resolve) => {
    if (process.stdin.isTTY) {
      try {
        process.stdin.setRawMode(false);
      } catch (e) {}
    }
    rl.resume();
    rl.question(`${C.bold}${C.cyan}▸ ${promptText}${C.reset}`, (respuesta) => {
      resolve(respuesta.trim());
    });
  });
}

/**
 * Muestra un menú de selección interactivo navegable con flechas arriba (↑) y abajo (↓) o números.
 * @param {readline.Interface} rl 
 * @param {Array<{id: string, label: string, desc?: string, value?: string}>} opciones 
 * @param {string} titulo 
 * @returns {Promise<{id: string, label: string, desc?: string, value?: string}>}
 */
function seleccionarOpcion(rl, opciones, titulo) {
  return new Promise((resolve) => {
    // Si no estamos en una terminal TTY interactiva, usar fallback al prompt tradicional
    if (!process.stdin.isTTY) {
      console.log(`\n${C.bold}${C.cyan}=== ${titulo} ===${C.reset}`);
      opciones.forEach((opc) => console.log(`${opc.id}. ${opc.label}`));
      rl.question(`${C.bold}${C.cyan}Seleccione una opción: ${C.reset}`, (ans) => {
        const val = ans.trim();
        const selected = opciones.find(o => o.id === val) || opciones[parseInt(val, 10) - 1] || opciones[0];
        resolve(selected);
      });
      return;
    }

    let selectedIndex = 0;

    readline.emitKeypressEvents(process.stdin);
    try {
      process.stdin.setRawMode(true);
    } catch (e) {}
    process.stdin.resume();
    process.stdout.write('\x1B[?25l'); // Ocultar cursor durante la navegación por menú

    function render() {
      console.clear();
      console.log(`${C.bold}${C.cyan}╔══════════════════════════════════════════════════════╗${C.reset}`);
      console.log(`${C.bold}${C.cyan}║  ${C.brightGreen}${titulo.padEnd(50)}${C.cyan}  ║${C.reset}`);
      console.log(`${C.bold}${C.cyan}╠══════════════════════════════════════════════════════╣${C.reset}`);
      console.log(`${C.gray}   Usa las flechas ${C.bold}↑ / ↓${C.reset}${C.gray} o los números ${C.bold}[1-${opciones.length}]${C.reset}${C.gray} y presiona ${C.bold}ENTER${C.reset}\n`);

      opciones.forEach((opc, idx) => {
        const isSelected = idx === selectedIndex;
        const prefix = isSelected ? `${C.brightGreen}${C.bold}  ❯ ` : '    ';
        const itemNumber = opc.id ? `${C.dim}[${opc.id}]${C.reset} ` : '';
        
        let labelText = isSelected
          ? `${C.brightGreen}${C.bold}${opc.label}${C.reset}`
          : `${C.white}${opc.label}${C.reset}`;

        console.log(`${prefix}${itemNumber}${labelText}`);

        if (isSelected && opc.desc) {
          console.log(`        ${C.dim}${C.yellow}↳ ${opc.desc}${C.reset}`);
        }
      });

      console.log(`\n${C.cyan}╚══════════════════════════════════════════════════════╝${C.reset}\n`);
    }

    render();

    function onKeypress(str, key) {
      const keyName = key ? key.name : null;

      if (keyName === 'up' || keyName === 'w') {
        selectedIndex = (selectedIndex - 1 + opciones.length) % opciones.length;
        render();
      } else if (keyName === 'down' || keyName === 's') {
        selectedIndex = (selectedIndex + 1) % opciones.length;
        render();
      } else if (keyName === 'return' || keyName === 'enter' || str === '\r' || str === '\n') {
        cleanup();
        resolve(opciones[selectedIndex]);
      } else if (str && /^[1-9]$/.test(str)) {
        const idx = opciones.findIndex(o => o.id === str);
        if (idx !== -1) {
          selectedIndex = idx;
          render();
        }
      } else if (key && key.ctrl && key.name === 'c') {
        cleanup();
        process.exit(0);
      }
    }

    function cleanup() {
      process.stdin.removeListener('keypress', onKeypress);
      try {
        if (process.stdin.isTTY) {
          process.stdin.setRawMode(false);
        }
      } catch (e) {}
      process.stdout.write('\x1B[?25h'); // Restaurar cursor visible
    }

    process.stdin.on('keypress', onKeypress);
  });
}

/**
 * Solicita un bloque de texto al usuario, permitiendo pegar múltiples líneas.
 * @param {readline.Interface} rl 
 * @returns {Promise<string>}
 */
function solicitarTextoMultilinea(rl) {
  return new Promise((resolve) => {
    if (process.stdin.isTTY) {
      try {
        process.stdin.setRawMode(false);
      } catch (e) {}
    }
    rl.resume();

    console.log(`\n${C.bold}${C.magenta}┌──────────────────────────────────────────────────────┐${C.reset}`);
    console.log(`${C.bold}${C.magenta}│ ENTRADA DE TEXTO PLANO                               │${C.reset}`);
    console.log(`${C.bold}${C.magenta}└──────────────────────────────────────────────────────┘${C.reset}`);
    console.log(`${C.yellow}  Ingresa o pega tu texto. Presiona [ENTER] en una línea${C.reset}`);
    console.log(`${C.yellow}  vacía para finalizar la entrada:${C.reset}\n`);

    const lineas = [];
    const onLine = (line) => {
      if (line === '' || line === 'END') {
        rl.removeListener('line', onLine);
        resolve(lineas.join('\n'));
      } else {
        lineas.push(line);
      }
    };

    rl.on('line', onLine);
  });
}

/**
 * Imprime un mensaje de éxito formateado.
 * @param {string} titulo 
 * @param {Array<{label: string, valor: string}>} detalles 
 */
function mostrarExito(titulo, detalles = []) {
  console.log(`\n${C.bold}${C.brightGreen}┌──────────────────────────────────────────────────────┐${C.reset}`);
  console.log(`${C.bold}${C.brightGreen}│ ✔ ${titulo.padEnd(50)} │${C.reset}`);
  console.log(`${C.bold}${C.brightGreen}├──────────────────────────────────────────────────────┤${C.reset}`);
  detalles.forEach(item => {
    const lbl = `${item.label}:`.padEnd(20);
    console.log(`${C.brightGreen}│ ${C.white}${lbl} ${C.yellow}${item.valor.padEnd(31)}${C.brightGreen}│${C.reset}`);
  });
  console.log(`${C.bold}${C.brightGreen}└──────────────────────────────────────────────────────┘${C.reset}\n`);
}

/**
 * Imprime un mensaje de error formateado.
 * @param {string} mensaje 
 */
function mostrarError(mensaje) {
  console.log(`\n${C.bold}${C.brightRed}┌──────────────────────────────────────────────────────┐${C.reset}`);
  console.log(`${C.bold}${C.brightRed}│ ✖ ERROR: ${mensaje.padEnd(44)} │${C.reset}`);
  console.log(`${C.bold}${C.brightRed}└──────────────────────────────────────────────────────┘${C.reset}\n`);
}

module.exports = {
  crearInterfaz,
  preguntar,
  seleccionarOpcion,
  solicitarTextoMultilinea,
  mostrarExito,
  mostrarError,
  C
};
