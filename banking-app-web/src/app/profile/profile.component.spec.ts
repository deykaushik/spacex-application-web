import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { assertModuleFactoryCaching } from './../test-util';
import { ProfileComponent } from './profile.component';
import { Observable } from 'rxjs/Observable';
import { IBankerDetail, IDcarRangeDetails, IClientDetails } from '../core/services/models';
import { ProfileService } from './profile.service';
import { ClientProfileDetailsService } from '../core/services/client-profile-details.service';
import { Subject } from 'rxjs/Subject';
import { LoaderService } from '../core/services/loader.service';

const mockBankerDetails: IBankerDetail = {
   firstName: 'Alex',
   lastName: 'Nathu',
   workNumber: '+27 (0) 860 555 111',
   cellPhoneNumber: '+27 560 598 188',
   emailAddress: 'georgeja@nedbank.co.za',
   isDefaultBanker: false,
   bankerPicture: ''
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

const clientDetailsStub: IClientDetails = {
   FullNames: 'alex nathu', PreferredName: 'Alex', DefaultAccountId: '2',
   CisNumber: 234234, FirstName: 'alex', SecondName: 'alex', Surname: 'nathu', CellNumber: '12312',
   EmailAddress: 'alex@alex.com', BirthDate: '', FicaStatus: 989, SegmentId: '23432', IdOrTaxIdNo: 234, SecOfficerCd: '4234',
   Address: { AddressCity: '', AddressLines: [], AddressPostalCode: '' }, AdditionalPhoneList: []
};

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

const clientProfileServiceStub = {
   clientDetailsObserver: new Subject(),
   getClientPreferenceDetails: jasmine.createSpy('getClientPreferenceDetails').and
      .returnValue(clientDetailsStub),
   isViewBanker: true,
   SecOfficerCd: 'test'
};


const loaderStub = {
   show: jasmine.createSpy('show'),
   hide: jasmine.createSpy('hide'),
};

const navMenus = [
   { label: 'Profile details', url: 'profile-details' },
   { label: 'Change password', url: 'change-password' }
];

describe('ProfileComponent', () => {
   let component: ProfileComponent;
   let fixture: ComponentFixture<ProfileComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         schemas: [NO_ERRORS_SCHEMA],
         declarations: [ProfileComponent],
         providers: [{ provide: ProfileService, useValue: profileServiceStub },
         { provide: ClientProfileDetailsService, useValue: clientProfileServiceStub },
         { provide: LoaderService, useValue: loaderStub }
         ],
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(ProfileComponent);
      component = fixture.componentInstance;
      component.navMenus = navMenus;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });


   it('should not show view banker on error', () => {
      profileServiceStub.getDcarRange.and.returnValue(viewBankerErrorStub);
      component.clientDetails = clientDetailsStub;
      component.SecOfficerCd = 'test';
      component.getDcarDetails();
      expect(component.isViewBanker).toBe(false);
   });

   it('should show your banker', () => {
      component.isDecarRangeBanker(mockDecarRangeDetails[0]);
      expect(component.isViewBanker).toBe(true);
   });
});
