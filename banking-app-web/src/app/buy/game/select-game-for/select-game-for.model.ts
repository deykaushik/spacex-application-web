import { Constants } from './../../../core/utils/constants';
import { MobileNumberMaskPipe } from './../../../shared/pipes/mobile-number-mask.pipe';

import { IWorkflowModel, IWorkflowStepSummary } from '../../../shared/components/work-flow/work-flow.models';
import { ISelectGameForVm } from '../models';

export class SelectGameForModel implements IWorkflowModel {
   yourReference: string;
   notification: any;
   notificationInput: string;

   getStepTitle(isNavigated: boolean, isDefault: boolean): string {
      let title = '';
      if (isNavigated && !isDefault) {
         if (this.notificationInput && this.notification.name) {
            title += `Send an ${this.notification.name}` + ` notification to ${this.notification.name === Constants.notificationTypes.SMS ?
               new MobileNumberMaskPipe().transform(this.notificationInput, 4) : this.notificationInput}. `;
         }
         title += `Your reference: ${this.yourReference}`;
      } else {
         title = Constants.labels.lottoLabels.selectGameForTitle;
      }
      return title;
   }
   getViewModel(): ISelectGameForVm {
      return {
         yourReference: this.yourReference,
         notification: this.notification,
         notificationInput: this.notificationInput
      };
   }

   updateModel(vm: ISelectGameForVm): void {
      this.yourReference = vm.yourReference;
      this.notification = vm.notification;
      this.notificationInput = vm.notificationInput;
   }
}
