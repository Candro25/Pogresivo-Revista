document.addEventListener('DOMContentLoaded', function() { // Espera a que la estructura HTML esté cargada antes de ejecutar scripts

    // ==========================================================================
    // PRELOADER
    // ==========================================================================
    
    // Usamos 'window.onload' para asegurarnos que cargaron todas las imágenes y recursos externos
    window.addEventListener('load', function() {
        const preloader = document.getElementById('preloader'); // Busca el elemento con ID 'preloader'
        if (preloader) { // Verifica si el preloader existe para evitar errores
            // Pequeño retardo para que se aprecie la animación (500ms = medio segundo)
            setTimeout(() => {
                preloader.classList.add('preloader-hidden'); // Añade la clase CSS que desvanece/oculta el preloader
            }, 500); // Ejecuta la función después de 500 milisegundos
        }
    });

    // ==========================================================================
    // 1. SISTEMA DE FILTRADO DE REVISTAS (Tu código original)
    // ==========================================================================
    const filtroAno = document.getElementById('filtro-ano'); // Referencia al select del filtro por Año
    const filtroISSN = document.getElementById('filtro-ISSN'); // Referencia al select del filtro por ISSN
    const btnResetFiltros = document.getElementById('btnResetFiltros'); // Referencia al botón de limpiar filtros
    const noResultados = document.getElementById('noResultados'); // Referencia al mensaje de "No hay resultados"
    const todasLasRevistas = Array.from(document.querySelectorAll('.revista-card')); // Crea un array con todas las tarjetas de revistas

    function obtenerISSN(revista) { // Función auxiliar para extraer el ISSN de una tarjeta
        if (!revista) return ''; // Si no hay elemento revista, devuelve vacío
        if (revista.dataset.issn) return revista.dataset.issn.trim(); // Intenta leerlo desde el atributo data-issn
        const info = revista.querySelector('.revista-info'); // Si no, busca en el contenedor de información
        if (!info) return ''; // Si no hay info, devuelve vacío
        const match = info.textContent.match(/ISSN[:\s]*([0-9\-]+)/i); // Usa una expresión regular para buscar el patrón ISSN
        return match ? match[1].trim() : ''; // Si lo encuentra lo devuelve limpio, si no, vacío
    }

    function filtrarRevistas() { // Función principal que aplica la lógica de filtrado
        const anoSeleccionado = filtroAno ? filtroAno.value : 'todos'; // Obtiene valor del año o 'todos' por defecto
        const issnSeleccionado = filtroISSN ? filtroISSN.value : 'todos'; // Obtiene valor del ISSN o 'todos' por defecto
        let revistasMostradas = 0; // Contador para saber cuántas revistas quedaron visibles

        todasLasRevistas.forEach(revista => { // Recorre cada tarjeta de revista
            const anoRevista = revista.getAttribute('data-ano') || ''; // Obtiene el año de la revista actual
            const issnRevista = obtenerISSN(revista) || ''; // Obtiene el ISSN de la revista actual
            
            // Comprueba si coincide el año (o si está en 'todos')
            const cumpleAno = (anoSeleccionado === 'todos') || (anoRevista === anoSeleccionado);
            // Comprueba si coincide el ISSN (o si está en 'todos')
            const cumpleISSN = (issnSeleccionado === 'todos') || (issnRevista === issnSeleccionado);

            if (cumpleAno && cumpleISSN) { // Si cumple AMBAS condiciones
                revista.style.display = 'flex'; // Muestra la revista
                revistasMostradas++; // Aumenta el contador
            } else { // Si falla alguna condición
                revista.style.display = 'none'; // Oculta la revista
            }
        });

        if (noResultados) { // Controla el mensaje de error visual
            // Si el contador es 0 muestra el mensaje, si no, lo oculta
            noResultados.style.display = (revistasMostradas === 0) ? 'block' : 'none';
        }
    }

    // Agrega los "escuchadores" de eventos para ejecutar el filtro cuando cambian los selects
    if (filtroAno) filtroAno.addEventListener('change', filtrarRevistas);
    if (filtroISSN) filtroISSN.addEventListener('change', filtrarRevistas);
    
    if (btnResetFiltros) { // Configura el botón de reset
        btnResetFiltros.addEventListener('click', function() {
            if (filtroAno) filtroAno.value = 'todos'; // Reinicia el select de año
            if (filtroISSN) filtroISSN.value = 'todos'; // Reinicia el select de ISSN
            filtrarRevistas(); // Ejecuta el filtro para mostrar todo de nuevo
        });
    }

    // ==========================================================================
    // 2. LÓGICA DE REVISTAS (ESTRICTAMENTE SEPARADA)
    // ==========================================================================

    // A) LEER REVISTA (Solo abre modal si el botón está dentro de .revista-card)
    // Usamos selectores muy específicos para no afectar al Archivo
    const botonesLeerRevista = document.querySelectorAll('.revista-card .btn-leer'); // Selecciona botones "Leer" solo dentro de tarjetas
    
    botonesLeerRevista.forEach(boton => { // Recorre cada botón encontrado
        boton.addEventListener('click', function(e) { // Al hacer click...
            e.preventDefault(); // Evita navegar (comportamiento por defecto del link)

            const tarjeta = this.closest('.revista-card'); // Encuentra la tarjeta padre del botón clickeado
            const rutaPDF = tarjeta.dataset.pdf || this.getAttribute('href'); // Busca la URL del PDF en data-pdf o en href

            if (!rutaPDF || rutaPDF === '#') { // Validación de seguridad por si no hay PDF
                alert("No se encontró el archivo PDF."); // Muestra alerta al usuario
                return; // Detiene la ejecución
            }

            const visor = document.getElementById('visorPDF'); // Referencia al iframe/visor del modal
            const modal = document.getElementById('pdfModal'); // Referencia al contenedor del modal
            
            if(visor && modal) { // Si existen los elementos del modal
                visor.src = rutaPDF; // Carga la ruta del PDF en el iframe
                modal.style.display = "block"; // Hace visible el modal
            }
        });
    });

    // B) DESCARGAR REVISTA (Fuerza la descarga sin abrir pestaña)
    const botonesDescargarRevista = document.querySelectorAll('.revista-card .btn-descargar'); // Selecciona botones de descarga

    botonesDescargarRevista.forEach(boton => { // Recorre cada botón
        boton.addEventListener('click', function(e) { // Al hacer click...
            e.preventDefault(); // IMPORTANTE: Evita que el navegador abra el PDF en una pestaña nueva

            const tarjeta = this.closest('.revista-card'); // Encuentra la tarjeta padre
            const rutaPDF = tarjeta.dataset.pdf || this.getAttribute('href'); // Obtiene la URL del PDF

            if (!rutaPDF || rutaPDF === '#') { // Si no hay ruta válida, no hace nada
                return;
            }

            // Truco técnico para forzar descarga
            const linkTemporal = document.createElement('a'); // Crea un elemento <a> en memoria (invisible)
            linkTemporal.href = rutaPDF; // Le asigna el PDF
            linkTemporal.setAttribute('download', ''); // Atributo HTML5 que fuerza la descarga
            linkTemporal.download = rutaPDF.split('/').pop(); // Intenta ponerle nombre al archivo basado en la URL
            linkTemporal.style.display = 'none'; // Asegura que sea invisible
            
            document.body.appendChild(linkTemporal); // Lo añade al documento temporalmente
            linkTemporal.click(); // Simula un click automático en el enlace
            document.body.removeChild(linkTemporal); // Lo elimina del documento inmediatamente
        });
    });

    // C) CERRAR MODAL
    const btnCerrarModal = document.getElementById('cerrarModal'); // Botón "X" o cerrar
    const pdfModal = document.getElementById('pdfModal'); // Contenedor del modal
    const visorPDF = document.getElementById('visorPDF'); // El iframe del PDF

    if (btnCerrarModal && pdfModal) { // Si existen los elementos de cierre
        btnCerrarModal.addEventListener('click', () => { // Al hacer click en cerrar
            pdfModal.style.display = "none"; // Oculta el modal
            if(visorPDF) visorPDF.src = ""; // Limpiar memoria (vacía el iframe para que deje de cargar)
        });

        pdfModal.addEventListener('click', (e) => { // Al hacer click fuera del contenido (en el fondo oscuro)
            if (e.target === pdfModal) { // Verifica si el click fue en el fondo y no en el PDF
                pdfModal.style.display = "none"; // Oculta el modal
                if(visorPDF) visorPDF.src = ""; // Limpiar memoria
            }
        });
    }

    // ==========================================================================
    // 3. FUNCIONALIDADES GENERALES (Footer, Año, etc.)
    // ==========================================================================
    
    // Año dinámico
    const copyrightYear = document.querySelector('.footer-copyright'); // Busca el elemento del copyright
    if (copyrightYear) { // Si existe
        const currentYear = new Date().getFullYear(); // Obtiene el año actual del sistema
        if(!copyrightYear.innerHTML.includes(currentYear)) { // Si el año no está ya escrito
             copyrightYear.innerHTML = copyrightYear.innerHTML.replace(/\d{4}/, currentYear); // Reemplaza cualquier 4 dígitos por el año actual
        }
    }

    // Smooth Scroll SOLO para links que empiezan con # (anclas)
    // Esto evita romper los enlaces a otras páginas html

});

//NUEVO RESPONSIVE PARA (Menú hamburguesa móvil)

// Selecciona el botón del menú y añade evento click
document.querySelector('.menu-toggle').addEventListener('click', function() {
        // Alterna la clase 'active' en la navegación principal para mostrar/ocultar menú
        document.querySelector('.main-navigation').classList.toggle('active');
    });