FROM node
EXPOSE 8080

RUN mkdir -p /angularapp
COPY . /angularapp

WORKDIR /angularapp

# install dependencies
RUN npm install
RUN npm run postinstall

# Create hip-config.json, change base URL for subdirectory install, and start the angular http server
CMD echo "{ \"authAudience\": \"$AUTH_AUDIENCE\", \"authClientID\": \"$AUTH_CLIENTID\", \"authDomain\": \"$AUTH_DOMAIN\", \"authRedirectUri\": \"$AUTH_REDIRECTURL\", \"cmsUrl\": \"$WEBAPI_ADDR\", \"featureToggleUrl\": \"$FEATURE_TOGGLE_URL\", \"mobileContentApiUrl\": \"$DATASTORE_URL\", \"docsUrl\": \"$DOCS_URL\", \"docsIntegrationUrl\": \"$DOCS_INTEGRATION_URL\"}" > hip-config.json && sed -i "s/<base href=\"\/\">/<base href=\"\/$SUB_DIR\/\">/g" index.html && npm run serve
