import { Component, Input, OnChanges, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, MdDialog  } from '@angular/material';
import { ChangeHistoryDetailedComponent } from '../shared/change-history/change-history-detailed/change-history-detailed.component';

@Component({
    selector: 'readmore',
    templateUrl: 'readmore.component.html',
    styleUrls: ['readmore.component.css']
})
export class ReadMoreComponent implements OnChanges {
    @Input() change: any;
    text: string;
    fullText = true;
    showMore = false;
    showLess = false;
    rmTextShort = '';
    rmTextFull = '';
    popup = false;
    minLength = 30;
    lengthExtraLong = 60;

    private changeHistoryDetailedDialogRef: MdDialogRef<ChangeHistoryDetailedComponent>;

    constructor(@Inject(MD_DIALOG_DATA) public data, private dialog: MdDialog) {

    }

    readMore(flag) {
      if (flag) {
        if (this.popup) {
          this.openHistory();
        } else {
          this.showMore = false;
          this.fullText = true;
          this.rmTextFull = this.text;
          this.showLess = true;
        }
      } else {
          this.showLess = false;
          this.showMore = true;
          this.fullText = false;
      }
    }

    ngOnChanges () {

      if (typeof this.change.value !== 'undefined') {
        this.text = this.castToString(this.change.value);
      } else {
        this.text = '';
      }

      this.rmTextShort = this.text;
      this.rmTextFull = this.text;

      if (this.rmTextShort.length > this.minLength) {
        if (this.rmTextShort.length > this.lengthExtraLong) {
          this.popup = true;
        }

        this.fullText = false;
        this.showMore = true;
        this.rmTextShort = this.rmTextShort.substr(0, this.minLength) + '...';
      }
    }

    private openHistory() {
      this.changeHistoryDetailedDialogRef = this.dialog.open(ChangeHistoryDetailedComponent, {
          width: '40%',
          data: {
            change: this.change,
          }
      });
    }

    // cast something to string to be displayed. E.g. empty array [] must be displayed as the string "[]"
    castToString(something: any) {
      if (something === undefined) {
        return '//';
      }
      if (typeof something === 'object') {
        return JSON.stringify(something);
      }
      return String(something);
    }
}
