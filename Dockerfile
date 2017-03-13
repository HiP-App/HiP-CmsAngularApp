FROM node
EXPOSE 8080

RUN mkdir -p /angularapp
COPY . /angularapp

WORKDIR /angularapp

# install dependencies
RUN npm install
RUN npm run postinstall
RUN npm run build_prod

RUN chmod +x prepare_public.sh
RUN sh prepare_public.sh

RUN chmod +x cleanup_public.sh
RUN sh cleanup_public.sh


CMD echo "{ \"authUrl\": \"$AUTH_ADDR\", \"authSecret\": \"$AUTH_SECRET\", \"cmsUrl\": \"$WEBAPI_ADDR\", \"docsUrl\": \"$DOCS_URL\", \"docsIntegrationUrl\": \"$DOCS_INTEGRATION_URL\"}" > hip-config.json && sed -i "s/<base href=\"\/\">/<base href=\"\/$SUB_DIR\/\">/g" index.html && npm run serve
