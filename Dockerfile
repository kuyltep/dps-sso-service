FROM node:slim-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --production=false

COPY . .

RUN yarn build

FROM node:slim-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist


CMD ["node", "dist/main.js"]