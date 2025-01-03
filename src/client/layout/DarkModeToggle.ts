/////////////////////////////// cubething.dev /////////////////////////////////

import AutoTheme from "../svg/AutoTheme.svg";
import DarkTheme from "../svg/DarkTheme.svg";
import LightTheme from "../svg/LightTheme.svg";
import { focusMobileNav } from "../layout/MobileNav";
import { signal } from "@preact/signals";
import { html } from "htm/preact/index.js";

enum ThemeState {
  auto,
  light,
  dark,
  LEN,
}

const ThemeIcons = [AutoTheme, LightTheme, DarkTheme];

function getTheme() {
  return typeof localStorage !== "undefined" && localStorage
    ? parseInt(localStorage.getItem("theme") ?? "0")
    : 0;
}

const ThemeSignal = signal(getTheme());

export function setTheme() {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  let theme = getTheme();

  const addDark = () => {
    document.documentElement.classList.add("dark");
  };
  const rmDark = () => {
    document.documentElement.classList.remove("dark");
  };
  const checkAuto = () => {
    prefersDark ? addDark() : rmDark();
  };
  const checkManual = () => {
    theme === ThemeState.dark ? addDark() : rmDark();
  };

  theme = (theme + 1) % ThemeState.LEN;
  if (typeof localStorage !== "undefined" && localStorage) {
    localStorage.setItem("theme", theme.toString());
  }
  ThemeSignal.value = theme;
  theme === ThemeState.auto ? checkAuto() : checkManual();
  focusMobileNav();
}

export default function DarkModeToggle() {
  const theme = ThemeSignal.value;
  const themeText =
    theme === ThemeState.auto
      ? "auto"
      : theme === ThemeState.light
        ? "light"
        : theme === ThemeState.dark
          ? "dark"
          : "ERROR";

  // Color scheme is detected on load.
  // See @/static/scripts/detectColorScheme.js
  return html`
    <button
      title=${`toggle theme - current: ${themeText}`}
      onClick=${setTheme}
    >
      <${ThemeIcons[theme]} />
    </button>
  `;
}
