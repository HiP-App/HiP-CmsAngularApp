import {
  Component,
  OnInit,
  ViewChild,
  Sanitizer,
  SecurityContext
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
    private _sanitizer: Sanitizer
    ) {
    this.currentUser = User.getEmptyUser();
  }

  ngOnInit(): void {
    if(this.file_src!='')
    {
      this.userService.getPicture()
      .then(
      (response:any) => {
        console.log(response);
        this.file_src = response.json();
        this.file_src = this._sanitizer.sanitize(SecurityContext.URL, `data:image/png;base64,${this.file_src}`);
      }
      )
      .catch(
      (error:any) => {
        this.displayError();
      }
      )
    }
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
