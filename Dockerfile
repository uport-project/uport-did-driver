FROM node:12.21.0
LABEL maintainer="Mircea NISTOR <mircea.nistor@mesh.xyz>"
LABEL repository="git@github.com:uport-project/uport-did-driver.git"

USER root

# add source files
RUN mkdir "uport-did-driver"
ADD LICENSE package.json yarn.lock README.md src/ uport-did-driver/
RUN cd uport-did-driver && yarn install --frozen-lockfile

EXPOSE 8081

ENTRYPOINT ["node", "/uport-did-driver/src/server.js"]
