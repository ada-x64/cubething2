# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:debian AS base

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
ENV HUSKY=0
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy production dependencies and source code into final image
FROM registry.gitlab.com/islandoftex/images/texlive:latest-full as release
WORKDIR /usr/src/app

# Bring bun into the tex image and do stuff from the bun image
COPY --from=base /usr/local/bin/bun /usr/local/bin/bun
ARG BUN_RUNTIME_TRANSPILER_CACHE_PATH=0
ENV BUN_RUNTIME_TRANSPILER_CACHE_PATH=${BUN_RUNTIME_TRANSPILER_CACHE_PATH}
ARG BUN_INSTALL_BIN=/usr/local/bin
ENV BUN_INSTALL_BIN=${BUN_INSTALL_BIN}

# Build and test. (This would go into a prerelease image but w/e)
COPY --from=install /temp/dev/node_modules node_modules
COPY ./ ./

# [optional] tests & build
ENV NODE_ENV=production
RUN bun test
RUN bun run build

# RUN groupadd bun \
#       --gid 1000 \
#     && useradd bun \
#       --uid 1000 \
#       --gid bun \
#       --shell /bin/sh \
#       --create-home \
#     && ln -s /usr/local/bin/bun /usr/local/bin/bunx \
#     && which bun \
#     && which bunx \
#     && bun --version
# USER bun
# ENV PATH="/usr/local/texlive/2024/:$PATH"
# NOTE: Using --chmod=444 --chown=bun:bun seems to corrupt child file permissions,
# so we have to do this as root. Boo.

# Install pandoc.
RUN apt-get update
RUN apt-get install -y pandoc 
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# run the app
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "dist/server/index.js" ]
# ENTRYPOINT [ "bash" ]