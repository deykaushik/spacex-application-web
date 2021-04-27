import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import {
   IApiResponse, IDeposit, IAccount, ITermsAndConditions, IFicaResult, IPayoutDetails,
   IOutOfBandResponse
} from '../core/services/models';
import { TermsService } from '../shared/terms-and-conditions/terms.service';
import { Observable } from 'rxjs/Observable';
import { TermsAndConditionsConstants } from '../shared/terms-and-conditions/constants';
import { Constants } from './constants';

@Injectable()
export class OpenAccountService {
   private minimumEntryAmount: number;
   private amount: number;
   private productDetails: IDeposit;
   private depositDetail: any;
   private interestDetail = [];
   private recurringDetails = [];
   private recurringEdit: boolean;
   private interestEdit: boolean;
   private realTimeInterest: number;

   constructor(private apiService: ApiService, private terms: TermsService) { }

   getAmountForOpenNewAccount() {
      return this.amount;
   }

   getMinimumEntryAmount() {
      return this.minimumEntryAmount;
   }

   getDepositDetails() {
      return this.depositDetail;
   }

   getInvestor(): Observable<any> {
      return this.apiService.Investor.getAll().map(response => response ? response.data : []);
   }

   getInitialDeposit(): Observable<IAccount> {
      return this.apiService.DepositDetails.getAll({ 'type': Constants.labels.openAccount.initialdeposit })
         .map(response => response ? response.data : []);
   }

   setDepositDetails(data) {
      this.depositDetail = data;
   }

   getInterestRate(productType: number, amount: number, term: number): Observable<any> {
      return this.apiService.InterestRate.getAll({ 'investmentAmount': amount, 'investmentTerm': term },
         { productType: productType }).map((response) => response ? response.data : []);
   }

   setRealTimeInterestRate(value: number) {
      this.realTimeInterest = value;
   }

   getRealTimeInterestRate() {
      return this.realTimeInterest;
   }

   getInterestDetails() {
      return this.interestDetail;
   }

   getInterestPayout(): Observable<IPayoutDetails[]> {
      return this.apiService.DepositDetails.getAll({ 'type': Constants.labels.openAccount.interestPayout })
         .map(response => response ? response.data : []);
   }

   getFixedInterestRate(productType: number, amount: number, freq: string, term: number): Observable<IDeposit> {
      return this.apiService.InterestRate.getAll({ 'investmentAmount': amount, 'interestFrequency': freq, 'investmentTerm': term },
         { productType: productType }).map((response) => response ? response.data : []);
   }

   setInterestDetails(data) {
      this.interestDetail = data;
   }

   getProductDetails() {
      return this.productDetails;
   }

   getficaStatus(): Observable<IFicaResult> {
      return this.apiService.FicaStatus.getAll().map(response => response ? response.data : []);
   }

   getRecurringEdit() {
      return this.recurringEdit;
   }

   getInterestEdit() {
      return this.interestEdit;
   }

   setRecurringDetails(data) {
      this.recurringDetails = data;
   }

   getRecurringDetails() {
      return this.recurringDetails;
   }

   setRecurringEdit(value: boolean) {
      this.recurringEdit = value;
   }

   setInterestEdit(value: boolean) {
      this.interestEdit = value;
   }

   getPartWithdrawalAmount(productType: number): Observable<IApiResponse> {
      return this.apiService.PartWithdrawalAmount.getAll(null, { type: productType }).map((response) => response ? response.data : []);
   }

   openAccount(payload: IApiResponse, routeParams: string): Observable<IApiResponse> {
      return this.apiService.OpenAccount.create(payload, {}, routeParams).map((response) => response);
   }

   getTermsAndConditionsForOpenNewAccount(): Observable<ITermsAndConditions> {
      return this.apiService.AcceptTermsAndConditionsForOpenNewAccount.getAll().map((response) => this.getDecodedResponse(response));
   }

   updateTermsAndConditionsForOpenNewAccount(): Observable<IApiResponse> {
      return this.apiService.AcceptTermsAndConditionsForOpenNewAccount.update(null, null, null).map(response => response);
   }

   getEntryAmount(): Observable<string> {
      return this.apiService.EntryAmount.getAll().map(response => response ? response.data : []);
   }

   setMinimumEntryAmount(value: number) {
      this.minimumEntryAmount = value;
   }

   getAllProducts(type: number, age: number): Observable<IApiResponse> {
      return this.apiService.AllProductsDetails.getAll({
         'type': Constants.labels.openAccount.investments,
         'age': age, 'clientType': type
      }).
         map(response => response ? response.data : []);
   }

   setAmountForOpenNewAccount(value: number) {
      return this.amount = value;
   }

   getAllAccountTypeFilteredProduct(amount: number, isDeposit: string, selectedOption: string,
       age: number, clientType: number): Observable<IApiResponse> {
      return this.apiService.AllProductsDetails.getAll(
         { 'type': Constants.labels.openAccount.investments, 'access': selectedOption, 'deposit': isDeposit, 'investmentAmouNT': amount,
         'age': age, 'clientType': clientType }).
         map((response) => response ? response.data : []);
   }

   setProductDetails(data: IDeposit) {
      this.productDetails = data;
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
}
