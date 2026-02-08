# Multi-stage Dockerfile for Next.js
# Optimized for fast builds and small image sizes

# Stage 1: Dependencies
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
# Use npm ci if package-lock exists, otherwise npm install
RUN if [ -f package-lock.json ]; then \
      npm ci --only=production --ignore-scripts; \
    else \
      npm install --production --ignore-scripts; \
    fi

# Stage 2: Development dependencies
FROM node:18-alpine AS dev-deps
RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY package.json package-lock.json* ./

RUN if [ -f package-lock.json ]; then \
      npm ci; \
    else \
      npm install; \
    fi

# Stage 3: Development image (default for docker-compose)
FROM node:18-alpine AS dev
WORKDIR /app

# Copy node_modules from dev-deps stage
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=development \
    NEXT_TELEMETRY_DISABLED=1

# Run development server with turbo for faster builds
CMD ["npm", "run", "dev"]

# Stage 4: Builder - Build the application
FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .

# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npm run build

# Stage 5: Production runner - Final lightweight image
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000 \
    HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
