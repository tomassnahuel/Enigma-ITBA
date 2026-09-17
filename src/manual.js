/**
 * Módulo de Manual de Usuario interactivo para la Máquina Mini Enigma CLI.
 * Proporciona documentación orientada, intuitiva y navegable por secciones.
 */

const { seleccionarOpcion, preguntar, centrarTexto, C } = require('./interfaz');

const OPCIONES_MANUAL = [
  { id: '1', label: 'Guía de uso rápido', desc: 'Paso a paso para encriptar y desencriptar archivos' },
  { id: '2', label: 'Los 5 algoritmos y sus parámetros', desc: 'Explicación detallada de César, Vigenère, Atbash, Transposición y XOR' },
  { id: '3', label: 'Formato de archivos .txt y ejemplos', desc: 'Estructura no estructurada compacta y ejemplos reales' },
  { id: '4', label: 'Alfabeto español y soporte Unicode', desc: 'Manejo de Ñ, acentos, diéresis, case-sensitivity y caracteres especiales' },
  { id: '5', label: 'Ver manual completo', desc: 'Muestra toda la documentación de forma continua' },
  { id: '6', label: 'Volver al menú principal', desc: 'Regresa a la pantalla inicial' }
];

function mostrarBannerManual(subtitulo) {
  const tituloCentrado = centrarTexto(`MANUAL DE USUARIO: ${subtitulo.toUpperCase()}`, 58);
  console.log(`\n${C.bold}${C.cyan}╔══════════════════════════════════════════════════════════════╗${C.reset}`);
  console.log(`${C.bold}${C.cyan}║  ${C.brightGreen}${tituloCentrado}${C.cyan}  ║${C.reset}`);
  console.log(`${C.bold}${C.cyan}╚══════════════════════════════════════════════════════════════╝${C.reset}\n`);
}

function seccionGuiaRapida() {
  mostrarBannerManual('Guía de Uso Rápido');
  console.log(`${C.bold}${C.yellow}► 1. CÓMO ENCRIPTAR UN TEXTO (Opción 1 del Menú)${C.reset}`);
  console.log(`  ${C.white}1.${C.reset} Selecciona ${C.brightGreen}"[1] Encriptar texto"${C.reset} en el menú principal.`);
  console.log(`  ${C.white}2.${C.reset} Escribe o pega tu texto. Para finalizar el ingreso de texto:`);
  console.log(`     ${C.gray}• Presiona [ENTER] en una línea vacía o escribe "EOF" / ":end".${C.reset}`);
  console.log(`  ${C.white}3.${C.reset} Elige el algoritmo de cifrado deseado (1 al 5).`);
  console.log(`  ${C.white}4.${C.reset} Ingresa los parámetros requeridos (clave, desplazamiento, etc.).`);
  console.log(`  ${C.white}5.${C.reset} Ingresa el nombre del archivo (ej. ${C.cyan}mi_mensaje.txt${C.reset}) o presiona [ENTER]`);
  console.log(`     para usar el nombre por defecto (${C.cyan}mensaje_encriptado.txt${C.reset}).`);
  console.log(`  ${C.white}6.${C.reset} ¡Listo! Se creará el archivo con el texto cifrado.`);

  console.log(`\n${C.bold}${C.yellow}► 2. CÓMO DESENCRIPTAR UN ARCHIVO (Opción 2 del Menú)${C.reset}`);
  console.log(`  ${C.white}1.${C.reset} Selecciona ${C.brightGreen}"[2] Desencriptar archivo"${C.reset} en el menú principal.`);
  console.log(`  ${C.white}2.${C.reset} Ingresa la ruta del archivo ${C.cyan}.txt${C.reset} (o .json compatible).`);
  console.log(`  ${C.white}3.${C.reset} El sistema detectará automáticamente el algoritmo, clave y parámetros.`);
  console.log(`  ${C.white}4.${C.reset} Se mostrará en pantalla el ${C.brightGreen}texto original recuperado exactamente${C.reset}.\n`);
}

