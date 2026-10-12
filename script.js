
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const navbar = document.querySelector(".navbar");
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-menu a");
  const backToTop = document.querySelector(".back-to-top");

  // Mobile navigation
  if (menuToggle && navMenu) {
    menuToggle.setAttribute("aria-expanded", "false");

    const closeMenu = () => {
      navMenu.classList.remove("open");
      menuToggle.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
      body.classList.remove("menu-open");
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");

      menuToggle.classList.toggle("active", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      body.classList.toggle("menu-open", isOpen);
    });

    navLinks.forEach((link) => {
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

  // Navbar scroll state and back-to-top visibility
  const handleScroll = () => {
    const scrollY = window.scrollY;

    if (navbar) {
      navbar.classList.toggle("scrolled", scrollY > 30);
    }

    if (backToTop) {
      backToTop.classList.toggle("visible", scrollY > 400);
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // Smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();

      const navbarHeight = navbar
        ? navbar.getBoundingClientRect().height
        : 0;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        navbarHeight -
        16;

      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    });
  });

  // Reveal elements when they enter the viewport
  const revealSelectors = [
    ".intro",
    ".intro-content",
    ".section-heading",
    ".service-card",
    ".tech-card",
    ".process-step",
    ".about-visual",
    ".about-content",
    ".faq-item",
    ".contact-inner",
    ".contact-note",
  ];

  const revealElements = document.querySelectorAll(
    revealSelectors.join(", ")
  );

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible", "tech-visible");
    });
  } else {
    revealElements.forEach((element, index) => {
      element.classList.add("reveal");
      element.style.setProperty(
        "--reveal-delay",
        `${Math.min(index % 4, 3) * 80}ms`
      );
    });

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible", "tech-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  // Active navigation link based on the visible section
  const sections = document.querySelectorAll(
    "#home, #services, #technologies, #about, #contact"
  );

  if ("IntersectionObserver" in window && sections.length > 0) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const sectionId = entry.target.id;

          navLinks.forEach((link) => {
            const isActive =
              link.getAttribute("href") === `#${sectionId}`;

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
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // Subtle hero visual movement on desktop
  const heroVisual = document.querySelector(".hero-visual");
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  if (heroVisual && finePointer && !reduceMotion) {
    heroVisual.addEventListener("pointermove", (event) => {
      const rect = heroVisual.getBoundingClientRect();

      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      heroVisual.style.setProperty("--pointer-x", `${x * 10}px`);
      heroVisual.style.setProperty("--pointer-y", `${y * 10}px`);
    });

    heroVisual.addEventListener("pointerleave", () => {
      heroVisual.style.setProperty("--pointer-x", "0px");
      heroVisual.style.setProperty("--pointer-y", "0px");
    });
  }

  // Technology cards: small staggered entrance
  const techCards = document.querySelectorAll(".tech-card");

  techCards.forEach((card, index) => {
    card.style.setProperty("--tech-delay", `${index * 100}ms`);
  });

  // FAQ accordion: keep only one answer open at a time
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    if (item.tagName.toLowerCase() === "details") {
      item.addEventListener("toggle", () => {
        if (!item.open) return;

        faqItems.forEach((otherItem) => {
          if (
            otherItem !== item &&
            otherItem.tagName.toLowerCase() === "details"
          ) {
            otherItem.open = false;
          }
        });
      });
    }
  });

  // Automatically update the footer year
  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  // Back-to-top button
  if (backToTop) {
    backToTop.addEventListener("click", (event) => {
      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });
  }

  // Update the current year even if the page loads at a different scroll position
  handleScroll();
});
