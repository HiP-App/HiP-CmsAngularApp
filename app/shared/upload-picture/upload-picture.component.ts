import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from 'angular2-toaster';

import { UserService } from '../../users/user.service';

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

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private toasterService: ToasterService) {}

  ngOnInit(): void {
    const urls = this.route.snapshot.url;
    const urlSegment = urls.shift();
    // the user is in the admin view if the url starts with 'admin':
    if (urlSegment.path === 'edit-user') {
      // get the user id from the last part of the url:
      this.userId = urls.pop().path;
    }

    this.userService.getPicture(this.userId, this.userId === undefined)
      .then(
        (response: any) => {
          if (response.status === 200) {
            this.uploadedImage = response.json().base64;
            if (this.uploadedImage) {
              this.isRemoved = false;
              this.isChosen = true;
            }
          }
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
            this.isRemoved =  false;
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
    this.previewImage(files);
  }

  previewImage(files: File[]): void {
    this.uploadedImage = '';
    this.file = files[0];
    let img = this.previewImageFile;
    let reader = new FileReader();

    reader.addEventListener('load', (event) => {
      img.src = reader.result;
      this.previewedImage = img.src;
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
