# ── Stage 1: build ──────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# HF Space secrets are automatically passed as build args.
# Declare them here so Vite can embed them in the JS bundle.
ARG VITE_SUPABASE_URL=""
ARG VITE_SUPABASE_ANON_KEY=""
ARG VITE_GEMINI_API_KEY=""
ARG VITE_HUGGINGFACE_API_KEY=""

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY
ENV VITE_HUGGINGFACE_API_KEY=$VITE_HUGGINGFACE_API_KEY

RUN npm run build

# ── Stage 2: serve ──────────────────────────────────────────
FROM nginx:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# HF Spaces requires port 7860
EXPOSE 7860
CMD ["nginx", "-g", "daemon off;"]
