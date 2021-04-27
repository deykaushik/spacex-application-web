import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Constants } from './../core/utils/constants';
import { ApiService } from './../core/services/api.service';
import { TermsService } from '../shared/terms-and-conditions/terms.service';
import { environment } from '../../environments/environment';
import * as moment from 'moment';

import {
   IApiResponse, IDashboardAccounts, ITransactionDetail,
   IScheduledTransaction, IAccountDetail, ITransactionMetaData, ITravelCardPriorityDetails,
   ILinkableAccounts, ILinkAccount, IRefreshAccountsApiResult, IDisputeOrderPost, IPreferenceDetail,
   IDashboardAccount, IAccountBalanceDetail, ITransactionDetailIS, IAccountRename,
   IRenameAccount, IOutOfBandRequest, IOutOfBandResponse, ILinkedAccount, IAccountLists,
   IChangeOverdraftLimitRequest, IResultDetail, IValidation, IDormancyRequest,
   IShareAccountReq, IUniversalBranchCode, IClientAccountDetail, ISettlementDetail, ISettlementQuote,
   IStatementPreferences, IMetaData, IPostalCode, IBankerDetail, IDcarRangeDetails,
   IDebitOrderReasons, IStopOrderPost, ICancelStopOrderPost, ILoanDebitOrderDetails, ITermsAndConditions, IBank, IManagePaymentDetailsPost,
   IAlertMessage, IDocumentSendRequest, IDocumentList, ICrossBorderRequest, IStatementDownload, IIncomeTaxResponse,
   INoticePayload, IFicaResult, IDeposit, IPayoutDetails, IAccount, ITripsResponse, ITrip, IViewNoticeDetails, IAccountInfo
} from './../core/services/models';
import { IAccountConfig } from './dashboard.model';
import { CommonUtility } from '../core/utils/common';
import { TermsAndConditionsConstants } from '../shared/terms-and-conditions/constants';
import { UUID } from 'angular2-uuid';

@Injectable()
export class AccountService {
   private accountData: any;
   private accountConfig: IAccountConfig[];
   private successState;
   private numTransactions = 32000;
   private announcedAccountsRefresh = new Subject<boolean>();
   private dashboardAccounts: IDashboardAccounts[];
   private settlementData: ISettlementDetail;
   private transactions: ITransactionDetail[] = [];
   accountsRefreshObservable = this.announcedAccountsRefresh.asObservable();
   private bankerDetails: IBankerDetail;
   public schdedulePaymentGUID?= '';
   transactionSearchModeEmitter = new EventEmitter<boolean>();

   private mfcUpdatePostData: IManagePaymentDetailsPost;

   private mfcCrossBorderRequest: ICrossBorderRequest;

   private alertMessage = new Subject<IAlertMessage>();
   currentAlertMessage = this.alertMessage.asObservable();
   incomeTaxDetails: IIncomeTaxResponse[];
   transactionID: string;
   isChangeSuccessful = false;
   referenceNumber: string;

   constructor(private apiService: ApiService, private terms: TermsService) {
      this.accountConfig = [
         {
            type: 'Bank',
            title: Constants.labels.dashboardBankAccountTitle,
            currentBalance: Constants.labels.currentBalance,
            availableBalance: Constants.labels.availableBalance
         },
         {
            type: 'Card',
            title: Constants.labels.dashboardCardAccountTitle,
            currentBalance: Constants.labels.currentBalance,
            availableBalance: Constants.labels.availableBalance
         },
         {
            type: 'ClubAccount',
            title: Constants.labels.dashboardClubAccountsTitle,
            currentBalance: Constants.labels.currentBalance,
            availableBalance: Constants.labels.availableBalance
         },
         {
            type: 'Loan',
            title: Constants.labels.dashboardLoanAccountTitle,
            currentBalance: Constants.labels.outstandingBalance,
            availableBalance: Constants.labels.availableBalance,
            settlementAmount: Constants.labels.settlementAmount,
            outstandingBalance: Constants.labels.outstandingBalance,
            balanaceNotPaid: Constants.labels.balanceNotPaidOut,
            registeredAmount: Constants.labels.registeredAmount,
            interimInterest: Constants.labels.interimInterest
         },
         {
            type: 'Investment',
            title: Constants.labels.dashboardInvestmentAccountTitle,
            currentBalance: Constants.labels.currentBalance,
            availableBalance: Constants.labels.availableBalance
         },
         {
            type: 'Foreign',
            title: Constants.labels.dashboardForexAccountTitle,
            currentBalance: '',
            availableBalance: ''
         }, // added rewards container
         {
            type: Constants.labels.dashboardRewardsAccountTitle,
            title: Constants.labels.dashboardRewardsAccountTitle,
            currentBalance: Constants.labels.rewardsBalance,
            availableBalance: Constants.labels.randValue
         },
         {
            type: 'TravelCard',
            title: Constants.labels.dashboardTravelCardAccountTitle,
            currentBalance: Constants.labels.priorityCurrency,
            availableBalance: Constants.labels.lastUsedCurrency
         }
      ];
   }

