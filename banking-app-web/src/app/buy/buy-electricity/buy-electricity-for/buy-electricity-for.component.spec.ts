import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { assertModuleFactoryCaching } from './../../../test-util';
import { SharedModule } from './../../../shared/shared.module';
import { BuyElectricityForComponent } from './buy-electricity-for.component';
import { BuyElectricityService } from '../buy-electricity.service';
import { IStepInfo } from '../../../shared/components/work-flow/work-flow.models';
import { Constants } from '../../../core/utils/constants';
import { CommonUtility } from '../../../core/utils/common';


const tshwanMeter = {
   prepaids: [{
      startDate: '2017-10-23T14:50:15.9678853+02:00',
      nextTransDate: '2017-10-23T00:00:00',
      fromAccount: {
         accountName: 'TRANS 02',
         accountNumber: '1001004345',
         accountType: 'CA'
      },
      destinationNumber: '01050020003',
      serviceProvider: 'BLT',
      productCode: 'PEL',
      amount: 100,
      isVoucherAmount: false,
      electricityAmountInArrears: 20,
      electricityMeterDetails: {
         Municipality: 'Tshwan',
         CustomerName: 'PIETERS VAN DER WALT',
         CustomerAddress: '00071/1, PRETORIA GARDENS'
      }
   }]
};

const tshwanMeterWithoutArrears = {
   prepaids: [{
      startDate: '2017-10-23T14:50:15.9678853+02:00',
      nextTransDate: '2017-10-23T00:00:00',
      fromAccount: {
         accountName: 'TRANS 02',
         accountNumber: '1001004345',
         accountType: 'CA'
      },
      destinationNumber: '01050020003',
      serviceProvider: 'BLT',
      productCode: 'PEL',
      amount: 100,
      isVoucherAmount: false,
      electricityMeterDetails: {
         Municipality: 'Tshwan',
         CustomerName: 'PIETERS VAN DER WALT',
         CustomerAddress: '00071/1, PRETORIA GARDENS'
      }
   }]
};

const nonTshwanMeter = {
   prepaids: [{
      startDate: '2017-10-23T14:50:15.9678853+02:00',
      nextTransDate: '2017-10-23T00:00:00',
      fromAccount: {
         accountName: 'TRANS 02',
         accountNumber: '1001004345',
         accountType: 'CA'
      },
      destinationNumber: '01050020003',
      serviceProvider: 'BLT',
      productCode: 'PEL',
      amount: 100,
      isVoucherAmount: false,
      electricityMeterDetails: {
         Municipality: 'nonTshwan',
         CustomerName: 'PIETERS VAN DER WALT',
         CustomerAddress: '00071/1, PRETORIA GARDENS'
      }
   }
   ]
};


const buyElectricityServiceStub = {
   electricityWorkflowSteps: {
      buyTo: {
         isDirty: false
      },
      buyFor: {
         isDirty: false
      }
   },
   getBuyElectricityForVm: jasmine.createSpy('getBuyElectricityToVm').and.returnValue({}),
   saveBuyElectricityForInfo: jasmine.createSpy('saveBuyElectricityForInfo'),
   getBuyElectricityAmountVm: jasmine.createSpy('getBuyElectricityAmountVm').and.returnValue({}),
   getElectricityBillDetails: jasmine.createSpy('getElectricityBillDetails').and.returnValue(Observable.of(tshwanMeter)),
   saveBuyElectricityAmountInfo: jasmine.createSpy('saveBuyElectricityAmountInfo'),
   getBuyElectricityToVm: jasmine.createSpy('getBuyElectricityToVm').and.returnValue({})
};

