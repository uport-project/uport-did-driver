
# Dockerfile

FROM node:12.14.0
LABEL maintainer="Mircea NISTOR <mircea.nistor@mesh.xyz>"
LABEL repository="git@github.com:uport-project/uport-did-driver.git"

USER root

RUN apt-get -y update

# build dependencies

RUN apt-get install -y --no-install-recommends git
RUN cd /opt/ && git clone https://github.com/uport-project/uport-did-driver.git
RUN cd /opt/uport-did-driver && npm install

# done

RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

EXPOSE 8081

ENTRYPOINT ["node", "/opt/uport-did-driver/expressresolver.js"]
