import { Component, OnInit, OnChanges, EventEmitter, Input, Output, Injector } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ISubscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { AccountService } from '../account.service';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { OutofbandVerificationComponent } from '../../shared/components/outofband-verification/outofband-verification.component';
import { BaseComponent } from '../../core/components/base/base.component';
import {
   ITransactionDetailsData, IDashboardAccounts, IClientDetails,
   IDashboardAccount, IApiResponse, INotification, IValidation
} from '../../core/services/models';
import { Constants } from '../../core/utils/constants';
import { CommonUtility } from '../../core/utils/common';
import { AmountTransformPipe } from '../../shared/pipes/amount-transform.pipe';
import { GAEvents } from '../../core/utils/ga-event';

@Component({
   selector: 'app-uplift-dormancy',
   templateUrl: './uplift-dormancy.component.html',
   styleUrls: ['./uplift-dormancy.component.scss']
})
export class UpliftDormancyComponent extends BaseComponent implements OnChanges {
   @Input() transactionDetailsData: ITransactionDetailsData;
   @Output() notification: EventEmitter<INotification> = new EventEmitter<INotification>();
   itemAccountId: number;
   balance: number;
   accountContainers: IDashboardAccounts[];
   clientDetails: IClientDetails;
   isDormantAccount: boolean;
   transactionID: string;
   labels = Constants.labels.upliftDormancy;
   values = Constants.VariableValues.upliftDormancy;
   route = Constants.routeUrls;
   activateAccountFlow: boolean;
   transferAmountFlow: boolean;
   locateBranchFlow: boolean;
   viewTransactionDetails: boolean;
   bsModalRef: BsModalRef;
   modalSubscription: ISubscription;
   showLoader: boolean;
   dormancyNotification: INotification;
   isOfTypeTransferAccounts: boolean;
   accountBalance: number;
   skeletonMode: boolean;
   bsModalRefConst = {
      animated: true,
      keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true
   };

   subHeaderInfo: string;
   btnLabel: string;
   branchLocatorURL: string;
   amountTransform = new AmountTransformPipe();

   constructor(private accountService: AccountService,
      private modalService: BsModalService, private clientPreferences: ClientProfileDetailsService, injector: Injector,
      private router: Router) {
      super(injector);
   }

   ngOnChanges(change) {
      if (this.transactionDetailsData) {
         this.skeletonMode = true;
         this.accountContainers = this.transactionDetailsData.accountContainers;
         this.balance = this.transactionDetailsData.balance;
         this.itemAccountId = this.transactionDetailsData.itemAccountId;
         this.getOverdraftValidations();
      }
   }

   /* Get validations */
   getOverdraftValidations() {
      this.skeletonMode = true;
      const query = { 'validationType': 'AccountDormancy' };
      this.accountService.getOverdraftValidations(query).subscribe((validations: IValidation[]) => {
         validations[0].setting.filter(key => {
            if (key.validationKey === 'Maximum') { this.accountBalance = parseInt(key.validationValue, 10); }
         });
         this.skeletonMode = false;
         this.getDormantAccount();
      }, error => {
         this.accountBalance = this.values.accountBalance;
         this.skeletonMode = false;
         this.getDormantAccount();
      });
   }

