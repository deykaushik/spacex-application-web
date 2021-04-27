import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

import { ApiService } from './api.service';

@Injectable()
export class AccountsService {

   constructor(private apiService: ApiService) { }

   accountsRefresh(): Observable<any> {
      return this.apiService.refreshAccounts.getAll();
   }
}
