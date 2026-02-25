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

// Initialize components
document.addEventListener("DOMContentLoaded", () => {
  loadComponent("header-root", "components/header.html");
  loadComponent("hero-root", "components/hero.html");
  loadComponent("about-root", "components/about.html");
  loadComponent("services-root", "components/services.html");
  loadComponent("execution-root", "components/execution.html");
  loadComponent("scope-root", "components/scope.html");
  loadComponent("footer-root", "components/footer.html");

  // Add scroll listener for header effect
  window.addEventListener("scroll", () => {
    const header = document.querySelector("nav");
    if (header && window.scrollY > 50) {
      header.classList.add("glass-header");
    } else if (header) {
      header.classList.remove("glass-header");
    }
  });
});
