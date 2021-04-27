import { Component, OnInit, EventEmitter, Output, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ISubscription } from 'rxjs/Subscription';
import { OutofbandVerificationComponent } from '../../shared/components/outofband-verification/outofband-verification.component';

import { Constants } from './../../core/utils/constants';
import { CommonUtility } from './../../core/utils/common';
import { PaymentService } from '../payment.service';
import { PaymentDetail, IPayReviewVm, IPayToVm, IPayForVm, IPayAmountVm } from '../payment.models';
import { IWorkflowChildComponentWithLoader, IStepInfo } from './../../shared/components/work-flow/work-flow.models';
import { IAddressLine } from '../../core/services/models';
import { PaymentType } from '../../core/utils/enums';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { ProfileDetails } from '../../profile/profile.models';
import { IGaEvent, IBeneficiaryData, IContactCardNotification, IContactCardDetail, IBank, IBranch } from '../../core/services/models';
import { BaseComponent } from '../../core/components/base/base.component';
import { RecipientService } from '../../recipient/recipient.service';

@Component({
   selector: 'app-pay-review',
   templateUrl: './pay-review.component.html',
   styleUrls: ['./pay-review.component.scss']
})
export class PayReviewComponent extends BaseComponent implements OnInit, IWorkflowChildComponentWithLoader {
   @Output() isComponentValid = new EventEmitter<boolean>();
   @Output() isButtonLoader = new EventEmitter<boolean>();
   dateFormat: string = Constants.formats.ddMMMMyyyy;
   labels = Constants.labels;
   public profileDetails: ProfileDetails;
   vm: IPayReviewVm;
   payToVm: IPayToVm;
   payForVm: IPayForVm;
   payAmountVm: IPayAmountVm;
   accountNickName: string;
   amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
   todayDate = new Date();
   isAccountPayment = false;
   isMobilePayment = false;
   isFutureDate = false;
   isCreditCardPayment = false;
   bsModalRef: BsModalRef;
   modalSubscription: ISubscription;
   paymentError: string;
   termsAndConditionLink = Constants.links.termsAndConditionsPage;
   defaultCurrency = Constants.defaultCrossPlatformCurrency.name;
   isShowSaveRecipient = false;
   isForeignBankPayment = false;
   fullAddress = '';
   beneficiaryDataToSave: IBeneficiaryData;
   beneficiaryData: IBeneficiaryData;
   banks: IBank[];
   constructor(public router: Router, private paymentService: PaymentService, private modalService: BsModalService,
      injector: Injector, private recipientService: RecipientService, private clientProfileDetailsService: ClientProfileDetailsService) {
      super(injector);
   }

   ngOnInit() {
      this.vm = this.paymentService.getPayReviewVm();
      this.payToVm = this.paymentService.getPayToVm();
      this.payForVm = this.paymentService.getPayForVm();
      this.payAmountVm = this.paymentService.getPayAmountVm();
      this.accountNickName = this.payAmountVm.selectedAccount.nickname;
      this.isAccountPayment = this.paymentService.isAccountPayment();
      this.isMobilePayment = this.paymentService.isMobilePayment();
      this.isFutureDate = this.payAmountVm && !CommonUtility.isSameDateAs(this.payAmountVm.paymentDate, this.todayDate);
      this.isForeignBankPayment = this.payToVm.paymentType === PaymentType.foreignBank;
      this.isCreditCardPayment = !this.isAccountPayment && !this.isMobilePayment && !this.isForeignBankPayment;
      this.isShowSaveRecipient = ((!this.payToVm.isRecipientPicked) ||
         (this.payToVm.beneficiaryData && this.payToVm.beneficiaryData.bankDefinedBeneficiary ? true : false));

      this.payAmountVm.repeatStatusText = CommonUtility.getJourneyOccuranceMessage(this.payAmountVm.recurrenceFrequency,
         this.payAmountVm.repeatType, this.payAmountVm.endDate, this.payAmountVm.numRecurrence);

      if (!this.isShowSaveRecipient) {
         this.vm.isSaveBeneficiary = false;
      }

      this.clientProfileDetailsService.clientDetailsObserver.subscribe(clientDetails => {
         if (clientDetails) {
            this.profileDetails = new ProfileDetails;
            this.profileDetails.FullNames = clientDetails.FullNames;
            this.profileDetails.RsaId = clientDetails.IdOrTaxIdNo;
            this.profileDetails.PassportNumber = clientDetails.PassportNo;
            this.profileDetails.Resident = clientDetails.Resident;
            this.profileDetails.Address = clientDetails.Address;
            this.profileDetails.EmailAddress = clientDetails.EmailAddress;
            this.profileDetails.CellNumber = clientDetails.CellNumber;
            this.getAddress(this.profileDetails.Address.AddressLines,
               this.profileDetails.Address.AddressCity, this.profileDetails.Address.AddressPostalCode);
         }
      });
      this.validate(this.vm.isSaveBeneficiary);
   }