   loadTripStatusEmitter = new EventEmitter<boolean>();
   loadTripRefEmitter = new EventEmitter<string>();

   loadTrip(postData, cardNumber): Observable<any> {
      return this.apiService.loadNewTrip.create(postData, null, { cardNumber: cardNumber }).map(response => {
         this.loadTripStatusEmitter.emit(true);
         this.loadTripRefEmitter.emit(postData.clientReferenceNumber);
         return response ? response : [];
      });
   }

   getAllTrips(cardNumber: number): Observable<any> {
      return this.apiService.getAllTripsByCardNumber.getAll({}, { cardNumber: cardNumber }).map((response => response ? response : []));
   }

   getDashboardAccounts(): Observable<any> {
      return Observable.create(obs => {
         this.apiService.DashboardAccounts.getAll()
            .subscribe(result => {
               const res = result as Array<any>;
               if (res) {
                  res.filter(function (key, index) {
                     if (key.ContainerName === Constants.labels.foreignAccountContainerName) {
                        key.Accounts.map((r, ind) => {
                           if (r && r.AccountType === Constants.labels.creditCardAccountTypeShortName) {
                              if (environment.features.travelCardAccount) {
                                 r.AccountType = Constants.labels.travelCardAccountTypeShortName;
                                 r.AccountName = Constants.labels.travelCardDefaultName;
                              } else {
                                 delete key.Accounts[ind];
                              }
                           }
                        });
                     }
                  });
               }
               obs.next(result);
            }, error => {
               obs.error(error);
            });
      });
   }

   getAccountConfig(type: string) {
      return this.accountConfig.find(config => config.type === type);
   }

   getAccountTransactions(itemAccountId: number, isProvisional = false, statementNumber?: number): Observable<any> {
      statementNumber = statementNumber || 0;
      return this.apiService.AccountTransactions.getAll({
         'pageSize': this.numTransactions,
         'isProvisional': isProvisional,
         'statementNumber': statementNumber
      }, {
            itemAccountId: itemAccountId
         }).map((response) => this.isTransactionHistorySuccess(response) ? response.data : response.metadata);
   }
   isTransactionHistorySuccess(response): boolean {
      return response.metadata.resultData[0].resultDetail[0].result === Constants.statusCode.successCode;
   }

   getGraphTransactions(itemAccountId: number, accountType: string): Observable<any> {

      let isWeeklyGraph = true;
      let graphDuration = 6;

      switch (accountType) {
         case 'NC':
         case 'IS':
         case 'HL':
         case 'TD':
         case 'DS':
         case 'INV':
         case 'TC':
            isWeeklyGraph = false;
            graphDuration = 3;
            break;
      }

      if (accountType === Constants.labels.travelCardAccountTypeShortName) {
         return this.apiService.TravelCardGraphTransactions.getAll({
            'pageSize': this.numTransactions,
            startDate: moment(new Date()).add((isWeeklyGraph ? 'week' : 'month'), - graphDuration).format(Constants.formats.momentYYYYMMDD),
            endDate: moment(new Date()).format(Constants.formats.momentYYYYMMDD)
         }, {
               itemAccountId: itemAccountId
            }).map((response) => response.data);
      } else {
         return this.apiService.GraphTransactions.getAll({
            'pageSize': this.numTransactions,
            startDate: moment(new Date()).add((isWeeklyGraph ? 'week' : 'month'), - graphDuration).format(Constants.formats.momentYYYYMMDD),
            endDate: moment(new Date()).format(Constants.formats.momentYYYYMMDD)
         }, {
               itemAccountId: itemAccountId
            }).map((response) => response.data);
      }
   }
   // get transaction details from casa account type
   getTransactionDetails(itemAccountId: number, transactionId: string): Observable<ITransactionDetailIS> {
      return this.apiService.TransactionDetails.getAll({}, { itemAccountId: itemAccountId, transactionId: transactionId })
         .map((response) => this.isTransactionDetailsSuccess(response) ? response : response.metadata);
   }
   isTransactionDetailsSuccess(response): boolean {
      return response.metadata.resultData[0].resultDetail[0].result === Constants.statusCode.successCode;
   }

