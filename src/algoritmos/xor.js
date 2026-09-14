/**
 * Módulo del Cifrado XOR UTF-8 para la Máquina Mini Enigma.
 * Aplica XOR binario a nivel de bytes UTF-8 con la clave provista.
 * La salida se codifica en Base64 para almacenarse limpia y legiblemente en JSON.
 */

/**
 * Encripta un texto plano aplicando XOR a sus bytes UTF-8.
 * @param {string} texto 
 * @param {object} parametros - { clave: string }
 * @returns {string} Texto encriptado codificado en Base64.
 */
function encriptar(texto, parametros) {
  validarParametros(parametros);
  const bufferTexto = Buffer.from(texto, 'utf-8');
  const bufferClave = Buffer.from(parametros.clave, 'utf-8');
  const bufferResultado = Buffer.alloc(bufferTexto.length);

  for (let i = 0; i < bufferTexto.length; i++) {
    bufferResultado[i] = bufferTexto[i] ^ bufferClave[i % bufferClave.length];
  }

  return bufferResultado.toString('base64');
}

/**
 * Desencripta un texto codificado en Base64 aplicando XOR con la misma clave.
 * @param {string} textoEncriptadoBase64 
 * @param {object} parametros - { clave: string }
 * @returns {string} Texto plano original recuperado en UTF-8.
 */
function desencriptar(textoEncriptadoBase64, parametros) {
  validarParametros(parametros);
  let bufferEncriptado;
  try {
    bufferEncriptado = Buffer.from(textoEncriptadoBase64, 'base64');
  } catch (err) {
    throw new Error('El texto encriptado en XOR no posee una codificación Base64 válida.');
  }

  const bufferClave = Buffer.from(parametros.clave, 'utf-8');
  const bufferResultado = Buffer.alloc(bufferEncriptado.length);

  for (let i = 0; i < bufferEncriptado.length; i++) {
    bufferResultado[i] = bufferEncriptado[i] ^ bufferClave[i % bufferClave.length];
  }

  return bufferResultado.toString('utf-8');
}

/**
 * Valida los parámetros del Cifrado XOR.
 * @param {object} parametros 
 */
function validarParametros(parametros) {
  if (!parametros || !parametros.clave || typeof parametros.clave !== 'string' || parametros.clave.length === 0) {
    throw new Error('Debe especificar una "clave" no vacía para el algoritmo XOR.');
  }
}

module.exports = {
  nombre: 'XOR',
  claveNombre: 'xor',
  encriptar,
  desencriptar,
  validarParametros
};
