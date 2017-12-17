import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { AchievementService } from '../shared/achievement.service';
import { Achievement } from '../shared/achievement.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TranslateService } from 'ng2-translate';





@Component({
 moduleId: module.id,
 selector: 'hip-upload-image',
 templateUrl: 'upload-image.component.html',
 styleUrls: ['upload-image.component.css']
})
export class UploadImageComponent implements OnInit {

  acceptedTypes = '';
  file: File;
  previewURL: string;

 @ViewChild('autosize') autosize: any;
 @ViewChild('previewImageFile') previewImageFile: any;
 @ViewChild('fileInput') fileInput;

 constructor(private achievementService: AchievementService,
  private translateService: TranslateService,
  private activatedExhibit: ActivatedRoute,
  private toasterService: ToasterService) { }

 ngOnInit() {
  // let context = this;
  // this.id = +this.activatedExhibit.snapshot.params['id'];
  // this.achievementService.getAchievement(this.id)
  //   .then(
  //   (response: Achievement) => {
  //     this.achievement = response;
  //     setTimeout(function () { context.autosize.resizeToFitContent(); }, 250);
  //   }
  //   ).catch(
  //   (error: any) => {
  //     this.toasterService.pop('error', this.getTranslatedString('Error fetching Achievement'), error);
  //   }
  //   );
}

  private setAcceptedTypes() {
    if (this.file) {
      this.acceptedTypes = '.jpg,.jpeg,.png';
    } else {
      this.acceptedTypes = '';
    }
  }

  public chooseFile(event: any) {
    this.file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewURL = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }


// chooseImage(files: File[]): void {
//   this.isUploaded = false;
//   this.previewImage(files);
// }

// previewImage(files: File[]): void {
//   this.uploadedImage = '';
//   this.file = files[0];
//   let img = this.previewImageFile;
//   let reader = new FileReader();

//   reader.addEventListener('load', (event) => {
//     img.src = reader.result;
//     this.previewedImage = img.src;
//   }, false);
//   reader.readAsDataURL(files[0]);
//   this.resize(img);
// }

// resize(img: any, MAX_WIDTH = 1000, MAX_HEIGHT = 1000) {
//   let canvas = document.createElement('canvas');
//   let width = img.width;
//   let height = img.height;
//   if (width > height) {
//     if (width > MAX_WIDTH) {
//       height *= MAX_WIDTH / width;
//       width = MAX_WIDTH;
//     }
//   } else {
//     if (height > MAX_HEIGHT) {
//       width *= MAX_HEIGHT / height;
//       height = MAX_HEIGHT;
//     }
//   }
//   canvas.width = width;
//   canvas.height = height;
//   return canvas.toDataURL('image/jpeg');
// }


//  private handleResponse(msg: string) {
//   this.toasterService.pop('success', msg);
//  }

//  private handleError(error: any) {
//   this.toasterService.pop('error', 'Error while uploading picture', error);
//  }

//  private translate(data: string): string {
//   let translatedResponse: string;
//   this.translateService.get(data).subscribe(
//     (value: string) => {
//       translatedResponse = value;
//     }
//   );
//   return translatedResponse;
// }

// getTranslatedString(data: any) {
//   let translatedResponse: string;
//   this.translateService.get(data).subscribe(
//     (value: string) => {
//       translatedResponse = value;
//     }
//   );
//   return translatedResponse;
// }

}
