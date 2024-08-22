FROM node:22-bookworm

ENV HUSKY=0

WORKDIR /app

RUN apt-get update
RUN apt-get install pandoc -y

COPY ./ ./
EXPOSE 3000
RUN npm i
RUN node build.js

ENV NODE_ENV=production
ENV PROD=true
CMD ["sh", "-c", "node dist/server/index.js"]