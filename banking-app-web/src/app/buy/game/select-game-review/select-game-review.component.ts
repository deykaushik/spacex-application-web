import { IGameData } from './../../../core/services/models';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { OutofbandVerificationComponent } from '../../../shared/components/outofband-verification/outofband-verification.component';
import { ISubscription } from 'rxjs/Subscription';

import { IStepInfo } from './../../../shared/components/work-flow/work-flow.models';
import { Constants } from './../../../core/utils/constants';
import { CommonUtility } from './../../../core/utils/common';
import { Component, OnInit, EventEmitter, Output, Injector, Inject } from '@angular/core';
import { GameService } from './../game.service';
import { SelectGameForModel } from './../select-game-for/select-game-for.model';
import { ISelectGameVm, ISelectNumbersVm, ISelectGameForVm, ISelectedBalls, Board } from './../models';
import { WorkFlowComponent } from '../../../shared/components/work-flow/work-flow.component';
import { BaseComponent } from '../../../core/components/base/base.component';
import { PreFillService } from '../../../core/services/preFill.service';
import { SystemErrorService } from '../../../core/services/system-services.service';

@Component({
   selector: 'app-select-game-review',
   templateUrl: './select-game-review.component.html',
   styleUrls: ['./select-game-review.component.scss']
})
export class SelectGameReviewComponent extends BaseComponent implements OnInit {
   isReplay: boolean;
   selectedLotteryNumbers: string;
   selectedBalls: ISelectedBalls[];
   @Output() isComponentValid = new EventEmitter<boolean>();
   @Output() isButtonLoader = new EventEmitter<boolean>();
   labels = Constants.labels;
   smsNotificationType = Constants.notificationTypes.SMS;
   noneNotificationType = Constants.notificationTypes.none;
   selectGame: ISelectGameVm;
   selectNumbers: ISelectNumbersVm;
   selectGameFor: ISelectGameForVm;
   accountNickName: string;
   gameTypeName: string;
   increasedChances: string;
   termsAndConditionsLink: string;
   gameTimeOut = false;
   parentComponent: WorkFlowComponent;
   bsModalRef: BsModalRef;
   modalSubscription: ISubscription;
   purchaseError: string;
   isNoneNotification = false;

   constructor(private gameService: GameService, public router: Router, private inj: Injector,
      @Inject(DOCUMENT) private document: Document, private modalService: BsModalService,
      private preFillService: PreFillService, private systemErrorService: SystemErrorService) {
      super(inj);
      this.parentComponent = this.inj.get(WorkFlowComponent);
      if (this.preFillService.activeData) {
         this.isReplay = this.preFillService.activeData.isReplay;
      }
   }

   // raise error to system message control
   private raiseSystemError() {
      this.isButtonLoader.emit(false);
      this.isComponentValid.emit(false);
      this.gameService.raiseSystemError(true);
   }
   ngOnInit() {
      this.isComponentValid.emit(true);
      this.selectGame = this.gameService.getSelectGameVm();
      this.selectNumbers = this.gameService.getSelectNumbersVm();
      if (this.isReplay) {
         this.pushSelectedBallsForReplay();
      }

      this.selectGameFor = this.gameService.getSelectGameForVm();
      this.isNoneNotification = this.selectGameFor.notification.value !== this.noneNotificationType ? false : true;
      this.accountNickName = this.selectNumbers.FromAccount.nickname;
      this.termsAndConditionsLink = Constants.links.termsAndConditionsPage;
      this.gameTypeName = Constants.VariableValues.gameTypes[this.selectGame.game].text;
      this.increasedChances = '';
      if (this.selectNumbers.IsLottoPlus) {
         if (this.selectGame.game === Constants.VariableValues.gameTypes.PWB.code) {
            this.increasedChances += `${Constants.labels.lottoLabels.IsPowerBallPlus}`;
         } else {
            this.increasedChances += `${Constants.labels.lottoLabels.IsLottoPlusOne}`;
         }
      }
      if (this.selectNumbers.IsLottoPlus && this.selectNumbers.IsLottoPlusTwo) {
         this.increasedChances += ` and `;
      }
      if (this.selectNumbers.IsLottoPlusTwo) {
         this.increasedChances += `${Constants.labels.lottoLabels.IsLottoPlusTwo}`;
      }
   }

