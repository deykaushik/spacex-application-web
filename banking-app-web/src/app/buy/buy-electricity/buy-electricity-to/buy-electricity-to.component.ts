import { Router } from '@angular/router';
import { Component, OnInit, AfterViewInit, Output, ViewChild, EventEmitter, ElementRef, Injector } from '@angular/core';

import { Subject } from 'rxjs/Subject';

import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ISubscription } from 'rxjs/Subscription';
import { OutofbandVerificationComponent } from '../../../shared/components/outofband-verification/outofband-verification.component';

import { BuyElectricityService } from '../buy-electricity.service';
import { Constants } from '../../../core/utils/constants';
import { CommonUtility } from '../../../core/utils/common';

import { IBuyElectricityToVm, IBuyElectricityForVm } from '../buy-electricity.models';
import { IWorkflowChildComponent, IStepInfo } from '../../../shared/components/work-flow/work-flow.models';
import {
   IServiceProvider, IBuyElectricityMeterValidationResultDetail,
   IBeneficiaryData, IAccountDetail, IContactCardDetail, IContactCard,
   IBankDefinedBeneficiary
} from '../../../core/services/models';
import { PreFillService } from '../../../core/services/preFill.service';
import { BaseComponent } from '../../../core/components/base/base.component';
import { LoaderService } from '../../../core/services/loader.service';

@Component({
   selector: 'app-buy-electricity-to',
   templateUrl: './buy-electricity-to.component.html',
   styleUrls: ['./buy-electricity-to.component.scss']
})
export class BuyElectricityToComponent extends BaseComponent implements OnInit, AfterViewInit, IWorkflowChildComponent {
   @Output() isComponentValid = new EventEmitter<boolean>();
   @ViewChild('buyElectricityToForm') buyElectricityToForm;
   @ViewChild('recipientN') recipientName: ElementRef;
   @Output() isButtonLoader = new EventEmitter<boolean>();
   nextButtonClick = new Subject<any>();

   vm: IBuyElectricityToVm;
   buyElectricityForVm: IBuyElectricityForVm;
   serviceProvider = 'BLT';
   productCode = 'PEL';
   isMeterNumberValid: boolean;
   showMeterError: boolean;
   isFBE: boolean;
   meterValidationResultDeatil: IBuyElectricityMeterValidationResultDetail;
   isSearchRecipients = false;
   accounts: IAccountDetail[] = [];
   isAccountsOverlay = false;
   meterNumberValidating = false;
   beneficiaryData: IContactCard[];
   processedBeneficiaryData;
   selectedBeneficiary;
   benefeciarySearchResult = [];
   noBeneficiaryData = true;
   bankApprovedRecipients: IBankDefinedBeneficiary[];
   myRecipients: IContactCard[];
   preFillData;
   bsModalRef: BsModalRef;
   modalSubscription: ISubscription;
   buyError: string;
   lastMeterNumber: string;
   meterNumberSubscription: ISubscription;

   constructor(private buyElectricityService: BuyElectricityService,
      private router: Router,
      private loader: LoaderService,
      private modalService: BsModalService,
      private preFillService: PreFillService,
      injector: Injector) {
      super(injector);
   }

   ngOnInit() {
      this.preFillData = this.preFillService.preFillBeneficiaryData;
      this.vm = this.buyElectricityService.getBuyElectricityToVm();
      this.buyElectricityService.accountsDataObserver.subscribe(accounts => {
         if (accounts) {
            this.accounts = accounts;
         }
      });
      this.vm.serviceProvider = this.serviceProvider;
      this.vm.productCode = this.productCode;
      if (this.preFillData) {
         this.handleBeneficiarySelection(this.preFillData);
         this.preFillData = null;
      }
   }

   ngAfterViewInit() {
      if (this.vm.isVmValid) {
         this.isMeterNumberValid = true;
      }
      this.buyElectricityToForm.valueChanges
         .subscribe(values => this.validate());
   }

   validate() {
      const isFormValid = this.buyElectricityToForm.valid && this.isMeterNumberValid;
      if (this.buyElectricityToForm.dirty) {
         this.buyElectricityService.electricityWorkflowSteps.buyTo.isDirty = true;
      }
      this.vm.isVmValid = isFormValid;
      this.isComponentValid.emit(isFormValid);
   }

