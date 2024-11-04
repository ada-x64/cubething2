/////////////////////////////// cubething.dev /////////////////////////////////

let timeout: Timer | null = null;
let mainNavMouseOver = false;
let articleNavMouseOver = false;
let navsHidden = false;
document.addEventListener("DOMContentLoaded", () => {
  const mainNav = document.getElementById("main-nav")!;
  const articleNav = document.getElementById("article-nav")!;

  const onMouseLeave = (nav: HTMLElement) => {
    if (navsHidden === true) {
      nav.style.opacity = "0";
    }
    return false;
  };
  const onMouseOver = (nav: HTMLElement) => {
    if (navsHidden === true) {
      nav.style.opacity = "1";
    }
    return true;
  };

  mainNav.onmouseover = () => {
    mainNavMouseOver = onMouseOver(mainNav);
  };
  mainNav.onmouseleave = () => {
    mainNavMouseOver = onMouseLeave(mainNav);
  };
  articleNav.onmouseover = () => {
    articleNavMouseOver = onMouseOver(articleNav);
  };
  articleNav.onmouseleave = () => {
    articleNavMouseOver = onMouseLeave(articleNav);
  };

  const hideNav = (nav: HTMLElement, mouseover: boolean) => {
    if (mouseover === false) {
      nav.style.opacity = "0";
    }
    navsHidden = true;
  };

  const showNav = (nav: HTMLElement) => {
    nav.style.opacity = "1";
    navsHidden = false;
  };

  const hideNavs = () => {
    hideNav(mainNav, mainNavMouseOver);
    hideNav(articleNav, articleNavMouseOver);
  };

  const showNavs = () => {
    showNav(mainNav);
    showNav(articleNav);
  };

  const onScroll = () => {
    if (timeout == null) {
      showNavs();
      timeout = setTimeout(() => {
        if (window.scrollY > 0) {
          hideNavs();
        }
        timeout = null;
      }, 2000);
    }
  };

  window.onscroll = () => onScroll();
  mainNav.addEventListener("focusin", showNavs);
  articleNav.addEventListener("focusin", showNavs);
  showNavs();
});
