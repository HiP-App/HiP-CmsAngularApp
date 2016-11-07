import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../../core/user/user.service';
import { User } from '../../core/user/user.model';

@Component({
  selector: 'hip-upload-picture',
  templateUrl: './app/shared/upload-picture/upload-picture.component.html',
  styleUrls: [
    './app/userprofile/userprofile.component.css',
    './app/shared/upload-picture/upload-picture.component.css'
  ]
})
export class UploadPictureComponent implements OnInit {

  @ViewChild('fileInput') fileInput: any;

  file_src = '';
  file: Blob;
  fileToUpload: any;
  userId: string;
  currentUser: User;
  currentUserId: number;
  isUploaded = true;
  isRemoved = true;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    ) {
    this.currentUser = User.getEmptyUser();
  }

  ngOnInit(): void {
    const urls = this.route.snapshot.url;
    const urlSegment = urls.shift();
    // the user is in the admin view if the url starts with 'admin':
    if (urlSegment.path === 'admin') {
      // get the user id from the last part of the url:
      this.userId = urls.pop().path;
    } else {
      this.userId = 'Current';
    }

    this.userService.getPicture()
      .then(response => {
        const blob = new Blob( [ response._data ], { type: 'image/jpeg' } );
        this.previewImage([blob]);
      })
      .catch(this.displayError);
  }

  uploadPicture(files: Array<Blob>): void {

    if (files && files[0]) {
      this.fileToUpload = files[0];
      this.userService.uploadPicture(this.fileToUpload, this.userId)
      .then(response => {
        this.isUploaded = true;
        this.isRemoved =  false;
      })
      .catch(this.displayError);
      this.previewImage(files);
    }
  }

  chooseImage(files: Array<Blob>): void {
    this.isUploaded = false;
    this.previewImage(files);
  }

  previewImage(files: Array<Blob>): void {
    for (let i = 0; i < files.length; i++) {
      this.file = files[i];
      let img = <HTMLImageElement> document.getElementById('uploadPicture');
      let reader = new FileReader();
      reader.addEventListener('load', (event) => {
        img.src = reader.result;
        this.file_src = img.src;
      }, false);
      reader.readAsDataURL(files[i]);
    }
  }

  removePicture(): void {
    this.file_src = '';
    console.log((<HTMLInputElement>document.getElementById('uploadedFile')).value);
    (<HTMLInputElement>document.getElementById('uploadedFile')).value = '';
    console.log('delete file:..');
    this.userService.deletePicture(this.userId)
    .then(response => console.log('Image deleted successfully!'))
    .catch(this.displayError);

    this.isRemoved = true;
    this.isUploaded = false;
  }

  displayError(msg = 'Unknown Error'): void {
    console.error(msg);
  }
}
