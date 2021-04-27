import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AddStepItem } from '../../../../../shared/components/stepper-work-flow/add-step-item';
import { WorkflowService } from '../../../../../core/services/stepper-work-flow-service';
import { Constants } from '../../../../../core/utils/constants';
import { TravelInformationComponent } from '../travel-information/travel-information.component';
import { DriverInformationComponent } from '../driver-information/driver-information.component';
import { EmailComponent } from '../email/email.component';
import { AccountService } from '../../../../account.service';
import { ICrossBorderRequest } from '../../../../../core/services/models';

@Component({
   selector: 'app-mfc-landing',
   templateUrl: './mfc-landing.component.html',
   styleUrls: ['./mfc-landing.component.scss']
})
export class MfcLandingComponent implements OnInit, OnDestroy {

   accountId: string;
   labels = Constants.labels.statementAndDocument.documents.mfc;
   values = Constants.VariableValues.statementAndDocument;
   steppers: AddStepItem[];
   footerStepper: AddStepItem[];
   navigationSteps: string[];
   exitUrl: string;
   mfcCrossBorderRequest: ICrossBorderRequest;

   constructor(private workflowService: WorkflowService,
      private render: Renderer2,
      private accountService: AccountService, private route: ActivatedRoute) {
      this.route.params.subscribe(params => this.accountId = params.accountId);
   }

   ngOnInit() {
      this.render.setStyle(document.body, 'overflow-y', 'hidden');
      this.mfcCrossBorderRequest = {} as ICrossBorderRequest;
      this.mfcCrossBorderRequest.itemAccountId = this.accountId;
      this.mfcCrossBorderRequest.documentType = this.values.mfcCrossBorderLetter;
      this.accountService.setMfcCrossBorderRequest(this.mfcCrossBorderRequest);
      this.exitUrl = encodeURI(Constants.routeUrls.statementDocument + this.accountId);
      this.navigationSteps = [];
      this.steppers = [
         new AddStepItem(TravelInformationComponent),
         new AddStepItem(DriverInformationComponent),
         new AddStepItem(EmailComponent),
      ];
      this.navigationSteps = this.labels.steps;
      this.workflowService.workflow = [
         { step: this.navigationSteps[0], valid: false, isValueChanged: false },
         { step: this.navigationSteps[1], valid: false, isValueChanged: false },
         { step: this.navigationSteps[2], valid: false, isValueChanged: false },
      ];
   }

   ngOnDestroy() {
      this.render.setStyle(document.body, 'overflow-y', 'auto');
   }
}
