document.documentElement.classList.add("js-motion");

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const menuToggle = document.querySelector(".menu-toggle");
  const siteDrawer = document.getElementById("site-drawer");
  const desktopQuery = window.matchMedia("(min-width: 901px)");

  if (!body) {
    return;
  }

  const syncNavigationState = () => {
    if (!menuToggle || !siteDrawer) {
      return;
    }

    const isDesktop = desktopQuery.matches;
    const isExpanded = isDesktop ? true : menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.setAttribute("aria-expanded", String(isExpanded));
    siteDrawer.classList.toggle("is-open", isExpanded);
  };

  if (menuToggle && siteDrawer) {
    menuToggle.addEventListener("click", () => {
      const nextState = menuToggle.getAttribute("aria-expanded") !== "true";
      menuToggle.setAttribute("aria-expanded", String(nextState));
      siteDrawer.classList.toggle("is-open", nextState);
    });

    desktopQuery.addEventListener("change", syncNavigationState);
    syncNavigationState();
  }

  const revealTargets = Array.from(
    document.querySelectorAll(
      [
        ".page-module .section-header",
        ".page-module .section-block",
        ".page-module .implementation-shell",
        ".page-module .prototype-row",
        ".page-module .prototype-stack",
        ".page-module .hero-panel",
        ".page-module .hero-facts",
        ".page-module .context-layout",
        ".page-module .academic-gap-grid",
        ".page-module .commercial-products-grid",
        ".page-module .persona-panel-grid",
        ".page-module .journey-frame",
        ".page-module .requirement-cluster-grid",
        ".page-module .ideation-layout",
        ".page-module .alternatives-grid",
        ".page-module .method-strip",
        ".page-module .evaluation-grid",
        ".page-module .comparison-frame",
        ".page-module .reflection-grid",
        ".page-module .contribution-wrap"
      ].join(", ")
    )
  );

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      body.classList.add("is-ready");
    });
  });

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealTargets.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  revealTargets.forEach((node, index) => {
    const variant = node.matches(".hero-panel, .hero-facts, .journey-frame, .comparison-frame")
      ? "soft"
      : "up";

    node.dataset.reveal = variant;
    node.style.setProperty("--reveal-delay", `${(index % 4) * 70}ms`);
  });

  if (!("IntersectionObserver" in window)) {
    revealTargets.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -12% 0px"
    }
  );

  revealTargets.forEach((node) => observer.observe(node));
});

window.addEventListener("pageshow", () => {
  if (document.body) {
    document.body.classList.add("is-ready");
  }
});
