import { Component, OnInit } from '@angular/core';
import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { CreditLimitService } from '../credit-limit.service';
import { CreditLimitMaintenance } from '../credit-limit-constants';
import { IStepper } from '../../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { ICreditLimitMaintenance } from '../../../core/services/models';
import { Constants } from '../../../core/utils/constants';

@Component({
   selector: 'app-income-expenses',
   templateUrl: './income-expenses.component.html',
   styleUrls: ['./income-expenses.component.scss']
})
export class IncomeExpensesComponent implements OnInit {
   labels = CreditLimitMaintenance.labels;
   messages = CreditLimitMaintenance.messages;
   tooltipOptions = CreditLimitMaintenance.tooltipValues.income;
   otherSource: boolean;
   addSource: boolean;
   workflowSteps: IStepper[];
   creditLimitDetails: ICreditLimitMaintenance;
   pattern = Constants.patterns;
   isValidNetIncome: boolean;

   constructor(private workflowService: WorkflowService, private creditLimitService: CreditLimitService) { }

   ngOnInit() {
      this.creditLimitDetails = {} as ICreditLimitMaintenance;
      this.otherSource = false;
      this.addSource = true;
      this.isValidNetIncome = true;
      this.workflowSteps = this.workflowService.workflow;
      this.creditLimitDetails = this.creditLimitService.getCreditLimitMaintenanceDetails();
   }

   addOtherSource() {
      this.otherSource = true;
      this.addSource = false;
   }
   closeTooltips() {
      this.tooltipOptions.forEach((option) => {
         option.isOpen = false;
      });
   }

   onFocus() {
      this.closeTooltips();
   }

   openTooltip(value) {
      this.closeTooltips();
      this.tooltipOptions.forEach((option) => {
         if (option.text === value.text) {
            value.isOpen = !value.isOpen;
         }
      });
   }

   goToDocuments(event) {
      if (!event && this.isValidNetIncome) {
         this.creditLimitService.setCreditLimitMaintenanceDetails(this.creditLimitDetails);
         this.workflowSteps[0] = { step: this.workflowSteps[0].step, valid: true, isValueChanged: false };
         this.workflowService.workflow = this.workflowSteps;
         this.workflowService.stepClickEmitter.emit(this.workflowSteps[1].step);
      }
   }

   onGrossIncomeChange(event) {
      this.creditLimitDetails.grossMonthlyIncome = this.replaceAmount(event);
      this.isValidNetIncome = this.creditLimitDetails.netMonthlyIncome ?
         this.creditLimitDetails.netMonthlyIncome < this.creditLimitDetails.grossMonthlyIncome : true;
   }

   onNetIncomeChange(event) {
      this.creditLimitDetails.netMonthlyIncome = this.replaceAmount(event);
      this.isValidNetIncome = this.creditLimitDetails.grossMonthlyIncome ?
         this.creditLimitDetails.netMonthlyIncome < this.creditLimitDetails.grossMonthlyIncome : false;
   }

   replaceAmount(amount): number {
      const income = amount.target.value.substr(1, amount.target.value.length)
         .replace(this.pattern.replaceSplittedNumberWithoutSpace, '');
      return parseInt(income, 10);
   }

}
