import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { OpenAccountService } from '../open-account.service';
import { OpenNewAccountComponent } from './open-new-account.component';
import { assertModuleFactoryCaching } from './../../test-util';
import { IFicaResult, IClientType, IClientDetails } from '../../core/services/models';

function getClientDetails(): IClientDetails {
   return {
      CisNumber: 110282180605,
      FirstName: 'Marc',
      SecondName: '',
      Surname: 'Schutte',
      FullNames: 'Mr Marc Schutte',
      CellNumber: '+27992180605',
      EmailAddress: '',
      BirthDate: '1977-03-04T22:00:00Z',
      FicaStatus: 701,
      SegmentId: 'AAAZZZ',
      IdOrTaxIdNo: 7703055072088,
      SecOfficerCd: '36407',
      PreferredName: 'Marc',
      AdditionalPhoneList: [
         {
            AdditionalPhoneType: 'BUS',
            AdditionalPhoneNumber: '(086) 1828828'
         },
         {
            AdditionalPhoneType: 'CELL',
            AdditionalPhoneNumber: '+27992180605'
         },
         {
            AdditionalPhoneType: 'HOME',
            AdditionalPhoneNumber: '(078) 2228519'
         }
      ],
      Address: {
         AddressLines: [
            {
               AddressLine: 'G12 KYLEMORE'
            },
            {
               AddressLine: 'THE MARINA RESIDENTS DOCK ROAD'
            },
            {
               AddressLine: 'WATERFRONT'
            }
         ],
         AddressCity: 'CAPE TOWN',
         AddressPostalCode: '08001'
      }
   };
}

const clientDetailsObserver: BehaviorSubject<IClientDetails> = new BehaviorSubject<IClientDetails>(getClientDetails());

const mockFicaResult: IFicaResult[] = [{
   isFica: true,
},
{
   isFica: false,
}];

const mockClientType: IClientType[] = [{
   ClientType: '49'
},
{
   ClientType: '51'
}];

const accountServiceStub = {
   getficaStatus: jasmine.createSpy('getficaStatus').and.returnValue(Observable.of(mockFicaResult[0])),
   getFicaFalse: mockFicaResult[1],
};

describe('OpenNewAccountComponent', () => {
   let component: OpenNewAccountComponent;
   let fixture: ComponentFixture<OpenNewAccountComponent>;
   let router: Router;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule, RouterTestingModule],
         declarations: [OpenNewAccountComponent],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [{ provide: OpenAccountService, useValue: accountServiceStub },
         {
            provide: ClientProfileDetailsService, useValue: {
               clientDetailsObserver: clientDetailsObserver
            }
         },
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(OpenNewAccountComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('client type is not valid', () => {
      accountServiceStub.getficaStatus.and.returnValue(Observable.of(mockFicaResult[1]));
      component.getFicaStatus();
      expect(component.showReasonError).toBe(true);
   });

   it('should be call isCheck function', () => {
      const data = {
         currentTarget: {
            checked: true
         }
      };
      component.isCheck(data);
      expect(component.isChecked).toBe(false);
   });

   it('should be isCheck true', () => {
      const data = {
         currentTarget: {
            checked: false
         }
      };
      component.isCheck(data);
      expect(component.isChecked).toBe(false);
   });

   it('should be display options screen when user clicks on accept button', () => {
      component.onAccept();
      expect(component.isRightOptions).toBe(true);
   });

   it('should navigate on back to overview click', () => {
      const spy = spyOn(router, 'navigateByUrl');
      component.backToOverview();
      const url = spy.calls.first().args[0];
      expect(url).toBe('/dashboard');
   });

   it('should go to the dashboard screen', () => {
      const spy = spyOn(router, 'navigateByUrl');
      component.showDashboard(true);
      const url = spy.calls.first().args[0];
      expect(url).toBe('/dashboard');
   });
});
