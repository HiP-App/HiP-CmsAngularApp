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

RUN mv hip-config.json.example hip-config.json
RUN chmod +x build_public.sh
RUN sh build_public.sh


CMD echo '{ "authUrl": "$AUTH_ADDR", "authSecret": "$AUTH_SECRET", "cmsUrl": "$WEBAPI_ADDR", "docsUrl": "$DOCS_URL", "docsIntegrationUrl": "$DOCS_INTEGRATION_URL"}' > hip-config.json && npm run serve