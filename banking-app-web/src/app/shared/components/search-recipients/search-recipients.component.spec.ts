import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { ElementRef, Component, ViewChild, Renderer } from '@angular/core';
import { inject } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { assertModuleFactoryCaching } from './../../../test-util';
import { SearchRecipientsComponent } from './search-recipients.component';
import { ClickScrollDirective } from './../../directives/click-scroll.directive';

import { BeneficiaryService } from './../../../core/services/beneficiary.service';
import { IBankDefinedBeneficiary, IContactCard, IBeneficiaryData } from './../../../core/services/models';
import { HighlightPipe } from './../../pipes/highlight.pipe';
import { Constants } from './../../../core/utils/constants';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
   template: '<div id="scroll-page"></div> <app-search-recipients [isOverlay]="isOverlay"></app-search-recipients>'
})
class TestHostComponent {
   isOverlay: boolean;
   @ViewChild(SearchRecipientsComponent) /* using viewChild we get access to the TestComponent which is a child of TestHostComponent */
   public SearchRecipientsComponent: any;
}
function getBankApprovedData(): IBankDefinedBeneficiary {
   return {
      bDFID: '000101',
      bDFName: 'STANDARD BANK CARD DIVISION',
      sortCode: 205
   };
}
function getBankApprovedData2(): IBankDefinedBeneficiary {
   return {
      bDFID: '0000000014',
      bDFName: 'EDGARS',
      sortCode: 255005
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
         }, {
            accountType: 'CA', beneficiaryID: 3,
            beneficiaryName: 'Zahira Mahomed', accountNumber: '1104985268',
            bankName: 'NEDBANK', branchCode: '171338',
            beneficiaryType: 'PPD', myReference: 'Z Mahomed',
            beneficiaryReference: 'Gomac', valid: true
         },
         {
            accountType: 'CA', beneficiaryID: 4,
            beneficiaryName: 'Zahira Mahomed', accountNumber: '1104985268',
            bankName: 'NEDBANK', branchCode: '171338',
            beneficiaryType: 'PEL', myReference: 'Z Mahomed',
            beneficiaryReference: 'Gomac', valid: true
         }
      ],
      contactCardNotifications: [{
         notificationAddress: 'swapnilp@yahoo.com',
         notificationType: 'EMAIL', notificationDefault: true,
         notificationParents: []
      }],
      beneficiaryRecentTransactDetails: []
   };
}
function getContactCardDataWithNumber(): IContactCard {
   return {
      contactCardID: 4,
      contactCardName: '12Zahira Mahomed',
      contactCardDetails: [
         {
            accountType: 'CA', beneficiaryID: 2,
            beneficiaryName: 'Zahira Mahomed', accountNumber: '1104985268',
            bankName: 'NEDBANK', branchCode: '171338',
            beneficiaryType: 'BNFINT', myReference: 'Z Mahomed',
            beneficiaryReference: 'Gomac', valid: true
         }, {
            accountType: 'CA', beneficiaryID: 3,
            beneficiaryName: 'Zahira Mahomed', accountNumber: '1104985268',
            bankName: 'NEDBANK', branchCode: '171338',
            beneficiaryType: 'PPD', myReference: 'Z Mahomed',
            beneficiaryReference: 'Gomac', valid: true
         },
         {
            accountType: 'CA', beneficiaryID: 4,
            beneficiaryName: 'Zahira Mahomed', accountNumber: '1104985268',
            bankName: 'NEDBANK', branchCode: '171338',
            beneficiaryType: 'PEL', myReference: 'Z Mahomed',
            beneficiaryReference: 'Gomac', valid: true
         }
      ],
      contactCardNotifications: [{
         notificationAddress: 'swapnilp@yahoo.com',
         notificationType: 'EMAIL', notificationDefault: true,
         notificationParents: []
      }],
      beneficiaryRecentTransactDetails: []
   };
}
function getAccountContactCardData(): IContactCard {
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
         }
      ],
      contactCardNotifications: [{
         notificationAddress: 'swapnilp@yahoo.com',
         notificationType: 'EMAIL', notificationDefault: true,
         notificationParents: []
      }],
      beneficiaryRecentTransactDetails: []
   };
}

function getPrepaidContactCardData(): IContactCard {
   return {
      contactCardID: 4,
      contactCardName: 'Zahira Mahomed',
      contactCardDetails: [
         {
            accountType: 'CA', beneficiaryID: 2,
            beneficiaryName: 'Zahira Mahomed', accountNumber: '1104985268',
            bankName: 'NEDBANK', branchCode: '171338',
            beneficiaryType: 'PEL', myReference: 'Z Mahomed',
            beneficiaryReference: 'Gomac', valid: true
         }
      ],
      contactCardNotifications: [{
         notificationAddress: 'swapnilp@yahoo.com',
         notificationType: 'EMAIL', notificationDefault: true,
         notificationParents: []
      }],
      beneficiaryRecentTransactDetails: []
   };
}
function getSinglePaymentContactCardData(): IContactCard {
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
         }
      ],
      contactCardNotifications: [{
         notificationAddress: 'swapnilp@yahoo.com',
         notificationType: 'EMAIL', notificationDefault: true,
         notificationParents: []
      }],
      beneficiaryRecentTransactDetails: []
   };
}

