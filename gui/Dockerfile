FROM node:25-slim
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
RUN npx prisma generate
ENV NODE_TLS_REJECT_UNAUTHORIZED=1
EXPOSE 3000
CMD npx prisma migrate deploy && npm run dev
