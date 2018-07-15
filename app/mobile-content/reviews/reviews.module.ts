import { TagService } from './../../tag-management/tag.service';
// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { ReviewsComponent } from './reviews.component';

@NgModule({
    imports: [
        TagService
    ],
    declarations: [
        ReviewsComponent,
        TagService
    ],
    exports: [
        ReviewsComponent,
        TagService
    ],
    providers: [
        TagService
    ]
})
export class ReviewsModule {

}
