import { Component, OnInit, ViewChild, Output, EventEmitter, AfterViewInit, Injector, OnDestroy } from '@angular/core';
import { Constants } from '../../../core/utils/constants';
import { BuyElectricityService } from '../buy-electricity.service';
import { CommonUtility } from '../../../core/utils/common';
import { IBuyElectricityForVm } from '../buy-electricity.models';
import { IBuyElectricityAmountVm, IBuyElectricityToVm } from '../buy-electricity.models';
import { INotificationItem } from '../../../core/utils/models';
import { IStepInfo, IWorkflowChildComponent } from '../../../shared/components/work-flow/work-flow.models';
import { BaseComponent } from '../../../core/components/base/base.component';

@Component({
   selector: 'app-buy-electricity-for',
   templateUrl: './buy-electricity-for.component.html',
   styleUrls: ['./buy-electricity-for.component.scss']
})
export class BuyElectricityForComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy, IWorkflowChildComponent {
   @ViewChild('buyElectricityForForm') buyElectricityForForm;
   @Output() isComponentValid = new EventEmitter<boolean>();
   @Output() isButtonLoader = new EventEmitter<boolean>();
   vm: IBuyElectricityForVm;
   amountVm: IBuyElectricityAmountVm;
   toVm: IBuyElectricityToVm;
   smsMinLength = Constants.VariableValues.smsMinLength;
   smsMaxLength = Constants.VariableValues.smsMaxLength;
   referenceMaxLength = Constants.VariableValues.referenceMaxLength;
   patterns = Constants.patterns;
   messages = Constants.messages;
   labels = Constants.labels;
   notifications = CommonUtility.getNotificationTypes();
   enableNext = false;
   constructor(private buyElectricityService: BuyElectricityService, injector: Injector) {
      super(injector);
      this.vm = this.buyElectricityService.getBuyElectricityForVm();
      if (!this.vm.notificationType) {
         this.vm.notificationType = Constants.notificationTypes.none;
      }
      this.amountVm = this.buyElectricityService.getBuyElectricityAmountVm();
      this.toVm = this.buyElectricityService.getBuyElectricityToVm();
   }

   ngOnInit() {
      if (this.toVm.meterNumber !== this.vm.lastTshwanValidateNo ||
         this.amountVm.amount !== this.vm.lastTshwanValidateAmount) {
         this.getElectricityAmountInArrears();
      } else {
         this.enableNext = true;
         this.validate();
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
      this.buyElectricityForForm.valueChanges
         .subscribe(values => {
            this.validate();
         });
   }
   ngOnDestroy() {
      // Called once, before the instance is destroyed.
      // Add 'implements OnDestroy' to the class
      // To save info before going to next
      this.buyElectricityService.saveBuyElectricityForInfo(this.vm);
   }

   validate() {
      let isValid = false;
      this.isButtonLoader.emit(true);
      if ((this.vm.notificationType === Constants.notificationTypes.SMS) ||
         (this.vm.notificationType === Constants.notificationTypes.Fax)) {
         isValid = (this.buyElectricityForForm.valid
            && (this.vm.notificationInput ? CommonUtility.isValidMobile(this.vm.notificationInput) : false));
      } else if (this.vm.notificationType === Constants.notificationTypes.email) {
         isValid = (this.buyElectricityForForm.valid
            && (this.vm.notificationInput ? CommonUtility.isValidEmail(this.vm.notificationInput) : false));
      } else {
         isValid = this.buyElectricityForForm.valid;
      }
      this.buyElectricityService.electricityWorkflowSteps.buyFor.isDirty = this.buyElectricityForForm.dirty;
      if (this.enableNext) {
         this.isComponentValid.emit(isValid);
         this.isButtonLoader.emit(false);
      }
   }

   stepClick(stepInfo: IStepInfo) {
   }

   nextClick(currentStep: number) {
      this.buyElectricityService.saveBuyElectricityForInfo(this.vm);
   }

   private getElectricityAmountInArrears() {
      let amountInArrears = 0;
      this.buyElectricityService.getElectricityBillDetails().subscribe(data => {
         if (data.prepaids[0].electricityMeterDetails && data.prepaids[0].electricityMeterDetails.Municipality === 'Tshwan') {
            if (data.prepaids[0].electricityAmountInArrears) {
               amountInArrears = data.prepaids[0].electricityAmountInArrears;
            }
            if (amountInArrears > 0) {
               this.amountVm.electricityAmountInArrears = amountInArrears;
               this.buyElectricityService.saveBuyElectricityAmountInfo(this.amountVm);
            }
         }
         this.vm.lastTshwanValidateNo = this.toVm.meterNumber;
         this.vm.lastTshwanValidateAmount = this.amountVm.amount;
         this.buyElectricityService.saveBuyElectricityForInfo(this.vm);
         this.enableNext = true;
         this.validate();
      }, (error) => {
         this.isComponentValid.emit(false);
         this.isButtonLoader.emit(false);
      });
   }
}
