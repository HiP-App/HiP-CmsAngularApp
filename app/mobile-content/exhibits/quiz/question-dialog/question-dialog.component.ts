import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

import { Question } from '../../shared/question.model';

@Component({
  moduleId: module.id,
  selector: 'hip-question-dialog',
  styleUrls: ['question-dialog.component.css'],
  templateUrl: 'question-dialog.component.html'
})
export class QuestionDialogComponent implements OnInit {

  question: Question = Question.emptyQuestion();
  files: File[];

  isEdit = false;

  constructor(
    public dialogRef: MdDialogRef<QuestionDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: Question
  ) { }

  ngOnInit() {
    if (this.data != null) {
      this.question = this.data;
      this.isEdit = true;
    }
    this.files = null;
  }

  isQuestionValid() {
    return this.question.text.trim().length > 0 && this.question.options[0].trim().length > 0
    && this.question.options[1].trim().length > 0 && this.question.options[2].trim().length > 0
    && this.question.options[3].trim().length > 0;
  }

  chooseImage(files: File[]): void {
    this.files = files;
  }
}
