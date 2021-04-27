import { TokenManagementService } from './../services/token-management.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, Route } from '@angular/router';
import { TestBed, inject } from '@angular/core/testing';
import { BsModalService, BsModalRef, ComponentLoaderFactory, PositioningService, ModalBackdropComponent, ModalModule } from 'ngx-bootstrap';

import { AuthGuardService } from './auth-guard.service';
import { environment } from './../../../environments/environment';
import { IUser, IClientDetails } from '../services/models';
import { AuthConstants } from '../../auth/utils/constants';
import { ClientProfileDetailsService } from '../services/client-profile-details.service';
import { TokenRenewalService } from '../../shared/components/token-renewal-expiry/token-renewal-expiry.service';
import { ApiService } from '../services/api.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PreApprovedOffersService } from '../services/pre-approved-offers.service';

const getClientDetail = jasmine.createSpy('getUserDetail ').and.returnValue(Observable.of({ clientDetail: 'test' }));
const clientDetailsObserver = new BehaviorSubject(null);
const testComponent = class { };
const routerTestingParam = [
   { path: 'login', component: testComponent },
];
const preApprovedOffersServiceStub = {
   offersObservable: new BehaviorSubject(null),
   isPreApprovedOffersActive: true,
   getOffers: jasmine.createSpy('getOffers').and.returnValue([])
};
describe('AuthGuardService', () => {
   const mockUserResponse: IUser = {
      username: 'nedbank',
      token: '2323232'
   };
   const clientDetails: IClientDetails = {
      FullNames: 'dummy test', PreferredName: 'Test', DefaultAccountId: '2',
      CisNumber: 234234, FirstName: 'test', SecondName: 'test', Surname: 'test', CellNumber: '12312',
      EmailAddress: 'asa@asas.com', BirthDate: '', FicaStatus: 989, SegmentId: '23432', IdOrTaxIdNo: 234, SecOfficerCd: '4234',
      Address: { AddressCity: '', AddressLines: [], AddressPostalCode: '' }, AdditionalPhoneList: []
   };
   beforeEach(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule.withRoutes(routerTestingParam)],
         providers: [AuthGuardService,
            TokenManagementService, TokenRenewalService, BsModalService, ComponentLoaderFactory,
            PositioningService, ModalBackdropComponent, ModalModule,
            { provide: Window, useValue: window },
            {
               provide: ClientProfileDetailsService, useValue:
               {
                  getClientDetail: getClientDetail,
                  getDefaultAccount: jasmine.createSpy('getDefaultAccount').and.returnValue(undefined),
                  getClientPreferenceDetails: jasmine.createSpy('getClientPreferenceDetails').and.returnValue(clientDetails),
                  isUserObserverUpdated: false,
                  clientDetailsObserver: clientDetailsObserver
               }
            },
            { provide: PreApprovedOffersService, useValue: preApprovedOffersServiceStub }]
      });
   });

   it('should be created', inject([AuthGuardService, Router, TokenManagementService], (service: AuthGuardService, router: Router,
      clientService: ClientProfileDetailsService, tokenManagementService: TokenManagementService) => {
      expect(service).toBeTruthy();
   }));

   it('should call canActivate', inject([AuthGuardService, Router, TokenManagementService], (service: AuthGuardService, router: Router,
      tokenManagementService: TokenManagementService) => {
      expect(service.canActivate(null, null)).toBeTruthy();
   }));


   it('should call canLoad and return true when client details is fetched',
      inject([AuthGuardService, Router, TokenManagementService], (service: AuthGuardService, router: Router,
         tokenManagementService: TokenManagementService) => {
         spyOn(tokenManagementService, 'SetTokenRenewalTimer').and.stub();
         tokenManagementService.setAuthToken(mockUserResponse.token);
         service.canLoad(null).subscribe(result => {
            expect(result).toBeTruthy();
         });
         clientDetailsObserver.next({ clientDetail: true });

      }));


   it('should call canLoad and return false if loggedOnUser item is not set',
      inject([AuthGuardService, Router, TokenManagementService], (service: AuthGuardService,
         router: Router, tokenManagementService: TokenManagementService) => {
         tokenManagementService.removeAuthToken();
         service.canLoad(null).subscribe(result => {
            expect(result).toBeFalsy();
         });

      }));

   it('should call canDeactivate',
      inject([AuthGuardService, Router, TokenManagementService], (service: AuthGuardService,
         router: Router, tokenManagementService: TokenManagementService) => {
         expect(service.CanDeactivate()).toBeFalsy();
      }));
});
