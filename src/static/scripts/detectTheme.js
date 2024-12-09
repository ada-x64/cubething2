/////////////////////////////// cubething.dev /////////////////////////////////

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const storedTheme = localStorage.getItem("theme");
if (storedTheme === null || storedTheme === "0") {
  prefersDark
    ? document.documentElement.classList.add("dark")
    : document.documentElement.classList.remove("dark");
  localStorage.setItem("theme", "0");
} else {
  storedTheme === "2"
    ? document.documentElement.classList.add("dark")
    : document.documentElement.classList.remove("dark");
}

const bgColor = document.querySelector("html").classList.contains("dark")
  ? "#18181b"
  : "#fafaf9";
document.querySelector("html").style.background = bgColor;
