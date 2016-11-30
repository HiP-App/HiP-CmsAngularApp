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

  uploadedImage = '';
  previewedImage: any;
  file: File;
  fileToUpload: any;
  userId: string;
  currentUserId: number;
  isUploaded = true;
  isRemoved = true;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    ) {
  }

  ngOnInit() {
    const urls = this.route.snapshot.url;
    const urlSegment = urls.shift();
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
        this.uploadedImage = response.json();
        if(this.uploadedImage)
           this.isRemoved = false;
      })
    .catch(
      (error:any) => this.displayError()
      )
  }

  private uploadPicture(files: File[]) {
    if (files && files[0]) {
      this.fileToUpload = files[0];
      this.userService.uploadPicture(this.fileToUpload, this.userId)
      .then(response => {
        this.isUploaded = true;
        this.isRemoved =  false;
      })
      .catch(this.displayError);
    }
  }

  private chooseImage(files: File[]) {
    this.isUploaded = false;
    this.previewImage(files);
  }

  private previewImage(files: File[]) {
    this.uploadedImage = '';
    this.file = files[0];
    let img = <HTMLImageElement> document.getElementById('previewImage');
    let reader = new FileReader();
    reader.addEventListener('load', (event) => {
      img.src = reader.result;
      this.previewedImage = img.src;
    }, false);
    reader.readAsDataURL(files[0]);
    this.resize(img);
  }

  private resize (img: any, MAX_WIDTH:number = 1000, MAX_HEIGHT:number = 1000) {
    var canvas = document.createElement("canvas");
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
    var dataUrl = canvas.toDataURL('image/jpeg');
    return dataUrl
  }

  private removePicture() {
    this.uploadedImage = '';
    this.previewedImage = '';
    (<HTMLInputElement>document.getElementById('uploadedFile')).value = '';
    this.userService.deletePicture(this.userId)
    .then(
      response => console.log('Image deleted successfully!')
      )
    .catch(
      this.displayError
      );

    this.isRemoved = true;
    this.isUploaded = true;
  }

  private displayError(msg = 'Unknown Error') {
    console.error(msg);
  }
}
