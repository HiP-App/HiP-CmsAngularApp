"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
  };
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var toolbar_1 = require('@angular2-material/toolbar');
var button_1 = require('@angular2-material/button');
var icon_1 = require('@angular2-material/icon');
var sidenav_1 = require('@angular2-material/sidenav');
var ToolbarComponent = (function () {
  function ToolbarComponent() {
    this.start = sidenav_1.MdSidenav;
    this.title = 'HiPCMS';
    this.topnav = [
      {
        'href': '/contact/',
        'name': 'contact'
      },
      {
        'href': '/help/',
        'name': 'help'
      },
      {
        'href': '/about/',
        'name': 'about'
      }
    ];
  }

  __decorate([
    core_1.Input(),
    __metadata('design:type', Object)
  ], ToolbarComponent.prototype, "start", void 0);
  ToolbarComponent = __decorate([
    core_1.Component({
      selector: 'hip-toolbar',
      viewProviders: [icon_1.MdIconRegistry, http_1.HTTP_PROVIDERS],
      templateUrl: './app/shared/toolbar/toolbar.component.html',
      directives: [toolbar_1.MdToolbar, button_1.MdButton, icon_1.MdIcon]
    }),
    __metadata('design:paramtypes', [])
  ], ToolbarComponent);
  return ToolbarComponent;
}());
exports.ToolbarComponent = ToolbarComponent;
//# sourceMappingURL=toolbar.component.js.map