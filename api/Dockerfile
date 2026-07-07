# Image de l'API (version simple — la variante multi-stage est dans artefacts/docker/)
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
EXPOSE 3000
# Utilisateur non-root (bonne pratique sécurité)
USER node
CMD ["node", "server.js"]
