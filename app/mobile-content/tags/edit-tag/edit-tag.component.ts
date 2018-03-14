import { Component, OnInit, ViewChild} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { ChangeHistoryComponent } from '../../shared/change-history/change-history.component';
import { MediaService } from '../../media/shared/media.service';
import { Medium } from '../../media/shared/medium.model';
import { SelectMediumDialogComponent } from '../../media/select-medium-dialog/select-medium-dialog.component';
import { Status } from '../../shared/status.model';
import { Tag } from '../shared/tag.model';
import { TagService } from '../shared/tag.service';

@Component({
  moduleId: module.id,
  selector: 'hip-tags-edit-dialog',
  styleUrls: ['edit-tag.component.css'],
  templateUrl: 'edit-tag.component.html',
})
export class EditTagComponent implements OnInit {
  tag = Tag.emptyTag();
  statusOptions = Status.getValues();
  private selectedImage: string;
  @ViewChild('autosize') autosize: any ;
  previewURL: SafeUrl;

  private selectDialogRef: MdDialogRef<SelectMediumDialogComponent>;
  private changeHistoryDialogRef: MdDialogRef<ChangeHistoryComponent>;

  constructor(private activatedTag: ActivatedRoute,
              private dialog: MdDialog,
              private mediumService: MediaService,
              private router: Router,
              private sanitizer: DomSanitizer,
              private tagService: TagService,
              private toasterService: ToasterService,
              private translateService: TranslateService) {}

  ngOnInit() {
    let tagId = +this.activatedTag.snapshot.params['id'];
    let context = this;
    this.tagService.getTag(tagId)
      .then(
        response => {
          this.tag = response;
          if (this.tag.image !== null) {
            this.getImageDetails(this.tag.image);
          } else {
            this.selectedImage = this.translate('no image selected');
          }
          setTimeout(function() { context.autosize.resizeToFitContent(); }, 200);
        }
      ).catch(
        error => this.toasterService.pop('error', this.translate('Error fetching tags'), error)
      );
  }

  private getImageDetails(id: number) {
    this.mediumService.getMediaById(id)
      .then(
        (response: any) => {
          this.selectedImage = response.title;
          this.previewImage(response.id);
        }
      ).catch(
        (error: any) => this.toasterService.pop('error', this.translate('Error fetching image'), error)
      );
  }

  editTag(tag: Tag) {
    this.tagService.updateTag(tag)
      .then(
        response => {
          this.toasterService.pop('success', this.translate('tag updated'));
          this.router.navigate(['/mobile-content/tags']);
        }
      ).catch(
        error => this.toasterService.pop('error', this.translate('Error while updating'), error)
      );
  }

  previewImage(id: number) {
    // preview image
    this.mediumService.downloadFile(id, true)
      .then(
        (response: any) => {
          let base64Data: string;
          let reader = new FileReader();
          reader.readAsDataURL(response);
          reader.onloadend = () => {
            base64Data = reader.result;
            this.previewURL = this.sanitizer.bypassSecurityTrustUrl(base64Data);
          };
        }
      );
  }

  selectMedium(type: string) {
    this.selectDialogRef = this.dialog.open(SelectMediumDialogComponent, {width: '75%', data: {type: type}});
    this.selectDialogRef.afterClosed().subscribe(
      (selectedMedium: Medium) => {
        if (selectedMedium) {
          this.tag.image = selectedMedium.id;
          this.selectedImage = selectedMedium.title;
          this.previewImage(this.tag.image);
        }
      }
    );
  }

  private unsetMedium() {
    this.selectedImage = this.translate('no image selected');
    this.tag.image = null;
    this.previewURL = null;
  }

  openHistory() {
    let context = this;
    this.tagService.getHistory(this.tag.id)
      .then(
        (response) => {
          this.changeHistoryDialogRef = this.dialog.open(ChangeHistoryComponent, { width: '60%',
            data: {
              title: context.tag.title,
              data: response
            }
          });
        }
      ).catch(
      (error: any) => {
        this.toasterService.pop('error', this.translate('Error fetching history') , error);
      }
    );
  }

  private translate(data: string): string {
    let translatedResponse: string;
    this.translateService.get(data).subscribe(
      (value: string) => {
        translatedResponse = value;
      }
    );
    return translatedResponse;
  }
}
