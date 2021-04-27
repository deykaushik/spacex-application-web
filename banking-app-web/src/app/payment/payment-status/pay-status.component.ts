import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { Router, PreloadAllModules } from '@angular/router';

import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ISubscription } from 'rxjs/Subscription';
import { OutofbandVerificationComponent } from '../../shared/components/outofband-verification/outofband-verification.component';

import { Constants } from './../../core/utils/constants';
import { CommonUtility } from './../../core/utils/common';
import { PaymentService } from './../../payment/payment.service';
import { IPaymentDetail, IGaEvent } from '../../core/services/models';
import { IPayToVm, IPayAmountVm, IPayForVm } from '../payment.models';
import { BaseComponent } from '../../core/components/base/base.component';
import { ReportsService } from '../../reports/reports.service';
import { PaymentPopComponent } from '../../reports/templates/payment-pop/payment-pop.component';

@Component({
   selector: 'app-status',
   templateUrl: './pay-status.component.html',
   styleUrls: ['./pay-status.component.scss']
})
export class PayStatusComponent extends BaseComponent implements OnInit, OnDestroy {
   isCrossBorderPayment: boolean;
   heading: string;
   paymentDetail: IPaymentDetail;
   payToVm: IPayToVm;
   successful: boolean;
   disableRetryButton = false;
   private paymentRetryTimes = 1;
   requestInprogress = false;
   isButtonLoader: boolean;
   accountNickName: string;
   payAmountVm: IPayAmountVm;
   labels = Constants.labels;
   payForVm: IPayForVm;
   public apiFailureMessage?: string;
   amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
   isAccountPayment = false;
   isMobilePayment = false;
   isCreditCardPayment = false;
   bsModalRef: BsModalRef;
   modalSubscription: ISubscription;
   paymentError: string;
   paymentNotice: string;
   defaultCurrency = Constants.defaultCrossPlatformCurrency.name;

   constructor(private router: Router,
      private paymentService: PaymentService,
      private modalService: BsModalService,
      injector: Injector, private reportService: ReportsService) {
      super(injector);
   }
   print() {
      this.reportService.open(PaymentPopComponent,
         {
            paymentDetail: this.paymentDetail, payForVm: this.payForVm, payToVm: this.payToVm,
            payAmountVm: this.payAmountVm, accountNickName: this.accountNickName,
            isAccountPayment: this.paymentService.isAccountPayment(),
            isMobilePayment: this.paymentService.isMobilePayment(),
         },
         { title: 'Printing Proof of Payment' });
   }
   private disableRetry(value: boolean) {
      this.successful = value;
      this.disableRetryButton = value;
   }

   ngOnInit() {
      if (this.paymentService.isPaymentStatusNavigationAllowed()) {
         this.paymentDetail = this.paymentService.getPaymentDetailInfo();
         this.payForVm = this.paymentService.getPayForVm();
         this.payToVm = this.paymentService.getPayToVm();
         this.payAmountVm = this.paymentService.getPayAmountVm();
         this.accountNickName = this.payAmountVm.selectedAccount.nickname;
         this.isCrossBorderPayment = this.payToVm.isCrossBorderPaymentActive;
         this.apiFailureMessage = this.paymentService.errorMessage;
         this.apiFailureMessage = this.paymentService.isInvalidRecipientSaved === Constants.Statuses.No
            ? Constants.labels.BenificiaryErrorMsg : this.paymentService.errorMessage;
         if (this.paymentService.getPaymentStatus()) {
            this.successful = true;
            this.paymentService.isPaymentSuccessful = true;
            this.heading = this.labels.paymentSuccess;
            this.paymentNotice = this.paymentService.paymentNotice;
         } else {
            this.successful = false;
            this.heading = this.labels.paymentFailed;
            this.paymentService.isPaymentSuccessful = false;
         }
         this.isAccountPayment = this.paymentService.isAccountPayment();
         this.isMobilePayment = this.paymentService.isMobilePayment();
         this.isCreditCardPayment = !this.isAccountPayment && !this.isMobilePayment && !this.isCrossBorderPayment;
      } else {
         this.router.navigateByUrl(Constants.routeUrls.payLanding);
      }
   }

   ngOnDestroy() {
      this.paymentService.clearPaymentDetails();
   }

   newPayment() {
      this.paymentService.clearPaymentDetails();
      this.router.navigateByUrl(Constants.routeUrls.payLanding);
   }
   navigateToDashboard() {
      this.paymentService.clearPaymentDetails();
      this.router.navigateByUrl(Constants.routeUrls.dashboard);
   }


