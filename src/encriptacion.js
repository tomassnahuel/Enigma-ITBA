/**
 * Módulo principal de encriptación para la Máquina Mini Enigma.
 */

const { obtenerAlgoritmo } = require('./algoritmos');
const { guardarArchivo } = require('./archivo');

/**
 * Función principal para procesar la encriptación de texto plano y generar el archivo de salida.
 * 
 * @param {object} opciones
 * @param {string} opciones.texto - Texto plano ingresado por el usuario.
 * @param {string} opciones.algoritmoKey - Identificador o clave del algoritmo (e.g. 'cesar', 'vigenere', 'atbash', 'transposicion', 'xor' o '1'..'5').
 * @param {string|number} [opciones.clave] - Clave introducida por el usuario (si aplica).
 * @param {object} opciones.parametros - Parámetros requeridos por el algoritmo seleccionado.
 * @param {string} [opciones.rutaSalida='mensaje_encriptado.json'] - Ruta del archivo de salida.
 * @returns {object} Objeto con la información del resultado y la ruta del archivo generado.
 */
function procesarEncriptacion({ texto, algoritmoKey, clave, parametros, rutaSalida = 'mensaje_encriptado.json' }) {
  if (texto === undefined || texto === null || String(texto).length === 0) {
    throw new Error('El texto plano a encriptar no puede estar vacío.');
  }

  const moduloAlgoritmo = obtenerAlgoritmo(algoritmoKey);
  if (!moduloAlgoritmo) {
    throw new Error(`Algoritmo no reconocido o no soportado: "${algoritmoKey}".`);
  }

  // Combinar clave explícita en el objeto de parámetros si se proveyó
  const parametrosCompletos = Object.assign({}, parametros);
  if (clave !== undefined && clave !== null && clave !== '') {
    parametrosCompletos.clave = clave;
  }

  // Validar parámetros específicos del algoritmo
  moduloAlgoritmo.validarParametros(parametrosCompletos);

  // Ejecutar el algoritmo de encriptación
  const textoEncriptado = moduloAlgoritmo.encriptar(texto, parametrosCompletos);

  // Determinar la clave representativa para almacenar en el archivo
  let claveGuardada = String(clave || (parametrosCompletos.clave || (parametrosCompletos.desplazamiento !== undefined ? parametrosCompletos.desplazamiento : (parametrosCompletos.columnas !== undefined ? parametrosCompletos.columnas : 'N/A'))));

  // Estructura de salida JSON (nunca incluye el texto plano)
  const datosSalida = {
    algoritmo: moduloAlgoritmo.claveNombre,
    clave: claveGuardada,
    parametros: parametrosCompletos,
    texto_encriptado: textoEncriptado
  };

  // Generar el archivo de salida
  const rutaFinal = guardarArchivo(rutaSalida, datosSalida);

  return {
    algoritmo: moduloAlgoritmo.nombre,
    clave: claveGuardada,
    parametros: parametrosCompletos,
    textoEncriptado,
    rutaArchivo: rutaFinal
  };
}

module.exports = {
  procesarEncriptacion
};
