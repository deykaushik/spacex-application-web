import { Component, OnInit, ViewChild, Output, EventEmitter, AfterViewInit, Injector, OnDestroy } from '@angular/core';
import { Constants } from '../../../core/utils/constants';
import { BuyService } from '../buy.service';
import { CommonUtility } from '../../../core/utils/common';
import { IBuyForVm } from '../buy.models';
import { INotificationItem } from '../../../core/utils/models';
import { IStepInfo, IWorkflowChildComponent } from '../../../shared/components/work-flow/work-flow.models';
import { BaseComponent } from '../../../core/components/base/base.component';
@Component({
   selector: 'app-buy-for',
   templateUrl: './buy-for.component.html',
   styleUrls: ['./buy-for.component.scss']
})
export class BuyForComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy, IWorkflowChildComponent {
   @ViewChild('buyForForm') buyForForm;
   @Output() isComponentValid = new EventEmitter<boolean>();
   vm: IBuyForVm;
   smsMinLength = Constants.VariableValues.smsMinLength;
   smsMaxLength = Constants.VariableValues.smsMaxLength;
   referenceMaxLength = Constants.VariableValues.referenceMaxLength;
   patterns = Constants.patterns;
   messages = Constants.messages;
   labels = Constants.labels;
   notifications = CommonUtility.getNotificationTypes();
   constructor(private buyService: BuyService, injector: Injector) {
      super(injector);
    }

   ngOnInit() {
      this.vm = this.buyService.getBuyForVm();
      if (!this.vm.notificationType) {
         this.vm.notificationType = Constants.notificationTypes.none;
      }
   }

   onNotificationChange(notification: INotificationItem) {
      this.vm.notificationType = notification.value;
      this.vm.notificationInput = '';
   }

   onMobileNumberChange(number) {
      this.validate();
   }

   ngAfterViewInit() {
      this.buyForForm.valueChanges
         .subscribe(values => {
            this.validate();
         });
   }
   ngOnDestroy() {
      // Called once, before the instance is destroyed.
      // Add 'implements OnDestroy' to the class
      // To save info before going to next
      this.buyService.saveBuyForInfo(this.vm);
   }
   validate() {
      let isValid = false;
      if ((this.vm.notificationType === Constants.notificationTypes.SMS) ||
         (this.vm.notificationType === Constants.notificationTypes.Fax)) {
         isValid = (this.buyForForm.valid
            && (this.vm.notificationInput ? CommonUtility.isValidMobile(this.vm.notificationInput) : false));
      } else if (this.vm.notificationType === Constants.notificationTypes.email) {
         isValid = (this.buyForForm.valid
            && (this.vm.notificationInput ? CommonUtility.isValidEmail(this.vm.notificationInput) : false));
      } else {
         isValid = this.buyForForm.valid;
      }
      this.buyService.buyWorkflowSteps.buyFor.isDirty = this.buyForForm.dirty;
      this.isComponentValid.emit(isValid);
   }

   stepClick(stepInfo: IStepInfo) {
   }

   nextClick(currentStep: number) {
      this.sendEvent('buy_prepaid_notification_click_on_next');
      this.buyService.saveBuyForInfo(this.vm);
   }
}
