import { Component, Input, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Question } from '../../shared/question.model';
import { Quiz } from '../../shared/quiz.model';
import { QuizService } from '../../shared/quiz.service';
import { statusType } from '../../../shared/status.model';
import { QuestionDialogComponent } from '../question-dialog/question-dialog.component';

@Component({
    moduleId: module.id,
    selector: 'hip-quiz',
    templateUrl: 'quiz.component.html',
    styleUrls: ['quiz.component.css']
})

export class QuizComponent implements OnInit {

    @Input() exhibitId: number;
    quiz: Quiz;

    private questionDialogRef: MdDialogRef<QuestionDialogComponent>;

    constructor(
        private dialog: MdDialog,
        private toasterService: ToasterService,
        private translateService: TranslateService,
        private quizService: QuizService,
    ) { }

    ngOnInit() {
        let options: string[] = ['Answer A', 'Answer B', 'Answer C', 'Answer D'];
        let question1: Question = new Question('Question 1', options, 0);
        let question2: Question = new Question('Question 2', options, 1);
        let questions: Question[] = [question1, question2];
        this.quiz = new Quiz(0, 0, questions, 'DRAFT');
        //this.getQuiz(this.exhibitId);
    }

    private getQuiz(id: any) {
        // let options: string[] = ['Answer A', 'Answer B', 'Answer C', 'Answer D'];
        // let question1: Question = new Question('Question 1', options, 0);
        // let question2: Question = new Question('Question 2', options, 1);
        // let questions: Question[] = [question1, question2];
        // this.quiz = new Quiz(0, 0, questions, 'DRAFT');
        // let questions: Question[] = this.getQuestions(this.exhibitId);
        // this.quizService.getQuiz(id).then(
        //     data => {
        //       this.quiz = new Quiz(data.id, data.exhibitId, questions, data.status);
        //       console.log('Quiz in quiz.component', this.quiz);
        //     }
        //     ).catch(
        //     error => console.error('Error:', error)
        //     );
    }

    private getQuestions(id: any) {
        let questions: Question[] = [];
        this.quizService.getQuestions(id).then(
            data => {
              questions = data;
              console.log('Question in quiz.component: ', questions);
            }
            ).catch(
            error => console.error('Error:', error)
        );
        return questions;
    }

    onQuestionClick(question: Question) {
        console.log('Question ' +  question.text + ' clicked.');
    }

    onEditQuestionClicked(question: Question) {
        this.questionDialogRef = this.dialog.open(QuestionDialogComponent, { width: '450px', height: '560px', data: question });
        this.questionDialogRef.afterClosed().subscribe(
            (editedQuestion: Question) => {
            }
        );
    }

    onAddQuestionClicked() {
        this.questionDialogRef = this.dialog.open(QuestionDialogComponent, { width: '450px', height: '560px' });
        this.questionDialogRef.afterClosed().subscribe(
            (newQuestion: Question) => {
            //   if (newExhibit.latitude) { newExhibit.latitude = newExhibit.latitude.toString().replace(/,/g, '.'); }
            //   if (newExhibit.longitude) { newExhibit.longitude = newExhibit.longitude.toString().replace(/,/g, '.'); }
            //   if (newExhibit) {
            //     this.exhibitService.createExhibit(newExhibit)
            //       .then(
            //       () => {
            //         this.toasterService.pop('success', this.translate('exhibit saved'));
            //         setTimeout(function () {
            //           context.reloadList();
            //         }, 1000);
            //       }
            //       ).catch(
            //       error => this.toasterService.pop('error', this.translate('Error while saving'), error)
            //       );
            //   }
            //   this.createDialogRef = null;
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