   validateMeterNumber() {
      this.showMeterError = false;
      this.isButtonLoader.emit(true);
      this.meterNumberValidating = true;

      // clear existing subscription
      if (this.meterNumberSubscription) {
         this.meterNumberSubscription.unsubscribe();
      }

      this.meterNumberSubscription = this.buyElectricityService.validateMeter().subscribe((data) => {
         this.meterNumberValidating = false;
         this.meterValidationResultDeatil = data.resultData[0].resultDetail[0];
         if (this.meterValidationResultDeatil.result !== 'R00') {
            this.isMeterNumberValid = false;
            this.showMeterError = true;
         } else {
            this.isMeterNumberValid = true;
            this.showMeterError = false;
         }
         this.lastMeterNumber = this.vm.meterNumber;
         this.isButtonLoader.emit(false);
         this.validate();
      }, (error) => {
         this.meterNumberValidating = false;
         this.isButtonLoader.emit(false);
         this.validate();
      });
   }
   onMeterNumberBlur(meterNumber: string) {
      this.buyElectricityService.saveBuyElectricityToInfo(this.vm);
      if (meterNumber && meterNumber.toString().trim().length > 0) {
         if (this.vm.recipientName && this.vm.recipientName.length) {
            if (this.lastMeterNumber !== this.vm.meterNumber) {
               this.validateMeterNumber();
            }
         } else {
            this.recipientName.nativeElement.focus();
         }
      } else {
         this.isMeterNumberValid = false;
         this.validate();
      }
   }

   onMeterNumberChange() {
      this.isMeterNumberValid = false;
   }

   private goToStatusPage() {
      this.buyElectricityService.electricityWorkflowSteps.buyTo.isDirty = false;
      this.router.navigateByUrl(Constants.routeUrls.buyElectricityStatus);
   }

