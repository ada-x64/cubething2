/////////////////////////////// cubething.dev /////////////////////////////////

export type tNav = { name: string; href: string }[];
import buildcfg from "./buildcfg.json";

export const routePrefix = buildcfg.root ?? "/";

export const mkHref = (location: string) => {
  return routePrefix + location.replace(/^\/+/, "");
};

export const mainNav = [
  // { name: "home", href: `/` },
  { name: "blog", href: `${routePrefix}` },
  {
    name: "about",
    href: mkHref("/about"),
  },
  // {
  //   name: "gfx",
  //   href: "/gfx",
  // },
  // {
  //   name: "articles",
  //   href: "/articles",
  // },
];

export const articleNav = [
  {
    name: "top",
    href: "#",
  },
];
