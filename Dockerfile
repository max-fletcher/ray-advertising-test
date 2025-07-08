FROM node:20-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install
COPY . .
EXPOSE 4001

# CMD ["node", "app.js"]

# RUN ["npm", "install", "-g", "nodemon"]

CMD ["yarn", "dev"]
