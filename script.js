/* ========================================
   LUNA & ENERGÍA - JAVASCRIPT PRINCIPAL
   Funcionalidades interactivas del sitio
   ======================================== */

// ========================================
// 2. CONTADOR HASTA LA PRÓXIMA LUNA LLENA
// ========================================

/**
 * Calcula la próxima fecha de luna llena
 * Fechas reales de lunas llenas 2024-2025
 */
function calcularProximaLunaLlena() {
  // Fechas reales de lunas llenas 2024-2025 (hora Argentina UTC-3)
  const lunasLlenas = [
    new Date('2024-11-15T21:29:00-03:00'),
    new Date('2024-12-15T09:02:00-03:00'),
    new Date('2025-01-13T22:27:00-03:00'),
    new Date('2025-02-12T13:53:00-03:00'),
    new Date('2025-03-14T06:55:00-03:00'),
    new Date('2025-04-13T00:22:00-03:00'),
    new Date('2025-05-12T16:56:00-03:00'),
    new Date('2025-06-11T07:44:00-03:00'),
    new Date('2025-07-10T20:37:00-03:00'),
    new Date('2025-08-09T07:56:00-03:00'),
    new Date('2025-09-07T18:09:00-03:00'),
    new Date('2025-10-07T03:48:00-03:00'),
    new Date('2025-11-05T13:19:00-03:00'),
    new Date('2025-12-04T23:14:00-03:00')
  ];
  
  const ahora = new Date();
  
  // Buscar la próxima luna llena
  for (let fecha of lunasLlenas) {
    if (fecha > ahora) {
      return fecha;
    }
  }
  
  // Si no hay más en la lista, calcular aproximadamente la siguiente
  const ultimaFecha = lunasLlenas[lunasLlenas.length - 1];
  const nuevaFecha = new Date(ultimaFecha);
  nuevaFecha.setDate(nuevaFecha.getDate() + 29.53);
  return nuevaFecha;
}

/**
 * Actualiza el contador regresivo cada segundo
 */
function actualizarContador() {
  const contadorEl = document.getElementById('contadorLunaLlena');
  const fechaEl = document.getElementById('fechaLunaLlena');
  
  if (!contadorEl || !fechaEl) return;
  
  const proximaLunaLlena = calcularProximaLunaLlena();
  const ahora = new Date();
  const diferencia = proximaLunaLlena - ahora;
  
  // Calcular días, horas, minutos y segundos
  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
  
  // Mostrar el contador
  contadorEl.textContent = `${dias}d ${horas}h ${minutos}m ${segundos}s`;
  
  // Mostrar la fecha completa
  const opciones = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  fechaEl.textContent = `Fecha: ${proximaLunaLlena.toLocaleDateString('es-AR', opciones)}`;
}

// Actualizar el contador cada segundo
actualizarContador();
setInterval(actualizarContador, 1000);

// ========================================
// 3. CALENDARIO LUNAR DEL MES
// ========================================

/**
 * Obtiene la fase lunar aproximada para una fecha dada
 * Basado en fechas reales de lunas nuevas 2024-2025
 * Retorna un emoji representando la fase
 */
function obtenerFaseLunar(fecha) {
  // Fechas reales de lunas nuevas 2024-2025 (hora Argentina)
  const lunasNuevas = [
    new Date('2024-11-01T12:47:00-03:00'),
    new Date('2024-12-01T06:21:00-03:00'),
    new Date('2024-12-30T22:27:00-03:00'),
    new Date('2025-01-29T12:36:00-03:00'),
    new Date('2025-02-28T00:45:00-03:00'),
    new Date('2025-03-29T10:58:00-03:00'),
    new Date('2025-04-27T19:31:00-03:00'),
    new Date('2025-05-27T03:02:00-03:00'),
    new Date('2025-06-25T10:32:00-03:00'),
    new Date('2025-07-24T19:11:00-03:00'),
    new Date('2025-08-23T06:06:00-03:00'),
    new Date('2025-09-21T19:54:00-03:00'),
    new Date('2025-10-21T12:25:00-03:00'),
    new Date('2025-11-20T06:47:00-03:00'),
    new Date('2025-12-20T01:43:00-03:00')
  ];
  
  const cicloLunar = 29.53; // días
  
  // Encontrar la luna nueva más cercana anterior a la fecha
  let lunaNuevaMasCercana = lunasNuevas[0];
  for (let lunaNueva of lunasNuevas) {
    if (lunaNueva <= fecha) {
      lunaNuevaMasCercana = lunaNueva;
    } else {
      break;
    }
  }
  
  // Calcular días desde la última luna nueva
  const diferenciaDias = (fecha - lunaNuevaMasCercana) / (1000 * 60 * 60 * 24);
  const edad = diferenciaDias % cicloLunar;
  
  // Determinar la fase según los días transcurridos
  if (edad < 1) return '🌑'; // Luna nueva
  if (edad < 6.38) return '🌒'; // Creciente joven
  if (edad < 8.38) return '🌓'; // Cuarto creciente
  if (edad < 13.76) return '🌔'; // Creciente gibosa
  if (edad < 15.76) return '🌕'; // Luna llena
  if (edad < 21.14) return '🌖'; // Menguante gibosa
  if (edad < 23.14) return '🌗'; // Cuarto menguante
  if (edad < 28.53) return '🌘'; // Menguante
  return '🌑'; // Luna nueva
}

