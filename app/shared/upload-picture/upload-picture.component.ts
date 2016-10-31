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
  styleUrls: ['./app/userprofile/userprofile.component.css']
})
export class UploadPictureComponent implements OnInit {

  @ViewChild('fileInput') fileInput: any;

  file_srcs: string[] = [];
  files: Blob[] = [];
  fileCount = 0;
  fileToUpload: any;
  userId: string;
  currentUser: User;
  currentUserId: number;
  isUpload = false;
  isRemoved = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private toasterService: ToasterService
    ) {
    this.currentUser = User.getEmptyUser();
  }

  ngOnInit(): void {
    const urls = this.route.snapshot.url;
    const urlSegment = urls.shift();
    // the user is in the admin view if the url starts with 'admin':
    if (urlSegment.path === 'admin') {
      // get the user id from the last part of the url:
      this.userId = urls.pop().path;
    } else {
      this.userId = 'Current';
    }

    this.userService.getPicture()
    .then(response => {
      const blob = new Blob( [ response ], { type: 'image/jpeg' } );
      this.previewImage([blob]);
    })
    .catch(this.displayError);
  }

  uploadPicture(files: Array<Blob>): void {

    if (files && files[0]) {
      this.fileToUpload = files[0];
      this.userService.uploadPicture(this.fileToUpload, this.userId)
      .then(response => console.log('Image uploaded successfully!'))
      .catch(this.displayError);
      this.previewImage(files);
    }
  }

  increaseCount()
  {
    this.fileCount = this.file_srcs.length+1;
    this.isUpload = false;
    this.isRemoved =  false;
    console.log(this.fileCount);
  }

  previewImage(files: Array<Blob>){
    for (var i = 0; i < files.length; i++) {
      this.files.push(files[i]);
      var img = document.createElement("img");
      img.src = window.URL.createObjectURL(files[i]);
      let reader = new FileReader();
      reader.addEventListener("load", (event) => {
        img.src = reader.result;

        this.file_srcs.push(img.src);
      }, false);
      reader.readAsDataURL(files[i]);
      this.isUpload = true;
    }
  }

  resize (img: any, MAX_WIDTH = 1024, MAX_HEIGHT = 1024){
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
    this.userService.deletePicture(this.userId)
    .then(response => console.log('Image deleted successfully!'))
    .catch(this.displayError);

    this.isRemoved =  true;
  }

  displayError(msg = 'Unknown Error'): void {
    console.error(msg);
  }
}
