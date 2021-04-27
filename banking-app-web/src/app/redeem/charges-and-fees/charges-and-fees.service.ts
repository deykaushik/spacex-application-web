import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../../core/services/api.service';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { SystemErrorService } from '../../core/services/system-services.service';
import { ChargesAndFeesPayModel } from './charges-and-fees-pay/charges-and-fees-pay.model';
import { ChargesAndFeesReviewModel } from './charges-and-fees-review/charges-and-fees-review.model';
import { Constants } from '../../core/utils/constants';

import * as models from './charges-and-fees.models';
import {
   IGetRateReq, IAccountDetail, IDashboardAccounts,
   IDashboardAccount, IResultStatus, IErrorEmitterResponse, IRewardsRedemption
} from '../../core/services/models';
import { BehaviorSubject } from 'rxjs/Rx';
import { IWorkflowStep, IWorkflowStepSummary } from '../../shared/components/work-flow/work-flow.models';
import { CommonUtility } from '../../core/utils/common';


@Injectable()
export class ChargesAndFeesService {

   /** Holds the workflow steps defined for charges and fees.. */
   public chargesAndFeesWorkFlowSteps: models.IChargesAndFeesWorkFlowSteps;
   /** Error messag to be shown to user. */
   public errorMessage: string;
   /** Callback to invokedd from the generic system error handler. */
   public callbackFromSystemService: EventEmitter<IErrorEmitterResponse> = new EventEmitter<IErrorEmitterResponse>();
   /** Subject for payment from rewards account list. */
   public rewardsAccountDataObserver = new BehaviorSubject<IAccountDetail[]>(null);
   /** Subject for payment from bank account list. */
   public bankAccountDataObserver = new BehaviorSubject<IAccountDetail[]>(null);
   /** Subject for payment from card account list. */
   public cardAccountDataObserver = new BehaviorSubject<IAccountDetail[]>(null);
   /** Subject for check account availability*/
   public accountAvailabilityObserver  = new BehaviorSubject<boolean>(null);
   /** Store greenback account */
   public rewardsAccount: IAccountDetail;
   /** Store transaction status reslult object. */
   public transactionStatus: IResultStatus = {
      isValid: false,
      reason: ''
   };
   public isAccountAvailable = true;

   private cachedPayload;

   public chargesAndFeesObserver = new BehaviorSubject<models.IProgramme>(null);

   /**
    * Creates an instance of ChargesAndFeesService.
    * @param {Router} router
    * @param {ApiService} apiService
    * @param {ClientProfileDetailsService} clientDetails
    * @param {SystemErrorService} systemErrorService
    * @memberof ChargesAndFeesService
    */
   constructor(
      public router: Router,
      private apiService: ApiService,
      private clientDetails: ClientProfileDetailsService,
      private systemErrorService: SystemErrorService
   ) { }

   /**
    * Initialize the work flow steps by setting up the models, API data
    * and view validation states.
    *
    * @memberof ChargesAndFeesService
    */
   initializeChargesAndFeesPayWorkflow() {
      this.chargesAndFeesWorkFlowSteps = {
         pay: {
            isNavigated: false,
            sequenceId: models.ChargesAndFeesStep.pay,
            model: new ChargesAndFeesPayModel(),
            isDirty: false
         },
         review: {
            isNavigated: false,
            sequenceId: models.ChargesAndFeesStep.review,
            model: new ChargesAndFeesReviewModel(),
            isDirty: false
         }
      };
      const payload: IGetRateReq = {
         programmeId: Constants.labels.gbtype
      };
      Observable.forkJoin([
         this.apiService.DashboardAccounts.getAll(),
         this.apiService.GetChargesAndFees.getAll()
      ]).subscribe((responses: any[]) => {

         const dashboardAccounts = responses[0];
         this.updateAccountsData(dashboardAccounts ? dashboardAccounts : []);

         const programmeData = responses[1];
         this.updateChargesAndFeesData(programmeData['data']);
      });
   }

   /**
    * Update the pay model to the new value passed.
    *
    * @param {models.IUnitTrustsBuy} vm
    * @memberof ChargesAndFeesPay
    */
   savePayInfo(vm: models.IChargesAndFeesPay) {
      this.chargesAndFeesWorkFlowSteps.pay.model.updateModel(vm);
      this.chargesAndFeesWorkFlowSteps.pay.isNavigated = true;
   }

   /**
    *
    * @param programmeData
    */
   updateChargesAndFeesData(programmeData: models.IProgramme) {
      this.chargesAndFeesObserver.next(programmeData);
   }

