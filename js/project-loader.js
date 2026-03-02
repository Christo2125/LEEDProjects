// Project Loader Utility
async function loadProject() {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get("id");

  if (!projectId) {
    window.location.href = "index.html";
    return;
  }

  const contentRoot = document.getElementById("project-content");
  const filePath = `components/projects/${projectId}.html`;

  try {
    const response = await fetch(filePath);
    if (response.ok) {
      const content = await response.text();
      contentRoot.innerHTML = content;
      document.title = `${projectId.replace(/-/g, " ").toUpperCase()} | LEED PROJECTS`;
    } else {
      contentRoot.innerHTML = `
                <div class="container py-5 text-center">
                    <h2 class="display-4 font-heading mb-4">Project Not Found</h2>
                    <p class="font-body opacity-75 mb-5">The project you are looking for does not exist or has been moved.</p>
                    <a href="index.html" class="btn btn-outline-theme-green px-5 py-3 rounded-0">Back to Home</a>
                </div>
            `;
    }
  } catch (error) {
    console.error(`Error loading project: ${error}`);
  }
}

// Initialize project loading
document.addEventListener("DOMContentLoaded", () => {
  // Small delay to ensure main.js components are loading
  setTimeout(loadProject, 100);
});
