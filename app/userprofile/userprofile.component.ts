<<<<<<< HEAD
import { Component, ViewChild } from '@angular/core';
=======
import { Component, OnInit } from '@angular/core';
>>>>>>> develop
import { AuthService } from '../core/auth/auth.service';
import { ToasterService } from 'angular2-toaster';
import { FormGroup } from '@angular/forms';
import { UserService } from '../core/user/user.service';
<<<<<<< HEAD
=======
import { User } from '../core/user/user.model';
import { CmsApiService } from '../core/api/cms-api.service';

>>>>>>> develop

@Component({
  selector: 'hip-user-profile',
  templateUrl: './app/userprofile/userprofile.component.html',
  styleUrls: ['./app/userprofile/userprofile.component.css']
})
<<<<<<< HEAD
export class ManageUserComponent {

  @ViewChild('fileInput') fileInput: any;

  file_srcs: string[] = []; 
  files: File[] = [];
  fileCount = 0;

=======
export class ManageUserComponent implements OnInit {
>>>>>>> develop
  errorMessage: string = '';
  private currentUser = User.getEmptyUser();
  loggedIn: boolean;
  user = {
    oldPassword: '',
    newPassword: '',
    confirmPass: '',
  };

<<<<<<< HEAD
  fileToUpload: any;

  constructor(private authService: AuthService, private toasterService: ToasterService, private userService: UserService) {
    console.log(this.file_srcs)
=======
  constructor(private userService: UserService,
              private authService: AuthService,
              private toasterService: ToasterService) {
>>>>>>> develop
  }

  formReset() {
    this.user = {
      oldPassword: '',
      newPassword: '',
      confirmPass: ''
    };
    this.errorMessage = '';
  }

  ngOnInit() {
    this.loggedIn = this.authService.isLoggedIn();
    if (this.loggedIn) {
      this.userService.getCurrent().then(
        (data: any) => this.currentUser = <User> data,
        (error: any) => this.errorMessage = <any> error
      );
    }
  }

  passwordValid() {
    return this.user.confirmPass.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,}$/);
  }

  changePassword() {
    this.authService.changePassword(this.user.oldPassword, this.user.newPassword, this.user.confirmPass)
<<<<<<< HEAD
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
=======
      .then((response: any) => {
        this.toasterService.pop('success', 'Success', response);
        this.formReset();
>>>>>>> develop
      })
      .catch((error: any) => {
        try {
          this.errorMessage = error.json()[''];
        } catch (e) {
        }
      });
  }

  updateUserInfo() {
    this.userService.updateUserInfo(this.currentUser.firstName, this.currentUser.lastName)
      .then(response => {
        this.toasterService.pop('success', 'Success', response);
      })
      .catch(error => {
        try {
          this.errorMessage = error.json()[''];
        } catch (e) {
        }
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
    console.log((<HTMLInputElement>document.getElementById("uploadedFile")).value);
    (<HTMLInputElement>document.getElementById("uploadedFile")).value = "";
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