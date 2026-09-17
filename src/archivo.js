/**
 * Módulo de manejo de archivos de salida/entrada para la Máquina Mini Enigma.
 * Guarda en formato de texto plano no estructurado (.txt) y soporta lectura tanto
 * del nuevo formato .txt como de archivos JSON existentes.
 */

const fs = require('fs');
const path = require('path');

/**
 * Formatea un objeto de datos de cifrado en una cadena de texto plano no estructurada (.txt).
 * Ejemplo: "cesar 3 Krod Ñdqgú" o "vigenere CASA Ksla Owpdo".
 * @param {object} datos 
 * @returns {string}
 */
function formatearTextoPlano(datos) {
  const algo = String(datos.algoritmo).toLowerCase();
  let cabecera = '';

  switch (algo) {
    case 'cesar': {
      const shift = datos.parametros.desplazamiento !== undefined ? datos.parametros.desplazamiento : datos.clave;
      cabecera = `cesar ${shift}`;
      break;
    }
    case 'vigenere': {
      const clave = datos.parametros.clave || datos.clave;
      const claveStr = String(clave).includes(' ') ? `"${clave}"` : clave;
      cabecera = `vigenere ${claveStr}`;
      break;
    }
    case 'atbash': {
      const inv = datos.parametros.invertirNumeros ? 'si' : 'no';
      cabecera = `atbash ${inv}`;
      break;
    }
    case 'transposicion': {
      const col = datos.parametros.columnas !== undefined ? datos.parametros.columnas : datos.clave;
      cabecera = `transposicion ${col}`;
      break;
    }
    case 'xor': {
      const clave = datos.parametros.clave || datos.clave;
      const claveStr = String(clave).includes(' ') ? `"${clave}"` : clave;
      cabecera = `xor ${claveStr}`;
      break;
    }
    default: {
      cabecera = `${algo} ${datos.clave || ''}`;
      break;
    }
  }

  return `${cabecera} ${datos.texto_encriptado}`;
}

/**
 * Parsea el contenido de un archivo .txt no estructurado.
 * Soporta formatos como:
 * - "cesar 3 [texto_cifrado]"
 * - "cesar 3 3 [texto_cifrado]"
 * - "vigenere CASA [texto_cifrado]"
 * - "atbash no [texto_cifrado]"
 * - "transposicion 5 [texto_cifrado]"
 * - "xor secreto123 [texto_cifrado]"
 * @param {string} contenido 
 * @returns {object} { algoritmo, clave, parametros, texto_encriptado }
 */
function parsearTextoPlano(contenido) {
  const str = String(contenido || '').trimStart();
  if (!str) {
    throw new Error('El archivo está vacío.');
  }

  // Extraer el primer token (nombre del algoritmo)
  const primerEspacio = str.search(/\s/);
  if (primerEspacio === -1) {
    throw new Error('Formato de archivo inválido: no contiene parámetros ni texto cifrado.');
  }

  const algoritmo = str.slice(0, primerEspacio).toLowerCase().trim();
  let resto = str.slice(primerEspacio).trimStart();

  // Función para extraer el siguiente token (soporta cadenas entre comillas "...")
  function extraerToken() {
    resto = resto.trimStart();
    if (!resto) return null;
    if (resto.startsWith('"')) {
      const finComilla = resto.indexOf('"', 1);
      if (finComilla === -1) {
        const token = resto.slice(1);
        resto = '';
        return token;
      }
      const token = resto.slice(1, finComilla);
      resto = resto.slice(finComilla + 1);
      if (resto.startsWith(' ')) resto = resto.slice(1);
      return token;
    } else {
      const idxEspacio = resto.search(/\s/);
      if (idxEspacio === -1) {
        const token = resto;
        resto = '';
        return token;
      }
      const token = resto.slice(0, idxEspacio);
      resto = resto.slice(idxEspacio);
      if (resto.startsWith(' ')) resto = resto.slice(1);
      return token;
    }
  }

  let parametros = {};
  let clave = '';

  switch (algoritmo) {
    case 'cesar': {
      const p1 = extraerToken();
      if (!p1) throw new Error('Falta el parámetro de desplazamiento para César.');

      let shift = parseInt(p1, 10);
      // Si hay un segundo número redundante (ej. "cesar 3 3 [texto]"), consumirlo
      const matchSiguienteNum = resto.match(/^\s*(-?\d+)\s+(.*)$/s);
      if (matchSiguienteNum) {
        extraerToken();
      }
      parametros = { desplazamiento: shift, clave: p1 };
      clave = String(p1);
      break;
    }
    case 'vigenere': {
      const k = extraerToken();
      if (!k) throw new Error('Falta la clave para Vigenère.');
      parametros = { clave: k };
      clave = k;
      break;
    }
    case 'atbash': {
      let invNum = false;
      const primerTok = resto.split(/\s/)[0].toLowerCase();
      if (['si', 'no', 'true', 'false', 's', 'n', '1', '0'].includes(primerTok)) {
        const tok = extraerToken();
        invNum = ['si', 'true', 's', '1'].includes(tok.toLowerCase());
      }
      parametros = { invertirNumeros: invNum, clave: 'N/A (Reflexivo)' };
      clave = 'N/A (Reflexivo)';
      break;
    }
    case 'transposicion': {
      const p1 = extraerToken();
      if (!p1) throw new Error('Falta la cantidad de columnas para Transposición.');
      let col = parseInt(p1, 10);
      const matchSiguienteNum = resto.match(/^\s*(\d+)\s+(.*)$/s);
      if (matchSiguienteNum) {
        extraerToken();
      }
      parametros = { columnas: col, clave: p1 };
      clave = String(p1);
      break;
    }
    case 'xor': {
      const k = extraerToken();
      if (!k) throw new Error('Falta la clave para XOR.');
      parametros = { clave: k };
      clave = k;
      break;
    }
    default: {
      throw new Error(`Algoritmo no reconocido en el archivo: "${algoritmo}".`);
    }
  }

  let textoCifrado = resto;
  if (textoCifrado.startsWith('\n')) {
    textoCifrado = textoCifrado.slice(1);
  } else if (textoCifrado.startsWith('\r\n')) {
    textoCifrado = textoCifrado.slice(2);
  }

  return {
    algoritmo,
    clave,
    parametros,
    texto_encriptado: textoCifrado
  };
}

