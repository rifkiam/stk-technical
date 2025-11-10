####################################
############# BUILDER ##############
####################################

FROM node:22-slim AS builder

WORKDIR /app

COPY . .

RUN apt-get update -y && apt-get install -y openssl
RUN yarn install
RUN yarn db:generate
RUN yarn build

####################################
########### PROD DEPS ##############
####################################

FROM node:22-slim AS prod-deps

WORKDIR /app

COPY package.json ./
COPY yarn*.lock ./

RUN yarn install --production=true


####################################
############# PROD #################
####################################

FROM node:22-alpine AS production

WORKDIR /app

RUN apk update && apk add --no-cache openssl3

COPY package.json .
COPY yarn*.lock .
COPY templates ./templates
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma/client  ./node_modules/.prisma/client

EXPOSE 3001

CMD ["node", "dist/main.js"]
