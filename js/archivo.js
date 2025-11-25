// ==========================================================================
// JAVASCRIPT PARA PÁGINAS DE ARTÍCULOS - REVISTA PROGRESIVO
// ==========================================================================

// Evento principal: Espera a que todo el HTML se cargue antes de ejecutar lógica
// Esto evita errores de "elemento no encontrado" si el script corre antes que el HTML
document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================================================
    // 1. NAVEGACIÓN ACTIVA DEL ÍNDICE (Table of Contents)
    // Detecta qué sección estás leyendo y resalta el link correspondiente
    // ==========================================================================
    
    // Selecciona todas las secciones de contenido (h2, h3 envueltos en divs)
    const secciones = document.querySelectorAll('.contenido-seccion');
    // Selecciona todos los enlaces del menú lateral
    const indiceLinks = document.querySelectorAll('.indice-link');
    
    // Configuración del Ojo Virtual (IntersectionObserver)
    const observerOptions = {
        root: null, // null = usa la ventana del navegador (viewport) como marco
        // rootMargin: Ajusta la "zona de detección". 
        // '-100px': Ignora los primeros 100px de arriba (por el header fijo).
        // '-66%': La detección ocurre en el tercio superior de la pantalla.
        rootMargin: '-100px 0px -66%', 
        threshold: 0 // Se activa apenas toca la línea invisible definida por el margin
    };
    
    // Función que se dispara cuando una sección cruza la línea de visión
    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { // Si la sección entró en la zona activa...
                // Obtiene el ID (ej: "introduccion")
                const seccionId = entry.target.getAttribute('id');
                
                // 1. Limpieza: Apaga el estilo 'active' de TODOS los links
                indiceLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // 2. Activación: Busca el link que apunta a este ID (#introduccion)
                const activeLink = document.querySelector(`.indice-link[href="#${seccionId}"]`);
                // Si existe, lo enciende
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    };
    
    // Crea el vigilante con la configuración anterior
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Le ordena vigilar cada sección del artículo
    secciones.forEach(seccion => {
        observer.observe(seccion);
    });
    
    // ==========================================================================
    // 2. SMOOTH SCROLL PARA LINKS DEL ÍNDICE
    // Evita el salto brusco y compensa la altura del menú fijo superior
    // ==========================================================================
    
    indiceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Detiene el salto estándar del navegador
            
            // Extrae el ID quitando el '#' (ej: #tema1 -> tema1)
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = 120; // Altura del navbar que tapa contenido
                // Calcula posición final: Posición de la sección - Altura del header
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                // Ejecuta el desplazamiento suave
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ==========================================================================
    // 3. BOTONES DE COMPARTIR (Redes Sociales)
    // Abre ventanas emergentes o clientes de correo
    // ==========================================================================
    
    const compartirBotones = document.querySelectorAll('.btn-compartir');
    
    compartirBotones.forEach((boton, index) => {
        boton.addEventListener('click', function() {
            // Obtiene la URL actual y el título del artículo dinámicamente
            const url = window.location.href;
            const titulo = document.querySelector('.articulo-hero-title').textContent;
            
            // Lógica según el orden de los botones (índice 0, 1, 2)
            
            // Facebook (índice 0)
            if (index === 0) {
                window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
                    '_blank', // Abre en pestaña nueva
                    'width=600,height=400' // Dimensiones de la ventana popup
                );
            }
            // Twitter / X (índice 1)
            else if (index === 1) {
                window.open(
                    `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(titulo)}`,
                    '_blank',
                    'width=600,height=400'
                );
            }
            // Email (índice 2)
            else if (index === 2) {
                // Abre el cliente de correo predeterminado del usuario
                window.location.href = `mailto:?subject=${encodeURIComponent(titulo)}&body=${encodeURIComponent(url)}`;
            }
        });
    });
    
    // ==========================================================================
    // 4. ANIMACIÓN DE SCROLL (Fade Up)
    // Elementos aparecen suavemente desde abajo al scrollear
    // ==========================================================================
    
    // Lista masiva de selectores para animar todo tipo de contenido
    const elementosAnimados = document.querySelectorAll(
        '.articulo-resumen, .contenido-seccion, .articulo-figura, ' +
        '.imagenes-grid, .cita-destacada, .lista-destacada, ' +
        '.nota-informativa, .estadisticas, .articulo-referencias, ' +
        '.autor-bio, .articulos-relacionados'
    );
    
    const animarOptions = {
        threshold: 0.15, // Inicia cuando el 15% del elemento es visible
        rootMargin: '0px 0px -50px 0px' // Obliga a bajar 50px extra antes de aparecer
    };
    
    const animarCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Estado Inicial (vía JS para asegurar control)
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)'; // Abajo
                
                // Pequeño delay para suavidad
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.6s ease'; // Velocidad animación
                    entry.target.style.opacity = '1'; // Visible
                    entry.target.style.transform = 'translateY(0)'; // Posición original
                }, 100);
                
                // Deja de observar para que no se repita al subir y bajar
                animarObserver.unobserve(entry.target);
            }
        });
    };
    
    const animarObserver = new IntersectionObserver(animarCallback, animarOptions);
    
    elementosAnimados.forEach(elemento => {
        animarObserver.observe(elemento);
    });
    
    // ==========================================================================
    // 5. INDICADOR DE PROGRESO DE LECTURA
    // Barra superior que se llena de 0% a 100%
    // ==========================================================================
    
    // Creación dinámica del elemento HTML de la barra
    const progressBar = document.createElement('div');
    progressBar.style.position = 'fixed';
    progressBar.style.top = '85px'; // Debajo del header
    progressBar.style.left = '0';
    progressBar.style.width = '0%'; // Inicia vacía
    progressBar.style.height = '3px';
    progressBar.style.backgroundColor = '#000000';
    progressBar.style.zIndex = '9999'; // Sobre todo el contenido
    progressBar.style.transition = 'width 0.1s ease';
    document.body.appendChild(progressBar);
    
    // Evento de cálculo constante al scrollear
    window.addEventListener('scroll', function() {
        const articulo = document.querySelector('.articulo-contenido');
        if (!articulo) return; // Seguridad si no hay artículo
        
        // Variables para el cálculo matemático
        const articuloTop = articulo.offsetTop; // Dónde empieza el texto
        const articuloHeight = articulo.offsetHeight; // Altura total del texto
        const windowHeight = window.innerHeight; // Altura de la pantalla del usuario
        const scrolled = window.pageYOffset; // Cuánto ha bajado
        
        // FÓRMULA DE PORCENTAJE RELATIVO:
        // Calcula cuánto se ha leído solo dentro del contenedor del artículo
        // Math.max(..., 0) asegura que no sea negativo
        // Math.min(..., 100) asegura que no pase del 100%
        const progress = Math.min(
            Math.max(
                ((scrolled - articuloTop + windowHeight) / articuloHeight) * 100,
                0
            ),
            100
        );
        
        progressBar.style.width = progress + '%';
    });
    
    // ==========================================================================
    // 6. ACCESIBILIDAD (A11Y)
    // Permite navegar el índice usando teclado (Enter/Espacio)
    // ==========================================================================
    
    indiceLinks.forEach(link => {
        link.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click(); // Simula el click del mouse
            }
        });
    });
    
    // ==========================================================================
    // 7. EFECTO PARALLAX SUAVE (Optimizado)
    // Mueve el fondo a diferente velocidad
    // ==========================================================================
    
    // Condición Doble: No tener pantalla táctil (PC) Y tener ancho mayor a 768px (Desktop)
    if (!('ontouchstart' in window) && window.innerWidth > 768) {
        const heroBackground = document.querySelector('.articulo-hero-background img');
        
        if (heroBackground) {
            window.addEventListener('scroll', function() {
                const scrollPosition = window.pageYOffset;
                const hero = document.querySelector('.articulo-hero');
                
                // Solo calcula si el hero está visible
                if (hero && scrollPosition < hero.offsetHeight) {
                    // Factor 0.5: Se mueve a la mitad de la velocidad del scroll
                    heroBackground.style.transform = `translateY(${scrollPosition * 0.5}px)`;
                }
            });
        }
    }
    
    // ==========================================================================
    // 8. COPIAR ENLACE AL PORTAPAPELES
    // Botón funcional que no requiere Flash ni librerías externas
    // ==========================================================================
    
    const compartirDiv = document.querySelector('.sidebar-compartir .compartir-botones');
    
    if (compartirDiv) {
        // Crea el botón dinámicamente
        const btnCopiar = document.createElement('button');
        btnCopiar.className = 'btn-compartir';
        btnCopiar.setAttribute('aria-label', 'Copiar enlace');
        // Icono SVG de "link"
        btnCopiar.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
        `;
        
        btnCopiar.addEventListener('click', function() {
            const url = window.location.href;
            
            // API Moderna del Portapapeles (Promise based)
            navigator.clipboard.writeText(url).then(() => {
                // ÉXITO: Cambia el icono a un "Check" y el color a verde
                const originalHTML = this.innerHTML;
                this.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                `;
                this.style.backgroundColor = '#4CAF50'; // Verde
                this.style.borderColor = '#4CAF50';
                this.style.color = '#ffffff';
                
                // Restaura el botón original después de 2 segundos
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.style.backgroundColor = '';
                    this.style.borderColor = '';
                    this.style.color = '';
                }, 2000);
            }).catch(err => {
                console.error('Error al copiar:', err);
            });
        });
        
        compartirDiv.appendChild(btnCopiar);
    }
    
    // ==========================================================================
    // 9. CÁLCULO DE TIEMPO DE LECTURA
    // Estima minutos basado en conteo de palabras
    // ==========================================================================
    
    function calcularTiempoLectura() {
        const contenido = document.querySelector('.articulo-main');
        if (!contenido) return;
        
        const texto = contenido.innerText; // Obtiene solo texto visible (sin HTML)
        const palabras = texto.trim().split(/\s+/).length; // Cuenta palabras separando por espacios
        const palabrasPorMinuto = 200; // Velocidad promedio de lectura humana
        const minutos = Math.ceil(palabras / palabrasPorMinuto); // Redondea hacia arriba
        
        // Busca dónde insertar el dato en el HTML
        const metaItems = document.querySelectorAll('.meta-item');
        metaItems.forEach(item => {
            if (item.textContent.includes('min de lectura')) {
                const span = item.querySelector('span');
                if (span) {
                    span.textContent = `${minutos} min de lectura`;
                }
            }
        });
    }
    
    calcularTiempoLectura(); // Ejecuta la función
    
    // ==========================================================================
    // 10. TABLA DE CONTENIDOS MÓVIL (Float Button)
    // Crea un botón flotante solo para celulares
    // ==========================================================================
    
    if (window.innerWidth <= 768) { // Detección de ancho de pantalla móvil
        const sidebar = document.querySelector('.articulo-sidebar');
        
        if (sidebar) {
            // Crea el botón
            const btnIndice = document.createElement('button');
            btnIndice.className = 'btn-indice-movil';
            btnIndice.innerHTML = '📑 Índice';
            // Estilos CSS inyectados para posición fija (bottom-right)
            btnIndice.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 15px 25px;
                background-color: #000000;
                color: #ffffff;
                border: none;
                border-radius: 50px;
                font-weight: 600;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                z-index: 1000;
                cursor: pointer;
                transition: all 0.3s ease;
            `;
            
            // Toggle (Abrir/Cerrar) el sidebar al hacer click
            btnIndice.addEventListener('click', function() {
                sidebar.classList.toggle('visible-movil');
                
                if (sidebar.classList.contains('visible-movil')) {
                    // Estilos para transformar el sidebar en un menú flotante
                    sidebar.style.cssText = `
                        position: fixed;
                        bottom: 80px;
                        right: 20px;
                        background: #ffffff;
                        padding: 20px;
                        border-radius: 12px;
                        box-shadow: 0 8px 30px rgba(0,0,0,0.2);
                        z-index: 999;
                        max-width: 300px;
                    `;
                } else {
                    sidebar.style.cssText = ''; // Limpia estilos inline
                }
            });
            
            document.body.appendChild(btnIndice);
            
            // UX: Cierra el menú automáticamente si el usuario hace click en un enlace
            indiceLinks.forEach(link => {
                link.addEventListener('click', function() {
                    sidebar.classList.remove('visible-movil');
                    sidebar.style.cssText = '';
                });
            });
        }
    }
    
    // ==========================================================================
    // 11. OPTIMIZACIÓN DE IMPRESIÓN (Ctrl + P)
    // Limpia la página para ahorrar tinta y papel
    // ==========================================================================
    
    // Antes de imprimir: Oculta menús y elementos irrelevantes
    window.addEventListener('beforeprint', function() {
        const sidebar = document.querySelector('.articulo-sidebar');
        const relacionados = document.querySelector('.articulos-relacionados');
        
        if (sidebar) sidebar.style.display = 'none';
        if (relacionados) relacionados.style.display = 'none';
    });
    
    // Después de imprimir: Vuelve a mostrar todo
    window.addEventListener('afterprint', function() {
        const sidebar = document.querySelector('.articulo-sidebar');
        const relacionados = document.querySelector('.articulos-relacionados');
        
        if (sidebar) sidebar.style.display = '';
        if (relacionados) relacionados.style.display = '';
    });
    
    console.log('Artículo: Todos los scripts cargados correctamente');
});