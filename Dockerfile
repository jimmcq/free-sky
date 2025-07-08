FROM node:lts AS base

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
RUN yarn install

# Bundle app source
COPY . /usr/src/app/

# Development target
FROM base AS development
ENV NODE_ENV=development
EXPOSE 3000
CMD [ "yarn", "dev" ]

# Production target
FROM base AS production
ENV NODE_ENV=production

# Build
RUN yarn build

EXPOSE 3000
CMD [ "yarn", "start" ]