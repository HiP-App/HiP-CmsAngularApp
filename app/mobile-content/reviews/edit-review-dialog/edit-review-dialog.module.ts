import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';
import { NgaModule }    from '../../theme/nga.module';

import { routing }      from './edit-review-dialog.routing';

// This Module's Components
import { EditReviewDialog } from './edit-review-dialog.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgaModule,
        routing
    ],
    declarations: [
        EditReviewDialog
    ],
    exports: [
        EditReviewDialog
    ]
})
export class EditReviewDialogModule {

}