/**
 * Genera el calendario lunar del mes actual
 */
function generarCalendarioLunar() {
  const calendarioEl = document.getElementById('calendarioLunar');
  if (!calendarioEl) return;
  
  const hoy = new Date();
  const year = hoy.getFullYear();
  const mes = hoy.getMonth();
  
  // Obtener el primer y último día del mes
  const primerDia = new Date(year, mes, 1);
  const ultimoDia = new Date(year, mes + 1, 0);
  const diasEnMes = ultimoDia.getDate();
  
  // Mostrar el nombre del mes y año
  const nombreMes = hoy.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
  const tituloMes = document.createElement('h3');
  tituloMes.textContent = nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);
  tituloMes.style.cssText = 'text-align: center; color: var(--accent-2); margin-bottom: 1rem; grid-column: 1 / -1;';
  
  // Limpiar el calendario
  calendarioEl.innerHTML = '';
  calendarioEl.appendChild(tituloMes);
  
  // Generar cada día del mes
  for (let dia = 1; dia <= diasEnMes; dia++) {
    const fecha = new Date(year, mes, dia);
    const faseLunar = obtenerFaseLunar(fecha);
    const esHoy = dia === hoy.getDate();
    
    const diaDiv = document.createElement('div');
    diaDiv.className = `dia-calendario ${esHoy ? 'dia-hoy' : ''}`;
    diaDiv.innerHTML = `
      <span class="dia-numero">${dia}</span>
      <span class="dia-fase">${faseLunar}</span>
    `;
    
    // Agregar título con información adicional
    const nombreDia = fecha.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
    diaDiv.title = `${nombreDia} - Fase: ${faseLunar}`;
    
    calendarioEl.appendChild(diaDiv);
  }
}

// Generar el calendario al cargar la página
generarCalendarioLunar();

// ========================================
// 4. FORMULARIO DE CONTACTO
// ========================================

/**
 * Maneja el envío del formulario de contacto
 * Guarda los datos en localStorage y muestra confirmación
 */
const contactForm = document.getElementById('contactForm');
const statusEl = document.getElementById('status');

if (contactForm && statusEl) {
  contactForm.addEventListener('submit', function(evento) {
    // Prevenir el envío tradicional del formulario
    evento.preventDefault();
    
    // Obtener los valores del formulario
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const motivo = document.getElementById('motivo').value;
    const mensaje = document.getElementById('mensaje').value.trim();
    
    // Validar que los campos requeridos no estén vacíos
    if (!nombre || !email || !mensaje) {
      statusEl.textContent = '⚠️ Por favor, completá todos los campos obligatorios.';
      statusEl.style.color = '#ff6b6b';
      return;
    }
    
    // Guardar en localStorage
    localStorage.setItem('nombre', nombre);
    localStorage.setItem('email', email);
    localStorage.setItem('ultimoContacto', new Date().toISOString());
    
    // Mostrar mensaje de confirmación
    statusEl.textContent = `✅ ¡Gracias, ${nombre}! Tu mensaje ha sido enviado. Te responderemos a ${email} pronto.`;
    statusEl.style.color = '#7fd8be';
    
    // Limpiar el formulario después de 3 segundos
    setTimeout(() => {
      contactForm.reset();
      statusEl.textContent = '';
    }, 5000);
  });
}

// ========================================
// 5. TOGGLE DE MODO DE COLOR
// ========================================

/**
 * Cambia entre modo frío (azul) y cálido (tonos rosados/cálidos)
 */
const toggleBtn = document.getElementById('toggle');

