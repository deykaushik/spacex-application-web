import { HttpEvent, HttpRequest } from '@angular/common/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { TestBed, inject } from '@angular/core/testing';
import { Route, Router } from '@angular/router';
import { RequestMethod, ResponseOptions, Response } from '@angular/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { BsModalService, BsModalRef, ComponentLoaderFactory, PositioningService, ModalBackdropComponent, ModalModule } from 'ngx-bootstrap';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { AuthInterceptorService } from './auth-interceptor.service';
import { AuthService } from '../../auth/auth.service';
import { Api } from '../services/api';
import { environment } from './../../../environments/environment';
import { IApiResponse, IUser } from '../services/models';
import { AuthConstants } from '../../auth/utils/constants';
import { SystemErrorService } from '../services/system-services.service';
import { Constants } from '../utils/constants';
import { TokenManagementService } from './../services/token-management.service';
import { TokenRenewalService } from '../../shared/components/token-renewal-expiry/token-renewal-expiry.service';

const mockEndPoint = 'endpoint';
const mockEndPoint1 = 'interactionenablers/v1/infonotices/channels/84/brands/NED/types/NID';
const mockEndPoint2 = 'users/alias/profile';

const testComponent = class { };
const routerTestingParam = [
   { path: 'login', component: testComponent },
];

const tokenExpired = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI5OTg3MjE3NDg0IiwidG9rZW5fdHlwZSI' +
   '6IkJlYXJlciIsImN0eSI6IndlYiIsInVjaWQiOiJjbGllbnQiLCJCdXNpbmVzc0VudGl0eVVzZXJJZCI6IjMwMTgyMjk4NjkuMDAwMD' +
   'AiLCJpc3MiOiJpZHAubmVkYmFuay5jby56YSIsImFwaWQiOiJhcGkiLCJhdWQiOiIyZTgxMDY3MS0wMDFlLTQ5MjItYjVlNS0xNjdhY' +
   '2JhMzg4YjUiLCJzZXNzaW9uaWQiOiJjYzU5OGExOS00ODhhLTQyZDgtYWNlMS1jOGI1NzQ3YmU1ZmQiLCJuYmYiOjE1MTM4NTY5NjAs' +
   'ImlhdCI6MTUxMzg1NzAyMCwiZXhwIjoxNTEzODc1MDIwLCJncmFudF90eXBlIjoiY2xpZW50X2NyZWRlbnRpYWxzIiwiY2lkIjoiMSI' +
   'sInNjb3BlcyI6WyJOZWRiYW5rSURVc2VyLlNlbGZTZXJ2aWNlQ2xpZW50Il0sImp0aSI6ImNjNTk4YTE5NDg4YTQyZDhhY2UxYzhiNT' +
   'c0N2JlNWZkIn0.JP3EJjA_gXizW-u2VaWoO4He8RPHAgirb8lQn5GqAEks3M1Tu0lH8RvDQQ3kcdDmNPsGr7GEOuhQO24vWRtfTt_R4' +
   'xs2GJnZfc-M9iP6bHpnR8G20S8huOqPY6ksDEvkQrBoJIpZh6BIaUxi9TghOOrY7Y3KqJ2BF5upqX5OdReDxaJ4teFj0Wva2NRxoqjW' +
   'D-SYLdXT00szDyyVxJloECZMKv7gPog0YUBQV16ydgd6z_p9ah1GjO7tEEeEFR4H8zJRTvf1-wHfWhCGmgRWpiPqL4nMq9SMtH1kLO7' +
   'SjbFUycCmjxEdS5NyQpqwGmNAteW5E7ppkdfFVXNQOi8I8Q';

