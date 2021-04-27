import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { FeedbackService } from './feedback.service';
import { ApiService } from '../core/services/api.service';
import { ICallbackDetail, IFeedbackDetail, IReportSuspicious } from '../core/services/models';

const returnValueFeedback = Observable.of({
   MetaData: {
      ResultCode: 'R00',
      Message: 'Success',
      InvalidFieldList: null,
      result: {
         'resultCode': 0,
         'resultMessage': ''
      }
   },
   Data: null
});

const returnValueCandCsFeedback = Observable.of({
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'FEEDBACK',
               result: 'R00',
               status: 'SUCCESS',
               reason: ''
            }
         ]
      }
   ]
});

const returnValueReportFraud = Observable.of({
   data: {
      attempts: 0,
      remainingTime: '0',
      attemptsCompletedFlag: false
   },
   metadata: {
      resultData: [
         {
            resultDetail: [
               {
                  operationReference: 'Suspicious Activity',
                  result: 'R00',
                  status: 'SUCCESS',
                  reason: 'SUCCESS'
               }
            ]
         }
      ]
   }
});


const _SubmitCallback = jasmine.createSpy('getAll').and.returnValue(Observable.of(returnValueFeedback));
const _SubmitFeedback = jasmine.createSpy('getAll').and.returnValue(Observable.of(returnValueFeedback));
const _ReportSuspiciousAttempts = jasmine.createSpy('getAll').and.returnValue(Observable.of(returnValueReportFraud));
const _ReportSuspiciousSubmit = jasmine.createSpy('getAll').and.returnValue(Observable.of(returnValueReportFraud));
const _SubmitCandCsFeedback = jasmine.createSpy('getAll').and.returnValue(Observable.of(returnValueCandCsFeedback));

describe('FeedbackService', () => {
   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [FeedbackService, {
            provide: ApiService, useValue: {
               Feedback: {
                  create: _SubmitFeedback
               },
               Callback: {
                  create: _SubmitCallback
               },
               ReportSuspiciousAttempts: {
                  getAll: _ReportSuspiciousAttempts
               },
               ReportFraud: {
                  create: _ReportSuspiciousSubmit
               },
               CandCsFeedback: {
                  create: _SubmitCandCsFeedback
               }
            }
         }]
      });
   });

   it('should be created', inject([FeedbackService], (service: FeedbackService) => {
      expect(service).toBeTruthy();
   }));

   it('should call submit feedback  API', inject([FeedbackService], (feedbackService: FeedbackService) => {
      const feedbackDetails: IFeedbackDetail = {
         FeedbackType: 'Compliment',
         Description: 'test',
         BrowserType: 'chrome',
         WebVersion: '67.0.3396.99'
      };
      feedbackService.submitFeedback(feedbackDetails).subscribe((response) => {
         expect(_SubmitFeedback).toHaveBeenCalled();
      });
   }));

   it('should call callback details  API', inject([FeedbackService], (feedbackService: FeedbackService) => {
      const callbackDetails: ICallbackDetail = {
         MobileNo: '+27123456789',
         CallbackTime: 'Morning',
         Description: 'test',
         BrowserType: 'chrome',
         WebVersion: '67.0.3396.99'
      };
      feedbackService.submitCallback(callbackDetails).subscribe((response) => {
         expect(_SubmitFeedback).toHaveBeenCalled();
      });
   }));

   it('should call report Suspicious Attempts  API', inject([FeedbackService], (feedbackService: FeedbackService) => {
      feedbackService.reportSuspiciousAttempts().subscribe((response) => {
         expect(_ReportSuspiciousAttempts).toHaveBeenCalled();
      });
   }));

   it('should call report Suspicious submit  API', inject([FeedbackService], (feedbackService: FeedbackService) => {
      const feedbackDetails: IReportSuspicious = {
         'incidentDate': '2018-06-29T10:09:13.064Z',
         'accountNumber': 'string',
         'totalAmount': 0,
         'thirdPartyAccountNumber': 'string',
         'thirdPartyBankName': 'string',
         'incidentDescription': 'string',
         'emailId': 'string'
      };
      feedbackService.reportSuspiciousSubmit(feedbackDetails).subscribe((response) => {
         expect(_ReportSuspiciousSubmit).toHaveBeenCalled();
      });
   }));

   it('should call submit complaints and compliments feedback  API', inject([FeedbackService], (feedbackService: FeedbackService) => {
      const feedbackDetails: IFeedbackDetail = {
         feedbackType: 'Compliment',
         description: 'test',
         browserType: 'chrome',
         webVersion: '67.0.3396.99'
      };
      feedbackService.submitCandCsFeedback(feedbackDetails).subscribe((response) => {
         expect(_SubmitCandCsFeedback).toHaveBeenCalled();
      });
   }));

});
