FROM node:lts
ENV NODE_ENV=production

WORKDIR /app

# Install app dependencies
COPY ["package.json", "yarn.lock", "./"]
RUN yarn install

# Bundle app source
COPY . .

# Build
# RUN yarn build

# EXPOSE 3000

CMD [ "yarn", "start" ]