   // raise error to system message control
   private raiseSystemError() {
      this.isButtonLoader.emit(false);
      this.isComponentValid.emit(false);
      this.bsModalRef.hide();
      this.buyElectricityService.redirecttoStatusPage();
   }
   nextClick(currentStep: number) {
      this.sendEvent('buy_prepaid_recipient_and_provider_click_on_next');
      if (this.isFBE) {
         this.isButtonLoader.emit(true);
         this.isFBE = true;
         this.buyElectricityService.createGuID();
         this.buyElectricityService.makeElectricityPayment(false, true).subscribe((data) => {
            this.buyElectricityService.saveBuyElectricityToInfo(this.vm);

            let responseStatus = '';
            let responseFailureReason = '';
            try {
               responseStatus = data.resultData[0].resultDetail.find(item =>
                  item.operationReference === 'SECURETRANSACTION').status;
               responseFailureReason = data.resultData[0].resultDetail.find(item =>
                  item.operationReference === 'SECURETRANSACTION').reason;
            } catch (error) {
            }

            if (responseStatus === '') {
               responseStatus = data.resultData[0].resultDetail.find(item =>
                  item.operationReference === 'TRANSACTION').status;
               responseFailureReason = data.resultData[0].resultDetail.find(item =>
                  item.operationReference === 'TRANSACTION').reason;
            }

            if (responseStatus === 'PENDING') {
               this.buyElectricityService.updateTransactionID(data.resultData[0].transactionID);

               this.bsModalRef = this.modalService.show(
                  OutofbandVerificationComponent,
                  Object.assign(
                     {},
                     {
                        animated: true,
                        keyboard: false,
                        backdrop: true,
                        ignoreBackdropClick: true
                     },
                     { class: '' }
                  )
               );

               this.bsModalRef.content.getApproveItStatus.subscribe(() => {
                  try {
                     this.buyElectricityService.getApproveItStatus().subscribe(approveItResponse => {
                        if (approveItResponse.metadata.resultData[0].resultDetail[0].operationReference === 'FBEVoucherRedeem' &&
                           approveItResponse.metadata.resultData[0].resultDetail[0].result === 'R00') {
                           this.buyElectricityService
                              .updateFBETransactionID(approveItResponse.metadata.resultData[0].transactionID);
                        } else {
                           this.buyElectricityService
                              .updateTransactionID(approveItResponse.metadata.resultData[0].transactionID);
                        }
                        this.bsModalRef.content.processApproveItResponse(approveItResponse);
                     }, (error: any) => {
                        this.raiseSystemError();
                     });
                  } catch (e) {
                  }
               }, (error: any) => {
                  this.raiseSystemError();
               });

               this.bsModalRef.content.updateSuccess.subscribe(value => {
                  this.buyElectricityService.isPaymentSuccessful = value;
                  this.buyElectricityService.isFBEClaimed = value;
                  this.buyError = this.buyElectricityService.errorMessage;
                  this.isButtonLoader.emit(false);

                  if (value === true) {
                     this.loader.show();
                     // Make subscriber to finish then only go to Status screen.
                     // To do (2 options -  Make it a promise and call then() or
                     // Make it wait in finally block once
                     // subscribe would get the response then only goto status page )
                     this.buyElectricityService
                        .fbeClaimed(this.buyElectricityService.electricityDetails.fbeTransactionId, this.vm)
                        .finally(() => {
                           // Just to make sure to get data before going to Status page
                           this.isButtonLoader.emit(value);
                           this.loader.hide();
                           this.goToStatusPage();
                        })
                        .subscribe(() => { }, (error: any) => {
                           this.raiseSystemError();
                        });

                  } else {
                     const reason = data.resultData[0].resultDetail.length ? data.resultData[0].resultDetail[0].reason : '';
                     this.buyElectricityService.fbeClaimedUnsuccessful(this.vm, reason);
                     this.goToStatusPage();
                  }
               }, (error: any) => {
                  this.raiseSystemError();
               });

               this.bsModalRef.content.resendApproveDetails.subscribe(() => {
                  this.buyElectricityService.updateTransactionID(data.resultData[0].transactionID);
                  this.buyElectricityService.makeElectricityPayment(false)
                     .subscribe((electricityResponse) => {
                        this.buyElectricityService.updateTransactionID(electricityResponse.resultData[0].transactionID);
                        this.bsModalRef.content.processResendApproveDetailsResponse(electricityResponse);
                     }, (error: any) => {
                        this.raiseSystemError();
                     });
               }, (error: any) => {
                  this.raiseSystemError();
               });

               this.bsModalRef.content.getOTPStatus.subscribe(otpValue => {
                  this.buyElectricityService
                     .getApproveItOtpStatus(otpValue, this.buyElectricityService.electricityDetails.transactionID)
                     .subscribe(otpResponse => {
                        this.bsModalRef.content.processApproveUserResponse(otpResponse);
                     }, (error: any) => {
                        this.raiseSystemError();
                     });
               }, (error: any) => {
                  this.raiseSystemError();
               });

               this.bsModalRef.content.otpIsValid.subscribe(() => {
                  this.buyElectricityService.getApproveItStatus().subscribe(approveItResponse => {
                     this.bsModalRef.content.processApproveItResponse(approveItResponse);
                  }, (error: any) => {
                     this.raiseSystemError();
                  });
               }, (error: any) => {
                  this.raiseSystemError();
               });

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
            } else if (responseStatus === 'SUCCESS') {
               this.buyElectricityService.isPaymentSuccessful = true;
               this.goToStatusPage();
            } else if (responseStatus === 'FAILURE') {
               this.buyElectricityService.errorMessage = responseFailureReason;
               this.buyError = responseFailureReason;
               this.isButtonLoader.emit(false);
               this.buyElectricityService.isPaymentSuccessful = false;
               this.goToStatusPage();
            } else {
               this.buyElectricityService.errorMessage = data.resultData[0].resultDetail.find(item =>
                  item.operationReference === 'TRANSACTION').reason;
               this.buyError = this.buyElectricityService.errorMessage;
               this.isButtonLoader.emit(false);
               this.buyElectricityService.isPaymentSuccessful = false;
               this.goToStatusPage();
            }
         }, (error) => {
            this.isButtonLoader.emit(false);
            this.isComponentValid.emit(false);
            this.buyElectricityService.redirecttoStatusPage();
         });

         return this.nextButtonClick.asObservable();
      } else {
         this.buyElectricityService.saveBuyElectricityToInfo(this.vm);
      }
   }

   stepClick(stepInfo: IStepInfo) {
   }

   // Show Search Recipients
   showSearchRecipients() {
      this.isSearchRecipients = true;
   }