   getScheduledTransfer(urlParam): Observable<IScheduledTransaction[]> {
      return this.apiService.ScheduledTransfer.getAll(urlParam, {}).map((response) => response ? response.data : []);
   }
   getScheduledMobileTrasactions(urlParam): Observable<IScheduledTransaction[]> {
      return this.apiService.ScheduledMobileTrasactions.getAll(urlParam, {}).map((response) => response ? response.data : []);
   }
   getScheduledPayment(urlParam): Observable<IScheduledTransaction[]> {
      return this.apiService.ScheduledPayment.getAll(urlParam, {}).map((response) => response ? response.data : []);
   }
   getDebitOrders(accountId: number): Observable<any[]> {
      return Observable.forkJoin(
         this.apiService.AccountDebitOrders.getAll({}, { accountId: accountId })
            .map(response => response ? response.data : []),
         this.apiService.AccountMandateOrders.getAll().map(response => response ? response['Data'] : [])
      );
   }
   getPockets(cardNumber: number): Observable<any> {
      return this.apiService.TravelCardCurrencyPockets.getAll(null, { cardNumber: cardNumber })
         .map((response) => response ? response : null);
   }
   changePocketPriority(cardNumber: number, priorityData: ITravelCardPriorityDetails[]): Observable<any> {
      return this.apiService.TravelCardCurrencyPockets.update(priorityData, null, { cardNumber: cardNumber })
         .map((response) => response ? response : null);
   }
   disputeAnOrder(itemAccountId: string, data: IDisputeOrderPost): Observable<boolean> {
      return this.apiService.DisputeanOrder.create(data, null, { accountId: itemAccountId })
         .map((response) => this.isDisputeOrderSuccess(response.metadata, Constants.metadataKeys.disputeDebitOrder));
   }
   isDisputeOrderSuccess(metadata: ITransactionMetaData, statusType: string): boolean {
      const resp = CommonUtility.getTransactionStatus(metadata, statusType);
      return resp.isValid;
   }
   stopDebitOrder(itemAccountId: string, payload: IStopOrderPost[]): Observable<boolean> {
      return this.apiService.StopDebitOrder.create(payload, null, { accountId: itemAccountId })
         .map(response => this.isDisputeOrderSuccess(response.metadata, Constants.metadataKeys.stopDebitOrder));
   }
   cancelStopDebitOrder(itemAccountId: string, queryParams: ICancelStopOrderPost): Observable<boolean> {
      return this.apiService.CancelStopOrder.remove(itemAccountId + Constants.routeUrls.stopPayment, queryParams)
         .map(response => this.isDisputeOrderSuccess(response.metadata, Constants.metadataKeys.cancelStopOrder));
   }
   getDebitOrderReasons(reasonType: string): Observable<IDebitOrderReasons[]> {
      return this.apiService.DebitOrderReasons.getAll(null, { reasonType: reasonType }).map(response => response ? response.data : []);
   }
   setAccountData(value) {
      this.accountData = value;
   }

   getAccountData() {
      return this.accountData;
   }

   /* Get the unilateral limit indicator */
   getUnilateralLimitIndicator(): Observable<IApiResponse> {
      return this.apiService.UnilateralLimitIndicatorDetails.getAll().map((response) => response);
   }

   /* Update unilateral master toggle indicator to On/Off */
   updateUnilateralMasterToggleIndicator(value, unilateralLimitIndicator: boolean): Observable<IApiResponse> {
      const queryParam: any = Constants.unilateralRequest;
      queryParam.unilateralLimitIndicator = unilateralLimitIndicator;
      queryParam.unilateralIndicatorToAll = value;
      queryParam.indicatorType = queryParam.indicatorType;
      return this.apiService.UnilateralLimitIndicatorUpdate.update(queryParam, null, null).map((response) => response ? response : null);
   }

