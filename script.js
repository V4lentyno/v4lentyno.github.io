// Initialize Lenis for smooth vertical scrolling
const lenis = new Lenis({
    autoRaf: true,
    smoothWheel: true,
    lerp: 0.1, // Responsiveness
});

// Update ScrollTrigger on lenis scroll
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// GSAP Animations setup
document.addEventListener("DOMContentLoaded", () => {

    // 1. Initial Hero Animations
    const tl = gsap.timeline();

    // Fade and slide in text elements
    tl.fromTo(".hero-title",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 }
    )
        .fromTo(".hero-desc",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
            "-=0.6"
        )
        .fromTo(".cta-button",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
            "-=0.4"
        )
        // Scale and fade the image placeholder
        .fromTo(".image-placeholder",
            { scale: 0.9, opacity: 0, filter: "blur(10px)" },
            { scale: 1, opacity: 1, filter: "blur(0px)", duration: 1.2, ease: "power3.out" },
            "-=1"
        );

    // Fade in Nav items
    gsap.fromTo("header",
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
    );

    // 2. Horizontal Scroll Section
    const gallerySection = document.querySelector('.gallery-section');
    const galleryTrack = document.querySelector('.gallery-track');

    // Calculate how far to translate the track
    function getScrollAmount() {
        let trackWidth = galleryTrack.scrollWidth;
        // Subtract window width minus some padding to get the actual scrollable distance
        return -(trackWidth - window.innerWidth + 180);
    }

    const tween = gsap.to(galleryTrack, {
        x: getScrollAmount,
        ease: "none"
    });

    ScrollTrigger.create({
        trigger: gallerySection,
        start: "top top",
        end: () => `+=${getScrollAmount() * -1}`, // scroll distance proportional to the movement distance
        pin: true,
        animation: tween,
        scrub: 1, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
        invalidateOnRefresh: true, // Recalculates on resize
    });

    // 3. Subtle parallax on footer
    gsap.fromTo(".footer-content",
        { y: 50, opacity: 0 },
        {
            y: 0, opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: "footer",
                start: "top 80%",
                end: "top 20%",
                scrub: 1
            }
        }
    );

    // Removed createSnakingArrow calls

    // 5. Reactive Gradient Background
    const gradientBg = document.querySelector('.gradient-bg');
    if (gradientBg) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            gradientBg.style.setProperty('--mouse-x', `${x}%`);
            gradientBg.style.setProperty('--mouse-y', `${y}%`);
        });
    }

    // 6. Magnify Text Effect (Lupa)
    const magnifyText = document.querySelector('.magnify-text');
    if (magnifyText) {
        const textStr = magnifyText.textContent;
        magnifyText.textContent = '';
        
        [...textStr].forEach(char => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char; 
            magnifyText.appendChild(span);
        });

        const charSpans = magnifyText.querySelectorAll('span');
        
        window.addEventListener('mousemove', (e) => {
            const mX = e.clientX;
            const mY = e.clientY;

            charSpans.forEach(sp => {
                const r = sp.getBoundingClientRect();
                const cX = r.left + r.width / 2;
                const cY = r.top + r.height / 2;
                const d = Math.sqrt(Math.pow(mX - cX, 2) + Math.pow(mY - cY, 2));
                const maxD = 180; 
                
                if (d < maxD) {
                    const s = 1 + Math.pow((maxD - d) / maxD, 2) * 3.5; // Zoom Extremo
                    const ty = -Math.pow((maxD - d) / maxD, 2) * 25;
                    sp.style.transform = `scale(${s}) translateY(${ty}px)`;
                    sp.style.color = "var(--accent)";
                    sp.style.textShadow = `0 0 ${20 * (maxD-d)/maxD}px var(--accent)`;
                } else {
                    sp.style.transform = `scale(1) translateY(0px)`;
                    sp.style.color = "";
                    sp.style.textShadow = "";
                }
            });
        });
    }

    // 7. Dynamic Video Controls (Multiple Videos)
    const videoContainers = document.querySelectorAll('.video-container');

    videoContainers.forEach(container => {
        const video = container.querySelector('video');
        const btn = container.querySelector('.video-control');
        
        if (video && btn) {
            const playIcon = btn.querySelector('.play-icon');
            const pauseIcon = btn.querySelector('.pause-icon');

            container.addEventListener('click', () => {
                if (video.paused) {
                    video.play();
                    container.classList.add('playing');
                    if(playIcon) playIcon.style.display = 'none';
                    if(pauseIcon) pauseIcon.style.display = 'block';
                } else {
                    video.pause();
                    container.classList.remove('playing');
                    if(playIcon) playIcon.style.display = 'block';
                    if(pauseIcon) pauseIcon.style.display = 'none';
                }
            });
            container.style.cursor = 'pointer'; // Ensure whole container shows pointer
        }
    });

    // 8. Skills Graph Animation
    const skillBars = document.querySelectorAll('.skill-bar');
    
    skillBars.forEach((bar, index) => {
        const heightVal = bar.getAttribute('data-height');
        const parentContainer = bar.closest('.skill-bar-container');
        const iconPlace = parentContainer.querySelector('.skill-icon-placeholder');
        const skillName = parentContainer.querySelector('.skill-name');
        
        // Initial state for icon and name
        gsap.set([iconPlace, skillName], { opacity: 0, y: 20 });
        
        gsap.to(bar, {
            scrollTrigger: {
                trigger: ".skills-section",
                start: "top 75%",
            },
            height: heightVal,
            duration: 1.5,
            ease: "power3.out",
            delay: index * 0.1
        });

        gsap.to([iconPlace, skillName], {
            scrollTrigger: {
                trigger: ".skills-section",
                start: "top 75%",
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
            delay: index * 0.1 + 0.3
        });
    });

    // 9. Lightbox Portadas
    const coverCards = document.querySelectorAll('.cover-card img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    
    let currentImageIndex = 0;
    const coverSources = Array.from(coverCards).map(img => img.src);

    function updateLightboxImage() {
        lightboxImg.src = coverSources[currentImageIndex];
    }

    coverCards.forEach((img, index) => {
        img.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevenir que se cierre inmediatamente
            currentImageIndex = index;
            updateLightboxImage();
            lightbox.classList.add('active');
            lenis.stop(); // Deshabilitar scroll al abrir
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        lenis.start(); // Rehabilitar scroll
    }

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            // Cerrar al clickear en el fondo oscuro
            if(e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentImageIndex = (currentImageIndex > 0) ? currentImageIndex - 1 : coverSources.length - 1;
            updateLightboxImage();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentImageIndex = (currentImageIndex < coverSources.length - 1) ? currentImageIndex + 1 : 0;
            updateLightboxImage();
        });
    }

    // Soporte teclado para Lightbox
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            currentImageIndex = (currentImageIndex < coverSources.length - 1) ? currentImageIndex + 1 : 0;
            updateLightboxImage();
        } else if (e.key === 'ArrowLeft') {
            currentImageIndex = (currentImageIndex > 0) ? currentImageIndex - 1 : coverSources.length - 1;
            updateLightboxImage();
        }
    });

    // 10. Mobile and Touch Animations (Replace Hovers)
    if (window.matchMedia("(hover: none)").matches) {
        // Auto fan-out on scroll for the deck
        gsap.to(".deck-container", {
            scrollTrigger: {
                trigger: ".covers-section",
                start: "top 60%", // Activate when scrolling past 60% of viewport
            },
            onStart: () => {
                document.querySelector(".deck-container").classList.add("mobile-fan");
            }
        });
        
        // Auto fade-in percentages inside the skills bars
        gsap.to(".skill-percentage", {
            scrollTrigger: {
                trigger: ".skills-section",
                start: "top 75%",
            },
            opacity: 1,
            duration: 1.5,
            delay: 1.2, // Show right as the columns finish rising
            stagger: 0.1
        });
    }

    // 11. Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('#main-nav a');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
            
            // Disable scroll when menu is open
            if (mainNav.classList.contains('active')) {
                lenis.stop();
            } else {
                lenis.start();
            }
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                lenis.start();
            });
        });
    }

});