/**
 * Guarda el resultado de una encriptación en un archivo de texto plano no estructurado (.txt).
 * @param {string} rutaArchivo - Ruta del archivo de destino (.txt).
 * @param {object} datos - { algoritmo, clave, parametros, texto_encriptado }
 */
function guardarArchivo(rutaArchivo, datos) {
  if (!rutaArchivo || typeof rutaArchivo !== 'string') {
    throw new Error('Ruta de archivo inválida para guardar.');
  }

  if (!datos || !datos.algoritmo || datos.clave === undefined || !datos.parametros || datos.texto_encriptado === undefined) {
    throw new Error('Estructura de datos incompleta para generar el archivo de salida.');
  }

  // Asegurar extensión .txt si no tiene extensión
  let rutaDestino = rutaArchivo;
  if (!path.extname(rutaDestino)) {
    rutaDestino += '.txt';
  }

  const rutaAbsoluta = path.resolve(rutaDestino);
  const dir = path.dirname(rutaAbsoluta);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const contenido = formatearTextoPlano(datos);

  try {
    fs.writeFileSync(rutaAbsoluta, contenido, 'utf-8');
    return rutaAbsoluta;
  } catch (err) {
    throw new Error(`Error al escribir el archivo en "${rutaDestino}": ${err.message}`);
  }
}

/**
 * Lee y parsea un archivo de encriptación (soporta formato .txt plano y .json compatible).
 * @param {string} rutaArchivo - Ruta del archivo.
 * @returns {object} Objeto con { algoritmo, clave, parametros, texto_encriptado }.
 */
function leerArchivo(rutaArchivo) {
  if (!rutaArchivo || typeof rutaArchivo !== 'string') {
    throw new Error('Debe proporcionar una ruta de archivo válida.');
  }

  let rutaAbsoluta = path.resolve(rutaArchivo);

  // Si no existe tal cual y no tiene extensión, intentar buscar con .txt o .json
  if (!fs.existsSync(rutaAbsoluta)) {
    if (fs.existsSync(rutaAbsoluta + '.txt')) {
      rutaAbsoluta = rutaAbsoluta + '.txt';
    } else if (fs.existsSync(rutaAbsoluta + '.json')) {
      rutaAbsoluta = rutaAbsoluta + '.json';
    } else {
      throw new Error(`El archivo especificado no existe: "${rutaAbsoluta}"`);
    }
  }

  let contenido;
  try {
    contenido = fs.readFileSync(rutaAbsoluta, 'utf-8');
  } catch (err) {
    throw new Error(`Error al leer el archivo en "${rutaAbsoluta}": ${err.message}`);
  }

  const trimContenido = contenido.trim();

  // 1. Intentar parseo como JSON si comienza con '{' (compatibilidad con archivos existentes)
  if (trimContenido.startsWith('{')) {
    try {
      const datosJSON = JSON.parse(contenido);
      if (typeof datosJSON === 'object' && datosJSON !== null && datosJSON.algoritmo) {
        if (!datosJSON.parametros || typeof datosJSON.parametros !== 'object') {
          datosJSON.parametros = {};
        }
        if (datosJSON.clave !== undefined && datosJSON.parametros.clave === undefined) {
          datosJSON.parametros.clave = datosJSON.clave;
        }
        return datosJSON;
      }
    } catch (e) {
      // Si falla como JSON, continuar al parseo de texto plano
    }
  }

  // 2. Parsear formato .txt plano no estructurado
  return parsearTextoPlano(contenido);
}

module.exports = {
  guardarArchivo,
  leerArchivo,
  formatearTextoPlano,
  parsearTextoPlano
};

