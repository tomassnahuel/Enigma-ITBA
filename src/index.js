/**
 * Controlador principal del bucle interactivo CLI para la Máquina Mini Enigma.
 */

const {
  crearInterfaz,
  preguntar,
  seleccionarOpcion,
  solicitarTextoMultilinea,
  mostrarExito,
  mostrarError,
  C
} = require('./interfaz');

const { procesarEncriptacion } = require('./encriptacion');
const { procesarDesencriptacion } = require('./desencriptacion');

const OPCIONES_MENU_PRINCIPAL = [
  { id: '1', label: 'Encriptar texto', desc: 'Ingresa texto plano y genera un archivo cifrado' },
  { id: '2', label: 'Desencriptar archivo', desc: 'Lee un archivo JSON cifrado y recupera el texto plano' },
  { id: '3', label: 'Salir', desc: 'Cierra la aplicación' }
];

const OPCIONES_ALGORITMOS = [
  { id: '1', key: 'cesar', label: 'Cifrado César', desc: 'Desplazamiento alfabético sobre alfabeto español de 27 letras' },
  { id: '2', key: 'vigenere', label: 'Cifrado Vigenère', desc: 'Cifrado polialfabético mediante palabra clave' },
  { id: '3', key: 'atbash', label: 'Cifrado Atbash', desc: 'Sustitución reflexiva auto-inversa' },
  { id: '4', key: 'transposicion', label: 'Transposición Columnar', desc: 'Matriz columnar (conserva 100% Unicode, acentos y saltos)' },
  { id: '5', key: 'xor', label: 'Cifrado XOR UTF-8', desc: 'Transformación binaria de bytes UTF-8 codificada en Base64' }
];

async function flujoEncriptar(rl) {
  const texto = await solicitarTextoMultilinea(rl);
  if (!texto || texto.trim() === '') {
    mostrarError('El texto plano no puede estar vacío. Operación cancelada.');
    return;
  }

  const algoritmoSeleccionado = await seleccionarOpcion(
    rl,
    OPCIONES_ALGORITMOS,
    'SELECCIONE EL ALGORITMO DE ENCRIPTACIÓN'
  );

  const parametros = {};
  let clave = undefined;

  switch (algoritmoSeleccionado.id) {
    case '1': { // César
      console.log(`\n${C.bold}${C.yellow}► Algoritmo seleccionado: Cifrado César${C.reset}`);
      const shiftInput = await preguntar(rl, 'Ingrese el desplazamiento (ej. 3): ');
      parametros.desplazamiento = shiftInput;
      clave = shiftInput;
      break;
    }
    case '2': { // Vigenère
      console.log(`\n${C.bold}${C.yellow}► Algoritmo seleccionado: Cifrado Vigenère${C.reset}`);
      clave = await preguntar(rl, 'Ingrese la clave (ej. CASA): ');
      parametros.clave = clave;
      break;
    }
    case '3': { // Atbash
      console.log(`\n${C.bold}${C.yellow}► Algoritmo seleccionado: Cifrado Atbash${C.reset}`);
      const invNum = await preguntar(rl, '¿Desea invertir números 0-9? (si/no, por defecto no): ');
      parametros.invertirNumeros = invNum.toLowerCase() === 'si' || invNum.toLowerCase() === 's' || invNum === 'true';
      clave = 'N/A (Reflexivo)';
      break;
    }
    case '4': { // Transposición
      console.log(`\n${C.bold}${C.yellow}► Algoritmo seleccionado: Transposición Columnar${C.reset}`);
      const colInput = await preguntar(rl, 'Ingrese la cantidad de columnas (entero >= 2): ');
      parametros.columnas = colInput;
      clave = colInput;
      break;
    }
    case '5': { // XOR
      console.log(`\n${C.bold}${C.yellow}► Algoritmo seleccionado: Cifrado XOR UTF-8${C.reset}`);
      clave = await preguntar(rl, 'Ingrese la clave (ej. secreto123): ');
      parametros.clave = clave;
      break;
    }
  }

  const rutaSalida = await preguntar(rl, 'Nombre del archivo de salida [mensaje_encriptado.json]: ');
  const destino = rutaSalida.trim() !== '' ? rutaSalida.trim() : 'mensaje_encriptado.json';

  console.log(`\n${C.cyan}Procesando encriptación...${C.reset}`);
  const resultado = procesarEncriptacion({
    texto,
    algoritmoKey: algoritmoSeleccionado.key,
    clave,
    parametros,
    rutaSalida: destino
  });

  mostrarExito('¡ENCRIPTACIÓN COMPLETADA CON ÉXITO!', [
    { label: 'Algoritmo', valor: resultado.algoritmo },
    { label: 'Parámetros', valor: JSON.stringify(resultado.parametros) },
    { label: 'Archivo generado', valor: resultado.rutaArchivo }
  ]);
}

async function flujoDesencriptar(rl) {
  console.log(`\n${C.bold}${C.yellow}► Desencriptación de Archivo JSON${C.reset}`);
  const rutaInput = await preguntar(rl, 'Ruta del archivo a desencriptar [mensaje_encriptado.json]: ');
  const rutaArchivo = rutaInput.trim() !== '' ? rutaInput.trim() : 'mensaje_encriptado.json';

  console.log(`\n${C.cyan}Procesando desencriptación...${C.reset}`);
  const resultado = procesarDesencriptacion({ rutaArchivo });

  mostrarExito('¡DESENCRIPTACIÓN COMPLETADA CON ÉXITO!', [
    { label: 'Algoritmo', valor: resultado.algoritmo },
    { label: 'Parámetros leídos', valor: JSON.stringify(resultado.parametros) }
  ]);

  console.log(`${C.bold}${C.brightCyan}┌──────────────────────────────────────────────────────┐${C.reset}`);
  console.log(`${C.bold}${C.brightCyan}│ TEXTO ORIGINAL RECUPERADO:                           │${C.reset}`);
  console.log(`${C.bold}${C.brightCyan}├──────────────────────────────────────────────────────┤${C.reset}`);
  console.log(`${C.white}${resultado.textoPlano}${C.reset}`);
  console.log(`${C.bold}${C.brightCyan}└──────────────────────────────────────────────────────┘${C.reset}\n`);
}

async function iniciarAplicacion() {
  const rl = crearInterfaz();
  let continuar = true;

  while (continuar) {
    const opcion = await seleccionarOpcion(
      rl,
      OPCIONES_MENU_PRINCIPAL,
      'MINI ENIGMA - TERMINAL CLI'
    );

    try {
      switch (opcion.id) {
        case '1':
          await flujoEncriptar(rl);
          break;
        case '2':
          await flujoDesencriptar(rl);
          break;
        case '3':
          console.log(`\n${C.brightGreen}¡Gracias por utilizar Mini Enigma! Hasta luego.${C.reset}\n`);
          continuar = false;
          rl.close();
          break;
      }
    } catch (error) {
      mostrarError(error.message);
    }
  }
}

module.exports = {
  iniciarAplicacion
};

if (require.main === module) {
  iniciarAplicacion();
}
