ARG PORT=3000

FROM node:14.17.0 As development

ENV NODE_ENV=development

WORKDIR /usr/src

ENV PATH /usr/src/node_modules/.bin/:$PATH

COPY package*.json ./

RUN yarn && yarn cache clean --force

WORKDIR /usr/src/app

COPY . .

EXPOSE ${PORT}

FROM development as builder

RUN yarn build

FROM node:14.15.0 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Update the system
RUN apk --no-cache -U upgrade

# Prepare destination directory and ensure user node owns 
RUN mkdir -p /usr/src/app/dist && chown -R node:node /usr/src/app

WORKDIR /usr/src/app

COPY package*.json .env ./

# Switch to user node
USER node

RUN yarn --production=true

# Copy js files and change ownership to user node
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist

EXPOSE ${PORT}
ENV NODE_PATH=dist

CMD ["node", "dist/main"]
