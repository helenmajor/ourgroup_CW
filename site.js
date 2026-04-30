document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const menuToggle = document.querySelector(".menu-toggle");
  const sidebarToggle = document.querySelector(".sidebar-toggle");
  const siteDrawer = document.getElementById("site-drawer");
  const drawerBackdrop = document.querySelector(".drawer-backdrop");
  const desktopQuery = window.matchMedia(
    "(min-width: 1024px) and (min-height: 620px) and (hover: hover) and (pointer: fine)"
  );

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

  const initVibeLoop = () => {
    const section = document.querySelector(".vibe-loop-section");
    if (!section) {
      return;
    }

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const revealItems = Array.from(
      section.querySelectorAll("[data-vibe-loop-reveal], [data-vibe-loop-step]")
    );
    const steps = Array.from(section.querySelectorAll("[data-vibe-loop-step]"));
    const toggles = Array.from(section.querySelectorAll(".vibe-loop-card-button"));

    section.classList.add("is-enhanced");

    toggles.forEach((toggle) => {
      const detailId = toggle.getAttribute("aria-controls");
      const detail = detailId ? document.getElementById(detailId) : null;
      const step = toggle.closest("[data-vibe-loop-step]");
      const label = toggle.querySelector(".vibe-loop-toggle-label");

      const setExpanded = (expanded) => {
        toggle.setAttribute("aria-expanded", String(expanded));
        step?.classList.toggle("is-expanded", expanded);

        if (detail) {
          detail.hidden = !expanded;
        }

        if (label) {
          label.textContent = expanded ? "Hide details" : "Show details";
        }
      };

      setExpanded(toggle.getAttribute("aria-expanded") === "true");

      toggle.addEventListener("click", () => {
        setExpanded(toggle.getAttribute("aria-expanded") !== "true");
      });
    });

    const revealAll = () => {
      revealItems.forEach((item) => {
        item.classList.add("is-visible");
      });

      if (steps[0]) {
        steps[0].classList.add("is-active");
      }
    };

    if (reducedMotionQuery.matches || !("IntersectionObserver" in window)) {
      revealAll();
      return;
    }

    const setActiveStep = (activeStep) => {
      steps.forEach((step) => {
        step.classList.toggle("is-active", step === activeStep);
      });
    };

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");

          if (entry.target.matches("[data-vibe-loop-step]")) {
            setActiveStep(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -20% 0px",
        threshold: 0.24,
      }
    );

    revealItems.forEach((item) => {
      revealObserver.observe(item);
    });
  };

  initVibeLoop();

  body.classList.add("is-ready");
});

window.addEventListener("pageshow", () => {
  if (document.body) {
    document.body.classList.add("is-ready");
  }
});
