# Entrega de Turno - Dashboard

Este es un proyecto desarrollado con React, Vite y TypeScript para gestionar y visualizar las métricas y reportes de entregas de turno. Está diseñado para monitorear y dar seguimiento a diferentes indicadores de un proceso industrial (presumiblemente cervecero, dado que evalúa marcas como Corona, Modelo, Pacífico, Victoria, etc., e incluye métricas de "filtración", "mosto" y especificaciones químicas de marcas).

## 🚀 Tecnologías

* **React 19**: Biblioteca principal para la interfaz de usuario.
* **Vite**: Herramienta de compilación y servidor de desarrollo ultrarrápido.
* **TypeScript**: Tipado estático para mayor seguridad y mantenibilidad del código.
* **Firebase (Firestore)**: Base de datos NoSQL usada para almacenar la gran cantidad de reportes e historiales de turnos.
* **Recharts & Lucide React**: Bibliotecas para la interfaz y visualización de iconos y datos.
* **XLSX**: Biblioteca para manejar procesamiento de archivos de Excel.

## 📂 Estructura del Proyecto e Información de Archivos

A continuación, se detalla qué hace cada archivo y directorio dentro del código fuente (`src/`):

### Directorio Principal (`src/`)

* **`main.tsx`**: Es el punto de entrada principal de la aplicación. Configura la renderización inicial de React y monta el componente raíz (`<App />`) en el elemento principal de la página HTML.
* **`App.tsx`**: Es el componente contenedor (Layout principal). Contiene la estructura básica de la vista, como la cabecera y el botón de "Modo TV". Este modo de TV aplica un zoom mediante CSS para que la aplicación se pueda leer correctamente si es proyectada en una pantalla en piso de producción. Renderiza internamente la tabla de datos principal.
* **`firebase.ts`**: Inicializa y exporta la conexión de la aplicación web con los servicios de Google Firebase usando las variables de entorno de Vite.
* **`types.ts`**: Contiene las definiciones estáticas o *interfaces* de TypeScript que estructuran los datos del dominio de la aplicación. Por ejemplo, define qué campos exactos tiene un reporte de turno (`ShiftEntry`) y sus mediciones de tanques.
* **`index.css` & `App.css`**: Archivos que almacenan los estilos CSS globales que definen la apariencia y estética del sistema de visualización.

### Directorio de Componentes (`src/components/`)

* **`MainTable.tsx`**: El componente más complejo y el núcleo visual del proyecto. Es una extensa tabla que desglosa detalladamente todos los turnos organizados por fechas (agrupándolos por semanas y meses en un "acordeón"). Permite la **edición directa** (inline) de los valores. Incluye una lógica robusta de colorimetría para advertir si las mediciones registradas están fuera de especificaciones predefinidas de los productos (`COLOR_SPECS`, `P_SPECS`).
* **`ShiftForm.tsx`**: Un componente que despliega una ventana modal con un formulario muy completo para agregar una nueva entrega de turno o reporte manualmente en el sistema, pidiendo llenar todas las métricas.
* **`UploadData.css`**: Archivo de estilos adicionales para elementos de subida de información.

### Directorio de Hooks (`src/hooks/`)

* **`useDashboard.ts`**: Es un *Hook* personalizado de React encargado de la lógica de datos e interacción con Firestore:
    * Se encarga de **descargar (fetch)** todos los reportes de turno desde la base de datos Firestore optimizadamente a través de la API REST de Google.
    * Estandariza fechas que pueden venir de registros antiguos o de Excel a un formato leíble.
    * Provee funciones vitales para el funcionamiento interactivo de la página: `saveEntry` (para crear o modificar) y `deleteEntry` (para eliminar filas), manejando al mismo tiempo el estado en la interfaz para que los cambios se reflejen de inmediato.

### Directorio de Utilidades (`src/utils/`)

* **`firestoreSerializer.ts`**: Archivo utilitario diseñado para ayudar al hook `useDashboard.ts`. Transforma los objetos o diccionarios nativos de JavaScript al formato estricto y tipado de árbol que exige la API REST oficial de Firestore (ej. transformando cadenas a `{ stringValue: "..." }`).

### Otros archivos y directorios

* **`src/types/index.ts`**: Define tipos de datos con respecto a dimensiones, y KPIs ("DataPoint", "KPI", etc.).
* **`src/assets/`**: Un directorio común para ubicar archivos estáticos y recursos como las imágenes que usa el proyecto (logos de React, Vite, hero.png).

## ⚙️ Configuración y Ejecución

Para levantar el proyecto en un entorno de desarrollo local, sigue estos pasos:

1. Asegúrate de tener instalado **Node.js**.
2. Abre la terminal, colócate en la raíz del proyecto y descarga las dependencias ejecutando:
   ```bash
   npm install
   ```
3. Configura tus variables de entorno para la conexión de Firebase. Necesitarás tener un archivo `.env` en la raíz de tu proyecto con las claves correspondientes (`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, etc.).
4. Ejecuta el servidor de desarrollo en modo rápido:
   ```bash
   npm run dev
   ```

## 🏗️ Despliegue a Producción

Para compilar y empaquetar la aplicación de manera optimizada y lista para subir a un servidor web o hosting estático:
```bash
npm run build
```
Este comando construirá tu aplicación dentro del directorio `dist/`.
