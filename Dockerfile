FROM node:20-bookworm-slim
RUN apt-get update && apt-get install -y openssl
WORKDIR /app
COPY package.json ./
RUN npm install
COPY prisma ./prisma
RUN npx prisma generate
COPY src ./src
EXPOSE 3000
CMD ["node", "src/index.js"]
