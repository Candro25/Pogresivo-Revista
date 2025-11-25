// ==========================================================================
// IDENTIDAD PROGRESIVO - FUNCIONALIDADES INTERACTIVAS
// ==========================================================================

// Espera a que el DOM (la estructura HTML) esté completamente cargado antes de ejecutar nada
document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================================================
    // EFECTO PARALLAX EN EL HERO
    // Mueve la imagen de fondo a diferente velocidad que el scroll para crear profundidad
    // ==========================================================================
    
    const heroImage = document.querySelector('.hero-image-parallax'); // Selecciona la imagen del hero
    
    if (heroImage) { // Solo ejecuta si la imagen existe
        window.addEventListener('scroll', function() { // Escucha el evento de desplazamiento de la ventana
            const scrollPosition = window.pageYOffset; // Obtiene cuántos píxeles se ha bajado (scroll vertical)
            
            // Mueve la imagen más lento que el scroll (factor 0.5 = mitad de velocidad)
            // Esto crea la ilusión de que la imagen está "más lejos" que el contenido
            heroImage.style.transform = `translateY(${scrollPosition * 0.5}px)`; 
        });
    }
    
    // ==========================================================================
    // NAVEGACIÓN ACTIVA SEGÚN SECCIÓN VISIBLE (Intersection Observer)
    // Detecta qué sección está visible en pantalla y "enciende" su link en el menú
    // ==========================================================================
    
    const sections = document.querySelectorAll('.content-section'); // Selecciona todas las secciones de contenido
    const navLinks = document.querySelectorAll('.nav-link'); // Selecciona todos los enlaces del menú
    
    // Configuración para el "Ojo" que observa (IntersectionObserver)
    const observerOptions = {
        root: null, // null significa que usa el viewport (la ventana del navegador) como marco de referencia
        rootMargin: '-100px 0px -66%', // Ajuste técnico: reduce el área de detección para que el cambio de sección sea más preciso
        threshold: 0 // Se activa apenas un píxel de la sección entra en la zona definida arriba
    };
    
    // Esta función se ejecuta cada vez que una sección entra o sale de la vista
    const observerCallback = (entries) => {
        entries.forEach(entry => { // Revisa cada elemento que cambió su estado de visibilidad
            if (entry.isIntersecting) { // Si el elemento está entrando en la zona visible...
                
                // Obtiene el ID de la sección que se está viendo (ej: "intro", "historia")
                const sectionId = entry.target.getAttribute('id');
                
                // 1. Limpieza: Remueve la clase 'active' de TODOS los links del menú
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // 2. Activación: Busca el link específico que apunta a esta sección (usando data-section)
                const activeLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
                
                // Si encuentra el link correspondiente, le añade la clase 'active' (lo resalta)
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    };
    
    // Crea la instancia del observador con la función y opciones definidas arriba
    const sectionObserver = new IntersectionObserver(observerCallback, observerOptions);
    
    // Ordena al observador que vigile cada una de las secciones
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // ==========================================================================
    // BARRA DE PROGRESO DE LECTURA
    // Muestra visualmente (barra horizontal) cuánto falta para terminar de leer
    // ==========================================================================
    
    const progressBar = document.getElementById('progressBar'); // Busca el elemento de la barra
    
    if (progressBar) { // Solo si la barra existe en el HTML
        window.addEventListener('scroll', function() {
            // 1. Calcula la altura visible de la ventana
            const windowHeight = window.innerHeight;
            // 2. Calcula la altura total del contenido SCROLLEABLE (Total documento - Altura ventana)
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            // 3. Obtiene la posición actual
            const scrolled = window.pageYOffset;
            
            // Regla de tres simple: Calcula el porcentaje scrolleado (0 a 100)
            const progress = (scrolled / documentHeight) * 100;
            
            // Aplica ese porcentaje al ancho (width) de la barra CSS
            progressBar.style.width = progress + '%';
        });
    }
    
    // ==========================================================================
    // ANIMACIÓN REVEAL AL HACER SCROLL
    // Revela elementos suavemente (fade-in / slide-up) cuando entran en pantalla
    // ==========================================================================
    
    const revealElements = document.querySelectorAll('[data-reveal]'); // Busca elementos con el atributo personalizado data-reveal
    
    // Configuración específica para los reveals
    const revealOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // El elemento debe estar visible un 15% para que se dispare la animación
    };
    
    // Función que maneja la aparición
    const revealCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { // Si el elemento ya es visible al 15%...
                entry.target.classList.add('revealed'); // Agrega la clase CSS que ejecuta la transición (opacity: 1, transform: translateY(0))
                
                // IMPORTANTE: Deja de observar el elemento. 
                // Esto asegura que la animación solo ocurra UNA vez y ahorra recursos del navegador.
                revealObserver.unobserve(entry.target);
            }
        });
    };
    
    // Crea el observador para las animaciones
    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    
    // Empieza a vigilar todos los elementos marcados para revelar
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
    
    // ==========================================================================
    // PANELES EXPANDIBLES (ACORDEÓN)
    // Permite expandir y colapsar contenido adicional al hacer click
    // ==========================================================================
    
    const panelTriggers = document.querySelectorAll('.panel-trigger'); // Botones/títulos que abren el panel
    
    panelTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            // Busca el elemento padre más cercano con clase .expandable-panel
            const panel = this.closest('.expandable-panel');
            
            // Alterna la clase 'open': si está, la quita; si no está, la pone
            panel.classList.toggle('open');
            
            // Accesibilidad (A11Y): Informa a los lectores de pantalla si está abierto o cerrado
            const isOpen = panel.classList.contains('open');
            this.setAttribute('aria-expanded', isOpen);
        });
    });
    
    // ==========================================================================
    // SMOOTH SCROLL PARA LINKS DE NAVEGACIÓN
    // Evita el salto brusco al hacer click en el menú y compensa el header fijo
    // ==========================================================================
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Evita el comportamiento estándar (salto inmediato)
            
            // Obtiene el ID del destino quitando el símbolo # (ej: #inicio -> inicio)
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId); // Busca la sección destino
            
            if (targetSection) {
                // Configura la compensación para el menú fijo
                const headerHeight = 120; // Píxeles de altura del header que tapa el contenido
                // Calcula la posición exacta donde debe aterrizar el scroll
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                // Ejecuta el desplazamiento suave nativo del navegador
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth' // Esta es la clave para la animación suave
                });
            }
        });
    });
    
    // ==========================================================================
    // TOOLTIPS INTERACTIVOS
    // Mejora la experiencia en móviles donde no existe el "hover" (pasar el mouse)
    // ==========================================================================
    
    const highlightTerms = document.querySelectorAll('.highlight-term'); // Busca términos subrayados/especiales
    
    // Recorre cada término
    highlightTerms.forEach(term => {
        term.addEventListener('click', function(e) {
            // Detecta si el dispositivo es táctil (celular/tablet) comprobando si existe el evento 'ontouchstart'
            if ('ontouchstart' in window) {
                e.preventDefault(); // Evita que siga un enlace si lo tuviera
                
                // Alterna una clase que fuerza la visualización del tooltip mediante CSS
                this.classList.toggle('tooltip-active');
            }
        });
    }); // Cierre del forEach de tooltips

}); // Cierre del EventListener principal (DOMContentLoaded)