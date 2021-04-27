import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from './../core/services/api.service';
import { IApiResponse, ILoanCancelRequest } from './../core/services/models';

@Injectable()
export class ManageLoanService {

   constructor(private apiService: ApiService) { }

   /**
     * Send the http request for cancel the loan or place a notice
     *
     * @param {ILoanCancelRequest} loanRequest
     * @param {string} cancelType
     * @returns {IApiResponse}
     * @memberof ManageLoanService
     *
     */
   cancelLoan(loanRequest: ILoanCancelRequest, cancelLoanType: string): Observable<IApiResponse> {
      return this.apiService.CancelLoan.create(loanRequest, null, { cancelLoanType: cancelLoanType }).map(response => response);
   }

}