   /* Update unilateral limit indicator to On/Off */

   updateUnilateralLimitIndicator(unilateralIndicatorToAll: boolean,
      unilateralLimitIndicator: boolean, plasticId: number): Observable<IApiResponse> {
      const queryParam: any = Constants.unilateralRequest;
      queryParam.unilateralLimitIndicator = unilateralLimitIndicator;
      queryParam.unilateralIndicatorToAll = unilateralIndicatorToAll;
      queryParam.plasticId = plasticId;
      queryParam.indicatorType = queryParam.indicatorType;
      return this.apiService.UnilateralLimitIndicatorUpdate.update(queryParam, null, null).map((response) => response ? response : null);
   }

   /* Get the approve it status */
   getApproveItOtpStatus(tvsCode: string, referenceId: string): Observable<IOutOfBandResponse> {
      const request: IOutOfBandRequest = {
         transactionVerificationCode: tvsCode,
         verificationReferenceId: referenceId
      };
      return this.apiService.OutOfBandOtpStatus.create(request);
   }

   // scheduled transactions
   // TODO - move to separate service if required
   getScheduledPaymentDetail(transactionID: number): Observable<IScheduledTransaction> {
      return this.apiService.ScheduledPaymentDetail.getAll(null, { transactionID: transactionID })
         .map(response => response ? response.data : {});
   }

   getScheduledTransferDetail(transactionID: number): Observable<IScheduledTransaction> {
      return this.apiService.ScheduledTransferDetail.getAll(null, { transactionID: transactionID })
         .map(response => response ? response.data : {});
   }

   getScheduledPrepaidDetail(transactionID: number): Observable<IScheduledTransaction> {
      return this.apiService.ScheduledPrepaidDetail.getAll(null, { transactionID: transactionID })
         .map(response => response ? response.data : {});
   }

   getPaymentAccounts(): Observable<IAccountDetail[]> {
      return this.apiService.PaymentAccounts.getAll().map(response => response ? response.data : []);
   }

   getTransferAccounts(): Observable<IAccountDetail[]> {
      return this.apiService.TransferAccounts.getAll().map(response => response ? response.data : []);
   }

   getPrepaidAccounts(): Observable<IAccountDetail[]> {
      return this.apiService.PrepaidAccounts.getAll().map(response => response ? response.data : []);
   }

   saveScheduledPaymentDetail(data: IScheduledTransaction): Observable<ITransactionMetaData> {
      data.requestId = this.schdedulePaymentGUID;
      return this.apiService.ScheduledPaymentDetail.update(data, null, { transactionID: data.transactionID })
         .map(response => response.metadata);
   }

   createGUID() {
      this.schdedulePaymentGUID = UUID.UUID();
   }

   saveScheduledTransferDetail(data: IScheduledTransaction): Observable<ITransactionMetaData> {
      data.requestId = this.schdedulePaymentGUID;
      return this.apiService.ScheduledTransferDetail.update(data, null, { transactionID: data.transactionID })
         .map(response => response.metadata);
   }

   saveScheduledPrepaidDetail(data: IScheduledTransaction): Observable<ITransactionMetaData> {
      delete data['notificationDetail'];
      data.requestId = this.schdedulePaymentGUID;
      return this.apiService.ScheduledPrepaidDetail.update(data, null, { transactionID: data.transactionID })
         .map(response => response.metadata);
   }

   isTransactionStatusValid(metadata: ITransactionMetaData) {
      return CommonUtility.isTransactionStatusValid(metadata);
   }

   removeScheduledPaymentDetail(transactionID: number, queryParam: any): Observable<IApiResponse> {
      return this.apiService.RemoveScheduledPaymentDetail.remove(transactionID, queryParam)
         .map(response => response.metadata);
   }

   removeScheduledTransferDetail(transactionID: number, queryParam: any): Observable<IApiResponse> {
      return this.apiService.ScheduledTransfer.remove(transactionID, queryParam)
         .map(response => response.metadata);
   }

