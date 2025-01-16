FROM node:18

WORKDIR /app
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

EXPOSE 3000

# Start the backend server
CMD ["node", "api/index.js"]
