import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/Rx';

import { Question } from './question.model';
import { Quiz } from './quiz.model';
import { Exhibit } from './exhibit.model';
import { MobileContentApiService } from '../../shared/mobile-content-api.service';

@Injectable()
export class QuizService {

  constructor(private mobileContentApiService: MobileContentApiService) {}

  getQuiz(id: number): Promise<Quiz> {
    return this.mobileContentApiService.getUrl('/api/Exhibits/Quiz/' + id, {})
      .toPromise()
      .then(
        (response: Response) => {
          return Quiz.extractQuiz(response.json());
        }
      ).catch(
        (error: any) => QuizService.handleError(error)
      );
  }

  getQuestions(id: number): Promise<Question[]> {
    return this.mobileContentApiService.getUrl('/api/Exhibits/Quiz/' + id, {})
      .toPromise()
      .then(
        (response: Response) => {
          return Question.extractQuestions(response);
        }
      ).catch(
        // tslint:disable-next-line:no-unused-expression
        (error: any) => QuizService.handleError(error)
      );
  }

  getQuizRating(id: number) {
    return this.mobileContentApiService.getUrl('/api/Exhibits/Quiz/Rating' + id, {})
      .toPromise()
      .then(
        (response: Response) => response.json()
      ).catch(
        (error: any) => QuizService.handleError(error)
      );
  }

  private static handleError(error: any) {
    let errMsg = error.message || error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Promise.reject(errMsg);
  }
}