   removeScheduledPrepaidDetail(transactionID: number, queryParam: any): Observable<IApiResponse> {
      return this.apiService.ScheduledMobileTrasactions.remove(transactionID, queryParam)
         .map(response => response.metadata);
   }

   // To get all the account statement preferences
   getAccountStatementPreferences(itemAccountId: string): Observable<IApiResponse> {
      const routeParams = { itemAccountId: itemAccountId };
      return this.apiService.AccountStatementPreferences.getAll(null, routeParams)
         .map((response) => response ? response : {});
   }

   // To update the account statement preferences
   updateAccountStatementPreferences(statementPreferencesDetails: IStatementPreferences): Observable<IMetaData> {
      return this.apiService.UpdateStatementPreferences
         .update(statementPreferencesDetails, null, { itemAccountId: statementPreferencesDetails.itemAccountId })
         .map((response) => response ? response.metadata : null);
   }

   /* Status of statement preferences after approving the transaction by user through approve it functionality */
   statusStatementPreferences(verificationReferenceId: string): Observable<any> {
      const routeParams = { verificationReferenceId: verificationReferenceId };
      return this.apiService.StatementPreferencesStatus.create(null, null, routeParams)
         .map((response) => response ? response : null);
   }

   // to get postal codes
   getPostalCodes(postalCodeType: string, suburbSearch: string): Observable<IPostalCode[]> {
      const queryParams = { postalcodetype: postalCodeType, suburbsearch: suburbSearch };
      return this.apiService.PostalCodes.getAll(queryParams).map((response) => response ? response.data : []);
   }

   saveSuccessState(transactionDetail: IScheduledTransaction) {
      this.successState = {
         transaction: transactionDetail,
         isSuccess: true
      };
   }

   resetSuccessState() {
      this.successState = null;
   }

   getSuccessState() {
      return this.successState;
   }

   getLinkableAccounts(): Observable<any> {
      return this.apiService.LinkableAccounts.getAll().map((res) => res ? res : []);
   }
   linkAccounts(linkableAccounts: ILinkableAccounts[]): Observable<any> {
      const linkAccounts: ILinkAccount[] = this.getLinkablePostData(linkableAccounts);
      return this.apiService.linkAccounts.create(linkAccounts).map((response) => response);
   }
   getLinkablePostData(linkableAccounts: ILinkableAccounts[]): ILinkAccount[] {
      let linkAccounts: ILinkAccount[];
      let linkAccount: ILinkAccount;
      linkAccounts = [];

      linkableAccounts.forEach((linkableAccount) => {
         linkAccount = {
            AccountNickname: linkableAccount.AccountType,
            AccountNumber: linkableAccount.AccountNumber,
            AccountType: linkableAccount.AccountType,
            Status: linkableAccount.Status
         };
         linkAccounts.push(linkAccount);
      });

      return linkAccounts;
   }
   refreshAccounts(): Observable<IApiResponse> {
      return this.apiService.refreshAccounts.getAll().map(response => response);
   }

   notifyAccountsUpdate() {
      this.announcedAccountsRefresh.next(true);
   }

   AcceptMandateOrder(queryParam, routeParams) {
      return this.apiService.ManageMandateOrders.create(null, queryParam, routeParams).map(response => response.MetaData);
   }
   DeclineMandateOrder(queryParam, routeParams) {
      return this.apiService.ManageMandateOrders.create(null, queryParam, routeParams).map(response => response == null ?
         response : response.MetaData
      );
   }
   setDefaultAccount(preference: IPreferenceDetail[]) {
      return this.apiService.clientPreferences.create(preference);
   }
   isMandateSuccess(response): boolean {
      return response['result']['resultCode'] === 0;
   }

   getAccountNumber(accountNumber: number): number {
      return +accountNumber.toString().replace(/[^\d]/g, '');
   }
   setDashboardAccountsData(accounts: IDashboardAccounts[]) {
      this.dashboardAccounts = accounts;
   }

   getDashboardAccountsData(): IDashboardAccounts[] {
      return this.dashboardAccounts;
   }

   resetDashboardAccountsData() {
      this.dashboardAccounts = null;
   }

   /* this API is used to share account information via email to provided recipeints */
   shareAccount(shareAccountReqParams: IShareAccountReq): Observable<IApiResponse> {
      return this.apiService.ShareAccount.create(shareAccountReqParams);
   }

