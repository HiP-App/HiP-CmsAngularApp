import { Component, Input, OnInit } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Question } from '../shared/question.model';
import { Quiz } from '../shared/quiz.model';

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
        private translateService: TranslateService
    ) { }

    ngOnInit() {
        this.getQuiz();
    }

    private getQuiz() {
        let options: string[] = ['Answer A', 'Answer B', 'Answer C', 'Answer D'];
        let question1: Question = new Question('Question 1', options, 0);
        let question2: Question = new Question('Question 2', options, 1);
        let questions: Question[] = [question1, question2];
        this.quiz = new Quiz(0, 0, questions, 'DRAFT');
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
