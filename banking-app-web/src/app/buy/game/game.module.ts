import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { LandingComponent } from './landing/landing.component';
import { SelectGameComponent } from './select-game/select-game.component';
import { GameRoutingModule } from './game-routing.module';
import { GameService } from './game.service';
import { SharedModule } from '../../shared/shared.module';
import { SelectNumbersComponent } from './select-numbers/select-numbers.component';
import { SelectGameForComponent } from './select-game-for/select-game-for.component';
import { FormsModule } from '@angular/forms';
import { SelectGameReviewComponent } from './select-game-review/select-game-review.component';
import { GameStatusComponent } from './game-status/game-status.component';
import { GameTimeoutComponent } from './game-timeout/game-timeout.component';
import { GamePalletComponent } from './game-pallet/game-pallet.component';
import { GameTicketDetailsComponent } from './game-ticket-details/game-ticket-details.component';
import { GameHistoryComponent } from './game-history/game-history.component';
import { GameWinningNumbersComponent } from './game-winning-numbers/game-winning-numbers.component';
import { DrawDetailComponent } from './draw-detail/draw-detail.component';
import { BallColorPipe } from '../../shared/pipes/ball-color.pipe';
import { GameListComponent } from './game-list/game-list.component';
import { OrderByPipe } from '../../shared/pipes/order-by.pipe';
import { SelectGameModel } from './select-game/select-game-model';
import { SelectNumbersModel } from './select-numbers/select-numbers-model';
import { LottoNumberPickerComponent } from '../../shared/components/lotto-number-picker/lotto-number-picker.component';
import { GameTimeoutReplayComponent } from './game-timeout-replay/game-timeout-replay.component';
import { ReportsService } from '../../reports/reports.service';
import { ReportsModule } from '../../reports/reports.module';

@NgModule({
   imports: [
      GameRoutingModule,
      FormsModule,
      SharedModule,
      CommonModule,
      ReportsModule
   ],
   entryComponents: [LandingComponent, GameStatusComponent,
      SelectGameComponent, SelectNumbersComponent, SelectGameForComponent, SelectGameReviewComponent],
   declarations: [LandingComponent, SelectGameComponent, SelectNumbersComponent,
      SelectGameForComponent, SelectGameReviewComponent, GameStatusComponent, GameTimeoutComponent, GamePalletComponent,
      GameTicketDetailsComponent, GameHistoryComponent, GameWinningNumbersComponent, DrawDetailComponent, BallColorPipe,
      GameListComponent, OrderByPipe, GameTimeoutReplayComponent],
   providers: [GameService, BsModalRef, BsModalService, BallColorPipe, ReportsService,
      OrderByPipe],
   exports: [GamePalletComponent]
})
export class GameModule { }
