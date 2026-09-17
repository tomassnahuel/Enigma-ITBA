# Mini Enigma CLI (Node.js)

Una aplicación educacional interactiva de línea de comandos (CLI) desarrollada en **Node.js** puro que simula las operaciones fundamentales de encriptación y desencriptación estilo máquina "Enigma".

---

## 📋 Índice

- [1. Arquitectura e Instalación](#1-arquitectura-e-instalación)
- [2. Instrucciones de Ejecución](#2-instrucciones-de-ejecución)
- [3. Explicación de los 5 Algoritmos Parametrizables](#3-explicación-de-los-5-algoritmos-parametrizables)
- [4. Estructura del Archivo de Salida (.txt)](#4-estructura-del-archivo-de-salida-txt)
- [5. Manual de Uso para el Usuario](#5-manual-de-uso-para-el-usuario)

---

## 1. Arquitectura e Instalación

### Requisitos Previos
- **Node.js**: Versión 14 o superior (utiliza exclusivamente módulos nativos como `fs` y `readline`).
- **Sin dependencias externas**: No requiere instalar paquetes vía `npm install`.

### Estructura del Código
```text
mini-enigma/
├── package.json
├── README.md                 # Documentación completa del proyecto
├── index.js                  # Punto de entrada principal
├── test.js                   # Suite de pruebas automatizadas
└── src/
    ├── index.js              # Controlador interactivo CLI
    ├── interfaz.js           # Módulo de entrada/salida readline y estilos ANSI
    ├── manual.js             # Módulo de Manual de Usuario interactivo
    ├── encriptacion.js       # Función principal procesarEncriptacion()
    ├── desencriptacion.js     # Función principal procesarDesencriptacion()
    ├── archivo.js            # Manejo y serialización de archivos .txt y .json
    └── algoritmos/
        ├── index.js          # Registro de algoritmos
        ├── cesar.js          # Cifrado César
        ├── vigenere.js       # Cifrado Vigenère
        ├── atbash.js         # Cifrado Atbash
        ├── transposicion.js  # Transposición Columnar
        └── xor.js            # Cifrado XOR UTF-8
```

---

## 2. Instrucciones de Ejecución

Para iniciar la aplicación interactiva en la terminal:

```bash
node index.js
```

O utilizando npm:

```bash
npm start
```

Para ejecutar la suite de pruebas automatizadas (33 pruebas de integración):

```bash
node test.js
```

---

## 3. Explicación de los 5 Algoritmos Parametrizables

Todos los algoritmos garantizan la **recuperación exacta del texto plano original**, soportan **Unicode UTF-8**, son estrictamente **case-sensitive** (`A ≠ a`, `Ñ ≠ ñ`, `Á ≠ á`), y son parametrizables por el usuario.

### 1. Cifrado César (`cesar`)
- **Parámetro**: `desplazamiento` (Número entero positivo o negativo, ej. `3`).
- **Manejo del Alfabeto Español**: Opera sobre el alfabeto español explícito de 27 letras (`A B C D E F G H I J K L M N Ñ O P Q R S T U V W X Y Z` y sus equivalentes minúsculas con `ñ`). Desplaza en módulo 27 manteniendo mayúsculas/minúsculas de forma independiente. Los caracteres no contenidos en el alfabeto (acentos, signos, números, espacios) se mantienen intactos.

### 2. Cifrado Vigenère (`vigenere`)
- **Parámetro**: `clave` (Cadena de texto no vacía, ej. `CASA`).
- **Manejo del Alfabeto Español**: Cifrado polialfabético que utiliza los índices de la clave sobre el alfabeto español de 27 letras (incluyendo Ñ/ñ). Avanza el puntero de la clave únicamente al procesar letras contenidas en el alfabeto, preservando espacios y signos sin desfasar la secuencia de encriptación.

### 3. Cifrado Atbash (`atbash`)
- **Parámetro**: `invertirNumeros` (Booleano o `si`/`no`).
- **Manejo del Alfabeto Español**: Sustitución reflexiva auto-inversa. Invierte las posiciones del alfabeto de 27 letras (`A` $\leftrightarrow$ `Z`, `B` $\leftrightarrow$ `Y`, ..., `N` $\leftrightarrow$ `N`, `Ñ` $\leftrightarrow$ `M`). La opción parametrizable permite decidir si los dígitos `0..9` también se invierten (`0` $\leftrightarrow$ `9`).

### 4. Transposición por Columnas (`transposicion`)
- **Parámetro**: `columnas` (Número entero $\ge 2$, ej. `5`).
- **Manejo del Alfabeto Español y Unicode**: Organiza el texto en una cuadrícula de $N$ columnas y lee la salida ordenando columna por columna. Opera sobre el arreglo completo de caracteres Unicode (`Array.from(texto)`), lo que permite conservar el 100% de la estructura del texto: vocales acentuadas, diéresis, signos de puntuación, emojis y saltos de línea multilínea.

### 5. Cifrado XOR UTF-8 (`xor`)
- **Parámetro**: `clave` (Cadena de texto no vacía, ej. `secreto123`).
- **Manejo del Alfabeto Español y Unicode**: Aplica la operación lógica binaria XOR (`^`) entre los bytes del buffer UTF-8 del texto y la clave repetida. El texto encriptado se guarda codificado en **Base64** en el archivo `.txt` de salida para garantizar la persistencia de caracteres no imprimibles. Permite recuperar exactamente cualquier texto Unicode al re-aplicar XOR con la misma clave.

---

## 4. Estructura del Archivo de Salida (.txt)

Cuando se completa la encriptación, el sistema genera un archivo de texto plano no estructurado **`.txt`** (por defecto `mensaje_encriptado.txt`) que contiene los datos indispensables para el descifrado seguido del texto cifrado:

### Formato General:
```text
<algoritmo> <parametros/clave> <texto_cifrado>
```

### Ejemplos según cada algoritmo:
- **César**:
  ```text
  cesar 3 Krñd Qdpgú
  ```
  *(También es compatible con la sintaxis `cesar 3 3 Krñd Qdpgú`)*
- **Vigenère**:
  ```text
  vigenere CASA Ksla Owpdo
  ```
- **Atbash**:
  ```text
  atbash no Gzrn Ñzmwe
  ```
- **Transposición**:
  ```text
  transposicion 5 H unolaMdo
  ```
- **XOR**:
  ```text
  xor secreto123 USZZLjAHCkNBbzAQExcJKCBfV3cBDBUXOTAKQllHHBU/NwsdCFxTbyMXFhcHFU8AEA==
  ```

> **Nota**: El texto plano original **nunca** se almacena dentro del archivo. El sistema también mantiene total compatibilidad hacia atrás para leer y desencriptar archivos `.json` generados previamente.

---

## 5. Manual de Uso para el Usuario

Este apartado sirve como guía paso a paso para interactuar con la aplicación desde la consola.

### Paso 1: Iniciar la Aplicación

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
node index.js
```

O con npm:

```bash
npm start
```

Verás el menú principal interactivo navegable con flechas o números:

```text
╔══════════════════════════════════════════════════════════════╗
║                  MINI ENIGMA - TERMINAL CLI                  ║
╚══════════════════════════════════════════════════════════════╝
  Navega con ↑ / ↓ o escribe el número [1-4] y presiona ENTER

  ❯ [1] Encriptar texto
        ↳ Ingresa texto plano y genera un archivo .txt cifrado
    [2] Desencriptar archivo
    [3] Manual de usuario
    [4] Salir
```

---

### Paso 2: Flujo de Encriptación (Opción 1)

1. **Seleccionar Opción 1**: Selecciona `[1] Encriptar texto` y presiona `Enter`.
2. **Ingresar Texto Plano**:
   - Escribe o pega tu texto (soporta caracteres españoles como `Ñ`/`ñ`, vocales acentuadas, números, signos y texto multilínea).
   - Para finalizar el texto, presiona `Enter` en una línea vacía o escribe `EOF` / `:end`.
3. **Seleccionar el Algoritmo**:
   Elige uno de los 5 algoritmos disponibles (`1` a `5`):
   - `1`: César
   - `2`: Vigenère
   - `3`: Atbash
   - `4`: Transposición
   - `5`: XOR
4. **Ingresar Parámetros / Clave**:
   - **César**: Ingresa el desplazamiento entero (ejemplo: `3`).
   - **Vigenère**: Ingresa la palabra clave (ejemplo: `CASA`).
   - **Atbash**: Responde `si` o `no` a invertir números (0-9).
   - **Transposición**: Ingresa la cantidad de columnas (número entero $\ge 2$, ejemplo: `5`).
   - **XOR**: Ingresa una clave de texto (ejemplo: `secreto123`).
5. **Especificar Archivo de Salida**:
   - Ingresa el nombre o ruta del archivo de destino (ejemplo: `mi_mensaje.txt`).
   - Si presionas `Enter` directamente, se utilizará por defecto `mensaje_encriptado.txt`.
6. **Confirmación**:
   La aplicación procesará la entrada y mostrará la tarjeta de confirmación de éxito con la ruta del archivo generado.

---

### Paso 3: Flujo de Desencriptación (Opción 2)

1. **Seleccionar Opción 2**: Selecciona `[2] Desencriptar archivo` y presiona `Enter`.
2. **Indicar la Ruta del Archivo**:
   - Ingresa la ruta del archivo `.txt` (o `.json`) previamente generado.
   - Si presionas `Enter` directamente, buscará por defecto el archivo `mensaje_encriptado.txt`.
3. **Resultado**:
   El sistema leerá el archivo, identificará automáticamente el algoritmo y sus parámetros, aplicará la operación inversa y mostrará el **texto plano original exacto** en la consola.

---

### Paso 4: Manual de Usuario Interactivo (Opción 3)

1. **Seleccionar Opción 3**: Selecciona `[3] Manual de usuario` y presiona `Enter`.
2. **Navegación por Secciones**:
   Elige la sección que deseas consultar:
   - `1`: Guía de uso rápido (paso a paso de encriptar/desencriptar).
   - `2`: Los 5 algoritmos y sus parámetros detallados.
   - `3`: Formato de archivos `.txt` y ejemplos reales.
   - `4`: Alfabeto español y soporte de caracteres Unicode.
   - `5`: Ver manual completo continuo.
   - `6`: Volver al menú principal.

---

### Paso 5: Salir (Opción 4)

Selecciona `[4] Salir` en el menú principal para cerrar la aplicación ordenadamente.

---

### Manejo de Errores y Recomendaciones

- **Entradas Vacías o Inválidas**: Si ingresas un parámetro no válido, la aplicación mostrará un recuadro de error explicativo y te permitirá presionar Enter para regresar al menú principal sin cerrarse.
- **Archivos Inexistentes o Formatos Dañados**: Si indicas una ruta de archivo que no existe o el contenido no tiene la sintaxis adecuada, la aplicación te informará el motivo exacto del error.

