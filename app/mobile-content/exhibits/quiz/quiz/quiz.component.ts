import { Component, Input, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Question } from '../../shared/question.model';
import { QuizService } from '../../shared/quiz.service';
import { statusType } from '../../../shared/status.model';
import { QuestionDialogComponent } from '../question-dialog/question-dialog.component';
import { ConfirmDeleteDialogComponent } from '../../../shared/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
    moduleId: module.id,
    selector: 'hip-quiz',
    templateUrl: 'quiz.component.html',
    styleUrls: ['quiz.component.css']
})

export class QuizComponent implements OnInit {

    @Input() exhibitId: number;
    questions: Question[] = [];

    private questionDialogRef: MdDialogRef<QuestionDialogComponent>;
    private deleteDialogRef: MdDialogRef<ConfirmDeleteDialogComponent>;


    constructor(
        private dialog: MdDialog,
        private toasterService: ToasterService,
        private translateService: TranslateService,
        private quizService: QuizService,
    ) {
    }

    ngOnInit() {
        this.getQuestions();
    }

    private getQuestions() {
        this.quizService.getQuestions(this.exhibitId).then(
            returnedQuestions => {
                this.questions = returnedQuestions;
                this.questions = this.questions.slice();
            }
        ).catch(
            error => this.toasterService.pop('error', this.translate('error getting questions'), error)
        );
    }

    onCreateQuestionClicked() {
        this.questionDialogRef = this.dialog.open(QuestionDialogComponent, { width: '450px', height: '720px' });
        this.questionDialogRef.afterClosed().subscribe(
            (newQuestion: Question) => {
                this.quizService.createQuestion(this.exhibitId, newQuestion)
                    .then(() => {
                        this.toasterService.pop('success', this.translate('success adding question'));
                        this.getQuestions();
                    })
                    .catch(
                        error => this.toasterService.pop('error', this.translate('error adding question'), error)
                    );
            });
    }

    onUpdateQuestionClicked(question: Question) {
        let clonedQuestion = Object.assign({}, question);
        this.questionDialogRef = this.dialog.open(QuestionDialogComponent, { width: '450px', height: '720px', data: clonedQuestion });
        this.questionDialogRef.afterClosed().subscribe(
            (editedQuestion: Question) => {
                if (editedQuestion) {
                    this.quizService.updateQuestion(editedQuestion)
                        .then(() => {
                            this.toasterService.pop('success', this.translate('success editing question'));
                            this.getQuestions();
                        })
                        .catch(
                            error => this.toasterService.pop('error', this.translate('error editing question'), error)
                        );
                }
            }
        );
    }

    onDeleteQuestionClicked(question: Question) {
        this.deleteDialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
            data: {
                title: this.translateService.instant('delete question'),
                message: this.translateService.instant('confirm delete question', { name: question.text })
            }
        });
        this.deleteDialogRef.afterClosed().subscribe(
            (confirmed: boolean) => {
                if (confirmed) {
                    this.quizService.deleteQuestion(question)
                        .then(() => {
                            this.toasterService.pop('success', this.translate('success deleting question'));
                            this.getQuestions();
                        })
                        .catch(
                            error => this.toasterService.pop('error', this.translate('error deleting question'), error)
                        );
                }
            }
        );
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
