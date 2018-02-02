import { Response } from '@angular/http';

export class Question {
    constructor(
        public text: string,
        public options: string[],
        public image?: number
    ) { }

    public static emptyQuestion(): Question {
        return new Question('', new Array(), -1);
    }

    public static extractQuestions(res: Response): Question[] {
        let body = res.json();
        let questions: Question[] = [];

        if (body.questions === undefined) {
            return questions;
        }

        for (let question of body.questions) {
            questions.push(this.parseJSON(question));
        }
        return questions;
    }

    static parseJSON(obj: any): Question {
        let question = Question.emptyQuestion();
        question.text = obj.text;
        for (let i = 0; i < 4; i++) {
            question.options[i] = obj.options[i];
        }
        return question;
    }
}