   // Hide Search Recipients
   hideSearchRecipients() {
      this.isSearchRecipients = false;
   }

   handleBeneficiarySelection(beneficiaryData: IBeneficiaryData) {
      const contactCardDetails = beneficiaryData.contactCardDetails;
      this.vm.recipientName = contactCardDetails.cardDetails.beneficiaryName;
      this.vm.meterNumber = contactCardDetails.cardDetails.accountNumber;
      this.vm.beneficiaryID = contactCardDetails.cardDetails.beneficiaryID;
      this.vm.isRecipientPicked = true;
      this.buyElectricityForVm = this.buyElectricityService.getBuyElectricityForVm();
      this.buyElectricityForVm.yourReference = contactCardDetails.cardDetails.myReference;
      this.buyElectricityService.saveBuyElectricityForInfo(this.buyElectricityForVm);
      this.onMeterNumberBlur(this.vm.meterNumber);
   }

   fbeClick() {
      this.isFBE = true;
      this.buyElectricityService.fbeButtonTextChange(this.isFBE);
   }

   purchaseClick() {
      this.isFBE = false;
      this.buyElectricityService.fbeButtonTextChange(this.isFBE);
   }

   getContactCards(recipientsData) {
      // myRecipientsData at second position
      this.myRecipients = recipientsData[1];
      this.createMyRecipients(this.myRecipients);
   }

   createMyRecipients(recipientsData) {
      this.processedBeneficiaryData = [];
      recipientsData.forEach((data) => {
         data.contactCardDetails.forEach((cardData) => {
            this.processedBeneficiaryData.push(cardData);
         });
      });
   }

   onRecipientNameChanged() {
      this.vm.isRecipientPicked = false;
      // reset meter number is recipient selection is altered
      this.resetMeterNumber();
   }

   selectBeneficiary(selectedBeneficiary) {
      this.beneficiaryChange(selectedBeneficiary);
   }

   private beneficiaryChange(beneficiary) {
      this.onRecipientNameChanged();
      this.assignBeneficiary(beneficiary);
   }

   private assignBeneficiary(beneficiary) {
      this.selectedBeneficiary = beneficiary.item;
      this.vm.recipientName = beneficiary.value;
      const selectedBeneficiaryData = this.myRecipients.filter((data) => {
         let filterData = null;
         data.contactCardDetails.forEach(element => {
            if (element.beneficiaryID === this.selectedBeneficiary.beneficiaryID
               && element.beneficiaryName === this.selectedBeneficiary.beneficiaryName) {
               filterData = data;
            }
         });
         return filterData;
      }
      );
      if (selectedBeneficiaryData.length) {
         const contactCard = Object.assign({}, selectedBeneficiaryData[0]);
         contactCard.contactCardDetails = [];
         contactCard.contactCardDetails.push(this.selectedBeneficiary);
         const selectedProcessedBeneficiaryData = {
            contactCard: contactCard,
            contactCardDetails: {
               cardDetails: contactCard.contactCardDetails[0],
               isElectricity: this.isElectricityContact(contactCard)
            },
            bankDefinedBeneficiary: null
         };
         this.handleBeneficiarySelection(selectedProcessedBeneficiaryData);
      }
   }

   isElectricityContact(contactCard: IContactCard): boolean {
      const contactCardDetails = contactCard.contactCardDetails && contactCard.contactCardDetails.filter((contactCardDetail) => {
         return this.isElectricityContactCard(contactCardDetail);
      });
      return contactCardDetails.length > 0;
   }

   isElectricityContactCard(contactCardDetail: IContactCardDetail) {
      return contactCardDetail.beneficiaryType === Constants.BeneficiaryType.Electricity;
   }

   onRecipientNameClear() {
      // reset meter number is recipient selection is cleared
      if (this.vm.isRecipientPicked) {
         this.resetMeterNumber();
      }
   }

   resetMeterNumber() {
      if (this.buyElectricityToForm.controls.meterNumber) {
         this.buyElectricityToForm.controls.meterNumber.reset();
      }
      if (this.meterNumberSubscription) {
         this.meterNumberSubscription.unsubscribe();
         this.meterNumberValidating = false;
         this.isButtonLoader.emit(false);
         this.validate();
         this.lastMeterNumber = '';
      }
   }
}
