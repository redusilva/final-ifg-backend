FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm prune --omit=dev

EXPOSE 3001

CMD ["npm", "run", "start"]