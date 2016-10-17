import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../core/auth/auth.service';
import { ToasterService } from 'angular2-toaster';
import { FormGroup } from '@angular/forms';
import { UserService } from '../core/user/user.service';

@Component({
  selector: 'hip-userProfile',
  templateUrl: './app/userprofile/userprofile.component.html',
  styleUrls: ['./app/userprofile/userprofile.component.css']
})
export class ManageUserComponent {

  @ViewChild('fileInput') fileInput: any;

  file_srcs: string[] = []; 
  files: File[] = [];
  fileCount = 0;

  errorMessage: string = '';
  //waitingForResponse = false;

  user = {
    oldPassword: '',
    newPassword: '',
    confirmPass: ''
  };

  fileToUpload: any;

  constructor(private authService: AuthService, private toasterService: ToasterService, private userService: UserService) {
    console.log(this.file_srcs)
  }

  formReset() {
    this.user = {
      oldPassword: '',
      newPassword: '',
      confirmPass: ''
    };
    this.errorMessage = '';
  }

  passwordValid() {
    return this.user.confirmPass.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,}$/);
  }

  changePassword() {
    this.authService.changePassword(this.user.oldPassword, this.user.newPassword, this.user.confirmPass)
    .then(response => {
      this.toasterService.pop('success', 'Success', response);
      this.formReset();
    })
    .catch(error => {
      try {
        this.errorMessage = error.json()[""];
      } catch (e) {}
    });
  }

  uploadPicture(): void {
    let fi = this.fileInput.nativeElement;

    if (fi.files && fi.files[0]) {
      console.log(fi.files[0]);
      this.fileToUpload = fi.files[0];
      this.userService.uploadPicture(this.fileToUpload)
      .then(response => {
        console.log('Image uploaded successfully!')
      })
      .catch(error => {
        try {
          this.errorMessage = error.json()[""];
        } catch (e) {}
      });
    }
  }

  increaseCount()
  {
    this.fileCount = this.file_srcs.length+1;
    console.log(this.fileCount);
  }

  previewImage(fileInput: any){
    for (var i = 0; i < fileInput.files.length; i++) {
      this.files.push(fileInput.files[i]);
      var img = document.createElement("img");
      img.src = window.URL.createObjectURL(fileInput.files[i]);
      var reader: any, target: EventTarget;
      let reader = new FileReader();
      reader.addEventListener("load", (event) => {
        img.src = reader.result;

        // Resize the image
   //     var resized_img = this.resize(img);
        
        this.file_srcs.push(img.src);
      }, false);
      reader.readAsDataURL(fileInput.files[i]);
      this.uploadPicture();
    }

  }

  resize (img: any, MAX_WIDTH:number = 1024, MAX_HEIGHT:number = 1024){
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
        ctx.drawImage(img, 0, 0, width, height);
        var dataUrl = canvas.toDataURL('image/jpeg');  
        console.log("Size After:  " + dataUrl.length  + " bytes");
        return dataUrl
    }

  removePicture(): void {
    this.file_srcs = [];
    console.log("delete file:..");
    this.userService.deletePicture()
    .then(response => {
      console.log('Image deleted successfully!')
    })
    .catch(error => {
      try {
        this.errorMessage = error.json()[""];
      } catch (e) {}
    });
  }
}