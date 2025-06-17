# FROM node:latest

# WORKDIR /app

# COPY package.json .

# RUN npm install

# COPY . .

# RUN npm run build

FROM node:24-alpine as build-stage

COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/package.json /app/package.json

WORKDIR /app

RUN npm install --productionØ

# EXPOSE 3000

# VOLUME /app

# CMD ["node", "dist/main.js"]