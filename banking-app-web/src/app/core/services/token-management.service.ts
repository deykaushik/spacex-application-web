import { environment } from './../../../environments/environment';
import { Injectable, Injector, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from 'rxjs/Subscription';
import * as jwt_decode from 'jwt-decode';
import { TokenRenewalService } from './../../shared/components/token-renewal-expiry/token-renewal-expiry.service';
import { ApiAuthService } from './api.auth-service';

@Injectable()
export class TokenManagementService {
   interactionId: string;
   private authToken = '';
   private unFederatedToken = '';
   private nedbankIdAnonymousToken = '';
   private isTokenExpired = false;
   tokenExpired = new EventEmitter<boolean>();
   pollRenewalTimerObservable: Observable<number>;
   pollRenewalTimerSubscription: ISubscription;

   constructor(private tokenRenewalService: TokenRenewalService, private inj: Injector) { }

   getAuthToken() {
      if (environment.logoutOnRefresh) {
         return this.authToken;
      } else {
         return localStorage.getItem('token');
      }
   }

   setAuthToken(token: string) {
      if (environment.logoutOnRefresh) {
         this.authToken = token;
      } else {
         localStorage.setItem('token', token);
      }
      this.SetTokenExpired(false);
      this.SetTokenRenewalTimer();
   }

   removeAuthToken() {
      if (environment.logoutOnRefresh) {
         this.authToken = '';
      } else {
         localStorage.removeItem('token');
      }
      this.SetTokenExpired(false);
      this.UnSubscribeTimer();
   }

   getUnfederatedToken() {
      if (environment.logoutOnRefresh) {
         return this.unFederatedToken;
      } else {
         return localStorage.getItem('nedbankIdUserToken');
      }
   }

   setUnfederatedToken(token: string) {
      if (environment.logoutOnRefresh) {
         this.unFederatedToken = token;
      } else {
         localStorage.setItem('nedbankIdUserToken', token);
      }
   }

   removeUnfederatedToken() {
      if (environment.logoutOnRefresh) {
         this.unFederatedToken = '';
      } else {
         localStorage.removeItem('nedbankIdUserToken');
      }
   }

   getNedbankIdAnonymousToken() {
      if (environment.logoutOnRefresh) {
         return this.nedbankIdAnonymousToken;
      } else {
         return localStorage.getItem('nedbankIdAnonymousToken');
      }
   }

   setNedbankIdAnonymousToken(token: string) {
      if (environment.logoutOnRefresh) {
         this.nedbankIdAnonymousToken = token;
      } else {
         localStorage.setItem('nedbankIdAnonymousToken', token);
      }
   }

   removeNedbankIdAnonymousToken() {
      if (environment.logoutOnRefresh) {
         this.nedbankIdAnonymousToken = '';
      } else {
         localStorage.removeItem('nedbankIdAnonymousToken');
      }
   }

   GetTokenExpired(): boolean {
      return this.isTokenExpired;
   }

   SetTokenExpired(value: boolean) {
      this.isTokenExpired = value;
      this.tokenExpired.emit(value);
      if (value) {
         this.tokenRenewalService.ShowSessionExpired();
      }
   }

   SetTokenRenewalTimer() {
      const loggedOnUser = this.getAuthToken();
      if (loggedOnUser) {
         const token = this.DecodeJwt(loggedOnUser);

         if (token) {
            if (token.exp && token.iat) {

               let exp = 0;
               let iat = 0;
               let lapseTime = 0;
               const bufferSeconds = 60;
               try {
                  exp = parseInt(token.exp, 0);
                  iat = parseInt(token.iat, 0);
                  lapseTime = ((exp - bufferSeconds) - iat) * 1000;
               } catch (e) { }

               this.UnSubscribeTimer();
               if (lapseTime > 0) {
                  this.pollRenewalTimerObservable = Observable.timer(lapseTime);
                  this.pollRenewalTimerSubscription = this.pollRenewalTimerObservable.subscribe(() => {
                     this.RenewAuthToken()
                        .take(1)
                        .subscribe(() => { });
                  });
               }
            }
         }
      }
   }

   RenewAuthToken(): Observable<any> {
      return new Observable(observable => {

         if (!this.GetTokenExpired()) {
            this.ApiRenewToken().subscribe(response => {
               if (response && response.MetaData && response.MetaData.ResultCode === 'R00') {
                  this.setAuthToken(response.Data);
                  observable.next();
               } else {
                  if (response && response.MetaData && response.MetaData.ResultCode === 'R28') {
                     // Token max times renewed
                     this.SetTokenExpired(true);
                     observable.next();
                     observable.complete();
                  } else {
                     // Token renewal failed
                     this.SetTokenExpired(true);
                     observable.next();
                     observable.complete();
                  }
               }
            },
               (error: any) => {
                  this.SetTokenExpired(true);
                  observable.error();
               });
         } else {
            observable.next();
            observable.complete();
         }
      });
   }

   ApiRenewToken(): Observable<any> {
      const apiAuthService: ApiAuthService = this.inj.get(ApiAuthService);

      return apiAuthService.RenewToken.getAll().map(response => {
         return response;
      });
   }

   DecodeJwt(token: string) {
      return jwt_decode(token);
   }

   private UnSubscribeTimer() {
      if (this.pollRenewalTimerSubscription) {
         this.pollRenewalTimerSubscription.unsubscribe();
      }
   }
}