   /* Get universal branch codes */
   getUniversalBranchCodes(): Observable<IUniversalBranchCode[]> {
      return this.apiService.UniversalBranchCodes.getAll().map(response => response !== null ? response.data : response);
   }

   // return verification reference id
   upliftAccountDormancy(itemAccountId: number, dormancyRequest: IDormancyRequest): Observable<IApiResponse> {
      return this.apiService.UpliftDormantAccount.update(dormancyRequest, null, { itemAccountId: itemAccountId })
         .map(response => response);
   }

   // return status PENDING or SUCCESS or FALLBACK
   upliftAccountDormancyStatus(verificationReferenceId: string): Observable<IApiResponse> {
      return this.apiService.UpliftDormantAccountStatus.create(
         null,
         null,
         { verificationReferenceId: verificationReferenceId })
         .map((response) => response);
   }

   getApproveItStatus(transactionID: string): Observable<IOutOfBandResponse> {
      return this.apiService.UpliftDormantAccountStatus.create(null, null, { verificationReferenceId: transactionID });
   }

   getHideShowAccounts(): Observable<ILinkedAccount[]> {
      return this.apiService.LinkedHideShowAccounts.getAll().map((response) => response ? response.data.accountList : []);
   }

   updateAccountEnable(data: IAccountLists, preferenceKey: string): Observable<IAccountLists> {
      return this.apiService.UpdateEnableAccount.update(data, null, { prefKey: preferenceKey }).
         map(response => response.metadata);
   }
   saveAccountName(data: IAccountRename, ItemAccountId: string): Observable<IRenameAccount> {
      return this.apiService.RenameAccount.update(data, null, { itemAccountId: ItemAccountId })
         .map(response => response.data);
   }

   getAccountBalanceDetail(itemAccountId: number): Observable<IAccountBalanceDetail> {
      return this.apiService.AccountBalanceDetails.getAll(null, { itemAccountId: itemAccountId })
         .map(response => response.data);
   }

   getAccountDetails(itemAccountId: number): Observable<IClientAccountDetail> {
      return this.apiService.AccountDetails.getAll(null, { itemAccountId: itemAccountId }).map(response => response);
   }

   isOverDraftAccount(overdraftLimit: number): boolean {
      const selectedAccount = this.getAccountData();
      if (this.getAccountData().AccountType === Constants.VariableValues.accountTypes.currentAccountType.code) {
         return !this.getAccountData().IsAlternateAccount && overdraftLimit > 0;
      }
   }

   // added to check if transaction details are available for this account type
   hasTransactionsAndDetailsForIS(accountType: string): boolean {
      const accountTypes = Constants.VariableValues.accountTypes;
      const validAccountTypes = [accountTypes.rewardsAccountType.code, accountTypes.investmentAccountType.code,
      accountTypes.treasuryInvestmentAccountType.code, accountTypes.unitTrustInvestmentAccountType.code,
      accountTypes.foreignCurrencyAccountType.code, accountTypes.homeLoanAccountType.code, accountTypes.personalLoanAccountType.code,
      accountTypes.mfcvafLoanAccountType.code, accountTypes.creditCardAccountType.code,
      accountTypes.currentAccountType.code, accountTypes.savingAccountType.code, accountTypes.travelCardAccountType.code];
      return validAccountTypes.indexOf(accountType) !== -1 ? true : false;
   }

   /* Return true If account is a primary account */
   isPrimaryAccount(): boolean {
      return !this.getAccountData().IsAlternateAccount;
   }

   // Get the overdraft limit attempts
   getAccountOverdraftAttempts(itemAccountId: Number): Observable<IApiResponse> {
      return this.apiService.AccountOverdraftAttempts.getAll(null, { itemAccountId: itemAccountId })
         .map(response => response);
   }

   // Change overdraft limit
   changeAccountOverdraftLimit
      (changeOverdraftLimitRequest: IChangeOverdraftLimitRequest): Observable<IResultDetail> {
      return this.apiService.AccountOverdraftLimit.create(changeOverdraftLimitRequest)
         .map(response => response.metadata.resultData[0].resultDetail[0]);
   }

   // MOD validations
   getOverdraftValidations(query): Observable<IValidation[]> {
      return this.apiService.OverdraftValidations.getAll(query).map(response => response ? response.data : []);
   }

