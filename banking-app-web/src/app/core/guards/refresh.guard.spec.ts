import { TestBed, async, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { RefreshGuard } from './refresh.guard';
import { AccountsService } from '../services/accounts.service';

describe('RefreshGuard', () => {
   const accountsServiceStub = {
      accountsRefresh: jasmine.createSpy('accountsRefresh').and.returnValue(Observable.of(true))
   };

   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [
            RefreshGuard,
            { provide: AccountsService, useValue: accountsServiceStub }
         ]
      });
   });

   it('should create guard', inject([RefreshGuard], (guard: RefreshGuard) => {
      expect(guard).toBeTruthy();
   }));

   it('should refresh accounts', inject([RefreshGuard, AccountsService],
      (guard: RefreshGuard, accountsService: AccountsService) => {
      expect(guard.resolve).toBeTruthy();
      guard.resolve(null, null);
      expect(accountsServiceStub.accountsRefresh).toHaveBeenCalled();
   }));
});