describe('BuyElectricityForComponent', () => {
   let component: BuyElectricityForComponent;
   let fixture: ComponentFixture<BuyElectricityForComponent>;

   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [BuyElectricityForComponent],
         imports: [FormsModule],
         providers: [{ provide: BuyElectricityService, useValue: buyElectricityServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(BuyElectricityForComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should have default notification as NONE', () => {
      const noneNotification = component.notifications.find(m => m.value === Constants.notificationTypes.none);
      expect(component.vm.notificationType).toBe(noneNotification.value);
   });

   it('should change notification successfully', () => {
      const SMSNotification = component.notifications.find(m => m.value === Constants.notificationTypes.SMS);
      component.onNotificationChange(SMSNotification);
      expect(component.vm.notificationType).toBe(SMSNotification.value);
   });

   // when all values are valid
   it('form should be validated with valid Email values ', () => {
      component.vm = {
         yourReference: 'test value',
         notificationType: Constants.notificationTypes.email,
         notificationInput: 'test@mail.com'
      };
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.validate();
         component.isComponentValid.subscribe((data) => {
            expect(data).toBeTruthy();
         });
      });
   });

   // when all values are valid
   it('form should be invalid with invalid Email values ', () => {
      component.vm = {
         yourReference: 'test value',
         notificationType: Constants.notificationTypes.email,
         notificationInput: 'test.mail.com'
      };
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.validate();
         component.isComponentValid.subscribe((data) => {
            expect(data).toBeFalsy();
         });
      });
   });

   // when all values are valid
   it('form should be invalid with Empty Email value ', () => {
      component.vm = {
         yourReference: 'test value',
         notificationType: Constants.notificationTypes.email,
         notificationInput: ''
      };
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.validate();
         component.isComponentValid.subscribe((data) => {
            expect(data).toBeFalsy();
         });
      });
   });

   // when all values are valid
   it('form should be validated with valid SMS number values ', () => {
      component.vm = {
         yourReference: 'test value',
         notificationType: Constants.notificationTypes.SMS,
         notificationInput: '9898989898'
      };
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.validate();
         component.isComponentValid.subscribe((data) => {
            expect(data).toBeTruthy();
         });
      });
   });

   // when SMS number is not valid
   it('form should be validated with invalid SMS number values ', () => {
      component.vm = {
         yourReference: 'test value',
         notificationType: Constants.notificationTypes.SMS,
         notificationInput: '876'
      };
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.validate();
         component.isComponentValid.subscribe((data) => {
            expect(data).toBeFalsy();
         });
      });
   });

   // when all values are valid
   it('form should be validated with valid Fax number values ', () => {
      component.vm = {
         yourReference: 'test value',
         notificationType: Constants.notificationTypes.Fax,
         notificationInput: '9898989898'
      };
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.validate();
         component.isComponentValid.subscribe((data) => {
            expect(data).toBeTruthy();
         });
      });
   });


   // when all values are valid
   it('form should be validated with valid None notification ', () => {
      component.vm = {
         yourReference: 'test value',
         notificationType: Constants.notificationTypes.none,
         notificationInput: ''
      };
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.validate();
         component.isComponentValid.subscribe((data) => {
            expect(data).toBeTruthy();
         });
      });
   });


   it('should contain next handler', () => {
      expect(component.nextClick).toBeDefined();
   });

   it('should call next handler', () => {
      const currentStep = 1;
      expect(component.nextClick(currentStep)).toBeUndefined();
   });


   it('should contain step handler', () => {
      expect(component.stepClick).toBeDefined();
   });

   it('should call step handler', () => {
      const stepInfo: IStepInfo = {
         activeStep: 3,
         stepClicked: 2
      };
      expect(component.stepClick(stepInfo)).toBeUndefined();
   });

   it('should allow to change mobile/fax number', () => {
      component.vm.yourReference = 'Test your reference';
      component.vm.notificationInput = '1234567891';
      fixture.detectChanges();

      component.vm.notificationInput = '1234567890';
      component.onMobileNumberChange(component.vm.notificationInput);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.validate();
         component.isComponentValid.subscribe((data) => {
            expect(data).toBeTruthy();
         });
      });
   });
   it('should check if the form is dirty', () => {
      component.validate();
      expect(component.buyElectricityForForm.dirty).toBe(false);
   });

   it('should check if flad is false', () => {
      component.enableNext = false;
      component.validate();
      expect(component.buyElectricityForForm.dirty).toBe(false);
   });
   // when SMS number is not valid
   it('form should be validated with invalid Fax number values ', () => {
      component.vm = {
         yourReference: 'test value',
         notificationType: Constants.notificationTypes.Fax,
         notificationInput: '876'
      };
      fixture.detectChanges();
      component.validate();
      component.isComponentValid.subscribe((data) => {
         expect(data).toBeFalsy();
      });
   });
});

