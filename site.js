document.documentElement.classList.add("js-motion");

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  if (!body) {
    return;
  }

  const menuToggle = document.querySelector(".menu-toggle");
  const siteDrawer = document.querySelector(".site-drawer");
  const drawerBackdrop = document.querySelector(".drawer-backdrop");
  const drawerLinks = siteDrawer
    ? Array.from(siteDrawer.querySelectorAll("a[href]"))
    : [];
  const mobileMediaQuery = window.matchMedia("(max-width: 900px)");

  const syncDrawerState = (isOpen) => {
    body.classList.toggle("nav-open", isOpen);

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    }

    if (siteDrawer) {
      siteDrawer.classList.toggle("is-open", isOpen);
      siteDrawer.setAttribute("aria-hidden", String(!isOpen));
    }

    if (drawerBackdrop) {
      drawerBackdrop.classList.toggle("is-visible", isOpen);
      drawerBackdrop.setAttribute("aria-hidden", String(!isOpen));
    }
  };

  const openDrawer = () => {
    if (!menuToggle || !siteDrawer) {
      return;
    }

    syncDrawerState(true);
  };

  const closeDrawer = () => {
    if (!menuToggle || !siteDrawer) {
      return;
    }

    syncDrawerState(false);
  };

  const toggleDrawer = () => {
    if (!menuToggle || !siteDrawer) {
      return;
    }

    const isOpen = body.classList.contains("nav-open");

    if (isOpen) {
      closeDrawer();
      return;
    }

    openDrawer();
  };

  syncDrawerState(false);

  menuToggle?.addEventListener("click", toggleDrawer);
  drawerBackdrop?.addEventListener("click", closeDrawer);

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    closeDrawer();
  });

  drawerLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (!mobileMediaQuery.matches) {
        return;
      }

      closeDrawer();
    });
  });

  const handleViewportChange = (event) => {
    if (event.matches) {
      return;
    }

    closeDrawer();
  };

  if (typeof mobileMediaQuery.addEventListener === "function") {
    mobileMediaQuery.addEventListener("change", handleViewportChange);
  } else if (typeof mobileMediaQuery.addListener === "function") {
    mobileMediaQuery.addListener(handleViewportChange);
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
