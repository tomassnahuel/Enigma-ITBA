/**
 * Módulo de la Interfaz de Usuario (CLI) basada en Node.js readline nativo.
 */

const readline = require('readline');

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
 * Realiza una pregunta simple al usuario y retorna la respuesta como una Promesa.
 * @param {readline.Interface} rl 
 * @param {string} promptText 
 * @returns {Promise<string>}
 */
function preguntar(rl, promptText) {
  return new Promise((resolve) => {
    rl.question(promptText, (respuesta) => {
      resolve(respuesta.trim());
    });
  });
}

/**
 * Solicita un bloque de texto al usuario, permitiendo pegar múltiples líneas.
 * El usuario puede finalizar la entrada presionando Enter en una línea vacía o tipeando 'END'.
 * @param {readline.Interface} rl 
 * @returns {Promise<string>}
 */
function solicitarTextoMultilinea(rl) {
  return new Promise((resolve) => {
    console.log('\n==================================================');
    console.log('Ingrese el texto a encriptar (puede pegar texto multilínea).');
    console.log('Presione [ENTER] en una línea vacía para finalizar la entrada:');
    console.log('==================================================\n');

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
 * Muestra el menú principal de la aplicación.
 */
function mostrarMenuPrincipal() {
  console.log('\n==================================================');
  console.log('             MINI ENIGMA - TERMINAL CLI           ');
  console.log('==================================================');
  console.log('1. Encriptar texto');
  console.log('2. Desencriptar archivo');
  console.log('3. Salir');
  console.log('==================================================');
}

/**
 * Muestra el menú de algoritmos disponibles.
 */
function mostrarMenuAlgoritmos() {
  console.log('\n--------------------------------------------------');
  console.log('Seleccione el algoritmo de encriptación:');
  console.log('1. César (Desplazamiento alfabético)');
  console.log('2. Vigenère (Clave alfabética)');
  console.log('3. Atbash (Sustitución simétrica invertida)');
  console.log('4. Transposición (Matriz columnar)');
  console.log('5. XOR (Cifrado binario UTF-8)');
  console.log('--------------------------------------------------');
}

module.exports = {
  crearInterfaz,
  preguntar,
  solicitarTextoMultilinea,
  mostrarMenuPrincipal,
  mostrarMenuAlgoritmos
};
