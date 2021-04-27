import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA, EventEmitter } from '@angular/core';
import { TermsService } from '../../../shared/terms-and-conditions/terms.service';
import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { ReviewDetailsComponent } from './review-details.component';
import { IStepper } from '../../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { assertModuleFactoryCaching } from './../../../test-util';
import { Observable } from 'rxjs/Observable';
import {
   IRadioButtonItem, IDepositDetails, IPayoutDetails, IRecurringDetails, IDeposit,
   ITermsAndConditions, IApiResponse
} from '../../../core/services/models';
import { OpenAccountService } from '../../open-account.service';
import { AmountTransformPipe } from '../../../shared/pipes/amount-transform.pipe';

const mockProductInfo: IDeposit[] = [{
   noticeDeposit: 'A',
   name: '32-days-notice',
   realtimerate: 7
},
{
   noticeDeposit: 'N',
   name: '32-days-notice',
   realtimerate: 7
}];

const mockDepositDetails: IDepositDetails[] = [{
   investorNumber: 123456789,
   Amount: 1000,
   depositAccount: 'Just Invest',
   Months: 11,
   depositAccountType: 'SA',
   depositAccountNumber: '123456-7890'
}];

const mockInterestDetails: IPayoutDetails[] = [{
   payoutOption: 'Monthly',
   payoutDay: 8,
   payoutAccount: '23456-7869'
}];

const mockRecurringDetails: IRecurringDetails[] = [{
   Frequency: 'M',
   Day: 'Monday',
   Amount: 900,
   Account: 'CA',
   accountNumber: '1234567-87654'
}];

const mockStepper: IStepper[] = [{
   step: '2',
   valid: true,
   isValueChanged: true
},
{
   step: '3',
   valid: true,
   isValueChanged: true
}];

const frequency: IPayoutDetails[] = [{
   payoutOption: 'Monthly'
},
{
   payoutOption: 'Quarterly'
},
{
   payoutOption: 'Half-yearly'
},
{
   payoutOption: 'Yearly'
},
{
   payoutOption: 'When my investment period ends'
}];

const freq: IRecurringDetails = {
   Frequency: 'Weekly',
   Day: 'Friday',
   Amount: 123456789,
   Account: 'CA'
};

const mockTermDetails: ITermsAndConditions = {
   noticeDetails: {
      noticeContent: `pVTBbtNAEL1X6j+MgtRTSQgtlKpOqyJx4BJFhB8Yr8f20vWumd1N8Ldx4JP4BWZtxw0cIBK
      nbHZn3rx58zw/v//IHr41BnbEXju7mi3nr2ZAVrlC22o1i6F8+W72cH9+lm1JRdahW7ugFckNQDaesw0yVoxtfX9h
      wt1287gGg5L/YX1Rhbvzs3S7gULzygQGNLqyK0NlSK/pbbH5d9xyDp9r7YHpayQfoHDkwboALpc4glAT5GifIDho
      8IkAbQctdg3ZIOcCfMy/kArp/RB78eLq9m6A1Ewp0gN68CSoMYC2fSSToR0mlIqpjwJXgnFoT+X+eg4fLew07VNm
      wmzZCZj3QrUYuE9UGxflR6fm9lBEOrXIVRJo1KDBTtj7tu93KNcShw5yKh0/F9MDgVNLXM/hUVQdKbaoi4SQZCJu
      PNTEJP3ttTFSCBpnqRslNocpYCFSKir6McmQaKhSeQSQf3HXQJ3cS20b2MQk/juz/B/EmDULIJgP1NFEpjgQluwYK
      DJQAj02DEqMPGaHGMGZ4mQzLJ9K7TBoNdVJCMjE3wr7rexu0J4ERVEJVD5HzU9m+Fba9qIJXkDLINHDYO36CWpya
      E1lQrmkNBdHUY9C+RBUca9P1DShnS83NkBeO/YFlOdlj6PhkYjeJGDaA+4mSdVBqi2ZSb3KB+OsSojXJ7QhKbKhLr
      UatnVKxFUMMZGW+KrA8muO4y/RNMpXEPPhGDCd+CbKwYHl9cMwa04Vkvo/apO0Fn6iKpr/1sA2Cj1x4eFS9a5a3N7
      eXzxqWka329YA/yXRwwN/2RY07OpqDFoi9/m3I/SktxfQnWzwvy2wxLdNs8cd+/QU=`,
   }
};

const mockUpdateTerms: IApiResponse = {
   metadata: {}
};

const disputeMetadata: IApiResponse = {
   data: null,
   metadata: {
      'resultData': [
         {
            'resultDetail': [
               {
                  'operationReference': 'TRANSACTION',
                  'result': 'R00',
                  'status': 'SUCCESS',
                  'reason': 'Success'
               }
            ]
         }
      ]
   }
};

