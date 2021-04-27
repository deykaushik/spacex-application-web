import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from './api.service';
import { Constants } from './../utils/constants';
import { CommonUtility } from './../utils/common';
import { ICustomerEnrolmentReq, IApiResponse, ICustomerEnrolment, IDashboardAccounts, ITermsAndConditions } from './models';
import { ClientProfileDetailsService } from './client-profile-details.service';
import { TermsService } from './../../shared/terms-and-conditions/terms.service';
import { TermsAndConditionsConstants } from './../../shared/terms-and-conditions/constants';

/**
 * Service for handling operations related to Greenbacks rewards.
 *
 * @export
 * @class GreenbacksEnrolmentService
 */
@Injectable()
export class GreenbacksEnrolmentService {

   // rewards programme code
   private rewardsCode = Constants.VariableValues.accountTypes.rewardsAccountType.code;

   // terms data
   public termsToAccept: ITermsAndConditions[];

   /**
    * Creates an instance of GreenbacksEnrolmentService.
    * @param {ApiService} apiService
    * @param {ClientProfileDetailsService} clientDetails
    * @memberof GreenbacksEnrolmentService
    */
   constructor(private apiService: ApiService,
      private terms: TermsService,
      private clientDetails: ClientProfileDetailsService) {
   }

   /**
    * Send the http request for enrolment of the customer
    *
    * @memberof GreenbacksEnrolmentService
    */
   enrolCustomer(): Observable<IApiResponse> {
      return this.apiService.EnrolGreenbacks.create(this.getCustomerEnrolmentPayload()).map((response) => response);
   }

   /**
    * Get the request object for the enrolment request.
    *
    * @returns ICustomerEnrolmentReq
    * @memberof GreenbacksEnrolmentService
    */
   getCustomerEnrolmentPayload() {
      const details = this.clientDetails.getClientPreferenceDetails();
      const payload: ICustomerEnrolmentReq = {
         iDNumber: CommonUtility.getResidencyBasedClientId(details),
         customerNo: details.CisNumber.toString(),
         rewardsProgram: Constants.labels.gbtype,
         activateEarnOnSpend: true
      };

      return payload;
   }

   /**
    * Get the account number of the account which we have enroled,
    * account status should be open and program should be greenbacks.
    *
    * @param {ICustomerEnrolment} accountList
    * @returns {string} AccountNumber
    * @memberof GreenbacksEnrolmentService
    */
   getEnroledAccountNumber(accountList: ICustomerEnrolment): string {
      let accNumber = '';
      const account = accountList.rewardsAccountList.find(item =>
         item.rewardsAccountStatus === Constants.accountStatus.open
         && item.rewardsProgram === Constants.labels.gbtype);

      if (account) {
         accNumber = account.rewardsAccountNumber;
      }

      return accNumber;
   }

   /**
    * Update account so that if GB account are not present then add a
    * dummy account for showing the join option to the user.
    *
    * @param {IDashboardAccounts[]} accountContainers
    * @returns {IDashboardAccounts[]}
    * @memberof AccountService
    */
   public updateForEnrolmentToGreenbacks(accountContainers: IDashboardAccounts[]): IDashboardAccounts[] {
      const isEligibleForGBProgram = this.checkEligibilityForGBProgram(accountContainers);
      if (isEligibleForGBProgram) {
         const greenbacksAccountData = {
            AccountName: Constants.labels.greenbacks,
            Balance: 0,
            AvailableBalance: 0,
            AccountNumber: '',
            IsShow: true,
            AccountType: this.rewardsCode,
            RewardsProgram: Constants.labels.gbtype
         };
         const rewards = this.getRewardsAccount(accountContainers);
         if (rewards) {
            // has rewards container
            rewards.Accounts.push(greenbacksAccountData);
         } else {
            // create rewards container
            accountContainers.push({
               ContainerName: this.rewardsCode,
               Accounts: [greenbacksAccountData as any]
            } as IDashboardAccounts);
         }
      } else {
         this.resetCustomerStorage();
      }

      return accountContainers;
   }

