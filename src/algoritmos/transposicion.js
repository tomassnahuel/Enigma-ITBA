/**
 * Módulo del Cifrado por Transposición Columnar para la Máquina Mini Enigma.
 * Reordena las posiciones de los caracteres en una matriz de N columnas.
 * Garantiza la conservación del 100% de los caracteres Unicode, acentos, signos y saltos de línea.
 */

/**
 * Encripta un texto mediante Transposición Columnar.
 * @param {string} texto 
 * @param {object} parametros - { columnas: number }
 * @returns {string}
 */
function encriptar(texto, parametros) {
  validarParametros(parametros);
  const colVal = parametros.columnas !== undefined ? parametros.columnas : parametros.clave;
  const numCol = parseInt(colVal, 10);
  const chars = Array.from(texto);
  const total = chars.length;

  if (total === 0 || numCol <= 1) return texto;

  const numFilas = Math.ceil(total / numCol);
  let resultado = '';

  for (let c = 0; c < numCol; c++) {
    for (let r = 0; r < numFilas; r++) {
      const idx = r * numCol + c;
      if (idx < total) {
        resultado += chars[idx];
      }
    }
  }

  return resultado;
}

/**
 * Desencripta un texto procesado por Transposición Columnar.
 * @param {string} textoEncriptado 
 * @param {object} parametros - { columnas: number }
 * @returns {string}
 */
function desencriptar(textoEncriptado, parametros) {
  validarParametros(parametros);
  const colVal = parametros.columnas !== undefined ? parametros.columnas : parametros.clave;
  const numCol = parseInt(colVal, 10);
  const chars = Array.from(textoEncriptado);
  const total = chars.length;

  if (total === 0 || numCol <= 1) return textoEncriptado;

  const numFilas = Math.ceil(total / numCol);
  const columnasLargas = total % numCol; // Cantidad de columnas con numFilas elementos

  // Matriz vacía para reconstruir la grilla
  const grilla = Array.from({ length: numFilas }, () => new Array(numCol));
  let charIdx = 0;

  for (let c = 0; c < numCol; c++) {
    const longitudCol = (columnasLargas === 0 || c < columnasLargas) ? numFilas : numFilas - 1;
    for (let r = 0; r < longitudCol; r++) {
      if (charIdx < total) {
        grilla[r][c] = chars[charIdx++];
      }
    }
  }

  // Leer fila por fila
  let resultado = '';
  for (let r = 0; r < numFilas; r++) {
    for (let c = 0; c < numCol; c++) {
      if (grilla[r][c] !== undefined) {
        resultado += grilla[r][c];
      }
    }
  }

  return resultado;
}

/**
 * Valida los parámetros de Transposición Columnar.
 * @param {object} parametros 
 */
function validarParametros(parametros) {
  const colVal = parametros ? (parametros.columnas !== undefined ? parametros.columnas : parametros.clave) : undefined;
  if (colVal === undefined || colVal === null || colVal === '') {
    throw new Error('Debe especificar el parámetro "columnas" para el algoritmo de Transposición.');
  }
  const colNum = Number(colVal);
  if (!Number.isInteger(colNum) || colNum < 2) {
    throw new Error('El parámetro "columnas" debe ser un entero mayor o igual a 2.');
  }
}

module.exports = {
  nombre: 'Transposición',
  claveNombre: 'transposicion',
  encriptar,
  desencriptar,
  validarParametros
};
