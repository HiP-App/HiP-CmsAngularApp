FROM markadams/chromium-xvfb
EXPOSE 8080

RUN mkdir -p /angularapp
COPY . /angularapp

WORKDIR /angularapp

#install node
RUN apt-get update && apt-get install -y curl

RUN curl -sL https://deb.nodesource.com/setup_4.x | bash -
RUN apt-get install -y nodejs

RUN npm install -g npm@latest

# install dependencies
RUN npm install
RUN npm run postinstall
RUN npm run webdriver:update
RUN mv app/config.constant.ts.example app/config.constant.ts 
RUN npm run tsc
RUN rm $(find -name *.ts)
RUN rm $(find -name *map.js)

#do the testing
#RUN npm test
#RUN npm run e2e

CMD echo "\"use strict\"; exports.CONFIG = { authUrl: '$AUTH_ADDR', authSecret: '$AUTH_SECRET', cmsUrl: '$WEBAPI_ADDR'};//# sourceMappingURL=config.constant.js.map;" > app/config.constant.js && npm run serve