import { Component, OnInit, Output, EventEmitter, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ISubscription } from 'rxjs/Subscription';
import { OutofbandVerificationComponent } from '../../../shared/components/outofband-verification/outofband-verification.component';

import { BuyService } from '../buy.service';
import { Constants } from '../../../core/utils/constants';
import { CommonUtility } from './../../../core/utils/common';
import { IBuyToVm, IBuyAmountVm, IBuyForVm, IBuyReviewVm } from '../buy.models';
import { IWorkflowChildComponent, IStepInfo } from '../../../shared/components/work-flow/work-flow.models';
import { BaseComponent } from '../../../core/components/base/base.component';
import { SystemErrorService } from '../../../core/services/system-services.service';

@Component({
   templateUrl: './buy-review.component.html',
   styleUrls: ['./buy-review.component.scss']
})
export class BuyReviewComponent extends BaseComponent implements OnInit, IWorkflowChildComponent {

   constructor(public router: Router, private buyService: BuyService, private modalService: BsModalService
      , injector: Injector, private systemErrorService: SystemErrorService) {
      super(injector);
   }
   @Output() isComponentValid = new EventEmitter<boolean>();
   @Output() isButtonLoader = new EventEmitter<boolean>();

   buyToVm: IBuyToVm;
   buyAmountVm: IBuyAmountVm;
   buyForVm: IBuyForVm;
   vm: IBuyReviewVm;
   labels = Constants.labels;
   accountNickName: string;
   dateFormat: string = Constants.formats.ddMMMMyyyy;
   amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
   bsModalRef: BsModalRef;
   modalSubscription: ISubscription;
   buyError: string;

   ngOnInit() {
      this.isComponentValid.emit(true);
      this.vm = this.buyService.getBuyReviewVm();
      this.buyToVm = this.buyService.getBuyToVm();
      this.buyAmountVm = this.buyService.getBuyAmountVm();
      this.buyForVm = this.buyService.getBuyForVm();
      this.accountNickName = this.buyAmountVm.selectedAccount.nickname;
      this.vm.isSaveBeneficiary = !this.buyToVm.isRecipientPicked;
      this.buyAmountVm.repeatStatusText = CommonUtility.getJourneyOccuranceMessage(this.buyAmountVm.recurrenceFrequency,
         this.buyAmountVm.repeatType, this.buyAmountVm.endDate, this.buyAmountVm.numRecurrence);
   }

