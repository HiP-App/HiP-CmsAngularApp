import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { CreateExhibitDialogComponent } from './create-exhibit-dialog/create-exhibit-dialog.component';
import { DeleteExhibitDialogComponent } from './delete-exhibit-dialog/delete-exhibit-dialog.component';
import { Exhibit } from './shared/exhibit.model';
import { Status } from '../shared/status.model';

@Component({
  moduleId: module.id,
  selector: 'hip-exhibits',
  styleUrls: ['exhibits.component.css'],
  templateUrl: 'exhibits.component.html'
})
export class ExhibitsComponent implements OnInit {
  exhibits: Exhibit[];
  routes: string[];
  statuses = Status.getStatusValues();

  // search parameters
  searchQuery = '';
  selectedRoute = '';
  selectedStatus = '';
  showingSearchResults = false;

  // pagination parameters
  currentPage = 1;
  pageSize = 10;
  totalItems: number;   // must be fetched from server

  // dialogs
  private createDialogRef: MdDialogRef<CreateExhibitDialogComponent>;
  private deleteDialogRef: MdDialogRef<DeleteExhibitDialogComponent>;

  constructor(private dialog: MdDialog) {}

  ngOnInit() {
    // TODO: replace dummy data with appropriate API calls
    this.exhibits = new Array(30);
    this.totalItems = this.exhibits.length;
    for (let i = 0; i < this.exhibits.length; i++) {
      this.exhibits[i] = Exhibit.getRandom();
    }
    this.routes = ['All Routes', 'Route 1', 'Route 2', 'Route 3', 'Route 4'];
  }

  createExhibit() {
    this.createDialogRef = this.dialog.open(CreateExhibitDialogComponent, { width: '35em', height: '22em' });
    this.createDialogRef.afterClosed().subscribe(
      (newExhibit: Exhibit) => {
        if (newExhibit) {
          // TODO: handle exhibit creation
        }
      }
    );
  }

  deleteExhibit(exhibit: Exhibit) {
    this.deleteDialogRef = this.dialog.open(DeleteExhibitDialogComponent, { width: '25em', height: '15em'});
    this.deleteDialogRef.componentInstance.exhibitName = exhibit.name;
    this.deleteDialogRef.afterClosed().subscribe(
      (confirmed: boolean) => {
        if (confirmed) {
          // TODO: implement exhibit deletion
        }
      }
    );
  }

  findExhibits() {
    this.showingSearchResults = true;
    // TODO: implement search
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
    // TODO: implement search reset
  }
}
