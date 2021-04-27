import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../../core/services/api.service';
import { ICreditLimitMaintenance, IApiResponse, IAccountDetail } from '../../core/services/models';

@Injectable()
export class CreditLimitService {
   private creditLimitDetails: ICreditLimitMaintenance;
   private accountId: string;
   private summaryDetails: ICreditLimitMaintenance;
   private cachedCurrentAccounts: IAccountDetail[];

   constructor(private apiService: ApiService) { }

   setAccountId(accountId) {
      this.accountId = accountId;
   }
   getAccountId() {
      return this.accountId;
   }
   setCreditLimitMaintenanceDetails(creditLimitDetails) {
      this.creditLimitDetails = creditLimitDetails;
   }
   getCreditLimitMaintenanceDetails() {
      return this.creditLimitDetails;
   }
   requestCreditLimitIncrease(creditLimitDetails: ICreditLimitMaintenance): Observable<IApiResponse> {
      return this.apiService.RequestCreditLimitIncrease.create(creditLimitDetails, null, null).map(response => response);
   }
   setSummaryDetails(summaryDetails: ICreditLimitMaintenance) {
      this.summaryDetails = {} as ICreditLimitMaintenance;
      this.summaryDetails.accountNumber = summaryDetails.accountNumber;
      this.summaryDetails.bankName = summaryDetails.bankName;
      this.summaryDetails.branchNumber = summaryDetails.branchNumber;
      this.summaryDetails.grossMonthlyIncome = summaryDetails.grossMonthlyIncome;
      this.summaryDetails.netMonthlyIncome = summaryDetails.netMonthlyIncome;
      this.summaryDetails.monthlyCommitment = summaryDetails.monthlyCommitment;
      this.summaryDetails.monthlyDebt = summaryDetails.monthlyDebt;
      this.summaryDetails.plasticId = summaryDetails.plasticId;
      this.summaryDetails.otherIncome = summaryDetails.otherIncome ? summaryDetails.otherIncome : 0;
      this.summaryDetails.preferContactNumber = summaryDetails.preferContactNumber;
      this.summaryDetails.primaryClientDebtReview = summaryDetails.primaryClientDebtReview;
      this.summaryDetails.spouseDebtReview = summaryDetails.spouseDebtReview ? summaryDetails.spouseDebtReview : '';
      this.summaryDetails.statementRetrival = summaryDetails.statementRetrival;
   }

   getSummaryDetails(): ICreditLimitMaintenance {
      return this.summaryDetails;
   }

   getCachedCurrentAccounts(): IAccountDetail[] {
      return this.cachedCurrentAccounts;
   }

   setCachedCurrentAccounts(currentAccounts: IAccountDetail[]) {
      this.cachedCurrentAccounts = currentAccounts;
   }
}
