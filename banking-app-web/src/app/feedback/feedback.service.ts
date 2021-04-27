import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../core/services/api.service';
import { IApiResponse, IReportSuspicious, IFeedbackResult, ICallbackDetail, IFeedbackDetail } from '../core/services/models';

@Injectable()
export class FeedbackService {

   constructor(private apiService: ApiService) { }

   reportSuspiciousSubmit(feedbackDetails: IReportSuspicious): Observable<IApiResponse> {
      let feedbackApi: Observable<IApiResponse>;
      feedbackApi = this.apiService.ReportFraud.create(feedbackDetails).map((response) => {
         return response;
      });
      return feedbackApi;
   }

   reportSuspiciousAttempts(): Observable<IApiResponse> {
      let feedbackApi: Observable<IApiResponse>;
      feedbackApi = this.apiService.ReportSuspiciousAttempts.getAll().map((response) => {
         return response;
      });
      return feedbackApi;
   }

   submitCallback(callbackDetails: ICallbackDetail): Observable<IFeedbackResult> {
      let callbackApi: Observable<any>;
      callbackApi = this.apiService.Callback.create(callbackDetails).map((response) => {
         return response;
      });
      return callbackApi;
   }

   submitFeedback(feedbackDetails: IFeedbackDetail): Observable<IFeedbackResult> {
      let feedbackApi: Observable<any>;
      feedbackApi = this.apiService.Feedback.create(feedbackDetails).map((response) => {
         return response;
      });
      return feedbackApi;
   }

   /* Submit the complaints and compliments feedback */
   submitCandCsFeedback(feedbackDetails: IFeedbackDetail): Observable<IFeedbackResult> {
      let feedbackApi: Observable<any>;
      feedbackApi = this.apiService.CandCsFeedback.create(feedbackDetails).map((response) => {
         return response;
      });
      return feedbackApi;
   }
}
