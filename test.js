/**
 * Suite de Pruebas Automatizadas para la Máquina Mini Enigma.
 * Valida los 6 casos exigidos en AGENTS.md sobre los 5 algoritmos parametrizables.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { procesarEncriptacion } = require('./src/encriptacion');
const { procesarDesencriptacion } = require('./src/desencriptacion');

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
  { key: 'vigenere', clave: 'CASA', parametros: { clave: 'CASA' } },
  { key: 'atbash', clave: 'N/A', parametros: { invertirNumeros: true } },
  { key: 'transposicion', clave: 5, parametros: { columnas: 5 } },
  { key: 'xor', clave: 'secreto123', parametros: { clave: 'secreto123' } }
];

const ARCHIVO_TEST_TEMP = path.join(__dirname, 'test_temp_output.json');

function limpiarTemp() {
  if (fs.existsSync(ARCHIVO_TEST_TEMP)) {
    fs.unlinkSync(ARCHIVO_TEST_TEMP);
  }
}

function ejecutarPruebas() {
  console.log('==================================================');
  console.log(' EJECUTANDO SUITE DE PRUEBAS AUTOMATIZADAS       ');
  console.log('==================================================\n');

  let totalPruebas = 0;
  let pruebasExitosas = 0;

  for (const algoConfig of CONFIGURACION_ALGORITMOS) {
    console.log(`\n--- Probando Algoritmo: ${algoConfig.key.toUpperCase()} ---`);

    for (const caso of CASOS_DE_PRUEBA) {
      totalPruebas++;
      limpiarTemp();

      try {
        // 1. Encriptar
        const resEnc = procesarEncriptacion({
          texto: caso.texto,
          algoritmoKey: algoConfig.key,
          clave: algoConfig.clave,
          parametros: algoConfig.parametros,
          rutaSalida: ARCHIVO_TEST_TEMP
        });

        assert.ok(fs.existsSync(resEnc.rutaArchivo), 'El archivo de salida debe ser creado.');

        // 2. Verificar que el texto plano NO esté guardado directamente en el JSON
        const contenidoJSON = fs.readFileSync(resEnc.rutaArchivo, 'utf-8');
        assert.strictEqual(contenidoJSON.includes(caso.texto), false, 'El archivo JSON no debe contener el texto plano original.');

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
    procesarDesencriptacion({ rutaArchivo: 'archivo_inexistente_9999.json' });
    console.error('  [FAIL] Se esperaba error con archivo inexistente.');
  } catch (err) {
    console.log('  [OK] Manejo de error para archivo inexistente correcto.');
    pruebasExitosas++;
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