   /**
    * Get the pay model reference.
    *
    * @returns {models.IChargesAndFeesPay}
    * @memberof ChargesAndFeesService
    */
   getPayVm(): models.IChargesAndFeesPay {
      return this.chargesAndFeesWorkFlowSteps.pay.model.getViewModel();
   }

   /**
    * Get the step summary of any step during edit operation, used by workflow.
    *
    * @param {IWorkflowStep} currentStep
    * @memberof ChargesAndFeesService
    */
   getStepInfo(currentStep: IWorkflowStep) {
      currentStep.summary = this.getStepSummary(currentStep.summary.sequenceId, false);
   }

   /**
    * Get the step summary of initial step, used by workflow.
    *
    * @param {IWorkflowStep} currentStep
    * @memberof ChargesAndFeesService
    */
   getStepInitialInfo(currentStep: IWorkflowStep) {
      currentStep.summary = this.getStepSummary(currentStep.summary.sequenceId, true);
   }

   /**
    * Get the from account list form the Dasboard account list, we have to map dashboard
    * account to account details to re-use the existing component in from account.
    *
    * @param {IDashboardAccounts[]} accounts
    * @returns {IAccountDetail[]}
    * @memberof ChargesAndFeesService
    */
   updateAccountsData(accounts: IDashboardAccounts[]): void {
      const accountsList: IAccountDetail[] = [];
      accounts.forEach(container => {
         if (container.ContainerName === Constants.VariableValues.accountContainers.rewards) {
            this.setRewardsAccount(container.Accounts);
         } else if (container.ContainerName === Constants.VariableValues.accountContainers.bank) {
            this.setBankAccounts(container.Accounts);
         } else if (container.ContainerName === Constants.VariableValues.accountContainers.card) {
            this.setCardAccounts(container.Accounts);
         }
      });
      this.accountAvailabilityObserver.next(this.isAccountAvailable);
   }

   /**
    * Sets data oberserver for saving bank accounts and current accounts.
    *
    * @param accounts
    */
   setRewardsAccount(dashboardAccounts: IDashboardAccount[]): void {
      const accountList: IAccountDetail[] = [];
      const accounts = dashboardAccounts.filter(dashboardAccount => {
         return dashboardAccount.RewardsProgram === Constants.labels.gbtype &&
            dashboardAccount.AccountType === Constants.VariableValues.accountTypes.rewardsAccountType.code;
      });
      accounts.forEach(account => accountList.push(this.getAccountDetails(account) as any));
      this.rewardsAccountDataObserver.next(accountList);
   }

   /**
    * Sets data oberserver for saving bank accounts and current accounts.
    *
    * @param accounts
    */
   setBankAccounts(accounts: IDashboardAccount[]): void {
      const accountList: IAccountDetail[] = [];
      accounts.forEach(account => {
         if (account.AccountType === Constants.VariableValues.accountTypes.currentAccountType.code ||
            account.AccountType === Constants.VariableValues.accountTypes.savingAccountType.code) {
            accountList.push(this.getAccountDetails(account) as any);
         }
      });
      this.setAccountAvailability(accountList);
      this.bankAccountDataObserver.next(accountList);
   }

   /**
    * Sets data oberserver for card accounts.
    *
    * @param accounts
    */
   setCardAccounts(accounts: IDashboardAccount[]): void {
      const accountList: IAccountDetail[] = [];
      accounts.forEach(account => {
         if (account.AccountType === Constants.VariableValues.accountTypes.creditCardAccountType.code) {
            accountList.push(this.getAccountDetails(account) as any);
         }
      });
      this.setAccountAvailability(accountList);
      this.cardAccountDataObserver.next(accountList);
   }

   /*
   * check if account available in the list then set the value
    * @param accountlist
   */
   setAccountAvailability(accountList) {
      if (accountList.length > 0) {
            this.isAccountAvailable = false;
      }
   }

   /**
    * Return IAccountDetail object.
    *
    * @param account
    */
   getAccountDetails(account) {
      return {
         itemAccountId: account.ItemAccountId,
         accountNumber: account.AccountNumber,
         productCode: '',
         productDescription: '',
         isPlastic: false,
         accountType: account.AccountType,
         nickname: account.AccountName,
         sourceSystem: '',
         currency: account.Currency,
         availableBalance: account.AvailableBalance,
         rewardsProgram: account.RewardsProgram,
         currentBalance: account.Balance,
         profileAccountState: '',
         accountLevel: '',
         viewAvailBal: '',
         viewStmnts: '',
         isRestricted: false,
         viewCurrBal: false,
         viewCredLim: false,
         viewMinAmtDue: false,
         isAlternateAccount: false,
         allowCredits: false,
         allowDebits: true,
      };
   }

