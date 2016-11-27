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
  file: File;
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
    console.log(urlSegment)
    // the user is in the admin view if the url starts with 'admin':
    if (urlSegment.path === 'edit-user') {
      // get the user id from the last part of the url:
      this.userId = urls.pop().path;
    } else {
      this.userId = 'Current';
    }

    this.userService.getPicture(this.userId)
    .then(
      (response:any) => {
        this.file_src = response.json();
        if(this.file_src)
           this.isRemoved = false;
      })
    .catch(
      (error:any) => this.displayError()
      )
  }

  uploadPicture(files: File[]): void {
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

  chooseImage(files: File[]): void {
    this.isUploaded = false;
    this.previewImage(files);
  }

  previewImage(files: File[]): void {
    this.file = files[0];
    let img = <HTMLImageElement> document.getElementById('uploadPicture');
    let reader = new FileReader();
    reader.addEventListener('load', (event) => {
      img.src = reader.result;
      this.file_src = img.src;
    }, false);
    reader.readAsDataURL(files[0]);
    this.resize(img);
  }

  resize (img: any, MAX_WIDTH:number = 1000, MAX_HEIGHT:number = 1000){
    console.log(img)
    var canvas = document.createElement("canvas");
    console.log("Size Before: " + img.src.length + " bytes");
    var width = img.width;
    var height = img.height;
    if (width > height) {
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width *= MAX_HEIGHT / height;
        height = MAX_HEIGHT;
      }
    }
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");
    // ctx.drawImage(img, 0, 0, width, height);
    var dataUrl = canvas.toDataURL('image/jpeg');
    console.log("Size After:  " + dataUrl.length  + " bytes");
    return dataUrl
  }

  removePicture(): void {
    this.file_src = '';
    console.log((<HTMLInputElement>document.getElementById('uploadedFile')).value);
    (<HTMLInputElement>document.getElementById('uploadedFile')).value = '';
    console.log('delete file:..');
    this.userService.deletePicture(this.userId)
    .then(
      response => console.log('Image deleted successfully!')
      )
    .catch(
      this.displayError
      );

    this.isRemoved = true;
    this.isUploaded = false;
  }

  displayError(msg = 'Unknown Error'): void {
    console.error(msg);
  }
}
