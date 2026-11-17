FROM node:22-alpine

LABEL maintainer="DevOps Engineer"
LABEL application="webtext-app"

WORKDIR /app

COPY --chown=1000:1000 app/server.js ./server.js

ENV NODE_ENV=production

USER 1000

EXPOSE 80

CMD ["node", "server.js"]
