FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/orbit/package.json ./apps/orbit/package.json
COPY apps/nujmooz/package.json ./apps/nujmooz/package.json
COPY packages/ui/package.json ./packages/ui/package.json

# Install dependencies
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/orbit/node_modules ./apps/orbit/node_modules
COPY --from=deps /app/apps/nujmooz/node_modules ./apps/nujmooz/node_modules
COPY --from=deps /app/packages/ui/node_modules ./packages/ui/node_modules

COPY . .

# Build all applications
RUN pnpm build

# Production image, copy all the files and run the apps
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Copy built applications
COPY --from=builder /app/apps/orbit/.next ./apps/orbit/.next
COPY --from=builder /app/apps/nujmooz/.next ./apps/nujmooz/.next

# Copy necessary files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/apps/orbit/package.json ./apps/orbit/package.json
COPY --from=builder /app/apps/nujmooz/package.json ./apps/nujmooz/package.json
COPY --from=builder /app/node_modules ./node_modules

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

EXPOSE 3000
EXPOSE 3001

CMD ["pnpm", "start"] 