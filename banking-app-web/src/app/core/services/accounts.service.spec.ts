import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { AccountsService } from './accounts.service';
import { ApiService } from './api.service';

describe('AccountsService', () => {
   const apiServiceStub = {
      refreshAccounts: {
         getAll: jasmine.createSpy('getAll').and.returnValue(Observable.of({}))
      }
   };

   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [
            AccountsService,
            {
               provide: ApiService, useValue: apiServiceStub
            }
         ]
      });
   });

   it('should be created', inject([AccountsService], (service: AccountsService) => {
      expect(service).toBeTruthy();
   }));

   it('should call refresh accounts api', inject([AccountsService, ApiService],
      (service: AccountsService, apiService: ApiService) => {
      expect(service).toBeTruthy();
      service.accountsRefresh();
      expect(apiServiceStub.refreshAccounts.getAll).toHaveBeenCalled();
      apiServiceStub.refreshAccounts.getAll().subscribe((value) => {
         expect(value).toBeTruthy();
      });
   }));
});
