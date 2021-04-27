import { Component, OnInit, Input, Output, EventEmitter, Injector, OnDestroy } from '@angular/core';

import { Router, PreloadAllModules } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ISubscription } from 'rxjs/Subscription';
import { OutofbandVerificationComponent } from '../../../shared/components/outofband-verification/outofband-verification.component';

import { Constants } from './../../../core/utils/constants';
import { CommonUtility } from './../../../core/utils/common';
import { BuyElectricityService } from './../buy-electricity.service';

import { IBuyElectricityDetail } from './../../../core/services/models';
import { IBuyElectricityForVm, IBuyElectricityToVm, IBuyElectricityAmountVm, IBuyElectricityReviewVm } from './../buy-electricity.models';
import { BaseComponent } from '../../../core/components/base/base.component';
import { SystemErrorService } from '../../../core/services/system-services.service';


@Component({
   selector: 'app-buy-status',
   templateUrl: './buy-electricity-status.component.html',
   styleUrls: ['./buy-electricity-status.component.scss']
})
export class BuyElectricityStatusComponent extends BaseComponent implements OnInit, OnDestroy {
   heading: string;
   buyElectricityDetail: IBuyElectricityDetail;
   buyElectricityToVm: IBuyElectricityToVm;
   successful: boolean;
   disableRetryButton = false;
   private paymentRetryTimes = 1;
   requestInprogress = false;
   isButtonLoader: boolean;
   buyElectricityAmountVm: IBuyElectricityAmountVm;
   buyElectricityForVm: IBuyElectricityForVm;
   dateFormat: string = Constants.formats.ddMMMMyyyy;
   amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
   labels = Constants.labels;
   public errorMessage?: string;

   bsModalRef: BsModalRef;
   modalSubscription: ISubscription;
   buyError: string;
   print = CommonUtility.print.bind(CommonUtility);

   constructor(private router: Router,
      public buyElectricityService: BuyElectricityService,
      private modalService: BsModalService, injector: Injector, private systemErrorService: SystemErrorService) {
      super(injector);
   }

   private disableRetry(value: boolean) {
      this.successful = value;
      this.disableRetryButton = value;
   }

   ngOnInit() {
      CommonUtility.removePrintHeaderFooter();
      if (this.buyElectricityService.isPaymentStatusNavigationAllowed()) {
         this.buyElectricityDetail = this.buyElectricityService.getBuyElectricityDetailsInfo();
         this.buyElectricityToVm = this.buyElectricityService.getBuyElectricityToVm();
         this.buyElectricityAmountVm = this.buyElectricityService.getBuyElectricityAmountVm();
         this.buyElectricityForVm = this.buyElectricityService.getBuyElectricityForVm();

         if (this.buyElectricityService.getPaymentStatus()) {
            this.successful = true;
            this.heading = Constants.labels.paymentSuccess;
         } else {
            this.successful = false;
            this.heading = Constants.labels.paymentFailed;
         }
      } else if (this.buyElectricityService.isFBEClaim()) {
         this.fbeStatus();
      } else {
         this.router.navigateByUrl(Constants.routeUrls.buyElectricity);
      }
      if (!this.buyElectricityService.isPaymentSuccessful) {
         this.errorMessage = this.buyElectricityService.errorMessage;
      }
   }
   newPayment() {
      this.buyElectricityService.clearElectricityPaymentDetails();
      this.router.navigateByUrl(Constants.routeUrls.buyElectricity);
   }
   navigateToDashboard() {
      this.buyElectricityService.clearElectricityPaymentDetails();
      this.router.navigateByUrl(Constants.routeUrls.dashboard);
   }

