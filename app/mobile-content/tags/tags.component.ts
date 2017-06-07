import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { CreateTagDialogComponent } from './create-tag-dialog/create-tag-dialog.component';
import { DeleteTagDialogComponent } from './delete-tag-dialog/delete-tag-dialog.component';
import { Status } from '../shared/status.model';
import { Tag } from './shared/tag.model';
import { TagService } from './shared/tag.service';
import { TranslateService } from 'ng2-translate';
import { ToasterService } from 'angular2-toaster';

@Component({
  moduleId: module.id,
  selector: 'hip-tags',
  templateUrl: 'tags.component.html',
  styleUrls: ['tags.component.css']
})
export class TagsComponent implements OnInit {
  tags: Tag[];
  statuses = Status.getValuesForSearch();

  // search parameters
  searchQuery = '';
  selectedStatus = '';
  showingSearchResults = false;

  // pagination parameters
  currentPage = 1;
  pageSize = 10;
  totalItems: number;

  private translatedResponse: string;


  private createDialogRef: MdDialogRef<CreateTagDialogComponent>;
  private deleteDialogRef: MdDialogRef<DeleteTagDialogComponent>;

  constructor(private dialog: MdDialog,
              private tagService: TagService,
              private toasterService: ToasterService,
              private translateService: TranslateService) {
  }

  ngOnInit() {
    this.tagService.getAllTags()
      .then(
        (response: any) => {
          this.tags = response;
          this.totalItems = response.length;
        }
      ).catch(
      (error: any) => this.toasterService.pop('error', this.translate('Error fetching tags'), error)
    );
  }

  createTag() {
    this.createDialogRef = this.dialog.open(CreateTagDialogComponent, {width: '45em'});
    this.createDialogRef.afterClosed().subscribe(
      (newTag: Tag) => {
        if (newTag) {
          this.tagService.createTag(newTag)
            .then(
              response => this.toasterService.pop('success', this.translate('tag saved'))
            ).catch(
            error => this.toasterService.pop('error', this.translate('Error while saving'), error)
          );
        }
        this.createDialogRef = null;
      }
    );
  }

  deleteTag(tag: Tag) {
    this.deleteDialogRef = this.dialog.open(DeleteTagDialogComponent);
    this.deleteDialogRef.componentInstance.tag = tag;
    this.deleteDialogRef.afterClosed().subscribe(
      (confirmed: boolean) => {
        if (confirmed) {
          this.tagService.deleteTag(tag.id)
            .then(
              response => this.toasterService.pop('success', this.translate('tag deleted'))
            ).catch(
            error => this.toasterService.pop('error', this.translate('Error while deleting'), error)
          );
        }
        this.deleteDialogRef = null;
      }
    );
  }

  findTags() {
    this.showingSearchResults = true;
    // TODO
  }

  getPage(page: number) {
    this.currentPage = page;
    // TODO: implement pagination
  }

  reloadList() {
    // TODO: implement list reload
  }

  resetSearch() {
    this.showingSearchResults = false;
    // TODO
  }

  private translate(data: string): string {
    this.translateService.get(data).subscribe(
      (value: any) => {
        this.translatedResponse = value as string;
      }
    );
    return this.translatedResponse;
  }

}
