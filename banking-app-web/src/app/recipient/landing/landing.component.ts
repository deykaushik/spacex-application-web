import { Component, OnInit, Inject, ViewChild, ElementRef, OnDestroy, Injector } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { ISubscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import { Constants } from '../../core/utils/constants';
import { IBeneficiaryData, IParentOperation, IScheduledTransactionType, IScheduledTransaction } from '../../core/services/models';
import { RecipientService } from '../recipient.service';
import { RecipientOperation } from '../models';
import { BaseComponent } from '../../core/components/base/base.component';

@Component({
   selector: 'app-landing',
   templateUrl: './landing.component.html',
   styleUrls: ['./landing.component.scss']
})
export class LandingComponent extends BaseComponent implements OnInit, OnDestroy {
   transactionID: number;
   transactionType: string;
   transactionDetail: IScheduledTransaction;
   firstTimeBeneficiaryData: IBeneficiaryData;
   beneficiaryData: IBeneficiaryData;
   contactCardId: number;
   addRecipient = false;
   isEmptyState = false;
   isSlide = false;
   isShowMessageBlock = false;
   deleteRecipientVisible = false;
   isMaxRecipientLimitExceeded = false;
   deleteLoading = false;
   openAddFirstTime = false;
   isError = false;
   allowSlide = true;
   activeTab = 1;
   isSaveLoading = false;
   isValid = false;
   enableAddRecipient = false;
   subscription: ISubscription;
   parentNotify = new Subject<IParentOperation>();
   refreshSchedulePayments: number;
   @ViewChild('recipeintArea') recipeintArea: ElementRef;
   showEditScheduleTransaction: boolean;
   constructor( @Inject(DOCUMENT) private document: Document,
      private recipientService: RecipientService,
      private router: Router,
      private route: ActivatedRoute,
      injector: Injector) {
      super(injector);
      this.route.params.subscribe(params => {
         if (params && params.action === Constants.Recipient.addFlag) {
            this.openAddFirstTime = true;
         }
      });
   }

   ngOnInit() {
      if (this.openAddFirstTime) {
         this.onAddRecipientClick();
      }
      this.subscription = this.recipientService.recipientOperation.subscribe(operation => {
         switch (operation) {
            case RecipientOperation.showDeleteRecipient:
               this.deleteRecipientVisible = true;
               this.deleteLoading = false;
               break;
            case RecipientOperation.showLimitExceeded:
               this.isMaxRecipientLimitExceeded = true;
               break;
            case RecipientOperation.hideDeleteRecipient:
               this.deleteLoading = true;
               this.deleteRecipientVisible = false;
               break;
         }
      });
   }
   childNotifying(details: IParentOperation) {
      this.isValid = details.isValid;
      this.isSaveLoading = details.isSaveLoading;
   }
   ngOnDestroy() {
      this.recipientService.recipientOperation.next(0);
      if (this.subscription) {
         this.subscription.unsubscribe();
      }
      if (this.parentNotify) {
         this.parentNotify.unsubscribe();
      }
   }
   saveRecipient() {
      this.parentNotify.next({ isSaveRecipient: true });
   }
   handleBeneficiarySelection(data) {
      if (this.openAddFirstTime && this.addRecipient) {
         this.beneficiaryData = {};
         this.firstTimeBeneficiaryData = data;
         this.openAddFirstTime = false;
      } else {
         // handle first time navigation for mobile flow
         // screen should not slide when user first lands on recipient page on mobile
         // screen should not slide after recipient deletion on mobile
         if (this.beneficiaryData && this.allowSlide) {
            this.activeSlide();
         } else if (!this.allowSlide) {
            this.allowSlide = true;
         }
         this.addRecipient = false;
         this.beneficiaryData = data;
         this.isEmptyState = data.isEmptyState;
      }
   }

   onOperationSuccess(contactCardId: number) {
      if (contactCardId === Constants.Recipient.status.cancel) {
         if (!Object.keys(this.beneficiaryData).length) {
            this.beneficiaryData = this.firstTimeBeneficiaryData;
         }

         if (this.isError) {
            this.contactCardId = Constants.Recipient.status.error;
         }
         // cancel add recipient
         this.goBack();
      } else if (contactCardId >= 1) {
         // handle add/edit api success
         this.addRecipient = false;
         this.contactCardId = contactCardId;
         this.isError = false;
      } else if (contactCardId === Constants.Recipient.status.deleteSuccess) {
         this.goBack();
         this.allowSlide = false;
         // handle delete success
         this.showMessageBlock();
         this.isError = false;
         this.contactCardId = contactCardId;
      } else if (contactCardId === Constants.Recipient.status.error) {
         this.isError = true;
         this.contactCardId = Constants.Recipient.status.reset;
      } else {
         this.contactCardId = contactCardId;
      }
   }

   onRecipientFocusMessage() {
      this.recipeintArea.nativeElement.scrollTop = 0;
   }

   showMessageBlock() {
      this.isShowMessageBlock = true;
      this.autoCloseMessageBlock();
   }

   closeMessageBlock() {
      this.isShowMessageBlock = false;
   }

   autoCloseMessageBlock() {
      setTimeout(() => {
         this.closeMessageBlock();
      }, Constants.VariableValues.settings.messageHideTimeout);
   }

   onAddRecipientClick() {
      this.addRecipient = true;
      this.activeSlide();
   }

   activeSlide() {
      this.isSlide = true;
      this.document.body.classList.add('search-recipients-no-scroll');
   }

   goBack() {
      this.isSlide = false;
      this.addRecipient = false;
      this.document.body.classList.remove('search-recipients-no-scroll');
      this.router.navigate(['/recipient']);
   }

   deleteRecipient() {
      this.deleteLoading = true;
      this.recipientService.recipientOperation.next(RecipientOperation.deleteRecipeint);
   }

   hideDeleteRecipientNotification() {
      this.deleteRecipientVisible = false;
   }

   hideLimitExceededNotification() {
      this.isMaxRecipientLimitExceeded = false;
   }
   selectBankApprovedTab() {
      this.activeTab = 2;
   }
   onEnableSaveRecipient(value) {
      this.enableAddRecipient = value;
   }
   hideOverlay() {
      this.showEditScheduleTransaction = false;
   }
   openScheduleOverlay(scheduleTransaction: IScheduledTransactionType) {
      this.transactionDetail = scheduleTransaction.transaction;
      this.transactionType = scheduleTransaction.type;
      this.transactionID = scheduleTransaction.transaction.transactionID;
      this.showEditScheduleTransaction = true;
   }
   refreshPayment() {
      this.showEditScheduleTransaction = false;
      this.refreshSchedulePayments = Math.random();
   }
}
