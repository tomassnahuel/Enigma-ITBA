/**
 * Suite de Pruebas Automatizadas para la Máquina Mini Enigma.
 * Valida los 6 casos exigidos en AGENTS.md sobre los 5 algoritmos parametrizables.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { procesarEncriptacion } = require('./src/encriptacion');
const { procesarDesencriptacion } = require('./src/desencriptacion');
const { stripAnsi, centrarTexto, envolverTexto } = require('./src/interfaz');

const CASOS_DE_PRUEBA = [
  { id: 'Caso 1 — Texto simple', texto: 'Hola Mundo' },
  { id: 'Caso 2 — Mayúsculas/minúsculas', texto: 'Hola HOLA hola' },
  { id: 'Caso 3 — Caracteres españoles', texto: 'Ñandú, pingüino, corazón, acción' },
  { id: 'Caso 4 — Puntuación', texto: '¡Hola! ¿Cómo estás?' },
  { id: 'Caso 5 — Números', texto: 'Sistema 2026' },
  {
    id: 'Caso 6 — Texto largo multilínea',
    texto: `La máquina Enigma fue una máquina de cifrado utilizada para encriptar y desencriptar mensajes secretos.
En esta versión reducida en Node.js, validamos la conservación exacta de:
- Letras con Ñ y ñ: Ñandú, España, Año.
- Vocales acentuadas: ÁÉÍÓÚ áéíóú Üü.
- Signos y puntuación: ¡! ¿? : ; ( ) " ".
- Números: 0123456789.`
  }
];

const CONFIGURACION_ALGORITMOS = [
  { key: 'cesar', clave: 3, parametros: { desplazamiento: 3 } },
  { key: 'cesar_negativo', keyAlgo: 'cesar', clave: -5, parametros: { desplazamiento: -5 } },
  { key: 'vigenere', clave: 'CASA', parametros: { clave: 'CASA' } },
  { key: 'vigenere_espanol', keyAlgo: 'vigenere', clave: 'ÑandúÁrbol', parametros: { clave: 'ÑandúÁrbol' } },
  { key: 'atbash_con_num', keyAlgo: 'atbash', clave: 'N/A', parametros: { invertirNumeros: true } },
  { key: 'atbash_sin_num', keyAlgo: 'atbash', clave: 'N/A', parametros: { invertirNumeros: false } },
  { key: 'transposicion_3_col', keyAlgo: 'transposicion', clave: 3, parametros: { columnas: 3 } },
  { key: 'transposicion_5_col', keyAlgo: 'transposicion', clave: 5, parametros: { columnas: 5 } },
  { key: 'xor', clave: 'secreto123', parametros: { clave: 'secreto123' } },
  { key: 'xor_unicode', keyAlgo: 'xor', clave: '¡Clave_Ñandú_2026! 🔐', parametros: { clave: '¡Clave_Ñandú_2026! 🔐' } }
];

const ARCHIVO_TEST_TEMP = path.join(__dirname, 'test_temp_output.txt');
const ARCHIVO_TEST_SUBDIR = path.join(__dirname, 'temp_dir', 'test_sub_output.txt');
const ARCHIVO_TEST_CUSTOM_SYNTAX = path.join(__dirname, 'test_custom_syntax.txt');

function limpiarTemp() {
  if (fs.existsSync(ARCHIVO_TEST_TEMP)) {
    fs.unlinkSync(ARCHIVO_TEST_TEMP);
  }
  if (fs.existsSync(ARCHIVO_TEST_SUBDIR)) {
    fs.unlinkSync(ARCHIVO_TEST_SUBDIR);
  }
  if (fs.existsSync(ARCHIVO_TEST_CUSTOM_SYNTAX)) {
    fs.unlinkSync(ARCHIVO_TEST_CUSTOM_SYNTAX);
  }
  const subDir = path.join(__dirname, 'temp_dir');
  if (fs.existsSync(subDir)) {
    try { fs.rmdirSync(subDir); } catch (e) { }
  }
}

function ejecutarPruebas() {
  console.log('==================================================');
  console.log(' EJECUTANDO SUITE DE PRUEBAS AUTOMATIZADAS       ');
  console.log('==================================================\n');

  let totalPruebas = 0;
  let pruebasExitosas = 0;

  for (const algoConfig of CONFIGURACION_ALGORITMOS) {
    const algoKey = algoConfig.keyAlgo || algoConfig.key;
    console.log(`\n--- Probando Configuración: ${algoConfig.key.toUpperCase()} (${algoKey}) ---`);

    for (const caso of CASOS_DE_PRUEBA) {
      totalPruebas++;
      limpiarTemp();

      try {
        // 1. Encriptar
        const resEnc = procesarEncriptacion({
          texto: caso.texto,
          algoritmoKey: algoKey,
          clave: algoConfig.clave,
          parametros: algoConfig.parametros,
          rutaSalida: ARCHIVO_TEST_TEMP
        });

        assert.ok(fs.existsSync(resEnc.rutaArchivo), 'El archivo de salida debe ser creado.');

        // 2. Verificar que el texto plano NO esté guardado directamente en el archivo .txt
        const contenidoTxt = fs.readFileSync(resEnc.rutaArchivo, 'utf-8');
        assert.strictEqual(contenidoTxt.includes(caso.texto), false, 'El archivo .txt no debe contener el texto plano original.');

        // 3. Desencriptar
        const resDec = procesarDesencriptacion({ rutaArchivo: ARCHIVO_TEST_TEMP });

        // 4. Comparar exactitud con el texto original
        assert.strictEqual(resDec.textoPlano, caso.texto, `Fallo de coincidencia exacta en ${caso.id}`);

        console.log(`  [OK] ${caso.id}`);
        pruebasExitosas++;
      } catch (err) {
        console.error(`  [FAIL] ${caso.id}: ${err.message}`);
      }
    }
  }

  // Prueba de sintaxis compacta solicitada: "cesar 3 3 [texto cifrado]" y "cesar 3 [texto cifrado]"
  console.log('\n--- Probando Sintaxis Compacta en .txt ---');
  totalPruebas++;
  try {
    const encCesar = procesarEncriptacion({
      texto: 'Hola Ñandú',
      algoritmoKey: 'cesar',
      parametros: { desplazamiento: 3 }
    });
    fs.writeFileSync(ARCHIVO_TEST_CUSTOM_SYNTAX, `cesar 3 3 ${encCesar.textoEncriptado}`, 'utf-8');
    const res = procesarDesencriptacion({ rutaArchivo: ARCHIVO_TEST_CUSTOM_SYNTAX });
    assert.strictEqual(res.textoPlano, 'Hola Ñandú');
    console.log('  [OK] Sintaxis "cesar 3 3 [texto]" descifrada correctamente.');
    pruebasExitosas++;
  } catch (err) {
    console.error(`  [FAIL] Sintaxis "cesar 3 3": ${err.message}`);
  }

  totalPruebas++;
  try {
    const encCesar = procesarEncriptacion({
      texto: 'Hola Ñandú',
      algoritmoKey: 'cesar',
      parametros: { desplazamiento: 3 }
    });
    fs.writeFileSync(ARCHIVO_TEST_CUSTOM_SYNTAX, `cesar 3 ${encCesar.textoEncriptado}`, 'utf-8');
    const res = procesarDesencriptacion({ rutaArchivo: ARCHIVO_TEST_CUSTOM_SYNTAX });
    assert.strictEqual(res.textoPlano, 'Hola Ñandú');
    console.log('  [OK] Sintaxis "cesar 3 [texto]" descifrada correctamente.');
    pruebasExitosas++;
  } catch (err) {
    console.error(`  [FAIL] Sintaxis "cesar 3": ${err.message}`);
  }

  totalPruebas++;
  try {
    const encVig = procesarEncriptacion({
      texto: 'Hola Mundo',
      algoritmoKey: 'vigenere',
      parametros: { clave: 'CASA' }
    });
    fs.writeFileSync(ARCHIVO_TEST_CUSTOM_SYNTAX, `vigenere CASA ${encVig.textoEncriptado}`, 'utf-8');
    const res = procesarDesencriptacion({ rutaArchivo: ARCHIVO_TEST_CUSTOM_SYNTAX });
    assert.strictEqual(res.textoPlano, 'Hola Mundo');
    console.log('  [OK] Sintaxis "vigenere CASA [texto]" descifrada correctamente.');
    pruebasExitosas++;
  } catch (err) {
    console.error(`  [FAIL] Sintaxis "vigenere CASA": ${err.message}`);
  }

  totalPruebas++;
  try {
    const encAtbash = procesarEncriptacion({
      texto: 'Hola Ñandú',
      algoritmoKey: 'atbash',
      parametros: { invertirNumeros: false }
    });
    fs.writeFileSync(ARCHIVO_TEST_CUSTOM_SYNTAX, `atbash no ${encAtbash.textoEncriptado}`, 'utf-8');
    const res = procesarDesencriptacion({ rutaArchivo: ARCHIVO_TEST_CUSTOM_SYNTAX });
    assert.strictEqual(res.textoPlano, 'Hola Ñandú');
    console.log('  [OK] Sintaxis "atbash no [texto]" descifrada correctamente.');
    pruebasExitosas++;
  } catch (err) {
    console.error(`  [FAIL] Sintaxis "atbash no": ${err.message}`);
  }

  // Prueba de creación de directorios automáticos en guardarArchivo
  console.log('\n--- Probando Creación Automática de Directorios ---');
  totalPruebas++;
  try {
    limpiarTemp();
    const resEnc = procesarEncriptacion({
      texto: 'Texto en subdirectorio',
      algoritmoKey: 'cesar',
      clave: 3,
      parametros: { desplazamiento: 3 },
      rutaSalida: ARCHIVO_TEST_SUBDIR
    });
    assert.ok(fs.existsSync(resEnc.rutaArchivo));
    const resDec = procesarDesencriptacion({ rutaArchivo: ARCHIVO_TEST_SUBDIR });
    assert.strictEqual(resDec.textoPlano, 'Texto en subdirectorio');
    console.log('  [OK] Creación de subdirectorios automática correcta.');
    pruebasExitosas++;
  } catch (err) {
    console.error(`  [FAIL] Subdirectorio: ${err.message}`);
  }

  // Pruebas de desencriptación de archivos existentes de muestra
  console.log('\n--- Probando Archivos de Muestra del Proyecto ---');
  const archivosMuestra = ['Prueba 1', 'Prueba 2', 'prueba 3'];
  for (const arch of archivosMuestra) {
    totalPruebas++;
    try {
      const res = procesarDesencriptacion({ rutaArchivo: path.join(__dirname, arch) });
      assert.ok(res.textoPlano && res.textoPlano.length > 0);
      console.log(`  [OK] Desencriptación exitosa de "${arch}" (${res.algoritmo})`);
      pruebasExitosas++;
    } catch (err) {
      console.error(`  [FAIL] Archivo muestra "${arch}": ${err.message}`);
    }
  }

  // Pruebas de helpers visuales
  console.log('\n--- Probando Helpers Visuales de Terminal ---');
  totalPruebas++;
  try {
    const ansiString = '\x1b[31mTexto Rojo\x1b[0m';
    assert.strictEqual(stripAnsi(ansiString), 'Texto Rojo');
    assert.strictEqual(centrarTexto('Hola', 10), '   Hola   ');
    const envoltorio = envolverTexto('Esta es una prueba de texto largo para envolver', 15);
    assert.ok(envoltorio.length > 1);
    console.log('  [OK] Helpers de formato visual correctos.');
    pruebasExitosas++;
  } catch (err) {
    console.error(`  [FAIL] Helpers visuales: ${err.message}`);
  }

  // Pruebas de validación de errores
  console.log('\n--- Probando Validaciones de Errores ---');

  totalPruebas++;
  try {
    procesarEncriptacion({ texto: '', algoritmoKey: 'cesar', parametros: { desplazamiento: 3 } });
    console.error('  [FAIL] Se esperaba error con texto vacío.');
  } catch (err) {
    console.log('  [OK] Validación de texto vacío correcta.');
    pruebasExitosas++;
  }

  totalPruebas++;
  try {
    procesarEncriptacion({ texto: 'Test', algoritmoKey: 'transposicion', parametros: { columnas: 'abc' } });
    console.error('  [FAIL] Se esperaba error con parámetros inválidos de columnas.');
  } catch (err) {
    console.log('  [OK] Validación de parámetro inválido en columnas correcta.');
    pruebasExitosas++;
  }

  totalPruebas++;
  try {
    procesarEncriptacion({ texto: 'Test', algoritmoKey: 'transposicion', parametros: { columnas: 1.5 } });
    console.error('  [FAIL] Se esperaba error con columnas decimales.');
  } catch (err) {
    console.log('  [OK] Validación de columna no entera correcta.');
    pruebasExitosas++;
  }

  totalPruebas++;
  try {
    procesarEncriptacion({ texto: 'Test', algoritmoKey: 'vigenere', parametros: { clave: '' } });
    console.error('  [FAIL] Se esperaba error con clave Vigenère vacía.');
  } catch (err) {
    console.log('  [OK] Validación de clave Vigenère vacía correcta.');
    pruebasExitosas++;
  }

  totalPruebas++;
  try {
    procesarEncriptacion({ texto: 'Test', algoritmoKey: 'xor', parametros: { clave: '' } });
    console.error('  [FAIL] Se esperaba error con clave XOR vacía.');
  } catch (err) {
    console.log('  [OK] Validación de clave XOR vacía correcta.');
    pruebasExitosas++;
  }

  totalPruebas++;
  try {
    procesarDesencriptacion({ rutaArchivo: 'archivo_inexistente_9999.json' });
    console.error('  [FAIL] Se esperaba error con archivo inexistente.');
  } catch (err) {
    console.log('  [OK] Manejo de error para archivo inexistente correcto.');
    pruebasExitosas++;
  }

  // Pruebas del módulo Manual de Usuario
  console.log('\n--- Probando Módulo de Manual de Usuario ---');
  totalPruebas++;
  try {
    const { OPCIONES_MANUAL, flujoManualUsuario } = require('./src/manual');
    assert.ok(Array.isArray(OPCIONES_MANUAL) && OPCIONES_MANUAL.length >= 6);
    assert.strictEqual(typeof flujoManualUsuario, 'function');
    console.log('  [OK] Estructura y exportaciones del Manual de Usuario correctas.');
    pruebasExitosas++;
  } catch (err) {
    console.error(`  [FAIL] Manual de Usuario: ${err.message}`);
  }

  limpiarTemp();

  console.log('\n==================================================');
  console.log(` RESULTADO FINAL: ${pruebasExitosas}/${totalPruebas} PRUEBAS PASADAS `);
  console.log('==================================================\n');

  if (pruebasExitosas !== totalPruebas) {
    process.exit(1);
  }
}

ejecutarPruebas();