   private raiseAPIFailureError(closeNavigationWindow = false) {
      if (closeNavigationWindow) {
         this.bsModalRef.content.navigateClose();
      }
      this.requestInprogress = false;
      this.isButtonLoader = false;
      this.successful = false;
      this.paymentService.isPaymentSuccessful = false;
      this.paymentService.raiseSystemErrorforAPIFailure();
   }
   retryPayment() {
      let subscriber;
      if (this.paymentRetryTimes <= Constants.VariableValues.maximumPaymentAttempts) {
         this.paymentRetryTimes++;
         this.requestInprogress = true;
         this.isButtonLoader = true;
         if (!this.paymentService.isAPIFailure) {
            this.paymentService.createGUID();
         }
         subscriber = this.paymentService.makePayment().subscribe((validationResponse) => {
            this.paymentService.isAPIFailure = false;
            this.requestInprogress = false;
            this.isButtonLoader = false;
            if (this.paymentService.isPaymentStatusValid(validationResponse)) {
               this.requestInprogress = true;
               this.isButtonLoader = true;
               if (this.isCrossBorderPayment) {
                  this.paymentService.isPaymentSuccessful = true;
                  this.paymentService.refreshAccounts();
                  this.router.navigateByUrl(Constants.routeUrls.paymentStatus);
               } else {
                  this.paymentService.makePayment(false).subscribe((paymentResponse) => {
                     this.paymentService.isAPIFailure = false;
                     this.requestInprogress = false;
                     this.isButtonLoader = false;
                     // if (this.paymentService.isPaymentStatusValid(paymentResponse)) {
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
                        this.paymentService.updateTransactionID(paymentResponse.resultData[0].transactionID);
                        this.paymentService.updateexecEngineRef(paymentResponse.resultData[0].execEngineRef
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
                              this.paymentService.getApproveItStatus().subscribe(approveItResponse => {
                                 this.paymentService.updateTransactionID(approveItResponse.metadata.resultData[0].transactionID);
                                 this.paymentService.updateexecEngineRef(
                                    approveItResponse.metadata.resultData[0].execEngineRef
                                    || approveItResponse.metadata.resultData[0].transactionID);
                                 this.bsModalRef.content.processApproveItResponse(approveItResponse);
                                 this.paymentService.isBeneficiarySaved(approveItResponse);
                              }, (error: any) => {
                                 this.raiseAPIFailureError(true);
                              });
                           } catch (e) {
                           }

                        }, (error: any) => {
                           this.raiseAPIFailureError(true);
                        });

                        this.bsModalRef.content.updateSuccess.subscribe(value => {
                           this.paymentService.isPaymentSuccessful = value;
                           this.successful = value;
                           this.disableRetry(value);
                        }, (error: any) => {
                           this.raiseAPIFailureError(true);
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
                                 this.raiseAPIFailureError(true);
                              });
                        }, (error: any) => {
                           this.raiseAPIFailureError(true);
                        });

                        this.bsModalRef.content.getOTPStatus.subscribe(otpValue => {
                           this.paymentService.getApproveItOtpStatus(otpValue, this.paymentService.paymentDetails.transactionID)
                              .subscribe(otpResponse => {
                                 this.bsModalRef.content.processApproveUserResponse(otpResponse);
                              }, (error: any) => {
                                 this.raiseAPIFailureError(true);
                              });
                        }, (error: any) => {
                           this.raiseAPIFailureError(true);
                        });

                        this.bsModalRef.content.otpIsValid.subscribe(() => {
                           this.paymentService.getApproveItStatus().subscribe(approveItResponse => {
                              this.bsModalRef.content.processApproveItResponse(approveItResponse);
                           }, (error: any) => {
                              this.raiseAPIFailureError(true);
                           });
                        }, (error: any) => {
                           this.raiseAPIFailureError(true);
                        });

                        this.modalSubscription = this.modalService.onHidden.asObservable()
                           .subscribe(() => {
                              this.router.navigateByUrl(Constants.routeUrls.paymentStatus);
                              this.bsModalRef.content.unsubscribeAll();
                           });
                     } else if (responseStatus === 'SUCCESS') {
                        this.paymentService.updateTransactionID(paymentResponse.resultData[0].transactionID);
                        this.paymentService.updateexecEngineRef(
                           paymentResponse.resultData[0].execEngineRef ||
                           paymentResponse.resultData[0].transactionID);
                        this.paymentService.isPaymentSuccessful = true;
                        this.paymentService.refreshAccounts();
                        this.paymentService.isBeneficiarySaved({ metadata: validationResponse });
                        this.successful = true;
                        this.router.navigateByUrl(Constants.routeUrls.paymentStatus);
                     } else {
                        this.paymentError = this.paymentService.errorMessage;
                        this.paymentService.isPaymentSuccessful = false;
                        this.disableRetry(false);
                     }
                  }, (error) => {
                     this.raiseAPIFailureError();
                  });
               }
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
         this.apiFailureMessage = Constants.labels.paymentRetryMessage;
      }
   }

   public get IsAPIFailure(): boolean {
      return this.paymentService.isAPIFailure;
   }
}

