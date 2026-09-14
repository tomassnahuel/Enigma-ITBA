/**
 * Registro central de algoritmos de la Máquina Mini Enigma.
 */

const cesar = require('./cesar');
const vigenere = require('./vigenere');
const atbash = require('./atbash');
const transposicion = require('./transposicion');
const xor = require('./xor');

const ALGORITMOS = {
  cesar,
  vigenere,
  atbash,
  transposicion,
  xor
};

const LISTA_ALGORITMOS = [
  { id: '1', key: 'cesar', modulo: cesar },
  { id: '2', key: 'vigenere', modulo: vigenere },
  { id: '3', key: 'atbash', modulo: atbash },
  { id: '4', key: 'transposicion', modulo: transposicion },
  { id: '5', key: 'xor', modulo: xor }
];

/**
 * Obtiene el módulo de un algoritmo por su clave o ID del menú.
 * @param {string} identificador 
 * @returns {object} Módulo del algoritmo.
 */
function obtenerAlgoritmo(identificador) {
  if (!identificador) return null;
  const strId = String(identificador).trim().toLowerCase();

  // Buscar por id (1..5)
  const itemPorId = LISTA_ALGORITMOS.find(item => item.id === strId);
  if (itemPorId) return itemPorId.modulo;

  // Buscar por clave ('cesar', 'vigenere', etc.)
  if (ALGORITMOS[strId]) return ALGORITMOS[strId];

  return null;
}

module.exports = {
  ALGORITMOS,
  LISTA_ALGORITMOS,
  obtenerAlgoritmo
};
