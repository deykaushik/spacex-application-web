import { NgModule, OnInit, APP_INITIALIZER, Inject } from '@angular/core';
import { BrowserModule, DOCUMENT } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { UnauthorizedComponent } from './core/components/unauthorized/unauthorized.component';
import { AuthModule } from './auth/auth.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { HeaderComponent } from './core/components/header/header.component';
import { SharedModule } from './shared/shared.module';
import { UnsaveOverlayService } from './shared/overlays/unsave-overlay/unsave-overlay.service';
import { AuthConstants } from './auth/utils/constants';
import { environment } from './../environments/environment';
import { HttpModule } from '@angular/http';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { SignalRConfiguration } from 'ng2-signalr';
import { LottieAnimationViewModule } from 'ng-lottie';
import { ChatComponent } from './chat/chat.component';
import { ChatModule } from './chat/chat.module';
import { ChatService } from './chat/chat.service';
import { ChatRatingComponent } from './chat/chat-rating/chat-rating.component';
import { TrusteerService } from './core/services/trusteer-service';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
   suppressScrollX: true
};

export function init() {
   return () => {
      try {
         if (environment.logoutOnRefresh) {
            localStorage.removeItem(AuthConstants.staticNames.loggedOnUser);
         }
         if (environment.rapportSetting.popup) {
          localStorage.removeItem('Trusteer');
         }
      } catch (exception) {}
   };
}

@NgModule({
   declarations: [
      AppComponent,
      UnauthorizedComponent,
      HeaderComponent,
      ChatComponent,
      ChatRatingComponent],
   imports: [
      BrowserModule,
      AppRoutingModule,
      CoreModule,
      SharedModule,
      AuthModule,
      HttpModule,
      ModalModule.forRoot(),
      LottieAnimationViewModule.forRoot(),
      ChatModule,
      PerfectScrollbarModule,
      MaintenanceModule
   ],
   providers: [UnsaveOverlayService, TrusteerService,
      ChatService, SignalRConfiguration,
      {
         provide: PERFECT_SCROLLBAR_CONFIG,
         useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
      },
      {
         'provide': APP_INITIALIZER,
         'useFactory': init,
         'deps': [],
         'multi': true
      },
   ],
   bootstrap: [AppComponent]
})
export class AppModule implements OnInit {

   constructor() {
   }

   ngOnInit() {
   }
}
