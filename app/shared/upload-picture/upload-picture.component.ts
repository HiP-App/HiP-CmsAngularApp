import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../../core/user/user.service';
import { ToasterService } from 'angular2-toaster';
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
  @ViewChild('previewImageFile') previewImageFile: any;

  uploadedImage = '';
  previewedImage: any;
  file: File;
  fileToUpload: any;
  userId: string;
  isUploaded = true;
  isRemoved = true;
  isChosen = false;
  uploadProgress = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private toasterService: ToasterService,
    ) {
  }

  ngOnInit(): void {
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
        if(response.status === 200) {
          this.uploadedImage = response.json();
          if(this.uploadedImage) {  
            this.isRemoved = false;
            this.isChosen = true;
          }
        }
      })
    .catch(
      (error:any) => (console.log(error))
      )
  }

  uploadPicture(files: File[]): void {
    this.isUploaded = true;
    this.uploadProgress = true
    if (files && files[0]) {
      this.fileToUpload = files[0];
      this.userService.uploadPicture(this.fileToUpload, this.userId)
      .then(
        (response:any) => {
        this.handleResponse('Picture uploaded successfully');
        this.isRemoved =  false;
        this.isChosen = true;
        this.uploadProgress = false;
      })
      .catch(
        (error:any) => this.handleError(error)
        );
    }
  }

  chooseImage(files: File[]): void {
    this.isUploaded = false;
    this.previewImage(files);
  }

  previewImage(files: File[]): void {
    this.uploadedImage = '';
    this.file = files[0];
    let img = this.previewImageFile
    let reader = new FileReader();

    reader.addEventListener('load', (event) => {
      img.src = reader.result;
      this.previewedImage = img.src;
    }, false);
    reader.readAsDataURL(files[0]);
    this.resize(img);
  }

  resize (img: any, MAX_WIDTH:number = 1000, MAX_HEIGHT:number = 1000) {
    let canvas = document.createElement("canvas");
    let width = img.width;
    let height = img.height;
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
    let dataUrl = canvas.toDataURL('image/jpeg');
    return dataUrl
  }

  removePicture(): void {
    this.uploadedImage = '';
    this.previewedImage = '';
    this.fileInput = '';
    (<HTMLElement>document.getElementById('uploadedFile')).value = '';
    this.isChosen = false;
    this.userService.deletePicture(this.userId)
    .then(
      (response: any) => this.handleResponse('Picture removed successfully')
      )
    .catch(
      (error:any) => this.handleError(error)
      );

    this.isRemoved = true;
    this.isUploaded = true;
  }

  private handleResponse(msg: string) {
    this.toasterService.pop('success', 'Success', msg);
  }

  private handleError(error: any) {
    this.toasterService.pop('error', 'Error while uploading picture', error);
  }
}
