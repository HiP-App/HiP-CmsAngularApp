FROM markadams/chromium-xvfb
EXPOSE 8080

COPY . /usr/src/app
WORKDIR /usr/src/app

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
RUN npm test
CMD npm run serve;