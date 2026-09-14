/**
 * Módulo del Cifrado Atbash para la Máquina Mini Enigma.
 * Invierte de forma simétrica las posiciones del alfabeto español (27 letras).
 * Incluye parametrización de modo (Estándar vs Extendido con números).
 */

const { ALFABETO_MAYUS, ALFABETO_MINUS } = require('./cesar');
const MODULO = ALFABETO_MAYUS.length; // 27

const DIGITOS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

/**
 * Transforma un texto aplicando la sustitución reflexiva de Atbash.
 * Al ser un cifrado recíproco (auto-inverso), la encriptación y desencriptación son idénticas.
 * @param {string} texto 
 * @param {object} parametros - { invertirNumeros: boolean|string }
 * @returns {string}
 */
function procesarAtbash(texto, parametros = {}) {
  const invertirNum = parametros && (parametros.invertirNumeros === true || parametros.invertirNumeros === 'true' || parametros.invertirNumeros === 'si');
  let resultado = '';

  for (let i = 0; i < texto.length; i++) {
    const char = texto[i];
    const idxMayus = ALFABETO_MAYUS.indexOf(char);
    const idxMinus = ALFABETO_MINUS.indexOf(char);
    const idxDigito = DIGITOS.indexOf(char);

    if (idxMayus !== -1) {
      const nuevoIdx = (MODULO - 1) - idxMayus;
      resultado += ALFABETO_MAYUS[nuevoIdx];
    } else if (idxMinus !== -1) {
      const nuevoIdx = (MODULO - 1) - idxMinus;
      resultado += ALFABETO_MINUS[nuevoIdx];
    } else if (invertirNum && idxDigito !== -1) {
      const nuevoIdx = 9 - idxDigito;
      resultado += DIGITOS[nuevoIdx];
    } else {
      resultado += char;
    }
  }

  return resultado;
}

function encriptar(texto, parametros) {
  validarParametros(parametros);
  return procesarAtbash(texto, parametros);
}

function desencriptar(textoEncriptado, parametros) {
  validarParametros(parametros);
  return procesarAtbash(textoEncriptado, parametros);
}

function validarParametros(parametros) {
  if (parametros && parametros.invertirNumeros !== undefined) {
    const val = String(parametros.invertirNumeros).toLowerCase();
    if (!['true', 'false', 'si', 'no', '1', '0'].includes(val)) {
      throw new Error('El parámetro "invertirNumeros" de Atbash debe ser "si", "no", "true" o "false".');
    }
  }
}

module.exports = {
  nombre: 'Atbash',
  claveNombre: 'atbash',
  encriptar,
  desencriptar,
  validarParametros
};
