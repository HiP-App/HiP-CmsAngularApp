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

#do the testing
#RUN npm test
#RUN npm run e2e

CMD echo "export const CONFIG = { authUrl: '$AUTH_ADDR', cmsUrl: '$WEBAPI_ADDR'  };" >> app/config.constant.ts && npm run serve