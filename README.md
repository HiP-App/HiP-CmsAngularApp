HiP-CMS Angular App
===================

HiP-CmsAngularApp is a content management system which is developed by the project group [History in Paderborn](https://hip.cs.uni-paderborn.de) to manage the data of the 'History in Paderborn' system.

This is a client application which makes use of several RESTful APIs.
[Mobile apps](https://github.com/HiP-App/HiP-Forms) make the content of HiP-CMS accessable to the public.


## Requirements

 * Node version >= 6.x (LTS version) and npm >= 5.x


## Getting started 

### How to develop

 * Clone the repository.
 * Navigate to `cd HiP-CmsAngularApp`
 * `npm install` to install all dependencies.
 * Create a `hip-config.json` config file, like `hip-config.json.example` with correct URLs.
 * `npm start` compiles the application, then simultaneously re-compiles and runs the webdpack-dev-server.

After completing development it is recommended to execute `npm run lint` command which will give all the code style issues which need to be fixed before creating a Pull Request.

### How to deploy

To create the files for production, replace `npm start` from the development setup with the following commands:
 * `npm run build:production` to build the app for production.
 * `npm run serve` to start the angular-http-server on port 8080.

### How to test

To create the files for production, replace `npm start` from the development setup with the following commands:
 * `npm run build:production` to build the app for production.
 * Create a `hip-test-data.json` config file, like `hip-test-data.json.example` with the required test data.
 * `npm run webdriver:update` to install the webdriver needed for the Protractor tests.
 * `npm run e2e` runs the End to End tests using Protractor.

The results can be found on the console output and `_test-output/protractor-results.txt`.

### How to build and run as a Docker Container

 * `npm run docker`.


## How to generate source code documentation

You can create a source documentation by running: `npm run doc`. 
The created documentation takes place in `docs/`.


## Contact

> HiP (History in Paderborn) ist eine Plattform der:
> Universität Paderborn
> Warburger Str. 100
> 33098 Paderborn
> http://www.uni-paderborn.de
> Tel.: +49 5251 60-0

You can also [write an email](mailto:hip-app@campus.upb.de).