   // checking account is dormant or not and also checking is profile have a transferable account.
   getDormantAccount() {
      this.isOfTypeTransferAccounts = false;
      this.isDormantAccount = false;
      if (this.accountContainers) {
         for (let i = 0; i < this.accountContainers.length; i++) {
            if (this.values.containerName.indexOf(this.accountContainers[i].ContainerName) !== -1) {
               for (let j = 0; j < this.accountContainers[i].Accounts.length; j++) {
                  const itemAccountIdInt = (parseInt(this.accountContainers[i].Accounts[j].ItemAccountId, 10));
                  if (itemAccountIdInt === this.itemAccountId) {
                     this.isDormantAccount = this.accountContainers[i].Accounts[j]
                        .AccountStatusCode === this.values.dormantAccountStatus;
                  }
                  if (!this.isOfTypeTransferAccounts) {
                     this.isOfTypeTransferAccounts = itemAccountIdInt !== this.itemAccountId
                        && this.accountContainers[i].Accounts[j].Balance >= 0;
                  }
               }
            }
         }
      }

      if (this.isDormantAccount) {
         this.locateBranchFlow = (this.balance > this.accountBalance || this.getFicaStatus()) ? this.getLocateBranchFlow() : false;
         this.activateAccountFlow = (this.balance >= 0 &&
            this.balance <= this.values.accountBalance && !this.getFicaStatus()) ? this.getActivateAccountFlow() : false;
         this.transferAmountFlow = (this.balance < 0 && !this.getFicaStatus()) ? this.getTransferAmountFlow() : false;
         this.viewTransactionDetails = false;
      } else {
         this.viewTransactionDetails = true;
         this.locateBranchFlow = false;
         this.transferAmountFlow = false;
         this.activateAccountFlow = false;
      }
   }

   // set header and button label for branch locate flow
   getLocateBranchFlow() {
      this.subHeaderInfo = !this.getFicaStatus() ? this.labels.locateBranchInfo : this.labels.ficaInfo;
      this.btnLabel = this.labels.locateBranch;
      this.branchLocatorURL = encodeURI(this.route.locateBranch + '/' + this.itemAccountId);
      return true;
   }

   // set header and button label for activate account flow
   getActivateAccountFlow() {
      this.subHeaderInfo = this.labels.dormantInfo;
      this.btnLabel = this.labels.activate;
      this.isOfTypeTransferAccounts = !this.isOfTypeTransferAccounts ? !this.isOfTypeTransferAccounts : this.isOfTypeTransferAccounts;
      return true;
   }

   // set header and button label for transfer flow
   getTransferAmountFlow() {
      this.branchLocatorURL = encodeURI(this.route.locateBranch + '/' + this.itemAccountId);
      const transferLabel = this.isOfTypeTransferAccounts ? this.labels.transferLabel : this.labels.deposit;
      this.subHeaderInfo = CommonUtility.format(this.labels.fundTransferMsg, transferLabel,
         this.amountTransform.transform('' + this.balance * -1));
      this.btnLabel = this.labels.locateBranch;
      return true;
   }

   // return true if profile having FICA code 700, 701, 800
   getFicaStatus() {
      this.clientDetails = this.clientPreferences.getClientPreferenceDetails();
      if (this.clientDetails) {
         return this.values.ficaCode.indexOf(this.clientDetails.FicaStatus) === -1 ? true : false;
      }
   }
   // call approve It functionality
   activateDormantAccount() {
      this.showLoader = true;
      const activateDormantAccountGAEvent = GAEvents.dormantAccount.activate;
      this.sendEvent(activateDormantAccountGAEvent.eventAction, activateDormantAccountGAEvent.label,
         null, activateDormantAccountGAEvent.category);
      this.accountService.upliftAccountDormancy(this.itemAccountId, this.values.dormancyRequest)
         .subscribe((upliftDormancyDetails: IApiResponse) => {
            let responseStatus = '';
            const resStatus = upliftDormancyDetails.metadata.resultData[0].resultDetail.find(item =>
               item.operationReference === Constants.metadataKeys.secureTransaction ||
               item.operationReference === Constants.metadataKeys.transaction);
            responseStatus = resStatus ? resStatus.status : '';
            if (responseStatus === Constants.metadataKeys.failure) {
               this.notApproved();
            }
            if (responseStatus === Constants.metadataKeys.pending) {
               this.transactionID = upliftDormancyDetails.metadata.resultData[0].transactionID;
               this.bsModalRef = this.modalService.show(
                  OutofbandVerificationComponent,
                  Object.assign(
                     {},
                     this.bsModalRefConst,
                     { class: '' }
                  )
               );
               this.getApproveItStatus();
               this.bsModalRef.content.resendApproveDetails.subscribe(() => {
                  this.resendApproveDetails();
               });
               this.getOTPStatus();
               this.unSubscribeModelService();
            } else if (responseStatus === Constants.metadataKeys.success) {
               this.approved();
            }
         }, error => {
            this.showLoader = false;
         });
   }