   retryPayment() {
      const isFBE = this.buyElectricityService.isFBEClaimed;
      if (this.paymentRetryTimes <= Constants.VariableValues.maximumPaymentAttempts) {
         if (!this.buyElectricityService.isNoResponseReceived) {
            this.buyElectricityService.createGuID();
         }
         this.paymentRetryTimes++;
         this.requestInprogress = true;
         this.isButtonLoader = true;
         this.buyElectricityService.makeElectricityPayment(true, isFBE).subscribe((validationResponse) => {
            this.requestInprogress = false;
            this.isButtonLoader = false;
            if (this.buyElectricityService.isElectricityPaymentStatusValid(validationResponse)) {
               this.requestInprogress = true;
               this.isButtonLoader = true;
               this.buyElectricityService.makeElectricityPayment(false, isFBE).subscribe((paymentResponse) => {
                  this.requestInprogress = false;
                  this.isButtonLoader = false;
                  this.errorMessage = '';

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
                              if (approveItResponse.metadata.resultData[0].resultDetail[0].operationReference === 'FBEVoucherRedeem' &&
                                 approveItResponse.metadata.resultData[0].resultDetail[0].result === 'R00') {
                                 this.buyElectricityService
                                    .updateFBETransactionID(approveItResponse.metadata.resultData[0].transactionID);
                              } else {
                                 this.buyElectricityService
                                    .updateTransactionID(approveItResponse.metadata.resultData[0].transactionID);
                              }
                              this.buyElectricityService.updateexecEngineRef(approveItResponse.metadata.resultData[0].execEngineRef
                                 || approveItResponse.metadata.resultData[0].transactionID);
                              this.bsModalRef.content.processApproveItResponse(approveItResponse);
                              this.buyElectricityService.isBeneficiarySaved(approveItResponse);
                           }, (error: any) => {
                              this.raiseSystemError();
                           });
                        } catch (e) {
                        }
                     }, (error: any) => {
                        this.raiseSystemError();
                     });

                     this.bsModalRef.content.updateSuccess.subscribe(value => {
                        this.buyError = this.buyElectricityService.errorMessage;
                        this.buyElectricityService.isPaymentSuccessful = value;

                        if (this.buyElectricityService.isFBEClaimed) {
                           // if (this.buyElectricityService.isFBETransactionValid(paymentResponse)) {
                           if (value === true) {
                              this.buyElectricityService.isPaymentSuccessful = value;
                              this.buyElectricityService
                                 .fbeClaimed(this.buyElectricityService.electricityDetails.fbeTransactionId,
                                    this.buyElectricityService.getBuyElectricityToVm())
                                 .subscribe(() => {
                                    this.fbeStatus();
                                    this.disableRetry(value);
                                 }, (error: any) => {
                                    this.raiseSystemError();
                                 });
                           } else {
                              this.errorMessage = paymentResponse.resultData[0].resultDetail.length ?
                                 paymentResponse.resultData[0].resultDetail[0].reason : '';
                           }
                        } else {
                           this.buyElectricityService.updateTransactionID(paymentResponse.resultData[0].transactionID);
                           this.buyElectricityService.updateexecEngineRef(paymentResponse.resultData[0].execEngineRef
                              || paymentResponse.resultData[0].transactionID);
                           this.buyElectricityDetail = this.buyElectricityService.getBuyElectricityDetailsInfo();
                           this.disableRetry(value);
                        }

                     }, (error: any) => {
                        this.raiseSystemError();
                     });

                     this.bsModalRef.content.resendApproveDetails.subscribe(() => {
                        this.buyElectricityService.updateTransactionID(paymentResponse.resultData[0].transactionID);
                        this.buyElectricityService.isNoResponseReceived = false;
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
                           this.router.navigateByUrl(Constants.routeUrls.buyElectricityStatus);
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
                     this.buyElectricityService.updateTransactionID(paymentResponse.resultData[0].transactionID);
                     this.buyElectricityService.updateexecEngineRef(paymentResponse.resultData[0].execEngineRef
                        || paymentResponse.resultData[0].transactionID);
                     this.buyElectricityService.isPaymentSuccessful = true;
                     this.buyElectricityService.isNoResponseReceived = false;
                     this.successful = true;
                     this.heading = Constants.labels.paymentSuccess;
                     this.buyElectricityService.refreshAccounts();
                     this.buyElectricityService.isBeneficiarySaved({ metadata: validationResponse });
                     this.router.navigateByUrl(Constants.routeUrls.buyElectricityStatus);

                  } else if (responseStatus === 'FAILURE') {
                     this.buyElectricityService.errorMessage = responseFailureReason;
                     this.buyError = responseFailureReason;
                     this.buyElectricityService.isPaymentSuccessful = false;
                     this.buyElectricityService.isNoResponseReceived = false;
                     this.successful = false;
                     this.heading = Constants.labels.paymentFailed;
                     this.router.navigateByUrl(Constants.routeUrls.buyElectricityStatus);
                  } else {
                     this.buyElectricityService.errorMessage = paymentResponse.resultData[0].resultDetail.find(item =>
                        item.operationReference === 'TRANSACTION').reason;
                     this.buyError = this.buyElectricityService.errorMessage;

                     this.buyElectricityService.isPaymentSuccessful = false;
                     this.buyElectricityService.isNoResponseReceived = false;
                     this.router.navigateByUrl(Constants.routeUrls.buyElectricityStatus);
                  }

               }, (error) => {
                  this.successful = false;
                  this.heading = this.labels.somethingWentWrong;
                  this.buyElectricityService.redirecttoStatusPage();
               });
            } else {
               this.disableRetry(false);
            }
         }, (error) => {
            this.disableRetry(false);
            this.requestInprogress = false;
            this.isButtonLoader = false;
         });
      } else {
         this.disableRetryButton = true;
         this.errorMessage = this.labels.purchaseRetryMessage;
      }
   }

   private fbeStatus() {
      this.buyElectricityToVm = this.buyElectricityService.getBuyElectricityToVm();
      this.successful = this.buyElectricityService.isPaymentSuccessful;
      this.heading = this.successful ?
         Constants.labels.fbeClaimSuccessful :
         Constants.labels.fbeClaimUnSuccessful;
   }
   // raise error to system message control
   private raiseSystemError() {
      this.requestInprogress = false;
      this.isButtonLoader = false;
      this.bsModalRef.hide();
      this.buyElectricityService.redirecttoStatusPage();
      this.successful = false;
      this.disableRetryButton = true;
   }
   ngOnDestroy() {
      this.buyElectricityService.clearElectricityPaymentDetails();
      CommonUtility.addPrintHeaderFooter();
   }
   public get isNoResponseReceived(): boolean {
      return this.buyElectricityService.isNoResponseReceived;
   }
}