function seccionAlgoritmos() {
  mostrarBannerManual('Los 5 Algoritmos Parametrizables');

  console.log(`${C.bold}${C.brightCyan}1. Cifrado César (cesar)${C.reset}`);
  console.log(`  ${C.white}• Tipo:${C.reset} Sustitución monoalfabética por desplazamiento modular.`);
  console.log(`  ${C.white}• Alfabeto:${C.reset} Español explícito de 27 letras (incluye Ñ y ñ).`);
  console.log(`  ${C.white}• Parámetro:${C.reset} ${C.yellow}desplazamiento${C.reset} (número entero positivo o negativo, ej. 3, -5).`);
  console.log(`  ${C.white}• Caracteres:${C.reset} Conserva acentos, signos y números sin alterar.`);

  console.log(`\n${C.bold}${C.brightCyan}2. Cifrado Vigenère (vigenere)${C.reset}`);
  console.log(`  ${C.white}• Tipo:${C.reset} Sustitución polialfabética periódica.`);
  console.log(`  ${C.white}• Alfabeto:${C.reset} Español de 27 letras con normalización inteligente de tildes en la clave.`);
  console.log(`  ${C.white}• Parámetro:${C.reset} ${C.yellow}clave${C.reset} (palabra o frase de texto, ej. "CASA", "SECRETO").`);
  console.log(`  ${C.white}• Puntero:${C.reset} Solo avanza sobre letras alfabéticas, manteniendo signos y espacios intactos.`);

  console.log(`\n${C.bold}${C.brightCyan}3. Cifrado Atbash (atbash)${C.reset}`);
  console.log(`  ${C.white}• Tipo:${C.reset} Sustitución reflexiva auto-inversa (A↔Z, B↔Y, ..., M↔Ñ, N↔N).`);
  console.log(`  ${C.white}• Parámetro:${C.reset} ${C.yellow}invertirNumeros${C.reset} ("si" o "no" para invertir dígitos 0↔9, 1↔8, etc.).`);
  console.log(`  ${C.white}• Propiedad:${C.reset} Aplicar Atbash dos veces devuelve siempre el texto original.`);

  console.log(`\n${C.bold}${C.brightCyan}4. Transposición Columnar (transposicion)${C.reset}`);
  console.log(`  ${C.white}• Tipo:${C.reset} Permutación geométrica mediante matriz de N columnas.`);
  console.log(`  ${C.white}• Parámetro:${C.reset} ${C.yellow}columnas${C.reset} (entero mayor o igual a 2, ej. 5).`);
  console.log(`  ${C.white}• Ventaja:${C.reset} 100% compatible con Unicode, emojis, acentos y saltos multilínea.`);

  console.log(`\n${C.bold}${C.brightCyan}5. Cifrado XOR UTF-8 (xor)${C.reset}`);
  console.log(`  ${C.white}• Tipo:${C.reset} Transformación binaria lógica XOR (^) a nivel de bytes.`);
  console.log(`  ${C.white}• Parámetro:${C.reset} ${C.yellow}clave${C.reset} (cadena de texto no vacía, ej. "secreto123").`);
  console.log(`  ${C.white}• Almacenamiento:${C.reset} Salida codificada en Base64 para máxima legibilidad y persistencia.\n`);
}

