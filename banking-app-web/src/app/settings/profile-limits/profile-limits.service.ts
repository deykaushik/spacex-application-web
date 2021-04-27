import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

import { ApiService } from './../../core/services/api.service';

import {
   ILimitDetail, ITransactionMetaData, IOutOfBandResponse, IOutOfBandRequest,
   IChangedLimitDetail, IChangedLimits, IValidLimits
} from './../../core/services/models';
import { ILimitWidgetModel, LimitDetail, IPartialLimitFailure, IFailureLimits, ILimitTypes } from './profile-limits.models';
import { Constants } from '../../core/utils/constants';
import { CommonUtility } from '../../core/utils/common';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ProfileLimitsService {

   isProfileLimits = false;
   isChangeSuccessful = false;
   lastUpdatePayload: any;
   lastUpdateRouteParams: any;
   profileLimitDetails: LimitDetail = new LimitDetail();
   newLimit: number;
   isTemp: boolean;
   transactionID?: string;
   isBulkChangeSuccessful = false;
   isPartialChangeSuccessful = false;
   originallimitDetails: ILimitDetail[];
   baselimitDetails: ILimitDetail[];
   updatedlimits: IChangedLimits = { limits: [], transactionId: '' };
   validLimits: IValidLimits[] = [];
   notifyUpdatedList: Subject<IChangedLimitDetail[]> = new Subject<IChangedLimitDetail[]>();
   updateMultipleLimit: Subject<boolean> = new Subject<boolean>();
   cancelToOriginalLimitDetail: Subject<boolean> = new Subject<boolean>();
   bulkupdateResponse: Subject<string> = new Subject<string>();
   partialLimitFailure: IPartialLimitFailure[];
   failedLimits: IFailureLimits[];
   payload = { limits: [] };


   constructor(private apiService: ApiService) { }

   getAllLimits(): Observable<ILimitDetail[]> {
      return this.apiService.Limits.getAll().map((response) => response ? response.data : []);
   }

   getLimitsWidgetVm(type: string): ILimitWidgetModel {
      return Constants.VariableValues.settings.widgetsDetails.find(m => m.type === type);
   }

   updateLimit(payload, routeParams) {
      this.lastUpdatePayload = payload;
      this.lastUpdateRouteParams = routeParams;

      this.profileLimitDetails.newLimit = payload.newLimit;
      this.profileLimitDetails.isTemp = payload.isTempLimit;
      this.profileLimitDetails.transactionID = '';

      return this.apiService.IndividualLimits.update(payload, {}, routeParams).map((response) => response.metadata);
   }

   isTransactionStatusValid(metadata: ITransactionMetaData) {
      return CommonUtility.isTransactionStatusValid(metadata);
   }

   setSecureTransactionVerification(verificationId) {
      if (!this.profileLimitDetails.secureTransaction) {
         this.profileLimitDetails.secureTransaction = { verificationReferenceId: '' };
      }
      this.profileLimitDetails.secureTransaction.verificationReferenceId = verificationId;
   }
   getApproveItStatus(): Observable<IOutOfBandResponse> {
      return this.apiService.PreferenceStatus.create(
         null,
         null,
         { verificationId: this.profileLimitDetails.transactionID });
   }
   getBulkApproveItStatus(): Observable<IOutOfBandResponse> {
      return this.apiService.PreferenceStatus.create(
         null,
         null,
         { verificationId: this.updatedlimits.transactionId });
   }

   getApproveItOtpStatus(tvsCode: string, referenceId: string): Observable<IOutOfBandResponse> {
      const request: IOutOfBandRequest = {
         transactionVerificationCode: tvsCode,
         verificationReferenceId: referenceId
      };
      return this.apiService.OutOfBandOtpStatus.create(request);
   }

   updateTransactionID(transactionID: string) {
      if (transactionID) {
         this.profileLimitDetails.transactionID = transactionID;
         this.isChangeSuccessful = true;
      }
   }

   updateBulkTransactionID(transactionID: string) {
      if (transactionID) {
         this.updatedlimits.transactionId = transactionID;
      }
   }

   notifyResponse(response) {
      switch (response) {
         case Constants.VariableValues.settings.updateStatus.Partial:
            {
               this.isBulkChangeSuccessful = false;
               this.isPartialChangeSuccessful = true;
               break;
            }
         case Constants.VariableValues.settings.updateStatus.Success:
            {
               this.isBulkChangeSuccessful = true;
               this.isPartialChangeSuccessful = false;
               if (this.updateLimit && this.updatedlimits.limits.length === 1) {
                  response = Constants.VariableValues.settings.updateStatus.SuccessSingle;
               }
               break;
            }
         case Constants.VariableValues.settings.updateStatus.Failure:
            {
               this.isBulkChangeSuccessful = false;
               this.isPartialChangeSuccessful = false;
               break;
            }
      }
      this.updatedlimits.limits.map(i =>
         i.status = this.failedLimits && this.failedLimits.some(j => (j.limittype === i.limitDetail.limitType ||
            !this.updatedlimits.limits.some(x => x.limitDetail.limitType === j.limittype) || j.limittype === '')) ?
            Constants.VariableValues.settings.updateStatus.Failure : Constants.VariableValues.settings.updateStatus.Success
      );


      this.bulkupdateResponse.next(response);
   }
   resetResponse() {
      this.isBulkChangeSuccessful = false;
      this.isPartialChangeSuccessful = false;
      this.bulkupdateResponse.next('');
   }

   setOriginalLimits(originallimitDetails: ILimitDetail[]) {
      this.originallimitDetails = originallimitDetails;
      this.baselimitDetails = JSON.parse(JSON.stringify(originallimitDetails));
   }

   updatePartailLimitFailure(partialLimitsfailure) {
      this.partialLimitFailure = partialLimitsfailure;
   }

   getLimitEndDateDetail(limitType: string): string {
      return this.baselimitDetails && this.baselimitDetails.length > 0 ?
         this.baselimitDetails.filter(i => i.limitType === limitType)[0].tempLimitEnd : '';
   }

   updateOriginalLimits(updatedLimit: IChangedLimitDetail[]) {
      for (let i = 0; i < updatedLimit.length; i++) {
         if (updatedLimit[i].status === Constants.VariableValues.settings.updateStatus.Success) {
            const limit = this.originallimitDetails.find(j => j.limitType === updatedLimit[i].limitDetail.limitType);
            limit.dailyLimit = updatedLimit[i].limitDetail.newLimit;
            if (updatedLimit[i].limitDetail.isTempLimit) {
               limit.tempDailyLimit = updatedLimit[i].limitDetail.newLimit;
            }
         }
      }
      this.baselimitDetails = JSON.parse(JSON.stringify(this.originallimitDetails));
   }

   updateBulkLimit() {
      this.setLimitsPayload();
      return this.apiService.UpdateLimits.update(this.payload, {}).map((response) => response.metadata);
   }

   private setLimitsPayload() {
      this.updatedlimits.transactionId = '';
      this.payload.limits = [];
      const limitsToUpdate = this.updatedlimits.limits;

      if (limitsToUpdate && limitsToUpdate.length > 0) {
         for (const limit of limitsToUpdate) {
            this.payload.limits.push({
               newLimit: limit.limitDetail.newLimit,
               limitType: limit.limitDetail.limitType,
               isTempLimit: limit.limitDetail.isTempLimit,
               tempLimitEnd: limit.limitDetail.isTempLimit ? limit.limitDetail.tempLimitEnd : ''
            });
         }
      }
   }

   NotifyupdatedLimitChange(limit: IChangedLimitDetail, isLimitChanged = false) {
      this.setLimitsToUpdateList(limit, isLimitChanged);
      this.notifyLimitChange();
   }

   setLimitsToUpdateList(limit: IChangedLimitDetail, isLimitChanged = false) {

      this.AddorUpdateLimitType(limit, this.updatedlimits.limits);
      if (!isLimitChanged) {
         const index: number = this.updatedlimits.limits.findIndex(i => i.limitDetail.limitType === limit.limitDetail.limitType);
         if (index !== -1) {
            this.updatedlimits.limits.splice(index, 1);
         }
      }
   }

   notifyLimitChange() {
      this.notifyUpdatedList.next(this.validChangedLimits);
   }

   AddorUpdateLimitType(changedlimit: IChangedLimitDetail, updatedlimits: IChangedLimitDetail[]) {
      if (updatedlimits != null && updatedlimits.length > 0 &&
         updatedlimits.some(i => i.limitDetail && i.limitDetail.limitType === changedlimit.limitDetail.limitType)) {
         const limit = this.updatedlimits.limits.filter(function (l) {
            return l.limitDetail.limitType === changedlimit.limitDetail.limitType;
         })[0];
         limit.limitDetail = changedlimit.limitDetail;
         limit.status = changedlimit.status;
      } else {
         updatedlimits.push(changedlimit);
      }
   }

   get changedLimits(): IChangedLimitDetail[] {
      return this.updatedlimits && this.updatedlimits.limits.length > 0 ?
         this.updatedlimits.limits.filter(i =>
            i.status !== Constants.VariableValues.settings.labels.Success &&
            i.status !== Constants.VariableValues.settings.labels.Invalid) : [];
   }

   get validChangedLimits(): IChangedLimitDetail[] {
      return this.updatedlimits && this.updatedlimits.limits.length > 0 ?
         this.updatedlimits.limits.filter(i => i.status !== Constants.VariableValues.settings.labels.Success) : [];
   }

   get successFullLimits(): IChangedLimitDetail[] {
      return this.updatedlimits && this.updatedlimits.limits.length > 0 ?
         this.updatedlimits.limits.filter(i => i.status === Constants.VariableValues.settings.labels.Success) : [];
   }
}
