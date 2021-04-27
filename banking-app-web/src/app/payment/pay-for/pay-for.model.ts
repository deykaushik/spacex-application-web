import { Constants } from './../../core/utils/constants';
import { IWorkflowModel, IWorkflowStepSummary } from '../../shared/components/work-flow/work-flow.models';
import { IPayForVm } from '../payment.models';
import { IContactCardNotification } from './../../core/services/models';

export class PayForModel implements IWorkflowModel {
   yourReference: string;
   theirReference: string;
   notification: any;
   notificationInput: string;
   contactCardNotifications?: IContactCardNotification[];
   paymentReason: any;
   crossBorderSmsNotificationInput: string;
   getStepTitle(isNavigated: boolean, isDefault: boolean, crossBorderPayment?: boolean): string {
      let title = '';
      if (isNavigated && !isDefault) {
         title = `Your reference: ${this.yourReference}`;
         if (this.theirReference) {
            title += ` | Their reference: ${this.theirReference}`;
         }
         if (this.notificationInput && this.notification.name) {
            if ( !crossBorderPayment ) {
               title += `. Send notification by ${this.notification.name.toLowerCase()} to ${this.notificationInput.toLowerCase()}`;
            }
         }
      } else {
         title = Constants.labels.payForTitle;
      }
      return title;
   }
   getViewModel(): IPayForVm {
      return {
         yourReference: this.yourReference,
         theirReference: this.theirReference,
         notification: this.notification,
         notificationInput: this.notificationInput,
         contactCardNotifications: this.contactCardNotifications,
         paymentReason: this.paymentReason,
         crossBorderSmsNotificationInput: this.crossBorderSmsNotificationInput
      };
   }

   updateModel(vm: IPayForVm): void {
      this.yourReference = vm.yourReference;
      this.theirReference = vm.theirReference;
      this.notification = vm.notification;
      this.notificationInput = vm.notificationInput;
      this.contactCardNotifications = vm.contactCardNotifications;
      this.paymentReason = vm.paymentReason;
      this.crossBorderSmsNotificationInput = vm.crossBorderSmsNotificationInput;
   }
}
