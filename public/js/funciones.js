// ==========================================
// --- 1. CONTROL DEL MENÚ DESPLEGABLE ---
// ==========================================

function alternarMenu(event) {
    event.stopPropagation(); // Evita que el clic se propague
    document.getElementById("miMenu").classList.toggle("mostrar");
}

window.addEventListener('click', function(event) {
    if (!event.target.matches('#btn-menu') && !event.target.closest('#miMenu')) {
        let menu = document.getElementById("miMenu");
        if (menu && menu.classList.contains('mostrar')) {
            menu.classList.remove('mostrar');
        }
    }
});


// ==========================================
// --- 2. CARRUSEL DE INICIO ---
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    
    const btnIzq = document.getElementById('btn-izq');
    const btnDer = document.getElementById('btn-der');
    
    if (btnIzq && btnDer) {
        const slides = document.querySelectorAll('.slide');
        let currentIndex = 0;
        const totalSlides = slides.length;
        let temporizador;
        const tiempoEspera = 7000;

        function actualizarCarrusel() {
            slides.forEach(slide => {
                slide.classList.remove('active', 'prev', 'next');
            });

            let prevIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            let nextIndex = (currentIndex + 1) % totalSlides;

            slides[currentIndex].classList.add('active');
            slides[prevIndex].classList.add('prev');
            slides[nextIndex].classList.add('next');
        }

        function iniciarTemporizador() {
            clearInterval(temporizador);
            temporizador = setInterval(() => {
                moverDerecha();
            }, tiempoEspera);
        }

        function moverDerecha() {
            currentIndex = (currentIndex + 1) % totalSlides;
            actualizarCarrusel();
            iniciarTemporizador();
        }

        function moverIzquierda() {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            actualizarCarrusel();
            iniciarTemporizador();
        }

        btnDer.addEventListener('click', moverDerecha);
        btnIzq.addEventListener('click', moverIzquierda);

        actualizarCarrusel();
        iniciarTemporizador();
    }
});