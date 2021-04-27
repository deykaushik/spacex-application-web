
import { Component, OnInit, Inject, Injector, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, PreloadAllModules } from '@angular/router';

import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { OutofbandVerificationComponent } from '../../../shared/components/outofband-verification/outofband-verification.component';
import { ISubscription } from 'rxjs/Subscription';

import { Constants } from './../../../core/utils/constants';
import { CommonUtility } from './../../../core/utils/common';
import { PreFillService } from '../../../core/services/preFill.service';
import { SystemErrorService } from '../../../core/services/system-services.service';

import { GameService } from './../game.service';
import { IGameData } from './../../../core/services/models';
import { ISelectGameVm, ISelectNumbersVm, ISelectGameForVm } from './../models';
import { BaseComponent } from '../../../core/components/base/base.component';
import { ReportsService } from '../../../reports/reports.service';
import { GamePopComponent } from '../../../reports/templates/game-pop/game-pop.component';
import { GAEvents } from '../../../core/utils/ga-event';

@Component({
   selector: 'app-game-status',
   templateUrl: './game-status.component.html',
   styleUrls: ['./game-status.component.scss']
})
export class GameStatusComponent extends BaseComponent implements OnInit, OnDestroy {
   showOverview: boolean;
   data: {};
   gameType: string;
   gameDetails: IGameData;
   successful = false;
   totalCost: number;
   heading: string;
   selectGame: ISelectGameVm;
   selectedNumbers: ISelectNumbersVm;
   selectGameFor: ISelectGameForVm;
   accountNickName: string;
   increasedChances: string;
   disableRetryButton = false;
   isButtonLoader = false;
   requestInprogress = false;
   gameTimeOut = false;
   labels = Constants.labels;
   amountPipeConfig = Constants.amountPipeSettings.amountWithLabel;
   notifyWinLimit = Constants.VariableValues.lotto.notifyWinLimit;
   private transferRetryTimes = 1;
   bsModalRef: BsModalRef;
   modalSubscription: ISubscription;
   purchaseError: string;
   smsNotificationType = Constants.notificationTypes.SMS;
   // print = CommonUtility.print.bind(CommonUtility);

   constructor(private gameService: GameService,
      private router: Router, @Inject(DOCUMENT)
      private document: Document,
      private modalService: BsModalService,
      private reportService: ReportsService,
      private preFillService: PreFillService, injector: Injector, private systemErrorService: SystemErrorService) {
      super(injector);
   }
   print() {
      this.reportService.open(GamePopComponent,
         {
            gameDetails: this.gameDetails, selectGameFor: this.selectGameFor, selectedNumbers: this.selectedNumbers,
            accountNickName: this.accountNickName, execEngineRef: this.gameService.execEngineRef
         },
         { title: 'Printing Proof of Payment' });
   }
   ngOnInit() {
      CommonUtility.removePrintHeaderFooter();
      if (this.preFillService.activeData) {
         this.showOverview = this.preFillService.activeData.isReplay;
      }
      if (this.gameService.isPurchaseStatusNavigationAllowed()) {
         this.gameDetails = this.gameService.getGameDetails();
         this.selectGame = this.gameService.getSelectGameVm();
         this.selectGameFor = this.gameService.getSelectGameForVm();
         this.gameType = Constants.VariableValues.gameTypes[this.gameDetails.Game].text;
         this.selectedNumbers = this.gameService.getSelectNumbersVm();
         this.selectedNumbers.drawsPlayed = 1;
         this.accountNickName = this.selectedNumbers.FromAccount.nickname;
         this.increasedChances = '';
         if (this.selectedNumbers.IsLottoPlus) {
            if (this.selectGame.game === Constants.VariableValues.gameTypes.PWB.code) {
               this.increasedChances += `${Constants.labels.lottoLabels.IsPowerBallPlus}`;
            } else {
               this.increasedChances += `${Constants.labels.lottoLabels.IsLottoPlusOne}`;
            }
         }
         if (this.selectedNumbers.IsLottoPlus && this.selectedNumbers.IsLottoPlusTwo) {
            this.increasedChances += ` and `;
         }
         if (this.selectedNumbers.IsLottoPlusTwo) {
            this.increasedChances += `${Constants.labels.lottoLabels.IsLottoPlusTwo}`;
         }
         if (this.gameService.getPurchaseStatus()) {
            this.successful = true;
            this.heading = Constants.labels.purchaseSuccess;
            if (this.showOverview) {
               const replayLotto = GAEvents.gameSection.replay;
               this.sendEvent(replayLotto.eventAction, replayLotto.label, null, replayLotto.category);
            }
            const lottoNewPurches = GAEvents.gameSection.newPurchase;
            this.sendEvent(lottoNewPurches.eventAction, lottoNewPurches.label, null, lottoNewPurches.category);
         } else {
            this.successful = false;
            this.heading = Constants.labels.purchaseFailed;
         }
      } else {
         this.router.navigateByUrl(Constants.routeUrls.gameLanding);
      }
   }

