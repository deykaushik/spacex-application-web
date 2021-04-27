import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { OpenAccountService } from '../open-account.service';
import { RightOptionsComponent } from './right-options.component';
import { assertModuleFactoryCaching } from './../../test-util';
import { IApiResponse, ICountries } from '../../core/services/models';
import { IRadioButtonItem, IClientDetails, IDeposit } from '../../core/services/models';
import { AmountTransformPipe } from '../../shared/pipes/amount-transform.pipe';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';

const productDetails: ICountries = {
   name: '32 day notice'
};

const mockProduct: IApiResponse[] = [{
   data: productDetails
}];

const mockAllProduct: IApiResponse = {
   data: productDetails
};

const mockRedioBtn: IRadioButtonItem = {
   label: 'Weekly',
   value: '7',
};

const mockRedioBtnForDeposit: IRadioButtonItem = {
   label: 'Monthly',
   value: 'Yes',
};

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

const accountServiceStub = {
   setAmountForOpenNewAccount: jasmine.createSpy('setAmountForOpenNewAccount').and.returnValue(1000),
   setProductDetails: jasmine.createSpy('setProductDetails'),
   setMinimumEntryAmount: jasmine.createSpy('setMinimumEntryAmount').and.returnValue(500),
   getAllProducts: jasmine.createSpy('getAllProducts').and.returnValue(Observable.of(mockAllProduct)),
   getEntryAmount: jasmine.createSpy('getEntryAmount').and.returnValue(Observable.of(mockProduct)),
   getAllAccountTypeFilteredProduct: jasmine.createSpy('getAllAccountTypeFilteredProduct').and.returnValue(Observable.of(mockProduct)),
   getAmountForOpenNewAccount: jasmine.createSpy('getAmountForOpenNewAccount')
};

const clientDetailsObserver: BehaviorSubject<IClientDetails> = new BehaviorSubject<IClientDetails>(getClientDetails());

