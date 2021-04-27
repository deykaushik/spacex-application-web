import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { ProfileLimitsService } from './profile-limits.service';
import { ApiService } from '../../core/services/api.service';
import { ILimitDetail, IChangedLimitDetail, IChangedLimits } from '../../core/services/models';
import { IFailureLimits } from './profile-limits.models';
import { Constants } from '../../core/utils/constants';
import { componentFactoryName } from '@angular/compiler';


const limits = ({
   data: [
      {
         limitType: 'transfer', dailyLimit: 150000, userAvailableDailyLimit: 150000, maxDailyLimit: 150000, isTempLimit: false,
         maxTmpDateRangeLimit: 30
      },
      {
         limitType: 'payment', dailyLimit: 150000, userAvailableDailyLimit: 150000, maxDailyLimit: 150000,
         isTempLimit: false, maxTmpDateRangeLimit: 30
      },
      {
         limitType: 'LOTTO', dailyLimit: 599, userAvailableDailyLimit: 599, maxDailyLimit: 1000, isTempLimit: false,
         maxTmpDateRangeLimit: 30
      },
      {
         limitType: 'sendimali', dailyLimit: 2500, userAvailableDailyLimit: 2500, maxDailyLimit: 2500, isTempLimit: false,
         'maxTmpDateRangeLimit': 30
      },
      {
         limitType: 'prepaid', dailyLimit: 3000, userAvailableDailyLimit: 3000, maxDailyLimit: 3000, isTempLimit: false,
         maxTmpDateRangeLimit: 30
      },
      {
         limitType: 'instantpayment', dailyLimit: 9600, userAvailableDailyLimit: 9600, maxDailyLimit: 10000, isTempLimit: true,
         tempLimitStart: '2017-08-17T00:00:00', tempLimitEnd: '2017-08-22T00:00:00', tempDailyLimit: 9600, tempAvailableDailyLimit: 9600,
         lastPermanentLimit: 1000, maxTmpDateRangeLimit: 30
      }]
});

const mockTransactions = {
   metadata: {
      resultData: [
         {
            transactionID: 'instantpayment',
            resultDetail: [
               {
                  operationReference: 'TRANSACTION',
                  result: 'R00',
                  status: 'SUCCESS'
               }
            ]
         }
      ]
   }
};

const _AllLimits = jasmine.createSpy('getAll').and.returnValue(Observable.of(limits));
const _updateMetadata = jasmine.createSpy('update').and.returnValue(Observable.of(mockTransactions));
const _createMetadata = jasmine.createSpy('create').and.returnValue(Observable.of(mockTransactions));

