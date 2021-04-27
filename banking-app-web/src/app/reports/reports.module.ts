import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsService } from './reports.service';
import { PaymentPopComponent } from './templates/payment-pop/payment-pop.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LandingComponent } from './landing/landing.component';
import { ComponentHostDirective } from './component-host.directive';
import { SharedModule } from '../shared/shared.module';
import { TransferPopComponent } from './templates/transfer-pop/transfer-pop.component';
import { GamePopComponent } from './templates/game-pop/game-pop.component';

@NgModule({
   imports: [
      CommonModule, SharedModule
   ],
   declarations: [PaymentPopComponent, HeaderComponent, FooterComponent, LandingComponent, ComponentHostDirective, TransferPopComponent,
      GamePopComponent],
   entryComponents: [PaymentPopComponent, TransferPopComponent, GamePopComponent, LandingComponent],
   providers: [ReportsService]
})
export class ReportsModule { }
