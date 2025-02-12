/////////////////////////////// cubething.dev /////////////////////////////////

export type tNav = { name: string; href: string }[];

export const routePrefix = process.env.BLOG_PREFIX ?? "/";

export const mainNav = [
  { name: "home", href: `/` },
  { name: "blog", href: `${routePrefix}` },
  {
    name: "about",
    href: `${routePrefix}/about`,
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
