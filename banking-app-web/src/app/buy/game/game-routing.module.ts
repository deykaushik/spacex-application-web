
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { GameStatusComponent } from './game-status/game-status.component';
import { UnsavedChangesGuard } from '../../core/guards/unsaved-changes-guard.service';
import { GoBackGuard } from '../../core/guards/go-back-guard.service';
import { GameTicketDetailsComponent } from './game-ticket-details/game-ticket-details.component';
import { GameHistoryComponent } from './game-history/game-history.component';
import { GameWinningNumbersComponent } from './game-winning-numbers/game-winning-numbers.component';
import { DrawDetailComponent } from './draw-detail/draw-detail.component';
import { TermsConditionGuard } from '../../core/guards/terms-condition.guard';

const routes: Routes = [
   {
      path: '', component: LandingComponent, canDeactivate: [UnsavedChangesGuard, GoBackGuard],
      canLoad: [GoBackGuard],
      canActivate: [TermsConditionGuard]
   },
   { path: 'status', component: GameStatusComponent, canDeactivate: [GoBackGuard], canLoad: [GoBackGuard] },
   {
      path: ':accountnumber', component: LandingComponent, canDeactivate: [UnsavedChangesGuard, GoBackGuard], canLoad: [GoBackGuard],
      canActivate: [TermsConditionGuard]
   },
   { path: 'ticket/:ticketType/:batchID', component: GameTicketDetailsComponent },
   { path: 'lotto/history', component: GameHistoryComponent, canDeactivate: [GoBackGuard], canLoad: [GoBackGuard] },
   { path: 'winning/numbers', component: GameWinningNumbersComponent },
   { path: 'drawdetail/:ticketType/:drawNumber', component: DrawDetailComponent }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class GameRoutingModule { }
