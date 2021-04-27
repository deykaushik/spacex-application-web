import { Component, OnInit, Output, EventEmitter, Inject, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ISubscription } from 'rxjs/Subscription';
import { OutofbandVerificationComponent } from '../../../shared/components/outofband-verification/outofband-verification.component';

import { BuyElectricityService } from '../buy-electricity.service';
import { Constants } from '../../../core/utils/constants';
import { CommonUtility } from './../../../core/utils/common';

import { IBuyElectricityToVm, IBuyElectricityAmountVm, IBuyElectricityForVm, IBuyElectricityReviewVm } from '../buy-electricity.models';
import { IWorkflowChildComponent, IStepInfo } from '../../../shared/components/work-flow/work-flow.models';
import { BaseComponent } from '../../../core/components/base/base.component';
import { SystemErrorService } from '../../../core/services/system-services.service';

@Component({
   templateUrl: './buy-electricity-review.component.html',
   styleUrls: ['./buy-electricity-review.component.scss']
})
export class BuyElectricityReviewComponent extends BaseComponent implements OnInit, IWorkflowChildComponent {
   @Output() isComponentValid = new EventEmitter<boolean>();
   @Output() isButtonLoader = new EventEmitter<boolean>();
   dateFormat: string = Constants.formats.ddMMMMyyyy;
   vm: IBuyElectricityReviewVm;
   buyElectricityToVm: IBuyElectricityToVm;
   buyElectricityForVm: IBuyElectricityForVm;
   buyElectricityAmountVm: IBuyElectricityAmountVm;
   startDate: Date = new Date();
   accountTypeName: string;
   amountPipeConfig = Constants.amountPipeSettings.amountWithLabel;
   labels = Constants.labels;
   isVisible = false;
   amount: number;
   electricityAmountInArrears: number;
   termsAndConditionLink = Constants.links.termsAndConditionsPage;
   bsModalRef: BsModalRef;
   modalSubscription: ISubscription;
   buyError: string;

   constructor(public router: Router,
      private buyElectricityService: BuyElectricityService,
      private modalService: BsModalService,
      @Inject(DOCUMENT) private document: Document, injector: Injector,
      private systemErrorService: SystemErrorService) {
      super(injector);
   }

   ngOnInit() {
      this.isComponentValid.emit(true);
      this.vm = this.buyElectricityService.getBuyElectricityReviewVm();
      this.buyElectricityToVm = this.buyElectricityService.getBuyElectricityToVm();
      this.buyElectricityForVm = this.buyElectricityService.getBuyElectricityForVm();
      this.buyElectricityAmountVm = this.buyElectricityService.getBuyElectricityAmountVm();
      this.accountTypeName = CommonUtility.getAccountTypeName(this.buyElectricityAmountVm.selectedAccount.accountType);
      this.electricityAmountInArrears = this.buyElectricityAmountVm.electricityAmountInArrears;
      this.amount = this.buyElectricityAmountVm.amount;
      this.vm.isSaveBeneficiary = !this.buyElectricityToVm.isRecipientPicked;

      if (this.buyElectricityAmountVm.electricityAmountInArrears > 0) {
         this.isVisible = !this.isVisible;
         this.buyElectricityAmountVm.amount = this.amount;
         this.buyElectricityService.saveBuyElectricityAmountInfo(this.buyElectricityAmountVm);
      }

   }

