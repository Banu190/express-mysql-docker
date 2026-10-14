
FROM node:22-alpine

WORKDIR /app

COPY app/package.json ./

RUN npm install --omit=dev

COPY app/ ./

EXPOSE 3000

CMD ["npm", "start"]
