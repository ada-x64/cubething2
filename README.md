# cubething2

This is the source code for Phoenix Ada Rose Mandala's personal website. Feel
free to use it.

## static files

- ...are hosted in a submodule, so I can be messy about it in the future. You'll
  need to create your own -- it doesn't have to be a submodule, you can just
  populate the folder. Your index.html should be at root level and have at least
  the following:

<!-- prettier-ignore -->
```html
<script src="/js/app.js" type="module"></script>
<the-app></the-app>
```

- ... are rendered using a system-installed pandoc instance. (WASM pandoc isn't
  ready for long-term usage yet.) Anything pandoc can render is fair game.
  Articles should be stored as such: `www/articles/my-article/main.*`.
  Essentially they're modules, which allows us to render more complex things
  like $\LaTeX{}$. I like to store a global bibliography in my static folder as
  well.

- ... are bundled with the application. This is inconvenient for publishing - it
  would be preferable for the author to just publish to a separate cdn - but
  this allows us to do server-side rendering without relying on a second server.

## deployment

```sh
docker build -t ${USERNAME}/${CONTAINER} .
docker run -it --network host ${USERNAME}/${CONTAINER}
```

## system requirements

This app is expected to be run on a POSIX machine. I am using Debian on WSL2.

- [bun](https://bun.sh)
- [pandoc](https://pandoc.org)
- (opt) [docker](https://docker.com)