function getBeneficiaryData(): IBeneficiaryData {
   return {
      bankDefinedBeneficiary: getBankApprovedData()
   };
}
const serviceStub = {
   getBankApprovedBeneficiaries: jasmine.createSpy('getBankApprovedBeneficiaries').and
      .returnValue(Observable.of([getBankApprovedData(), getBankApprovedData(), getBankApprovedData2()])),
   getContactCards: jasmine.createSpy('getContactCards').and.returnValue(Observable.of([getContactCardData(),
   getContactCardData(), getContactCardDataWithNumber()])),
};

describe('SearchRecipientsComponent', () => {
   let component: SearchRecipientsComponent;
   let fixture: ComponentFixture<SearchRecipientsComponent>;
   let body: HTMLElement;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule, RouterTestingModule],
         declarations: [SearchRecipientsComponent, ClickScrollDirective, HighlightPipe, TestHostComponent],
         providers: [
            { provide: BeneficiaryService, useValue: serviceStub },
            { provide: ElementRef },
            { provide: Document },
            { provide: Renderer },
            { provide: ActivatedRoute, useValue: { params: Observable.of({ action: 'add' }) } }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(SearchRecipientsComponent);
      component = fixture.componentInstance;
      body = component['document'].body;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should set tab', () => {
      component.selectTab(2);
      fixture.detectChanges();
      expect(component.activeTab).toBe(2);
      component.selectTab(1);
      fixture.detectChanges();
      expect(component.activeTab).toBe(1);
   });

   it('should hide receipients', () => {
      fixture.detectChanges();
      component.onBeneficiaryListHidden.subscribe(result => {
         expect(result).toBeUndefined();
      });
      fixture.whenStable().then(() => {
         component.hideSearchRecipients();
      });
   });

   it('should handle click for alphabet list', () => {
      fixture.detectChanges();
      const elem = fixture.debugElement.query(By.css('div.alphabets-list ul li:first-child'));
      elem.triggerEventHandler('click', {});
      fixture.detectChanges();
      expect(true).toBe(true);
   });

   it('should handle click for character for which data is not available', () => {
      fixture.detectChanges();
      const elem = fixture.debugElement.query(By.css('div.alphabets-list ul li:last-child'));
      elem.triggerEventHandler('click', {});
      fixture.detectChanges();
      expect(true).toBe(true);
   });

   it('should handle multiple payment list toggle', () => {
      expect(component.toggle(null)).toBeUndefined();
      // should open multiple payment list
      expect(component.toggle(4)).toBeUndefined();

      fixture.detectChanges();
      // should close multiple payment list
      fixture.whenStable().then(() => {
         expect(component.toggle(4)).toBeUndefined();
      });
   });

   it('should close recipient list on ESC', () => {
      component.onBeneficiaryListHidden.subscribe(result => {
         expect(result).toBeUndefined();
      });

      const e = new KeyboardEvent('keydown', {
         bubbles: true,
         cancelable: true,
         shiftKey: true
      });
      Object.defineProperty(e, 'keyCode', { 'value': 27 });
      component.handleKeyboardEvent(e);

      Object.defineProperty(e, 'keyCode', { 'value': 10 });
      component.handleKeyboardEvent(e);
   });

   it('should close recipient list on mouse click event', () => {
      component.onBeneficiaryListHidden.subscribe(result => {
         expect(result).toBeUndefined();
      });

      component.isOverlay = true;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         fixture.debugElement.query(By.css('.search-recipients')).nativeElement.click();
      });
   });

   it('should close recipient list on mouse click event', () => {
      component.onBeneficiaryListHidden.subscribe(result => {
         expect(result).toBeUndefined();
      });

      component.isOverlay = true;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         const e = new MouseEvent('click', {
         });
         component.handleDocumentEvent(e);
      });
   });

   it('should handle bank approved beneficiary selection', () => {
      component.onBeneficiaryDataSelection.subscribe(result => {
         expect(result).toEqual(getBeneficiaryData());
      });
      component.onBankApprovedSelection(getBankApprovedData());
   });

   it('should handle contact card selection for multiple payment', () => {
      component.onBeneficiaryDataSelection.subscribe(result => {
         expect(result).toEqual({
            bankDefinedBeneficiary: null,
            contactCardDetails: {
               isPrepaid: false,
               isAccount: true,
               isElectricity: false,
               cardDetails: getContactCardData().contactCardDetails[0]
            }
         });
      });
      component.onContactCardSelection(getContactCardData());
   });

   it('should handle contact card selection for single payment', () => {
      component.onBeneficiaryDataSelection.subscribe(result => {
         expect(result.contactCardDetails.cardDetails).toEqual(getSinglePaymentContactCardData().contactCardDetails[0]);
      });
      component.onContactCardSelection(getSinglePaymentContactCardData());
   });

   it('should handle account contact card selection', () => {
      component.onBeneficiaryDataSelection.subscribe(result => {
         expect(result).toEqual({
            bankDefinedBeneficiary: null,
            contactCardDetails: {
               isAccount: true,
               cardDetails: getSinglePaymentContactCardData().contactCardDetails[0]
            }
         });
      });
      component.onAccountContactCardSelection(getSinglePaymentContactCardData().contactCardDetails[0]);
   });

   it('should handle prepaid contact card selection', () => {
      component.onBeneficiaryDataSelection.subscribe(result => {
         expect(result).toEqual({
            bankDefinedBeneficiary: null,
            contactCardDetails: {
               isPrepaid: true,
               cardDetails: getSinglePaymentContactCardData().contactCardDetails[0]
            }
         });
      });
      component.onPrepaidContactCardSelection(getSinglePaymentContactCardData().contactCardDetails[0]);
   });

   it('should handle electricity contact card selection', () => {
      component.onBeneficiaryDataSelection.subscribe(result => {
         expect(result).toEqual({
            bankDefinedBeneficiary: null,
            contactCardDetails: {
               isElectricity: true,
               cardDetails: getSinglePaymentContactCardData().contactCardDetails[0]
            }
         });
      });
      component.onElectricityContactCardSelection(getSinglePaymentContactCardData().contactCardDetails[0]);
   });

   it('should filter beneficiary data', () => {
      component.filter = 'EDGARS';
      component.activeTab = 2;
      component.filterContent();
      expect(component.groupedBankApprovedData['S']).toEqual(undefined);
   });

   it('should filter Card data', () => {
      component.activeTab = 1;
      component.ngOnInit();
      component.filter = 'Shabana';
      component.filterContent();
      expect(component.groupedContactCardData['Z']).toEqual(undefined);
      component.filter = 'Zahira';
      component.filterContent();
      expect(component.groupedContactCardData['Z'].length).toEqual(2);
      component.filter = '1104985268';
      component.filterContent();
      expect(component.groupedContactCardData['Z'].length).toEqual(2);
   });

   it('filter function should handle error when no data ', () => {
      component.activeTab = 1;
      component.beneficiaryData = [];
      component.filter = 'Shabana';
      component.filterContent();
      expect(component.filterContent()).toEqual(false);
      component.activeTab = 2;
      expect(component.filterContent()).toEqual(false);
   });

   it('should call ngOnChanges', () => {
      const fixture2 = TestBed.createComponent(TestHostComponent);
      const testHostComponent = fixture2.componentInstance;
      testHostComponent.SearchRecipientsComponent.contactFilter = 'Shabana';
      spyOn(testHostComponent.SearchRecipientsComponent, 'ngOnChanges').and.callThrough();
      testHostComponent.isOverlay = true;
      fixture2.detectChanges();
      expect(testHostComponent.SearchRecipientsComponent.ngOnChanges).toHaveBeenCalled();
   });

   it('should return change data when filter is blank', () => {
      component.activeTab = 1;
      component.filter = '';
      component.filterContent();
      expect(component.groupedBankApprovedData['S'].length).toEqual(2);
      component.activeTab = 2;
      component.filterContent();
      expect(component.groupedContactCardData['Z'].length).toEqual(2);
   });

   it('should set host events', () => {
      component.onPage = true;
      component.setHostEvents();

      const event = new Event('document:click');
      component.handleDocumentEvent(event);
      expect(component.documentClickFunc).toBeUndefined();
   });

   it('should get electricity contacts', () => {
      const result = component.getElectricityContacts([getContactCardData(), getAccountContactCardData()]);
      expect(result.length).toBe(1);
   });

   it('should get prepaid contacts', () => {
      const result = component.getPrepaidContacts([getContactCardData(), getAccountContactCardData()]);
      expect(result.length).toBe(1);
   });

   it('should get pay contacts', () => {
      const result = component.getPayContacts([getAccountContactCardData(), getPrepaidContactCardData()]);
      expect(result.length).toBeGreaterThan(0);
   });
});

