# Mini Enigma CLI (Node.js)

Una aplicación educacional interactiva de línea de comandos (CLI) desarrollada en **Node.js** puro que simula las operaciones fundamentales de encriptación y desencriptación estilo máquina "Enigma".

---

## 1. Arquitectura e Instalación

### Requisitos Previos
- **Node.js**: Versión 14 o superior (utiliza exclusivamente módulos nativos como `fs` y `readline`).
- **Sin dependencias externas**: No requiere instalar paquetes vía `npm install`.

### Estructura del Código
```text
mini-enigma/
├── package.json
├── README.md
├── index.js                  # Punto de entrada principal
├── test.js                   # Suite de pruebas automatizadas
└── src/
    ├── index.js              # Controlador interactivo CLI
    ├── interfaz.js           # Módulo de entrada/salida readline
    ├── encriptacion.js       # Función principal procesarEncriptacion()
    ├── desencriptacion.js     # Función principal procesarDesencriptacion()
    ├── archivo.js            # Manejo y validación de archivos JSON
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
- **Manejo del Alfabeto Español y Unicode**: Aplica la operación lógica binaria XOR (`^`) entre los bytes del buffer UTF-8 del texto y la clave repetida. El texto encriptado se guarda codificado en **Base64** en la propiedad `texto_encriptado` del archivo JSON de salida para garantizar la persistencia de caracteres no imprimibles. Permite recuperar exactamente cualquier texto Unicode al re-aplicar XOR con la misma clave.

---

## 4. Estructura del Archivo de Salida

Cuando se completa la encriptación, el sistema genera un archivo estructurado en formato JSON (por defecto `mensaje_encriptado.json`):

```json
{
  "algoritmo": "cesar",
  "clave": "3",
  "parametros": {
    "desplazamiento": 3
  },
  "texto_encriptado": "Krod Ñdqgú"
}
```

> **Nota**: El texto plano original NUNCA se almacena dentro del archivo JSON. La información guardada es suficiente para realizar el proceso inverso de forma automática al seleccionar la opción de desencriptación.
