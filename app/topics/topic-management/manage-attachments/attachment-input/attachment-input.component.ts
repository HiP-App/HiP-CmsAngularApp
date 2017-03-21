import { Component, Input } from '@angular/core';

import { Attachment } from './../attachment.model';

@Component({
  moduleId: module.id,
  selector: 'hip-attachment-input',
  templateUrl: 'attachment-input.component.html',
  styleUrls: ['attachment-input.component.css']
})
export class AttachmentInputComponent {
  @Input() attachment: Attachment;

  attachmentTypes = Attachment.attachmentTypes;
  attachmentSubTypes: string[] = [];
  units = Attachment.units;

  /**
   * Triggered if the type changed.
   */
  private typeChanged() {
    this.attachment.checkConsistency();
    this.attachmentSubTypes = this.attachment.getOptionsForSubType();
  }

}
