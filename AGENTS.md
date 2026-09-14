# AGENTS.md

## 1. Rol del agente

Actúa como un **Ingeniero de Software Senior especializado en JavaScript, Node.js y fundamentos de criptografía**.

Tu objetivo es desarrollar una aplicación educativa de terminal que implemente una versión moderna y reducida de la máquina Enigma, permitiendo **encriptar y desencriptar texto** mediante distintos algoritmos parametrizables.

La aplicación debe priorizar:

1. Cumplimiento de la consigna.
2. Correctitud del proceso de encriptación y desencriptación.
3. Claridad y facilidad de comprensión del código.
4. Modularidad y mantenibilidad.
5. Simplicidad.
6. Buena experiencia de uso desde la terminal.

No sobre-ingenierizar el proyecto.

---

## 2. Contexto del proyecto

El proyecto consiste en una aplicación **CLI (Command Line Interface)** desarrollada exclusivamente con Node.js.

La aplicación debe permitir:

* Ingresar texto plano desde la terminal.
* Seleccionar un algoritmo de encriptación.
* Configurar los parámetros requeridos por el algoritmo.
* Generar un archivo con el resultado de la encriptación.
* Utilizar posteriormente ese archivo para desencriptar el contenido.
* Mostrar nuevamente en la terminal el texto plano original.

La aplicación tiene fines educativos. Los algoritmos implementados no deben presentarse como mecanismos de seguridad adecuados para proteger información real.

---

## 3. Restricciones tecnológicas

### Obligatorio

* JavaScript.
* Node.js.
* Ejecución mediante `node`.
* Aplicación exclusiva de terminal.
* Utilización preferentemente de módulos nativos de Node.js.
* `readline` para interacción con el usuario.
* `fs` para lectura y generación del archivo de salida.

### Evitar

* Frameworks innecesarios.
* Bases de datos.
* Servicios externos.
* APIs externas.
* Dependencias de terceros salvo que sean estrictamente necesarias.
* Interfaces gráficas.
* Aplicaciones web.
* Sistemas de autenticación.
* Cachés.
* Almacenamiento de datos intermedios.

Si una funcionalidad puede resolverse correctamente utilizando módulos nativos de Node.js, preferir esa alternativa.

---

## 4. Almacenamiento y persistencia

La aplicación **no debe utilizar bases de datos ni mecanismos de persistencia interna**.

Durante el procesamiento:

```text
Entrada → Procesamiento en memoria → Salida
```

No deben existir:

* Bases de datos.
* Cachés.
* Archivos temporales innecesarios.
* Almacenamiento de información intermedia.
* Historial interno de textos.
* Persistencia entre ejecuciones.

### Excepción

La aplicación debe generar un **archivo de salida** cuando se completa una encriptación.

Este archivo constituye el resultado solicitado por la consigna y no debe utilizarse como una base de datos ni como almacenamiento interno de la aplicación.

---

## 5. Interfaz de usuario

La aplicación debe utilizar una **interfaz interactiva de terminal**.

No es necesario implementar una CLI basada en argumentos complejos.

El flujo principal debe comenzar con un menú similar a:

```text
================================
          MINI ENIGMA
================================

1. Encriptar texto
2. Desencriptar archivo
3. Salir

Seleccione una opción:
```

El usuario debe poder completar las operaciones mediante preguntas y opciones mostradas en la terminal.

La interfaz debe ser clara, sencilla y tolerante a entradas inválidas.

---

## 6. Compatibilidad con Unicode

El sistema debe trabajar correctamente con texto Unicode utilizando el soporte nativo de strings UTF-8 de JavaScript.

Debe soportar específicamente:

* Letras mayúsculas.
* Letras minúsculas.
* `ñ`.
* `Ñ`.
* Vocales acentuadas.
* Vocales con diéresis.
* Espacios.
* Signos de puntuación.
* Números.
* Otros caracteres Unicode cuando el algoritmo seleccionado pueda procesarlos correctamente.

El sistema debe ser **case-sensitive**.

Por ejemplo:

```text
A ≠ a
Ñ ≠ ñ
Á ≠ á
```

No convertir automáticamente el texto a mayúsculas o minúsculas salvo que un algoritmo específico lo requiera y dicho comportamiento esté explícitamente documentado.

El texto original debe poder recuperarse exactamente después de la desencriptación.

---

## 7. Funciones principales

La aplicación debe contar como mínimo con dos funciones principales explícitamente definidas y documentadas.

Como referencia:

```javascript
procesarEncriptacion(...)
procesarDesencriptacion(...)
```

### `procesarEncriptacion`

Responsabilidad:

1. Recibir el texto plano.
2. Recibir el algoritmo seleccionado.
3. Recibir la clave.
4. Recibir los parámetros necesarios.
5. Ejecutar el algoritmo correspondiente.
6. Construir el resultado de la encriptación.
7. Generar el archivo de salida.

