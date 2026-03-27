// Component Loader Utility
async function loadComponent(elementId, filePath) {
  const element = document.getElementById(elementId);
  if (!element) return; // Skip if element doesn't exist on this page

  try {
    const response = await fetch(filePath);
    if (response.ok) {
      const content = await response.text();
      element.innerHTML = content;
    } else {
      console.error(`Failed to load component: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error loading component: ${error}`);
  }
}

// Initialize all components
document.addEventListener("DOMContentLoaded", async () => {
  // Load all components in order
  await loadComponent("header-root", "components/header.html");
  await loadComponent("hero-root", "components/hero.html");
  await loadComponent("about-root", "components/about.html");
  initAboutCarousel();
  await loadComponent("services-root", "components/services.html");
  await loadComponent("execution-root", "components/execution.html");
  await loadComponent("scope-root", "components/scope.html");
  await loadComponent("workstations-root", "components/workstations.html");
  await loadComponent("chairs-root", "components/chairs.html");
  await loadComponent("softseating-root", "components/softseating.html");
  await loadComponent("factory-root", "components/factory.html");
  await loadComponent("accessories-root", "components/accessories.html");
  await loadComponent("imported-root", "components/imported.html");
  await loadComponent("clients-root", "components/clients.html");
  initClientCarousel();
  await loadComponent("whychoose-root", "components/whychoose.html");
  await loadComponent("it-root", "components/it.html");
  await loadComponent("contact-root", "components/contact.html");
  await loadComponent("footer-root", "components/footer.html");

  // --- Sticky Header Glass Effect ---
  window.addEventListener("scroll", () => {
    const nav = document.querySelector("nav.navbar");
    if (!nav) return;
    if (window.scrollY > 50) {
      nav.classList.add("glass-header");
    } else {
      nav.classList.remove("glass-header");
    }
  });

  // --- Smooth Scroll for Anchor Links & Mobile Navbar Close ---
  document.body.addEventListener("click", (e) => {
    // Close mobile navbar if a nav-link is clicked
    const navLink = e.target.closest(".nav-link");
    if (navLink) {
      const navbarCollapse = document.querySelector(".navbar-collapse");
      if (navbarCollapse && navbarCollapse.classList.contains("show")) {
        if (typeof bootstrap !== "undefined") {
          const bsCollapse =
            bootstrap.Collapse.getInstance(navbarCollapse) ||
            new bootstrap.Collapse(navbarCollapse, { toggle: false });
          bsCollapse.hide();
        } else {
          navbarCollapse.classList.remove("show");
        }
      }
    }

    const link = e.target.closest('a[href^="#"], a[href^="index.html#"]');
    if (!link) return;

    // Extract just the hash part for finding the target
    const href = link.getAttribute("href");
    const hashIdx = href.indexOf("#");
    if (hashIdx === -1) return;
    const hash = href.substring(hashIdx);

    const target = document.querySelector(hash);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  // --- Intersection Observer: Fade-in on scroll ---
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("leed-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  // Observe all major section headings & cards
  document
    .querySelectorAll("section, .scope-card, .execution-step")
    .forEach((el) => {
      el.classList.add("leed-fade");
      observer.observe(el);
    });
});

/**
 * About Section Carousel Logic
 */
function initAboutCarousel() {
  const section = document.querySelector(".about-carousel-section");
  if (!section) return;

  const wrapper = section.querySelector(".about-carousel-wrapper");
  const slides = section.querySelectorAll(".about-slide");
  const prevBtn = section.querySelector(".about-prev");
  const nextBtn = section.querySelector(".about-next");
  const indicators = section.querySelectorAll(".indicator");

  let currentIndex = 0;
  const slideCount = slides.length;
  let autoplayInterval;

  function updateCarousel() {
    // Move wrapper
    wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update active classes for transition effects
    slides.forEach((slide, index) => {
      slide.classList.toggle("active", index === currentIndex);
    });

    // Update indicators
    indicators.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slideCount;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slideCount) % slideCount;
    updateCarousel();
  }

  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(nextSlide, 6000);
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
    }
  }

  // Event Listeners
  nextBtn.addEventListener("click", () => {
    nextSlide();
    startAutoplay(); // Reset interval on manual click
  });

  prevBtn.addEventListener("click", () => {
    prevSlide();
    startAutoplay();
  });

  indicators.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      goToSlide(index);
      startAutoplay();
    });
  });

  // --- Touch Swipe Support for Mobile ---
  let touchStartX = 0;
  let touchEndX = 0;

  wrapper.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay(); // pause while interacting
    },
    { passive: true },
  );

  wrapper.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startAutoplay();
    },
    { passive: true },
  );

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swiped left -> next slide
      nextSlide();
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      // Swiped right -> prev slide
      prevSlide();
    }
  }

  // --- Auto-advance once when scrolled into view on Mobile ---
  let hasAutoSwiped = false;
  const carouselObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (
          entry.isIntersecting &&
          window.innerWidth <= 991 &&
          !hasAutoSwiped
        ) {
          hasAutoSwiped = true;
          // Wait a brief moment after it comes into view, then swipe once to indicate it's a carousel
          setTimeout(() => {
            nextSlide();
            // Stop normal autoplay so user isn't rushed after the initial hint
            stopAutoplay();
          }, 1200);
          carouselObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  ); // trigger when 50% visible

  carouselObserver.observe(section);

  // Start initial autoplay
  startAutoplay();
}

