# 1. Use an official Node.js runtime as a parent image
FROM node:18-slim

# 2. Install compilers (g++ for C++, python3 for Python)
# We use 'slim' to keep it small, so we need to apt-get install what we need
RUN apt-get update && apt-get install -y \
    g++ \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# 3. Set the working directory
WORKDIR /app

# 4. Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# 5. Copy the rest of the application code
COPY . .

# 6. Expose the port your app runs on
EXPOSE 5000

# 7. Define the command to run your app
CMD ["node", "server.js"]