### `procesarDesencriptacion`

Responsabilidad:

1. Recibir la ruta del archivo.
2. Leer el archivo.
3. Parsear su contenido.
4. Obtener el algoritmo.
5. Obtener la clave.
6. Obtener los parámetros.
7. Ejecutar el algoritmo inverso.
8. Mostrar el texto plano original.

Cada función debe tener una responsabilidad clara y estar documentada mediante comentarios o JSDoc cuando corresponda.

---

## 8. Algoritmos de encriptación

La aplicación debe implementar como mínimo **5 algoritmos diferentes**.

Todos deben ser parametrizables.

Cada algoritmo debe disponer de:

```text
Encriptación
Desencriptación
Parámetros
Validación de parámetros
```

La selección concreta de los cinco algoritmos debe priorizar métodos que permitan demostrar claramente:

* Diferentes técnicas de transformación.
* Uso de claves.
* Uso de parámetros.
* Reversibilidad.
* Compatibilidad con el texto requerido por la consigna.

Una propuesta válida es:

1. César.
2. Vigenère.
3. Atbash.
4. Transposición.
5. XOR.

El agente puede reemplazar alguno de ellos si encuentra una alternativa técnicamente más adecuada, pero debe mantener siempre un mínimo de cinco algoritmos.

---

## 9. Tratamiento del alfabeto español

Los algoritmos que trabajen sobre alfabetos deben utilizar un alfabeto explícitamente definido.

No asumir que el alfabeto inglés de 26 letras es suficiente.

Cuando corresponda, contemplar:

```text
A B C D E F G H I J K L M N Ñ O P Q R S T U V W X Y Z
a b c d e f g h i j k l m n ñ o p q r s t u v w x y z
```

Las vocales acentuadas y otros caracteres Unicode deben recibir un tratamiento definido.

El diseño debe evitar perder información durante el proceso.

Si un algoritmo utiliza un alfabeto específico y deja ciertos caracteres sin modificar, esto debe estar documentado claramente.

La desencriptación debe recuperar exactamente el texto original.

---

## 10. Parametrización

Cada algoritmo debe solicitar los parámetros necesarios al usuario.

Ejemplos:

### César

```text
Desplazamiento: 3
```

### Vigenère

```text
Clave: CASA
```

### Transposición

```text
Cantidad de columnas: 5
```

### XOR

```text
Clave: secreto
```

Los parámetros deben validarse antes de ejecutar el algoritmo.

No aceptar silenciosamente valores inválidos.

---

## 11. Archivo de salida

La encriptación debe generar un archivo estructurado.

Se recomienda utilizar JSON.

Ejemplo conceptual:

```json
{
  "algoritmo": "cesar",
  "clave": "3",
  "parametros": {
    "desplazamiento": 3
  },
  "texto_encriptado": "..."
}
```

El archivo debe contener como mínimo:

* Texto encriptado.
* Clave necesaria para desencriptar.
* Parámetros exactos utilizados.
* Identificación inequívoca del algoritmo.

No almacenar el texto plano original dentro del archivo.

La información almacenada debe ser suficiente para realizar la operación inversa.

---

## 12. Flujo de encriptación

El flujo esperado es:

```text
Usuario
   ↓
Selecciona "Encriptar"
   ↓
Ingresa texto
   ↓
Selecciona algoritmo
   ↓
Ingresa clave/parámetros
   ↓
Validación
   ↓
Encriptación
   ↓
Generación del archivo
   ↓
Confirmación en terminal
```

Ejemplo:

```text
Ingrese el texto:
> Hola Ñandú

Seleccione el algoritmo:

1. César
2. Vigenère
3. Atbash
4. Transposición
5. XOR

Seleccione: 1

Ingrese desplazamiento:
> 3

Procesando...

Archivo generado correctamente:
mensaje_encriptado.json
```

---

## 13. Flujo de desencriptación

El flujo esperado es:

```text
Usuario
   ↓
Selecciona "Desencriptar"
   ↓
Indica archivo
   ↓
Lectura del archivo
   ↓
Validación de estructura
   ↓
Identificación del algoritmo
   ↓
Obtención de clave y parámetros
   ↓
Desencriptación
   ↓
Texto plano
```

Ejemplo:

```text
Ingrese la ruta del archivo:
> mensaje_encriptado.json

Algoritmo: César
Parámetros: desplazamiento = 3

Texto original:

Hola Ñandú
```

---

## 14. Validaciones y errores

La aplicación debe manejar de forma controlada:

* Opción de menú inexistente.
* Texto vacío cuando no corresponda.
* Claves vacías.
* Parámetros inválidos.
* Números fuera del rango esperado.
* Archivo inexistente.
* Archivo ilegible.
* JSON inválido.
* Estructura de archivo incorrecta.
* Algoritmo desconocido.
* Parámetros faltantes.
* Archivos generados por versiones incompatibles.

