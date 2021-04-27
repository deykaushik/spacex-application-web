import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs/Observable';
import { IBankDefinedBeneficiary, IContactCard, IBeneficiaryData } from './models';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class BeneficiaryService {

   constructor(private apiService: ApiService) { }
   selectedBeneficiary = new BehaviorSubject<IBeneficiaryData>(null);
   getBankApprovedBeneficiaries(): Observable<IBankDefinedBeneficiary[]> {
      return this.apiService.BankDefinedBeneficiaries.getAll().map(response => response ? response.data : []);
   }

   getContactCards(): Observable<IContactCard[]> {
      return this.apiService.ContactCards.getAll().map(response => response ? response.data : []);
   }
}
