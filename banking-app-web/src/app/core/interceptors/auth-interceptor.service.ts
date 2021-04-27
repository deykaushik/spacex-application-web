import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Route, Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { UUID } from 'angular2-uuid';
import { AuthService } from '../../auth/auth.service';
import { Constants } from '../utils/constants';
import { IAuthorizeResponse } from '../services/models';
import { environment } from './../../../environments/environment';
import { AuthConstants } from '../../auth/utils/constants';
import { SystemErrorService } from '../services/system-services.service';
import { TokenManagementService } from '../services/token-management.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

   fingerprint: string;
   loggedOnUser: string;

   constructor(private router: Router,
      private inj: Injector,
      private systemErrorService: SystemErrorService,
      private tokenManagementService: TokenManagementService) {
   }

   private handleAuthError(err: HttpErrorResponse): Observable<any> {

      /* istanbul ignore else  */
      if (!this.tokenManagementService.GetTokenExpired()) {
         if (err && (err.status === Constants.httpErrorCodes.unauthorized || err.status === Constants.httpErrorCodes.forbidden)) {
            this.router.navigate(['auth/logoff']);
         } else {
            this.systemErrorService.raiseError({ error: err });
         }
      }
      return Observable.throw(err);
   }

   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

      try {
         this.loggedOnUser = this.tokenManagementService.getAuthToken();

         if (environment.envName === Constants.environmentNames.mock) {
            this.tokenManagementService.setAuthToken('mocktoken');
            req = req.clone({
               setHeaders: Object.assign({}, environment.headers[0].token)
            });
         } else if (req.url.endsWith(AuthConstants.urlValues.authenticate)) {
            const anonymousToken = this.tokenManagementService.getNedbankIdAnonymousToken();
            this.renewAnonymousToken(anonymousToken);
            req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + anonymousToken) });
            /* istanbul ignore if */
         } else if (req.url.endsWith(AuthConstants.urlValues.aliasProfile)) {
            const nedbankIdToken = this.tokenManagementService.getUnfederatedToken();
            req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + nedbankIdToken) });
         } else if (this.loggedOnUser) {
            req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + this.loggedOnUser) });
         } else if (req.url.endsWith(AuthConstants.urlValues.salute)) {
            const anonymousToken = this.getAnonymousJWT(environment.envName);
            req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + anonymousToken) });
         } else {
            const anonymousToken = this.tokenManagementService.getNedbankIdAnonymousToken();
            this.renewAnonymousToken(anonymousToken);
            req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + anonymousToken) });
         }

         // if this is a login-request the header is
         // already set to x/www/formurl/encoded.
         // so if we already have a content-type, do not
         // set it, but if we don't have one, set it to
         // default --> json
         // unable to test else part. Header values not retained when testing
         /* istanbul ignore else  */
         if (!req.headers.has('Content-Type')) {
            req = req.clone({ headers: req.headers.append('Content-Type', 'application/json') });
         }
         // setting the accept header
         req = req.clone({ headers: req.headers.set('Accept', 'application/json') });

         if (!this.fingerprint) {
            try {
               const fingerPrint2 = require('fingerprintjs2sync');
               this.fingerprint = (new fingerPrint2()).getSync().fprint;
            } catch (exc) {
            }
         }

         req = req.clone({ headers: req.headers.set('X-Fingerprint', this.fingerprint) });

         if (!this.tokenManagementService.interactionId) {
            try {
               this.tokenManagementService.interactionId = UUID.UUID();
            } catch (ex) { }
         }

         req = req.clone({ headers: req.headers.set('X-Interaction-ID', this.tokenManagementService.interactionId) });
         return next.handle(req).do((event: HttpEvent<any>) => {
         }, (err: any) => {
            this.handleAuthError(err);
         });
      } catch (e) {
         this.handleAuthError(e);
      }
   }

   private renewAnonymousToken(token) {
      if (token) {
         const tokenDecoded = this.decodeJwt(token);
         if (tokenDecoded && tokenDecoded.exp) {
            const expDate = new Date(0); // The 0 here is the key, which sets the date to the epoch
            expDate.setUTCSeconds(tokenDecoded.exp);
            const currDate = new Date();
            if ((expDate.valueOf() < currDate.valueOf()) ||
               ((expDate.valueOf()) <= (currDate.valueOf() + (120 * 1000)))) {
               this.getNedbankIdAnonymousJWT();
            }
         }
      }
   }

   decodeJwt(token: string) {
      return jwt_decode(token);
   }

   getAnonymousJWT(envName: string) {
      const jwt = environment.headers.find(item => {
         return item.environment === envName;
      });

      return jwt.token;
   }

   getNedbankIdAnonymousJWT() {
      const authService: AuthService = this.inj.get(AuthService);
      if (authService) {
         return authService.getNedbankIdAnonymousToken().subscribe(response => {
            if (response && response.MetaData && response.MetaData.ResultCode === '0') {
               this.tokenManagementService.setNedbankIdAnonymousToken(response.Data.TokenValue);
               return response.Data.TokenValue;
            } else {
               return '';
            }
         }, (error) => {
         });
      } else {
      }
   }
}
