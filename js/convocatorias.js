// JavaScript para funcionalidades interactivas de la pagina de Convocatorias

// Espera a que el DOM (la estructura HTML) este completamente cargado antes de ejecutar el codigo
// Esto previene errores si intentamos buscar elementos que aun no existen
document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================================================
    // 1. FUNCIONALIDAD DEL ACORDEON
    // Permite expandir y contraer secciones de información
    // ==========================================================================
    
    // Selecciona todos los elementos con la clase .accordion-header
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    // Recorre cada encabezado encontrado para asignarle un comportamiento
    accordionHeaders.forEach(header => {
        // Escucha el evento 'click' en cada encabezado
        header.addEventListener('click', function() {
            // 'this' es el encabezado clickeado. Buscamos su padre (.accordion-item)
            const accordionItem = this.closest('.accordion-item');
            
            // Verifica si este item especifico ya tiene la clase 'active' (esta abierto)
            const isActive = accordionItem.classList.contains('active');
            
            // Lógica de "Acordeón Exclusivo": 
            // Primero cierra TODOS los items (quita la clase active de todos)
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Si el que clickeamos NO estaba activo al principio, ahora lo activamos.
            // (Si ya estaba activo, el bloque anterior lo cerró y aquí no hacemos nada, dejándolo cerrado)
            if (!isActive) {
                accordionItem.classList.add('active');
            }
        });
    });
    
    // ==========================================================================
    // 2. SCROLL SUAVE PARA ANCLAS
    // Hace que los links internos (#seccion) se deslicen suavemente en vez de saltar
    // ==========================================================================
    
    // Selector CSS avanzado: busca etiquetas <a> cuyo atributo href EMPIECE por "#"
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Obtiene el texto del href (ej: "#requisitos")
            const targetId = this.getAttribute('href');
            
            // Validación: Si el href es solo "#" (vacío), no hace nada
            if (targetId !== '#') {
                e.preventDefault(); // Evita el salto brusco estándar del navegador
                
                // Busca el elemento HTML que tiene ese ID
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // CÁLCULO DE POSICIÓN:
                    // headerHeight = 85: Es la altura de tu menú fijo superior.
                    // Restamos esa altura para que el título no quede tapado por el menú.
                    const headerHeight = 85;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    // Ejecuta el desplazamiento suave nativo
                    window.scrollTo({
                        top: targetPosition, // Posición vertical calculada
                        behavior: 'smooth'   // Define la animación suave
                    });
                }
            }
        });
    });
    
    // ==========================================================================
    // 3. ANIMACION DE ENTRADA (FADE-IN UP)
    // Usa IntersectionObserver para animar elementos cuando entran en pantalla
    // ==========================================================================
    
    // Configuración del observador
    const observerOptions = {
        threshold: 0.2, // La animación inicia cuando el 20% del elemento es visible
        rootMargin: '0px 0px -50px 0px' // Margen inferior negativo: obliga a scrollear un poco más antes de activar
    };
    
    // Función que se ejecuta cuando el estado de visibilidad cambia
    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { // Si el elemento entra en la zona visible
                
                // ESTADO INICIAL (pre-animación):
                entry.target.style.opacity = '0'; // Invisible
                entry.target.style.transform = 'translateY(30px)'; // Desplazado 30px hacia abajo
                
                // Pequeño delay (100ms) para asegurar que el navegador procese el estado inicial
                setTimeout(() => {
                    // Define la transición CSS (duración 0.6s, efecto suavizado)
                    entry.target.style.transition = 'all 0.6s ease';
                    
                    // ESTADO FINAL (animado):
                    entry.target.style.opacity = '1'; // Visible
                    entry.target.style.transform = 'translateY(0)'; // Vuelve a su posición original
                }, 100);
                
                // IMPORTANTE: Deja de observar el elemento para que la animación no se repita
                observer.unobserve(entry.target);
            }
        });
    };
    
    // Instancia el observador con la lógica definida arriba
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // ==========================================================================
    // 4. APLICACIÓN DE OBSERVADORES
    // Conecta diferentes grupos de elementos al sistema de animación
    // ==========================================================================

    // Items del timeline (línea de tiempo)
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        observer.observe(item); // Empieza a vigilar cada item
    });
    
    // Tarjetas de modalidades
    const modalidadCards = document.querySelectorAll('.modalidad-card');
    modalidadCards.forEach(card => {
        observer.observe(card);
    });
    
    // Tarjetas de ética
    const eticaCards = document.querySelectorAll('.etica-card');
    eticaCards.forEach(card => {
        observer.observe(card);
    });
    
    // Tarjetas de inscripción
    const inscripcionCards = document.querySelectorAll('.inscripcion-card');
    inscripcionCards.forEach(card => {
        observer.observe(card);
    });
    
    // ==========================================================================
    // 5. EFECTO PARALLAX (MOVIMIENTO DE FONDO)
    // ==========================================================================
    
    // Optimización: Solo ejecuta en PC/Laptop. Detecta si NO tiene pantalla táctil.
    // (En móviles el evento scroll dispara demasiadas veces y puede trabar el celular)
    if (!('ontouchstart' in window)) {
        const heroImagen = document.querySelector('.hero-imagen-vertical');
        
        if (heroImagen) {
            window.addEventListener('scroll', function() {
                const scrollPosition = window.pageYOffset; // Píxeles scrolleados hacia abajo
                const heroSection = document.querySelector('.convocatoria-hero');
                
                // Solo calcula si estamos viendo la sección del hero (ahorra recursos)
                if (scrollPosition < heroSection.offsetHeight) {
                    // MATEMÁTICA PARALLAX:
                    // Multiplica el scroll por 0.3. Si bajas 100px, la imagen baja solo 30px.
                    // Esa diferencia de velocidad crea la sensación de profundidad 3D.
                    heroImagen.style.transform = `translateY(${scrollPosition * 0.3}px)`;
                }
            });
        }
    }
    
    // ==========================================================================
    // 6. EFECTO "RIPPLE" (ONDA) EN BOTONES
    // Crea un círculo que se expande desde donde hiciste click
    // ==========================================================================
    
    const actionButtons = document.querySelectorAll('.btn-postular, .btn-accion, .btn-descarga');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Crea dinámicamente un elemento <span> para la onda
            const ripple = document.createElement('span');
            
            // Obtiene las dimensiones y posición del botón en la pantalla
            const rect = this.getBoundingClientRect();
            
            // Calcula el tamaño del círculo (toma el lado más grande del botón)
            const size = Math.max(rect.width, rect.height);
            
            // MATEMÁTICA DE COORDENADAS:
            // e.clientX = Dónde hizo click el mouse en la pantalla
            // rect.left = Dónde empieza el botón
            // Restamos para saber dónde fue el click DENTRO del botón
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            // Aplica dimensiones y posición al span
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple'); // Clase para estilos base
            
            // Estilos CSS inyectados directamente para la animación
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%'; // Círculo perfecto
            ripple.style.background = 'rgba(255, 255, 255, 0.6)'; // Blanco semitransparente
            ripple.style.transform = 'scale(0)'; // Empieza diminuto
            ripple.style.animation = 'ripple-animation 0.6s ease-out'; // Nombre de la animación keyframe
            ripple.style.pointerEvents = 'none'; // Permite hacer click a través de la onda
            
            // Prepara el botón contenedor
            this.style.position = 'relative'; // Necesario para que el absolute de adentro funcione
            this.style.overflow = 'hidden'; // Corta la onda si se sale del botón
            
            this.appendChild(ripple); // Agrega la onda al botón
            
            // Limpieza: Borra el elemento span del DOM al terminar la animación
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Inyecta los keyframes de la animación en el <head> del documento
    // Esto define cómo crece y desaparece el círculo
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple-animation {
            to {
                transform: scale(4); /* Crece 4 veces su tamaño */
                opacity: 0;          /* Se desvanece */
            }
        }
    `;
    document.head.appendChild(style);
    
    // ==========================================================================
    // 7. BADGE (ETIQUETA) DE ESTADO
    // Cambia color y texto según el estado de la convocatoria
    // ==========================================================================
    
    const badge = document.querySelector('.badge-convocatoria');
    
    if (badge) {
        // Variable de control (esto vendría normalmente de una base de datos)
        const estadoConvocatoria = 'abierta'; // Opciones: 'abierta', 'cerrada', 'proximamente'
        
        // Lógica condicional para cambiar la apariencia
        if (estadoConvocatoria === 'cerrada') {
            badge.style.backgroundColor = '#f44336'; // Rojo
            badge.textContent = 'Cerrada';
        } else if (estadoConvocatoria === 'proximamente') {
            badge.style.backgroundColor = '#ff9800'; // Naranja
            badge.textContent = 'Proximamente';
        }
        
        // Animación de pulso continuo (latido)
        setInterval(() => {
            badge.style.transform = 'scale(1.05)'; // Crece un 5%
            setTimeout(() => {
                badge.style.transform = 'scale(1)'; // Vuelve a tamaño normal
            }, 200);
        }, 3000); // Se repite cada 3 segundos
    }
    
    // ==========================================================================
    // 8. SIMULACIÓN DE DESCARGA
    // Da feedback visual al usuario al clickear botones de descarga
    // ==========================================================================
    
    const downloadLinks = document.querySelectorAll('.btn-descarga');
    
    downloadLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Solo actúa si el link es un placeholder ("#")
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                
                // Guarda el texto original ("Descargar PDF")
                const originalText = this.querySelector('span').textContent;
                // Cambia el texto para indicar acción
                this.querySelector('span').textContent = 'Descargando...';
                
                // Simula un proceso de 2 segundos y restaura el texto
                setTimeout(() => {
                    this.querySelector('span').textContent = originalText;
                }, 2000);
                
                console.log('Iniciando descarga:', originalText);
            }
        });
    });
    
    // ==========================================================================
    // 9. ACCESIBILIDAD (A11Y) - TECLADO
    // Permite usar el acordeón con teclas Tab y Enter/Espacio
    // ==========================================================================
    
    accordionHeaders.forEach(header => {
        header.addEventListener('keydown', function(e) {
            // Detecta si se presiona Enter o Barra Espaciadora
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault(); // Evita scroll con espacio
                this.click(); // Simula un click normal
            }
        });
        
        // Agrega el atributo tabindex="0" para que el navegador se detenga aquí al usar TAB
        header.setAttribute('tabindex', '0');
    });
    
    // ==========================================================================
    // 10. BARRA DE PROGRESO DE LECTURA
    // Crea una barra en el tope que se llena al bajar por la página
    // ==========================================================================
    
    // Crea el elemento div desde cero usando JS
    const progressBar = document.createElement('div');
    // Aplica estilos CSS en línea
    progressBar.style.position = 'fixed'; // Fija en pantalla
    progressBar.style.top = '85px'; // Justo debajo del navbar
    progressBar.style.left = '0';
    progressBar.style.width = '0%'; // Empieza vacía
    progressBar.style.height = '3px';
    progressBar.style.backgroundColor = '#000000'; // Color negro
    progressBar.style.zIndex = '9999'; // Encima de todo
    progressBar.style.transition = 'width 0.1s ease'; // Movimiento fluido
    document.body.appendChild(progressBar); // Lo inserta en el HTML
    
    // Evento scroll para actualizar el ancho
    window.addEventListener('scroll', function() {
        const windowHeight = window.innerHeight; // Altura de la ventana visible
        const documentHeight = document.documentElement.scrollHeight - windowHeight; // Altura total scrolleable
        const scrolled = window.pageYOffset; // Cuánto hemos bajado
        
        // Regla de tres simple para obtener porcentaje (0 a 100)
        const progress = (scrolled / documentHeight) * 100;
        
        // Actualiza el ancho de la barra
        progressBar.style.width = progress + '%';
    });
    
    // ==========================================================================
    // 11. LAZY LOADING (CARGA DIFERIDA)
    // Carga imágenes solo cuando van a aparecer en pantalla para ahorrar datos
    // ==========================================================================
    
    if ('IntersectionObserver' in window) { // Verifica soporte del navegador
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // Si la imagen tiene data-src (ruta real oculta)
                    if (img.dataset.src) {
                        img.src = img.dataset.src; // Mueve la ruta al src real para que cargue
                        img.removeAttribute('data-src'); // Limpieza
                        imageObserver.unobserve(img); // Deja de observar esta imagen
                    }
                }
            });
        });
        
        // Busca imágenes preparadas para lazy load (tienen data-src en vez de src)
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ==========================================================================
    // 12. ANIMACIÓN ESPECÍFICA TIMELINE (PUNTOS)
    // Efecto "Pop" para los círculos de la línea de tiempo
    // ==========================================================================
    
    const timelinePuntos = document.querySelectorAll('.timeline-punto');
    
    const puntosObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Inicia animación: centrado horizontal (-50%) y escala 0 (invisible)
                entry.target.style.transform = 'translateX(-50%) scale(0)';
                // Define una curva de animación "bouncy" (rebote elástico)
                entry.target.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                
                // Dispara el cambio de escala a 1 (tamaño real)
                setTimeout(() => {
                    entry.target.style.transform = 'translateX(-50%) scale(1)';
                }, 100);
                
                puntosObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 }); // Requiere que el 50% del punto sea visible
    
    timelinePuntos.forEach(punto => {
        puntosObserver.observe(punto);
    });
    
    console.log('Convocatorias: Todos los scripts cargados correctamente');
});