/**
 * Handle WhatsApp Form Submission
 */
function sendWhatsApp(e) {
  if (e) e.preventDefault();
  const nameInput = document.getElementById("contact-name");
  const phoneInput = document.getElementById("contact-phone");
  const emailInput = document.getElementById("contact-email");
  const messageInput = document.getElementById("contact-message");

  const name = nameInput ? nameInput.value : "";
  const phone = phoneInput ? phoneInput.value : "";
  const email = emailInput ? emailInput.value : "";
  const message = messageInput ? messageInput.value : "";

  const waNum = "919566023187";
  const text = `*New Enquiry from LEED Projects Website*\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Email:* ${email || "N/A"}\n*Requirements:* ${message || "N/A"}`;

  const encodedText = encodeURIComponent(text);
  window.open(`https://wa.me/${waNum}?text=${encodedText}`, "_blank");
}

/**
 * Clients Section Carousel Logic
 */
function initClientCarousel() {
  const container = document.querySelector("#clients");
  if (!container) return;

  const wrapper = container.querySelector(".client-slider-wrapper");
  const items = container.querySelectorAll(".client-card-item");
  const prevBtn = container.querySelector(".client-prev");
  const nextBtn = container.querySelector(".client-next");
  
  if (!wrapper || items.length === 0 || !prevBtn || !nextBtn) return;

  let currentIndex = 0;
  
  function getItemsToShow() {
    if (window.innerWidth > 991) return 3;
    if (window.innerWidth > 768) return 2;
    return 1;
  }

  function updateSlider() {
    const itemsToShow = getItemsToShow();
    const maxIndex = Math.max(0, items.length - itemsToShow);
    
    // Clamp currentIndex
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    
    const offset = currentIndex * (100 / itemsToShow);
    wrapper.style.transform = `translateX(-${offset}%)`;

    // Update button states
    prevBtn.style.opacity = currentIndex === 0 ? "0.5" : "1";
    prevBtn.style.pointerEvents = currentIndex === 0 ? "none" : "auto";
    
    nextBtn.style.opacity = currentIndex >= maxIndex ? "0.5" : "1";
    nextBtn.style.pointerEvents = currentIndex >= maxIndex ? "none" : "auto";
  }

  nextBtn.addEventListener("click", () => {
    const itemsToShow = getItemsToShow();
    if (currentIndex < items.length - itemsToShow) {
      currentIndex++;
      updateSlider();
    }
  });

  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });

  // Handle Window Resize
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateSlider, 250);
  });

  // Touch Support
  let touchStartX = 0;
  let touchEndX = 0;

  wrapper.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  wrapper.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      nextBtn.click();
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      prevBtn.click();
    }
  }

  // Initial call
  updateSlider();
}
