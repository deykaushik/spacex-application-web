import { Component, OnInit, OnDestroy, Renderer2, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { OpenAccountService } from '../open-account.service';
import { ICountries } from '../../core/services/models';
import { Constants } from '../constants';
import { DOCUMENT } from '@angular/common';

@Component({
   selector: 'app-open-account-success',
   templateUrl: './open-account-success.component.html',
   styleUrls: ['./open-account-success.component.scss']
})
export class OpenAccountSuccessComponent implements OnInit, OnDestroy {

   labels = Constants.labels.openAccount;
   openAccountMessages = Constants.messages.openNewAccount;
   openAccountValues = Constants.variableValues.openNewAccount;
   productDetails: ICountries;
   productName: string;
   accountSuccess: boolean;

   constructor(private router: Router, private openAccountService: OpenAccountService, private render: Renderer2,
      @Inject(DOCUMENT) private document: Document) { }

   ngOnInit() {
      this.render.setStyle(this.document.body, 'overflow-y', 'hidden');
      this.accountSuccess = true;
      this.productDetails = this.openAccountService.getProductDetails();
      if (this.productDetails) {
         this.productName = this.productDetails.name;
      }
   }

   processingTimePage() {
      this.accountSuccess = false;
   }

   gotoInvestmentAccount() {
      this.router.navigateByUrl(Constants.routeUrls.dashboard);
   }

   closeOverlay() {
      this.gotoInvestmentAccount();
   }

   isOpenAccountSuccess(value: boolean) {
      this.accountSuccess = true;
   }

   ngOnDestroy() {
      this.render.setStyle(this.document.body, 'overflow-y', 'auto');
   }
}
