import { Component, ViewChild } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { FormGroup } from '@angular/forms';
import { UserService } from '../../core/user/user.service';

@Component({
  selector: 'hip-upload-picture',
  templateUrl: './app/shared/upload-picture/upload-picture.component.html',
  styleUrls: ['./app/userprofile/userprofile.component.css']
})
export class UploadPictureComponent {

  @ViewChild('fileInput') fileInput: any;

  file_srcs: string[] = []; 
  files: File[] = [];
  fileCount = 0;
  fileToUpload: any;

  constructor(private toasterService: ToasterService, private userService: UserService) {
    console.log(this.file_srcs)
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