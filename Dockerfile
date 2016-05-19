FROM node
EXPOSE 8888

COPY . /usr/src/app
WORKDIR /usr/src/app

#Install xvfb curl and chrome for testing
RUN apt-get update; \
    apt-get install -y xvfb curl chromium;
#    curl https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - ; \
 #   sh -c 'echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'; \
 #   apt-get update && apt-get install -y google-chrome-stable

# install dependencies
RUN npm install
RUN npm run postinstall
RUN npm run webdriver:update

#add xvfb startscripts
ADD xvfb.init /etc/init.d/xvfb
ADD entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
RUN chmod +x /etc/init.d/xvfb

ENV DISPLAY :99.0
#ENV CHROME_BIN /usr/bin/google-chrome

#do the testing
RUN /entrypoint.sh npm test

#end to end test are not working properly https://github.com/angular/protractor/issues/3178
#RUN /entrypoint.sh npm run e2e

#clean up after testing
RUN apt-get remove -y chromium xvfb curl; \
    apt-get autoremove; \
    apt-get clean; \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

CMD npm run serve;