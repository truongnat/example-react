# Multi-stage build for production
FROM oven/bun:1 AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./
COPY client/package.json ./client/
COPY server-ts/package.json ./server-ts/

# Install dependencies
RUN bun install --frozen-lockfile

# Build the client
FROM base AS client-builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/client/node_modules ./client/node_modules
COPY client ./client
COPY package.json ./

# Build client
RUN cd client && bun run build

# Build the server
FROM base AS server-builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/server-ts/node_modules ./server-ts/node_modules
COPY server-ts ./server-ts
COPY package.json ./

# Build server
RUN cd server-ts && bun run build

# Production image
FROM base AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built applications
COPY --from=client-builder /app/client/dist ./client/dist
COPY --from=server-builder /app/server-ts/dist ./server-ts/dist
COPY --from=server-builder /app/server-ts/package.json ./server-ts/
COPY --from=deps /app/server-ts/node_modules ./server-ts/node_modules

# Copy static files to server
COPY --from=client-builder /app/client/dist ./server-ts/build

# Set correct permissions
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start the server
CMD ["bun", "run", "--cwd", "server-ts", "start"]
