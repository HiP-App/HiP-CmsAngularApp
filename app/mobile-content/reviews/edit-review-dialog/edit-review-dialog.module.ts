import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';

// This Module's Components
import { EditReviewDialogComponent } from './edit-review-dialog.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        EditReviewDialogComponent
    ],
    exports: [
        EditReviewDialogComponent
    ]
})
export class EditReviewDialogModule {

}