   /**
    * Check the dirty state of the view to notify user about unsaved changes on navigation.
    *
    * @returns true when pay step is dirty.
    * @memberof ChargesAndFeesService
    */
   checkDirtySteps() {
      return this.chargesAndFeesWorkFlowSteps.pay.isDirty && !this.chargesAndFeesWorkFlowSteps.review.isDirty;
   }

   /**
    * Refresh the accounts list.
    *
    * @memberof ChargesAndFeesService
    */
   refreshAccounts() {
      this.rewardsAccountDataObserver = new BehaviorSubject<IAccountDetail[]>(null);
      this.apiService.refreshAccounts.getAll().subscribe();
   }

   /**
    * Get the summary of the step like navigation state, header text, sequence id etc.
    *
    * @param {number} stepId
    * @param {boolean} isDefault
    * @returns {IWorkflowStepSummary}
    * @memberof ChargesAndFeesService
    */
   getStepSummary(stepId: number, isDefault: boolean): IWorkflowStepSummary {
      const stepSummary: IWorkflowStepSummary = {
         isNavigated: false,
         sequenceId: 0,
         title: null
      };
      let isNavigated = true;
      switch (stepId) {
         case models.ChargesAndFeesStep.pay:
            isNavigated = this.chargesAndFeesWorkFlowSteps.pay.isNavigated;
            stepSummary.title = this.chargesAndFeesWorkFlowSteps.pay.model.getStepTitle(isNavigated, isDefault);
            stepSummary.isNavigated = this.chargesAndFeesWorkFlowSteps.pay.isNavigated;
            stepSummary.sequenceId = models.ChargesAndFeesStep.pay;
            break;
         case models.ChargesAndFeesStep.review:
            isNavigated = this.chargesAndFeesWorkFlowSteps.review.isNavigated;
            stepSummary.title = this.chargesAndFeesWorkFlowSteps.review.model.getStepTitle();
            stepSummary.isNavigated = this.chargesAndFeesWorkFlowSteps.review.isNavigated;
            stepSummary.sequenceId = models.ChargesAndFeesStep.review;
            break;
         default:
            throw new Error('no matching step found!');
      }
      return stepSummary;
   }
   isStatusNavigationAllowed() {
      return this.chargesAndFeesWorkFlowSteps && this.chargesAndFeesWorkFlowSteps.pay.isNavigated;
   }

   /**
   * Reset pay model to start new transaction.
   *
   * @memberof ChargesAndFeesService
   */
   resetPayModel() {
      this.transactionStatus = {
         isValid: false,
         reason: ''
      };
      this.chargesAndFeesWorkFlowSteps.pay.isNavigated = false;
   }

   /**
   * Redem the required against the fee and charges. Returns observable which will
   * succeed if got any response from the server and will fail when there is any
   * error while communicating to the server.
   * If isRetry is true then use the already generate payload object instead of
   * creating a unique one.
   *
   * @param {boolean} [isRetry=false]
   * @returns {Observable<any>}
   * @memberof ChargesAndFeesService
   */
   redemRewards(isRetry = false): Observable<any> {
      return Observable.create(observer => {
         this.apiService.RewardsRedemption.create(this.getRedemptionPayload(isRetry))
            .subscribe(res => {
               const status = CommonUtility.getResultStatus(res.metadata);
               this.transactionStatus = status;
               const vm = this.getPayVm();
               vm.requestDate = new Date();
               vm.transactionReference = (res.data as IRewardsRedemption).redemptionReferenceNumber;
               this.savePayInfo(vm);
               observer.next(status);
               observer.complete();
            }, err => {
               this.raiseSystemError(true);
               observer.error(new Error('Error'));
               observer.complete();
            });
      });
   }