const accountServiceStub = {
   getDepositDetails: jasmine.createSpy('getDepositDetails').and.returnValue(mockDepositDetails),
   getInterestDetails: jasmine.createSpy('getInterestDetails').and.returnValue(mockInterestDetails),
   getRecurringDetails: jasmine.createSpy('getRecurringDetails').and.returnValue(mockRecurringDetails),
   getProductDetails: jasmine.createSpy('getProductDetails').and.returnValue(mockProductInfo[0]),
   setDepositDetails: jasmine.createSpy('setDepositDetails'),
   setInterestDetails: jasmine.createSpy('setInterestDetails'),
   setRecurringDetails: jasmine.createSpy('setRecurringDetails'),
   setInterestEdit: jasmine.createSpy('setInterestEdit'),
   setRecurringEdit: jasmine.createSpy('setRecurringEdit'),
   openAccount: jasmine.createSpy('openAccount').and.returnValue(Observable.of(disputeMetadata)),
   getRealTimeInterestRate: jasmine.createSpy('getRealTimeInterestRate').and.returnValue(7),
   getTermsAndConditionsForOpenNewAccount: jasmine.createSpy('getTermsAndConditionsForOpenNewAccount').and.returnValue
      (Observable.of(mockTermDetails)),
   setRealTimeInterestRate: jasmine.createSpy('setRealTimeInterestRate'),
   updateTermsAndConditionsForOpenNewAccount: jasmine.createSpy('updateTermsAndConditionsForOpenNewAccount').and.returnValue
      (Observable.of(mockUpdateTerms)),
};

const workflowServiceStub = {
   getWorkflow: jasmine.createSpy('getWorkflow').and.returnValue(mockStepper),
   setWorkflow: jasmine.createSpy('setWorkflow'),
   stepClickEmitter: new EventEmitter<string>()
};

const termsServiceStub = {
   decodeTerms: jasmine.createSpy('decodeTerms')
};

const mockAccountServiceError = Observable.create(observer => {
   observer.error(new Error('error'));
   observer.complete();
});

