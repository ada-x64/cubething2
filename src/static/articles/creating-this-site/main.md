---
title: Creating This Site (v2)
snippet: How I made the website you're looking at :)
publishedAt: 3 Dec 2024
---

The [previous iteration](https://github.com/ada-x64/cubething.dev) of this
website was created in a daze of experimental technology (see
[the article](/articles/creating-this-site-v1)). Mostly I was trying to show
off! Clearly this is not the best way to make a website. I have another year or
two of development experience under my belt since then, so I'm rewriting it from
scratch in an attempt to make it more feasible to edit in the long-term. I've
also added a lot of new features - primarily, server-side rendering $\LaTeX{}$
documents. I hope this will serve me well going forward, as I intend on
attending graduate school in the near future. It will be nice to publish
documents as both HTML and PDF 🙂

## Front-End - Simple SPA

This website is designed to be as simple as possible and to last as long as
possible while still being robust and easy to modify in the future, so I'm
trying to use only strongly stable technologies. Although I want to avoid
over-engineering this website, I also want to make it _look_ pretty. I spent a
lot of time making the previous iteration of this site look good, so I went
ahead and copied the front-end code over. Instead of using JSX I decided to use
[htm](https://github.com/developit/htm), keeping [preact](https://preactjs.com)
as my framework of choice. Converting from JSX to htm was very easy. It was only
a little annoying to switch from the Deno conventions to the Bun conventions.

## Back-End - SSR with make4ht

On the backend I am using [fastify](https://fastify.dev) for the server, mainly
because express.js is ancient and I want something efficient so I don't have to
pay much to host the site 🙂. I'm using [bun](https://bun.sh) to run the site,
again to keep costs low.

In order to render $\LaTeX{}$ and markdown documents, I'm running
[make4ht](https://github.com/michal-h21/make4ht), a very flexible and powerful
build system based on [tex4ht](https://tug.org/tex4ht/). I render everything
_before_ deploying, so the live server doesn't have to waste cycles rendering
them.

Figuring out how to render $\LaTeX{}$ manually was a huge pain. $\LaTeX{}$ has a
vast ecosystem and many build systems. I had previously been using
[TeXstudio](https://www.texstudio.org) with [MiKTeX](https://miktex.org) on
Windows to edit tex documents, so the build system was largely automated for me.
Obviously this is not the case when you're building something manually!

I began by building everything locally. I manually installed
[TeXLive](https://tug.org/texlive/) on Debian for WSL2, using
[XeLaTeX](https://tug.org/xetex/) for Unicode support, and building with
[latexmk](https://ctan.org/pkg/latexmk/) for compatibility with the
[LaTeX Workshop VSCode extension](https://github.com/James-Yu/LaTeX-Workshop).
This is a very simple process, but learning all the layers of abstraction was
difficult. Tex is the primary text layer, with LaTeX on top of it for layout.
XeLaTeX comes in to support unicode (replacing LaTeX as the primary build tool),
and latexmk is the toolchain. In the end, you just run latexmk, specifying your
`TEXINPUTS` and `BIBINPUTS` to specify your style and bibliography files. Easy!

To build for the web, I discovered make4ht. It's not a particularly
well-documented tool, and it doesn't seem to be in wide use, so learning this
was especially difficult.[^1] By default, make4ht will use MathJax, but I find
this to be an unacceptably heavy (and ugly) solution.
[$\KaTeX{}$](https://katex.org) is much lighter, easier to user, and prettier.
I'm using it to render math server-side after make4ht converts the `tex`/`md`
files to HTML. Unfortunataly, as of writing
[katex does not support `\eqref`](https://github.com/KaTeX/KaTeX/issues/2003),
among others, so I've implemented a custom (regex-heavy 🥲) solution for my more
formula-heavy articles. Happily, though, this allows me to create custom
commands, so I'm able to do things like embed videos and iframes
([see below](#devex)), which would not otherwise be possible.

[^1]Actually, I learned make4ht _before_ learning about latexmk and xelatex, so
this was especially painful.

Here's an example of $\KaTeX{}$ rendering some math:

$$
		\int_{-\infty}^{\infty}\hat{f}\lparen{}x \rparen{}i\,e^{2\pi{} i\xi{} x}d\xi{}
$$

## devex

I am using [bun](https://bun.sh) to run the site and the bundle the
front-end.[^2] I have a custom build script which watches for changes and a
websocket-based mechanism for hot reloading the site whenever the server or
client is updated. This is pretty similar to what webpack does, but bun is
_much_ faster. This way I can open up code in one window and my browser in the
other, and get live reloads of my content without having to recompile. Overall
this is a really nice experience for writing articles.

[^2]:
    I used Deno for the
    [previous iteration of this site](https://github.com/ada-x64/cubething.dev),
    but frankly the idea of replacing the entire NodeJS ecosystem is a little
    bit insane, and the bun experience is just overall so much smoother. If I
    need to, I can always switch back to Node with little overhead.

Here's a video where I show off the build process:

`\video{640}{360}{/static/media/hot-reload.mp4}`{=latex}

I'm using [docker](https://docker.com) to containerize the application for
distribution on
[DigitalOcean's app platform](https://www.digitalocean.com/products/app-platform)
through [GitHub Actions](https://docs.github.com/en/actions) with
[ghcr](https://ghcr.io) as the registry. This is a flexible and inexpensive
solution! The one thing I miss about using Deno is the
[free hosting](https://deno.com/deploy) - but I'm happy to pay $12/mo to have a
much better development experience.

## conclusion

I'm far happier with this rendition of the website. I've got reproducible
builds, and I have all my editor settings (e.g. for LaTeX Workshop) stored in
the repository. Linting and styling are automated, and deployment is easy. There
are still a few rough patches, and it's not feature-compatible with the old site
quite yet (no syntax highlighting or tables of contents quite yet), but those
will come with time.
