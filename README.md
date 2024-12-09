# cubething2

This is the source code for Phoenix Ada Rose Mandala's personal website. Feel
free to use it.

## system requirements

This software is built for POSIX compatible operating systems. I am using Debian
on WSL2. It requires the following development tools:

- [bun](https://bun.sh)
- [pandoc](https://pandoc.org)
- [make4ht](https://github.com/michal-h21/make4ht), preferably distributed with
  [TeXLive](https://tug.org/texlive/)
- [latexmk](https://ctan.org/pkg/latexmk/)
- [docker](https://docker.com)
- [imagemagick](https://imagemagick.org/script/index.php)
- [rsync](https://rsync.samba.org)

## quick start

```sh
bun i
# for production builds
bun dist
bun start
# for dev builds
# watches files for changes and hot-reloads
bun dev
```

## structure

Articles are rendered using a system-installed latex + pandoc instance. Articles
should follow this structure: `src/static/articles/my-article/main.{tex,md}`.
This would compile to `www/articles/my-article/index.html`, which would then be
served at the route `articles/my-article`. Essentially they're modules, which
allows us to render more complex things like $\LaTeX{}$. Use the config file to
configure make4ht to make use of custom commands and to customize the HTML
output to your needs.

Custom commands are defined in `src/static/config/make4ht.cfg`. They should
"just work" for latex files, but you'll need to use the pandoc
[raw_attribute syntax](https://pandoc.org/MANUAL.html#extension-raw_attribute)
for markdown.

## deployment

```sh
docker build -t ${USERNAME}/${CONTAINER} .
docker run -it --network host ${USERNAME}/${CONTAINER}
```

## development

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