describe('ReviewDetailsComponent', () => {
   let component: ReviewDetailsComponent;
   let fixture: ComponentFixture<ReviewDetailsComponent>;
   let workflowService;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule, RouterTestingModule],
         declarations: [ReviewDetailsComponent, AmountTransformPipe],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [{ provide: OpenAccountService, useValue: accountServiceStub },
         { provide: WorkflowService, useValue: workflowServiceStub },
         { provide: TermsService, useValue: termsServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(inject([WorkflowService], (service: WorkflowService) => {
      fixture = TestBed.createComponent(ReviewDetailsComponent);
      component = fixture.componentInstance;
      workflowService = service;
      component.isNoticeDeposit = false;
      fixture.detectChanges();
   }));

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('noticeDeposit should be false', () => {
      accountServiceStub.getProductDetails.and.returnValue(mockProductInfo[1]);
      accountServiceStub.getRealTimeInterestRate.and.returnValue(0);
      component.ngOnInit();
      expect(component.isNoticeDeposit).toBe(false);
   });

   it('should be call openAccount function when you click on open account button', () => {
      component.isNoticeDeposit = false;
      accountServiceStub.updateTermsAndConditionsForOpenNewAccount.and.returnValue(Observable.of(disputeMetadata));
      component.openAccount();
      expect(component.isSuccessPage).toBe(true);
   });

   it('should be show error message if openAccount API fails', () => {
      component.isNoticeDeposit = true;
      accountServiceStub.openAccount.and.returnValue(mockAccountServiceError);
      component.openNewAccount();
      expect(component.showLoader).toBe(false);
   });

   it('Accept button should be disabled', () => {
      const data = {
         currentTarget: {
            checked: true
         }
      };
      component.change(data);
      expect(component.isChecked).toBe(false);
   });

   it('should be open success screen when we click on accept button', () => {
      const data = {
         currentTarget: {
            checked: false
         }
      };
      component.change(data);
      expect(component.isChecked).toBe(true);
   });

   it('should call editDetails', () => {
      component.editDetails();
      expect(component.workflowSteps[1].valid).toBe(true);
   });

   it('should call editAccountDetails', () => {
      component.editAccountDetails();
      expect(accountServiceStub.setRecurringEdit).toHaveBeenCalledWith(false);
      expect(accountServiceStub.setInterestEdit).toHaveBeenCalledWith(false);
   });

   it('should call recurringEdit', () => {
      component.recurringEdit();
      expect(accountServiceStub.setRecurringEdit).toHaveBeenCalledWith(true);
      expect(accountServiceStub.setInterestEdit).toHaveBeenCalledWith(false);
   });

   it('should call interestEdit', () => {
      component.interestEdit();
      expect(accountServiceStub.setRecurringEdit).toHaveBeenCalledWith(false);
      expect(accountServiceStub.setInterestEdit).toHaveBeenCalledWith(true);
   });

   it('should call back', () => {
      component.isRecurringShow = true;
      component.back();
      expect(accountServiceStub.setRecurringEdit).toHaveBeenCalledWith(true);
      expect(accountServiceStub.setInterestEdit).toHaveBeenCalledWith(false);
   });

   it('should call back function for interest details ', () => {
      component.isRecurringShow = false;
      component.back();
      expect(accountServiceStub.setRecurringEdit).toHaveBeenCalledWith(false);
      expect(accountServiceStub.setInterestEdit).toHaveBeenCalledWith(true);
   });

   it('frequency should be select monthly', () => {
      component.isNoticeDeposit = false;
      component.interest = frequency[0];
      component.setFrequency();
      expect(component.openAccountValues.monthlyPayment).toBe('M');
   });
   it('frequency should be select quaterly', () => {
      component.isNoticeDeposit = false;
      component.interest = frequency[1];
      component.setFrequency();
      expect(component.openAccountValues.quarter).toBe('Q');
   });
   it('frequency should be half-yearly', () => {
      component.isNoticeDeposit = false;
      component.interest = frequency[2];
      component.setFrequency();
      expect(component.openAccountValues.halfYear).toBe('H');
   });
   it('frequency should be select yearly', () => {
      component.isNoticeDeposit = false;
      component.interest = frequency[3];
      component.setFrequency();
      expect(component.openAccountValues.year).toBe('A');
   });

   it('frequency should be select end investment', () => {
      component.isNoticeDeposit = false;
      component.interest = frequency[4];
      component.setFrequency();
      expect(component.openAccountValues.endInvestment).toBe('E');
   });
   it('day should be monday', () => {
      component.recurring = freq;
      component.setDay('Monday');
      expect(component.recurring.Frequency).toBe('Weekly');
   });

   it('day should be tuesday', () => {
      component.recurring = freq;
      component.setDay('Tuesday');
      expect(component.recurring.Frequency).toBe('Weekly');
   });

   it('day should be wednesday', () => {
      component.recurring = freq;
      component.setDay('Wednesday');
      expect(component.recurring.Frequency).toBe('Weekly');
   });

   it('day should be thursday', () => {
      component.isRecurringShow = false;
      component.recurring = freq;
      component.setDay('Thursday');
      expect(component.recurring.Frequency).toBe('Weekly');
   });

   it('day should be friday', () => {
      component.isRecurringShow = false;
      component.recurring = freq;
      component.setDay('Friday');
      expect(component.recurring.Frequency).toBe('Weekly');
   });

   it('day should be saturday', () => {
      component.isRecurringShow = false;
      component.recurring = freq;
      component.setDay('Saturday');
      expect(component.recurring.Frequency).toBe('Weekly');
   });

   it('should show error message if update api returns empty data', () => {
      accountServiceStub.getTermsAndConditionsForOpenNewAccount.and.returnValue(mockAccountServiceError);
      component.updateTermsAndConditions();
      expect(component.showLoader).toBe(false);
   });

   it('should show error message if update api returns empty data', () => {
      accountServiceStub.updateTermsAndConditionsForOpenNewAccount.and.returnValue(mockAccountServiceError);
      component.updateTermsAndConditions();
      expect(component.showAlert).toBe(true);
   });

   it('should hide error message', () => {
      component.onAlertLinkSelected();
      expect(component.showAlert).toBe(false);
   });

   it('should hide loader when update terms api is failing', () => {
      accountServiceStub.updateTermsAndConditionsForOpenNewAccount.and.returnValue(Observable.of(mockUpdateTerms));
      component.updateTermsAndConditions();
      expect(component.showLoader).toBe(false);
   });

   it('should hide loader when get terms api is failing', () => {
      accountServiceStub.getTermsAndConditionsForOpenNewAccount.and.returnValue(Observable.of([]));
      component.showTermsAndConditions();
      expect(component.showLoader).toBe(false);
   });

   it('should display error message if update api returns empty data', () => {
      accountServiceStub.updateTermsAndConditionsForOpenNewAccount.and.returnValue(Observable.of([]));
      component.updateTermsAndConditions();
      expect(component.showLoader).toBe(false);
   });

   it('should hide loader when openAccount method fail', () => {
      component.isNoticeDeposit = false;
      accountServiceStub.openAccount.and.returnValue(Observable.of([]));
      component.openNewAccount();
      expect(component.showLoader).toBe(false);
   });

   it('should hide loader when openAccount method api is failing', () => {
      component.isNoticeDeposit = false;
      const result = {
            metadata : []
      };
      accountServiceStub.openAccount.and.returnValue(Observable.of(result));
      const weeklyFreq: IRecurringDetails[] = [{
            Frequency: 'Weekly',
            Day: 'Friday',
            Amount: 123456789,
            Account: 'CA'
         }];
      component.recurringDetails = weeklyFreq;
      component.openNewAccount();
      expect(component.showLoader).toBe(false);
      expect(component.frequency).toBe('W');
   });

});
