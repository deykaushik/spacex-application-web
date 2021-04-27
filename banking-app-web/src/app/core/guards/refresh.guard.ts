import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { AccountsService } from '../services/accounts.service';

@Injectable()
export class RefreshGuard implements Resolve<any> {

   constructor(private accountsService: AccountsService) {

   }

   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      return this.accountsService.accountsRefresh()
         .catch((err) => {
            return Observable.of(err);
         });
   }
}
