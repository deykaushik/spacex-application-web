import { TestBed, inject } from '@angular/core/testing';
import { BsModalService, BsModalRef, ComponentLoaderFactory, PositioningService, ModalBackdropComponent, ModalModule } from 'ngx-bootstrap';

import { TokenManagementService } from './token-management.service';
import { environment } from './../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from 'rxjs/Subscription';
import { ApiAuthService } from './api.auth-service';
import { TokenRenewalService } from './../../shared/components/token-renewal-expiry/token-renewal-expiry.service';
import { RequestMethod } from '@angular/http';
import { of } from 'rxjs/observable/of';
import * as jwt_decode from 'jwt-decode';

const userStub = {
   token: 'abc'
};

const tokenExpired = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI5NDUwNzUzOTEiLCJ0b2tlbl90eXBl' +
   'IjoiQmVhcmVyIiwiY3R5Ijoid2ViIiwidWNpZCI6ImNsaWVudCIsIkJ1c2luZXNzRW50aXR5VXNlcklkIjoiMzAwODQ1NTA4My4' +
   'wMDAwMCIsImlzcyI6ImlkcC5uZWRiYW5rLmNvLnphIiwiYXBpZCI6ImFwaSIsImF1ZCI6ImEzY2U0NmE2LWViZDAtNGMxOS1hMT' +
   'c0LTBjYzE2NWJlMjE2ZCIsInNlc3Npb25pZCI6IjA1ZGE1MjI1LWRhYmQtNGRlYS1hZTU4LTE2ZDkwMGEyZDAyYSIsIm5iZiI6M' +
   'TUzODM4NDYzNiwiZHVyYXRpb24iOiIxNTM4Mzg0Njk2MDQ2IiwiaWF0IjoxNTM4Mzg0Njk2LCJleHAiOjE1MzgzODU1OTYsImdy' +
   'YW50X3R5cGUiOiJjbGllbnRfY3JlZGVudGlhbHMiLCJjaWQiOiIzIiwic2NvcGVzIjpbIk5lZGJhbmtJRFVzZXIuU2VsZlNlcnZ' +
   'pY2VDbGllbnQiXSwianRpIjoiNThhMzRmODc3NTNiNDMwYjgwNmZkZWI5N2I0ODA5ODEifQ.qb4OHEEga3WRST6txEidq-yl0iT' +
   'tHtw6aenm45EGCnYIhhCJAP91WTHuZARPYJJSAdEDiT_x2r6AEkFUPLKasVFQ8YIbaolBLplnSz_DIuVL657eRLQN36LcpbzKlN' +
   '9UqtvYBqU9Zsyr_Rx1O5DK0cBgQtKNCaswPmVnV5MosLh2olmwLek9N6KNd3mH0aulcW4wrLoue_Vl8CXFRF8EnQoDkK8N0_NME' +
   'e83SFgKtrp8m_V3_l00Z6sjoEztIU-jx3AFXt_b7q23POJ2lDySwf9ZmK4rJ_-EhIB1wUekxjuVaxZUodi5YnviIDnx_BeGbnTn' +
   'gx57z7AZpsR3DiiJmQ';

