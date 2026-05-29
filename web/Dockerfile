FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY web/package.json web/package-lock.json* ./
RUN npm ci || npm install

# Copy application code
COPY web/ .
COPY .env .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
