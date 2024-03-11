# ===================== BASE =========================
FROM node:18 as base

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

# ==================== DEVELOPMENT ====================
FROM base as development

ENV NODE_ENV=development

CMD [ "yarn", "start:dev" ]