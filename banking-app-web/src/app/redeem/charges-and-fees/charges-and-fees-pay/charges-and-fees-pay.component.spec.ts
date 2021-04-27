import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { IStepInfo } from './../../../shared/components/work-flow/work-flow.models';
import { assertModuleFactoryCaching } from './../../../test-util';
import { ChargesAndFeesService } from '../charges-and-fees.service';
import { Constants } from '../../../core/utils/constants';
import { ClientProfileDetailsService } from '../../../core/services/client-profile-details.service';
import { ChargesAndFeesPayComponent } from './charges-and-fees-pay.component';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
const clientDetailsStub = {
   getDefaultAccount: jasmine.createSpy('getDefaultAccount')
   .and.returnValue({ accountNumber: 601710000004,
   nickname: 'Greenbacks',
   accountType: 'Rewards',
   availableBalance: 2000,
   currency: 'GB'}),
};

const ChargesAndFeesServiceStub = {
      savePayInfo: jasmine.createSpy('savePayInfo'),
      getDomicileBranchNumber: jasmine.createSpy('getDomicileBranchNumber')
      .and.returnValue(Observable.create(observer => {
      observer.next('986');
      observer.complete();
      })),
   getPayVm: jasmine.createSpy('getPayVm')
      .and.returnValue({
         fromAccount: {
            nickname: 'Test'
         },
         toAccounts: [{
            productPropertyList: [{
               propertyName: 'name',
               propertyValue: 'value'
            }]
         }]
      }),
      rewardsAccountDataObserver: new BehaviorSubject([{
            accountNumber: 601710000004,
            nickname: 'Greenbacks',
            accountType: 'Rewards',
            availableBalance: 2000,
            currency: 'GB'
         }]),
      bankAccountDataObserver: new BehaviorSubject([{
            accountNumber: 601710000004,
            nickname: 'Greenbacks',
            accountType: 'Rewards',
            availableBalance: 2000,
            currency: 'GB'
         }]),
      cardAccountDataObserver: new BehaviorSubject([{
            accountNumber: 601710000004,
            nickname: 'Greenbacks',
            accountType: 'Rewards',
            availableBalance: 2000,
            currency: 'GB'
         }]),
      chargesAndFeesObserver: new BehaviorSubject(
            {
            'programmeId': 'GB',
            'productCategories': [
                  {
                  'productCategoryCode': 'BankFees',
                  'productCategoryDescription': 'Bank Charges',
                  'products': [
                  {
                        'productId': 1,
                        'productName': 'Current Account /Savings Account Charges',
                        'productCostPoints': 1500,
                        'ProductCostRands': 50,
                        'domicileBranchNumber' : '987'
                  },
                  {
                        'productId': 2,
                        'productName': 'Current Account /Savings Account Charges',
                        'productCostPoints': 3000,
                        'productCostRands': 100,
                        'domicileBranchNumber' : '987'
                  }
                  ]
                  }
            ]}
      )
   };
describe('ChargesAndFeesPayComponent', () => {
   let component: ChargesAndFeesPayComponent;
   let fixture: ComponentFixture<ChargesAndFeesPayComponent>;
   let service: ChargesAndFeesService;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [
            ChargesAndFeesPayComponent
         ],
         imports: [FormsModule],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [
            { provide: ChargesAndFeesService, useValue: ChargesAndFeesServiceStub },
            { provide: ClientProfileDetailsService, useValue: clientDetailsStub },
         ]
      })
         .overrideComponent(ChargesAndFeesPayComponent, {
            set: {
               template: ``
            }
         })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(ChargesAndFeesPayComponent);
      component = fixture.componentInstance;
      service = TestBed.get(ChargesAndFeesService);
      fixture.detectChanges();
   });
   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should call next handler', () => {
      const currentStep = 1;
      expect(component.nextClick(currentStep)).toBeUndefined();
   });

   it('should call step handler', () => {
      const stepInfo: IStepInfo = {
         activeStep: 2,
         stepClicked: 1
      };
      expect(component.stepClick(stepInfo)).toBeUndefined();
   });
   it('should return linkageFees code if bank account does not exist', () => {
      component.bankAccounts = [];
      component.vm.productCategory = undefined;
      expect(component.getDefaultProductCategory()).toEqual('RewardsFees');
   });
   it('should update from account on fromAccount selection change', () => {
      const newVm = Object.assign({}, component.accounts[0]);
      newVm.accountNumber = '123';
      component.onAccountSelection(newVm);
      expect(component.vm.fromAccount.accountNumber).toBe('123');
   });
   it('should update from account on forAccount selection change', () => {
      const newVm = Object.assign({}, component.accounts[0]);
      newVm.accountNumber = '123';
      component.onForAccountSelection(newVm);
      expect(component.vm.forAccount.accountNumber).toBe('123');
   });
   it('should set button disabled state to false on API failure ', () => {
      service.getDomicileBranchNumber = jasmine.createSpy('getDomicileBranchNumber')
         .and.returnValue(Observable.create(observer => {
         observer.error(new Error('error'));
         observer.complete();
      }));
      spyOn(component.isComponentValid, 'emit');
      component.setDomicileBranchNumber('sss');
      expect(component.isComponentValid.emit).toHaveBeenCalled();
   });
   it('should set cost point 1500, in case of RewardsFees category', () => {
      component.chargesAndFees.productCategories[0].productCategoryCode = 'RewardsFees';
      component.setProductChargesOrFeesCost('RewardsFees', true);
      expect(component.vm.costPoints).toBe(1500);
   });
});