function seccionFormatoArchivo() {
  mostrarBannerManual('Formato de Archivos .txt');
  console.log(`${C.bold}${C.yellow}► ESTRUCTURA NO ESTRUCTURADA COMPACTA${C.reset}`);
  console.log(`  Los archivos generados son archivos de texto plano (.txt) directos y legibles:`);
  console.log(`  ${C.brightGreen}<algoritmo> <parametro/clave> <texto_cifrado>${C.reset}`);

  console.log(`\n${C.bold}${C.yellow}► EJEMPLOS SEGÚN EL ALGORITMO:${C.reset}`);
  console.log(`  ${C.white}• César:${C.reset}         ${C.cyan}cesar 3 Krñd Qdpgú 2026${C.reset}`);
  console.log(`  ${C.white}• Vigenère:${C.reset}      ${C.cyan}vigenere CASA Ksla Owpdo${C.reset}`);
  console.log(`  ${C.white}• Atbash:${C.reset}        ${C.cyan}atbash no Gzrn Ñzmwe${C.reset}`);
  console.log(`  ${C.white}• Transposición:${C.reset} ${C.cyan}transposicion 5 H unolaMdo${C.reset}`);
  console.log(`  ${C.white}• XOR:${C.reset}           ${C.cyan}xor secreto123 USZZLjAHCkNBbzAQExc...${C.reset}`);

  console.log(`\n${C.bold}${C.yellow}► COMPATIBILIDAD:${C.reset}`);
  console.log(`  El descompresor es inteligente: admite variantes como ${C.cyan}"cesar 3 3 [texto]"${C.reset}\n`);
}

function seccionUnicodeEspanol() {
  mostrarBannerManual('Español y Soporte Unicode');
  console.log(`${C.bold}${C.yellow}► 1. ALFABETO ESPAÑOL DE 27 LETRAS${C.reset}`);
  console.log(`  Los algoritmos alfabéticos operan sobre el conjunto explícito:`);
  console.log(`  ${C.brightCyan}A B C D E F G H I J K L M N Ñ O P Q R S T U V W X Y Z${C.reset}`);
  console.log(`  ${C.brightCyan}a b c d e f g h i j k l m n ñ o p q r s t u v w x y z${C.reset}`);
  console.log(`  ${C.gray}La letra Ñ / ñ posee su posición propia entre la N y la O.${C.reset}`);

  console.log(`\n${C.bold}${C.yellow}► 2. CASE-SENSITIVITY (Distingue Mayúsculas/Minúsculas)${C.reset}`);
  console.log(`  El sistema es estrictamente sensible a mayúsculas:`);
  console.log(`  ${C.white}A ≠ a   |   Ñ ≠ ñ   |   Á ≠ á${C.reset}`);

  console.log(`\n${C.bold}${C.yellow}► 3. VOCALES CON TILDE, DIÉRESIS Y SIGNOS${C.reset}`);
  console.log(`  • Vocales con tilde: ${C.white}á, é, í, ó, ú, Á, É, Í, Ó, Ú${C.reset}`);
  console.log(`  • Vocales con diéresis: ${C.white}ü, Ü${C.reset}`);
  console.log(`  • Signos españoles: ${C.white}¡!, ¿?, (), "", :;, saltos de línea y emojis.${C.reset}`);
  console.log(`  Todos ellos se preservan exactamente en el proceso de desencriptación.\n`);
}

async function flujoManualUsuario(rl) {
  let enManual = true;

  while (enManual) {
    const opcion = await seleccionarOpcion(
      rl,
      OPCIONES_MANUAL,
      'MANUAL DE USUARIO Y DOCUMENTACIÓN'
    );

    switch (opcion.id) {
      case '1':
        seccionGuiaRapida();
        await preguntar(rl, 'Presione [ENTER] para volver al menú del manual...');
        break;
      case '2':
        seccionAlgoritmos();
        await preguntar(rl, 'Presione [ENTER] para volver al menú del manual...');
        break;
      case '3':
        seccionFormatoArchivo();
        await preguntar(rl, 'Presione [ENTER] para volver al menú del manual...');
        break;
      case '4':
        seccionUnicodeEspanol();
        await preguntar(rl, 'Presione [ENTER] para volver al menú del manual...');
        break;
      case '5':
        seccionGuiaRapida();
        seccionAlgoritmos();
        seccionFormatoArchivo();
        seccionUnicodeEspanol();
        await preguntar(rl, 'Presione [ENTER] para volver al menú del manual...');
        break;
      case '6':
        enManual = false;
        break;
    }
  }
}

module.exports = {
  flujoManualUsuario,
  OPCIONES_MANUAL
};
