document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector('.film-strip-wrapper');
    
    // Variables de Estado
    let currentScroll = 0;
    let targetScroll = 0;
    let maxScroll = wrapper.scrollWidth - window.innerWidth;
    
    // Variables para Touch
    let isDragging = false;
    let startX = 0;
    let lastTouchX = 0;

    // Actualizar límites al redimensionar pantalla
    window.addEventListener('resize', () => {
        maxScroll = wrapper.scrollWidth - window.innerWidth;
        // Ajuste de seguridad por si nos quedamos fuera
        targetScroll = Math.min(targetScroll, maxScroll);
    });

    /* --- LÓGICA MOUSE WHEEL (ESCRITORIO) --- */
    window.addEventListener('wheel', (e) => {
        // Convertimos el scroll vertical (deltaY) en movimiento horizontal
        targetScroll += e.deltaY;
        
        // Clamp (Limitar valores entre 0 y el máximo)
        targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
    });

    /* --- LÓGICA TOUCH (MÓVIL) --- */
    window.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        lastTouchX = startX;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        const currentX = e.touches[0].clientX;
        const diff = lastTouchX - currentX; // Cuánto se movió el dedo
        
        // Multiplicador para sensibilidad (1.5 se siente natural)
        targetScroll += diff * 1.5;
        
        // Clamp
        targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
        
        lastTouchX = currentX;
    }, { passive: true });

    window.addEventListener('touchend', () => {
        isDragging = false;
    });

    /* --- ANIMACIÓN SUAVE (LOOP) --- */
    function animate() {
        // Interpolación Lineal (Lerp) para suavidad:
        // current se acerca a target un 8% cada frame
        currentScroll += (targetScroll - currentScroll) * 0.08;

        // Aplicar transformación
        // Usamos translate3d para aceleración por hardware
        wrapper.style.transform = `translate3d(-${currentScroll}px, 0, 0)`;

        requestAnimationFrame(animate);
    }

    animate();
});