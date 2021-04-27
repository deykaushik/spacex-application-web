import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { assertModuleFactoryCaching } from '../../test-util';
import { WindowRefService } from './../../core/services/window-ref.service';
import { GaTrackingService } from '../../core/services/ga.service';
import { ClientProfileDetailsService } from './../../core/services/client-profile-details.service';
import { IClientDetails, IBankerDetail, IDcarRangeDetails } from '../../core/services/models';
import { SkeletonLoaderPipe } from './../../shared/pipes/skeleton-loader.pipe';
import { ViewBankerComponent } from './view-banker.component';
import { ProfileService } from '../profile.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderMenuService } from '../../core/services/header-menu.service';
import { AccountService } from '../../dashboard/account.service';


const mockBankerDetails: IBankerDetail = {
   firstName: 'Alex',
   lastName: 'Nathu',
   workNumber: '+27 (0) 860 555 111',
   cellPhoneNumber: '+27 560 598 188',
   emailAddress: 'georgeja@nedbank.co.za',
   isDefaultBanker: false,
   bankerPicture: 'testPic'
};
const mockBankerDetails1: IBankerDetail = {
   firstName: 'Alex',
   lastName: 'Nathu',
   workNumber: '+27 (0) 860 555 111',
   cellPhoneNumber: '',
   emailAddress: 'georgeja@nedbank.co.za',
   isDefaultBanker: false,
   bankerPicture: ''
};
const mockBankerDetails2: IBankerDetail = {
   firstName: 'Alex',
   lastName: 'Nathu',
   workNumber: '+27 (0) 860 555 111',
   cellPhoneNumber: '',
   emailAddress: '',
   isDefaultBanker: false,
   bankerPicture: ''
};
const mockBankerDetails3: IBankerDetail = {
   firstName: 'Nedbank Contact Centre',
   lastName: '',
   workNumber: '+27 (0) 860 555 111',
   cellPhoneNumber: '',
   emailAddress: 'contactcentre@nedbank.co.za',
   isDefaultBanker: true,
   bankerPicture: ''
};
const mockBankerDetails4: IBankerDetail = {
   firstName: 'Alex',
   lastName: 'Nathu',
   workNumber: '',
   cellPhoneNumber: '',
   emailAddress: 'georgeja@nedbank.co.za',
   isDefaultBanker: false,
   bankerPicture: ''
};
const clientDetailsStub: IClientDetails = {
   FullNames: 'alex nathu', PreferredName: 'Alex', DefaultAccountId: '2',
   CisNumber: 234234, FirstName: 'alex', SecondName: 'alex', Surname: 'nathu', CellNumber: '12312',
   EmailAddress: 'alex@alex.com', BirthDate: '', FicaStatus: 989, SegmentId: '23432', IdOrTaxIdNo: 234, SecOfficerCd: '4234',
   Address: { AddressCity: '', AddressLines: [], AddressPostalCode: '' }, AdditionalPhoneList: []
};

const mockDecarRangeDetails: IDcarRangeDetails[] = [{
   clusterName: 'Retail',
   division: 'RRB',
   segment: 'RBB - SMALL BUSINESS SERVICES',
   displayContactDetail: true,
   range: [{
      minValue: 2000,
      maxValue: 2999
   }]
}];

const profileServiceStub = {
   getBankerDetails: jasmine.createSpy('getBankerDetails').and.returnValue(Observable.of(mockBankerDetails)),
   getBankerDetailsWithError: jasmine.createSpy('getBankerDetails').and.returnValue(Observable.create(observer => {
      observer.error(new Error('error'));
      observer.complete();
   })),
   getDcarRange: jasmine.createSpy('getDcarRange').and.returnValue(Observable.of(mockDecarRangeDetails))
};
const viewBankerErrorStub = Observable.create(observer => {
   observer.error(new Error('error'));
   observer.complete();
});
const clientDetailsObserver = new Subject();
const testComponent = class { };
const mockPreferencedata = [{
   PreferenceKey: 'PreferredName',
   PreferenceValue: 'test'
}];
const routerTestingParam = [
   { path: 'dashboard', component: testComponent }
];

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

