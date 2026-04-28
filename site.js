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

  body.classList.add("is-ready");
});

window.addEventListener("pageshow", () => {
  if (document.body) {
    document.body.classList.add("is-ready");
  }
});
