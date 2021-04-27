import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BsModalService, BsModalRef, ComponentLoaderFactory, PositioningService, ModalBackdropComponent, ModalModule } from 'ngx-bootstrap';
import { assertModuleFactoryCaching } from './../../test-util';
import { LandingComponent } from './landing.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { AuthGuardService } from '../../core/guards/auth-guard.service';
import { ComponentFactoryResolver } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { TokenManagementService } from '../../core/services/token-management.service';
import { TrusteerService } from '../../core/services/trusteer-service';
import { PreApprovedOffersService } from '../../core/services/pre-approved-offers.service';
import { ApiService } from '../../core/services/api.service';

describe('LandingComponent reports', () => {
   let component: LandingComponent;
   let fixture: ComponentFixture<LandingComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule],
         declarations: [LandingComponent, HeaderComponent, FooterComponent],
         providers: [BsModalService,
            BsModalRef, TrusteerService,
            ComponentLoaderFactory,
            PreApprovedOffersService,
            {provide: ApiService, useValue: {}},
            ModalBackdropComponent, AuthGuardService, ComponentFactoryResolver, {
               provide: TokenManagementService, useValue: {
                  setAuthToken: jasmine.createSpy('setAuthToken').and.stub,
                  setNedbankIdAnonymousToken: jasmine.createSpy('setNedbankIdAnonymousToken').and.stub,
                  setUnfederatedToken: jasmine.createSpy('setUnfederatedToken').and.stub,
                  removeAuthToken: jasmine.createSpy('setUnfederatedToken').and.stub,
                  removeNedbankIdAnonymousToken: jasmine.createSpy('setUnfederatedToken').and.stub,
               }
            }, {
               provide: ClientProfileDetailsService, useValue: {
                  getClientDetail: jasmine.createSpy('getClientDetail'),
                  getDefaultAccount: jasmine.createSpy('getDefaultAccount').and.returnValue(undefined),
                  getClientPreferenceDetails: jasmine.createSpy('getClientPreferenceDetails').and.returnValue({
                     FullNames: 'dummy test', PreferredName: 'Test', DefaultAccountId: '2',
                     CisNumber: 234234, FirstName: 'test', SecondName: 'test', Surname: 'test', CellNumber: '12312',
                     EmailAddress: 'asa@asas.com', BirthDate: '', FicaStatus: 989, SegmentId: '23432',
                     IdOrTaxIdNo: 234, SecOfficerCd: '4234',
                     Address: { AddressCity: '', AddressLines: [], AddressPostalCode: '' }, AdditionalPhoneList: []
                  })
               }
            }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(LandingComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
});
