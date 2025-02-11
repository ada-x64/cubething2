/////////////////////////////// cubething.dev /////////////////////////////////

import { html } from "htm/preact/index.js";
import { type ComponentChildren } from "preact";
import { useContext } from "preact/hooks";
import { Palette, TwClass } from "../styles";
import HeadComponent from "./Head";
import NavBtn from "./NavBtn";
import MainNav from "../nav/MainNav";
import ArticleNav from "../nav/ArticleNav";
import MainContent from "./MainContent";
import Title from "./Title";
import { useRoute } from "preact-iso";
import { AppState } from "..";
import Footer from "./Footer";

export default function Layout({ children }: { children: ComponentChildren }) {
  const route = useRoute().path;
  const state = useContext(AppState);
  const title = state.title.value;
  return html`
    <${HeadComponent} />
    <head>
      <title>${`cubething.dev → ${title.toLowerCase()}`}</title>
    </head>
    <${NavBtn} route=${route} />
    <main
      class=${TwClass(["flex", "justify-center", "max-w-screen-lg", "mx-auto"])}
    >
      <${MainNav} />
      <${ArticleNav} />
      <${MainContent}
        twClass=${TwClass([
          "px-4",
          "lg:px-16",
          "flex-auto",
          "flex",
          "flex-col",
          "scroll-smooth",
          "w-full",
          "md:max-w-screen-md",
          Palette.text,
        ])}
      >
        <${Title} title=${title} />
        ${children}
        <${Footer} />
      <//>
    </main>
  `;
}
