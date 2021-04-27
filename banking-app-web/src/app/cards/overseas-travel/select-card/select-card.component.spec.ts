import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { SelectCardComponent } from './select-card.component';
import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { OverseaTravelService } from '../overseas-travel.service';
import { CardService } from '../../../cards/card.service';
import { IStepper } from '../../../shared/components/stepper-work-flow/stepper-work-flow.models';
import {
   IPlasticCard, IOverseasTravelDetails, IContactPerson,
   ICheckboxValuesOtn, ICardsSelected
} from '../../../core/services/models';
import { CardMaskPipe } from './../../../shared/pipes/card-mask.pipe';
import { AmountTransformPipe } from './../../../shared/pipes/amount-transform.pipe';
import { Constants } from '../../../core/utils/constants';
import { assertModuleFactoryCaching } from '../../../test-util';


const mockCards: IPlasticCard[] = [{
   plasticId: 3,
   plasticNumber: '123456 0000 7890',
   plasticStatus: 'Blocked',
   dcIndicator: 'D',
   plasticCustomerRelationshipCode: '',
   plasticStockCode: '',
   plasticCurrentStatusReasonCode: '',
   plasticBranchNumber: '1',
   nameLine: 'Master',
   expiryDate: '2020-11-12 12:00:00 AM',
   issueDate: '',
   plasticDescription: '',
   allowBlock: false,
   allowReplace: false,
   linkedAccountNumber: '123',
   cardAccountNumber: '999',
   ItemAccountId: '',
   isCardFreeze: false,
   plasticStatusCode: 'AAA'
},
{
   plasticId: 2,
   plasticNumber: '123456 0000 7890',
   plasticStatus: 'Blocked',
   dcIndicator: 'D',
   plasticCustomerRelationshipCode: '',
   plasticStockCode: '',
   plasticCurrentStatusReasonCode: '',
   plasticBranchNumber: '1',
   nameLine: 'Master',
   expiryDate: '2020-11-12 12:00:00 AM',
   issueDate: '',
   plasticDescription: '',
   allowBlock: false,
   allowReplace: false,
   linkedAccountNumber: '123',
   cardAccountNumber: '999',
   ItemAccountId: '',
   isCardFreeze: false,
   plasticStatusCode: 'AAA'
},
{
   plasticId: 1,
   plasticNumber: '123456 0000 7890',
   plasticStatus: 'Blocked',
   dcIndicator: 'D',
   plasticCustomerRelationshipCode: '',
   plasticStockCode: '',
   plasticCurrentStatusReasonCode: '',
   plasticBranchNumber: '1',
   nameLine: 'Master',
   expiryDate: '2020-11-12 12:00:00 AM',
   issueDate: '',
   plasticDescription: '',
   allowBlock: false,
   allowReplace: false,
   linkedAccountNumber: '123',
   cardAccountNumber: '999',
   ItemAccountId: '',
   isCardFreeze: false,
   plasticStatusCode: 'AAA'
}];
const mockCardsWhenStepperValid = [{
   plasticId: 2,
   plasticNumber: '123456 0000 7890',
   plasticStatus: 'Blocked',
   dcIndicator: 'D',
   plasticCustomerRelationshipCode: '',
   plasticStockCode: '',
   plasticCurrentStatusReasonCode: '',
   plasticBranchNumber: '1',
   nameLine: 'Master',
   expiryDate: '2020-11-12 12:00:00 AM',
   issueDate: '',
   plasticDescription: '',
   allowBlock: false,
   allowReplace: false,
   linkedAccountNumber: '123',
   cardAccountNumber: '999',
   ItemAccountId: '',
   isCardFreeze: false,
   plasticStatusCode: 'AAA'
},
{
   plasticId: 1,
   plasticNumber: '123456 0000 7890',
   plasticStatus: 'Blocked',
   dcIndicator: 'D',
   plasticCustomerRelationshipCode: '',
   plasticStockCode: '',
   plasticCurrentStatusReasonCode: '',
   plasticBranchNumber: '1',
   nameLine: 'Master',
   expiryDate: '2020-11-12 12:00:00 AM',
   issueDate: '',
   plasticDescription: '',
   allowBlock: false,
   allowReplace: false,
   linkedAccountNumber: '123',
   cardAccountNumber: '999',
   ItemAccountId: '',
   isCardFreeze: false,
   plasticStatusCode: 'AAA'

}];
const mockSelectedArray: ICardsSelected[] = [
   {
      isChecked: true,
      plasticId: '1'
   },
   {
      isChecked: true,
      plasticId: '2'
   }
];
const mockOverseasContactPerson: IContactPerson = {
   name: 'abinaya',
   number: '+2767876769'
};
const mockLocalContactPerson: IContactPerson = {
   name: 'abinaya',
   number: '+2767876769'
};
const mockOverseasTravelDetails: IOverseasTravelDetails = {
   fromDate: '2018-08-08',
   toDate: '2018-08-08',
   plasticId: ['1', '2'],
   countries: ['Peru', 'Canada'],
   primaryNumber: '+27757576768',
   alteranteNumber: '+27757576768',
   email: 'abinaya@nihilent.com',
   contactNumber: '+27757576768',
   overseasContactPerson: mockOverseasContactPerson,
   localContactPerson: mockLocalContactPerson
};

