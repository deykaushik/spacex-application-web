import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { assertModuleFactoryCaching } from './../../test-util';
import { LandingComponent } from './landing.component';
import { GaTrackingService } from '../../core/services/ga.service';
import { BeneficiaryService } from '../../core/services/beneficiary.service';
import { IContactCard, IBankDefinedBeneficiary, IParentOperation } from '../../core/services/models';
import { Constants } from '../../core/utils/constants';
import { SearchRecipientsComponent } from '../../shared/components/search-recipients/search-recipients.component';
import { RecipientService } from '../recipient.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { RecipientOperation } from '../models';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { TrusteerService } from '../../core/services/trusteer-service';


const recipeintServiceStub = {
   initiateRecepientFlow: jasmine.createSpy('initiateRecepientFlow'),
   recipientOperation: new BehaviorSubject<RecipientOperation>(0)
};

function getBankApprovedData(): IBankDefinedBeneficiary {
   return {
      bDFID: '11111110',
      bDFName: 'STANDARD BANK CARD DIVISION',
      sortCode: 205
   };
}

function getContactCardData(): IContactCard {
   return {
      contactCardID: 4,
      contactCardName: 'Zahira Mahomed',
      contactCardDetails: [
         {
            accountType: 'CA', beneficiaryID: 2,
            beneficiaryName: 'Zahira Mahomed', accountNumber: '1104985268',
            bankName: 'NEDBANK', branchCode: '171338',
            beneficiaryType: 'BNFINT', myReference: 'Z Mahomed',
            beneficiaryReference: 'Gomac', valid: true
         }],
      contactCardNotifications: [{
         notificationAddress: 'swapnilp@yahoo.com',
         notificationType: 'EMAIL', notificationDefault: true,
         notificationParents: []
      }],
      beneficiaryRecentTransactDetails: []
   };
}
const serviceStub = {
   getBankApprovedBeneficiaries: jasmine.createSpy('getBankApprovedBeneficiaries').and.returnValue(Observable.of([getBankApprovedData()])),
   getContactCards: jasmine.createSpy('getContactCards').and.returnValue(Observable.of([getContactCardData()])),
};

const params = new Subject();

const testComponent = class { };

const routerTestingStub = [
    {path: 'recipient', component: testComponent }
];

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({}),
   gtag: jasmine.createSpy('gtag').and.returnValue({}),
};

