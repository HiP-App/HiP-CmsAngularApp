import { Response } from '@angular/http';

import { statusType } from '../../shared/status.model';

export class Question {
    constructor(
        public id: number,
        public exhibitId: number,
        public text: string,
        public options: string[],
        public image?: number,
        public status: statusType = 'DRAFT',
        public timestamp?: string
    ) { }

    public static emptyQuestion(): Question {
        return new Question(-1, -1, '', ['', '', '', ''], null);
    }

    public static extractQuestions(res: Response): Question[] {
        let body = res.json();
        let questions: Question[] = [];

        if (body === undefined) {
            return questions;
        }

        for (let question of body) {
            questions.push(this.parseJSON(question));
        }
        return questions;
    }

    static parseJSON(obj: any): Question {
        let question = Question.emptyQuestion();
        question.id = obj.id;
        question.exhibitId = obj.exhibitId;
        question.text = obj.text;
        question.image = obj.image;
        question.status = obj.status;
        question.timestamp = obj.timestamp;
        for (let i = 0; i < 4; i++) {
            question.options[i] = obj.options[i];
        }
        return question;
    }
}
