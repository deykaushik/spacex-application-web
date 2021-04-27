import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Route, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ITermsAndConditions } from '../../core/services/models';
import { TermsService } from './terms.service';
import { Constants } from '../../core/utils/constants';
import { CommonUtility } from './../../core/utils/common';
import { TermsAndConditionsConstants } from '../../shared/terms-and-conditions/constants';
@Component({
   selector: 'app-modal-content',
   templateUrl: './terms-and-conditions.component.html',
   styleUrls: ['./terms-and-conditions.component.scss'],
   encapsulation: ViewEncapsulation.None
})

export class TermsAndConditionsComponent implements OnInit, OnDestroy {
   public title: string;
   public termsAndConditionsModel: ITermsAndConditions[];
   public isAcceptButtonVisible: boolean;
   public iconCls: string;
   public conditionText: string;
   private isComponentActive = true;
   public isTermAndConditionAccept = false;
   private chcekLottoNoticeType = TermsAndConditionsConstants.includeTermsLotto.toString();
   private chcekElectricityNoticeType = TermsAndConditionsConstants.includeTermsPrepaid.toString();
   labels = Constants.labels.termAndConditionPopup;
   dateFormat: string = Constants.formats.ddMMYYYY;
   print = CommonUtility.print.bind(CommonUtility);
   termsAndConditionsPDF = '';

   constructor(private router: Router, public bsModalRef: BsModalRef, private termsService: TermsService) {
   }

   ngOnInit() {
      this.termsService.isAccepted = false;
   }

   ngOnDestroy() {
      this.isComponentActive = false;
   }

   public showTnc() {
      this.isTermAndConditionAccept = true;
   }

   public acceptTermsAndConditions() {
      this.termsService.isAccepted = true;
      this.termsService.accept(this.termsAndConditionsModel)
         .takeWhile(() => this.isComponentActive === true)
         .subscribe(response => {
            this.bsModalRef.hide();
         });
   }

   public declineTermsAndConditions() {
      this.termsService.isAccepted = false;
      this.isTermAndConditionAccept = false;
      this.bsModalRef.hide();
   }

   public closeTermsAndConditions() {
      if (this.isAcceptButtonVisible) {
         this.isTermAndConditionAccept = false;
      } else {
         this.bsModalRef.hide();
      }
   }

   get TermsAndConditions(): boolean {
      if (this.termsAndConditionsModel && this.termsAndConditionsModel.length > 0) {
         switch (this.termsAndConditionsModel[0].noticeType) {
            case this.chcekLottoNoticeType: {
               this.termsAndConditionsPDF = Constants.links.lottoTermsAndConditions;
               return true;
            }
            case this.chcekElectricityNoticeType: {
               this.termsAndConditionsPDF = Constants.links.ElectricityTermsAndConditions;
               return true;
            }
            default: {
               this.termsAndConditionsPDF = '';
               return false;
            }
         }
      }
      this.termsAndConditionsPDF = '';
      return false;
   }
}
