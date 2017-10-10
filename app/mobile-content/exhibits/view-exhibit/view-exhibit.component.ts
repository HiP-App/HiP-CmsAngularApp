import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';

import { Exhibit } from '../shared/exhibit.model';
import { ExhibitService } from '../shared/exhibit.service';
import { MobilePage } from '../../pages/shared/mobile-page.model';
import { MobilePageService } from '../../pages/shared/mobile-page.service';
import { TagService } from '../../tags/shared/tag.service';
import { MediaService } from '../../media/shared/media.service';
import { Tag } from '../../tags/shared/tag.model';

@Component({
    moduleId: module.id,
    selector: 'view-exhibit',
    templateUrl: 'view-exhibit.component.html',
    styleUrls: ['view-exhibit.component.css']
})

export class ViewExhibitComponent implements OnInit {

    id: number;
    exhibit: Exhibit;
    mobilePages: MobilePage[] = [];
    tags: Tag[] = [];
    imageUrl: SafeUrl;
    mobilePageImageUrls: SafeUrl[] = [];
    mobilePageImageMap: Map<MobilePage, SafeUrl> = new Map<MobilePage, SafeUrl>();

    constructor(
        private route: ActivatedRoute,
        private domSanitizer: DomSanitizer,
        private toasterService: ToasterService,
        private translateService: TranslateService,
        private exhibitService: ExhibitService,
        private mobilePageService: MobilePageService,
        private tagService: TagService,
        private mediaService: MediaService
    ) { }

    ngOnInit() {
        this.getId();
    }

    private getId() {
        this.route.params
            .subscribe(params => {
                this.id = +params['id'];
                this.getExhibit();
            });
    }

    private getExhibit() {
        this.exhibitService
            .getExhibit(this.id)
            .then((exhibit: Exhibit) => {
                this.exhibit = exhibit;
                this.getTags();
                this.getImage();
                this.getMobilePages();
            })
            .catch((error: any) => {
                this.toasterService.pop('error', this.translate('Error fetching exhibit'), error);
            });
    }

    private getTags() {
        for (let tagId of this.exhibit.tags) {
            this.tagService
                .getTag(tagId)
                .then(tag => this.tags.push(tag))
                .catch((error: any) => {
                    this.toasterService.pop('error', this.translate('Error fetching tags'), error);
                });
        }
    }

    private getImage() {
        this.mediaService.downloadFile(this.exhibit.image, true)
            .then(response => {
                let reader = new FileReader();
                reader.readAsDataURL(response);
                reader.onloadend = () => {
                    this.imageUrl = this.domSanitizer.bypassSecurityTrustUrl(reader.result);
                };
            });
    }

    private getMobilePages() {
        this.mobilePageService
            .getAllPagesFor(this.exhibit.id)
            .then((mobilePages: MobilePage[]) => this.mobilePages = mobilePages)
            .catch((error: any) => {
                this.toasterService.pop('error', this.translate('error fetching pages'), error);
            });
    }

    private getMobilePageImages() {
        this.mobilePages.forEach(mobilePage => {
            if (mobilePage.image != null) {
                this.mediaService.downloadFile(mobilePage.image, true)
                .then(response => {
                    let reader = new FileReader();
                    reader.readAsDataURL(response);
                    reader.onloadend = () => {
                        this.mobilePageImageUrls.push(this.domSanitizer.bypassSecurityTrustUrl(reader.result));
                    };
                });
            } else {
                this.mobilePageImageUrls.push(null);
            }
        });
    }

    private translate(data: string): string {
        let translatedResponse: string;
        this.translateService.get(data).subscribe(
            (value: string) => {
                translatedResponse = value;
            }
        );
        return translatedResponse;
    }
}
