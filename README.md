HiPCMS Angular2 App
===================

HiP-CmsAngularApp is a content management system which is developed by the project group [History in 
Paderborn](http://is.uni-paderborn.de/fachgebiete/fg-engels/lehre/ss15/hip-app/pg-hip-app.html).
It is developed to fill the system 'History in Paderborn' with data. This is only a client application.

We also develop a [REST API](https://github.com/HiP-App/HiP-CmsWebApi) which provides service end points. The REST API is built on .NET Core 1.1.

In another team of the project group, [mobile apps](https://github.com/HiP-App/HiP-Mobile) are developed that will 
make the content of HiPCMS accessable to the public.

See the LICENSE file for licensing information.

See [the graphs page](https://github.com/HiP-App/HiP-CmsAngularApp/graphs/contributors) 
for a list of code contributions.

## Requirements:

 * Node version >= 6.9 and NPM >= 3
 

## Technolgies and Frameworks

HiP-CmsAngularApp is a client application built on Angular 4.0.


## Getting started

 * Clone the repository.
 * Navigate to `cd HiP-CmsAngularApp`
 * `npm install` to install all dependencies
 * create a `hip-config.json` config file, like `hip-config.json.example` with correct urls
 * `npm start` compiles the application, then simultaneously re-compiles and runs the `lite-server`
 
To get an optimized version for deployment run the following commands before `npm start`:

 * `npm run build_prod` bundles all project *.ts files to a `dist/bundle.min.js` file which can be served to the client.
 * `prepare_public.sh` copies `dist/bundle.min.js` into the root folder and adjusts the `index.html` the minimized bundle.
 * `cleanup_publish.sh` deletes all the files not needed for a deployed version.

## How to develop

 * The latest code is available on [the project's Github-page](https://github.com/HiP-App/HiP-CmsAngularApp/).
 * You can [fork the repo](https://help.github.com/articles/fork-a-repo/) or [clone our repo](https://help.github.com/articles/cloning-a-repository/)
   * To submit patches you should fork and then [create a Pull Request](https://help.github.com/articles/using-pull-requests/).
   * If you are part of the project group, you can create new branches on the main repo as described [in our internal
     Confluence](https://atlassian-hip.cs.uni-paderborn.de/confluence/display/DCS/Conventions+for+git).

## How to maintain coding standards

After completing development it is recommended to execute `npm run lint` command which will give all the coding standard issues. Fix the issues and then give a pull request. 

## How to test

 * Clone the repository.
 * Navigate to `cd HiP-CmsAngularApp`.
 * `npm install` to install all dependencies.
 * `npm test` runs the unit Tests for testing Angular 4 code with Jasmine and Karma.
 * `npm run e2e` runs the End to End tests using Protractor.

If you test on the optimized version, you have to run the tests before `cleanup_publish.sh`.

## How to build and run as a Docker Container

 * `npm run docker` 

## How to submit Defects and Feature Proposals

Please write an email to [hip-app@campus.upb.de](mailto:hip-app@campus.upb.de).

## Source Code Documentation

You can create a source documentation by running: `npm run doc`. 
The created documentation takes place in `docs/`. 

## Documentation

Documentation is currently collected in our [internal Confluence](https://atlassian-hip.cs.uni-paderborn.de/confluence/dashboard.action). If something is missing in 
this README, just [send an email](mailto:hip-app@campus.upb.de).


## Contact

> HiP (History in Paderborn) ist eine Plattform der:
> Universität Paderborn
> Warburger Str. 100
> 33098 Paderborn
> http://www.uni-paderborn.de
> Tel.: +49 5251 60-0

You can also [write an email](mailto:hip-app@campus.upb.de).