   validate(isSaveBeneficiary) {
      if (this.isFutureDate && this.isShowSaveRecipient) {
         isSaveBeneficiary ? this.isComponentValid.emit(true) : this.isComponentValid.emit(false);
      }else {
         this.isComponentValid.emit(true);
      }
   }
   updateRecipient() {
      this.setRecipientData();
      this.recipientService.updateRecipient(this.beneficiaryDataToSave.contactCard).subscribe((data) => {
         const status = this.recipientService.getTransactionStatus(data);
         if (status.isValid) {
            this.recipientService.updateRecipient(this.beneficiaryDataToSave.contactCard, false).subscribe((response) => {
               const savedStatus = this.recipientService.getTransactionStatus(response);
               if (savedStatus.isValid) {
                  this.recipientService.addUpdateSuccess = false;
                  if (savedStatus.status.toLocaleLowerCase() === Constants.metadataKeys.pending.toLocaleLowerCase()) {
                     this.recipientService.tempContactCard = this.beneficiaryDataToSave.contactCard;
                     this.recipientService.tempContactCard.secureTransaction = {
                        verificationReferenceId: response.resultData[0].transactionID
                     };

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
                           this.recipientService.getApproveItStatus().subscribe(approveItResponse => {
                              this.recipientService.tempContactCard.
                                 secureTransaction.verificationReferenceId =
                                 approveItResponse.metadata.resultData[0].transactionID;
                              this.bsModalRef.content.processApproveItResponse(approveItResponse);
                           }, (error: any) => {
                              this.closeModalAndMakePayment();
                           });
                        } catch (e) { }
                     }, (error: any) => {
                        this.closeModalAndMakePayment();
                     });

                     this.bsModalRef.content.updateSuccess.subscribe(value => {
                        this.recipientService.addUpdateSuccess = value;
                     }, (error: any) => {
                        this.closeModalAndMakePayment();
                     });

                     this.bsModalRef.content.resendApproveDetails.subscribe(() => {
                        this.recipientService.updateRecipient(this.recipientService.tempContactCard, false)
                           .subscribe((paymentResponse) => {
                              this.recipientService.tempContactCard.
                                 secureTransaction.verificationReferenceId =
                                 paymentResponse.resultData[0].transactionID;
                              this.bsModalRef.content.processResendApproveDetailsResponse(paymentResponse);
                           }, (error: any) => {
                              this.closeModalAndMakePayment();
                           });
                     }, (error: any) => {
                        this.closeModalAndMakePayment();
                     });

                     this.bsModalRef.content.getOTPStatus.subscribe(otpValue => {
                        this.recipientService.getApproveItOtpStatus(otpValue,
                           this.recipientService.tempContactCard.secureTransaction.verificationReferenceId)
                           .subscribe(otpResponse => {
                              this.bsModalRef.content.processApproveUserResponse(otpResponse);
                           }, (error: any) => {
                              this.closeModalAndMakePayment();
                           });
                     }, (error: any) => {
                        this.closeModalAndMakePayment();
                     });

                     this.bsModalRef.content.otpIsValid.subscribe(() => {
                        this.recipientService.getApproveItStatus().subscribe(approveItResponse => {
                           this.recipientService.tempContactCard.secureTransaction.verificationReferenceId =
                              approveItResponse.metadata.resultData[0].transactionID;
                           this.bsModalRef.content.processApproveItResponse(approveItResponse);
                        }, (error: any) => {
                           this.closeModalAndMakePayment();
                        });
                     }, (error: any) => {
                        this.closeModalAndMakePayment();
                     });

                     this.modalSubscription = this.modalService.onHidden.asObservable()
                        .subscribe(() => {
                           try {
                              this.bsModalRef.content.unsubscribeAll();
                           } catch (e) { }
                           const payReviewModel = this.paymentService.paymentWorkflowSteps.payReview.model.getViewModel();
                           payReviewModel.isSaveBeneficiary = false;
                           this.paymentService.paymentWorkflowSteps.payReview.model.updateModel(payReviewModel);
                           // complete payment even if update recipient is not successful
                           if (this.recipientService.addUpdateSuccess) {
                              this.paymentService.isInvalidRecipientSaved = Constants.Statuses.Yes;
                              this.paymentError = '';
                           } else {
                              this.showNoBeneficiarySaved();
                           }
                           this.makePayment();
                        });
                  } else if (savedStatus.status.toLocaleLowerCase() ===
                     Constants.metadataKeys.success.toLocaleLowerCase()) {
                     this.makePayment();
                  } else {
                     this.showNoBeneficiarySaved();
                     this.makePayment();
                  }
               } else {
                  this.showNoBeneficiarySaved();
                  this.makePayment();
               }
            }, (error) => {
               this.showNoBeneficiarySaved();
               this.makePayment();
            });
         } else {
            this.showNoBeneficiarySaved();
            this.makePayment();
         }
      }, (error) => {
         this.showNoBeneficiarySaved();
         this.makePayment();
      });
   }

   private closeModalAndMakePayment() {
      this.bsModalRef.content.navigateClose();
      this.makePayment();
   }
   private showNoBeneficiarySaved() {
      this.paymentService.isInvalidRecipientSaved = Constants.Statuses.No;
      this.paymentError = Constants.labels.BenificiaryErrorMsg;
   }
   private setRecipientData() {
      const contactCard: IContactCardDetail[] = [];
      const contactCardID: number = this.payToVm.beneficiaryData.contactCard.contactCardID;
      const contactName = this.payToVm.beneficiaryData.contactCard.contactCardName;

      const isNedBank = CommonUtility.isNedBank(this.payToVm.bank.bankName);
      this.payToVm.beneficiaryData.contactCard.contactCardDetails.forEach((cCard) => {

         const sortCode = (this.payToVm.branch && this.payToVm.branch.branchCode)
            || (this.payToVm.bank && this.payToVm.bank.universalCode);
         const selectedBank = this.payToVm.banks.find(b => b.bankCode === this.payToVm.bank.bankCode);
         contactCard.push({
            accountType: this.payToVm.accountType ? this.payToVm.accountType : undefined,
            beneficiaryID: cCard.beneficiaryID,
            beneficiaryName: cCard.beneficiaryName,
            accountNumber: this.payToVm.accountNumber,
            bankCode: this.payToVm.bank.bankCode,
            bankName: this.payToVm.bank.bankName,
            branchCode: isNedBank ?
               (this.payToVm.branch && this.payToVm.branch.branchCode ?
                  this.payToVm.branch.branchCode : (selectedBank.universalCode || cCard.branchCode))
               : (sortCode || cCard.branchCode),
            beneficiaryType: isNedBank ? Constants.BeneficiaryType.Internal : Constants.BeneficiaryType.External,
            myReference: this.payForVm.yourReference,
            beneficiaryReference: this.payForVm.theirReference,
         });
      });
      const ccNotifications: IContactCardNotification[] =
         CommonUtility.clone(this.payToVm.beneficiaryData.contactCard.contactCardNotifications);


      if (this.payForVm.notification.value !== Constants.notificationTypes.none) {
         if (!ccNotifications.find(m => m.notificationType === this.payForVm.notification.value)) {
            ccNotifications.push({
               notificationAddress: this.payForVm.notificationInput,
               notificationType: this.payForVm.notification.value
            });
         }
         ccNotifications.forEach((notification) => {
            notification.notificationAddress = notification.notificationType === this.payForVm.notification.value
               ? this.payForVm.notificationInput : notification.notificationAddress;
         });
      }
      this.beneficiaryDataToSave = {
         contactCard: {
            contactCardDetails: contactCard,
            contactCardNotifications: ccNotifications,
            contactCardName: contactName,
            contactCardID: contactCardID
         }
      };
   }

   nextClick(currentStep: number) {

      this.sendEvent('pay_review_click_on_pay');
      this.paymentError = '';
      this.isButtonLoader.emit(true);
      this.paymentService.savePayReviewInfo(this.vm);
      this.paymentService.paymentWorkflowSteps.payReview.isDirty = true;
      const payToDetails = this.paymentService.paymentWorkflowSteps.payTo.model.getViewModel();
      const isSaveBeneficiary = this.paymentService.paymentWorkflowSteps.payReview.model.getViewModel().isSaveBeneficiary;
      // if invalid recipient is selected , update its bank details
      if (payToDetails.isRecipientPicked && (!payToDetails.isRecipientValid) && isSaveBeneficiary) {
         this.updateRecipient();
      } else {
         this.makePayment();
      }
   }
   makePayment() {
      this.paymentService.isAPIFailure = false;
      this.paymentService.createGUID();
      this.paymentService.makePayment().subscribe((validationResponse) => {
         this.paymentService.isAPIFailure = false;
         this.paymentService.isPaymentSuccessful = false;
         if (this.paymentService.isPaymentStatusValid(validationResponse)) {
            if (this.isForeignBankPayment) {
               this.paymentService.isPaymentSuccessful = true;
               this.paymentService.refreshAccounts();
               this.router.navigateByUrl(Constants.routeUrls.paymentStatus);

            } else {
               this.paymentService.makePayment(false).subscribe((paymentResponse) => {
                  this.paymentService.isAPIFailure = false;
                  let responseStatus = '',
                     responseFailureReason = '';
                  try {
                     responseStatus = paymentResponse.resultData[0].resultDetail.find(item =>
                        item.operationReference === 'SECURETRANSACTION').status;
                     responseFailureReason = paymentResponse.resultData[0].resultDetail.find(item =>
                        item.operationReference === 'SECURETRANSACTION').reason;

                  } catch (error) {
                  }
                  if (responseStatus === '') {
                     responseStatus = paymentResponse.resultData[0].resultDetail.find(item =>
                        item.operationReference === 'TRANSACTION').status;
                     responseFailureReason = paymentResponse.resultData[0].resultDetail.find(item =>
                        item.operationReference === 'TRANSACTION').reason;

                  }
                  if (responseStatus === 'PENDING') {
                     this.paymentService.updateTransactionID(paymentResponse.resultData[0].transactionID);
                     this.paymentService.updateexecEngineRef(
                        paymentResponse.resultData[0].execEngineRef ||
                        paymentResponse.resultData[0].transactionID);

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
                           this.paymentService.getApproveItStatus().subscribe(approveItResponse => {
                              this.paymentService.updateTransactionID(approveItResponse.metadata.resultData[0].transactionID);
                              this.paymentService.updateexecEngineRef(
                                 approveItResponse.metadata.resultData[0].execEngineRef ||
                                 approveItResponse.metadata.resultData[0].transactionID);
                              this.bsModalRef.content.processApproveItResponse(approveItResponse);
                              this.paymentService.isBeneficiarySaved(approveItResponse);
                           }, (error) => {
                              this.closeModalAndNavigateAway();
                           });
                        } catch (e) {
                        }

                     }, (error) => {
                        this.closeModalAndNavigateAway();
                     });

                     this.bsModalRef.content.updateSuccess.subscribe(value => {
                        this.paymentService.isPaymentSuccessful = value;
                     }, (error) => {
                        this.closeModalAndNavigateAway();
                     });

                     this.bsModalRef.content.resendApproveDetails.subscribe(() => {
                        this.paymentService.makePayment(false)
                           .subscribe((payResponse) => {
                              this.paymentService.isAPIFailure = false;
                              this.paymentService.updateTransactionID(payResponse.resultData[0].transactionID);
                              this.paymentService.updateexecEngineRef(
                                 payResponse.resultData[0].execEngineRef ||
                                 payResponse.resultData[0].transactionID);
                              this.bsModalRef.content.processResendApproveDetailsResponse(payResponse);
                           }, (error) => {
                              this.closeModalAndNavigateAway();
                           });
                     }, (error) => {
                        this.closeModalAndNavigateAway();
                     });

                     this.bsModalRef.content.getOTPStatus.subscribe(otpValue => {
                        this.paymentService.getApproveItOtpStatus(otpValue, this.paymentService.paymentDetails.transactionID)
                           .subscribe(otpResponse => {
                              this.bsModalRef.content.processApproveUserResponse(otpResponse);
                           }, (error) => {
                              this.closeModalAndNavigateAway();
                           });
                     }, (error) => {
                        this.closeModalAndNavigateAway();
                     });

                     this.bsModalRef.content.otpIsValid.subscribe(() => {
                        this.paymentService.getApproveItStatus().subscribe(approveItResponse => {
                           this.bsModalRef.content.processApproveItResponse(approveItResponse);
                        }, (error) => {
                           this.closeModalAndNavigateAway();
                        });
                     }, (error) => {
                        this.closeModalAndNavigateAway();
                     });

                     this.modalSubscription = this.modalService.onHidden.asObservable()
                        .subscribe(() => {
                           this.router.navigateByUrl(Constants.routeUrls.paymentStatus);
                           this.bsModalRef.content.unsubscribeAll();
                        });
                  } else if (responseStatus === 'SUCCESS') {
                     this.paymentService.updateTransactionID(paymentResponse.resultData[0].transactionID);
                     this.paymentService.updateexecEngineRef(paymentResponse.resultData[0].execEngineRef
                        || paymentResponse.resultData[0].transactionID);
                     this.paymentService.isPaymentSuccessful = true;
                     this.paymentService.refreshAccounts();
                     this.paymentService.isBeneficiarySaved({ metadata: validationResponse });
                     this.router.navigateByUrl(Constants.routeUrls.paymentStatus);
                  } else if (responseStatus === 'FAILURE') {
                     this.paymentService.errorMessage = responseFailureReason;
                     this.paymentError = responseFailureReason;
                     this.paymentService.isPaymentSuccessful = false;

                     this.router.navigateByUrl(Constants.routeUrls.paymentStatus);
                  } else {

                     this.paymentError = this.paymentService.errorMessage;
                     this.isButtonLoader.emit(false);

                     this.paymentService.isPaymentSuccessful = false;
                     this.router.navigateByUrl(Constants.routeUrls.paymentStatus);
                  }
               }, (error) => {
                  this.raiseAPIFailureError();
               });
            }
         } else {
            this.paymentError = this.paymentService.errorMessage;
            this.isButtonLoader.emit(false);
         }
      }, (error) => {
         this.paymentService.isPaymentSuccessful = false;
         this.isButtonLoader.emit(false);
      });
   }
   private closeModalAndNavigateAway() {
      this.bsModalRef.content.navigateClose();
      this.raiseAPIFailureError();
   }
   private raiseAPIFailureError() {
      this.paymentService.isPaymentSuccessful = false;
      this.paymentService.raiseSystemErrorforAPIFailure(Constants.routeUrls.paymentStatus);
   }
   stepClick(stepInfo: IStepInfo) {
   }

   private getAddress(address: IAddressLine[], addressCity = '', addressPostalCode = '') {
      address.forEach((element) => {
         this.fullAddress += element.AddressLine + ' ';
      });
      this.fullAddress += addressCity + ' ' + addressPostalCode;
   }

   displayRsaPassportNo() {
      if (this.profileDetails.Resident != null) {
         if (this.profileDetails.Resident === 'ZA') {
            return (this.profileDetails && this.profileDetails.RsaId) ? this.profileDetails.RsaId : null;
         } else {
            return (this.profileDetails && this.profileDetails.PassportNumber) ? this.profileDetails.PassportNumber : null;
         }
      }
   }
}
