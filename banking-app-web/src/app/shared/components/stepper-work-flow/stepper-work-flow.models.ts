export interface IStep {
   firstStep: string;
   secondStep: string;
   thirdStep: string;
   fourthStep: string;
}

export interface IStepComponent {
   data: any;
}

export interface IStepper {
   step: string;
   valid: boolean;
   isValueChanged: boolean;
   isVisited?: boolean;
}