   // Get the settlement balance details
   getSettlementDetails(itemAccountId: string, emailId?: string, accountType?: string): Observable<IApiResponse> {
      const params = accountType && CommonUtility.isMfcvafLoan(accountType) ? { itemAccountId: itemAccountId, email: emailId }
         : { itemAccountId: itemAccountId };
      return this.apiService.SettlementDetails.getAll(params).map(response => response);
   }

   // Send settlement quote to recipient email
   sendSettlementQuote(settlementQuote: ISettlementQuote, accountType?: string): Observable<IApiResponse> {
      if (accountType && CommonUtility.isMfcvafLoan(accountType)) {
         return this.getSettlementDetails(settlementQuote.itemAccountId, settlementQuote.emailId, accountType);
      } else {
         return this.apiService.SettlementQuotes.create(settlementQuote).map(response => response);
      }
   }

   // set the settlement data, using this function to share the data b/w componenets
   setSettlementData(settlementData: ISettlementDetail) {
      this.settlementData = settlementData;
   }

   // get the settlement data, using this function to share the data b/w componenets
   getSettlementData() {
      return this.settlementData;
   }
   setTransactionsForCASA(transactions: ITransactionDetail[]) {
      this.transactions = transactions;
   }
   getTransactionsForCASA(): ITransactionDetail[] {
      return this.transactions;
   }
   showAlertMessage(alertMessage: IAlertMessage) {
      this.alertMessage.next(alertMessage);
   }

   // Document and statement
   getDocumentsList(itemAccountId): Observable<IDocumentList[]> {
      return this.apiService.DocumentRequest.getAll({ itemAccountId: itemAccountId })
         .map(response => response.data);
   }

   getBalanceDetails(itemAccountId: number): Observable<any> {
      return this.apiService.AccountBalanceDetails.getAll(null, { itemAccountId: itemAccountId }).
         map((response) => response ? response : []);
   }

   sendPaidUpLetter(request: IDocumentSendRequest): Observable<IApiResponse> {
      return this.apiService.DocumentRequest.create(request)
         .map(response => response);
   }

   // get the dcar range
   getDcarRange(dcarNumber: string): Observable<IDcarRangeDetails> {
      const routeParams = { dcarNumber: dcarNumber };
      return this.apiService.DcarRange.getAll(null, routeParams).map((response) => response ? response.data : null);
   }

   // Get data for MFC view
   getLoanDebitOrders(accountId: number, statusType: string): Observable<ILoanDebitOrderDetails[] | string> {
      return this.apiService.LoanDebitOrders.getAll({}, { accountId: accountId }).map((response) => {
         const resp = CommonUtility.getTransactionStatus(response.metadata, statusType);
         return response ? (resp.isValid ? response.data : resp.result) : [];
      });
   }

   // update data for MFC
   updateMfcDebitOrders(accountId: string, data: IManagePaymentDetailsPost): Observable<boolean> {
      return this.apiService.LoanDebitOrders.update(data, null, { accountId: accountId }).map(response =>
         response ? CommonUtility.getTransactionStatus(response.metadata, Constants.metadataKeys.upadteMfcPaymentDetails).isValid : false
      );
   }

