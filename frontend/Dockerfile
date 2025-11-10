FROM node:22-alpine AS builder

WORKDIR /app

COPY . .
RUN yarn install --frozen-lockfile

RUN yarn build
EXPOSE 3000

CMD ["yarn", "start"]