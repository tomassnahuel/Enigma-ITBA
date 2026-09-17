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
  const invVal = parametros && parametros.invertirNumeros !== undefined ? String(parametros.invertirNumeros).toLowerCase().trim() : 'false';
  const invertirNum = ['true', 'si', 's', '1', 'yes', 'y'].includes(invVal) || (parametros && parametros.invertirNumeros === true);
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
  if (parametros && parametros.invertirNumeros !== undefined && parametros.invertirNumeros !== null) {
    const val = String(parametros.invertirNumeros).toLowerCase().trim();
    if (!['true', 'false', 'si', 'no', 's', 'n', '1', '0', 'yes', 'y'].includes(val)) {
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
