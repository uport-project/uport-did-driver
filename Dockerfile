FROM node:21.6.2
LABEL maintainer="Mircea NISTOR <mircea.nistor@mesh.xyz>"
LABEL repository="git@github.com:uport-project/uport-did-driver.git"

USER root

# add source files
RUN mkdir "uport-did-driver"
ADD LICENSE package.json yarn.lock README.md uport-did-driver/
ADD src/ uport-did-driver/src/
RUN cd uport-did-driver && yarn install --prod --frozen-lockfile

EXPOSE 8081

ENTRYPOINT ["node", "/uport-did-driver/src/server.js"]
