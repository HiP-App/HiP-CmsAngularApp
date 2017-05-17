import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ContentStatus } from '../../shared/content-status.model';
import { Exhibit } from '../shared/exhibit.model';

@Component({
  moduleId: module.id,
  selector: 'hip-edit-exhibit',
  styleUrls: ['edit-exhibit.component.css'],
  templateUrl: 'edit-exhibit.component.html'
})
export class EditExhibitComponent implements OnInit {
  exhibit = Exhibit.getRandom();
  id: number;
  statusOptions = ContentStatus.values;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.id = +this.route.snapshot.params['id'];
    // TODO: fetch exhibit from server by id
  }
}
