FROM node:alpine

COPY package*.json ./
RUN npm install

COPY listen.js .

ENTRYPOINT ["node"]
CMD ["listen.js"]
