// Component Loader Utility
async function loadComponent(elementId, filePath) {
  try {
    const response = await fetch(filePath);
    if (response.ok) {
      const content = await response.text();
      document.getElementById(elementId).innerHTML = content;
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
  await loadComponent("whychoose-root", "components/whychoose.html");
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

  // --- Smooth Scroll for Anchor Links ---
  document.body.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const target = document.querySelector(link.getAttribute("href"));
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
