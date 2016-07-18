HiPCMS AngularJS App
======

HiP-CmsAngularApp is a content management system which is developed by the project group [History in 
Paderborn](http://is.uni-paderborn.de/fachgebiete/fg-engels/lehre/ss15/hip-app/pg-hip-app.html).
It is developed to fill the system 'History in Paderborn' with data. This is only a client application. We 
also develop a [REST API](https://github.com/HiP-App/HiP-CmsWebApi) which provides service end points. The REST API is built on .NET Core 1.0.

In another team of the project group, an Android app is developed that will 
make the content of HiPCMS accessable to the public. Information about the app 
will be added as soon as it is available.

HiPCMS will replace the original project which was known as [HiPBackend](https://hip.upb.de/).
HiPBackend's code unfortunately was not maintainable anymore and a rewrite was decided. 

See the LICENSE file for licensing information.

See [the graphs page](https://github.com/HiP-App/HiP-CmsAngularApp/graphs/contributors) 
for a list of code contributions.

## Requirements:

 * Node version >= 4.0 and NPM >= 3
 

## Technolgies and Frameworks

HiP-CmsAngularApp is a Client Application built on AngularJS 2.


## Getting started

 * Clone the repository.
 * Navigate to `cd HiP-CmsAngularApp`
 * `npm install` to install all dependencies
 * create a `app/config.constant.ts` config file, like `app/config.constant.ts.example` with correct urls
 * `npm start` compiles the application, then simultaneously re-compiles and runs the `lite-server`


## How to develop

 * The latest code is available on [the project's Github-page](https://github.com/HiP-App/HiP-CmsAngularApp/)
 * You can [fork the repo](https://help.github.com/articles/fork-a-repo/) or [clone our repo](https://help.github.com/articles/cloning-a-repository/)
   * To submit patches you should fork and then [create a Pull Request](https://help.github.com/articles/using-pull-requests/)
   * If you are part of the project group, you can create new branches on the main repo as described [in our internal
     Confluence](http://atlassian-hip.cs.upb.de:8090/display/DCS/Conventions+for+git)


## How to test

 * Clone the repository.
 * Navigate to `cd HiP-CmsAngularApp`
 * `npm install` to install all dependencies
 * `npm test` Runs the unit Tests for testing Angular 2 code with Jasmine and Karma.
 * `npm run e2e` Runs the End to End tests using protractor.

## How to build and run as a Docker Container

 * npm run docker

## How to submit Defects and Feature Proposals

Please write an email to [hip-app@campus.upb.de](mailto:hip-app@campus.upb.de).

## Source Code Documentation

You can create a source documentation by running: `npm run doc`. 
The created documentation take place in `docs/`. 

## Documentation

Documentation is currently collected in our [internal Confluence](http://atlassian-hip.cs.upb.de:8090/dashboard.action). If something is missing in 
this README, just [send an email](mailto:hip-app@campus.upb.de).


## Contact

> HiP (History in Paderborn) ist eine Plattform der:
> Universität Paderborn
> Warburger Str. 100
> 33098 Paderborn
> http://www.uni-paderborn.de
> Tel.: +49 5251 60-0

You can also [write an email](mailto:hip-app@campus.upb.de).