   nextClick(currentStep: number) {
      this.buyError = '';
      this.buyService.createGuID();
      this.isButtonLoader.emit(true);
      this.buyService.saveBuyReviewInfo(this.vm);
      this.buyService.isPaymentSuccessful = false;
      this.sendEvent('buy_prepaid_review_click_on_buy');
      this.buyService.isNoResponseReceived = false;
      this.buyService.buyPrepaid().subscribe((validationResponse) => {
         if (this.buyService.isPrepaidStatusValid(validationResponse)) {
            this.buyService.buyPrepaid(false).subscribe((prepaidResponse) => {
               this.buyService.buyWorkflowSteps.buyReview.isDirty = true;
               let responseStatus = '', responseFailureReason = '';
               try {
                  responseStatus = prepaidResponse.resultData[0].resultDetail.find(item =>
                     item.operationReference === 'SECURETRANSACTION').status;
                  responseFailureReason = prepaidResponse.resultData[0].resultDetail.find(item =>
                     item.operationReference === 'SECURETRANSACTION').reason;
               } catch (error) {
               }

               if (responseStatus === '') {
                  responseStatus = prepaidResponse.resultData[0].resultDetail.find(item =>
                     item.operationReference === 'TRANSACTION').status;
                  responseFailureReason = prepaidResponse.resultData[0].resultDetail.find(item =>
                     item.operationReference === 'TRANSACTION').reason;
               }

               if (responseStatus === 'PENDING') {
                  this.buyService.updateTransactionID(prepaidResponse.resultData[0].transactionID);
                  this.buyService.updateexecEngineRef(prepaidResponse.resultData[0].execEngineRef
                     || prepaidResponse.resultData[0].transactionID);
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
                        this.buyService.getApproveItStatus().subscribe(approveItResponse => {
                           this.buyService.updateTransactionID(approveItResponse.metadata.resultData[0].transactionID);
                           this.buyService.updateexecEngineRef(approveItResponse.metadata.resultData[0].execEngineRef
                              || approveItResponse.metadata.resultData[0].transactionID);
                           this.bsModalRef.content.processApproveItResponse(approveItResponse);
                           this.buyService.isBeneficiarySaved(approveItResponse);
                        }, (error: any) => {
                           this.raiseSystemError();
                        });
                     } catch (e) {
                     }

                  }, (error: any) => {
                     this.raiseSystemError();
                  });

                  this.bsModalRef.content.updateSuccess.subscribe(value => {
                     this.buyError = this.buyService.errorMessage;
                     this.isButtonLoader.emit(false);

                     this.buyService.isPaymentSuccessful = value;
                     this.router.navigateByUrl(Constants.routeUrls.buyStatus);
                  }, (error: any) => {
                     this.raiseSystemError();
                  });

                  this.bsModalRef.content.resendApproveDetails.subscribe(() => {
                     this.buyService.setSecureTransactionVerification(this.buyService.prepaidDetails.transactionID);
                     this.buyService.isNoResponseReceived = false;
                     this.buyService.buyPrepaid(false)
                        .subscribe((paymentResponse) => {
                           this.buyService.updateTransactionID(paymentResponse.resultData[0].transactionID);
                           this.buyService.updateexecEngineRef(paymentResponse.resultData[0].execEngineRef
                              || paymentResponse.resultData[0].transactionID);
                           this.bsModalRef.content.processResendApproveDetailsResponse(paymentResponse);
                        }, () => {
                           this.raiseSystemError();
                        });
                  }, (error: any) => {
                     this.raiseSystemError();
                  });

                  this.bsModalRef.content.getOTPStatus.subscribe(otpValue => {
                     this.buyService.getApproveItOtpStatus(otpValue, this.buyService.prepaidDetails.transactionID)
                        .subscribe(otpResponse => {
                           this.bsModalRef.content.processApproveUserResponse(otpResponse);
                        }, (error: any) => {
                           this.raiseSystemError();
                        });
                  }, (error: any) => {
                     this.raiseSystemError();
                  });

                  this.bsModalRef.content.otpIsValid.subscribe(() => {
                     this.buyService.getApproveItStatus().subscribe(approveItResponse => {
                        this.bsModalRef.content.processApproveItResponse(approveItResponse);
                     }, (error: any) => {
                        this.raiseSystemError();
                     });
                  }, (error: any) => {
                     this.raiseSystemError();
                  });

                  this.modalSubscription = this.modalService.onHidden.asObservable()
                     .subscribe(() => {
                        this.router.navigateByUrl(Constants.routeUrls.buyStatus);
                        this.bsModalRef.content.unsubscribeAll();
                     });
               } else if (responseStatus === 'SUCCESS') {
                  this.buyService.updateTransactionID(prepaidResponse.resultData[0].transactionID);
                  this.buyService.updateexecEngineRef(prepaidResponse.resultData[0].execEngineRef
                     || prepaidResponse.resultData[0].transactionID);
                  this.buyService.isPaymentSuccessful = true;
                  this.buyService.isNoResponseReceived = false;
                  this.buyService.refreshAccounts();
                  this.buyService.isBeneficiarySaved({ metadata: validationResponse });
                  this.router.navigateByUrl(Constants.routeUrls.buyStatus);
               } else if (responseStatus === 'FAILURE') {
                  this.buyService.errorMessage = responseFailureReason;
                  this.buyError = responseFailureReason;
                  this.isButtonLoader.emit(false);
                  this.buyService.isPaymentSuccessful = false;
                  this.buyService.isNoResponseReceived = false;
                  this.router.navigateByUrl(Constants.routeUrls.buyStatus);
               } else {
                  this.buyService.errorMessage = prepaidResponse.resultData[0].resultDetail.find(item =>
                     item.operationReference === 'TRANSACTION').reason;
                  this.buyError = this.buyService.errorMessage;
                  this.isButtonLoader.emit(false);

                  this.buyService.isPaymentSuccessful = false;
                  this.buyService.isNoResponseReceived = false;
                  this.router.navigateByUrl(Constants.routeUrls.buyStatus);
               }
            }, (error) => {
               this.buyService.isPaymentSuccessful = false;
               this.buyError = this.buyService.errorMessage;
               this.buyService.redirecttoStatusPage();
            });
         } else {
            this.buyService.isPaymentSuccessful = false;
            this.buyError = this.buyService.errorMessage;
            this.isButtonLoader.emit(false);
         }
      }, (error) => {
         this.isButtonLoader.emit(false);
      });
   }

   // raise error to system message control
   private raiseSystemError() {
      this.isButtonLoader.emit(false);
      this.isComponentValid.emit(false);
      this.bsModalRef.hide();
      this.buyService.redirecttoStatusPage();
   }
   stepClick(stepInfo: IStepInfo) {
   }
}
