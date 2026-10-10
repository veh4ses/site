
/* =========================================
   VEH4SES — Interactive Website
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const navbar = document.querySelector(".navbar");
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  body.classList.add("js-ready");

  /* -----------------------------------------
     1. Mobile navigation
     ----------------------------------------- */

  function closeMenu() {
    if (!menuToggle || !navMenu) return;

    menuToggle.classList.remove("active");
    navMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  if (menuToggle && navMenu) {
    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");

      menuToggle.classList.toggle("active", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (
        navMenu.classList.contains("open") &&
        !navMenu.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });
  }

  /* -----------------------------------------
     2. Navbar scroll effect
     ----------------------------------------- */

  function updateNavbar() {
    if (!navbar) return;

    navbar.classList.toggle("scrolled", window.scrollY > 30);
  }

  updateNavbar();
  window.addEventListener("scroll", updateNavbar, { passive: true });

  /* -----------------------------------------
     3. Smooth scrolling for internal links
     ----------------------------------------- */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();
      closeMenu();

      target.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  });

  /* -----------------------------------------
     4. Scroll reveal animations
     ----------------------------------------- */

  const revealSelectors = [
    ".intro-content",
    ".section-heading",
    ".service-card",
    ".work-card",
    ".approach-content",
    ".approach-point",
    ".process-card",
    ".about-visual",
    ".about-content",
    ".faq-item",
    ".contact-content",
    ".footer-main",
  ];

  const revealElements = document.querySelectorAll(
    revealSelectors.join(", ")
  );

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("reveal", "visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px",
      }
    );

    revealElements.forEach((element, index) => {
      element.classList.add("reveal");
      element.style.setProperty(
        "--reveal-delay",
        `${(index % 4) * 80}ms`
      );

      revealObserver.observe(element);
    });
  }

  /* -----------------------------------------
     5. Active navigation link
     ----------------------------------------- */

  const navLinks = [
    ...document.querySelectorAll(
      '.nav-menu a[href^="#"]'
    ),
  ];

  const sections = navLinks
    .map((link) => {
      const id = link.getAttribute("href");
      return id ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navLinks.forEach((link) => {
            const isActive =
              link.getAttribute("href") === `#${entry.target.id}`;

            link.classList.toggle("active", isActive);

            if (isActive) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* -----------------------------------------
     6. Hero 3D movement
     ----------------------------------------- */

  const heroVisual = document.querySelector(".hero-visual");

  const canUsePointerEffect =
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !reducedMotion;

  if (heroVisual && canUsePointerEffect) {
    heroVisual.addEventListener("pointermove", (event) => {
      const rect = heroVisual.getBoundingClientRect();

      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      const rotateY = (x - 0.5) * 8;
      const rotateX = (0.5 - y) * 8;

      heroVisual.style.setProperty("--pointer-x", `${x * 100}%`);
      heroVisual.style.setProperty("--pointer-y", `${y * 100}%`);
      heroVisual.style.setProperty("--rotate-x", `${rotateX}deg`);
      heroVisual.style.setProperty("--rotate-y", `${rotateY}deg`);
    });

    heroVisual.addEventListener("pointerleave", () => {
      heroVisual.style.setProperty("--pointer-x", "50%");
      heroVisual.style.setProperty("--pointer-y", "50%");
      heroVisual.style.setProperty("--rotate-x", "0deg");
      heroVisual.style.setProperty("--rotate-y", "0deg");
    });
  }

  /* -----------------------------------------
     7. Interactive work previews
     ----------------------------------------- */

  document.querySelectorAll(".work-card").forEach((card) => {
    if (!canUsePointerEffect) return;

    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();

      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      card.style.setProperty("--mouse-x", `${x * 100}%`);
      card.style.setProperty("--mouse-y", `${y * 100}%`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--mouse-x", "50%");
      card.style.setProperty("--mouse-y", "50%");
    });
  });

  /* -----------------------------------------
     8. FAQ accordion
     ----------------------------------------- */

  document.querySelectorAll(".faq-item").forEach((item) => {
    const question = item.querySelector(
      "button, summary, .faq-question"
    );

    if (!question) return;

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      document.querySelectorAll(".faq-item.open").forEach((openItem) => {
        if (openItem === item) return;

        openItem.classList.remove("open");

        const openQuestion = openItem.querySelector(
          "button, .faq-question"
        );

        if (openQuestion) {
          openQuestion.setAttribute("aria-expanded", "false");
        }
      });

      item.classList.toggle("open", !isOpen);

      if (question.tagName === "BUTTON") {
        question.setAttribute("aria-expanded", String(!isOpen));
      }
    });
  });

  /* -----------------------------------------
     9. Automatic footer year
     ----------------------------------------- */

  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  /* -----------------------------------------
     10. Back to top
     ----------------------------------------- */

  document.querySelectorAll(".back-to-top").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    });
  });

});
