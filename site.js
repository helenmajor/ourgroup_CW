document.documentElement.classList.add("js-motion");

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const menuToggle = document.querySelector(".menu-toggle");
  const sidebarToggle = document.querySelector(".sidebar-toggle");
  const siteDrawer = document.getElementById("site-drawer");
  const drawerBackdrop = document.querySelector(".drawer-backdrop");
  const desktopQuery = window.matchMedia("(min-width: 901px)");

  if (!body) {
    return;
  }

  const footerText = document.querySelector(".footer p");
  if (footerText) {
    footerText.innerHTML = "&copy; 2026 Journey RPG | CPT208 Human-Centric Computing Process Portfolio";
  }

  const defaultDesktopCollapsed = true;
  let navOpen = false;
  let desktopCollapsed = defaultDesktopCollapsed;

  const setDesktopState = (collapsed) => {
    if (!siteDrawer) {
      return;
    }

    desktopCollapsed = collapsed;
    body.classList.toggle("sidebar-collapsed", desktopCollapsed);
    siteDrawer.setAttribute("aria-hidden", String(desktopCollapsed));

    if (menuToggle) {
      menuToggle.setAttribute("aria-label", desktopCollapsed ? "Open navigation" : "Close navigation");
      menuToggle.setAttribute("aria-expanded", String(!desktopCollapsed));
    }

    if (sidebarToggle) {
      sidebarToggle.setAttribute("aria-label", desktopCollapsed ? "Show navigation" : "Hide navigation");
      sidebarToggle.setAttribute("aria-expanded", String(!desktopCollapsed));
    }
  };

  const setNavigationState = (open) => {
    const isDesktop = desktopQuery.matches;
    navOpen = !isDesktop && open;

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", String(navOpen));
      menuToggle.setAttribute("aria-label", navOpen ? "Close navigation" : "Open navigation");
    }

    if (siteDrawer) {
      siteDrawer.classList.toggle("is-open", navOpen);
      siteDrawer.setAttribute("aria-hidden", String(!navOpen));
    }

    if (drawerBackdrop) {
      drawerBackdrop.hidden = !navOpen;
    }

    body.classList.toggle("nav-open", navOpen);
  };

  if (menuToggle && siteDrawer) {
    menuToggle.addEventListener("click", () => {
      if (desktopQuery.matches) {
        setDesktopState(!desktopCollapsed);
        return;
      }

      setNavigationState(!navOpen);
    });

    drawerBackdrop?.addEventListener("click", () => {
      setNavigationState(false);
    });

    sidebarToggle?.addEventListener("click", () => {
      if (desktopQuery.matches) {
        setDesktopState(!desktopCollapsed);
      }
    });

    siteDrawer.querySelectorAll("a[href]").forEach((link) => {
      link.addEventListener("click", () => {
        if (!desktopQuery.matches) {
          setNavigationState(false);
        }
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !desktopQuery.matches) {
        setNavigationState(false);
      }
    });

    desktopQuery.addEventListener("change", () => {
      if (desktopQuery.matches) {
        setNavigationState(false);
        setDesktopState(desktopCollapsed);
        return;
      }

      body.classList.remove("sidebar-collapsed");
      setNavigationState(false);
    });

    if (desktopQuery.matches) {
      setDesktopState(desktopCollapsed);
    } else {
      body.classList.remove("sidebar-collapsed");
      setNavigationState(false);
    }
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
