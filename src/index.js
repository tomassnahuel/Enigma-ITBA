/**
 * Controlador principal del bucle interactivo CLI para la Máquina Mini Enigma.
 */

const {
  crearInterfaz,
  preguntar,
  solicitarTextoMultilinea,
  mostrarMenuPrincipal,
  mostrarMenuAlgoritmos
} = require('./interfaz');

const { procesarEncriptacion } = require('./encriptacion');
const { procesarDesencriptacion } = require('./desencriptacion');

async function flujoEncriptar(rl) {
  const texto = await solicitarTextoMultilinea(rl);
  if (!texto || texto.trim() === '') {
    console.log('\n[ERROR] El texto no puede estar vacío. Operación cancelada.');
    return;
  }

  mostrarMenuAlgoritmos();
  const opcionAlg = await preguntar(rl, 'Seleccione una opción (1-5): ');

  const parametros = {};
  let clave = undefined;

  switch (opcionAlg) {
    case '1': { // César
      const shiftInput = await preguntar(rl, 'Ingrese el desplazamiento (ej. 3): ');
      parametros.desplazamiento = shiftInput;
      clave = shiftInput;
      break;
    }
    case '2': { // Vigenère
      clave = await preguntar(rl, 'Ingrese la clave (ej. CASA): ');
      parametros.clave = clave;
      break;
    }
    case '3': { // Atbash
      const invNum = await preguntar(rl, '¿Desea invertir números 0-9? (si/no, por defecto no): ');
      parametros.invertirNumeros = invNum.toLowerCase() === 'si' || invNum.toLowerCase() === 's' || invNum === 'true';
      clave = 'N/A (Sustitución Reflexiva)';
      break;
    }
    case '4': { // Transposición
      const colInput = await preguntar(rl, 'Ingrese la cantidad de columnas (entero >= 2): ');
      parametros.columnas = colInput;
      clave = colInput;
      break;
    }
    case '5': { // XOR
      clave = await preguntar(rl, 'Ingrese la clave (ej. secreto): ');
      parametros.clave = clave;
      break;
    }
    default:
      console.log('\n[ERROR] Opción de algoritmo no válida.');
      return;
  }

  const rutaSalida = await preguntar(rl, 'Nombre del archivo de salida [mensaje_encriptado.json]: ');
  const destino = rutaSalida.trim() !== '' ? rutaSalida.trim() : 'mensaje_encriptado.json';

  console.log('\nProcesando encriptación...');
  const resultado = procesarEncriptacion({
    texto,
    algoritmoKey: opcionAlg,
    clave,
    parametros,
    rutaSalida: destino
  });

  console.log('\n==================================================');
  console.log('      ¡ENCRIPTACIÓN COMPLETADA CON ÉXITO!         ');
  console.log('==================================================');
  console.log(`Algoritmo:        ${resultado.algoritmo}`);
  console.log(`Clave/Parámetros: ${JSON.stringify(resultado.parametros)}`);
  console.log(`Archivo generado: ${resultado.rutaArchivo}`);
  console.log('==================================================\n');
}

async function flujoDesencriptar(rl) {
  const rutaInput = await preguntar(rl, 'Ingrese la ruta del archivo a desencriptar [mensaje_encriptado.json]: ');
  const rutaArchivo = rutaInput.trim() !== '' ? rutaInput.trim() : 'mensaje_encriptado.json';

  console.log('\nProcesando desencriptación...');
  const resultado = procesarDesencriptacion({ rutaArchivo });

  console.log('\n==================================================');
  console.log('     ¡DESENCRIPTACIÓN COMPLETADA CON ÉXITO!       ');
  console.log('==================================================');
  console.log(`Algoritmo identificado: ${resultado.algoritmo}`);
  console.log(`Parámetros leídos:       ${JSON.stringify(resultado.parametros)}`);
  console.log('--------------------------------------------------');
  console.log('TEXTO ORIGINAL RECUPERADO:\n');
  console.log(resultado.textoPlano);
  console.log('==================================================\n');
}

async function iniciarAplicacion() {
  const rl = crearInterfaz();
  let continuar = true;

  while (continuar) {
    mostrarMenuPrincipal();
    const opcion = await preguntar(rl, 'Seleccione una opción: ');

    try {
      switch (opcion) {
        case '1':
          await flujoEncriptar(rl);
          break;
        case '2':
          await flujoDesencriptar(rl);
          break;
        case '3':
          console.log('\nGracias por utilizar Mini Enigma. ¡Hasta luego!\n');
          continuar = false;
          rl.close();
          break;
        default:
          console.log('\n[ERROR] Opción no válida. Intente nuevamente.');
          break;
      }
    } catch (error) {
      console.log(`\n[ERROR] ${error.message}\n`);
    }
  }
}

module.exports = {
  iniciarAplicacion
};

if (require.main === module) {
  iniciarAplicacion();
}
