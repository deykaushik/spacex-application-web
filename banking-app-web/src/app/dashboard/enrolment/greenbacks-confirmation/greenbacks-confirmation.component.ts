import { AccountService } from './../../account.service';
import { Component, ViewEncapsulation } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
   selector: 'app-greenbacks-confirmation',
   templateUrl: './greenbacks-confirmation.component.html',
   styleUrls: ['./greenbacks-confirmation.component.scss'],
   encapsulation: ViewEncapsulation.None
})
export class GreenbacksConfirmationComponent {

   // number of the newly created account
   public accountNumber = '';

   // whether show progress loader or not.
   public showLoader = false;

   /**
    * Creates an instance of GreenbacksConfirmationComponent.
    * @param {BsModalRef} bsModalRef
    * @param {AccountService} accountService
    * @memberof GreenbacksConfirmationComponent
    */
   constructor(private bsModalRef: BsModalRef,
      private accountService: AccountService) {
   }

   /**
    * Get the refreshed list of the account, notify other components
    * about account list update and close component on success.
    *
    * @memberof GreenbacksConfirmationComponent
    */
   getStartedWithNewAccount() {
      this.showLoader = true;
      this.accountService.refreshAccounts().subscribe(res => {
         this.showLoader = false;
         this.accountService.notifyAccountsUpdate();
         this.bsModalRef.hide();
      }, err => {
         this.showLoader = false;
      });
   }
}