Los errores deben mostrarse de forma comprensible para el usuario.

No utilizar `try/catch` indiscriminadamente. Utilizarlo donde exista una operación que pueda fallar, especialmente lectura y parseo de archivos.

---

## 15. Arquitectura recomendada

Aunque el proyecto puede realizarse en un único archivo JavaScript, preferir una estructura modular si mejora claramente la organización.

Una posible estructura:

```text
mini-enigma/
│
├── src/
│   ├── index.js
│   ├── interfaz.js
│   ├── encriptacion.js
│   ├── desencriptacion.js
│   ├── algoritmos/
│   │   ├── cesar.js
│   │   ├── vigenere.js
│   │   ├── atbash.js
│   │   ├── transposicion.js
│   │   └── xor.js
│   └── archivo.js
│
├── package.json
└── README.md
```

Sin embargo, **no dividir el proyecto en múltiples archivos únicamente por cumplir una regla de arquitectura**.

Si el tamaño del proyecto permite que un único archivo sea más claro y mantenible, puede utilizarse un solo `.js`.

---

## 16. Seguridad y alcance

La aplicación es un proyecto educativo.

Los algoritmos clásicos implementados deben considerarse **demostraciones de técnicas de transformación/cifrado**, no mecanismos de criptografía moderna segura.

No afirmar que:

* César es seguro.
* Vigenère es seguro.
* XOR con una clave común es seguro.
* La aplicación protege información sensible.

El objetivo es comprender:

* Claves.
* Parámetros.
* Transformaciones.
* Encriptación.
* Desencriptación.
* Reversibilidad.
* Procesamiento de texto.

---

## 17. Requisitos de código

El código debe:

* Ser JavaScript válido para Node.js.
* Utilizar nombres de variables y funciones descriptivos.
* Evitar código duplicado innecesariamente.
* Separar la interacción con el usuario de la lógica de los algoritmos cuando sea razonable.
* Validar las entradas.
* Utilizar funciones pequeñas cuando esto mejore la legibilidad.
* Documentar las funciones principales.
* Evitar comentarios que simplemente describan código obvio.
* No incluir código muerto.
* No incluir dependencias innecesarias.

No implementar funcionalidades que no formen parte del alcance sin justificar previamente su necesidad.

---

## 18. Pruebas mínimas

Antes de considerar terminada una implementación, comprobar como mínimo:

### Caso 1 — Texto simple

```text
Hola Mundo
```

### Caso 2 — Mayúsculas/minúsculas

```text
Hola HOLA hola
```

### Caso 3 — Caracteres españoles

```text
Ñandú, pingüino, corazón, acción
```

### Caso 4 — Puntuación

```text
¡Hola! ¿Cómo estás?
```

### Caso 5 — Números

```text
Sistema 2026
```

### Caso 6 — Texto largo

Probar bloques de texto pegados en la terminal.

Para cada caso:

```text
Texto original
      ↓
Encriptar
      ↓
Archivo
      ↓
Desencriptar
      ↓
Comparar con original
```

El resultado final debe ser exactamente igual al texto original.

---

## 19. Criterio de finalización

La implementación se considera terminada únicamente cuando:

* [ ] Es ejecutable mediante Node.js.
* [ ] Presenta un menú interactivo.
* [ ] Permite encriptar texto.
* [ ] Permite desencriptar archivos.
* [ ] Tiene al menos 5 algoritmos.
* [ ] Cada algoritmo es parametrizable.
* [ ] Cada algoritmo tiene su proceso inverso.
* [ ] Existen al menos dos funciones principales claramente definidas.
* [ ] Soporta Unicode y caracteres españoles.
* [ ] Es case-sensitive.
* [ ] Genera el archivo solicitado.
* [ ] El archivo contiene algoritmo, clave, parámetros y texto encriptado.
* [ ] No guarda el texto plano en el archivo.
* [ ] No utiliza base de datos.
* [ ] No utiliza cachés ni almacenamiento intermedio.
* [ ] Maneja errores de entrada.
* [ ] Un archivo generado puede utilizarse para recuperar el texto original.
* [ ] La documentación explica cómo ejecutar el programa.
* [ ] La documentación explica los cinco algoritmos.

---

## 20. Regla principal para futuras modificaciones

Ante cualquier modificación del proyecto:

**No sacrificar el cumplimiento de la consigna por agregar funcionalidades.**

Si existe conflicto entre una implementación sofisticada y una implementación más simple que cumple correctamente los requisitos, elegir la alternativa simple.

Antes de introducir una dependencia, una nueva capa de arquitectura o una funcionalidad fuera del alcance, evaluar si realmente aporta valor al proyecto.