describe('LandingComponent receipt', () => {
   let component: LandingComponent;
   let fixture: ComponentFixture<LandingComponent>;
   let body: HTMLElement;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [LandingComponent, SearchRecipientsComponent],
         imports: [RouterTestingModule.withRoutes(routerTestingStub)],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [
            { provide: RecipientService, useValue: recipeintServiceStub },
            { provide: BeneficiaryService, useValue: serviceStub },
            {
               provide: ActivatedRoute, useValue: { params: Observable.of({ action: Constants.Recipient.addFlag }) }
            },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub }
            ]
      })
         .overrideComponent(SearchRecipientsComponent, {
            set: {
               template: '',
               selector: 'app-search-recipients',
            }
         })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(LandingComponent);
      component = fixture.componentInstance;
      body = component['document'].body;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should handle beneficiary selection', () => {
      component.handleBeneficiarySelection({
         contactCard: getContactCardData()
      });
      expect(component.beneficiaryData).toBeDefined();
   });

   it('should operation sucess', () => {
      component.onOperationSuccess(5);
      expect(component.contactCardId).toBe(5);

      component.onOperationSuccess(Constants.Recipient.status.reset);
      expect(component.contactCardId).toBeGreaterThan(0);

      component.onOperationSuccess(Constants.Recipient.status.deleteSuccess);
      expect(component.contactCardId).toBe(Constants.Recipient.status.deleteSuccess);

      component.onOperationSuccess(Constants.Recipient.status.error);
      expect(component.isError).toBe(true);

      component.onOperationSuccess(Constants.Recipient.status.cancel);
      expect(component.contactCardId).toBe(Constants.Recipient.status.error);
   });
   it('should activate right slide', () => {
      component.isSlide = true;
      component.activeSlide();
      expect(component.isSlide).toBeTruthy();
      expect(body.classList.toString())
         .toContain('search-recipients-no-scroll');
   });
   it('should close right slide', () => {
      component.isSlide = false;
      component.goBack();
      expect(component.isSlide).toBeFalsy();
      expect(body.classList.toString())
         .not.toContain('search-recipients-no-scroll');
   });
   it('should handle recipient addition', () => {
      component.onAddRecipientClick();
      expect(component.addRecipient).toBe(true);
   });
   it('should show message block', () => {
      component.showMessageBlock();
      expect(component.isShowMessageBlock).toBe(true);
   });

   it('should hide message block', () => {
      component.closeMessageBlock();
      expect(component.isShowMessageBlock).toBe(false);
   });

   it('should hide limit exceeded popup', () => {
      component.hideLimitExceededNotification();
      expect(component.isMaxRecipientLimitExceeded).toBe(false);
   });

   it('should hide the delete recipient popup', () => {
      component.hideDeleteRecipientNotification();
      expect(component.deleteRecipientVisible).toBeFalsy();
   });

   it('should be able to raise delete recipient event', () => {
      expect(component.deleteRecipient()).toBeUndefined();
   });

   it('should check responses to show / hide delete & limit exceeded popup events', () => {
      fixture.detectChanges();
      recipeintServiceStub.recipientOperation.next(RecipientOperation.showDeleteRecipient);
      fixture.detectChanges();
      expect(component.deleteRecipientVisible).toBeTruthy();


      recipeintServiceStub.recipientOperation.next(RecipientOperation.hideDeleteRecipient);
      fixture.detectChanges();
      expect(component.deleteRecipientVisible).toBeFalsy();

      recipeintServiceStub.recipientOperation.next(RecipientOperation.showLimitExceeded);
      fixture.detectChanges();
      expect(component.isMaxRecipientLimitExceeded).toBeTruthy();
   });

   it('should be open add recipient when route param is "add" ', () => {
      expect(component).toBeDefined();
      params.next({ action: 'add' });
      component.addRecipient = true;
      component.handleBeneficiarySelection({});
      component.onOperationSuccess(-2);
      params.next({ action: 'notadd' });
   });
   it('should handle handleBeneficiarySelection ', () => {
      component.beneficiaryData = {};
      component.allowSlide = false;
      component.handleBeneficiarySelection({});
      expect(component.allowSlide).toBe(true);
   });

   it('should handle on operation success', () => {
      component.beneficiaryData = { contactCard: { contactCardName: '' } };
      component.onOperationSuccess(-2);
      expect(component.contactCardId).toBeUndefined();
   });
});

describe('LandingComponent', () => {
   let component: LandingComponent;
   let fixture: ComponentFixture<LandingComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [LandingComponent, SearchRecipientsComponent],
         imports: [RouterTestingModule],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [TrusteerService,
            { provide: RecipientService, useValue: recipeintServiceStub },
            { provide: BeneficiaryService, useValue: serviceStub },
            {
               provide: ActivatedRoute, useValue: { params: Observable.of({ action: 0 }) }
            },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub }
         ]
      })
         .overrideComponent(SearchRecipientsComponent, {
            set: {
               template: '',
               selector: 'app-search-recipients',
            }
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
   it('should be call selectBankApprovedTab', () => {
      component.selectBankApprovedTab();
      expect(component.activeTab).toBe(2);
   });

   it('should handle onDestroy', () => {
      component.subscription = null;
      expect(component.ngOnDestroy()).toBeUndefined();
   });
   it('should handle child call', () => {
      component.childNotifying({ isValid: true, isSaveLoading: true });
      expect(component.isValid).toBe(true);
      expect(component.isSaveLoading).toBe(true);
   });
   it('should call save recipient on parent button click', () => {
      component.parentNotify.subscribe((details: IParentOperation) => {
         expect(details.isSaveRecipient).toBe(true);
      });
      component.saveRecipient();
   });
   it('should call save recipient on parent button click', () => {
      component.parentNotify.subscribe((details: IParentOperation) => {
         expect(details.isSaveRecipient).toBe(false);
      });
      component.parentNotify.next({ isSaveRecipient: false });
   });
   it('should scroll to top on success', () => {
      component.onRecipientFocusMessage();
      expect(component.recipeintArea.nativeElement.scrollTop).toEqual(0);
   });
});
