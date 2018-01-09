import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from 'angular2-toaster';

import { UserService } from '../../user.service';
import { AuthServiceComponent } from '../../../authentication/auth.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  moduleId: module.id,
  selector: 'hip-upload-picture',
  templateUrl: 'upload-picture.component.html',
  styleUrls: ['upload-picture.component.css']
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
  loggedIn: boolean;
  previewURL: SafeUrl;

  constructor(private route: ActivatedRoute,
    private userService: UserService,
    private toasterService: ToasterService,
    private authService: AuthServiceComponent,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {

    let id = decodeURI(this.route.snapshot.params['id']);
    this.userId = id;
    this.previewImage(this.userId);
  }

  previewImage(id: string) {
    this.userService.getPicture(this.userId)
      .then(
      (response: any) => {
        let base64Data: string;
        let reader = new FileReader();
        reader.readAsDataURL(response);
        reader.onloadend = () => {
          base64Data = reader.result;
          this.previewURL = this.sanitizer.bypassSecurityTrustUrl(base64Data);
          this.previewedImage = this.previewURL;
          this.isRemoved = false;
          this.isChosen = true;
        };
      }
      ).catch(
      (error: any) => console.error(error)
      );
  }

  uploadPicture(files: File[]): void {
    this.isUploaded = true;
    this.uploadProgress = true;
    if (files && files[0]) {
      this.fileToUpload = files[0];
      this.userService.uploadPicture(this.fileToUpload, this.userId)
        .then(
        (response: any) => {
          this.handleResponse('Picture uploaded successfully');
          this.isRemoved = false;
          this.isChosen = true;
          this.uploadProgress = false;
        }
        ).catch(
        (error: any) => this.handleError(error)
        );
    }
  }

  chooseImage(files: File[]): void {
    this.isUploaded = false;
    this.file = files[0];
    let img = this.previewImageFile;
    let reader = new FileReader();
    reader.addEventListener('load', (event) => {
      img.src = reader.result;
      this.uploadedImage = img.src;
    }, false);
    reader.readAsDataURL(files[0]);
    this.resize(img);
  }

  resize(img: any, MAX_WIDTH = 1000, MAX_HEIGHT = 1000) {
    let canvas = document.createElement('canvas');
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
    return canvas.toDataURL('image/jpeg');
  }

  removePicture(fileInput: HTMLInputElement): void {
    this.uploadedImage = '';
    this.previewedImage = '';
    fileInput.value = null;
    this.isChosen = false;
    this.userService.deletePicture(this.userId)
      .then(
      (response: any) => this.handleResponse('Picture removed successfully')
      ).catch(
      (error: any) => this.handleError(error)
      );
    this.isRemoved = true;
    this.isUploaded = true;
  }

  private handleResponse(msg: string) {
    this.toasterService.pop('success', msg);
  }

  private handleError(error: any) {
    this.toasterService.pop('error', 'Error while uploading picture', error);
  }
}
