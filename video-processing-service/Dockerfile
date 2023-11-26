#use an official Node runtime as a parent image
#stage 1: build stage
FROM node:18 AS builder

#set working dir in the container to /app
WORKDIR /app

#copy package.json and package-lock.json into working dir
COPY package*.json ./

#install any needed packages specified in package.json
RUN npm install

#copy app source code inside docker image
COPY . .

#build the app
RUN npm run build



#stage 2 : production stage
FROM node:18 

#set working dir in the container
WORKDIR /app

#copy package files
COPY package*.json ./

#install ffmpeg in container
#RUN npm install pip
RUN apt-get update && apt-get install -y ffmpeg 

#install only production dependencies
RUN npm install --only=production

#copy built app from builder stage
COPY --from=builder /app/dist ./dist

#make port available
EXPOSE 3000

#define command to run your app
CMD ["npm", "run", "serve"]