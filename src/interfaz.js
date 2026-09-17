/**
 * Módulo de la Interfaz de Usuario (CLI) basada en Node.js readline nativo.
 * Incluye navegación interactiva por teclado (flechas arriba/abajo y selección por número)
 * con formateo ANSI estilizado y alineación gráfica robusta.
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
  brightYellow: '\x1b[93m',
  red: '\x1b[31m',
  brightRed: '\x1b[91m',
  magenta: '\x1b[35m',
  brightMagenta: '\x1b[95m',
  gray: '\x1b[90m',
  white: '\x1b[97m'
};

const ANCHO_CAJA = 62; // Ancho estándar de tarjetas y cajas

/**
 * Elimina las secuencias de escape ANSI para calcular la longitud visual real de un string.
 * @param {string} str 
 * @returns {string}
 */
function stripAnsi(str) {
  return String(str || '').replace(/\x1b\[[0-9;]*m/g, '');
}

/**
 * Obtiene la longitud visual de un string en terminal (sin códigos ANSI).
 * @param {string} str 
 * @returns {number}
 */
function longitudVisual(str) {
  return stripAnsi(str).length;
}

/**
 * Centra un texto dentro de un ancho determinado.
 * @param {string} texto 
 * @param {number} ancho 
 * @returns {string}
 */
function centrarTexto(texto, ancho = ANCHO_CAJA) {
  const len = longitudVisual(texto);
  if (len >= ancho) return texto;
  const margenIzq = Math.floor((ancho - len) / 2);
  const margenDer = ancho - len - margenIzq;
  return ' '.repeat(margenIzq) + texto + ' '.repeat(margenDer);
}

/**
 * Divide un texto largo en múltiples líneas que no superen el ancho máximo especificado.
 * @param {string} texto 
 * @param {number} anchoMax 
 * @returns {string[]}
 */
function envolverTexto(texto, anchoMax) {
  const palabras = String(texto).split(' ');
  const lineas = [];
  let lineaActual = '';

  for (const palabra of palabras) {
    if (!lineaActual) {
      lineaActual = palabra;
    } else if (longitudVisual(lineaActual + ' ' + palabra) <= anchoMax) {
      lineaActual += ' ' + palabra;
    } else {
      lineas.push(lineaActual);
      lineaActual = palabra;
    }
  }

  if (lineaActual) {
    lineas.push(lineaActual);
  }

  return lineas.length > 0 ? lineas : [''];
}

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
    if (rl.closed) {
      resolve('');
      return;
    }
    if (process.stdin.isTTY) {
      try {
        process.stdin.setRawMode(false);
      } catch (e) {}
    }
    try {
      rl.resume();
    } catch (e) {}

    try {
      rl.question(`${C.bold}${C.cyan}▸ ${promptText}${C.reset}`, (respuesta) => {
        resolve((respuesta || '').trim());
      });
    } catch (e) {
      resolve('');
    }
  });
}

/**
 * Muestra un menú de selección interactivo navegable con flechas arriba (↑) y abajo (↓) o números.
 * @param {readline.Interface} rl 
 * @param {Array<{id: string, label: string, desc?: string, value?: string, key?: string}>} opciones 
 * @param {string} titulo 
 * @returns {Promise<{id: string, label: string, desc?: string, value?: string, key?: string}>}
 */