   /**
    * To get payload for redeem for charges and fees
    *
    * @param isRetry
    */
   getRedemptionPayload(isRetry = false) {
      let payload;
      if (isRetry && this.cachedPayload) {
         payload = this.cachedPayload;
      } else {
         const details = this.clientDetails.getClientPreferenceDetails();
         const productList = [];
         const payVm = this.getPayVm();
         const forAccount = payVm.forAccount;
         const fromAccount = payVm.fromAccount;
         let counter = 1;
         const accountTmp = {} as any;
         if (payVm.costRands > 0) {
            // API expect cost points to be max upto two decimal.
            accountTmp.ProductCostPoints = +payVm.costPoints.toFixed(2);
            accountTmp.ProductCostRands = +payVm.costRands.toFixed(2);
            accountTmp.ProductCount = counter;
            accountTmp.ProductCategory = payVm.productCategory;
            accountTmp.ProductReferenceNumber = 'Prod' + counter;
            accountTmp.ProductPropertyList = [];
            productList.push(accountTmp);
            counter++;
         }
         payload = {
            RewardsAccountNumber: fromAccount.accountNumber,
            CustomerNo: details.CisNumber.toString(),
            redemptionReferenceNumber: this.getReferenceNumber(fromAccount.accountNumber),
            ProductList: productList
         };
         this.setPayloadForProduct(payVm.productCategory, payload);
         this.cachedPayload = payload;
      }
      return payload;
   }
    /**
    * To get the reference number on basis of account number.
    * @param accountNumber
    */
   getReferenceNumber(accountNumber: string) {
     const referenceArr = [];
     const uuid = '' + accountNumber + new Date().getTime();
       // split uuid in to batch of 9 and perform 36 operation.
       referenceArr.push((+uuid.substring(0, 9)).toString(36));
       referenceArr.push((+uuid.substring(9, 18)).toString(36));
       referenceArr.push((+uuid.substring(18)).toString(36));

       return referenceArr.join('').toUpperCase();

   }
   /**
    * To get the domicile branch number on basis of account number.
    * @param accountId
    */
   getDomicileBranchNumber(accountId: string): Observable<any>  {
      return Observable.create(observer => {
            this.apiService.DomicileBranchNumber.getAll(null, { itemAccountId: accountId})
            .subscribe(res => {
                  if (!res.data.domicileBranchNumber) {
                        observer.error(new Error('Error'));
                        this.raiseSystemError(true);
                  }else {
                        observer.next(res.data.domicileBranchNumber);
                  }
                  observer.complete();
            }, err => {
                  this.raiseSystemError(true);
                  observer.error(new Error('Error'));
                  observer.complete();
            });
      });
   }

   /**
    *
    * @param productCategory
    * @param payload
    */
   setPayloadForProduct(productCategory: string, payload: any) {
      const product = payload.ProductList[0];
      const payVm = this.getPayVm();
      if (productCategory === Constants.VariableValues.rewardsProductCategories.bankCharges.code) {
         product.SupplierCode = payVm.supplierCode;
         product.SupplierName = payVm.supplierName;
         product.ProductCode = payVm.productCode;
         product.ProductName = payVm.productName;
         product.ProductPropertyList.push({
            'PropertyName': 'AccountNumber',
            'PropertyValue': payVm.forAccount.accountNumber
         });
         product.ProductPropertyList.push({
            'PropertyName': 'AccountType',
            'PropertyValue': payVm.forAccount.accountType
         });
         product.ProductPropertyList.push({
            'PropertyName': 'BranchCode',
            'PropertyValue': payVm.domicileBranchNumber
         });
      } else if (productCategory === Constants.VariableValues.rewardsProductCategories.linkageFees.code) {
         payload.RedemptionReferenceNumber = 'CASAS001';
         product.ProductReferenceNumber = 'CAMS';
         product.SupplierCode = 'CAMS';
         product.SupplierName = 'CAMS';
         product.ProductCode = 'GBFEE';
         product.ProductCategory = 'RewardsFees';
         product.ProductName = 'RewardsFees';
         product.ProductPropertyList.push({
            'PropertyName': 'CardNumber',
            'PropertyValue': '377095503804374'
         });
      }
   }

   /**
    * Raise the error to the Global error indicator and also specify the operation to be
    * performed on user action on handler using callback.
    *
    * @param {boolean} [isCallback=false]
    * @memberof ChargesAndFeesService
    */
   raiseSystemError(isCallback: boolean = false) {
      if (isCallback) {
         const callback = this.callbackFromSystemService.subscribe((response: IErrorEmitterResponse) => {
            callback.unsubscribe();
            this.resetPayModel();
            this.router.navigateByUrl(Constants.routeUrls.dashboard);
         });
      }
      this.systemErrorService.raiseError({
         error: Constants.VariableValues.sytemErrorMessages.transactionMessage,
         callbackEmitter: isCallback && this.callbackFromSystemService
      });
   }
}
