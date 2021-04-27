import { Component, OnInit } from '@angular/core';
import { Constants } from '../core/utils/constants';
import { environment } from '../../environments/environment';
import { CommonUtility } from '../core/utils/common';
import { Subject } from 'rxjs/Subject';
import { ProfileLimitsService } from './profile-limits/profile-limits.service';
import { Router, NavigationEnd } from '@angular/router';
import { INavigationModel, IChangedLimitDetail, ILimitDetail } from '../core/services/models';

@Component({
   selector: 'app-settings',
   templateUrl: './settings.component.html',
   styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

   public navMenus: INavigationModel[];
   public navTitle: String;
   showAnnualCreditReview = environment.features.annualCreditReview;
   showHideAndShow = environment.features.accountsShowHideFeature;
   menusLabel = Constants.VariableValues.settings.navMenus;
   limitListCount = 0;
   showLoader = false;
   limitStatusmessage = '';
   limitResponseMessage = '';
   error = false;
   success = false;
   partial = false;
   valid = true;
   isAllValidationPassed = false;

   constructor(private profileLimitservice: ProfileLimitsService, private router: Router) {
   }
   ngOnInit() {
      this.InitializeServicevalues();
      const annualCreditReviewLabel = Constants.labels.menuAnnualCreditReview;
      const accountVisibilityLabel = Constants.labels.menuHideAndShow;
      this.navMenus
         = this.showAnnualCreditReview ? this.menusLabel : this.menusLabel.filter(menu => menu.label !== annualCreditReviewLabel);
      this.navMenus = this.showHideAndShow ? this.navMenus : this.navMenus.filter(menu => menu.label !== accountVisibilityLabel);
      this.navTitle = Constants.VariableValues.settings.title;

      this.NotifyUpdatedList();
      this.NotifyBulkResponse();
      this.router.events.subscribe((event) => {
         this.profileLimitservice.isProfileLimits = event instanceof NavigationEnd &&
            event.urlAfterRedirects.includes(Constants.VariableValues.settings.labels.ProfileLimitRoute);
         if (this.profileLimitservice.isProfileLimits) {
            this.InitailizeLimitDetails();
         }
      });
   }
   private NotifyBulkResponse() {
      this.profileLimitservice.bulkupdateResponse.subscribe(status => {
         this.error = !this.profileLimitservice.isBulkChangeSuccessful && !this.profileLimitservice.isPartialChangeSuccessful;
         this.partial = this.profileLimitservice.isPartialChangeSuccessful;
         this.success = this.profileLimitservice.isBulkChangeSuccessful;
         this.limitListCount = 0;
         switch (status) {
            case Constants.VariableValues.settings.updateStatus.SuccessSingle:
               {
                  this.limitResponseMessage = '';
                  this.limitStatusmessage = '';
                  break;
               }
            case Constants.VariableValues.settings.updateStatus.Success:
               {
                  this.limitResponseMessage = Constants.VariableValues.settings.labels.successfullyUpdated;
                  break;
               }
            case Constants.VariableValues.settings.updateStatus.Partial:
               {
                  this.limitResponseMessage = Constants.VariableValues.settings.labels.partialResponse;
                  break;
               }
            case '': {
               this.limitResponseMessage = '';
               break;
            }
            default:
               {
                  this.limitResponseMessage = Constants.VariableValues.settings.labels.FailureResponse;
                  break;
               }
         }
      });
   }

   private NotifyUpdatedList() {
      this.profileLimitservice.notifyUpdatedList.subscribe({
         next: (changedLimitss) => {
            this.limitStatusmessage = '';

            this.isAllValidationPassed = !(changedLimitss && changedLimitss.length > 0 &&
               changedLimitss.some(i => i.status === Constants.VariableValues.settings.labels.Invalid));
            this.limitResponseMessage = '';
            const updatedLimits = changedLimitss.filter(i => i.status !== Constants.VariableValues.settings.updateStatus.Success);
            if (updatedLimits !== null) {
               this.limitListCount = updatedLimits.length;
            }
            if (this.limitListCount > 1) {
               this.limitStatusmessage = Constants.VariableValues.settings.labels.transactionLimitchange;
            } else if (this.limitListCount === 1) {
               let limitDisplay = this.LimitCaptitalize(updatedLimits[0].limitDetail.limitType);
               const limitDisplayMapper = Constants.VariableValues.profile.limitDetailMapper.filter(i =>
                  i.limitType === updatedLimits[0].limitDetail.limitType);
               if (limitDisplayMapper && limitDisplayMapper.length > 0) {
                  limitDisplay = limitDisplayMapper[0].displayValue;
               }
               this.limitStatusmessage = Constants.VariableValues.settings.labels.changedLimitText + limitDisplay + ' limit';
            } else {
               this.limitStatusmessage = '';
            }
         }
      });
   }

   LimitCaptitalize(limit) {
      return limit.charAt(0).toUpperCase() + limit.slice(1);
   }
   updatebtnClick() {
      this.limitResponseMessage = '';
      this.profileLimitservice.updateMultipleLimit.next(true);
   }
   cancelLimitUpdate() {
      this.profileLimitservice.cancelToOriginalLimitDetail.next(true);
      this.InitailizeLimitDetails();
   }
   onCloseMessage(isOpened: boolean) {
      this.limitResponseMessage = '';
      this.limitListCount = this.profileLimitservice.changedLimits ? this.profileLimitservice.changedLimits.length : 0;
      this.profileLimitservice.notifyLimitChange();
   }

   InitializeServicevalues() {
      this.InitailizeLimitDetails();
      this.profileLimitservice.notifyUpdatedList = new Subject<IChangedLimitDetail[]>();
      this.profileLimitservice.updateMultipleLimit = new Subject<boolean>();
      this.profileLimitservice.bulkupdateResponse = new Subject<string>();
   }

   private InitailizeLimitDetails() {
      this.profileLimitservice.isBulkChangeSuccessful = false;
      this.profileLimitservice.isPartialChangeSuccessful = false;
      this.profileLimitservice.updatedlimits = { limits: [], transactionId: '' };
      this.profileLimitservice.partialLimitFailure = [];
      this.profileLimitservice.failedLimits = [];
      this.profileLimitservice.payload = { limits: [] };
      this.profileLimitservice.notifyLimitChange();
      this.profileLimitservice.resetResponse();
   }

   get isProfileLimits(): boolean {
      return this.profileLimitservice.isProfileLimits;
   }
}





