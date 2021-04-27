export interface IRangeSliderConfig {
   min?: number;
   max: number;
   step: number;
}

export interface ISubmenu {
   text: string;
   iconCls: string;
   path: string;
   termsText: string;
   termsTypes: string[];
}

export interface IHeaderMenuModel {
   iconCls: string;
   text: string;
   path: string;
   subMenu?: IHeaderMenuModel[];
   mobOnly?: boolean;
   activeRoutes?: String[];
   active?: boolean;
   eventAction?: string;
}
export interface IRangeSliderMessages {
   requiredMsg: string;
   divisibleMsg: string;
   maximumMsg: string;
   customMsg?: string;
   serviceErrorMessage?: string;
}

export interface IRangeSliderEmitModel {
   value: number;
   isValid?: boolean;
}

export interface ILimitDetailsEmitModel {
   rangeSlider: IRangeSliderEmitModel;
}
