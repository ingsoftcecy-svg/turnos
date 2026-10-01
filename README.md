# Entrega de Turno - Dashboard

Este es un proyecto desarrollado con React, Vite y TypeScript para gestionar y visualizar las métricas y reportes de entregas de turno. Está diseñado para monitorear y dar seguimiento a diferentes indicadores de un proceso industrial (evaluando marcas como Corona, Modelo, Pacífico, Victoria, etc., e incluyendo métricas de filtración, mosto y especificaciones químicas).

## 🚀 Tecnologías

* **React 19**: Biblioteca principal para la interfaz de usuario.
* **Vite**: Herramienta de compilación y servidor de desarrollo ultrarrápido.
* **TypeScript**: Tipado estático para mayor seguridad y mantenibilidad del código.
* **Firebase (Firestore)**: Base de datos NoSQL usada para almacenar la gran cantidad de reportes e historiales de turnos a través de su API REST.
* **Lucide React**: Biblioteca para la iconografía de la interfaz.

## 📂 Estructura del Proyecto

El proyecto está diseñado bajo un estándar de modularidad y Programación Orientada a Objetos (POO), cuidando que ningún componente sea demasiado complejo. 

### Directorio Principal (`src/`)
* **`main.tsx`**: Es el punto de entrada principal de la aplicación. Configura la renderización inicial de React.
* **`App.tsx`**: Layout principal. Contiene la estructura básica de la vista, como la cabecera y el botón de "Modo TV". Renderiza internamente la tabla de datos principal.
* **`types.ts`**: Contiene las definiciones estáticas (interfaces) de TypeScript que estructuran los datos del dominio de la aplicación (`ShiftEntry`, tanques, etc.).
* **`index.css`**: Archivo que almacena los estilos CSS globales que definen la apariencia de la tabla y celdas.

### Directorio de Componentes (`src/components/`)
* **`MainTable.tsx`**: El núcleo visual del proyecto. Muestra una tabla masiva y editable donde se registran y leen los datos. En lugar de modales, los usuarios ingresan los datos haciendo clic y escribiendo directamente sobre cada celda (edición en línea).
* **`ShiftTableHeader.tsx`**: Contiene la definición de las cabeceras de la tabla.
* **`ShiftTableRow.tsx`**: Renderiza una fila individual para un turno en la tabla.
* **`EditableCell.tsx`**: Componente funcional y reutilizable para representar cada celda editable, manteniendo el código limpio y evitando repeticiones.

### Directorio de Hooks (`src/hooks/`)
* **`useDashboard.ts`**: Es el controlador maestro encargado de la lógica de datos e interacción con Firestore:
    * Se encarga de descargar todos los reportes desde la base de datos Firestore de forma optimizada a través de la API REST de Google (evitando depender del SDK pesado de Firebase).
    * Provee funciones vitales para el funcionamiento interactivo: `saveEntry` (para crear/modificar registros vía peticiones PATCH en tiempo real) y `deleteEntry` (para eliminar filas).

### Directorio de Utilidades (`src/utils/`)
* **`ColorEvaluator.ts`**: Clase estática que aplica los principios de Programación Orientada a Objetos para evaluar las especificaciones químicas. Contiene los diccionarios de rangos válidos (`COLOR_SPECS`, `P_SPECS`) y provee las funciones matemáticas para colorear los valores de verde o rojo.
* **`firestoreSerializer.ts`**: Utilidad puente que procesa las fechas estilo Excel y serializa cómo los objetos de TypeScript se envían y reciben en el formato estricto de la API de Firebase.

## ⚙️ Configuración y Ejecución

Para levantar el proyecto en un entorno de desarrollo local, sigue estos pasos:

1. Asegúrate de tener instalado **Node.js**.
2. Abre la terminal, colócate en la raíz del proyecto y descarga las dependencias ejecutando:
   ```bash
   npm install
   ```
3. Ejecuta el servidor de desarrollo en modo rápido:
   ```bash
   npm run dev
   ```

## 🏗️ Despliegue a Producción

Para compilar y empaquetar la aplicación de manera optimizada y lista para subir a un servidor web o hosting estático:
```bash
npm run build
```
Este comando construirá tu aplicación lista para producción dentro del directorio `dist/`.
