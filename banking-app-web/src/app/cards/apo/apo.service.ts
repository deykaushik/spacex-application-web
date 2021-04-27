import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IAutoPayDetail, IAvsCheck } from './apo.model';
import { ApiService } from '../../core/services/api.service';
import { TermsService } from '../../shared/terms-and-conditions/terms.service';
import { IBank, IApiResponse, IAccountDetail, ITermsAndConditions, IPlasticCard, IDashboardAccounts } from '../../core/services/models';
import { TermsAndConditionsConstants } from '../../shared/terms-and-conditions/constants';


@Injectable()
export class ApoService {
   private autoPayDetails: IAutoPayDetail;
   private operationMode: string;
   private plasticId: string;
   private accountId: number;
   private autoPaySummary: IAutoPayDetail;
   emitApoSuccess = new EventEmitter<boolean>();
   emitApoDeleteSuccess = new EventEmitter<boolean>();
   private cardDetails: IPlasticCard;
   private accountContainers: IDashboardAccounts[];
   private _nedBankAccounts: IAccountDetail[];
   private _otherBankAccounts: IBank[];
   private _termsAndCondition: ITermsAndConditions;

   constructor(private apiService: ApiService, private terms: TermsService) {
   }

   setMode(operationMode: string) {
      this.operationMode = operationMode;
   }

   getMode(): string {
      return this.operationMode;
   }

   setId(plasticId: string) {
      this.plasticId = plasticId;
   }

   getId(): string {
      return this.plasticId;
   }

   setAccountId(accountId: number) {
      this.accountId = accountId;
   }

   getAccountId(): number {
      return this.accountId;
   }

   getBanks(): Observable<IBank[]> {
      return this.apiService.Banks.getAll().map(response => response ? response.data : []);
   }

   setAutoPayDetails(autoPayDetails) {
      this.autoPayDetails = autoPayDetails;
   }

   getAutoPayDetails() {
      return this.autoPayDetails;
   }

   setAutoPaySummary(autoPayDetails) {
      this.autoPaySummary = {} as IAutoPayDetail;
      this.autoPaySummary.payToAccount = autoPayDetails.payToAccount;
      this.autoPaySummary.payToAccountName = autoPayDetails.payToAccountName;
      this.autoPaySummary.payFromAccount = autoPayDetails.payFromAccount;
      this.autoPaySummary.payFromAccountType = autoPayDetails.payFromAccountType;
      this.autoPaySummary.monthlyPaymentDay = autoPayDetails.monthlyPaymentDay ? autoPayDetails.monthlyPaymentDay : '';
      this.autoPaySummary.autoPayTerm = autoPayDetails.autoPayTerm ? autoPayDetails.autoPayTerm : '';
      this.autoPaySummary.autoPayInd = true;
      this.autoPaySummary.autoPayAmount = autoPayDetails.autoPayAmount ? autoPayDetails.autoPayAmount : '';
      this.autoPaySummary.branchOrUniversalCode = autoPayDetails.branchOrUniversalCode;
      this.autoPaySummary.autoPayMethod = autoPayDetails.autoPayMethod;
      this.autoPaySummary.nedbankIdentifier = autoPayDetails.nedbankIdentifier;
   }

   getAutoPaySummary() {
      return this.autoPaySummary;
   }

   addApoDetails(autoPayDetails, plasticId): Observable<IApiResponse> {
      return this.apiService.APOCardDetails.create(autoPayDetails, null, { plasticId: plasticId })
         .map(response => response);
   }

   updateApoDetails(autoPayDetails, plasticId): Observable<IApiResponse> {
      return this.apiService.APOCardDetails.update(autoPayDetails, null, { plasticId: plasticId })
         .map(response => response);
   }

   deleteAutoPayDetails(plasticId, autoPayDetails): Observable<IApiResponse> {
      return this.apiService.DeleteAPOCardDetails.remove(plasticId, null, autoPayDetails).map(response => response);
   }

   acceptTermsAndConditions(noticeType, termAndCondition): Observable<IApiResponse> {
      return this.apiService.TermsAndConditionsItem.update(termAndCondition, null, { noticeType: noticeType })
         .map(response => response);
   }

   getNedbankAccounts(): Observable<IAccountDetail[]> {
      return this.apiService.TransferAccounts.getAll().map(response => {
         return response ? response.data : [];
      });
   }

   verifyAvsStatus(bankDetails: IAvsCheck): Observable<IApiResponse> {
      return this.apiService.AVSCheck.create(bankDetails, null).map(response => response);
   }

   /* Terms and Conditions */
   getTermsAndConditions(noticeType: string, versioncontent: string): Observable<ITermsAndConditions> {
      const routeParams = { noticeType: noticeType };
      const queryParams = { versioncontent: versioncontent };
      return this.apiService.TermsAndConditionsItem.getAll(queryParams, routeParams)
         .map((response) => this.getDecodedResponse(response));
   }

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
      return false;
   }

   getPlasticCardDetails(plasticId: string): Observable<IApiResponse> {
      const routeParams = { plasticId: plasticId };
      return this.apiService.APOCardDetails.getAll(null, routeParams)
         .map(response => response);
   }

   setAPOSuccess() {
      this.emitApoSuccess.emit(true);
   }

   setAPODeleteSuccess() {
      this.emitApoDeleteSuccess.emit(true);
   }

   setCardDetails(cardDetails: IPlasticCard) {
      this.cardDetails = cardDetails;
   }

   getCardDetails(): IPlasticCard {
      return this.cardDetails;
   }

   setDashboardAccounts(accountContainers: IDashboardAccounts[]) {
      this.accountContainers = accountContainers;
   }

   getDashboardAccounts(): IDashboardAccounts[] {
      return this.accountContainers;
   }

   getCachedNedBankAccounts(): IAccountDetail[] {
      return this._nedBankAccounts;
   }

   setCachedNedBankAccounts(accounts: IAccountDetail[]) {
      this._nedBankAccounts = accounts;
   }

   getOtherBankAccounts(): IBank[] {
      return this._otherBankAccounts;
   }

   setOtherBankAccounts(banks: IBank[]) {
      this._otherBankAccounts = banks;
   }

   getCachedTermsAndConditions(): ITermsAndConditions {
      return this._termsAndCondition;
   }

   setCachedTermsAndConditions(termsAndCondition: ITermsAndConditions) {
      this._termsAndCondition = termsAndCondition;
   }
}
