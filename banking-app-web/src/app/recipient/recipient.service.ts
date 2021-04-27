import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../core/services/api.service';
import { CommonUtility } from '../core/utils/common';
import { Constants } from '../core/utils/constants';
import {
   IBank, ITransactionMetaData, IContactCard, IApiResponse,
   IOutOfBandResponse, IOutOfBandRequest, IPaymentMetaData, IBeneficiaryData
} from '../core/services/models';
import { RecipientOperation } from './models';


@Injectable()
export class RecipientService {

   tempContactCard: IContactCard;
   addUpdateSuccess: boolean;
   updating: boolean;

   banks = new BehaviorSubject<IBank[]>([]);
   recipientOperation = new BehaviorSubject<RecipientOperation>(0);
   constructor(private apiService: ApiService) { }

   initiateRecepientFlow() {
      this.apiService.Banks.getAll().subscribe(response => {
         this.banks.next(response ? CommonUtility.sortByKey(response.data, 'bankName') : []);
      });
   }

   deleteRecipient(contactID): Observable<ITransactionMetaData> {
      return this.apiService.ContactCard.remove(contactID).map(response => response.metadata);
   }

   isTransactionStatusValid(metadata: ITransactionMetaData) {
      return CommonUtility.isTransactionStatusValid(metadata, Constants.metadataKeys.beneficiarySaved);
   }

   updateRecipient(contactCard: IContactCard, validate = true): Observable<ITransactionMetaData> {
      this.addUpdateSuccess = false;
      this.updating = true;
      return this.apiService.ContactCard.updateById(contactCard.contactCardID, contactCard,
         { validate: validate }).map(response => response.metadata);
   }

   addRecipient(contactCard: IContactCard, validate = true): Observable<IApiResponse> {
      this.addUpdateSuccess = false;
      this.updating = false;
      return this.apiService.AddContactCard.create(contactCard, { validate: validate });
   }

   getTransactionStatus(metadata: ITransactionMetaData) {
      return CommonUtility.getTransactionStatus(metadata, Constants.metadataKeys.beneficiarySaved);
   }

   getApproveItStatus(): Observable<IOutOfBandResponse> {
      return this.apiService.RecipientStatus.create(
         null,
         null,
         { verificationId: this.tempContactCard.secureTransaction.verificationReferenceId });
   }

   getApproveItOtpStatus(tvsCode: string, referenceId: string): Observable<IOutOfBandResponse> {
      const request: IOutOfBandRequest = {
         transactionVerificationCode: tvsCode,
         verificationReferenceId: referenceId
      };

      return this.apiService.OutOfBandOtpStatus.create(request);
   }

}
