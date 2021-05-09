FROM node

WORKDIR /front
EXPOSE 3000

COPY ./package.json ./package-lock.json ./
RUN npm i
COPY . .

ENTRYPOINT ["npm", "run", "dev"]
