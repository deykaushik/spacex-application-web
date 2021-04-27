import { Component, OnInit, Injector } from '@angular/core';
import { Constants } from './../../core/utils/constants';
import { GAEvents } from '../../core/utils/ga-event';
import { IApiResponse, IPlasticCard, IUnilateralIndicator } from './../../core/services/models';
import { AccountService } from './../../dashboard/account.service';
import { HeaderMenuService } from '../../core/services/header-menu.service';
import { environment } from '../../../environments/environment';
import { AlertActionType, AlertMessageType } from '../../shared/enums';
import { CommonUtility } from '../../core/utils/common';
import { BaseComponent } from '../../core/components/base/base.component';


@Component({
   selector: 'app-annual-credit-review',
   templateUrl: './annual-credit-review.component.html',
   styleUrls: ['./annual-credit-review.component.scss']
})
export class AnnualCreditReviewComponent extends BaseComponent implements OnInit {
   labels = Constants.labels;
   annualCreditReviewLabels = this.labels.annualCreditReviewLabels;
   showAnnualCreditReview = environment.features.annualCreditReview;
   isUnilateralLimitIndicator: boolean;
   isUnilateralLimitIndicatorMaster: boolean;
   alertMessage: string;
   isShowAlert = false;
   alertAction: string;
   alertType: string;
   allCreditCardAccounts: IUnilateralIndicator[];
   toggleName: string;
   isCreditCardAvailable = true;
   plasticCards: IPlasticCard[];
   skeletonMode = false;
   annualCreditReviewGaEvents = GAEvents.annualCreditReview;
   category = GAEvents.annualCreditReview.category;

   constructor(private accountService: AccountService, private headerMenuService: HeaderMenuService, injector: Injector) {
      super(injector);
      this.skeletonMode = true;
   }

   ngOnInit() {
      this.sendEvent(this.annualCreditReviewGaEvents.clickAnnualCreditReview.action,
         this.annualCreditReviewGaEvents.clickAnnualCreditReview.label, '', this.category);
      this.allCreditCardAccounts = [] as IUnilateralIndicator[];
      this.setMessage({
         message: '',
         alertAction: AlertActionType.None, alertType: AlertMessageType.Success
      });
      this.getUnilateralDetails();
   }
   setMessage(message) {
      this.isShowAlert = false;
      this.alertAction = message.alertAction;
      this.alertType = message.alertType;
   }
   onAlertLinkSelected(action: AlertActionType) {
      this.isShowAlert = false;
   }

   getAccountTypeStyle(accountType: string) {
      return CommonUtility.getAccountTypeStyle(accountType);
   }

   /* Get unilatera indicator details */
   getUnilateralDetails() {
      this.skeletonMode = true;
      this.accountService.getUnilateralLimitIndicator().subscribe((unilateralLimitDetails: IApiResponse) => {
         if (unilateralLimitDetails && unilateralLimitDetails.data && unilateralLimitDetails.data.length) {
            unilateralLimitDetails.data.forEach(element => {
               element.plastics.forEach(plasticObj => {
                  plasticObj.plasticNumber = plasticObj.plasticNumber.replace(/[^0-9]/g, '')
                     .replace(/(\d{4}(?!\s))/g, '$1 ');
               });
               this.allCreditCardAccounts.push(element);
            });
            this.updateMasterToggle();
            this.isCreditCardAvailable = true;
            this.skeletonMode = false;
         } else {
            this.isCreditCardAvailable = false;
            this.skeletonMode = false;
         }
      });
   }

   /* Calling this function when unilateral indicator master toggle changed/master-toggle on or off.*/
   onMasterChange() {
      this.isShowAlert = false;
      this.isUnilateralLimitIndicator = this.isUnilateralLimitIndicatorMaster;
      if (this.isUnilateralLimitIndicator) {
         this.allCreditCardAccounts.forEach(account => {
            account.unilateralLimitIndicator = true;
         });
      }
      this.accountService.updateUnilateralMasterToggleIndicator(true,
         this.isUnilateralLimitIndicator).subscribe(
         (response: IApiResponse) => {
            if (response) {
               if (this.annualCreditReviewLabels.annualCreditReviewSuccessfulCode ===
                  response.metadata.resultData[0].resultDetail[0].result) {
                  this.alertMessage = this.isUnilateralLimitIndicatorMaster ?
                     this.annualCreditReviewLabels.thankYouWeWillReviewText
                     : this.annualCreditReviewLabels.thankYouWeHaveUpdatedText;
                  this.isShowAlert = true;

               }
            }
         });

   }

   /* Inidividual account toggle change */
   onIndividualAccountToggleChange(creditCard: IUnilateralIndicator, event) {
      this.isShowAlert = false;
      this.isUnilateralLimitIndicator = event;
      if (this.isUnilateralLimitIndicator) {
         this.sendEvent(this.annualCreditReviewGaEvents.AnnualCreditReviewOptIn.action,
            this.annualCreditReviewGaEvents.AnnualCreditReviewOptIn.label, '', this.category);
         this.sendEvent(this.annualCreditReviewGaEvents.AnnualCreditReviewOptInPerCreditCardProductType.action,
            this.annualCreditReviewGaEvents.AnnualCreditReviewOptInPerCreditCardProductType.label,
            this.annualCreditReviewGaEvents.AnnualCreditReviewOptInPerCreditCardProductType.value, this.category);
      } else {
         this.sendEvent(this.annualCreditReviewGaEvents.AnnualCreditReviewOptOut.action,
            this.annualCreditReviewGaEvents.AnnualCreditReviewOptOut.label, '', this.category);
         this.sendEvent(this.annualCreditReviewGaEvents.AnnualCreditReviewOptOutPerCreditCardProductType.action,
            this.annualCreditReviewGaEvents.AnnualCreditReviewOptOutPerCreditCardProductType.label,
            this.annualCreditReviewGaEvents.AnnualCreditReviewOptOutPerCreditCardProductType.value, this.category);
      }
      this.accountService.updateUnilateralLimitIndicator(false,
         this.isUnilateralLimitIndicator, creditCard.plastics[0].plasticId).subscribe(
         (unilateralLimitDetails: IApiResponse) => {
            if (unilateralLimitDetails) {
               this.updatePlastics(creditCard);
               this.updateMasterToggle();
               if (this.annualCreditReviewLabels.annualCreditReviewSuccessfulCode ===
                  unilateralLimitDetails.metadata.resultData[0].resultDetail[0].result) {
                  this.alertMessage = this.annualCreditReviewLabels.thankYouWeHaveUpdatedText;
                  this.isShowAlert = true;
               }
            }
         });
   }

   openSettingsMenu(menuText: string) {
      this.headerMenuService.openHeaderMenu(menuText);
   }

   updateMasterToggle() {
      for (let index = 0; index < this.allCreditCardAccounts.length; index++) {
         if (this.allCreditCardAccounts[index].unilateralLimitIndicator === true) {
            this.isUnilateralLimitIndicatorMaster = true;
            break;
         } else {
            this.isUnilateralLimitIndicatorMaster = false;
         }
      }
   }

   updatePlastics(creditCard: IUnilateralIndicator) {
      this.allCreditCardAccounts.forEach((searchCreditCard, index) => {
         if (searchCreditCard.plastics[0].plasticId === creditCard.plastics[0].plasticId) {
            this.allCreditCardAccounts[index].unilateralLimitIndicator = this.isUnilateralLimitIndicator;
         }
      });
   }
}
