import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { AuthServiceComponent } from '../../../authentication/auth.service';
import { UserService } from '../../user.service';
import { User } from '../../user.model';
import { UploadPictureDialogComponent } from '../upload-picture-dialog/upload-picture-dialog.component';

@Component({
  moduleId: module.id,
  selector: 'hip-user-profile-card',
  templateUrl: 'user-profile-card.component.html',
  styleUrls: ['user-profile-card.component.css']
})
export class UserProfileCardComponent implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  @ViewChild('previewImageFile') previewImageFile: any;

  errorMessage = '';
  uploadedImage = '';
  previewedImage: any;
  file: File;
  fileToUpload: any;
  userId: string;
  isUploaded = true;
  isRemoved = true;
  isChosen = false;
  uploadProgress = false;

  private currentUser = User.getEmptyUser();
  loggedIn: boolean;

  private uploadDialogRef: MdDialogRef<UploadPictureDialogComponent>;

  user = {
    oldPassword: '',
    newPassword: '',
    confirmPass: '',
  };

  constructor(private authService: AuthServiceComponent,
              private dialog: MdDialog,
              private route: ActivatedRoute,
              private userService: UserService,
              private toasterService: ToasterService,
              private translateService: TranslateService) {}

  ngOnInit(): void {
    this.loggedIn = this.authService.isLoggedIn();
    if (this.loggedIn) {
      this.userService.getCurrent().then(
        (data: any) => this.currentUser = <User> data,
        (error: any) => this.errorMessage = <any> error
      );
    }

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

  passwordValid() {
    return this.user.confirmPass.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,}$/);
  }

  updateUserInfo() {
    this.userService.updateUser(this.currentUser, true)
      .then(
        (response: any) => {
          this.toasterService.pop('success', this.getTranslatedString('Information successfully updated'));
        }
      ).catch(
        (error: any) => {
          try {
            this.errorMessage = error;
          } catch (e) {
            console.error(e);
          }
        }
      );
  }

  openUploadDialog() {
    let context = this;
    this.uploadDialogRef = this.dialog.open(UploadPictureDialogComponent, { width: '45em' });
    this.uploadDialogRef.afterClosed().subscribe(
      (files: File[]) => {
        this.uploadDialogRef = null;
        this.uploadPicture(files);
      }
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
            this.previewedImage(files);
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

  getTranslatedString(data: any) {
    let translatedResponse = '';
    this.translateService.get(data).subscribe(
      (value: string) => {
        translatedResponse = value;
      }
    );
    return translatedResponse;
  }
}
