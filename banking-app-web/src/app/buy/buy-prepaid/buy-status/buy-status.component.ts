import { IBuyPrepaidDetail } from './../../../core/services/models';
import { IBuyForVm, IBuyToVm, IBuyAmountVm } from './../buy.models';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router, PreloadAllModules } from '@angular/router';

import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ISubscription } from 'rxjs/Subscription';
import { OutofbandVerificationComponent } from '../../../shared/components/outofband-verification/outofband-verification.component';

import { Constants } from './../../../core/utils/constants';
import { CommonUtility } from './../../../core/utils/common';
import { BuyService } from './../buy.service';
import { SystemErrorService } from '../../../core/services/system-services.service';

@Component({
   selector: 'app-buy-status',
   templateUrl: './buy-status.component.html',
   styleUrls: ['./buy-status.component.scss']
})
export class BuyStatusComponent implements OnInit, OnDestroy {
   heading: string;
   successful: boolean;
   labels = Constants.labels;
   accountNickName: string;
   disableRetryButton = false;
   requestInprogress = false;
   isButtonLoader: boolean;
   private paymentRetryTimes = 1;
   buyAmountVm: IBuyAmountVm;
   buyForVm: IBuyForVm;
   buyToVm: IBuyToVm;
   buyPrepaidDetail: IBuyPrepaidDetail;
   errorMessage: String;
   dateFormat: string = Constants.formats.ddMMMMyyyy;
   amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
   bsModalRef: BsModalRef;
   modalSubscription: ISubscription;
   buyError: string;
   print = CommonUtility.print.bind(CommonUtility);

   @Input() disableButton = false;
   constructor(private router: Router,
      public buyService: BuyService,
      private modalService: BsModalService, private systemErrorService: SystemErrorService) { }

   private disableRetry(value: boolean) {
      this.successful = value;
      this.errorMessage = this.buyService.errorMessage;
      this.disableRetryButton = value;
      if (value) {
         this.heading = Constants.labels.paymentSuccess;
      } else {
         this.heading = Constants.labels.paymentFailed;
      }
   }
   ngOnInit() {
      CommonUtility.removePrintHeaderFooter();
      this.errorMessage = this.buyService.errorMessage;
      if (this.buyService.isTransferStatusNavigationAllowed()) {
         this.buyToVm = this.buyService.getBuyToVm();
         this.buyAmountVm = this.buyService.getBuyAmountVm();
         this.buyForVm = this.buyService.getBuyForVm();
         this.accountNickName = this.buyAmountVm.selectedAccount.nickname;
         this.buyPrepaidDetail = this.buyService.getPrepaidDetailInfo();
         /* condition for succesful and unsuccessful purchase*/
         if (this.buyService.getPaymentStatus()) {
            this.successful = true;
            this.heading = Constants.labels.paymentSuccess;
         } else {
            this.successful = false;
            this.heading = Constants.labels.paymentFailed;
         }
      } else {
         this.router.navigateByUrl(Constants.routeUrls.buy);
      }
   }
   // raise error to system message control
   private raiseSystemError() {
      this.disableRetry(false);
      this.requestInprogress = false;
      this.isButtonLoader = false;
      this.disableRetryButton = true;
      this.bsModalRef.hide();
      this.successful = false;
      this.buyService.redirecttoStatusPage();
   }
   newPurchase() {
      this.buyService.clearRechargePaymentDetails();
      this.router.navigateByUrl(Constants.routeUrls.buy);
   }
   navigateToDashboard() {
      this.buyService.clearRechargePaymentDetails();
      this.router.navigateByUrl(Constants.routeUrls.dashboard);
   }
   retryPayment() {
      let subscriber;
      if (this.paymentRetryTimes <= Constants.VariableValues.maximumPaymentAttempts) {
         if (!this.buyService.isNoResponseReceived) {
            this.buyService.createGuID();
         }
         this.paymentRetryTimes++;
         this.requestInprogress = true;
         this.isButtonLoader = true;
         subscriber = this.buyService.buyPrepaid().subscribe((validationResponse) => {
            this.requestInprogress = false;
            this.isButtonLoader = false;
            if (this.buyService.isPrepaidStatusValid(validationResponse)) {
               this.requestInprogress = true;
               this.isButtonLoader = true;
               this.buyService.isNoResponseReceived = false;
               this.buyService.buyPrepaid(false).subscribe((paymentResponse) => {
                  this.requestInprogress = false;
                  this.isButtonLoader = false;
                  let responseStatus = '';
                  try {
                     responseStatus = paymentResponse.resultData[0].resultDetail.find(item =>
                        item.operationReference === 'SECURETRANSACTION').status;
                  } catch (error) {
                  }

                  if (responseStatus === '') {
                     responseStatus = paymentResponse.resultData[0].resultDetail.find(item =>
                        item.operationReference === 'TRANSACTION').status;
                  }

                  if (responseStatus === 'PENDING') {
                     this.buyService.updateTransactionID(paymentResponse.resultData[0].transactionID);
                     this.buyService.updateexecEngineRef(paymentResponse.resultData[0].execEngineRef
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
                        this.buyService.isPaymentSuccessful = value;
                        this.router.navigateByUrl(Constants.routeUrls.buyStatus);
                     }, (error: any) => {
                        this.raiseSystemError();
                     });

                     this.bsModalRef.content.resendApproveDetails.subscribe(() => {
                        this.buyService.setSecureTransactionVerification(this.buyService.prepaidDetails.transactionID);
                        this.buyService.isNoResponseReceived = false;
                        this.buyService.buyPrepaid(false)
                           .subscribe((buyResponse) => {
                              this.buyService.updateTransactionID(buyResponse.resultData[0].transactionID);
                              this.buyService.updateexecEngineRef(buyResponse.resultData[0].execEngineRef
                                 || buyResponse.resultData[0].transactionID);
                              this.bsModalRef.content.processResendApproveDetailsResponse(buyResponse);
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
                     this.buyService.updateTransactionID(paymentResponse.resultData[0].transactionID);
                     this.buyService.updateexecEngineRef(paymentResponse.resultData[0].execEngineRef
                        || paymentResponse.resultData[0].transactionID);
                     this.buyService.isPaymentSuccessful = true;
                     this.buyService.refreshAccounts();
                     this.buyService.isBeneficiarySaved({ metadata: validationResponse });
                     this.buyService.isNoResponseReceived = false;
                     this.successful = true;
                     this.heading = Constants.labels.paymentSuccess;
                     this.router.navigateByUrl(Constants.routeUrls.buyStatus);
                  } else {
                     this.buyService.errorMessage = paymentResponse.resultData[0].resultDetail.find(item =>
                        item.operationReference === 'TRANSACTION').reason;
                     this.buyError = this.buyService.errorMessage;
                     this.buyService.isPaymentSuccessful = false;
                     this.buyService.isNoResponseReceived = false;
                     this.successful = false;
                     this.heading = Constants.labels.paymentFailed;
                     this.disableRetry(false);
                     this.router.navigateByUrl(Constants.routeUrls.buyStatus);
                  }
               }, (error) => {
                  this.successful = false;
                  this.heading = Constants.labels.somethingWentWrong;
                  this.buyService.redirecttoStatusPage();
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

   ngOnDestroy() {
      CommonUtility.addPrintHeaderFooter();
      this.buyService.clearRechargePaymentDetails();
   }
   public get isNoResponseReceived(): boolean {
      return this.buyService.isNoResponseReceived;
   }
}
