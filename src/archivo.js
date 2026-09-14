/**
 * Módulo de manejo de archivos de salida/entrada para la Máquina Mini Enigma.
 * Utiliza exclusivamente el módulo nativo 'fs' de Node.js.
 */

const fs = require('fs');
const path = require('path');

/**
 * Guarda el resultado de una encriptación en un archivo JSON estructurado.
 * @param {string} rutaArchivo - Ruta del archivo de destino.
 * @param {object} datos - { algoritmo, clave, parametros, texto_encriptado }
 */
function guardarArchivo(rutaArchivo, datos) {
  if (!rutaArchivo || typeof rutaArchivo !== 'string') {
    throw new Error('Ruta de archivo inválida para guardar.');
  }

  // Validar estructura básica requerida antes de escribir
  if (!datos || !datos.algoritmo || datos.clave === undefined || !datos.parametros || datos.texto_encriptado === undefined) {
    throw new Error('Estructura de datos incompleta para generar el archivo de salida.');
  }

  const rutaAbsoluta = path.resolve(rutaArchivo);
  const contenidoJSON = JSON.stringify(datos, null, 2);

  try {
    fs.writeFileSync(rutaAbsoluta, contenidoJSON, 'utf-8');
    return rutaAbsoluta;
  } catch (err) {
    throw new Error(`Error al escribir el archivo en "${rutaArchivo}": ${err.message}`);
  }
}

/**
 * Lee y parsea un archivo JSON generado previamente por la aplicación.
 * @param {string} rutaArchivo - Ruta del archivo JSON.
 * @returns {object} Objeto parseado conteniendo { algoritmo, clave, parametros, texto_encriptado }.
 */
function leerArchivo(rutaArchivo) {
  if (!rutaArchivo || typeof rutaArchivo !== 'string') {
    throw new Error('Debe proporcionar una ruta de archivo válida.');
  }

  const rutaAbsoluta = path.resolve(rutaArchivo);

  if (!fs.existsSync(rutaAbsoluta)) {
    throw new Error(`El archivo especificado no existe: "${rutaAbsoluta}"`);
  }

  let contenido;
  try {
    contenido = fs.readFileSync(rutaAbsoluta, 'utf-8');
  } catch (err) {
    throw new Error(`Error al leer el archivo en "${rutaAbsoluta}": ${err.message}`);
  }

  let datos;
  try {
    datos = JSON.parse(contenido);
  } catch (err) {
    throw new Error(`El archivo "${path.basename(rutaAbsoluta)}" no contiene un JSON válido.`);
  }

  // Validaciones de la estructura del archivo
  if (typeof datos !== 'object' || datos === null) {
    throw new Error('El contenido del archivo no es un objeto JSON válido.');
  }

  if (!datos.algoritmo) {
    throw new Error('El archivo no contiene el campo obligatorio "algoritmo".');
  }

  if (datos.clave === undefined) {
    throw new Error('El archivo no contiene el campo obligatorio "clave".');
  }

  if (!datos.parametros || typeof datos.parametros !== 'object') {
    throw new Error('El archivo no contiene los "parametros" adecuados.');
  }

  if (datos.texto_encriptado === undefined || typeof datos.texto_encriptado !== 'string') {
    throw new Error('El archivo no contiene el campo obligatorio "texto_encriptado".');
  }

  return datos;
}

module.exports = {
  guardarArchivo,
  leerArchivo
};
