import { CommonModule } from '@angular/common';
import { AmountTransformPipe } from './../../../shared/pipes/amount-transform.pipe';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { assertModuleFactoryCaching } from './../../../test-util';
import { IProductItem } from '../../../core/services/models';
import { SharedModule } from '../../../shared/shared.module';

import { UnitTrustWidgetComponent } from './unit-trust-widget.component';

const account: IProductItem = {
   productReferenceNumber: '',
   supplierCode: 'NIP',
   supplierName: 'Nedbank Investment Products',
   productCount: 0,
   productCode: 'Investment',
   productCategory: 'InternalRedemptions',
   productName: 'Nedgroup Investments',
   productCostPoints: 0,
   productCostRands: 5,
   productPropertyList: [{
      propertyName: 'NedbankUnitTrustAccountNumber',
      propertyValue: '8410803'
   }, {
      propertyName: 'NedbankUnitTrustAccountName',
      propertyValue: 'Private Wealth Equity Fund A'
   }]
};

describe('UnitTrustWidgetComponent', () => {
   let component: UnitTrustWidgetComponent,
      componentFixture: ComponentFixture<UnitTrustWidgetComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [
            UnitTrustWidgetComponent,
            AmountTransformPipe,
         ],
         imports: [FormsModule, CommonModule],
         schemas: [CUSTOM_ELEMENTS_SCHEMA]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      componentFixture = TestBed.createComponent(UnitTrustWidgetComponent);
      component = componentFixture.componentInstance;
      component.account = account;
      componentFixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should reset component values on reset call', () => {
      component.totalRandValue = 500;
      component.account.productCostRands = 500;
      component.totalAmountConsumed = 500;
      component.amountValue = '100';
      component.accountChecked = true;

      component.resetComponent();

      expect(component.totalAmountConsumed).toBe(500);
      expect(component.account.productCostRands).toBe(0);
      expect(component.isMultipleOfHundred).toBe(true);
      expect(component.isValidCost).toBe(true);
      expect(component.accountChecked).toBe(false);
   });

   it('should set isMultipleOfHundred and accountChecked to false if entered amount is not multiple of hundred', () => {
      spyOn(component.OnUpdateUnitTrust, 'emit');

      component.amountValue = '501';

      expect(component.account.productCostRands).toBe(501);
      expect(component.isMultipleOfHundred).toBe(false);
      expect(component.accountChecked).toBe(false);
      expect(component.OnUpdateUnitTrust.emit).toHaveBeenCalledWith(account);
   });

   it('should set isValidCost to false if amount is greater than left amount', () => {
      component.totalRandValue = 500;
      component.totalAmountConsumed = 600;
      component.account.productCostRands = 0;

      spyOn(component.OnUpdateUnitTrust, 'emit');
      component.amountValue = '400';

      expect(component.account.productCostRands).toBe(400);
      expect(component.isValidCost).toBe(false);
      expect(component.OnUpdateUnitTrust.emit).toHaveBeenCalledWith(account);
   });

   it('should set accountChecked to true if amount is multiple of hundred and less than left amount', () => {
      component.totalRandValue = 500;
      component.totalAmountConsumed = 400;

      expect(component.isValidCost).toBe(true);
      expect(component.isMultipleOfHundred).toBe(true);
      expect(component.accountChecked).toBe(true);
   });

   it('should call resetComponent if isMultipleOfHundredNotViolated is set to false', () => {
      component.amountValue = '1';
      spyOn(component, 'resetComponent');
      component.closeAmountField();

      expect(component.resetComponent).toHaveBeenCalled();
   });

   it('should call resetComponent if isValidCost is set to false', () => {
      component.totalRandValue = 100;
      component.totalAmountConsumed = 200;
      spyOn(component, 'resetComponent');
      component.closeAmountField();

      expect(component.resetComponent).toHaveBeenCalled();
   });

   it('should call resetComponent if entered amount is zero', () => {
      component.totalRandValue = 500;
      component.totalAmountConsumed = 400;
      component.amountValue = '0';
      componentFixture.detectChanges();
      spyOn(component, 'resetComponent');
      component.closeAmountField();

      expect(component.resetComponent).toHaveBeenCalled();
   });

   it('should calculate left amount and return the same', () => {
      component.totalRandValue = 500;
      component.totalAmountConsumed = 300;
      component.isSingleCellMode = true;
      component.ngOnInit();
      componentFixture.detectChanges();

      const leftAmountText = componentFixture.debugElement.query(By.css('.hint')).nativeElement;
      expect(leftAmountText.innerHTML).toBe('R200.00 left');

      component.totalAmountConsumed = 600;
      componentFixture.detectChanges();
      expect(leftAmountText.innerHTML).toBe('R0.00 left');
   });

   it('should close input field and reset if user click on checkbox', () => {
      const checkbox = componentFixture.debugElement.query(By.css('.checkbox')).nativeElement;
      spyOn(component, 'resetComponent');
      checkbox.click();
      expect(component.isAmountFieldOpen).toBeTruthy();
      checkbox.click();
      expect(component.isAmountFieldOpen).toBeFalsy();
      expect(component.resetComponent).toHaveBeenCalled();
   });
});
