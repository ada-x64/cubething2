/////////////////////////////// cubething.dev /////////////////////////////////

// import { ComponentChildren } from "preact";
// import HeadComponent from "@/components/layout/Head.tsx";
// import { TwClass } from "@/deps/styles.ts";
// import { Head } from "$fresh/src/runtime/head.ts";
// import NavBtn from "@/islands/NavBtn.tsx";
// import MainNav from "@/components/nav/MainNav.tsx";
// import ArticleNav from "@/components/nav/ArticleNav.tsx";
import { html } from "htm/preact/index.js";
import { type ComponentChildren } from "preact";
import { TwClass } from "../styles";
import HeadComponent from "./Head";
import NavBtn from "./NavBtn";
import MainNav from "../nav/MainNav";
import ArticleNav from "../nav/ArticleNav";
import MainContent from "./MainContent";
import Title from "./Title";

export default function Layout({
  route,
  title,
  children,
}: {
  route: string;
  title: string;
  children: ComponentChildren;
}) {
  console.log({ route, title, children, component: "Layout" });
  return html`
    <${HeadComponent} />
    <head>
      <title>${`cubething.dev → ${title.toLowerCase()}`}</title>
    </head>
    <${NavBtn} route=${route} />
    <main class=${TwClass(["flex", "justify-center"])}>
      <${MainNav} route=${route} />
      <${ArticleNav} route=${route} />
      <${MainContent}>
        <${Title}
          route=${route}
          title=${title}
        />
        ${children}
      <//>
    </main>
  `;
}