const buyElectricityServiceStub2 = {
   electricityWorkflowSteps: {
      buyTo: {
         isDirty: false
      },
      buyFor: {
         isDirty: false
      }
   },
   getBuyElectricityForVm: jasmine.createSpy('getBuyElectricityToVm').and.returnValue({}),
   saveBuyElectricityForInfo: jasmine.createSpy('saveBuyElectricityForInfo'),
   getBuyElectricityAmountVm: jasmine.createSpy('getBuyElectricityAmountVm').and.returnValue({}),
   getElectricityBillDetails: jasmine.createSpy('getElectricityBillDetails').and.returnValue(Observable.of(nonTshwanMeter)),
   saveBuyElectricityAmountInfo: jasmine.createSpy('saveBuyElectricityAmountInfo'),
   getBuyElectricityToVm: jasmine.createSpy('getBuyElectricityToVm').and.returnValue({})
};
describe('BuyElectricityForComponent', () => {
   let component: BuyElectricityForComponent;
   let fixture: ComponentFixture<BuyElectricityForComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [BuyElectricityForComponent],
         imports: [FormsModule],
         providers: [{ provide: BuyElectricityService, useValue: buyElectricityServiceStub2 }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(BuyElectricityForComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('form should return undefined for electricityAmountInArrears ', () => {
      expect(component.amountVm.electricityAmountInArrears).toBeUndefined();
   });
});




const getElectricityBillDetailsBehaviour = new BehaviorSubject(tshwanMeterWithoutArrears);
const buyElectricityServiceStub4 = {
   electricityWorkflowSteps: {
      buyTo: {
         isDirty: false
      },
      buyFor: {
         isDirty: false
      }
   },
   getBuyElectricityForVm: jasmine.createSpy('getBuyElectricityToVm').and.returnValue({
      lastTshwanValidateNo: '01050020003',
      lastTshwanValidateAmount: ''
   }),
   saveBuyElectricityForInfo: jasmine.createSpy('saveBuyElectricityForInfo'),
   getBuyElectricityAmountVm: jasmine.createSpy('getBuyElectricityAmountVm').and.returnValue({ amount: '11' }),
   getElectricityBillDetails: jasmine.createSpy('getElectricityBillDetails').and.returnValue(getElectricityBillDetailsBehaviour),
   saveBuyElectricityAmountInfo: jasmine.createSpy('saveBuyElectricityAmountInfo'),
   getBuyElectricityToVm: jasmine.createSpy('getBuyElectricityToVm').and.returnValue({ meterNumber: '01050020003' })
};
describe('BuyElectricityForComponent', () => {
   let component: BuyElectricityForComponent;
   let fixture: ComponentFixture<BuyElectricityForComponent>;
   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [BuyElectricityForComponent],
         imports: [FormsModule],
         providers: [{ provide: BuyElectricityService, useValue: buyElectricityServiceStub4 }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(BuyElectricityForComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('form should return undefined for electricityAmountInArrears ', () => {
      expect(component.amountVm.electricityAmountInArrears).toBeUndefined();
   });

   it('should get electricityAmountInArrears ', () => {
      getElectricityBillDetailsBehaviour.next(tshwanMeter);
      expect(component.amountVm.electricityAmountInArrears).toBe(tshwanMeter.prepaids[0].electricityAmountInArrears);
   });

   it('should not get electricityAmountInArrears when not tshwan', () => {
      getElectricityBillDetailsBehaviour.next(nonTshwanMeter);
      expect(component.enableNext).toBeTruthy();
   });

   it('should not get electricityAmountInArrears when not tshwan', () => {
      const subscribe = component.isComponentValid.subscribe(val => {
         expect(val).toBeTruthy();
      });
      getElectricityBillDetailsBehaviour.error(new Error());

   });
});