   nextClick(currentStep: number) {
      this.buyElectricityService.createGuID();
      this.sendEvent('buy_electricity_review_click_on_buy');
      this.isButtonLoader.emit(true);
      this.buyElectricityService.isNoResponseReceived = false;
      this.buyElectricityService.saveBuyElectricityReviewInfo(this.vm);
      this.buyElectricityService.electricityWorkflowSteps.buyReview.isDirty = true;
      this.buyElectricityService.makeElectricityPayment(true).subscribe((validationResponse) => {
         if (this.buyElectricityService.isElectricityPaymentStatusValid(validationResponse)) {
            this.buyElectricityService.makeElectricityPayment(false).subscribe((paymentResponse) => {
               this.buyElectricityService.electricityWorkflowSteps.buyReview.isDirty = true;
               this.buyElectricityService.updateTransactionID(paymentResponse.resultData[0].transactionID);

               let responseStatus = '';
               let responseFailureReason = '';
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
                  this.buyElectricityService.updateTransactionID(paymentResponse.resultData[0].transactionID);
                  this.buyElectricityService.updateexecEngineRef(paymentResponse.resultData[0].execEngineRef
                     || paymentResponse.resultData[0].transactionID);
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
                           this.buyElectricityService.updateTransactionID(approveItResponse.metadata.resultData[0].transactionID);
                           this.bsModalRef.content.processApproveItResponse(approveItResponse);
                           this.buyElectricityService.isBeneficiarySaved(approveItResponse);
                        }, () => {
                           this.raiseSystemError();
                        });
                     } catch (e) {
                     }

                  }, (error: any) => {
                     this.raiseSystemError();
                  });

                  this.bsModalRef.content.updateSuccess.subscribe(value => {
                     this.buyError = this.buyElectricityService.errorMessage;
                     this.isButtonLoader.emit(false);

                     this.buyElectricityService.isPaymentSuccessful = value;
                     this.router.navigateByUrl(Constants.routeUrls.buyElectricityStatus);
                  }, (error: any) => {
                     this.raiseSystemError();
                  });

                  this.bsModalRef.content.resendApproveDetails.subscribe(() => {
                     this.buyElectricityService.updateTransactionID(paymentResponse.resultData[0].transactionID);
                     this.buyElectricityService.updateexecEngineRef(paymentResponse.resultData[0].execEngineRef
                        || paymentResponse.resultData[0].transactionID);
                     this.buyElectricityService.isNoResponseReceived = false;
                     this.buyElectricityService.makeElectricityPayment(false)
                        .subscribe((electricityResponse) => {
                           this.buyElectricityService.updateTransactionID(electricityResponse.resultData[0].transactionID);
                           this.buyElectricityService.updateexecEngineRef(electricityResponse.resultData[0].execEngineRef
                              || electricityResponse.resultData[0].transactionID);
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
                        }, () => {
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
                        this.router.navigateByUrl(Constants.routeUrls.buyElectricityStatus);
                        try {
                           this.bsModalRef.content.otpIsValid.unsubscribe();
                        } catch (e) { }
                        try {
                           this.bsModalRef.content.getApproveItStatus.unsubscribe();
                        } catch (e) { }

                        try {
                           this.bsModalRef.content.resendApproveDetails.unsubscribe();
                        } catch (e) { }

                        try {
                           this.bsModalRef.content.updateSuccess.unsubscribe();
                        } catch (e) { }

                        try {
                           this.bsModalRef.content.getOTPStatus.unsubscribe();
                        } catch (e) { }
                     });
               } else if (responseStatus === 'SUCCESS') {
                  this.buyElectricityService.updateTransactionID(paymentResponse.resultData[0].transactionID);
                  this.buyElectricityService.updateexecEngineRef(paymentResponse.resultData[0].execEngineRef
                     || paymentResponse.resultData[0].transactionID);
                  this.buyElectricityService.isPaymentSuccessful = true;
                  this.buyElectricityService.isNoResponseReceived = false;
                  this.buyElectricityService.refreshAccounts();
                  this.buyElectricityService.isBeneficiarySaved({ metadata: validationResponse });
                  this.router.navigateByUrl(Constants.routeUrls.buyElectricityStatus);
               } else if (responseStatus === 'FAILURE') {
                  this.buyElectricityService.errorMessage = responseFailureReason;
                  this.buyError = responseFailureReason;
                  this.isButtonLoader.emit(false);
                  this.buyElectricityService.isPaymentSuccessful = false;
                  this.buyElectricityService.isNoResponseReceived = false;
                  this.router.navigateByUrl(Constants.routeUrls.buyElectricityStatus);
               } else {
                  this.buyElectricityService.errorMessage = paymentResponse.resultData[0].resultDetail.find(item =>
                     item.operationReference === 'TRANSACTION').reason;
                  this.buyError = this.buyElectricityService.errorMessage;
                  this.isButtonLoader.emit(false);
                  this.buyElectricityService.isPaymentSuccessful = false;
                  this.buyElectricityService.isNoResponseReceived = false;
                  this.router.navigateByUrl(Constants.routeUrls.buyElectricityStatus);
               }
            }, (error) => {
               this.buyElectricityService.redirecttoStatusPage();
            });
         } else {
            this.buyElectricityService.electricityWorkflowSteps.buyReview.isDirty = true;
            this.router.navigateByUrl(Constants.routeUrls.buyElectricityStatus);
         }
      }, (error) => {
         this.isButtonLoader.emit(false);
      });
   }

   stepClick(stepInfo: IStepInfo) {
   }
   // raise error to system message control
   private raiseSystemError() {
      this.isComponentValid.emit(false);
      this.isButtonLoader.emit(false);
      this.bsModalRef.hide();
      this.buyElectricityService.redirecttoStatusPage();
   }
   onTermsConditionsClick() {
   }

   tshwanDeclineClick() {
      this.buyElectricityService.electricityWorkflowSteps.buyTo.isDirty = false;
      this.router.navigateByUrl(Constants.routeUrls.dashboard);
      this.isVisible = false;
      this.document.body.classList.remove('overlay-no-scroll');
   }

   tshwanContinueClick() {
      this.buyElectricityService.electricityWorkflowSteps.buyTo.isDirty = false;
      this.isVisible = false;
      this.document.body.classList.remove('overlay-no-scroll');
   }
}