if (toggleBtn) {
  toggleBtn.addEventListener('click', function() {
    const root = document.documentElement;
    const cardActual = getComputedStyle(root).getPropertyValue('--card').trim();
    
    if (cardActual === 'rgb(18, 24, 41)' || cardActual === '#121829') {
      // Cambiar a modo cálido (tonos rosados/naranjas más suaves)
      root.style.setProperty('--card', '#2a1a1f');
      root.style.setProperty('--accent', '#ffb3ba');
      root.style.setProperty('--accent-2', '#ffa07a');
      root.style.setProperty('--hover', 'rgba(255, 179, 186, 0.12)');
      toggleBtn.textContent = 'Cambiar modo (frío)';
      toggleBtn.setAttribute('aria-label', 'Cambiar a modo frío');
    } else {
      // Cambiar a modo frío (original azul)
      root.style.setProperty('--card', '#121829');
      root.style.setProperty('--accent', '#94b9ff');
      root.style.setProperty('--accent-2', '#ffd08a');
      root.style.setProperty('--hover', 'rgba(148, 185, 255, 0.12)');
      toggleBtn.textContent = 'Cambiar modo (cálido)';
      toggleBtn.setAttribute('aria-label', 'Cambiar a modo cálido');
    }
  });
}

// ========================================
// 6. DRAG & DROP - ALTAR INTERACTIVO
// ========================================

const moonDraggable = document.getElementById('moon');
const dropzone = document.getElementById('dropzone');
const demoMsg = document.getElementById('demoMsg');

if (moonDraggable && dropzone && demoMsg) {
  
  /**
   * Evento cuando se inicia el arrastre
   */
  moonDraggable.addEventListener('dragstart', function(evento) {
    evento.dataTransfer.setData('text/plain', '🌕');
    evento.dataTransfer.effectAllowed = 'move';
  });
  
  /**
   * Evento cuando el elemento pasa sobre la zona de soltar
   */
  dropzone.addEventListener('dragover', function(evento) {
    evento.preventDefault(); // Necesario para permitir el drop
    evento.dataTransfer.dropEffect = 'move';
    dropzone.classList.add('ok');
  });
  
  /**
   * Evento cuando el elemento sale de la zona de soltar
   */
  dropzone.addEventListener('dragleave', function() {
    dropzone.classList.remove('ok');
  });
  
  /**
   * Evento cuando se suelta el elemento en la zona
   */
  dropzone.addEventListener('drop', function(evento) {
    evento.preventDefault();
    dropzone.classList.remove('ok');
    
    // Cambiar el contenido del dropzone
    const emoji = evento.dataTransfer.getData('text/plain');
    dropzone.textContent = `¡Perfecto! ${emoji} La Luna está en el altar ✨`;
    dropzone.style.fontSize = '1.5rem';
    dropzone.style.color = 'var(--accent-2)';
    
    // Actualizar el mensaje explicativo
    demoMsg.innerHTML = `
      <strong>¡Ritual completado! ✨</strong><br>
      Eventos JavaScript utilizados: <code>dragstart</code>, <code>dragover</code>, 
      <code>dragleave</code> y <code>drop</code> con <code>preventDefault()</code>
    `;
    
    // Ocultar la luna arrastrable
    moonDraggable.style.opacity = '0.3';
    moonDraggable.draggable = false;
  });
  
  /**
   * Accesibilidad: permitir usar el teclado
   */
  moonDraggable.addEventListener('keydown', function(evento) {
    if (evento.key === 'Enter' || evento.key === ' ') {
      evento.preventDefault();
      // Simular el drop
      const dropEvent = new Event('drop');
      dropEvent.dataTransfer = { getData: () => '🌕' };
      dropzone.dispatchEvent(dropEvent);
    }
  });
}

// ========================================
// 7. SMOOTH SCROLL MEJORADO + RESALTAR SECCIÓN ACTIVA
// ========================================

/**
 * Mejora la navegación suave entre secciones
 * Agrega un pequeño offset para el header sticky
 */