   newPurchase() {
      this.data = {
         isReplay: false
      };
      this.preFillService.activeData = this.data;
      this.gameService.clearGameDetails();
      this.router.navigate([Constants.routeUrls.gameLanding], { queryParams: { game: this.selectGame.game } });
   }
   navigateToDashboard() {
      this.gameService.clearGameDetails();
      this.router.navigateByUrl(Constants.routeUrls.dashboard);
   }

   goToHistory() {
      this.gameService.clearGameDetails();
      this.router.navigateByUrl('game/lotto/history');
   }

   retryPayment() {
      if (this.gameService.checkGameTimeOut(this.selectGame.game)) {
         this.gameTimeOut = true;
         return true;
      }

      if (this.transferRetryTimes <= Constants.VariableValues.maximumTransferAttempts) {
         this.transferRetryTimes++;
         this.requestInprogress = true;
         this.isButtonLoader = true;
         this.gameService.gameWorkflowSteps.selectGameReview.isDirty = true;
         this.gameService.gameWorkflowSteps.selectGameReview.isNavigated = true;
         this.gameService.makePurchase().subscribe((validationResponse) => {
            if (this.gameService.isPurchaseStatusValid(validationResponse)) {
               this.gameService.makePurchase(false).subscribe((paymentResponse) => {
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
                     this.gameService.updateTransactionID(paymentResponse.resultData[0].transactionID);
                     this.gameService.updateexecEngineRef(paymentResponse.resultData[0].execEngineRef
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
                           this.gameService.getApproveItStatus().subscribe(approveItResponse => {
                              this.gameService.updateTransactionID(approveItResponse.metadata.resultData[0].transactionID);
                              this.gameService.updateexecEngineRef(approveItResponse.metadata.resultData[0].execEngineRef
                                 || approveItResponse.metadata.resultData[0].transactionID);
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
                        this.gameService.isPurchaseSucessful = value;
                        this.successful = value;
                        this.onRequestComplete();
                     }, (error: any) => {
                        this.raiseSystemError();
                     });

                     this.bsModalRef.content.resendApproveDetails.subscribe(() => {
                        this.resendApproveDetails();
                     }, (error: any) => {
                        this.raiseSystemError();
                     });

                     this.bsModalRef.content.getOTPStatus.subscribe(otpValue => {

                        this.gameService.getApproveItOtpStatus(otpValue, this.gameService.getGameDetails().transactionID)
                           .subscribe(otpResponse => {
                              this.bsModalRef.content.processApproveUserResponse(otpResponse);
                           }, (error: any) => {
                              this.raiseSystemError();
                           });
                     }, (error: any) => {
                        this.raiseSystemError();
                     });

                     this.bsModalRef.content.otpIsValid.subscribe(() => {
                        this.gameService.getApproveItStatus().subscribe(approveItResponse => {
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

                           this.router.navigateByUrl(Constants.routeUrls.gameStatus);
                        });
                  } else if (responseStatus === 'SUCCESS') {
                     this.gameService.updateTransactionID(paymentResponse.resultData[0].transactionID);
                     this.gameService.updateexecEngineRef(paymentResponse.resultData[0].execEngineRef
                        || paymentResponse.resultData[0].transactionID);
                     this.gameService.isPurchaseSucessful = true;
                     this.gameService.refreshAccounts();
                     this.router.navigateByUrl(Constants.routeUrls.gameStatus);
                  } else {
                     this.gameService.getGameDetails().failureReason = paymentResponse.resultData[0].resultDetail.find(item =>
                        item.operationReference === 'TRANSACTION').reason;
                     this.gameService.isPurchaseSucessful = false;
                     this.router.navigateByUrl(Constants.routeUrls.gameStatus);
                  }
               }, (error) => {
                  this.onRequestComplete();
                  this.raiseSystemError();
               });
            } else {
               this.onRequestComplete();
            }
         }, (error) => {
            this.onRequestComplete();
            this.requestInprogress = false;
            this.isButtonLoader = false;
         });
      } else {
         this.disableRetryButton = true;
      }
   }

   resendApproveDetails() {

      this.gameService.makePurchase(false)
         .subscribe((paymentResponse) => {
            this.gameService.updateTransactionID(paymentResponse.resultData[0].transactionID);
            this.gameService.updateexecEngineRef(paymentResponse.resultData[0].execEngineRef
               || paymentResponse.resultData[0].transactionID);
            this.bsModalRef.content.processResendApproveDetailsResponse(paymentResponse);
         }, (error: any) => {
            this.raiseSystemError();
         });
   }

   onRequestComplete() {
      this.isButtonLoader = false;
      this.requestInprogress = false;
   }

   hideTimeOutOverlay(code) {
      this.gameTimeOut = false;
      this.document.body.classList.remove('overlay-no-scroll');
      if (code) {
         this.gameService.clearGameDetails();
         this.router.navigate([Constants.routeUrls.gameLanding], { queryParams: { game: code } });
         return;
      }
      this.router.navigateByUrl(Constants.routeUrls.dashboard);
   }
   // raise error to system message control
   private raiseSystemError() {
      this.requestInprogress = false;
      this.isButtonLoader = false;
      this.disableRetryButton = true;
      this.gameService.raiseSystemError(true);
   }
   ngOnDestroy() {
      this.gameService.clearGameDetails();
      CommonUtility.addPrintHeaderFooter();
   }

}
