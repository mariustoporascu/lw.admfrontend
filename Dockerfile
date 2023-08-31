FROM node:18-alpine
COPY . .

WORKDIR /app
RUN npm install -g @angular/cli
