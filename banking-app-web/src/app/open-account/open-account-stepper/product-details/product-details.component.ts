import { Component, OnInit } from '@angular/core';
import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { OpenAccountService } from '../../open-account.service';
import { IStepper } from '../../../shared/components/stepper-work-flow/stepper-work-flow.models';
@Component({
   selector: 'app-product-details',
   templateUrl: './product-details.component.html',
   styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
   workflowSteps: IStepper[];
   isRightOptions: boolean;
   showProducts = true;

   constructor(private workflowService: WorkflowService,
      private openAccountService: OpenAccountService) { }

   ngOnInit() {
      this.openAccountService.setDepositDetails(null);
      this.openAccountService.setInterestDetails(null);
      this.openAccountService.setRecurringDetails(null);
      this.openAccountService.setRecurringEdit(null);
      this.openAccountService.setInterestEdit(null);
      this.openAccountService.setRealTimeInterestRate(null);
      this.isRightOptions = true;
      this.workflowSteps = this.workflowService.getWorkflow();
   }
}