// expires 09 Oct 2019 16:52:35
const tokenNotExpired = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiQmVhcmVyIiwibGFzdE5hbWUi' +
   'OiJUZXN0IiwiQXV0aG5Db250ZXh0Q2xhc3NSZWYiOiJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6YWM6Y2xhc3NlczpQYXNzd29yZC' +
   'IsImlzcyI6ImlkcC5pdC5uZWRuZXQuY28uemEiLCJhdWQiOiJjNzkyNWNlMy0wNDczLTQxNTQtYjNiMy1lNDlhZjc4N2YzOWEiLCJuYmYi' +
   'OjE1MDc1NjA2OTUsImZpcnN0TmFtZSI6IlRlc3QiLCJlbWFpbCI6Im5vZW1haWxAbmVkYmFuay5jby56YSIsImlhdCI6MTUwNzU2MDc1NS' +
   'wiZ3JhbnRfdHlwZSI6ImNsaWVudF9jcmVkZW50aWFscyIsImV4cCI6MTU3MDYzMjc1NSwic2NvcGVzIjpbXSwianRpIjoiZTE4M2Y1NmIx' +
   'NDU3NDFjZWE4YWNmZDljYjExOWNiYTMifQ.YIbtqGYVxPp5CF52Fk_o_LWKk0mCYjcurdSdDnsA6oUPXX9XB8FVrLT5CHavUsfWUZJKneJ' +
   'GyJWwDVLuPmFCdsl-ZL5a6IJViaw_6zQJueo3Gz_GpEAjHVT4ALAAzhn6ghOWVyGuaSChvhIr3yVDKQ3epqhHz9VNJwfij9t_vCCEHzFbl' +
   'gYnH9mDBNkC9j4RYj7nQza7Lzfl_ke8L6FJB6W8ldAvPdJohs2u0bUNtpj0MHmKQY8VVhMKh_CrBZv5xI9x0XVdkuwLN9vCNB-VnmXE-OX' +
   'Kymeb35F9eHCrj2Vi4OGlq7LoTGt60UOPa9k5DTaS-_Lyg_7dX4d27jEKdQ';


