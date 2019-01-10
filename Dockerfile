FROM node:10

RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/dependencies

#ENV NPM_PREFIX /usr/src/dependencies
#ENV NODE_MODULES_INSTALL_PATH $NPM_PREFIX/node_modules
#ENV NODE_PATH $NODE_MODULES_INSTALL_PATH

WORKDIR /usr/src/app

# install app dependencies
#ADD package-lock.json $NPM_PREFIX/package-lock.json
#ADD package.json $NPM_PREFIX/package.json
#RUN npm install --prefix $NPM_PREFIX

ADD package.json .
ADD package-lock.json .
RUN npm install

ADD bin bin
ADD src src
ADD test test
ADD tsconfig.json tsconfig.json
ADD tslint.json tslint.json

ENTRYPOINT ["/usr/src/app/bin/run"]
