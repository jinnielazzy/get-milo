FROM node:18

# Create workdir in container
WORKDIR /app

# Pre-install dependencies
COPY package.json ./
RUN npm install

# Don't copy JS yet — we'll mount it at runtime
CMD ["node", "download_video.js"]
