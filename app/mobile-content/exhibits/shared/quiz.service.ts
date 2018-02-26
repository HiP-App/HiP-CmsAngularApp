import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/Rx';

import { Question } from './question.model';
import { Exhibit } from './exhibit.model';
import { MobileContentApiService } from '../../shared/mobile-content-api.service';

@Injectable()
export class QuizService {

  constructor(private mobileContentApiService: MobileContentApiService) { }

  getQuestions(exhibitId: number): Promise<Question[]> {
    return this.mobileContentApiService.getUrl('/api/Exhibits/' + exhibitId + '/Questions', {})
      .toPromise()
      .then(
        (response: Response) => {
          return Question.extractQuestions(response);
        }
      ).catch(
        (error: any) => QuizService.handleError(error)
      );
  }

  createQuestion(exhibitId: number, question: Question): Promise<Response> {
    return this.mobileContentApiService.postUrl('/api/Exhibits/' + exhibitId + '/Question', JSON.stringify(question))
      .toPromise()
      .then(
        (response: Response) => { return response; }
      )
      .catch(
        (error: any) => QuizService.handleError(error)
      );
  }

  updateQuestion(question: Question): Promise<Response> {
    return this.mobileContentApiService.putUrl('/api/Exhibits/Question/' + question.id, JSON.stringify(question))
      .toPromise()
      .then(
        (response: Response) => { return response; }
      )
      .catch(
        (error: any) => QuizService.handleError(error)
      );
  }

  deleteQuestion(question: Question): Promise<Response> {
    return this.mobileContentApiService.deleteUrl('/api/Exhibits/Question/' + question.id)
      .toPromise()
      .then(
        (response: Response) => { return response; }
      )
      .catch(
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