describe('TokenManagementService', () => {
   let mockApiAuthService;

   beforeEach(() => {
      mockApiAuthService = jasmine.createSpyObj('ApiAuthService', ['RenewToken']);

      TestBed.configureTestingModule({
         providers: [TokenManagementService,
            BsModalService, BsModalRef, ComponentLoaderFactory, PositioningService,
            ModalBackdropComponent, ModalModule,
            {
               provide: ApiAuthService, useValue: {
                  RenewToken: {
                     getAll: jasmine.createSpy('getAll').and.returnValue(Observable.of(
                        {
                           MetaData: {
                              ResultCode: 'R00',
                              Message: ''
                           },
                           Data: {}
                        }
                     ))
                  }
               }
            },
            {
               provide: TokenRenewalService,
               useValue: { ShowSessionExpired: jasmine.createSpy('ShowSessionExpired').and.stub() }
            }]
      });
   });

   it('should be created', inject([TokenManagementService], (service: TokenManagementService) => {
      expect(service).toBeTruthy();
   }));

   it('should set token in memory service', inject([TokenManagementService], (service: TokenManagementService) => {
      environment.logoutOnRefresh = true;
      spyOn(service, 'SetTokenRenewalTimer').and.stub();
      service.setAuthToken(userStub.token);
      expect(service.getAuthToken()).toBe(userStub.token);
   }));

   it('should remove token from in memory service', inject([TokenManagementService], (service: TokenManagementService) => {
      environment.logoutOnRefresh = true;
      service.removeAuthToken();
      expect(service.getAuthToken()).toBe('');
   }));

   it('should set token in localStorage', inject([TokenManagementService], (service: TokenManagementService) => {
      environment.logoutOnRefresh = false;
      spyOn(service, 'SetTokenRenewalTimer').and.stub();
      service.setAuthToken(userStub.token);
      expect(service.getAuthToken()).toBe(userStub.token);
   }));

   it('should remove token from localStorage', inject([TokenManagementService], (service: TokenManagementService) => {
      environment.logoutOnRefresh = false;
      service.removeAuthToken();
      expect(service.getAuthToken()).toBe(null);
   }));

   it('should set Unfederated Token', inject([TokenManagementService], (service: TokenManagementService) => {
      environment.logoutOnRefresh = false;
      service.setUnfederatedToken(userStub.token);
      expect(service.getUnfederatedToken()).toBe(userStub.token);
   }));

   it('should set Unfederated in localStorage', inject([TokenManagementService], (service: TokenManagementService) => {
      environment.logoutOnRefresh = true;
      service.setUnfederatedToken(userStub.token);
      expect(service.getUnfederatedToken()).toBe(userStub.token);
   }));

   it('should remove Unfederated token from localStorage', inject([TokenManagementService], (service: TokenManagementService) => {
      environment.logoutOnRefresh = false;
      service.removeUnfederatedToken();
      expect(service.getUnfederatedToken()).toBe(null);
   }));

   it('should remove Unfederated token from in memory service', inject([TokenManagementService], (service: TokenManagementService) => {
      environment.logoutOnRefresh = true;
      service.removeUnfederatedToken();
      expect(service.getUnfederatedToken()).toBe('');
   }));


   it('should set Unfederated Token', inject([TokenManagementService], (service: TokenManagementService) => {
      environment.logoutOnRefresh = false;
      service.setUnfederatedToken(userStub.token);
      expect(service.getUnfederatedToken()).toBe(userStub.token);
   }));

   it('should set Unfederated in localStorage', inject([TokenManagementService], (service: TokenManagementService) => {
      environment.logoutOnRefresh = true;
      service.setUnfederatedToken(userStub.token);
      expect(service.getUnfederatedToken()).toBe(userStub.token);
   }));

   it('should remove Unfederated token from localStorage', inject([TokenManagementService], (service: TokenManagementService) => {
      environment.logoutOnRefresh = false;
      service.removeUnfederatedToken();
      expect(service.getUnfederatedToken()).toBe(null);
   }));

   it('should remove Unfederated token from in memory service', inject([TokenManagementService], (service: TokenManagementService) => {
      environment.logoutOnRefresh = true;
      service.removeUnfederatedToken();
      expect(service.getUnfederatedToken()).toBe('');
   }));

   it('should set NedbankId Anonymous Token', inject([TokenManagementService], (service: TokenManagementService) => {
      environment.logoutOnRefresh = false;
      service.setNedbankIdAnonymousToken(userStub.token);
      expect(service.getNedbankIdAnonymousToken()).toBe(userStub.token);
   }));

   it('should set NedbankId Anonymous in localStorage', inject([TokenManagementService], (service: TokenManagementService) => {
      environment.logoutOnRefresh = true;
      service.setNedbankIdAnonymousToken(userStub.token);
      expect(service.getNedbankIdAnonymousToken()).toBe(userStub.token);
   }));

   it('should remove NedbankId Anonymous token from localStorage', inject([TokenManagementService], (service: TokenManagementService) => {
      environment.logoutOnRefresh = false;
      service.removeNedbankIdAnonymousToken();
      expect(service.getNedbankIdAnonymousToken()).toBe(null);
   }));

   it('should remove NedbankId Anonymous token from in memory service',
      inject([TokenManagementService], (service: TokenManagementService) => {
         environment.logoutOnRefresh = true;
         service.removeNedbankIdAnonymousToken();
         expect(service.getNedbankIdAnonymousToken()).toBe('');
      }));

   it('should set the token expired flag', inject([TokenManagementService], (service: TokenManagementService) => {
      service.SetTokenExpired(true);
      expect(service.GetTokenExpired()).toBeTruthy();
   }));

   it('should handle SetTokenRenewalTimer', inject([TokenManagementService], (service: TokenManagementService) => {
      environment.logoutOnRefresh = true;
      service.setAuthToken(tokenExpired);
      service.SetTokenRenewalTimer();
      expect(service).toBeTruthy();
      expect(service.pollRenewalTimerSubscription).toBeTruthy();
   }));

   it('should handle RenewAuthToken success', inject([TokenManagementService], (service: TokenManagementService) => {
      environment.logoutOnRefresh = true;
      spyOn(service, 'GetTokenExpired').and.returnValue(false);
      spyOn(service, 'SetTokenExpired');
      spyOn(service, 'ApiRenewToken').and.returnValue(of({
         MetaData: { ResultCode: 'R00', Message: '' }
      }));
      service.setAuthToken(tokenExpired);
      service.RenewAuthToken().subscribe(response => {
         expect(service.SetTokenExpired).toHaveBeenCalledWith(false);
      });
   }));

   it('should handle RenewAuthToken with R28', inject([TokenManagementService], (service: TokenManagementService) => {
      environment.logoutOnRefresh = true;
      spyOn(service, 'GetTokenExpired').and.returnValue(false);
      spyOn(service, 'SetTokenExpired');
      spyOn(service, 'ApiRenewToken').and.returnValue(of({
         MetaData: { ResultCode: 'R28', Message: '' }
      }));
      service.setAuthToken(tokenExpired);
      service.RenewAuthToken().subscribe(response => {
         expect(service.SetTokenExpired).toHaveBeenCalledWith(true);
      });
   }));

   it('should handle RenewAuthToken failure', inject([TokenManagementService], (service: TokenManagementService) => {
      environment.logoutOnRefresh = true;
      spyOn(service, 'GetTokenExpired').and.returnValue(false);
      spyOn(service, 'SetTokenExpired');
      spyOn(service, 'ApiRenewToken').and.returnValue(of({
         MetaData: { ResultCode: 'R03', Message: '' }
      }));
      service.setAuthToken(tokenExpired);
      service.RenewAuthToken().subscribe(response => {
         expect(service.SetTokenExpired).toHaveBeenCalledWith(true);
      });
   }));
});
