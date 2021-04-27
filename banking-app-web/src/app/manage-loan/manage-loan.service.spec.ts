import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { ManageLoanService } from './manage-loan.service';
import { ApiService } from '../core/services/api.service';
import { IApiResponse, ILoanCancelRequest } from './../core/services/models';

const mockLoanCancelRequest: ILoanCancelRequest = {
   itemaccountid: '1',
   emailid: 'bob@nedbank.co.za'
};

const mockCancelNoticeRequest: ILoanCancelRequest = {
   itemaccountid: '1',
};

const mockCancelLoanResponse: IApiResponse = {
   data: {},
   metadata: {
      resultDetail: [{
         operationReference: 'LoanProductsManagement',
         result: 'SUCCESS',
         status: 'R00',
         reason: ''
      }]
   }
};

const _cancelLoan = jasmine.createSpy('create').and.returnValue(Observable.of(mockCancelLoanResponse));

describe('ManageLoanService', () => {
   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [ManageLoanService, {
            provide: ApiService, useValue: {
               CancelLoan: {
                  create: _cancelLoan
               }
            }
         }]
      });
   });

   it('should be created', inject([ManageLoanService], (service: ManageLoanService) => {
      expect(service).toBeTruthy();
   }));

   it('should be able to cancel the notice', inject([ManageLoanService], (service: ManageLoanService) => {
      const cancelLoanType = 'cancellationnotices';
      service.cancelLoan(mockLoanCancelRequest, cancelLoanType).subscribe(response => {
         expect(response).toBe(mockCancelLoanResponse);
      });
   }));

   it('should be able to cancel the loan', inject([ManageLoanService], (service: ManageLoanService) => {
      const cancelLoanType = 'cancellationrequests';
      service.cancelLoan(mockCancelNoticeRequest, cancelLoanType).subscribe(response => {
         expect(response).toBe(mockCancelLoanResponse);
      });
   }));

});

describe('ManageLoanService for No Content', () => {
   const NoContentResponseCreate = jasmine.createSpy('create').and.returnValue(Observable.of(null));
   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [ManageLoanService, {
            provide: ApiService, useValue: {
               CancelLoan: {
                  create: NoContentResponseCreate
               }
            }
         }]
      });
   });

   it('should be able to cancel the loan notice', inject([ManageLoanService], (service: ManageLoanService) => {
      const cancelLoanType = 'cancellationnotices';
      service.cancelLoan(mockLoanCancelRequest, cancelLoanType).subscribe(response => {
         expect(NoContentResponseCreate).toHaveBeenCalled();
      });
   }));

   it('should be able to cancel the loan', inject([ManageLoanService], (service: ManageLoanService) => {
      const cancelLoanType = 'cancellationrequests';
      service.cancelLoan(mockLoanCancelRequest, cancelLoanType).subscribe(response => {
         expect(NoContentResponseCreate).toHaveBeenCalled();
      });
   }));
});
