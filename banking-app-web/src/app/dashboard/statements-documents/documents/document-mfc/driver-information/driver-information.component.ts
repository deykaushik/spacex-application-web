import { Component, OnInit } from '@angular/core';
import { WorkflowService } from '../../../../../core/services/stepper-work-flow-service';
import { IStepper } from '../../../../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { Constants } from '../../../../../core/utils/constants';
import { IToggleButtonGroup, IButtonGroup, ICrossBorderRequest, IDriverDetails } from '../../../../../core/services/models';
import { AccountService } from '../../../../account.service';

@Component({
   selector: 'app-driver-information',
   templateUrl: './driver-information.component.html',
   styleUrls: ['./driver-information.component.scss']
})
export class DriverInformationComponent implements OnInit {

   labels = Constants.labels.statementAndDocument.documents.mfc.driverInformation;
   values = Constants.VariableValues.statementAndDocument.documents.mfc;
   messages = Constants.messages;
   workflowSteps: IStepper[];
   toggleButtonGroup: IToggleButtonGroup;
   buttonGroup: IButtonGroup[] = this.labels.nominateDriver;
   buttonGroupWidth: number;
   isDriverNominate: string;
   mfcCrossBorderRequest: ICrossBorderRequest;
   driverInfoList: IDriverDetails[];
   numberOfDriverInfo: number;
   driverIndex: number;

   constructor(private workflowService: WorkflowService, private accountService: AccountService) { }

   ngOnInit() {
      this.driverIndex = 0;
      this.mfcCrossBorderRequest = this.accountService.getMfcCrossBorderRequest();
      this.workflowSteps = this.workflowService.workflow;
      this.isDriverNominate = this.buttonGroup[1].value;
      this.toggleButtonGroup = {
         buttonGroup: this.buttonGroup,
         buttonGroupWidth: this.buttonGroupWidth,
         groupName: '',
         isGroupDisabled: false
      };
      this.driverInfoList = this.mfcCrossBorderRequest.crossBorder.driverDetails;
      this.numberOfDriverInfo = this.driverInfoList ? this.driverInfoList.length : 1;
      if (this.driverInfoList) {
         this.numberOfDriverInfo = this.driverInfoList.length;
      } else {
         this.numberOfDriverInfo = 1;
         this.driverInfoList = [];
         this.addDriverInfo();
      }
   }

   onNextClick() {
      this.mfcCrossBorderRequest.crossBorder.driverDetails = this.driverInfoList;
      this.workflowSteps[1] = { step: this.workflowSteps[1].step, valid: true, isValueChanged: false };
      this.workflowService.workflow = this.workflowSteps;
      this.workflowService.stepClickEmitter.emit(this.workflowSteps[2].step);
   }

   onTypeChange(event) {
      this.isDriverNominate = event.value;
   }

   addDriverInfo() {
      if (this.numberOfDriverInfo < this.values.noOfDriverInfo) {
         const driverInfo = {
            id: ++this.driverIndex,
            name: '',
            surname: '',
            driverLicenseNumber: '',
            idOrPassportNumber: ''
         };
         this.driverInfoList.push(driverInfo);
         this.numberOfDriverInfo++;
      }
   }
}
