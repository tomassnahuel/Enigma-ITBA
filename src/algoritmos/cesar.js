/**
 * Módulo del Cifrado César para la Máquina Mini Enigma.
 * Trabaja sobre el alfabeto español explícito de 27 letras (incluyendo Ñ/ñ).
 */

const ALFABETO_MAYUS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const ALFABETO_MINUS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'ñ', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const MODULO = ALFABETO_MAYUS.length; // 27

/**
 * Normaliza un desplazamiento a un entero válido en el rango [0, 26].
 * @param {number|string} shift 
 * @returns {number}
 */
function normalizarDesplazamiento(shift) {
  const num = parseInt(shift, 10);
  if (isNaN(num)) {
    throw new Error('El desplazamiento del Cifrado César debe ser un número entero.');
  }
  return ((num % MODULO) + MODULO) % MODULO;
}

/**
 * Encripta un texto plano aplicando el Cifrado César.
 * @param {string} texto - Texto a encriptar.
 * @param {object} parametros - { desplazamiento: number }
 * @returns {string} Texto encriptado.
 */
function encriptar(texto, parametros) {
  const shift = normalizarDesplazamiento(parametros.desplazamiento);
  let resultado = '';

  for (let i = 0; i < texto.length; i++) {
    const char = texto[i];
    const idxMayus = ALFABETO_MAYUS.indexOf(char);
    const idxMinus = ALFABETO_MINUS.indexOf(char);

    if (idxMayus !== -1) {
      const nuevoIdx = (idxMayus + shift) % MODULO;
      resultado += ALFABETO_MAYUS[nuevoIdx];
    } else if (idxMinus !== -1) {
      const nuevoIdx = (idxMinus + shift) % MODULO;
      resultado += ALFABETO_MINUS[nuevoIdx];
    } else {
      // Mantiene caracteres fuera del alfabeto español estándar (acentos, números, signos, etc.)
      resultado += char;
    }
  }

  return resultado;
}

/**
 * Desencripta un texto aplicando el proceso inverso del Cifrado César.
 * @param {string} textoEncriptado - Texto a desencriptar.
 * @param {object} parametros - { desplazamiento: number }
 * @returns {string} Texto plano original.
 */
function desencriptar(textoEncriptado, parametros) {
  const shift = normalizarDesplazamiento(parametros.desplazamiento);
  // La desencriptación es equivalente a encriptar con el desplazamiento negativo
  return encriptar(textoEncriptado, { desplazamiento: MODULO - shift });
}

/**
 * Valida los parámetros del Cifrado César.
 * @param {object} parametros 
 */
function validarParametros(parametros) {
  if (!parametros || parametros.desplazamiento === undefined || parametros.desplazamiento === '') {
    throw new Error('Debe especificar el parámetro "desplazamiento" para el algoritmo César.');
  }
  const shift = parseInt(parametros.desplazamiento, 10);
  if (isNaN(shift)) {
    throw new Error('El parámetro "desplazamiento" debe ser un número entero válido.');
  }
}

module.exports = {
  nombre: 'César',
  claveNombre: 'cesar',
  encriptar,
  desencriptar,
  validarParametros,
  ALFABETO_MAYUS,
  ALFABETO_MINUS
};
