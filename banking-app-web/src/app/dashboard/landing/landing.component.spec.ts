import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { assertModuleFactoryCaching } from './../../test-util';
import { LandingComponent } from './landing.component';
import { ChatService } from '../../chat/chat.service';
import { TrusteerService } from '../../core/services/trusteer-service';
import { RouterTestingModule } from '@angular/router/testing';
import { WindowRefService } from '../../core/services/window-ref.service';
import { IBankerDetail, IDcarRangeDetails, IClientDetails } from '../../core/services/models';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { Subject } from 'rxjs/Subject';
import { AccountService } from '../account.service';

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

const accountServiceStub = {
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

const clientDetailsStub: IClientDetails = {
   FullNames: 'alex nathu', PreferredName: 'Alex', DefaultAccountId: '2',
   CisNumber: 234234, FirstName: 'alex', SecondName: 'alex', Surname: 'nathu', CellNumber: '12312',
   EmailAddress: 'alex@alex.com', BirthDate: '', FicaStatus: 989, SegmentId: '23432', IdOrTaxIdNo: 234, SecOfficerCd: '4234',
   Address: { AddressCity: '', AddressLines: [], AddressPostalCode: '' }, AdditionalPhoneList: []
};


const clientProfileServiceStub = {
   clientDetailsObserver: new Subject(),
   getClientPreferenceDetails: jasmine.createSpy('getClientPreferenceDetails').and
      .returnValue(clientDetailsStub),
   isViewBanker: true,
   SecOfficerCd: 'test'
};

describe('LandingComponent Chat', () => {
   let component: LandingComponent;
   let fixture: ComponentFixture<LandingComponent>;

   const chatServiceStub = {
      getChatActive: jasmine.createSpy('getChatActive')
         .and.returnValue(Observable.of(true))
   };

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule],
         declarations: [LandingComponent],
         providers: [TrusteerService, WindowRefService,
            { provide: ChatService, useValue: chatServiceStub },
            { provide: ClientProfileDetailsService, useValue: clientProfileServiceStub },
            { provide: AccountService, useValue: accountServiceStub },
         ],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
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

   it('should not show view banker on error', () => {
      accountServiceStub.getDcarRange.and.returnValue(viewBankerErrorStub);
      component.clientDetails = clientDetailsStub;
      component.SecOfficerCd = 'test';
      component.getDcarDetails();
      expect(component.isViewBanker).toBe(false);
   });

   it('should show your banker', () => {
      component.isDecarRangeBanker(mockDecarRangeDetails[0]);
      expect(component.isViewBanker).toBe(true);
   });

   it('should enable account focus', () => {
      component.isQuickPayFocus(true);
      expect(component.isAccountsBlur).toBe(true);
   });
});
