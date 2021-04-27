import { Component, OnInit, Input, Injector } from '@angular/core';
import { AccountService } from '../../../account.service';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/takeWhile';
import { Constants } from '../../../../core/utils/constants';
import { IIncomeTaxResponse } from '../../../../core/services/models';
import { BaseComponent } from '../../../../core/components/base/base.component';
import { GAEvents } from '../../../../core/utils/ga-event';
import { saveAs } from 'file-saver/FileSaver';

@Component({
   selector: 'app-income-tax-details',
   templateUrl: './income-tax-details.component.html',
   styleUrls: ['./income-tax-details.component.scss']
})
export class IncomeTaxDetailsComponent extends BaseComponent implements OnInit {
   @Input() accountNumber: string;
   @Input() accountType: string;
   itYearsData: IIncomeTaxResponse[];
   accountName: string;
   accountId: number;
   isComponentActive = true;
   showLoader: boolean;
   labels = Constants.labels;
   documentSearchResultRowList = [];
   availableYears = [];
   accountInv: string;
   isStatement: boolean;
   showTable = false;

   constructor(private accountService: AccountService, private route: ActivatedRoute, injector: Injector) {
      super(injector);
      this.route.params.subscribe(params => this.accountId = params.accountId);
   }

   ngOnInit() {
      this.getIncomeTaxYearsData();
   }

   getIncomeTaxYearsData() {
      this.showLoader = true;
      this.isStatement = true;
      const yearEnd = new Date().getFullYear();
      const yesrStart = yearEnd - 5;
      this.isInvestmentAccount();
      this.accountService.getIncomeTaxYears(yesrStart, yearEnd, this.accountNumber)
         .subscribe((response) => {
            if (response && response.documentSearchResultRowList.length) {
               this.itYearsData = response.documentSearchResultRowList;
               this.itYearsData.reverse();
               this.itYearsData.forEach(data => {
                  this.availableYears.push(new Date(data.effectiveDate).getFullYear());
               });
               this.showLoader = false;
               this.isStatement = true;
            }
            if (this.availableYears.length === 0) {
               this.isStatement = false;
               this.showLoader = false;
            }
         }, (error) => {
            this.isStatement = false;
            this.showLoader = false;
         });
   }

   isInvestmentAccount(): void {
      const invAcc = this.accountNumber;
      if (invAcc.indexOf('-') >= 0) {
         const id = invAcc.indexOf('-');
         const acc = invAcc.substr(0, id);
         this.accountNumber = acc;
      }
   }

   downloadIT3B(index: number): void {
      const documentUrl = this.itYearsData[index].documentUrl;
      this.accountService.getStartDateStatement(documentUrl).subscribe(
         (response) => saveAs(response, this.labels.it3b.fileName + this.availableYears[index] + this.labels.it3b.fileExt));
      const downloadIT3B = Object.assign({}, GAEvents.it3b.downloadIT3B);
      downloadIT3B.label += this.accountType;
      this.sendEvent(downloadIT3B.eventAction, downloadIT3B.label, null, downloadIT3B.category);
   }

   toggleDetail() {
      this.showTable = !this.showTable;
   }
}
