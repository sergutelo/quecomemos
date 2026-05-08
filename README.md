# 🍽️ Quecomemos

**Quecomemos** es una aplicación web progresiva (PWA) minimalista diseñada para planificar el menú semanal de forma rápida, visual y sin complicaciones. Todo ello envuelto en una atrevida interfaz inspirada en el **Diseño Constructivista / Bauhaus**, donde "la forma sigue a la función" a través de formas geométricas puras, bordes marcados y colores primarios vibrantes.

---

## 🎨 Filosofía de Diseño
El diseño de la aplicación no es meramente un layout, es una composición. Inspirada en los pósteres de la Bauhaus de los años 20, la app utiliza:
- **Colores primarios puros:** Rojo, Amarillo y Azul sobre fondos blancos y negros absolutos.
- **Formas geométricas:** Círculos, cuadrados y triángulos que se superponen y rompen la cuadrícula tradicional.
- **Tipografía contundente:** Uso extensivo de familias tipográficas geométricas (como *Outfit*) para crear impacto visual, jerarquía y legibilidad clara.
- **Notificaciones Pop-Art:** Alertas de sistema estilizadas como viñetas de cómic retro (Lichtenstein) para mantener la personalidad hasta en los detalles técnicos.

## ✨ Características Principales

* **Planificación sin Límites (Modo Acordeón):** Visualiza y planifica hasta 10 días vista con un diseño de acordeón colapsable que mantiene la interfaz limpia y rápida.
* **100% Privado y Offline (PWA):** Todos los datos se guardan exclusivamente en el `localStorage` de tu navegador. No hay bases de datos externas, no hace falta registro y funciona perfectamente sin conexión a internet.
* **Sincronización P2P "Mágica" (Código QR):** Sincroniza el menú de los próximos días de un móvil a otro al instante usando la cámara. Los menús compartidos se fusionan inteligentemente sin borrar tus datos previos.
* **QC Analytics (Dashboard Integrado):** Aprovecha la potencia visual de Chart.js para analizar el histórico de tus platos, la evolución mensual de tu planificación y descubrir cuáles son tus recetas favoritas o las menos cocinadas.
* **Asistente Inteligente (Libro de Recetas):** La app aprende tus platos. Todo lo que escribes se guarda en un historial, y te lo sugiere a medida que tecleas en días futuros. Incluye un gestor para limpiar este recetario.
* **Compartir y Exportar:** Copia todo tu menú semanal con formato limpio (ideal para enviar por WhatsApp) o compártelo mediante un archivo de copia de seguridad (`.json`).
* **Lista de la Compra Automática:** Extrae todos los platos de tu semana y te genera una "checklist" copiable al portapapeles sin platos duplicados.
* **Modo Impresión Ahorro de Tinta:** Al enviar a imprimir (`Ctrl+P`), la app descarta todo el esquema de color y lo formatea en una tabla en blanco y negro, perfecta para la nevera.
* **Mantenimiento Autónomo:** Opción de "Auto-Purga" que borra automáticamente los platos de días pasados al abrir la app para mantener el almacenamiento optimizado.

---

## 🚀 Instalación y Uso

Dado que es una PWA basada únicamente en HTML, CSS y Vanilla JavaScript, **no requiere instalación de dependencias, compilación ni servidores como Node.js**.

1. **Clona este repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/quecomemos.git
   ```
2. **Súbelo a un servidor estático:**
   Puedes usar [GitHub Pages](https://pages.github.com/), Vercel, Netlify o cualquier servidor Apache/Nginx clásico. Si usas GitHub Pages, simplemente ve a los ajustes de tu repositorio y activa GitHub Pages apuntando a la rama `main`.
3. **Instalación en móvil:**
   Abre la URL de la web desde Safari (iOS) o Chrome (Android) y selecciona la opción **"Añadir a la pantalla de inicio"**. La app se comportará como una aplicación nativa, a pantalla completa y con su icono de escritorio personalizado.

---

## 🛠️ Stack Tecnológico
- **HTML5** semántico.
- **CSS3** puro utilizando CSS Variables (Custom Properties) para un motor de temas unificado y `@media print` para adaptabilidad offline.
- **Vanilla JavaScript (ES6+)**: Gestión completa del DOM y lógica de negocio sin frameworks pesados.
- **Service Workers & Manifest**: Capacidades Offline (PWA) de caché y control de actualizaciones de versión vía API.

---

*Desarrollado para quienes piensan que decidir qué cenar el martes no debería ser una tarea aburrida.*
