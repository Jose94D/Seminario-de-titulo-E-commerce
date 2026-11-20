FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 5000
# Carga los datos de ejemplo si la base está vacía y arranca la API
CMD ["sh", "-c", "node seed.js && node server.js"]