   getLotteryNumberGroup(lotteryNumber) {
      return CommonUtility.getLotteryNumberGroup(lotteryNumber);
   }

   // get selectNumbers array and push selected balls into it for replay
   pushSelectedBallsForReplay() {
      let splitNumbers = [];
      this.selectNumbers.BoardDetails.forEach((selectNumber) => {
         this.selectedLotteryNumbers = selectNumber.NumbersPlayed;

         splitNumbers = this.selectedLotteryNumbers.split(' ').map((textNumber) => {
            return parseInt(textNumber, 10);
         });
         const selBalls: ISelectedBalls[] = [];
         splitNumbers.forEach((number) => {
            if (this.selectGame.game === Constants.lottoConst.pwbType) {
               selBalls.push({
                  numberValue: number,
                  className: Constants.lottoConst.board1PowerBallClass
               });
            } else {
               selBalls.push({
                  numberValue: number,
                  className: Constants.lottoConst.lottoGroup + this.getLotteryNumberGroup(number)
               });
            }
         });

         if (this.selectGame.game === Constants.lottoConst.pwbType) {
            const len = selBalls.length;
            selBalls[len - 1].className = Constants.lottoConst.board2PowerBallClass;
         }
         this.selectedBalls = [];
         selBalls.forEach((selBall) => {
            this.selectedBalls.push(selBall);
         });

         selectNumber.SelectedBalls = this.selectedBalls;

      });
   }

   hideTimeOutOverlay(code) {
      this.gameTimeOut = false;
      this.document.body.classList.remove('overlay-no-scroll');
      this.gameService.resetAllVm();
      this.parentComponent.onStepClick(1);
      if (code === Constants.VariableValues.gameTypes.LOT.code) {
         this.gameService.saveSelectGameVm({
            game: code,
            method: Constants.VariableValues.playMethods.quickPick.code
         });
         return;
      }
      if (code === Constants.VariableValues.gameTypes.PWB.code) {
         this.gameService.saveSelectGameVm({
            game: code,
            method: Constants.VariableValues.playMethods.quickPick.code
         });
         return;
      }
      this.router.navigateByUrl(Constants.routeUrls.dashboard);
   }

   nextClick(currentStep: number) {
      this.sendEvent('buy_' + this.gameTypeName + '_review_click_on_next');
      if (this.gameService.checkGameTimeOut(this.selectGame.game)) {
         this.gameTimeOut = true;
         return true;
      }
      this.isButtonLoader.emit(true);
      this.gameService.isPurchaseSucessful = false;
      this.gameService.gameWorkflowSteps.selectGameReview.isDirty = true;
      this.gameService.gameWorkflowSteps.selectGameReview.isNavigated = true;
      this.gameService.makePurchase().subscribe((validationResponse) => {
         if (this.gameService.isPurchaseStatusValid(validationResponse)) {
            this.gameService.makePurchase(false).subscribe((paymentResponse) => {
               this.gameService.gameWorkflowSteps.selectGameReview.isDirty = true;
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
                  this.gameService.isPurchaseSucessful = false;
                  this.gameService.getGameDetails().failureReason = paymentResponse.resultData[0].resultDetail.find(item =>
                     item.operationReference === 'TRANSACTION').reason;
                  this.purchaseError = this.gameService.getGameDetails().failureReason;
                  this.isButtonLoader.emit(false);
                  this.router.navigateByUrl(Constants.routeUrls.gameStatus);
               }

            }, (error) => {
               this.raiseSystemError();
            });
         } else {
            this.purchaseError = this.gameService.getGameDetails().failureReason;
            this.isButtonLoader.emit(false);
         }
      }, (error) => {
         this.isButtonLoader.emit(false);
      });
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

   stepClick(stepInfo: IStepInfo) {
   }
}
