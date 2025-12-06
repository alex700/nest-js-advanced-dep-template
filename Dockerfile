# syntax=docker/dockerfile:1.6

# ---------- Builder ----------
FROM node:20-bookworm AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Bring only what’s needed to build first for better caching
#COPY tsconfig*.json nest-cli.json ./
#COPY src ./src
#COPY db ./db
#COPY tools ./tools
COPY . .


RUN npm run build
RUN npm prune --omit=dev

# ---------- Runtime ----------
FROM gcr.io/distroless/nodejs20
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

EXPOSE 8080
CMD ["dist/src/main.js"]
