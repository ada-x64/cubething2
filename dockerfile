FROM node:22-bookworm

WORKDIR /app
RUN apt-get update
RUN apt-get install pandoc -y
COPY ./ ./
EXPOSE 3000
RUN npm i
CMD ["npm", "start"]