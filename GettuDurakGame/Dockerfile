FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application files
COPY . .

# Build frontend
RUN npm run build

# Expose ports
EXPOSE 3000 5173

# Start application
CMD ["npm", "start"]