const headerMenuStub = {
   openHeaderMenu: jasmine.createSpy('openHeaderMenu')
};

describe('ViewBankerComponent', () => {
   let component: ViewBankerComponent;
   let fixture: ComponentFixture<ViewBankerComponent>;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule.withRoutes(routerTestingParam)],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         declarations: [ViewBankerComponent, SkeletonLoaderPipe],
         providers: [
            BsModalService,
            WindowRefService,
            { provide: ProfileService, useValue: profileServiceStub },
            {
               provide: ClientProfileDetailsService, useValue: {
                  clientDetailsObserver: clientDetailsObserver,
                  getClientPreferenceDetails: jasmine.createSpy('getClientPreferenceDetails').and
                     .returnValue(clientDetailsStub)
               }
            },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub },
            { provide: HeaderMenuService, useValue: headerMenuStub }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(ViewBankerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should call View Banker api', () => {
      component.SecOfficerCd = '4234';
      component.getBankerDetails();
      expect(component.bankerDetails).toBeDefined();
      expect(component.SecOfficerCd).toBe('4234');
      expect(component.noBanker).toBe(false);
      expect(component.bankerEmail).toBe('georgeja@nedbank.co.za');
      expect(component.bankerName).toBe('Alex Nathu');
      expect(component.telephoneNumber).toBe('+27 56 059 8188');
      expect(component.skeletonMode).toBe(false);
   });
   it('should listen to client details observer', () => {
      clientDetailsObserver.next(mockPreferencedata);
   });
   it('should listen to client details observer but if block should not execute ', () => {
      clientDetailsObserver.next(mockPreferencedata);
   });
   it('should return error for View Banker api', () => {
      profileServiceStub.getBankerDetails.and.returnValue(viewBankerErrorStub);
      component.SecOfficerCd = 'test';
      component.getBankerDetails();
      expect(component.apiFailed).toBe(true);
      expect(component.isFailedBlockClose).toBe(false);
   });
   it('should return error for View Banker api', () => {
      profileServiceStub.getBankerDetails.and.returnValue(viewBankerErrorStub);
      component.SecOfficerCd = 'test';
      component.retryServiceCount = 3;
      component.getBankerDetails();
      expect(component.apiFailed).toBe(true);
   });
   it('should retry api service', () => {
      component.retryServiceCount = 0;
      component.retryService();
      expect(component.retryServiceCount).toBe(1);
      component.bankerDetails = mockBankerDetails;
      expect(component.bankerDetails).toBeDefined();
   });
   it('should not retry api service', () => {
      component.retryServiceCount = 3;
      component.retryService();
      expect(component.isFailedBlockClose).toBe(true);
   });
   it('should use work number instead of cell number', () => {
      component.setBankerDetails(mockBankerDetails1);
      expect(component.telephoneNumber).toBe('+27 86 055 5111');
   });
   it('should set default cell number in case of no banker', () => {
      component.setBankerDetails(mockBankerDetails3);
      expect(component.telephoneNumber).toBe('+27 86 055 5111');
   });
   it('should use call api to get contact centre number', () => {
      profileServiceStub.getBankerDetails.and.returnValue(Observable.of(mockBankerDetails3));
      component.setBankerDetails(mockBankerDetails2);
      expect(component.telephoneNumber).toBe('+27 86 055 5111');
   });
   it('should use call api to set non default banker email', () => {
      profileServiceStub.getBankerDetails.and.returnValue(Observable.of(mockBankerDetails3));
      component.setBankerDetails(mockBankerDetails4);
      expect(component.bankerEmail).toBe('georgeja@nedbank.co.za');
   });
   it('should get banker initials', () => {
      expect(component.getBankerInitials(mockBankerDetails.firstName + ' ' + mockBankerDetails.lastName)).toBe('AN');
   });
   it('should send mail', () => {
      component.bankerEmail = mockBankerDetails3.emailAddress;
      component.sendMail();
   });
});
