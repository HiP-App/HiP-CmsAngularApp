import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from 'angular2-toaster';

import 'docsApi';

import { UserService } from '../../core/user/user.service';
import { User } from '../../core/user/user.model';
import { OOApiService } from '../../core/api/oo-api.service';
import { CONFIG } from '../../config.constant';

declare var DocsAPI: any;

declare var window: {
  angularComponentRef: any;
};

function onRequestHistory() {
  window.angularComponentRef.zone.run(() => {
      window.angularComponentRef.onRequestHistory();
    }
  )
}

function onRequestChangeHistoryData(data: any) {
  console.log(data);
  window.angularComponentRef.zone.run(() => {
      window.angularComponentRef.onRequestChangeHistoryData(data);
    }
  )
}

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
    history: [{}],
    setHistoryData: {
      url: '',
      urlDiff: ''
    }
  };
  loaded = true;
  count = 0;

  private docEditor: any = {
    refreshHistory: function () {}
  };

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private toasterService: ToasterService,
              private ooApiService: OOApiService,
              private ngZone: NgZone) {
    window.angularComponentRef = {
      zone: this.ngZone,
      component: this,
      onRequestHistory: () => this.onRequestHistory(),
      onRequestChangeHistoryData: (data: any) => this.onRequestChangeHistoryData(data)
    };
  }

  ngOnInit() {
    this.topicId = this.route.snapshot.params['id'];
    this.ooApiService.getUrl('/topic/' + this.topicId + '/exists', {}).toPromise()
      .then(
        (response: any) =>  this.loadOnlyOffice()
      )
      .catch((error: any) => {
        this.ooApiService.postUrl('/topic', '&topicId=' + this.topicId, {}).toPromise()
          .then(
            (response: any) => this.loadOnlyOffice()
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

  ngOnDestroy() {
    window.angularComponentRef = null;
  }

  onRequestHistory() {
    let historyObj = this.config.history || null;

    this.docEditor.refreshHistory(
      {
        currentVersion: this.config.file.version,
        history: historyObj
      });
  }

  onRequestChangeHistoryData(data: any) {
    let version = data.data;
    let url_arr = this.config.setHistoryData.url;
    let urlDiff_arr = this.config.setHistoryData.urlDiff;

    this.docEditor.setHistoryData({
      version: version,
      url: url_arr[version - 1] != "" ? url_arr[version - 1] : null,
      urlDiff: urlDiff_arr[version - 1] != "" ? urlDiff_arr[version - 1] : null,
    });
  }

  private loadOnlyOffice() {
    this.ooApiService.getUrl('/topic/' + this.topicId, {}).toPromise()
      .then(
        (res: any) => {
          this.config = JSON.parse(res._body);
          this.apiUrl = this.config.apiUrl;
          this.loadEditor();
        });
  }

  private loadEditor() {
    DocsAPI.baseUrl = CONFIG['docsUrl'] + '/web-apps/apps/';

    this.docEditor = new DocsAPI.DocEditor("iframeEditor", {
      width: "100%",
      height: "100%",
      type: this.config.editor.type,
      documentType: this.config.editor.documentType,
      document: {
        title: this.config.file.name,
        url: this.config.file.uri,
        fileType: this.config.file.ext,
        key: this.config.editor.key,
        info: {
          author: "Me",
          created: new Date().toDateString()
        },
        permissions: {
          edit: this.config.editor.isEdit,
          download: true
        }
      },
      editorConfig: {
        mode: this.config.editor.mode,
        lang: this.config.editor.lang,
        callbackUrl: this.config.editor.callbackUrl,
        user: {
          id: this.currentUser.id,
          firstname: this.currentUser.firstName !== '' ? this.currentUser.firstName : this.currentUser.email,
          lastname: this.currentUser.lastName
        },
        embedded: {
          saveUrl: this.config.file.uri,
          embedUrl: this.config.file.uri,
          shareUrl: this.config.file.uri,
          toolbarDocked: "top"
        },
        customization: {
          about: true,
          chat: true,
          comments: true,
          feedback: true,
          goback: {
            url: (this.config.editor.type == "embedded" ? null : this.config.editor.getServerUrl )
          }
        },
        fileChoiceUrl: this.config.editor.fileChoiceUrl,
        plugins: this.config.editor.plugins
      },
      events: {
        "onReady": function () { console.log('Document editor ready') },
        "onDocumentStateChange": function (event: any) {
          var title = document.title.replace(/\*+$/g, ' ');
          document.title = title + (event.data ? '*' : '');
        },
        'onRequestEditRights': function () { location.href = location.href.replace(RegExp('mode=view\&?', 'i'), ''); },
        "onError": function (event: any) { console.log(event.data); },
        "onRequestHistory": onRequestHistory,
        "onRequestHistoryData": onRequestChangeHistoryData,
        "onRequestHistoryClose": function () { document.location.reload(); }
      }
    });

    console.log(this.docEditor);
  }


}
