# Use a nodejs image
FROM node:18

# Install RabbitMQ inside the container
RUN apt-get update && apt-get install -y rabbitmq-server

WORKDIR /app

# Copy all the app's files to the container's image
COPY . .


# Install al the app dependencies
RUN npm install

EXPOSE 3000

# Define the commands to init the app
#CMD ["npm", "start"]

