import { IMarker } from './../services/models';
import { ISelectedBalls } from '../../buy/game/models';

export interface IDropdownItem {
   text: string;
   code: string;
}

export interface ITransactionFrequency extends IDropdownItem {
   maxValue: number;
   duration?: string;
}

export interface IBuyFrequency extends IDropdownItem {
   maxValue: number;
}

export interface INotificationItem {
   value: string;
   name: string;
}

export interface IBranchLocatorOptions extends IDropdownItem {
   maxValue: number;
}

export interface ILottoNumberPickerResult {
   value: string;
   isValid: boolean;
   selectedBalls: ISelectedBalls[];
}

export interface IMapData {
   currentLocationLatLng: IMarker;
   markers: IMarker[];
   zoom: number;
}

export interface IButtonGroup {
   label: string;
   value: string;
}

export interface IGAEvents {
   label: string;
   category: string;
   eventAction: string;
}
