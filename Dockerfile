# ===================== BASE =========================
FROM node:18 as base

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn

# ==================== DEVELOPMENT ====================
FROM base as development

ENV NODE_ENV=development

COPY . .

CMD [ "yarn", "start:dev" ]