describe('RightOptionsComponent', () => {
   let component: RightOptionsComponent;
   let fixture: ComponentFixture<RightOptionsComponent>;
   let router;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule, RouterTestingModule],
         declarations: [RightOptionsComponent, AmountTransformPipe],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [Renderer2, { provide: OpenAccountService, useValue: accountServiceStub },
            {
               provide: ClientProfileDetailsService, useValue: {
                  clientDetailsObserver: clientDetailsObserver
               }
            }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(RightOptionsComponent);
      component = fixture.componentInstance;
      component.showProducts = true;
      component.accessMoneyFlag = true;
      router = TestBed.get(Router);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('amount is  valid', () => {
      component.minimumEntryAmount = 500;
      component.onDepositAmountChange(700);
      expect(component.isAmountValid).toBe(true);
   });

   it('amount is not valid', () => {
      component.minimumEntryAmount = 700;
      component.onDepositAmountChange(500);
      expect(component.isAmountValid).toBe(false);
   });

   it('set flags to given option', () => {
      component.setFlag(false, true, false);
      expect(component.keepDepositFlag).toBe(true);
   });

   it('should be change to depositFlag', () => {
      component.depositFlag = false;
      component.changeFlag('depositFlag');
      expect(component.depositFlag).toBe(true);
   });
   it('should be change flag', () => {
      component.keepDepositFlag = false;
      component.changeFlag('keepDepositFlag');
      expect(component.keepDepositFlag).toBe(true);
   });
   it('should be change flag', () => {
      component.accessMoneyFlag = false;
      component.changeFlag('accessMoneyFlag');
      expect(component.accessMoneyFlag).toBe(true);
   });

   it('selected product option should be deposit', () => {
      component.amount = 500;
      component.goToKeepDeposit('depositFlag');
      expect(component.isDeposit).toBe(true);
   });

   it('should be return all products which have money access', () => {
      component.goToAccessMoney('accessMoneyFlag');
      expect(component.isAccessMoney).toBe(true);
   });

   it('should be call gotoNoticePeriod function', () => {
      const data = [{
         realTimeRate: 5
      }];
      accountServiceStub.getAllAccountTypeFilteredProduct.and.returnValue(Observable.of(data));
      component.gotoNoticePeriod();
      expect(component.isNoticePeriod).toBe(true);
   });

   it('should be call gotoNoticePeriod function', () => {
      accountServiceStub.getAllAccountTypeFilteredProduct.and.returnValue(Observable.of(mockAllProduct));
      component.gotoNoticePeriod();
      expect(component.noProducts).toBe(true);
   });

   it('should be open account when we click on open account button', () => {
      component.openAccount(mockProduct);
      expect(component.isStepper).toBe(true);
   });

   it('should be call close overlay function', () => {
      const spy = spyOn(router, 'navigateByUrl');
      component.closeOverlay(true);
      const url = spy.calls.first().args[0];
      expect(url).toBe('/dashboard');
   });

   it('should be call seeAllOtherProducts function', () => {
      component.seeAllOtherProducts();
      expect(component.showAllProduct).toBe(true);
   });

   it('show all product should be false when we click on see less method', () => {
      const filterProducts: IDeposit[] = [{
         name: 'Just Invest'
      }];
      component.filteredProducts = filterProducts[0];
      component.seeLessProduct();
      expect(component.showAllProduct).toBe(false);
   });

   it('should be call stepperBack function', () => {
      component.stepperBack(true);
      expect(component.isStepper).toBe(false);
   });

   it('should be call seeAllProducts function', () => {
      component.amount = 400;
      component.amountLimit = true;
      component.minimumEntryAmount = 200;
      component.seeAllProducts();
      expect(component.showNoticePeriodContent).toBe(true);
   });

   it('should be call selectProduct function', () => {
      component.moneyPeriodType = '24h';
      component.depFlagType = 'Yes';
      component.gotoNoticePeriod();
      expect(component.selectedOption).toBe('Option1');
   });

   it('should be call selectProduct function', () => {
      component.moneyPeriodType = '32d';
      component.depFlagType = 'Yes';
      component.gotoNoticePeriod();
      expect(component.selectedOption).toBe('Option2');
   });

   it('should be call selectProduct function', () => {
      component.moneyPeriodType = 'No';
      component.depFlagType = 'Yes';
      component.gotoNoticePeriod();
      expect(component.selectedOption).toBe('Option3');
   });

   it('should be call selectProduct function', () => {
      component.moneyPeriodType = '';
      component.depFlagType = 'Yes';
      component.gotoNoticePeriod();
      expect(component.showNoticePeriodContent).toBe(true);
   });

   it('should be call selectProduct function', () => {
      const selectedProd = 1;
      component.selectProduct(selectedProd);
      expect(component.selectedProduct).toBe(1);
   });

   it('should be change deposit selection', () => {
      component.onDepFlagChange(mockRedioBtnForDeposit);
      expect(component.depFlagType).toBe('Yes');
   });

   it('should be change deposit selection', () => {
      component.onMoneyPeriodChange(mockRedioBtn);
      expect(component.moneyPeriodType).toBe('7');
   });

   it('should call initial deposit function', () => {
      component.keepDepositFlag = true;
      component.accessMoneyFlag = true;
      component.isInitialDeposit();
      expect(component.depositFlag).toBe(false);
   });

   it('should call access money function', () => {
      component.accessMoneyFlag = true;
      component.accessMoney();
      expect(component.keepDepositFlag).toBe(true);
   });

   it('should display all remaining products', () => {
      component.accessMoneyFlag = true;
      component.seeAllOtherProducts();
      expect(component.showAllProduct).toBe(true);
   });

   it('should call right options method', () => {
      component.showRightOptions();
      expect(component.showNoticePeriodContent).toBe(false);
      expect(component.headerOptions).toBe(false);
   });

   it('should call product list method', () => {
      const data = [{
         realTimeRate: 5
      }];
      const response = component.getProductList(data);
      expect(response[0].realTimeRate).toBe('5.00');
   });

   it('should call add empty products method', () => {
      component.productList = [];
      const products: ICountries[] = [{
         name: 'Just Invest'
      },
      {
         name: 'prime select'
      }];
      component.addEmptyProducts(products);
      expect(component.productList[0].name).toBe('');
   });
});
