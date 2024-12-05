---
title: Creating This Site (v2)
snippet: How I made the website you're looking at :)
publishedAt: 3 Dec 2024
---

The [previous iteration](https://github.com/ada-x64/cubething.dev) of this
website was created in a daze of experimental technology. Mostly I was trying to
show off! Clearly this is not the best way to make a website. I have another
year or two of development experience under my belt since then, so I'm rewriting
it from scratch in an attempt to make it more feasible to edit in the long-term.
I've also added a lot of new features - primarily, server-side rendering
$\LaTeX{}$ documents. I hope this will serve me well going forward, as I intend
on attending graduate school in the near future. It will be nice to publish
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

## Back-End - SSR with make4ht, aka Latex Hell

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

Currently I'm building everything locally. I manually installed
[TeXLive](https://tug.org/texlive/) on Debian for WSL2. I'm using
[XeLaTeX](https://tug.org/xetex/) for Unicode support, and I'm building with
[latexmk](https://ctan.org/pkg/latexmk/) for compatibility with the
[LaTeX Workshop VSCode extension](https://github.com/James-Yu/LaTeX-Workshop).
As previously mentioned, everything that can be rendered is rendered on _my_
machine before deployment, then shipped as the completed HTML file.

By default make4ht will use MathJax, but I find this to be an unacceptably heavy
(and ugly) solution. [$\KaTeX{}$](https://katex.org) is much lighter, easier to
user, and prettier. I'm using it to render math server-side after make4ht
converts the `tex`/`md` files to HTML. Unfortunataly, as of writing
[katex does not support `\eqref`](https://github.com/KaTeX/KaTeX/issues/2003),
among others, so I've implemented a custom (regex-heavy 🥲) solution. Happily,
though, this allows me to create custom commands, so I'm able to do things like
embed videos ([see below](#devex)), which would not otherwise be possible.

Here's an example of $\KaTeX{}$ rendering some math:

$$
		\int_{-\infty}^{\infty}\hat{f}\lparen{}x \rparen{}i\,e^{2\pi{} i\xi{} x}d\xi{}
$$

I wanted to use
[Garamond Math](https://github.com/YuanshengZhao/Garamond-Math/tree/master) to
render the $\KaTeX{}$, but it doesn't seem to be compatible. In order to change
fonts, $\KaTeX{}$ requires you to either build the library from scratch or
include it with [SCSS](https://sass-lang.com), which I happen to be using.
However, each font is specifically designed to be built out to a specific size
and style. I ended up copying the font files to my static directory and
overriding the files I wanted to use. Even more annoying than this, I am using
[fastify-static](https://github.com/fastify/fastify-static) (which uses
[glob](https://github.com/isaacs/node-glob) under the hood) to serve static
files; it allows you to follow symlinked directories, but symlinked files aren't
listed. This seems to be an issue with the glob library, and frankly I don't
feel like manually building both these libraries (and going through the process
of contributing it back) just so I can avoid a few kilobytes of redundant data.

-- In any case, I ended up using Libertinus instead, because it is far more
readable on screens. I will continue to use EB Garamond and Garamond Math for
the PDF versions of these papers though, so it's likely there will be some
mismatching styles between the two.

## devex

I am using [bun](https://bun.sh) to run the site and the bundle the
front-end.[^1] I have a custom build script which watches for changes and a
websocket-based mechanism for hot reloading the site whenever the server or
client is updated. This is pretty similar to what webpack does, but bun is
_much_ faster. This way I can open up code in one window and my browser in the
other, and get live reloads of my content without having to recompile. Overall
this is a really nice experience for writing articles.

[^1]:
    I used Deno for the
    [previous iteration of this site](https://github.com/ada-x64/cubething.dev),
    but frankly the idea of replacing the entire NodeJS ecosystem is a little
    bit insane, and the bun experience is just overall so much smoother. If I
    need to, I can always switch back to Node with little overhead.

Here's a video where I show off the build process:

\video{640}{360}{/static/media/hot-reload.mp4}

I'm using [docker](https://docker.com) to containerize the application for
distribution on
[DigitalOcean's app platform](https://www.digitalocean.com/products/app-platform)
through [GitHub Actions](https://docs.github.com/en/actions) with
[ghcr](https://ghcr.io) as the registry. This is a flexible and inexpensive
solution! The one thing I miss about using Deno is the
[free hosting](https://deno.com/deploy) - but I'm happy to pay $12/mo to have a
much better development experience.

When I eventually get around to testing (lol), I'll do it with
[node tap](https://node-tap.org) for server-side, and
[playwright](https://playwright.dev) for client-side.