document.querySelectorAll('nav a[href^="#"]').forEach(function(enlace) {
  enlace.addEventListener('click', function(evento) {
    evento.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      const headerHeight = document.querySelector('header').offsetHeight;
      const targetPosition = targetSection.offsetTop - headerHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

/**
 * Resalta el enlace del menú según la sección visible
 */
function actualizarMenuActivo() {
  const secciones = document.querySelectorAll('main section');
  const enlaces = document.querySelectorAll('nav a[href^="#"]');
  const scrollPos = window.scrollY + 150; // Offset para activar antes
  
  secciones.forEach(function(seccion) {
    const top = seccion.offsetTop;
    const height = seccion.offsetHeight;
    const id = seccion.getAttribute('id');
    
    if (scrollPos >= top && scrollPos < top + height) {
      // Remover clase activa de todos los enlaces
      enlaces.forEach(function(enlace) {
        enlace.classList.remove('activo');
      });
      
      // Agregar clase activa al enlace correspondiente
      const enlaceActivo = document.querySelector(`nav a[href="#${id}"]`);
      if (enlaceActivo) {
        enlaceActivo.classList.add('activo');
      }
    }
  });
}

// Ejecutar al hacer scroll
window.addEventListener('scroll', actualizarMenuActivo);
// Ejecutar al cargar la página
actualizarMenuActivo();

// ========================================
// 8. LAZY LOADING DE IMÁGENES
// ========================================

/**
 * Observa las imágenes y las carga cuando están cerca del viewport
 * Mejora el rendimiento de carga de la página
 */
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });
  
  // Observar todas las imágenes
  document.querySelectorAll('img').forEach(function(img) {
    imageObserver.observe(img);
  });
}

// ========================================
// 9. VALIDACIÓN EN TIEMPO REAL DEL FORMULARIO
// ========================================

/**
 * Proporciona feedback visual mientras el usuario escribe
 */
const nombreInput = document.getElementById('nombre');
const emailInput = document.getElementById('email');
const mensajeInput = document.getElementById('mensaje');

/**
 * Valida el formato del email
 */
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Agrega validación visual a los campos
 */
function agregarValidacionVisual(input, esValido) {
  if (esValido) {
    input.style.borderColor = '#7fd8be';
  } else {
    input.style.borderColor = '#ff6b6b';
  }
}

// Validación del nombre
if (nombreInput) {
  nombreInput.addEventListener('blur', function() {
    const esValido = this.value.trim().length >= 2;
    agregarValidacionVisual(this, esValido);
  });
}

// Validación del email
if (emailInput) {
  emailInput.addEventListener('blur', function() {
    const esValido = validarEmail(this.value.trim());
    agregarValidacionVisual(this, esValido);
  });
}

// Validación del mensaje
if (mensajeInput) {
  mensajeInput.addEventListener('blur', function() {
    const esValido = this.value.trim().length >= 10;
    agregarValidacionVisual(this, esValido);
  });
}

// ========================================
// 10. INDICADOR DE PROGRESO DE LECTURA
// ========================================

/**
 * Muestra cuánto del contenido ha sido leído
 */
function actualizarBarraProgreso() {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight - windowHeight;
  const scrolled = window.scrollY;
  const progreso = (scrolled / documentHeight) * 100;
  
  // Crear la barra si no existe
  let barra = document.getElementById('barra-progreso');
  if (!barra) {
    barra = document.createElement('div');
    barra.id = 'barra-progreso';
    barra.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--accent), var(--accent-2));
      z-index: 1000;
      transition: width 0.1s ease;
    `;
    document.body.appendChild(barra);
  }
  
  barra.style.width = `${progreso}%`;
}

window.addEventListener('scroll', actualizarBarraProgreso);
actualizarBarraProgreso(); // Ejecutar al cargar

// ========================================
// 11. DETECCIÓN Y MENSAJE DE COMPATIBILIDAD
// ========================================

/**
 * Verifica si el navegador soporta las funcionalidades
 * necesarias y notifica al usuario si hay problemas
 */
function verificarCompatibilidad() {
  const funcionalidades = {
    localStorage: typeof(Storage) !== 'undefined',
    flexbox: CSS.supports('display', 'flex'),
    grid: CSS.supports('display', 'grid'),
    customProperties: CSS.supports('--fake-var', '0')
  };
  
  const todasSoportadas = Object.values(funcionalidades).every(Boolean);
  
  if (!todasSoportadas) {
    console.warn('⚠️ Algunas funcionalidades pueden no estar disponibles en tu navegador.');
  }
}

verificarCompatibilidad();

// ========================================
// 12. MENSAJE EN CONSOLA PARA DESARROLLADORES
// ========================================

console.log(`
🌙 Luna & Energía - Sitio Web
═══════════════════════════════
Desarrollado con:
• HTML5 semántico
• CSS3 moderno (Grid, Flexbox, Variables)
• JavaScript ES6+
• Diseño responsive
• Accesibilidad WCAG 2.1

¿Interesado en el código?
Visitá el repositorio o contactanos.
═══════════════════════════════
`);

// Fin del archivo JavaScript