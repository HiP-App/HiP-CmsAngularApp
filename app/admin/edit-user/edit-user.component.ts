import { Component } from '@angular/core';

@Component({
  styleUrls: [ '../app/admin/edit-user/edit-user.component.css' ],
  templateUrl: '../app/admin/edit-user/edit-user.component.html'
})
export class EditUserComponent {
  user = {
    name: 'Krasemann',
    firstName: 'Janis',
    email: 'janiskra@mail.uni-paderborn.de',
    role: '1'
  };
  roles = [ '1', '2', '3' ];
}
