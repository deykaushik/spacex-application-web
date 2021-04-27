import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IBank, ITermsAndConditions } from '../core/services/models';
import { ApiService } from '../core/services/api.service';
import { IBuildingPayout, IMetaData, IBuildingLoanPayout, IBuildingRecipientDetail, IBuildingCustomerDetail } from './payout.models';
import { TermsService } from '../shared/terms-and-conditions/terms.service';
import { TermsAndConditionsConstants } from '../shared/terms-and-conditions/constants';

@Injectable()
export class PayoutService {
   private payoutStepsData: IBuildingPayout = {} as IBuildingPayout;
   constructor(private apiService: ApiService, private terms: TermsService) { }
   getBanks(): Observable<IBank[]> {
      return this.apiService.Banks.getAll().map(response => response ? response.data : []);
   }
   set payoutData(payoutStepsValue: IBuildingPayout) {
      this.payoutStepsData = payoutStepsValue;
   }
   get payoutData(): IBuildingPayout {
      return this.payoutStepsData;
   }
   createBuildingLoanPayout(buildingLoanPayout: IBuildingLoanPayout, routeParams): Observable<IMetaData> {
      const query = { validate: true };
      return this.apiService.BuildingLoanPayout.create(buildingLoanPayout,
         query, routeParams).map((response) => response.metadata);
   }
   getCreateRequestData(stepsData: IBuildingPayout): IBuildingLoanPayout {
      const buildingLoanRequest = {} as IBuildingLoanPayout;
      this.payoutData = stepsData;
      if (stepsData) {
         const buildingRecipientDetails = {} as IBuildingRecipientDetail;
         const buildingCustomerDetails = {} as IBuildingCustomerDetail;
         buildingLoanRequest.payOutType = stepsData.payOutType.toUpperCase();
         buildingLoanRequest.payOutAmount = parseFloat(stepsData.amount) ? parseFloat(stepsData.amount) : 5342;
         buildingLoanRequest.contactTo = stepsData.contactType.toUpperCase();
         buildingRecipientDetails.bankName = stepsData.bank;
         buildingLoanRequest.isPayOutAmount = stepsData.amount === 'Max' ? true : false;
         buildingRecipientDetails.recipientName = stepsData.recipientName;
         buildingRecipientDetails.bankAccountNumber = stepsData.accountNumber;
         buildingLoanRequest.buildingRecipientDetails = buildingRecipientDetails;
         buildingCustomerDetails.personContactNumber = stepsData.personContactNumber;
         buildingCustomerDetails.personName = stepsData.personName;
         buildingLoanRequest.buildingCustomerDetails = buildingCustomerDetails;
         buildingLoanRequest.buildingCustomerDetails.email = stepsData.email;
      }
      return buildingLoanRequest;
   }

   /**
    * Get the terms and condition text for the Request Building Loan Payout.
    *
    * @returns {Observable<ITermsAndConditions>}
    * @memberof PayoutTermsService
    */
   getTermsAndConditionsResult(): Observable<ITermsAndConditions> {
      const noticePath = { noticeType: TermsAndConditionsConstants.includeTermsUpdateHLN[0] };
      const contentStateAccepted = { versioncontent: TermsAndConditionsConstants.contentAccepted };
      const contentStateLatest = { versioncontent: TermsAndConditionsConstants.contentLatest };
      const tncURL = this.apiService.TermsAndConditionsItem;
      return Observable.create(observer => {
         tncURL.getAll(contentStateAccepted, noticePath)
            .map(response => {
               return this.getDecodedResponse(response);
            }).subscribe(res => {
               if (res) {
                  observer.next(res);
                  observer.complete();
               } else {
                  tncURL.getAll(contentStateLatest, noticePath)
                     .map(response => {
                        return this.getDecodedResponse(response);
                     }).subscribe(acceptedRes => {
                        if (acceptedRes) {
                           observer.next(acceptedRes);
                           observer.complete();
                        }
                     });
               }
            });
      });
   }

   /**
    * Decode the notice content if there any and return the notice data with decoded conent
    * return null if there is no response.
    *
    * @private
    * @param {*} response
    * @returns
    * @memberof PayoutTermsService
    */
   private getDecodedResponse(response) {
      if (response) {
         if (response.data && response.data.noticeDetails
            && response.data.noticeDetails.noticeContent) {
            let decodedData = this.terms.decodeTerms(response.data.noticeDetails.noticeContent);
            decodedData = decodedData.replace(new RegExp(TermsAndConditionsConstants.lessThanCode, 'g'), '<');
            decodedData = decodedData.replace(new RegExp(TermsAndConditionsConstants.greaterThanCode, 'g'), '>');
            response.data.noticeDetails.noticeContent = decodedData;
         }
         return response.data;
      }
      return null;
   }

}
