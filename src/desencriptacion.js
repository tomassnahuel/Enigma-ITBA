/**
 * Módulo principal de desencriptación para la Máquina Mini Enigma.
 */

const { obtenerAlgoritmo } = require('./algoritmos');
const { leerArchivo } = require('./archivo');

/**
 * Función principal para procesar la desencriptación leyendo un archivo JSON generado previamente.
 * 
 * @param {object} opciones
 * @param {string} opciones.rutaArchivo - Ruta del archivo JSON a procesar.
 * @returns {object} Objeto con el texto plano recuperado, el nombre del algoritmo y los parámetros utilizados.
 */
function procesarDesencriptacion({ rutaArchivo }) {
  if (!rutaArchivo || typeof rutaArchivo !== 'string') {
    throw new Error('Debe especificar una ruta de archivo válida.');
  }

  // 1. Leer y parsear el archivo JSON
  const datosArchivo = leerArchivo(rutaArchivo);

  // 2. Obtener el algoritmo
  const moduloAlgoritmo = obtenerAlgoritmo(datosArchivo.algoritmo);
  if (!moduloAlgoritmo) {
    throw new Error(`Algoritmo no reconocido en el archivo: "${datosArchivo.algoritmo}".`);
  }

  const parametros = datosArchivo.parametros || {};

  // Si la clave no está dentro del objeto de parámetros, incorporarla
  if (datosArchivo.clave !== undefined && parametros.clave === undefined) {
    parametros.clave = datosArchivo.clave;
  }

  // 3. Validar parámetros
  moduloAlgoritmo.validarParametros(parametros);

  // 4. Ejecutar el algoritmo inverso
  const textoPlanoOriginal = moduloAlgoritmo.desencriptar(datosArchivo.texto_encriptado, parametros);

  return {
    algoritmo: moduloAlgoritmo.nombre,
    clave: datosArchivo.clave,
    parametros: datosArchivo.parametros,
    textoPlano: textoPlanoOriginal
  };
}

module.exports = {
  procesarDesencriptacion
};
