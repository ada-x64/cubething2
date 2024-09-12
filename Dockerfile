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
FROM base as release
WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY --from=install /temp/dev/node_modules node_modules
COPY ./ ./
RUN bun dist

EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "start" ]