FROM node:22-slim

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --production=false
COPY . .
RUN npm run build

EXPOSE 4981 4980
CMD ["npm", "start"]
