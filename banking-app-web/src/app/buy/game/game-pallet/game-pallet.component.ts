import { Component, OnInit, AfterViewChecked, ChangeDetectorRef, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConstants } from '../../../auth/utils/constants';
import { SharedModule } from '../../../shared/shared.module';
import { Constants } from '../../../core/utils/constants';

import { GameService } from '../game.service';
import { SystemErrorService } from './../../../core/services/system-services.service';
import { IGameData } from '../../../core/services/models';
import { BaseComponent } from '../../../core/components/base/base.component';
import { GAEvents } from '../../../core/utils/ga-event';

@Component({
   selector: 'app-game-pallet',
   templateUrl: './game-pallet.component.html',
   styleUrls: ['./game-pallet.component.scss']
})
export class GamePalletComponent extends BaseComponent implements OnInit, AfterViewChecked {

   emptyStringConst = Constants.lottoConst.emptyString;
   lottoConst = Constants.lottoConst.lottoType;
   powerballConst = Constants.lottoConst.pwbType;
   lottoErrors = Constants.lottoErrorCode;
   skeletonMode = true;
   lottoError = Constants.lottoConst.emptyString;
   noLottoRecords = false;
   isRecords = false;
   isViewMore = false;
   threeRecords = Constants.lottoConst.threeRecords;
   lottoLabel = Constants.lottoConst.lottoLable;
   viewMoreTicketsLabel = Constants.lottoConst.viewMoreTicketsLabel;
   accountId: number;
   lottoHistoryList;
   lottoFailed = false;

   dateFormat = Constants.formats.ddMMYYYY;
   amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
   constructor(private router: Router, private gameService: GameService, private systemErrorService: SystemErrorService,
      private cdRef: ChangeDetectorRef, injector: Injector) {
      super(injector);
   }
   ngOnInit() {
      this.getLottoHistoryData();
      if (this.lottoHistoryList) {
         this.isViewMore = true;
      }
   }

   ngAfterViewChecked() {
      this.cdRef.detectChanges();
   }

   // get lotto history data
   getLottoHistoryData() {

      this.gameService.getLottoHistoryListData().subscribe((response) => {
         if (response) {
            const data = this.setResponseData(response);
            this.lottoHistoryList = data;
            this.noLottoRecords = this.lottoHistoryList ? this.lottoHistoryList.length > 0 : false;
            this.isRecords = true;
         }
         this.lottoError = this.emptyStringConst;
         this.skeletonMode = false;
         this.isViewMore = false;
      },
         error => {
            // after discussing with API team handling the error for under 18 at FE
            if (error.status === this.lottoErrors.errorUnderEighteen) {
               this.systemErrorService.closeError();
            }
            this.lottoFailed = true;
            this.lottoError = AuthConstants.messages.lottoListError;

         }
      );
   }

   viewAllTickets() {
      // navigate to view more tickets
      const ticketHistory = GAEvents.gameSection.viewHistory;
      this.sendEvent(ticketHistory.eventAction, ticketHistory.label, null, ticketHistory.category);
      this.router.navigateByUrl('game/lotto/history');
   }

   setResponseData(response) {
      response.forEach(element => {
         element.amount = -element.amount;
         switch (element.game) {
            case Constants.lottoConst.lottoType:
               if (element.isLottoPlus) {
                  element.game = Constants.lottoConst.lottoPlus1;
               } else if (element.isLottoPlusTwo) {
                  element.game = Constants.lottoConst.lottoPlus2;
               } else {
                  element.game = Constants.lottoConst.lottoTicket;
               }
               break;
            case Constants.lottoConst.pwbType:
               if (element.isLottoPlus) {
                  element.game = Constants.lottoConst.pwbPlus;
               } else {
                  element.game = Constants.lottoConst.pwbTicket;
               }
               break;
            default:
               element.game = Constants.lottoConst.lottoTicket;
         }
      });

      return response;
   }

}