function seleccionarOpcion(rl, opciones, titulo) {
  return new Promise((resolve) => {
    if (rl.closed) {
      resolve(opciones[opciones.length - 1]); // Salir si el stream se cerró
      return;
    }

    // Si no estamos en una terminal TTY interactiva, usar fallback al prompt tradicional
    if (!process.stdin.isTTY) {
      console.log(`\n${C.bold}${C.cyan}=== ${titulo} ===${C.reset}`);
      opciones.forEach((opc) => console.log(`  [${opc.id}] ${opc.label}${opc.desc ? ` - ${opc.desc}` : ''}`));
      try {
        rl.question(`\n${C.bold}${C.cyan}Seleccione una opción [1-${opciones.length}]: ${C.reset}`, (ans) => {
          const val = (ans || '').trim();
          const selected = opciones.find(o => o.id === val) || opciones[parseInt(val, 10) - 1];
          if (selected) {
            resolve(selected);
          } else {
            mostrarError(`Opción "${val}" no válida. Seleccionando la primera opción.`);
            resolve(opciones[0]);
          }
        });
      } catch (e) {
        resolve(opciones[opciones.length - 1]);
      }
      return;
    }

    let selectedIndex = 0;

    readline.emitKeypressEvents(process.stdin);
    try {
      process.stdin.setRawMode(true);
    } catch (e) {}
    process.stdin.resume();
    process.stdout.write('\x1B[?25l'); // Ocultar cursor durante la navegación

    function render() {
      console.clear();

      const tituloCentrado = centrarTexto(titulo, ANCHO_CAJA - 4);

      console.log(`${C.bold}${C.cyan}╔══════════════════════════════════════════════════════════════╗${C.reset}`);
      console.log(`${C.bold}${C.cyan}║  ${C.brightGreen}${tituloCentrado}${C.cyan}  ║${C.reset}`);
      console.log(`${C.bold}${C.cyan}╚══════════════════════════════════════════════════════════════╝${C.reset}`);
      console.log(`${C.gray}  Navega con ${C.bold}↑ / ↓${C.reset}${C.gray} o escribe el número ${C.bold}[1-${opciones.length}]${C.reset}${C.gray} y presiona ${C.bold}ENTER${C.reset}\n`);

      opciones.forEach((opc, idx) => {
        const isSelected = idx === selectedIndex;
        const prefix = isSelected ? `${C.brightGreen}${C.bold}  ❯ ` : '    ';
        const itemNumber = opc.id ? `${C.brightYellow}[${opc.id}]${C.reset} ` : '';

        const labelText = isSelected
          ? `${C.brightGreen}${C.bold}${opc.label}${C.reset}`
          : `${C.white}${opc.label}${C.reset}`;

        console.log(`${prefix}${itemNumber}${labelText}`);

        if (isSelected && opc.desc) {
          console.log(`        ${C.dim}${C.yellow}↳ ${opc.desc}${C.reset}`);
        }
      });

      console.log(`\n${C.gray}──────────────────────────────────────────────────────────────${C.reset}\n`);
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
          cleanup();
          resolve(opciones[selectedIndex]);
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
 * Solicita un bloque de texto al usuario, permitiendo ingresar o pegar texto multilínea.
 * @param {readline.Interface} rl 
 * @returns {Promise<string>}
 */
function solicitarTextoMultilinea(rl) {
  if (rl.closed) {
    return Promise.resolve('');
  }

  // En modo no interactivo (piped / CI), leer directamente una línea para evitar desincronización de stream
  if (!process.stdin.isTTY) {
    return preguntar(rl, 'Ingrese el texto plano a encriptar: ');
  }

  return new Promise((resolve) => {
    try {
      process.stdin.setRawMode(false);
    } catch (e) {}
    try {
      rl.resume();
    } catch (e) {}

    const titulo = centrarTexto('ENTRADA DE TEXTO PLANO', ANCHO_CAJA - 4);
    console.log(`\n${C.bold}${C.magenta}╔══════════════════════════════════════════════════════════════╗${C.reset}`);
    console.log(`${C.bold}${C.magenta}║  ${C.brightMagenta}${titulo}${C.magenta}  ║${C.reset}`);
    console.log(`${C.bold}${C.magenta}╚══════════════════════════════════════════════════════════════╝${C.reset}`);
    console.log(`${C.yellow}  Escribe o pega tu texto. Para finalizar, presiona [ENTER]${C.reset}`);
    console.log(`${C.yellow}  en una línea vacía (o escribe EOF o :end):${C.reset}\n`);

    const lineas = [];
    const onLine = (line) => {
      const trimmed = line.trim();
      if (trimmed === 'EOF' || trimmed === ':end' || (line === '' && lineas.length > 0)) {
        cleanup();
        resolve(lineas.join('\n'));
      } else if (line === '' && lineas.length === 0) {
        cleanup();
        resolve('');
      } else {
        lineas.push(line);
      }
    };

    const onClose = () => {
      cleanup();
      resolve(lineas.join('\n'));
    };

    function cleanup() {
      rl.removeListener('line', onLine);
      rl.removeListener('close', onClose);
    }

    rl.on('line', onLine);
    rl.once('close', onClose);
  });
}

/**
 * Imprime un mensaje de éxito formateado con alineación perfecta.
 * @param {string} titulo 
 * @param {Array<{label: string, valor: string}>} detalles 
 */
function mostrarExito(titulo, detalles = []) {
  const anchoInterior = ANCHO_CAJA - 4;
  const headerTexto = `✔ ${titulo}`;
  const headerPad = headerTexto.padEnd(anchoInterior);

  console.log(`\n${C.bold}${C.brightGreen}┌──────────────────────────────────────────────────────────────┐${C.reset}`);
  console.log(`${C.bold}${C.brightGreen}│  ${headerPad.slice(0, anchoInterior)}  │${C.reset}`);
  console.log(`${C.bold}${C.brightGreen}├──────────────────────────────────────────────────────────────┤${C.reset}`);

  detalles.forEach(item => {
    const lbl = `${item.label}: `;
    const valorStr = String(item.valor || '');
    const anchoMaxVal = anchoInterior - lbl.length;

    if (valorStr.length <= anchoMaxVal) {
      const fila = (lbl + valorStr).padEnd(anchoInterior);
      console.log(`${C.brightGreen}│  ${C.white}${lbl}${C.brightYellow}${valorStr.padEnd(anchoInterior - lbl.length)}${C.brightGreen}  │${C.reset}`);
    } else {
      // Si el valor es largo (ej. ruta larga o JSON grande), envolverlo limpiamente
      console.log(`${C.brightGreen}│  ${C.white}${lbl.padEnd(anchoInterior)}${C.brightGreen}  │${C.reset}`);
      const lineasVal = envolverTexto(valorStr, anchoInterior - 2);
      lineasVal.forEach(l => {
        console.log(`${C.brightGreen}│    ${C.brightYellow}${l.padEnd(anchoInterior - 2)}${C.brightGreen}  │${C.reset}`);
      });
    }
  });

  console.log(`${C.bold}${C.brightGreen}└──────────────────────────────────────────────────────────────┘${C.reset}\n`);
}

/**
 * Imprime un mensaje de error formateado con auto-envoltura de texto.
 * @param {string} mensaje 
 */
function mostrarError(mensaje) {
  const anchoInterior = ANCHO_CAJA - 4;
  const lineas = envolverTexto(mensaje, anchoInterior);

  console.log(`\n${C.bold}${C.brightRed}┌──────────────────────────────────────────────────────────────┐${C.reset}`);
  console.log(`${C.bold}${C.brightRed}│  ✖ ERROR:                                                    │${C.reset}`);
  console.log(`${C.bold}${C.brightRed}├──────────────────────────────────────────────────────────────┤${C.reset}`);
  lineas.forEach(l => {
    console.log(`${C.brightRed}│  ${C.white}${l.padEnd(anchoInterior)}${C.brightRed}  │${C.reset}`);
  });
  console.log(`${C.bold}${C.brightRed}└──────────────────────────────────────────────────────────────┘${C.reset}\n`);
}

/**
 * Imprime un bloque de texto plano recuperado de forma clara y destacada.
 * @param {string} titulo 
 * @param {string} texto 
 */
function mostrarResultadoTexto(titulo, texto) {
  const tituloCentrado = centrarTexto(titulo, ANCHO_CAJA - 4);

  console.log(`${C.bold}${C.brightCyan}╔══════════════════════════════════════════════════════════════╗${C.reset}`);
  console.log(`${C.bold}${C.brightCyan}║  ${C.white}${tituloCentrado}${C.brightCyan}  ║${C.reset}`);
  console.log(`${C.bold}${C.brightCyan}╚══════════════════════════════════════════════════════════════╝${C.reset}`);
  console.log(`${C.white}${texto}${C.reset}`);
  console.log(`\n${C.gray}──────────────────────────────────────────────────────────────${C.reset}\n`);
}

module.exports = {
  crearInterfaz,
  preguntar,
  seleccionarOpcion,
  solicitarTextoMultilinea,
  mostrarExito,
  mostrarError,
  mostrarResultadoTexto,
  stripAnsi,
  centrarTexto,
  envolverTexto,
  C
};

