# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM texlive/texlive:latest AS base

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN curl -fsSL https://bun.sh/install | BUN_INSTALL=/usr bash
ENV HUSKY=0
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production


# copy production dependencies and source code into final image
FROM base as release
RUN curl -fsSL https://bun.sh/install | BUN_INSTALL=/usr bash
WORKDIR /usr/src/app
ENV NODE_ENV=production
ENV HOT=false
RUN --mount=target=/var/lib/apt/lists,type=cache,sharing=locked \
    --mount=target=/var/cache/apt,type=cache,sharing=locked \
    rm -f /etc/apt/apt.conf.d/docker-clean \
    && apt-get update \
    && apt-get -y --no-install-recommends install \
        imagemagick pandoc rsync

COPY --from=install /temp/dev/node_modules node_modules
COPY ./ ./

RUN bun dist 2>&1 | tee dist.log

EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "start" ]