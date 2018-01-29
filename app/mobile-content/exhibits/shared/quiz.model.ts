import { Question } from './question.model';
import { statusType } from '../../shared/status.model';

export class Quiz {
    constructor(
        public id: number,
        public exhibitId: number,
        public questions: Question[],
        public status: statusType = 'DRAFT',
        public timestamp?: string,
    ) { }

    public static emptyQuiz(): Quiz {
        return new Quiz(-1, -1, null);
      }

    public static extractQuiz(response: Response): Quiz {
        let body = response.json();
        return Quiz.parseJSON(body);
    }

    static parseJSON(obj: any): Quiz {
        let quiz = Quiz.emptyQuiz();
        quiz.id = obj.id;
        quiz.exhibitId = obj.exhibitId;
        quiz.questions = [];
        quiz.status = obj.status;
        quiz.timestamp = obj.timestamp;
        return quiz;
      }
}