   getTermsAndConditionsForMFC(versioncontent: string): Observable<ITermsAndConditions> {
      const noticePath = { noticeType: TermsAndConditionsConstants.includeTermsUpdateMFC[0] };
      return this.apiService.TermsAndConditionsItem.getAll({ versioncontent: versioncontent },
         noticePath).map((response) => this.getDecodedResponse(response));
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
   acceptTermsAndConditions(termAndCondition: ITermsAndConditions) {
      const noticePath = { noticeType: TermsAndConditionsConstants.includeTermsUpdateMFC[0] };
      return this.apiService.TermsAndConditionsItem.update(termAndCondition, null, noticePath).map(response => response);
   }

   getBanks(): Observable<IBank[]> {
      return this.apiService.Banks.getAll().map(response => response ? response.data : []);
   }

   transactionSearchMode(value: boolean) {
      this.transactionSearchModeEmitter.emit(value);
   }

   getAdvancedSearchData(itemAccountId, startDate, endDate, amountFrom = 0, amountTo = 0) {
      const data = {
         pagesize: this.numTransactions,
         startDate: startDate,
         endDate: endDate,
         fromAmount: amountFrom,
         toAmount: amountTo
      };
      return this.apiService.AccountTransactions.getAll(data, {
         itemAccountId: itemAccountId
      }).map((response) => this.isTransactionHistorySuccess(response) ? response.data : response.metadata);
   }

   getficaStatus(): Observable<IFicaResult> {
      return this.apiService.FicaStatus.getAll().map(response => response ? response.data : []);
   }

   getPartWithdrawalAmount(productType: number): Observable<IApiResponse> {
      return this.apiService.PartWithdrawalAmount.getAll(null, { type: productType }).map((response) => response ? response.data : []);
   }
   // set and get mfc cross border request
   setMfcCrossBorderRequest(request) {
      this.mfcCrossBorderRequest = request;
   }

   getMfcCrossBorderRequest() {
      return this.mfcCrossBorderRequest;
   }

   setMfcUpdatePostData(data: IManagePaymentDetailsPost) {
      this.mfcUpdatePostData = data;
   }
   getMfcUpdatePostData(): IManagePaymentDetailsPost {
      return this.mfcUpdatePostData;
   }

   getStatementDownload(startDate, endDate, accountNumber): Observable<any> {
      return this.apiService.StatementDownload.getAll({
         'accountNumber': accountNumber,
         'dateEnd': endDate,
         'dateStart': startDate
      }).map((response) => response);
   }
   getStartDateStatement(url: string): Observable<any> {
      return this.apiService.StartDateStatement.getBlob(Constants.mimeTypes.applicationPDF, { 'documentUrl' : url });
   }

   getIncomeTaxYears(yearStart, yearEnd, accountNumber): Observable<any> {
      return this.apiService.IncomeTaxYears.getAll({
         'accountNumber': accountNumber,
         'taxYearEnd': yearEnd,
         'taxYearStart': yearStart
      }).map((response) => response);
   }

   getIncomeTaxInvoice(url: string): Observable<any> {
      return this.apiService.StartDateStatement.getAll({
         'documentUrl' : url
      }).map((response) => response);
   }

   sendCrossBorderRequest(request: ICrossBorderRequest): Observable<IApiResponse> {
      return this.apiService.CrossBorderRequest.create(request).map(response => response);
   }

   // Load trip: Get country list
   getTripCountryList(): Observable<any> {
      return this.apiService.GetAllTripCountries.getAll().map(response => response ? response : []);
   }

   getTripBorderPostList(): Observable<any> {
      return this.apiService.GetAllTripBorderPosts.getAll().map(response => response ? response : []);
   }
   /**
   * Get the home loan status details
   *
   * @param {number} itemAccountId
   * @returns {IApiResponse}
   * @memberof AccountService
   *
   */
   getHomeLoanStatus(itemAccountId: number): Observable<IApiResponse> {
      const queryParams = { itemaccountid: itemAccountId };
      return this.apiService.HomeLoanStatus.getAll(queryParams).map(response => response);
   }

   getNotice(itemAccountId: number): Observable<IViewNoticeDetails[]> {
      return this.apiService.NoticeDetails.getAll(
         { 'itemAccountId': itemAccountId }, {}).
         map((response) => response ? response.data : []);
   }

   getAccountsForNotice(): Observable<IAccountInfo[]> {
      const noticePayout = Constants.labels.nowLabels.noticePayout;
      return this.apiService.LinkedAccounts.getAll({ 'type': noticePayout }).map(response => response ? response.data : []);
   }

   getApproveItStatusNow(): Observable<IOutOfBandResponse> {
      return this.apiService.NowStatus.create(
         null,
         null,
         { verificationId: this.transactionID });
   }
   updateTransactionID(transactionID: string) {
      if (transactionID) {
         this.transactionID = transactionID;
         this.isChangeSuccessful = true;
      }
   }

   deleteNotice(queryParam: string): Observable<IApiResponse> {
      return this.apiService.DeleteNotice.remove(queryParam).map(response => response.metadata);
   }

   createNotice(payload, routeParams): Observable<IApiResponse> {
      const validate = false;
      return this.apiService.NoticeDetails.create(payload, { 'validate': validate }, routeParams).map((response) => response);
   }
}
