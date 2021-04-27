import { Component, OnInit, Injector } from '@angular/core';
import { GameService } from '../game.service';
import { BaseComponent } from '../../../core/components/base/base.component';
import { Constants } from '../../../core/utils/constants';
import { CommonUtility } from '../../../core/utils/common';
import { IGameWinningNumbersData } from '../../../core/services/models';
import { AuthConstants } from '../../../auth/utils/constants';
import { GAEvents } from '../../../core/utils/ga-event';

@Component({
   selector: 'app-game-winning-numbers',
   templateUrl: './game-winning-numbers.component.html',
   styleUrls: ['./game-winning-numbers.component.scss']
})
export class GameWinningNumbersComponent extends BaseComponent implements OnInit {

   selectedWinningNumbersInfo: IGameWinningNumbersData[];
   winningNumbersInfo: IGameWinningNumbersData[];
   formats = Constants.formats;
   ballClassToReturn: string;
   skeletonMode = true;
   winningNumbersLabels = Constants.labels.lottoLabels;
   winningNumberBackBtn = Constants.path.winningNumbersList;
   lottoErrorText: string;
   isLottoError: boolean;

   constructor(private gameService: GameService, injector: Injector) {
      super(injector);
   }

   ngOnInit() {
      this.skeletonMode = true;
      this.getWinningNumbersData();
      const winingNumber = GAEvents.gameSection.viewWiningNumbers;
      this.sendEvent(winingNumber.eventAction, winingNumber.label, null, winingNumber.category);
   }

   getWinningNumbersData() {
      this.gameService.getWinningNumbers().subscribe(selectedWinningNumbersInfo => {
         if (selectedWinningNumbersInfo) {
            this.winningNumbersInfo = selectedWinningNumbersInfo;
         }
      },
      error => {
         this.isLottoError = true;
         this.lottoErrorText = AuthConstants.messages.nextLottoPalletError;
      },
      () => {
         this.skeletonMode = false;
      });
   }

}
