import { Component, Input, OnInit } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Question } from '../shared/question.model';
import { Quiz } from '../shared/quiz.model';
import { QuizService } from '../shared/quiz.service';
import { statusType } from '../../shared/status.model';

@Component({
    moduleId: module.id,
    selector: 'hip-quiz',
    templateUrl: 'quiz.component.html',
    styleUrls: ['quiz.component.css']
})

export class QuizComponent implements OnInit {

    @Input() exhibitId: number;
    quiz: Quiz;

    constructor(
        private toasterService: ToasterService,
        private translateService: TranslateService,
        private quizService: QuizService,
    ) { }

    ngOnInit() {
        this.getQuiz(this.exhibitId);
    }

    private getQuiz(id: any) {
        // let options: string[] = ['Answer A', 'Answer B', 'Answer C', 'Answer D'];
        // let question1: Question = new Question('Question 1', options, 0);
        // let question2: Question = new Question('Question 2', options, 1);
        // let questions: Question[] = [question1, question2];
        // this.quiz = new Quiz(0, 0, questions, 'DRAFT');
        let questions: Question[] = this.getQuestions(this.exhibitId);
        this.quizService.getQuiz(id).then(
            data => {
              this.quiz = new Quiz(data.id, data.exhibitId, questions, data.status);
              console.log('Quiz in quiz.component', this.quiz);
            }
            ).catch(
            error => console.error('Error:', error)
            );
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