   // return approve it status (SUCCESS, FALLBACK, DECLINED, PENDING)
   getApproveItStatus() {
      this.bsModalRef.content.getApproveItStatus.subscribe(() => {
         this.accountService.upliftAccountDormancyStatus(this.transactionID).subscribe(approveItResponse => {
            this.transactionID = approveItResponse.metadata.resultData[0].transactionID;
            this.bsModalRef.content.processApproveItResponse(approveItResponse);
         });
      });
      this.bsModalRef.content.updateSuccess.subscribe(value => {
         if (value) {
            this.approved();
         }
      });
   }

   // call OTP service from transaction API and also validate that OTP
   getOTPStatus() {
      this.bsModalRef.content.getOTPStatus.subscribe(otpValue => {
         this.accountService.getApproveItOtpStatus(otpValue, this.transactionID)
            .subscribe(otpResponse => {
               this.bsModalRef.content.processApproveUserResponse(otpResponse);
            });
      });
      this.bsModalRef.content.otpIsValid.subscribe(() => {
         this.accountService.getApproveItStatus(this.transactionID).subscribe(approveItResponse => {
            this.bsModalRef.content.processApproveItResponse(approveItResponse);
         });
      });
   }

   // close all pop-ups related to approve it functionality
   unSubscribeModelService() {
      this.showLoader = false;
      this.modalSubscription = this.modalService.onHidden.asObservable()
         .subscribe(() => {
            try {
               this.bsModalRef.content.otpIsValid.unSubscribe();
            } catch (e) { }
            try {
               this.bsModalRef.content.getApproveItStatus.unSubscribe();
            } catch (e) { }

            try {
               this.bsModalRef.content.resendApproveDetails.unSubscribe();
            } catch (e) { }

            try {
               this.bsModalRef.content.updateSuccess.unSubscribe();
            } catch (e) { }

            try {
               this.bsModalRef.content.getOTPStatus.unSubscribe();
            } catch (e) { }

         });
   }

   // call uplift dormancy api again
   resendApproveDetails() {
      this.accountService.upliftAccountDormancy(this.itemAccountId, this.values.dormancyRequest)
         .subscribe((upliftDormancyDetails: IApiResponse) => {
            this.transactionID = upliftDormancyDetails.metadata.resultData[0].transactionID;
            this.bsModalRef.content.processResendApproveDetailsResponse(upliftDormancyDetails);
         }, error => {
            this.unSubscribeModelService();
            this.showLoader = false;
         });
   }

   // emit sucess message
   approved() {
      this.notification.emit(this.successNotification());
      this.activateAccountFlow = false;
      this.showLoader = false;
   }
   // emit error message
   notApproved() {
      this.notification.emit(this.errorNotification());
      this.showLoader = false;
   }

   // set the success message
   successNotification() {
      this.dormancyNotification = {
         message: this.labels.successMessage,
         showMessage: true,
         isSuccess: 3
      };
      return this.dormancyNotification;
   }

   // set the error message
   errorNotification() {
      this.dormancyNotification = {
         message: this.labels.errorMessage,
         showMessage: true,
         isSuccess: 1
      };
      return this.dormancyNotification;
   }

   navigateToLocateBranch() {
      const activateDormantAccountGAEvent = GAEvents.dormantAccount.activate;
      this.sendEvent(activateDormantAccountGAEvent.eventAction, activateDormantAccountGAEvent.label,
         null, activateDormantAccountGAEvent.category);
      this.router.navigateByUrl(this.branchLocatorURL);
   }
}
