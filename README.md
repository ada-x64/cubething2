# cubething2

This is the source code for Phoenix Ada Rose Mandala's personal website. Feel
free to use it.

## system requirements

This software is build for POSIX compatible operating systems. I am using Debian
on WSL2. It requires the following packages:

- [bun](https://bun.sh)
- [pandoc](https://pandoc.org)
- [docker](https://docker.com) (for development)

## static files

- ... are located at www/

- ... are rendered using a system-installed latex + pandoc instance. Anything
  tex4html and pandoc can render is fair game. Articles should be stored as
  such: `www/articles/my-article/main.*`. Essentially they're modules, which
  allows us to render more complex things like $\LaTeX{}$. I like to store a
  global bibliography in my static folder as well.

- ... are bundled with the application. This is inconvenient for publishing - it
  would be preferable for the author to just publish to a separate cdn - but
  bundling allows us to do server-side rendering without relying on a second
  server. Overall, this solution is cheaper and faster than running two
  microservices - rebuilding the server and hosting the package is free with
  GitHub Actions, and hosting is less expensive for a single server than for
  two.

## deployment

```sh
docker build -t ${USERNAME}/${CONTAINER} .
docker run -it --network host ${USERNAME}/${CONTAINER}
```

## development

Get started with the usual `bun i`. Make sure you have `pandoc` and `tex4html`
installed. I highly recommended installing TexLive using the manual instructions
found [here](https://tug.org/texlive/quickinstall.html). This will match what is
happening in the Dockerfile.

A local development server is run with `bun dev`. This includes hot-reloading
for the application and rendered articles. To run in production mode run
`PROD=true bun dev`.

Linting, formatting, and header placement are required before commits. Make sure
Husky is up and ready to roll before you commit anything.

## license

This software is licensed under MIT.

```text
Copyright 2024 Phoenix Ada Rose Mandala

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
