/////////////////////////////// cubething.dev /////////////////////////////////

import { LocalAction, Palette, TwClass } from "../styles";
import { ItemContainerStyle, ItemStyle } from "../styles";
import DarkModeToggle from "./DarkModeToggle";
import { MainNavItems } from "../nav/MainNavItems";
import { ArticleNavItems } from "../nav/ArticleNavItems";
import { navSignal } from "./NavBtn";
import { articleNav, mainNav } from "../nav";
import { html } from "htm/preact/index.js";

export const getMobileNav = () => {
  return {
    wrapper: document.getElementById("mobile-nav-wrapper"),
    nav: document.getElementById("mobile-nav"),
  };
};

export const focusMobileNav = () => {
  setTimeout(() => {
    getMobileNav().nav?.focus();
  }, 100);
};

export const toggleMobileNav = () => {
  navSignal.value ? closeMobileNav() : openMobileNav();
};

export const openMobileNav = () => {
  navSignal.value = true;
  //timeout - wait for redraw
  setTimeout(() => {
    const { wrapper, nav } = getMobileNav();
    wrapper!.style.opacity = "1";
    nav!.focus();
  }, 100);
};

export const closeMobileNav = () => {
  const { wrapper } = getMobileNav();
  wrapper!.style.opacity = "0";
  setTimeout(() => {
    navSignal.value = false;
  }, 100);
};

export const onBlur = () => {
  setTimeout(() => {
    const { nav } = getMobileNav();
    if (nav!.contains(document.activeElement) === false) {
      closeMobileNav();
    }
  }, 100);
};

const WrapperStyle = TwClass([
  "fixed",
  "transition-all",
  "ease-linear",
  "top-0",
  "w-screen",
  "h-screen",
  "flex",
  "justify-center",
  "items-center",
  "z-50",
]);

const NavStyle = TwClass([
  "flex",
  "flex-col",
  "w-80",
  "min-h-1/2",
  "top-1/4",
  "border-2",
  "rounded-md",
  Palette.borderColor,
  Palette.bg,
]);

export default function MobileNav() {
  return !navSignal.value
    ? null
    : html`
        <div
          id="mobile-nav-wrapper"
          class=${WrapperStyle}
          style="opacity:0"
          tabindex=${-1}
        >
          <nav
            id="mobile-nav"
            class=${NavStyle}
            onBlur=${onBlur}
            tabIndex=${-1}
          >
            <div class=${ItemContainerStyle}><${DarkModeToggle} /></div>
            <div class=${ItemContainerStyle}>
              <${MainNavItems} navigation=${mainNav} />
            </div>
            <div class=${ItemContainerStyle}>
              <${ArticleNavItems} navigation=${articleNav} />
            </div>
            <div class=${ItemContainerStyle}>
              <button
                class=${TwClass([LocalAction, ItemStyle])}
                title="close this navigation modal"
                onClick=${closeMobileNav}
              >
                close
              </button>
            </div>
          </nav>
        </div>
      `;
}