describe('ProfileLimitsService', () => {
   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [ProfileLimitsService, {
            provide: ApiService, useValue: {
               Limits: {
                  getAll: _AllLimits
               },
               IndividualLimits: {
                  update: _updateMetadata
               },
               OutOfBandOtpStatus: {
                  create: _createMetadata
               },
               PreferenceStatus: {
                  create: _createMetadata
               },
               UpdateLimits: {
                  update: _updateMetadata
               }
            }
         }]
      });
   });

   it('should be created', inject([ProfileLimitsService], (service: ProfileLimitsService) => {
      expect(service).toBeTruthy();
   }));

   it('should return limit types', inject([ProfileLimitsService], (service: ProfileLimitsService) => {
      service.getAllLimits().subscribe((response) => {
         expect(response).toBeDefined();
         expect(response[0].limitType).toBeDefined();
      });
   }));

   it('should return limit Widget Vm ', inject([ProfileLimitsService], (service: ProfileLimitsService) => {
      expect(service.getLimitsWidgetVm('transfer')).toBeDefined();
   }));
   it('should validate update metadata ', inject([ProfileLimitsService], (service: ProfileLimitsService) => {
      expect(service.isTransactionStatusValid(mockTransactions.metadata)).toBeTruthy();
   }));
   it('should update widget Permanent limit details for transfer', inject([ProfileLimitsService], (service: ProfileLimitsService) => {
      const payload = {
         newLimit: 2000,
         isTempLimit: true
      };
      const routeParams = 'transfer';
      service.updateLimit(payload, routeParams).subscribe(response => {
         expect(response).toBeDefined();
         expect(service.isTransactionStatusValid(response)).toBeTruthy();
      });
   }));
   it('should update widget Temporary limit details for transfer', inject([ProfileLimitsService], (service: ProfileLimitsService) => {
      const payload = {
         newLimit: 2000,
         isTempLimit: false,
         tempLimitEnd: '2018-01-01'
      };
      const routeParams = 'transfer';
      service.updateLimit(payload, routeParams).subscribe(response => {
         expect(response).toBeDefined();
         expect(service.isTransactionStatusValid(response)).toBeTruthy();
      });
   }));
   it('should get approve it status', inject([ProfileLimitsService], (service: ProfileLimitsService) => {
      service.getApproveItOtpStatus('ABC', '1234').subscribe(m => {
         expect(m).toBeDefined();
      });
   }));
   it('should get approve it status', inject([ProfileLimitsService], (service: ProfileLimitsService) => {
      service.updateTransactionID('1234');
      service.getApproveItStatus().subscribe(m => {
         expect(m).toBeDefined();
      });
   }));
   it('should set secure transaction id', inject([ProfileLimitsService], (service: ProfileLimitsService) => {
      service.updateTransactionID('1234');
      service.setSecureTransactionVerification('2333');
      expect(service.profileLimitDetails.secureTransaction.verificationReferenceId).toBe('2333');
   }));
   it('should set secure transaction id', inject([ProfileLimitsService], (service: ProfileLimitsService) => {
      service.updateTransactionID('1234');
      service.profileLimitDetails.secureTransaction = { verificationReferenceId: '' };
      service.setSecureTransactionVerification('2333');
      expect(service.profileLimitDetails.secureTransaction.verificationReferenceId).toBe('2333');
   }));

   it('should call bulk approve status', inject([ProfileLimitsService], (service: ProfileLimitsService) => {
      const updatedLimits: IChangedLimitDetail[] = [];
      updatedLimits.push({ limitDetail: limits.data[0], status: '' });
      updatedLimits.push({ limitDetail: limits.data[1], status: '' });
      updatedLimits.push({ limitDetail: limits.data[2], status: '' });
      updatedLimits.push({ limitDetail: limits.data[3], status: '' });
      service.updatedlimits = { limits: updatedLimits, transactionId: '' };
      service.getBulkApproveItStatus();
   }));
   it('should update bulk transactionid', inject([ProfileLimitsService], (service: ProfileLimitsService) => {
      const updatedLimits: IChangedLimitDetail[] = [];
      updatedLimits.push({ limitDetail: limits.data[0], status: '' });
      updatedLimits.push({ limitDetail: limits.data[1], status: '' });
      updatedLimits.push({ limitDetail: limits.data[2], status: '' });
      updatedLimits.push({ limitDetail: limits.data[3], status: '' });
      service.updatedlimits = { limits: updatedLimits, transactionId: '' };
      service.updateBulkTransactionID('12343');
      expect(service.updatedlimits.transactionId).toBe('12343');
   }));

   it('should update failure', inject([ProfileLimitsService], (service: ProfileLimitsService) => {
      const failed: IFailureLimits[] = [{ limittype: 'transfer', reason: '', status: 'FAILURE' }
         , { limittype: 'payment', reason: '', status: 'FAILURE' }];

      service.failedLimits = failed;
      service.notifyResponse(Constants.VariableValues.settings.updateStatus.Failure);
      expect(service.isBulkChangeSuccessful).toBeFalsy();
   }));
   it('should notify partial response', inject([ProfileLimitsService], (service: ProfileLimitsService) => {
      const failed: IFailureLimits[] = [{ limittype: 'transfer', reason: '', status: 'FAILURE' }
         , { limittype: 'payment', reason: '', status: 'FAILURE' }];

      service.failedLimits = failed;
      service.notifyResponse(Constants.VariableValues.settings.updateStatus.Partial);
      expect(service.isBulkChangeSuccessful).toBeFalsy();
   }));
   it('should notify success response', inject([ProfileLimitsService], (service: ProfileLimitsService) => {

      const failed: IFailureLimits[] = [{ limittype: 'transfer', reason: '', status: 'FAILURE' }
         , { limittype: 'payment', reason: '', status: 'FAILURE' }];
      service.failedLimits = failed;
      service.notifyResponse(Constants.VariableValues.settings.updateStatus.Success);
      expect(service.isBulkChangeSuccessful).toBeTruthy();
   }));
   it('should notify success response', inject([ProfileLimitsService], (service: ProfileLimitsService) => {

      const updatedLimits: IChangedLimitDetail[] = [];
      updatedLimits.push({ limitDetail: limits.data[0], status: '' });
      service.updatedlimits = { limits: updatedLimits, transactionId: '' };

      const failed: IFailureLimits[] = [{ limittype: 'transfer', reason: '', status: 'FAILURE' }];
      service.failedLimits = failed;
      service.notifyResponse(Constants.VariableValues.settings.updateStatus.Success);
      expect(service.isBulkChangeSuccessful).toBeTruthy();
   }));
   it('should notify response', inject([ProfileLimitsService], (service: ProfileLimitsService) => {

      const updatedLimits: IChangedLimitDetail[] = [];
      updatedLimits.push({ limitDetail: limits.data[0], status: '' });
      service.updatedlimits = { limits: updatedLimits, transactionId: '' };

      const failed: IFailureLimits[] = [{ limittype: 'payment', reason: '', status: 'FAILURE' }];
      service.failedLimits = failed;
      service.notifyResponse(Constants.VariableValues.settings.updateStatus.Success);
      expect(service.isBulkChangeSuccessful).toBeTruthy();
   }));
   it('should set original limits', inject([ProfileLimitsService], (service: ProfileLimitsService) => {
      service.setOriginalLimits([]);
      expect(service.originallimitDetails.length).toBe(0);
   }));

   it('should update partial limits', inject([ProfileLimitsService], (service: ProfileLimitsService) => {
      service.updatePartailLimitFailure([]);
      expect(service.partialLimitFailure.length).toBe(0);
   }));
   it('should update original limits', inject([ProfileLimitsService], (service: ProfileLimitsService) => {
      const updatedLimits: IChangedLimitDetail[] = [];
      limits.data[0].isTempLimit = true;
      updatedLimits.push({ limitDetail: limits.data[0], status: 'SUCCESS' });
      updatedLimits.push({ limitDetail: limits.data[1], status: '' });
      updatedLimits.push({ limitDetail: limits.data[2], status: '' });
      updatedLimits.push({ limitDetail: limits.data[3], status: '' });
      service.originallimitDetails = limits.data;
      service.updateOriginalLimits(updatedLimits);
      expect(service.baselimitDetails.length).toBe(6);
   }));
   it('should set payload or call bulk limit update ', inject([ProfileLimitsService], (service: ProfileLimitsService) => {

      const updatedLimits: IChangedLimitDetail[] = [];
      limits.data[0].isTempLimit = true;
      updatedLimits.push({ limitDetail: limits.data[0], status: '' });
      updatedLimits.push({ limitDetail: limits.data[1], status: '' });
      updatedLimits.push({ limitDetail: limits.data[2], status: '' });
      updatedLimits.push({ limitDetail: limits.data[3], status: '' });

      const changedLimits: IChangedLimits = { limits: updatedLimits, transactionId: '' };
      service.updatedlimits = changedLimits;
      service.updateBulkLimit();
      expect(service.updatedlimits.transactionId).toBe('');
   }));

   it('should update if limit reverted back to original limit value', inject([ProfileLimitsService], (service: ProfileLimitsService) => {
      const updatedLimit: IChangedLimitDetail = { limitDetail: limits.data[0], status: '' };
      service.NotifyupdatedLimitChange(updatedLimit, false);
   }));
   it('should notify if limit is changed', inject([ProfileLimitsService], (service: ProfileLimitsService) => {
      const updatedLimit: IChangedLimitDetail = { limitDetail: limits.data[0], status: '' };
      service.NotifyupdatedLimitChange(updatedLimit, true);
   }));
   it('should notify if there is a limit change', inject([ProfileLimitsService], (service: ProfileLimitsService) => {
      service.notifyLimitChange();
   }));
   it('should add updated limits', inject([ProfileLimitsService], (service: ProfileLimitsService) => {
      const updatedLimits: IChangedLimitDetail[] = [];
      updatedLimits.push({ limitDetail: limits.data[0], status: '' });
      updatedLimits.push({ limitDetail: limits.data[1], status: '' });
      updatedLimits.push({ limitDetail: limits.data[2], status: '' });
      updatedLimits.push({ limitDetail: limits.data[3], status: '' });

      const changedLimits: IChangedLimits = { limits: updatedLimits, transactionId: '' };
      service.updatedlimits = changedLimits;
      service.AddorUpdateLimitType(updatedLimits[0], updatedLimits);
      expect(service.updatedlimits.limits.length).toBe(4);
   }));
   it('should get changed Limits', inject([ProfileLimitsService], (service: ProfileLimitsService) => {
      const updatedLimits: IChangedLimitDetail[] = [];
      updatedLimits.push({ limitDetail: limits.data[0], status: 'SUCCESS' });
      updatedLimits.push({ limitDetail: limits.data[1], status: 'Invalid' });
      updatedLimits.push({ limitDetail: limits.data[2], status: '' });
      updatedLimits.push({ limitDetail: limits.data[3], status: '' });
      const changedLimits: IChangedLimits = { limits: updatedLimits, transactionId: '' };
      service.updatedlimits = changedLimits;
      const changedLImits = service.changedLimits;
      expect(changedLImits.length).toBe(2);
   }));
   it('should get changed limits if no updated limits are there', inject([ProfileLimitsService], (service: ProfileLimitsService) => {
      const updatedLimits: IChangedLimitDetail[] = [];
      const changedLimits: IChangedLimits = { limits: updatedLimits, transactionId: '' };
      service.updatedlimits = changedLimits;
      const changedLimit = service.changedLimits;
      expect(changedLimit.length).toBe(0);
   }));
   it('should get valid changed Limits', inject([ProfileLimitsService], (service: ProfileLimitsService) => {
      const updatedLimits: IChangedLimitDetail[] = [];
      updatedLimits.push({ limitDetail: limits.data[0], status: 'SUCCESS' });
      updatedLimits.push({ limitDetail: limits.data[1], status: 'Invalid' });
      updatedLimits.push({ limitDetail: limits.data[2], status: '' });
      updatedLimits.push({ limitDetail: limits.data[3], status: '' });
      const changedLimits: IChangedLimits = { limits: updatedLimits, transactionId: '' };
      service.updatedlimits = changedLimits;
      const validChangedLimits = service.validChangedLimits;
      expect(validChangedLimits.length).toBe(3);
   }));
   it('should get successfull limits if single success limit is there', inject([ProfileLimitsService], (service: ProfileLimitsService) => {
      const updatedLimits: IChangedLimitDetail[] = [];
      updatedLimits.push({ limitDetail: limits.data[0], status: 'SUCCESS' });
      updatedLimits.push({ limitDetail: limits.data[1], status: 'Invalid' });
      updatedLimits.push({ limitDetail: limits.data[2], status: '' });
      updatedLimits.push({ limitDetail: limits.data[3], status: '' });
      const changedLimits: IChangedLimits = { limits: updatedLimits, transactionId: '' };
      service.updatedlimits = changedLimits;
      const successfullLimits = service.successFullLimits;
      expect(successfullLimits.length).toBe(1);
   }));

   it('should get successfull limits if no updated limits are there', inject([ProfileLimitsService], (service: ProfileLimitsService) => {
      const updatedLimits: IChangedLimitDetail[] = [];
      const changedLimits: IChangedLimits = { limits: updatedLimits, transactionId: '' };
      service.updatedlimits = changedLimits;
      expect(service.successFullLimits.length).toBe(0);
   }));

   it('should get empty date if there is no baselimitdetails', inject([ProfileLimitsService], (service: ProfileLimitsService) => {
      service.baselimitDetails = [];
      expect(service.getLimitEndDateDetail('transfer')).toBe('');
   }));
   it('should get non empty date if there is no baselimitdetails', inject([ProfileLimitsService], (service: ProfileLimitsService) => {
      service.baselimitDetails = limits.data;
      expect(service.getLimitEndDateDetail('transfer')).not.toBe('');
   }));

   it('should reset response', inject([ProfileLimitsService], (service: ProfileLimitsService) => {
      service.resetResponse();
      expect(service.isBulkChangeSuccessful).toBeFalsy();
   }));
   it('should notify partial response', inject([ProfileLimitsService], (service: ProfileLimitsService) => {
      const updatedLimits: IChangedLimitDetail[] = [];
      updatedLimits.push({ limitDetail: limits.data[0], status: '' });
      updatedLimits.push({ limitDetail: limits.data[1], status: '' });
      updatedLimits.push({ limitDetail: limits.data[2], status: '' });
      updatedLimits.push({ limitDetail: limits.data[3], status: '' });
      service.updatedlimits = { limits: updatedLimits, transactionId: '' };
      const failed: IFailureLimits[] = [{ limittype: 'transfer', reason: '', status: 'FAILURE' }
         , { limittype: 'payment', reason: '', status: 'FAILURE' },
      { limittype: '', reason: '', status: 'FAILURE' },
      { limittype: '1234', reason: '', status: 'FAILURE' }];
      service.failedLimits = failed;
      service.notifyResponse(Constants.VariableValues.settings.updateStatus.Partial);
      expect(service.isBulkChangeSuccessful).toBeFalsy();
   }));

   it('should notify partial response', inject([ProfileLimitsService], (service: ProfileLimitsService) => {
      const updatedLimits: IChangedLimitDetail[] = [];
      updatedLimits.push({ limitDetail: limits.data[0], status: '' });
      updatedLimits.push({ limitDetail: limits.data[1], status: '' });
      updatedLimits.push({ limitDetail: limits.data[2], status: '' });
      updatedLimits.push({ limitDetail: limits.data[3], status: '' });
      service.updatedlimits = { limits: updatedLimits, transactionId: '' };
      const failed: IFailureLimits[] = [{ limittype: 'transfer', reason: '', status: 'FAILURE' }
         , { limittype: 'payment', reason: '', status: 'FAILURE' },
      { limittype: '', reason: '', status: 'FAILURE' },
      { limittype: '1234', reason: '', status: 'FAILURE' }];
      service.failedLimits = failed;
      service.notifyResponse(Constants.VariableValues.settings.updateStatus.Partial);
      expect(service.isBulkChangeSuccessful).toBeFalsy();
   }));
   it('should notify partial response', inject([ProfileLimitsService], (service: ProfileLimitsService) => {
      const updatedLimits: IChangedLimitDetail[] = [];
      updatedLimits.push({ limitDetail: limits.data[0], status: '' });
      updatedLimits.push({ limitDetail: limits.data[1], status: '' });
      updatedLimits.push({ limitDetail: limits.data[2], status: '' });
      updatedLimits.push({ limitDetail: limits.data[3], status: '' });
      service.updatedlimits = { limits: updatedLimits, transactionId: '' };
      const failed: IFailureLimits[] = [{ limittype: 'transfer', reason: '', status: 'FAILURE' }];
      service.failedLimits = failed;
      service.notifyResponse(Constants.VariableValues.settings.updateStatus.Partial);
      expect(service.isBulkChangeSuccessful).toBeFalsy();
   }));

});




describe('ProfileLimitsService for NoContent', () => {
   const _noContent = jasmine.createSpy('getAll').and.returnValue(Observable.of(null));

   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [ProfileLimitsService, {
            provide: ApiService, useValue: {
               Limits: {
                  getAll: _noContent
               }
            }
         }]
      });
   });

   it('should be created', inject([ProfileLimitsService], (service: ProfileLimitsService) => {
      expect(service).toBeTruthy();
   }));

   it('should handle empty data', inject([ProfileLimitsService], (service: ProfileLimitsService) => {
      service.getAllLimits().subscribe(res => {
         expect(res.length).toBe(0);
      });
   }));
   it('should update tranaction ID', inject([ProfileLimitsService], (service: ProfileLimitsService) => {
      service.updateTransactionID('1234');
      expect(service.profileLimitDetails.transactionID).toBe('1234');
   }));
});