   /**
    * Get the latest content for `Terms and Condition` to be shown to the user.
    * First fetch the list of all TnC if user has already accepted TnC in that
    * case all list won't be containing the content and we need to fetch the
    * content from the TnC path with accepted query param.
    *
    * @memberof GreenbacksEnrolmentService
    */
   fetchTermsAndConditions() {
      this.terms.getTerms().subscribe(
         termsResponse => {
            if (termsResponse && termsResponse.data && termsResponse.data.length > 0) {
               const filteredTerms = this.terms.filterTerms(termsResponse.data, [],
                  TermsAndConditionsConstants.includeTermsGBEnrolment);
                  if (filteredTerms && filteredTerms.length > 0) {
                     this.termsToAccept = filteredTerms;
                  } else {
                     const contentState = { versioncontent: TermsAndConditionsConstants.contentAccepted };
                     const noticePath = { noticeType: TermsAndConditionsConstants.includeTermsGBEnrolment[0] };
                     this.apiService.TermsAndConditionsItem.getAll(contentState, noticePath).subscribe(res => {
                        const data = res.data;
                        const decodedContent = this.terms.decodeTerms(data.noticeDetails.noticeContent);
                        data.noticeDetails.noticeContent = decodedContent;
                        this.termsToAccept = [data];
                     });
                  }
               }
      });
   }

   /**
    * Notify the server about TnC acceptance by the user.
    *
    * @returns {Observable<boolean>}
    * @memberof GreenbacksEnrolmentService
    */
   acceptTermsAndConditions(): Observable<boolean> {
      return Observable.create(observer => {
         if (this.termsToAccept) {
            this.terms.accept(this.termsToAccept).subscribe(data => {
               observer.next(true);
               observer.complete();
            });
         } else {
            observer.next(true);
            observer.complete();
         }
      });
   }

   /**
    * Check the eligibility for the GB program, which is unavailability
    * of the GB programe in account list.
    *
    * @param {IDashboardAccounts[]} accountContainers
    * @returns {boolean} Status whether eligible or not.
    * @memberof GreenbacksEnrolmentService
    */
   public checkEligibilityForGBProgram(accountContainers: IDashboardAccounts[]): boolean {
      let eligible = true;
      const rewards = this.getRewardsAccount(accountContainers);
      if (rewards && rewards.Accounts) {
         const GBReward = rewards.Accounts
            .find(reward => reward.RewardsProgram === Constants.labels.gbtype);
         if (GBReward) {
            eligible = false;
         }
      }
      return eligible;
   }

   /**
    * Get the rewards account from the list of accounts.
    *
    * @private
    * @param {IDashboardAccounts[]} accountContainers
    * @returns {*}
    * @memberof GreenbacksEnrolmentService
    */
   private getRewardsAccount(accountContainers: IDashboardAccounts[]): any {
      return accountContainers.find(container => container.ContainerName === this.rewardsCode);
   }

   /**
    * store customerId in localstorage after greenbacks enrolment
    * @public
    * @returns {void}
    * @memberof GreenbacksEnrolmentService
    */
   public storeCustomerInLocalStorage(): void {
      const details = this.clientDetails.getClientPreferenceDetails();
      localStorage.setItem('customerId', details.CisNumber.toString());
   }

   /**
    * remove customerId form localStorage
    * @returns {void}
    * @memberof GreenbacksEnrolmentService
    */
   public resetCustomerStorage(): void {
      localStorage.removeItem('customerId');
   }

   /**
    * check if accountNumber present in localStorage
    * @param accountNumber
    * @returns {boolean}
    * @memberof GreenbacksEnrolmentService
    */
   public isCustomerEnroled(): boolean {
      const details = this.clientDetails.getClientPreferenceDetails();
      return localStorage.getItem('customerId') === details.CisNumber.toString();
   }
}
