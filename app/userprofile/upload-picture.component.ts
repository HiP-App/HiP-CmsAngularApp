import { Component, ViewChild } from '@angular/core';
import { UploadFileService } from './upload-file.service'

@Component ({
	selector: 'hip-upload-picture',
	templateUrl: './app/userprofile/upload-picture.component.html',
	providers: [UploadFileService]
})

export class UploadPictureComponent{

	@ViewChild('fileInput') fileInput: any;

	constructor(private uploadFileService: UploadFileService)
	{}

	uploadPicture(): void {
		let fi = this.fileInput.nativeElement;
		if (fi.files && fi.files[0]) {
			let fileToUpload = fi.files[0];
			this.uploadFileService.uploadFile(fileToUpload)
			.subscribe (res => {
				console.log(res);
			});
		}
	}
}

