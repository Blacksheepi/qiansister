FROM node:6

RUN mkdir -p /usr/src/app
# Working directory for application
WORKDIR /usr/src/app
# Binds to port 3000
EXPOSE 3000
# Creates a mount point
VOLUME [ "/usr/src/app" ]
COPY . /usr/src/app
RUN npm install
CMD [ "npm", "start" ]
