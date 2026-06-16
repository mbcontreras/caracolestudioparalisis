// =========================================
// Catalizadora Digital — script.js
// =========================================

document.addEventListener("DOMContentLoaded", function () {
    // Iconos
    if (window.lucide) lucide.createIcons();

    // Funcionalidad
    const closeMenu = setupMobileMenu();
    setupSmoothScroll(closeMenu);
    setupScrollReveal();
    setupScrollEffects();
    setupHeroTypewriter();
});

// ========================================
// Menú móvil
// ========================================
function setupMobileMenu() {
    const navToggle = document.querySelector(".nav-toggle");
    const navMenu = document.querySelector(".nav-menu");
    if (!navToggle || !navMenu) return function () {};

    function open() {
        navMenu.classList.add("active");
        navToggle.classList.add("active");
        document.body.style.overflow = "hidden";
        navToggle.setAttribute("aria-expanded", "true");
        navMenu.setAttribute("aria-hidden", "false");
    }

    function close() {
        navMenu.classList.remove("active");
        navToggle.classList.remove("active");
        document.body.style.overflow = "";
        navToggle.setAttribute("aria-expanded", "false");
        navMenu.setAttribute("aria-hidden", "true");
    }

    // Estado inicial de accesibilidad
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menú de navegación");
    navMenu.setAttribute("aria-hidden", "true");

    // Abrir / cerrar
    navToggle.addEventListener("click", function (e) {
        e.preventDefault();
        navMenu.classList.contains("active") ? close() : open();
    });

    // Cerrar al pulsar un enlace (en móvil)
    navMenu.querySelectorAll(".nav-link").forEach(function (link) {
        link.addEventListener("click", function () {
            if (window.innerWidth <= 768) close();
        });
    });

    // Cerrar con Escape
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && navMenu.classList.contains("active")) close();
    });

    // Cerrar al pulsar fuera
    document.addEventListener("click", function (e) {
        if (
            navMenu.classList.contains("active") &&
            !navToggle.contains(e.target) &&
            !navMenu.contains(e.target)
        ) {
            close();
        }
    });

    // Cerrar al volver a escritorio
    window.addEventListener("resize", function () {
        if (window.innerWidth > 768) close();
    });

    return close;
}

// ========================================
// Navegación suave con offset del header
// ========================================
function setupSmoothScroll(closeMenu) {
    const header = document.querySelector(".header");
    const navMenu = document.querySelector(".nav-menu");

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (targetId === "#") return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            const headerHeight = header ? header.offsetHeight : 80;
            const top = target.offsetTop - headerHeight - 20;
            window.scrollTo({ top: top, behavior: "smooth" });

            if (navMenu && navMenu.classList.contains("active")) closeMenu();
        });
    });
}

// ========================================
// Aparición al hacer scroll
// ========================================
function setupScrollReveal() {
    const elements = document.querySelectorAll(
        ".validacion-item, .servicio-card, .diferenciador-column, .cta-option, .section-header, .validacion-statement, .reencuadre-content"
    );
    if (!elements.length) return;

    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    elements.forEach(function (el) {
        el.classList.add("reveal");
        observer.observe(el);
    });
}

// ========================================
// Efectos de scroll: header + link activo
// ========================================
function setupScrollEffects() {
    const header = document.querySelector(".header");
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", function () {
        const y = window.scrollY;

        // Fondo del header
        if (header) header.classList.toggle("scrolled", y > 100);

        // Link de navegación activo según la sección visible
        let current = "";
        sections.forEach(function (section) {
            if (y >= section.offsetTop - 200) current = section.id;
        });
        navLinks.forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("href") === "#" + current);
        });
    });
}

// ========================================
// Efecto de escritura del título del hero
// ========================================
function setupHeroTypewriter() {
    const heroTitle = document.querySelector(".hero-title");
    if (!heroTitle) return;

    const finalText = "Sabes lo que sabes hacer.\nSolo falta el cómo.";
    heroTitle.innerHTML = "";
    heroTitle.style.opacity = "1";

    let i = 0;
    (function type() {
        if (i >= finalText.length) return;

        const char = finalText.charAt(i);
        if (char === "\n") {
            heroTitle.insertAdjacentHTML("beforeend", "<br>");
        } else {
            heroTitle.append(char);
        }

        i++;
        const delay = /[\s,.]/.test(char) ? 90 : 55;
        setTimeout(type, delay);
    })();
}
