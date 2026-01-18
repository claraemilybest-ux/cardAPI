# Use a slim Node base
FROM node:latest

# Metadata
LABEL maintainer="Clara Best"
LABEL description="Simple Express-based cards REST API"
LABEL cohort="21"
LABEL animal="Tiger"

WORKDIR /app

# Only copy package files first (keeps layer cacheable)
COPY package*.json ./

# Install deps (fallback to npm install if npm ci fails)
RUN npm install

# Copy only the application files needed at runtime
COPY index.js cards.json ./

# Default port used by the app
ENV PORT=3000
EXPOSE 3000/tcp

CMD ["node", "index.js"]