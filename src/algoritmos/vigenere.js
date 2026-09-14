/**
 * Módulo del Cifrado Vigenère para la Máquina Mini Enigma.
 * Implementa cifrado polialfabético sobre el alfabeto español explícito de 27 letras (incluyendo Ñ/ñ).
 */

const { ALFABETO_MAYUS, ALFABETO_MINUS } = require('./cesar');
const MODULO = ALFABETO_MAYUS.length; // 27

/**
 * Obtiene el índice numérico [0..26] de un carácter dentro del alfabeto español.
 * Si el carácter no está en el alfabeto, devuelve -1.
 * @param {string} char 
 * @returns {number}
 */
function getIndiceAlfabeto(char) {
  const idxMayus = ALFABETO_MAYUS.indexOf(char);
  if (idxMayus !== -1) return idxMayus;
  const idxMinus = ALFABETO_MINUS.indexOf(char);
  if (idxMinus !== -1) return idxMinus;
  return -1;
}

/**
 * Encripta un texto plano aplicando el Cifrado Vigenère.
 * @param {string} texto - Texto a encriptar.
 * @param {object} parametros - { clave: string }
 * @returns {string} Texto encriptado.
 */
function encriptar(texto, parametros) {
  validarParametros(parametros);
  const clave = parametros.clave;
  let resultado = '';
  let keyIndex = 0;

  for (let i = 0; i < texto.length; i++) {
    const char = texto[i];
    const idxMayus = ALFABETO_MAYUS.indexOf(char);
    const idxMinus = ALFABETO_MINUS.indexOf(char);

    if (idxMayus !== -1 || idxMinus !== -1) {
      // Obtener el desplazamiento a partir de la letra actual de la clave
      const keyChar = clave[keyIndex % clave.length];
      let shift = getIndiceAlfabeto(keyChar);
      if (shift === -1) shift = 0; // Fallback si la clave tiene caracteres fuera del alfabeto

      if (idxMayus !== -1) {
        const nuevoIdx = (idxMayus + shift) % MODULO;
        resultado += ALFABETO_MAYUS[nuevoIdx];
      } else {
        const nuevoIdx = (idxMinus + shift) % MODULO;
        resultado += ALFABETO_MINUS[nuevoIdx];
      }

      keyIndex++;
    } else {
      // Mantener caracteres no alfabéticos sin avanzar el puntero de la clave
      resultado += char;
    }
  }

  return resultado;
}

/**
 * Desencripta un texto aplicando la operación inversa del Cifrado Vigenère.
 * @param {string} textoEncriptado - Texto a desencriptar.
 * @param {object} parametros - { clave: string }
 * @returns {string} Texto plano original.
 */
function desencriptar(textoEncriptado, parametros) {
  validarParametros(parametros);
  const clave = parametros.clave;
  let resultado = '';
  let keyIndex = 0;

  for (let i = 0; i < textoEncriptado.length; i++) {
    const char = textoEncriptado[i];
    const idxMayus = ALFABETO_MAYUS.indexOf(char);
    const idxMinus = ALFABETO_MINUS.indexOf(char);

    if (idxMayus !== -1 || idxMinus !== -1) {
      const keyChar = clave[keyIndex % clave.length];
      let shift = getIndiceAlfabeto(keyChar);
      if (shift === -1) shift = 0;

      if (idxMayus !== -1) {
        const nuevoIdx = (idxMayus - shift + MODULO) % MODULO;
        resultado += ALFABETO_MAYUS[nuevoIdx];
      } else {
        const nuevoIdx = (idxMinus - shift + MODULO) % MODULO;
        resultado += ALFABETO_MINUS[nuevoIdx];
      }

      keyIndex++;
    } else {
      resultado += char;
    }
  }

  return resultado;
}

/**
 * Valida los parámetros del Cifrado Vigenère.
 * @param {object} parametros 
 */
function validarParametros(parametros) {
  if (!parametros || !parametros.clave || typeof parametros.clave !== 'string' || parametros.clave.trim() === '') {
    throw new Error('Debe especificar una "clave" no vacía para el algoritmo Vigenère.');
  }
}

module.exports = {
  nombre: 'Vigenère',
  claveNombre: 'vigenere',
  encriptar,
  desencriptar,
  validarParametros
};
