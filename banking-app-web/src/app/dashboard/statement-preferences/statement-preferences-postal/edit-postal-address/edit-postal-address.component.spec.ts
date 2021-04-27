import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { Observable } from 'rxjs/Observable';

import { assertModuleFactoryCaching } from '../../../../test-util';
import { HighlightPipe } from './../../../../shared/pipes/highlight.pipe';
import { AccountService } from '../../../account.service';
import { IPostalCode, IStatementPreferences } from '../../../../core/services/models';
import { EditPostalAddressComponent } from './edit-postal-address.component';

const mockGetAccountStatementPreferences: IStatementPreferences = {
   itemAccountId: '1',
   accountNumber: '1001037693',
   frequency: 'MONTHLY',
   deliveryMode: 'EMAIL',
   paymentMethod: 'DEBO',
   email: ['GUNJAL138@GMAIL.COM', 'TEST@GAS.COM'],
   postalAddress: {
      addrLines: ['32 ESTATE', '19', 'CRAIGAVON'],
      city: 'JOHANNESBURG',
      postalCd: '2191'
   }
};
const postalCodes: IPostalCode[] = [{
   city: 'abcd',
   postalCode: '02345',
   suburb: 'xyz',
   postalCodeType: 'street'
},
{
   city: 'efgh',
   postalCode: '07890',
   suburb: 'CRAIGAVON',
   postalCodeType: 'street'
},
{
   city: 'ABCD',
   postalCode: '07654',
   suburb: 'efg',
   postalCodeType: 'street'
}];
const typeAheadMatch = {
   value: 'xyz',
   item: {
      suburb: 'xyz',
      city: 'abcd',
      postalCode: '02345'
   }
};
const typeAheadMatchNoData = {};

const accountServiceStub = {
   getPostalCodes: jasmine.createSpy('getPostalCodes').and.returnValue(Observable.of(postalCodes))
};

describe('EditPostalAddressComponent', () => {
   let component: EditPostalAddressComponent;
   let fixture: ComponentFixture<EditPostalAddressComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule, TypeaheadModule.forRoot()],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         declarations: [EditPostalAddressComponent, HighlightPipe],
         providers: [
            { provide: AccountService, useValue: accountServiceStub }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(EditPostalAddressComponent);
      component = fixture.componentInstance;
      component.statementPreferencesDetails = mockGetAccountStatementPreferences;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should be check the debit order payer', () => {
      component.statementPreferencesDetails.postalAddress.addrLines[0] = '';
      component.statementPreferencesDetails.postalAddress.addrLines[1] = '';
      component.statementPreferencesDetails.postalAddress.addrLines[2] = '';
      component.statementPreferencesDetails.postalAddress.city = '';
      component.statementPreferencesDetails.postalAddress.postalCd = '';
      component.ngOnInit();
      expect(component.isdebitOrderPayer).toBe(true);
      expect(component.postalCode).toBe('');
      expect(component.addressLine2).toBe('');
   });
   it('should call getpostal codes', () => {
      component.postalCodes = postalCodes;
      component.values.street = 'STREET';
      const event = { target: { value: 'xyz' } };
      component.getPostalCodes(event);
      expect(component.showLoader).toBe(false);
   });
   it('should call getpostal codes with empty response', () => {
      accountServiceStub.getPostalCodes.and.returnValue(Observable.of([]));
      const event = { target: { value: 'pqr' } };
      component.getPostalCodes(event);
      expect(component.addressLine2).toBe('pqr');
   });
   it('should call getpostal codes for less than three characters', () => {
      const event = { target: { value: 'x' } };
      component.getPostalCodes(event);
      expect(component.postalCodes).toBeDefined();
   });
   it('should be call clearSuburbInfo', () => {
      component.cities = [];
      component.clearSuburbInfo();
      expect(component.addressLine2).toBeUndefined();
      expect(component.city).toBeUndefined();
      expect(component.postalCode).toBeUndefined();
      expect(component.cities).toBeUndefined();
   });
   it('should be call clearField', () => {
      component.clearField();
      expect(component.addressLine2).toBeUndefined();
      expect(component.city).toBeUndefined();
      expect(component.postalCode).toBeUndefined();
      expect(component.cities).toBeUndefined();
   });
   it('should be call assignSuburb', () => {
      component.postalCodes = postalCodes;
      component.assignSuburb(typeAheadMatch);
      expect(component.isSuburbFocus).toBe(false);
   });
   it('should be call selectSuburb', () => {
      component.assignSuburb(typeAheadMatch);
      component.selectSuburb(typeAheadMatch);
      expect(component.isSuburbFocus).toBe(false);
   });
   it('should be call blurSuburb', () => {
      component.blurSuburb(typeAheadMatch);
      expect(component.city).toEqual('abcd');
      expect(component.postalCode).toEqual('2345');
   });
   it('should be call blurSuburb false', () => {
      component.blurSuburb(typeAheadMatchNoData);
      expect(component.addressLine2).toBeUndefined();
      expect(component.city).toBeUndefined();
      expect(component.postalCode).toBeUndefined();
      expect(component.cities).toBeUndefined();
   });
   it('should be call clearSuburbSuggestion', () => {
      component.clearSuburbSuggestion(true);
      expect(component.noSuburbSuggestions).toBe(true);
      expect(component.isSuburbFocus).toBe(true);
   });
   it('should be call blurSuburbInput', () => {
      component.noSuburbSuggestions = true;
      component.blurSuburbInput();
      expect(component.addressLine2).toBeUndefined();
      expect(component.city).toBeUndefined();
      expect(component.postalCode).toBeUndefined();
      expect(component.cities).toBeUndefined();
   });
   it('should be call onCityClicked', () => {
      component.onCityClicked();
      expect(component.isdropdownOpen).toBe(true);
   });
   it('should be call onCitySelect', () => {
      component.addressLine2 = 'CRAIGAVON';
      component.postalCodes = postalCodes;
      component.onCitySelect(postalCodes[1].city);
      expect(component.city).toEqual(postalCodes[1].city);
      expect(component.postalCode).toEqual('7890');
   });

   it('should be call updateStatementPreferencesPostalAddress', () => {
      component.updateStatementPreferencesPostalAddress(false);
      expect(component.isEditAddress).toBe(false);
   });
   it('should be call onClose', () => {
      component.onClose(true);
      expect(component.isEditAddress).toBe(true);
   });
   it('should be call isCityDisable for one city', () => {
      component.isOneCity = true;
      component.isCityDisable();
      expect(component.isdropdownOpen).toBe(false);
   });
   it('should be call isCityDisable for multiple city', () => {
      component.isOneCity = false;
      component.isCityDisable();
      expect(component.isdropdownOpen).toBe(true);
   });
   it('should be call validateAddressLine0', () => {
      component.validateAddressLine0('abc');
      expect(component.isAddressLine0Valid).toBe(false);
   });
   it('should be call validateAddressLine0 for false case', () => {
      component.validateAddressLine0('');
      expect(component.isAddressLine0Valid).toBe(true);
   });
   it('should be call validateAddressLine1', () => {
      component.validateAddressLine1('abc');
      expect(component.isAddressLine1Valid).toBe(false);
   });
   it('should be call validateAddressLine0 for false case', () => {
      component.validateAddressLine1('');
      expect(component.isAddressLine1Valid).toBe(true);
   });
   it('should be call onClose', () => {
      component.isDisable(true);
      expect(component.isFormValid).toBe(true);
   });
});
