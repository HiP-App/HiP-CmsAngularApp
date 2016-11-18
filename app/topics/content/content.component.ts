import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from 'angular2-toaster';

import { UserService } from '../../core/user/user.service';
import { User } from '../../core/user/user.model';
import { OOApiService } from '../../core/api/oo-api.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';



interface DocsAPI {
  DocEditor: DocEditor;
}

interface DocEditor {
  constructor(placeholderId: any, config: any): DocEditor;
}

declare var DocsAPI: DocsAPI;

@Component({
  selector: 'hip-content',
  template: `
  <div class="form" style="margin: 0;padding: 0;height: 100%;">
    <div id="iframeEditor">
    </div>
  </div>
`
})
export class ContentComponent implements OnInit {
  private currentUser: User;
  private topicId: number;
  public html: SafeHtml;

  apiUrl = '';
  public config = {
    apiUrl: '',
    editor: {
      callbackUrl: '',
      canBackToFolder: false,
      curUserHostAddress: '',
      documentType: '',
      fileChoiceUrl: '',
      firstName: '',
      getServerUrl: '',
      isEdit: false,
      key: '',
      lang: '',
      lastName: '',
      mode: '',
      plugins: {},
      type: '',
      userid: '',
    },
    file: {
      ext: '',
      name: '',
      uri: '',
      version: 0,
    },
    history: [],
    setHistoryData: {
      url: '',
      urlDiff: ''
    }
  };
  loaded = true;
  count = 0;

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private toasterService: ToasterService,
              private ooApiService: OOApiService,
              private sanitizer: DomSanitizer) {
  }

  public loadScript() {
    console.log('load script');

    let node = document.createElement('script');
    node.src = this.apiUrl;
    node.type = 'text/javascript';
    node.charset = 'utf-8';
    document.getElementsByTagName('body')[0].appendChild(node);
    console.log('script loaded');
    // console.log(this.config);
    console.log(JSON.stringify(this.config.editor.plugins));
    let script = `
        var docEditor;
        var fileName = "` + this.config.file.name + `";
        var fileType = "` + this.config.file.ext + `";

        var innerAlert = function (message) {
            if (console && console.log)
                console.log(message);
        };

        var onReady = function () {
            innerAlert("Document editor ready");
        };

        var onDocumentStateChange = function (event) {
            var title = document.title.replace(\/\\\*\$\/g, "");
            document.title = title + (event.data ? "*" : "");
        };

        var onRequestEditRights = function () {
            location.href = location.href.replace(RegExp("mode=view\\\&?", "i"), "");
        };

        var onRequestHistory = function (event) {
            var historyObj = ` + JSON.stringify(this.config.history) + ` || null;

            docEditor.refreshHistory(
                {
                    currentVersion: "` + this.config.file.version + `",
                    history: historyObj
                });
        };

        var onRequestHistoryData = function (data) {
            var version = data.data;
            var url_arr = "` + this.config.setHistoryData.url + `".split(",");
            var urlDiff_arr = "` + this.config.setHistoryData.urlDiff + `".split(",");

            docEditor.setHistoryData({
                        version: version,
                        url: url_arr[version-1] != "" ? url_arr[version-1]: null,
                        urlDiff: urlDiff_arr[version-1] != "" ? urlDiff_arr[version-1]: null, 
                    });
        };

        var onRequestHistoryClose = function (event){
            document.location.reload();
        };

        var onError = function (event) {
            if (event)
                innerAlert(event.data);
        };

        var connectEditor = function () {

            docEditor = new DocsAPI.DocEditor("iframeEditor",
                {
                    width: "100%",
                    height: "100%",
                    type: "` + this.config.editor.type + `",
                    documentType: "` + this.config.editor.documentType + `",
                    document: {
                        title: fileName,
                        url: "` + this.config.file.uri + `",
                        fileType: fileType,
                        key: "` + this.config.editor.key + `",
                        info: {
                            author: "Me",
                            created: new Date().toDateString()
                        },
                        permissions: {
                            edit: "` + this.config.editor.isEdit + `" == "true",
                            download: true
                        }   
                    },
                    editorConfig: {
                        mode: "` + this.config.editor.mode + `",
                        lang: "` + this.config.editor.lang + `",
                        callbackUrl: "` + this.config.editor.callbackUrl + `",
                        user: {
                            id: "` + this.config.editor.userid + `",
                            firstname: "` + this.config.editor.firstName + `",
                            lastname: "` + this.config.editor.lastName + `"
                        },
                        embedded: {
                            saveUrl: "` + this.config.file.uri + `",
                            embedUrl: "` + this.config.file.uri + `",
                            shareUrl: "` + this.config.file.uri + `",
                            toolbarDocked: "top"
                        },
                        customization: {
                            about: true,
                            chat: true,
                            comments: true,
                            feedback: true,
                            goback: {
                                url: ("` + this.config.editor.type + `"== "embedded" ? null : "` + this.config.editor.getServerUrl + `")
                            }
                        },
                        fileChoiceUrl: "` + this.config.editor.fileChoiceUrl + `",
                        plugins: ` + JSON.stringify(this.config.editor.plugins) + `
                    },
                    events: {
                        "onReady": onReady,
                        "onDocumentStateChange": onDocumentStateChange,
                        'onRequestEditRights': onRequestEditRights,
                        "onError": onError,
                        "onRequestHistory":  onRequestHistory,
                        "onRequestHistoryData": onRequestHistoryData,
                        "onRequestHistoryClose": onRequestHistoryClose
                    }
            });
        };

        if (window.addEventListener) {
            window.addEventListener("load", connectEditor);
        } else if (window.attachEvent) {
            window.attachEvent("load", connectEditor);
        }
`;

    node = document.createElement('script');
    node.type = 'text/javascript';
    node.charset = 'utf-8';
    node.innerText = script;
    document.getElementsByTagName('body')[0].appendChild(node);

     this.go();
  }

  go() {
    try {
      connectEditor();
    } catch (e) {
      setTimeout(this.go, 1000);
    }
  }

  ngOnInit() {
    this.topicId = this.route.snapshot.params['id'];
    this.ooApiService.getUrl('/topic/' + this.topicId + '/exists', {}).toPromise()
      .then(
        this.getOnlyOffice()
      )
      .catch( (error: any) => {
        this.ooApiService.postUrl('/topic', '&topicId=' + this.topicId, {}).toPromise()
          .then(
            this.getOnlyOffice()
          );
      });

    // fetch current user and check permissions
    this.userService.getCurrent().then(
      (response: any) => {
        this.currentUser = <User> response;
      }
    ).catch(
      (error: any) => this.toasterService.pop('error', 'Error fetching current user', error)
    );
  }

  private getOnlyOffice() {
    this.ooApiService.getUrl('/topic/' + this.topicId, {}).toPromise()
      .then(
        (res: any) => {
          console.log(res);
          this.config = JSON.parse(res._body);
          console.log(this.config);
          this.apiUrl = this.config.apiUrl;
          this.loadScript();
          this.loaded = false;
        });
  }

}