const checkBoxValue: ICheckboxValuesOtn = {
   isChecked: false,
   accounts: mockCards[0]
};
const checkBoxValueArray: ICheckboxValuesOtn[] = [{
   isChecked: true,
   accounts: mockCards[0]
},
{
   isChecked: true,
   accounts: mockCards[1]
}];

const mockPlasticId = 1;
const overseaTravelServiceStub = {
   setOverseasTravelDetails: jasmine.createSpy('setOverseasTravelDetails'),
   setCardDetails: jasmine.createSpy('setCardDetails'),
   setPlasticCards: jasmine.createSpy('setPlasticCards'),
   getPlasticCards: jasmine.createSpy('getPlasticCards').and.returnValue(mockCards),
   getPlasticId: jasmine.createSpy('getPlasticId').and.returnValue(mockPlasticId),
   getOverseasTravelDetails: jasmine.createSpy('getOverseasTravelDetails').and.returnValue(mockOverseasTravelDetails)
};
const cardServiceStub = {
   getPlasticCards: jasmine.createSpy('getPlasticCards').and.returnValue(Observable.of(mockCards))
};
const navigationSteps = Constants.overseasTravel.steps;

const mockWorkflowSteps: IStepper[] = [{ step: navigationSteps[0], valid: false, isValueChanged: false },
{ step: navigationSteps[1], valid: false, isValueChanged: false },
{ step: navigationSteps[2], valid: false, isValueChanged: false },
{ step: navigationSteps[3], valid: false, isValueChanged: false },
{ step: navigationSteps[4], valid: false, isValueChanged: false }];

describe('SelectCardComponent', () => {
   let component: SelectCardComponent;
   let fixture: ComponentFixture<SelectCardComponent>;
   let workflowService: WorkflowService;
   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [SelectCardComponent, CardMaskPipe, AmountTransformPipe],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [WorkflowService,
            { provide: ActivatedRoute, useValue: { params: Observable.of({ plasticId: '3' }) } },
            { provide: OverseaTravelService, useValue: overseaTravelServiceStub },
            { provide: CardService, useValue: cardServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(inject([WorkflowService], (service: WorkflowService) => {
      fixture = TestBed.createComponent(SelectCardComponent);
      component = fixture.componentInstance;
      component.overseasTravelDetails = mockOverseasTravelDetails;
      component.overseasTravelDetails.plasticId = ['1', '2', '3'];
      component.plasticCards = mockCards;
      workflowService = service;
      workflowService.workflow = mockWorkflowSteps;
      fixture.detectChanges();
   }));

   it('should be created', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
   });
   it('should call on Checkbox Clicked method and make isChecked into true', () => {
      component.onCheckboxClicked(checkBoxValue);
      expect(component.activeCard[0].isChecked).toBe(true);
   });
   it('should call on Checkbox Clicked method and make isChecked into false', () => {
      checkBoxValue.isChecked = true;
      component.overseasTravelDetails.plasticId = ['1', '3'];
      component.selectedArray = mockSelectedArray;
      component.onCheckboxClicked(checkBoxValue);
      expect(component.activeCard[0].isChecked).toBe(true);
   });
   it('should call on next click method', () => {
      component.onNextClick();
      expect(component.workflowSteps[0]).toBeDefined();
   });

   it('should call getPlasticCards and set selected cards into selectedArray', () => {
      component.workflowSteps[0].valid = true;
      component.overseasTravelDetails = mockOverseasTravelDetails;
      component.overseasTravelDetails.plasticId = ['1', '2'];
      component.plasticCards = mockCards;
      component.selectedArrayObj = {} as ICardsSelected;
      component.selectedArray = mockSelectedArray;
      component.ngOnInit();
      expect(component.workflowSteps[0].valid).toBe(true);

   });

   it('should make isChecked false and push to active card array  when card id not equal to plasticId', () => {
      component.plasticId = 5;
      component.plasticCards = mockCards;
      component.ngOnInit();
   });

   it('should modify all selected values when stepper is valid', () => {
      component.workflowSteps[0].valid = true;
      component.overseasTravelDetails = mockOverseasTravelDetails;
      component.card = mockCardsWhenStepperValid;
      component.onCheckboxClicked(checkBoxValueArray[1]);
      expect(component.overseasTravelDetails.plasticId).toBeDefined();
   });
});
