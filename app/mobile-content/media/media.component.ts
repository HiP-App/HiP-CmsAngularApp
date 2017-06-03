import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { DeleteMediumDialogComponent } from './delete-medium-dialog/delete-medium-dialog.component';
import { EditMediumDialogComponent } from './edit-medium-dialog/edit-medium-dialog.component';
import { Medium } from './medium.model';
import { Status } from '../shared/status.model';
import { UploadMediumDialogComponent } from './upload-medium-dialog/upload-medium-dialog.component';

import { MediaService } from './shared/media.service';
import { SearchArgs } from '../shared/searchArgs.model';

@Component({
  moduleId: module.id,
  selector: 'hip-media',
  styleUrls: ['media.component.css'],
  templateUrl: 'media.component.html',
  providers: [ MediaService ]
})
export class MediaComponent implements OnInit {
  media: Medium[];
  statuses = Status.getValuesForSearch();
  types = ['ALL'].concat(Medium.types);

  // search parameters
  searchQuery = '';
  selectedStatus = 'ALL';
  selectedType = 'ALL';
  showingSearchResults = false;

  // pagination parameters
  currentPage = 1;
  pageSize = 10;
  totalItems: number;   // must be fetched from server

  // dialogs
  private deleteDialogRef: MdDialogRef<DeleteMediumDialogComponent>;
  private editDialogRef: MdDialogRef<EditMediumDialogComponent>;
  private uploadDialogRef: MdDialogRef<UploadMediumDialogComponent>;

  constructor(private dialog: MdDialog, private service: MediaService ) {}

  ngOnInit() {
    this.media = new Array(30);
    this.totalItems = this.media.length;
    for (let i = 0; i < this.media.length; i++) {
      this.media[i] = Medium.getRandom();
    }
  }

  addMedium() {
    this.uploadDialogRef = this.dialog.open(UploadMediumDialogComponent, { width: '35em' });
  }

  deleteMedium(medium: Medium) {
    this.deleteDialogRef = this.dialog.open(DeleteMediumDialogComponent);
    this.deleteDialogRef.componentInstance.mediumTitle = medium.title;
    this.deleteDialogRef.afterClosed().subscribe(
      (confirmed: boolean) => {
        if (confirmed) {
          // TODO: implement medium deletion
        }
      }
    );
  }

  editMedium(medium: Medium) {
    this.editDialogRef = this.dialog.open(EditMediumDialogComponent, { width: '30em', data: { medium: medium } });
    this.editDialogRef.afterClosed().subscribe(
      (newMedium: Medium) => {
        if (newMedium) {
          // TODO: save edited medium
        }
      }
    );
  }

  findMedia() {
    // TODO: implement media search
    this.showingSearchResults = true;
  }

  getPage(page: number) {
    this.currentPage = page;

    let args = new SearchArgs();
    args.status = 'ALL';

    let media = new Medium('aaaa', 'asdasdasd' , 'image' , 'PUBLISHED' , false );
        media.id = 8;

    let allMedias;
    let allMediasId;
    let mediaById;
    let postMedia;
    let putMedia;
    let deleteMedia;

    this.service.getAllMedia(args).then(x => {
      allMedias = x;
    });
    this.service.getAllMediaIds('ALL').then(x => {
      allMediasId = x;
    });
    this.service.getMediaById(media.id).then(x => {
      mediaById = x;
    });
    this.service.createMedia(media).then(x =>
    {postMedia = x;
    });
    this.service.updateMedia(media).then((x: any) => {
      putMedia = x.json();
    });
    this.service.deleteMedia(media.id).then(x => {
      deleteMedia = x.json();
    });

    let aaa = 'asdasdasd';



  //  let typeAnd =  mediasArray.then(x => x.items[0].constructor.name);

  }

  reloadList() {
    // TODO: implement list reload
  }

  resetSearch() {
    this.showingSearchResults = false;
    this.searchQuery = '';
  }
}