describe('AuthInterceptorService', () => {

   const TEST_URI = 'TEST_URI';
   const mockUserResponse: IUser = {
      username: 'nedbank',
      token: 'mocktoken'
   };
   let mockAuthService;

   beforeEach(() => {

      mockAuthService = jasmine.createSpyObj('AuthService', ['getNedbankIdAnonymousToken']);

      TestBed.configureTestingModule({
         imports: [RouterTestingModule.withRoutes(routerTestingParam)],
         providers: [AuthInterceptorService, SystemErrorService,
            HttpTestingController, HttpClient, HttpHandler,
            MockBackend,
            {
               provide: Router,
               useClass: class { navigate = jasmine.createSpy('navigate'); }
            },
            {
               provide: AuthService, useValue: mockAuthService
            },
            TokenRenewalService, TokenManagementService,
            BsModalService, BsModalRef, ComponentLoaderFactory, PositioningService, ModalBackdropComponent, ModalModule]
      });
   });

   it('should be created', inject([AuthInterceptorService], (service: AuthInterceptorService) => {
      expect(service).toBeTruthy();
   }));

   it('should intercept the request and returns an observable ', inject([AuthInterceptorService], (service) => {
      const mockInterceptedReq = {
         url: environment.apiUrl + this.mockEndPoint,
         headers: {}
      };

      const mock = {
         req: {
            url: mockEndPoint,
            headers: {},
            clone: jasmine.createSpy('clone').and.returnValue(mockInterceptedReq)
         },
         next: {
            handle: jasmine.createSpy('handle').and.callThrough()
         },
         authReq: Object.assign({}, mockInterceptedReq)
      };
      service.intercept(mock.req, mock.next);
      expect(mock.req.clone(mockInterceptedReq).url).toEqual(mock.authReq.url);

   }));

   it('should intercept the request and returns an observable for nedbankid', inject([AuthInterceptorService], (service) => {
      const mockInterceptedReq = {
         url: environment.apiUrl + this.mockEndPoint1,
         headers: {}
      };

      const mock = {
         req: {
            url: mockEndPoint1,
            headers: {},
            clone: jasmine.createSpy('clone').and.returnValue(mockInterceptedReq)
         },
         next: {
            handle: jasmine.createSpy('handle').and.callThrough()
         },
         authReq: Object.assign({}, mockInterceptedReq)
      };
      service.intercept(mock.req, mock.next);
      expect(mock.req.clone(mockInterceptedReq).url).toEqual(mock.authReq.url);

   }));

   it('should intercept the request and returns an observable for aliasprofile', inject([AuthInterceptorService], (service) => {
      const mockInterceptedReq = {
         url: environment.apiUrl + this.mockEndPoint2,
         headers: {},
         renewToken: {
            subscribe: {}
         }
      };

      const mock = {
         req: {
            url: mockEndPoint2,
            headers: {},
            clone: jasmine.createSpy('clone').and.returnValue(mockInterceptedReq)
         },
         next: {
            handle: jasmine.createSpy('handle').and.callThrough()
         },
         authReq: Object.assign({}, mockInterceptedReq)
      };
      service.intercept(mock.req, mock.next);
      expect(mock.req.clone(mockInterceptedReq).url).toEqual(mock.authReq.url);

   }));

   it('should intercept the request and simulate logged on user', inject([AuthInterceptorService, TokenManagementService],
      (service, tokenManagementService: TokenManagementService) => {
         spyOn(tokenManagementService, 'SetTokenRenewalTimer').and.stub();
         const mockInterceptedReq = {
            url: environment.apiUrl + this.mockEndPoint,
            headers: { 'Content-Type': 'application/json' }
         };

         const mock = {
            req: {
               url: '/test.json',
               headers: {},
               clone: jasmine.createSpy('clone').and.returnValue(mockInterceptedReq)
            },
            next: {
               handle: jasmine.createSpy('handle').and.callThrough()
            },
            authReq: Object.assign({}, mockInterceptedReq)
         };

         const headers: Headers = new Headers();

         const req: any = {
            method: RequestMethod.Get,
            url: '/test.json',
            headers: headers,
         };

         tokenManagementService.setAuthToken(mockUserResponse.token);
         service.intercept(new Request(req), mock.next);

         expect(req.url).toEqual(mock.req.url);
      }));


   it('should link users profile', inject([AuthInterceptorService, TokenManagementService],
      (service, tokenManagementService: TokenManagementService) => {

         const mockInterceptedReq = {
            url: environment.apiUrl + '/users/alias/profile',
            headers: { 'Content-Type': 'application/json' }
         };

         const mock = {
            req: {
               url: '/users/alias/profile',
               headers: {},
               clone: jasmine.createSpy('clone').and.returnValue(mockInterceptedReq)
            },
            next: {
               handle: jasmine.createSpy('handle').and.callThrough()
            },
            authReq: Object.assign({}, mockInterceptedReq)
         };

         const headers: Headers = new Headers();
         headers.append('Content-Type', 'application/json');

         const req: any = {
            method: RequestMethod.Get,
            url: '/users/alias/profile',
            headers: headers,
         };

         tokenManagementService.removeAuthToken();
         localStorage.setItem('nedbankIdUserToken', 'hdslkajhdkaei');

         spyOn(req.url, 'endsWith').and.returnValue(true);
         environment.envName = Constants.environmentNames.dev;
         service.intercept(new Request(req), mock.next);

         expect(req.url).toEqual(mock.req.url);
      }));

   it('should check content-type', inject([AuthInterceptorService], (service) => {

      environment.envName = Constants.environmentNames.mock;
      const mockInterceptedReq = {
         url: environment.apiUrl + this.mockEndPoint,
         headers: { 'Content-Type': 'application/json' }
      };

      const mock = {
         req: {
            url: '/test.json',
            headers: {},
            clone: jasmine.createSpy('clone').and.returnValue(mockInterceptedReq)
         },
         next: {
            handle: jasmine.createSpy('handle').and.callThrough()
         },
         authReq: Object.assign({}, mockInterceptedReq)
      };

      const headers: Headers = new Headers();
      headers.append('Content-Type', 'application/json');

      const req: any = {
         method: RequestMethod.Get,
         url: '/test.json',
         headers: headers,
      };

      const request = new HttpRequest('GET', '/test.json');

      request.headers.append('Content-Type', 'application/json');

      spyOn(request.headers, 'has').and.returnValue(true);

      service.intercept(request, mock.next);

      expect(req.url).toEqual(mock.req.url);
   }));

   it('should intercept the request and simulate logged on user with token', inject([AuthInterceptorService, TokenManagementService],
      (service, tokenManagementService: TokenManagementService) => {
         spyOn(tokenManagementService, 'SetTokenRenewalTimer').and.stub();
         const mockInterceptedReq = {
            url: environment.apiUrl + this.mockEndPoint,
            headers: { 'Content-Type': 'application/json' }
         };
         const mock = {
            req: {
               url: '/test.json',
               headers: {},
               clone: jasmine.createSpy('clone').and.returnValue(mockInterceptedReq)
            },
            next: {
               handle: jasmine.createSpy('handle').and.callThrough()
            },
            authReq: Object.assign({}, mockInterceptedReq)
         };
         const headers: Headers = new Headers();

         const req: any = {
            method: RequestMethod.Get,
            url: '/test.json',
            headers: headers,
         };
         tokenManagementService.setAuthToken(this.tokenExpired);
         service.intercept(new Request(req), mock.next);
         expect(req.url).toEqual(mock.req.url);
      }));


   it('should call renew anonymous token', inject([AuthInterceptorService, TokenManagementService],
      (service, tokenManagementService, tokenRenewalService) => {

         const request = new HttpRequest('GET', '/users/authenticate');

         const next = {
            handle: jasmine.createSpy('handle').and.callThrough()
         };

         const tkn = tokenNotExpired;

         spyOn(service, 'renewAnonymousToken').and.callThrough();

         environment.envName = Constants.environmentNames.dev;
         tokenManagementService.setNedbankIdAnonymousToken(tkn);
         service.intercept(request, next);
         expect(service.renewAnonymousToken).toHaveBeenCalled();
      }));

   it('should call getNedbankIdAnonymousJWT', inject([AuthInterceptorService, TokenManagementService],
      (service, tokenManagementService, tokenRenewalService) => {

         const request = new HttpRequest('GET', '/users/authenticate');

         const next = {
            handle: jasmine.createSpy('handle').and.callThrough()
         };

         const tkn = tokenExpired;

         spyOn(service, 'getNedbankIdAnonymousJWT').and.callThrough();

         environment.envName = Constants.environmentNames.dev;
         tokenManagementService.setNedbankIdAnonymousToken(tkn);
         service.intercept(request, next);
         expect(service.getNedbankIdAnonymousJWT).toHaveBeenCalled();
      }));

   it('should get anonymous token for salute call', inject([AuthInterceptorService, TokenManagementService],
      (service, tokenManagementService, tokenRenewalService) => {

         const request = new HttpRequest('GET', '/users/salut');

         const next = {
            handle: jasmine.createSpy('handle').and.callThrough()
         };

         spyOn(service, 'getAnonymousJWT').and.callThrough();
         spyOn(tokenManagementService, 'SetTokenRenewalTimer').and.stub();

         environment.envName = Constants.environmentNames.dev;
         tokenManagementService.setAuthToken('');
         service.intercept(request, next);

         expect(service.getAnonymousJWT).toHaveBeenCalled();
      }));

   it('should call getNedbankIdAnonymousJWT', inject([AuthInterceptorService, TokenManagementService],
      (service, tokenManagementService, tokenRenewalService) => {

         const request = new HttpRequest('GET', '/users/authenticate');

         const next = {
            handle: jasmine.createSpy('handle').and.callThrough()
         };

         const tkn = tokenExpired;

         spyOn(service, 'getNedbankIdAnonymousJWT').and.callThrough();

         environment.envName = Constants.environmentNames.dev;
         tokenManagementService.setNedbankIdAnonymousToken(tkn);
         service.intercept(request, next);
         expect(service.getNedbankIdAnonymousJWT).toHaveBeenCalled();
      }));

   it('should call setNedbankIdAnonymousToken', inject([AuthInterceptorService, TokenManagementService],
      (service, tokenManagementService) => {

         const request = new HttpRequest('GET', '/users/authenticate');

         const next = {
            handle: jasmine.createSpy('handle').and.callThrough()
         };

         const tkn = tokenNotExpired;
         mockAuthService.getNedbankIdAnonymousToken.and.returnValue(of({
            Data: {
               tkn
            },
            MetaData: {
               ResultCode: '0',
               Message: '',
               InvalidFieldList: []
            }
         }));

         spyOn(tokenManagementService, 'setNedbankIdAnonymousToken').and.returnValue('');

         service.intercept(request, next);
         expect(tokenManagementService.setNedbankIdAnonymousToken).toHaveBeenCalled();
      }));

});