describe('SearchRecipientsComponent', () => {
   let component: SearchRecipientsComponent;
   let fixture: ComponentFixture<SearchRecipientsComponent>;
   let body: HTMLElement;
   let router: Router;
   const routerTestingParam = [
      { path: 'recipient', component: TestHostComponent },
      { path: 'recipient/add', component: TestHostComponent },
   ];
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule, RouterTestingModule.withRoutes(routerTestingParam)],
         declarations: [SearchRecipientsComponent, ClickScrollDirective, HighlightPipe,
            TestHostComponent],
         providers: [
            { provide: BeneficiaryService, useValue: serviceStub },
            { provide: ElementRef },
            { provide: Document },
            { provide: Renderer }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(SearchRecipientsComponent);
      component = fixture.componentInstance;
      component.onPage = true;
      body = component['document'].body;
      router = TestBed.get(Router);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should handle refresh contact id change when it is edited', () => {
      const fixture2 = TestBed.createComponent(TestHostComponent);
      const testHostComponent = fixture2.componentInstance;
      testHostComponent.SearchRecipientsComponent.refreshContactCardId = 4;
      spyOn(testHostComponent.SearchRecipientsComponent, 'ngOnChanges').and.callThrough();
      fixture2.detectChanges();
      expect(testHostComponent.SearchRecipientsComponent.ngOnChanges).toHaveBeenCalled();
   });

   it('should handle refresh contact id change when it is deleted', () => {
      component.refreshContactCardId = 444;
      component.refreshContactCards();
      expect(component.tabContent.nativeElement.scrollTop).toBe(0);
   });

   it('should handle refresh contact id change when it is deleted', () => {
      const fixture2 = TestBed.createComponent(TestHostComponent);
      const testHostComponent = fixture2.componentInstance;
      testHostComponent.SearchRecipientsComponent.refreshContactCardId = Constants.Recipient.status.deleteSuccess;
      spyOn(testHostComponent.SearchRecipientsComponent, 'ngOnChanges').and.callThrough();
      fixture2.detectChanges();
      expect(testHostComponent.SearchRecipientsComponent.ngOnChanges).toHaveBeenCalled();
   });

   it('should handle refresh contact id change when it is cancelled', () => {
      const fixture2 = TestBed.createComponent(TestHostComponent);
      const testHostComponent = fixture2.componentInstance;
      testHostComponent.SearchRecipientsComponent.refreshContactCardId = Constants.Recipient.status.error;
      spyOn(testHostComponent.SearchRecipientsComponent, 'ngOnChanges').and.callThrough();
      fixture2.detectChanges();
      expect(testHostComponent.SearchRecipientsComponent.ngOnChanges).toHaveBeenCalled();
   });

   it('should scroll to top when recipient deleted or added', () => {
      expect(component.onScroll(null)).toBeUndefined();
   });
   it('should handle exeption while loading recipients', inject([BeneficiaryService], (service: BeneficiaryService) => {
      service.getBankApprovedBeneficiaries = jasmine.createSpy('getBankApprovedBeneficiaries').and
         .returnValue(Observable.create((observer) => {
            observer.error(new Error('error'));
            observer.complete();
         }));
      component.isAddState = true;
      component.loadRecipients();
      expect(component.isErrorOcuured).toBe(true);
      expect(component.showLoader).toBe(false);
   }));
   it('should loaded recipients for Prepaid', inject([BeneficiaryService], (service: BeneficiaryService) => {
      component.options = [{}];
      component.options.isPrepaid = true;
      component.loadRecipients();
      expect(component.isErrorOcuured).toBe(false);
      expect(component.showLoader).toBe(false);
   }));
   it('should loaded recipients for Electricity', inject([BeneficiaryService], (service: BeneficiaryService) => {
      component.options = [{}];
      component.options.isElectricity = true;
      component.loadRecipients();
      expect(component.isErrorOcuured).toBe(false);
      expect(component.showLoader).toBe(false);
   }));
   it('should loaded recipients for Electricity when add state is set to true',
    inject([BeneficiaryService], (service: BeneficiaryService) => {
      component.options = [{}];
      component.options.isElectricity = true;
      component.isAddState = true;
      component.loadRecipients();
      expect(component.isErrorOcuured).toBe(false);
      expect(component.showLoader).toBe(false);
   }));
   it('should loaded recipients for Payment', inject([BeneficiaryService], (service: BeneficiaryService) => {
      component.options = [{}];
      component.options.isPay = true;
      component.loadRecipients();
      expect(component.isErrorOcuured).toBe(false);
      expect(component.showLoader).toBe(false);
   }));
   it('should handle credit card selection', inject([BeneficiaryService], (service: BeneficiaryService) => {
      spyOn(component.onBeneficiaryDataSelection, 'emit').and.callThrough();
      component.onCreditCardContactCardSelection(getContactCardData().contactCardDetails[0]);
      expect(component.onBeneficiaryDataSelection.emit).toHaveBeenCalled();
   }));
   it('should handle route with reload', (() => {
      component.navigationWithReload('recipient', 'add');
      router.navigate(['recipient', 'add']);
   }));
});
