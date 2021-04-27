import { NgForm } from '@angular/forms';
import { ISelectGameVm } from './../models';
import { ISelectGameNotification, IClientDetails } from './../../../core/services/models';
import { Component, OnInit, Input, ViewChild, EventEmitter, Output, AfterViewInit, ElementRef, Injector, OnDestroy } from '@angular/core';

import { GameService } from '../game.service';
import { Constants } from '../../../core/utils/constants';
import { CommonUtility } from '../../../core/utils/common';
import { ValidateInputDirective } from './../../../shared/directives/validations/validateInput.directive';
import { ClientProfileDetailsService } from '../../../core/services/client-profile-details.service';

import { ISelectNumbersVm, ISelectGameForVm } from '../models';
import { IWorkflowChildComponent, IStepInfo } from './../../../shared/components/work-flow/work-flow.models';
import { BaseComponent } from '../../../core/components/base/base.component';

@Component({
   selector: 'app-select-game-for',
   templateUrl: './select-game-for.component.html',
   styleUrls: ['./select-game-for.component.scss']
})
export class SelectGameForComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
   @ViewChild('selectGameForForm') selectGameForForm: NgForm;
   @ViewChild('mobileNumber') mobileNumber: ElementRef;
   @Output() isComponentValid = new EventEmitter<boolean>();
   selectedGame: ISelectGameVm;
   vm: ISelectGameForVm;
   isValid = false;
   smsMinLength = Constants.VariableValues.smsMinLength;
   smsMaxLength = Constants.VariableValues.smsMaxLength;
   referenceMaxLength = Constants.VariableValues.referenceMaxLength;
   patterns = Constants.patterns;
   messages = Constants.messages;
   labels = Constants.labels;
   notifications = CommonUtility.getNotificationTypes();
   gameTypeSelected: string;
   userMobileNumber: string;
   isCellphoneEditMode = false;
   savedMobileNumber: string;

   constructor(private gameService: GameService, private clientProfileDetailsService: ClientProfileDetailsService, injector: Injector) {
         super(injector);
   }

   /* Event occured on notification dropwn down change */
   onNotificationChange(event: Event, selectd: any) {
      this.vm.notification = selectd;
      if (this.vm.notification === this.notifications.find(m => m.value === Constants.notificationTypes.SMS)) {
            this.vm.notificationInput = this.userMobileNumber;
            this.isCellphoneEditMode = !(this.vm.notificationInput && this.vm.notificationInput.trim());
      }else {
      this.vm.notificationInput = '';
      this.isCellphoneEditMode = false;
   }
   }

   onMobileNumberChange(number) {
      this.validate();
   }

   ngOnInit() {
      this.isComponentValid.emit(true);
      this.vm = this.gameService.getSelectGameForVm();
      this.selectedGame = this.gameService.getSelectGameVm();
      this.subscribeClientDetails();
      this.gameTypeSelected = Constants.VariableValues.gameTypes[this.selectedGame.game].text;
      if (this.gameTypeSelected === Constants.VariableValues.gameTypes['LOT'].text) {
         this.vm.yourReference = this.vm.yourReference || this.labels.lottoLabels.lottoReference;
      } else {
         this.vm.yourReference = this.vm.yourReference || this.labels.lottoLabels.powerBallReference;
      }
   }

   subscribeClientDetails() {
      this.clientProfileDetailsService.clientDetailsObserver.subscribe((data: IClientDetails) => {
         if (data && data.CellNumber) {
            this.userMobileNumber = data.CellNumber;
            if (!this.vm.notification) {
               this.vm.notification = this.notifications.find(m => m.value === Constants.notificationTypes.SMS);
               this.setUserMobile(data);
            }
         }
      });
   }

   setUserMobile(data) {
      if (data && data.CellNumber) {
            this.vm.notificationInput = data.CellNumber;
            this.onMobileNumberChange(this.vm.notificationInput);
      }
   }

   nextClick(currentStep: number) {
      this.gameService.saveSelectGameForInfo(this.vm);
      this.sendEvent('buy_' + this.gameTypeSelected + '_notification_click_on_next');
   }

   ngAfterViewInit() {
      this.selectGameForForm.valueChanges
         .subscribe(values => {
            this.validate();
         });
   }
   ngOnDestroy() {
      // Called once, before the instance is destroyed.
      // Add 'implements OnDestroy' to the class
      // To save info before going to next
      this.gameService.saveSelectGameForInfo(this.vm);
   }
   /* validate form is valid or not */
   validate() {
      this.isValid = false;
      if (this.vm.notification && ((this.vm.notification.value === Constants.notificationTypes.SMS) ||
         (this.vm.notification.value === Constants.notificationTypes.Fax))) {
         this.isValid = (this.selectGameForForm.valid
            && (this.vm.notificationInput ? CommonUtility.isValidMobile(this.vm.notificationInput) : false));
      } else if (this.vm.notification && this.vm.notification.value === Constants.notificationTypes.email) {
         this.isValid = (this.selectGameForForm.valid
            && (this.vm.notificationInput ? CommonUtility.isValidEmail(this.vm.notificationInput) : false));
      } else {
         this.isValid = this.selectGameForForm.valid;
      }
      this.gameService.gameWorkflowSteps.selectGameFor.isDirty = this.selectGameForForm.dirty;
      this.isValid = this.isValid && !this.isCellphoneEditMode;
      this.isComponentValid.emit(this.isValid);
   }

   onEditClick() {
      this.isCellphoneEditMode = true;
      this.savedMobileNumber = this.vm.notificationInput;
      this.vm.notificationInput = '';
      this.mobileNumber.nativeElement.focus();
   }

   onSaveClick() {
      if (this.selectGameForForm.controls.notificationInput.valid) {
            this.isCellphoneEditMode = false;
            this.savedMobileNumber = '';
            this.validate();
      }
   }

   onCancelClick() {
      this.isCellphoneEditMode = false;
      this.vm.notificationInput = this.savedMobileNumber;
      this.savedMobileNumber = '';
   }

   onMobileFocusOut() {
      if (this.vm.notificationInput && this.vm.notificationInput.trim() !== '') {
            this.onSaveClick();
      } else {
            if (this.savedMobileNumber && this.savedMobileNumber.trim() !== '') {
                  this.onCancelClick();
            }
      }
   }

   stepClick(stepInfo: IStepInfo) {
   }
}
