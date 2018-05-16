FROM docker-production-local.artifactory.corp.alleninstitute.org/aics-ubuntu-16.04:20170619-1

MAINTAINER aics

ARG ARTIFACTORY=https://artifactory.corp.alleninstitute.org/artifactory
ARG DUMB_INIT_VER=1.2.0

ENV DEPLOYMENT_ENV=${DEPLOYMENT_ENV:-development}

#########################################################
# Install dependencies
#########################################################

RUN apt-get update && \
    apt-get install -y \
      curl \
      gosu \
      python \
      python-dev \
      python-pip \
      python-tk \
      python-virtualenv \
      uuid \
      wget && \
    \
    wget -O /usr/local/bin/dumb-init \
      ${ARTIFACTORY}/generic-local/com.yelp/dumb-init/${DUMB_INIT_VER}/dumb-init_${DUMB_INIT_VER}_amd64 && \
    chmod +x /usr/local/bin/dumb-init && \
    \
    rm -rf /var/lib/apt/lists && \
    apt-get clean

#########################################################
# Install NodeJS
#########################################################

WORKDIR /usr/local
RUN curl -sL ${ARTIFACTORY}/node-remote/v8.2.1/node-v8.2.1-linux-x64.tar.gz \
    | tar --strip-components 1 -xz

#########################################################
# Install aicsimage
#########################################################

RUN pip install aicsimage -i ${ARTIFACTORY}/api/pypi/pypi-virtual/simple

#########################################################
# Install the app
#########################################################

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY docker/.npmrc /usr/src/app
COPY package.json /usr/src/app
RUN npm install

COPY . /usr/src/app

EXPOSE 9020

RUN mkdir -p /allen
VOLUME /allen

# set up the user and group to run as
RUN /usr/sbin/groupadd -g 10513 domain_users && \
    /usr/sbin/useradd -c "nodejs user" -g domain_users -m -N -s /bin/bash -u 1207 svc_aics_prod_rw

COPY docker/entrypoint.sh /usr/src/app
RUN chmod +x /usr/src/app/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/dumb-init", "/usr/src/app/entrypoint.sh"]
CMD ["gosu", "svc_aics_prod_rw", "npm", "start"]

# see dockerrun.sh; docker run -p 9020:9020 -d -v /allen:/allen:shared danielt/aics-image-viewer-app