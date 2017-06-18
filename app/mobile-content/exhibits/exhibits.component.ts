import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { CreateExhibitDialogComponent } from './create-exhibit-dialog/create-exhibit-dialog.component';
import { DeleteExhibitDialogComponent } from './delete-exhibit-dialog/delete-exhibit-dialog.component';
import { Exhibit } from './shared/exhibit.model';
import { Status, statusType } from '../shared/status.model';
import { ExhibitService } from './shared/exhibit.service';


import { ToasterService } from 'angular2-toaster';
import { Router } from '@angular/router';
import { TranslateService } from 'ng2-translate';

@Component({
  moduleId: module.id,
  selector: 'hip-exhibits',
  styleUrls: ['exhibits.component.css'],
  templateUrl: 'exhibits.component.html'
})
export class ExhibitsComponent implements OnInit {
  exhibits: Exhibit[];
  routes: string[];
  statuses = Status.getValuesForSearch();
  private translatedResponse: string;
  private exhibitCache = new Map<number, Exhibit[]>();


  // search parameters
  searchQuery = '';
  selectedStatus = 'ALL';
  showingSearchResults = false;

  // pagination parameters
  exhibitsPerPage = 10;
  currentPage = 1;
  totalItems: number;

  // dialogs
  private createDialogRef: MdDialogRef<CreateExhibitDialogComponent>;
  private deleteDialogRef: MdDialogRef<DeleteExhibitDialogComponent>;

  constructor(private dialog: MdDialog,
    private exhibitService: ExhibitService,
    public  router: Router,
    private toasterService: ToasterService,
    private translateService: TranslateService) {}

    ngOnInit() {
      this.getPage(1);
    }

    createExhibit() {
      let context = this;
      this.createDialogRef = this.dialog.open(CreateExhibitDialogComponent, { width: '45em' });
      this.createDialogRef.afterClosed().subscribe(
        (newExhibit: Exhibit) => {
          if (newExhibit) {
            this.exhibitService.createExhibit(newExhibit)
            .then(
              response => {this.toasterService.pop('success', this.translate('exhibit saved'));
              setTimeout(function(){
                context.reloadList();
              }, 1000);
            }
          ).catch(
            error => this.toasterService.pop('error', this.translate('Error while saving'), error)
          );
        }
        this.createDialogRef = null;
      }
    );
  }

  getPage(page: number) {
    if (this.exhibitCache.has(page)) {
      this.exhibits = this.exhibitCache.get(page);
      this.currentPage = page;
    } else {
      this.exhibitService.getAllExhibits(page, this.exhibitsPerPage, this.selectedStatus, this.searchQuery )
      .then(
        data => {
          this.exhibits = data.items;
          this.totalItems = data.total;
          this.currentPage = page;
          this.exhibitCache.set(this.currentPage, this.exhibits);
        }
      ).catch(
        error => console.error(error)
      );
    }
  }

  deleteExhibit(exhibit: Exhibit) {
    let context = this;
    this.deleteDialogRef = this.dialog.open(DeleteExhibitDialogComponent);
    this.deleteDialogRef.componentInstance.exhibit = exhibit;
    this.deleteDialogRef.afterClosed().subscribe(
      (confirmed: boolean) => {
        if (confirmed) {
          this.exhibitService.deleteExhibit(exhibit.id)
          .then(
            response => {this.toasterService.pop('success', 'Success', exhibit.name + ' - ' + this.translate('Exhibit deleted'));
            setTimeout(function(){
              context.reloadList();
            }, 1000); }
          ).catch(
            error => this.toasterService.pop('error', this.translate('Error while saving'), error)
          );
        }
      }
    );
  }

  findExhibits() {
    if (this.searchQuery.trim().length > 0) {
      this.exhibits = undefined;
      this.exhibitCache.clear();
      this.getPage(1);
      this.showingSearchResults = true;
    }
  }

  reloadList() {
    this.exhibits = undefined;
    this.exhibitCache.clear();
    this.getPage(1);
  }

  resetSearch() {
    this.searchQuery = '';
    this.exhibits = undefined;
    this.exhibitCache.clear();
    this.getPage(1);
    this.showingSearchResults = false;
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
