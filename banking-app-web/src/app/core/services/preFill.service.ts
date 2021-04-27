import { Injectable } from '@angular/core';
import {
   IBeneficiaryData, IDashboardAccount, ISettlementDetail, IAccountBalanceDetail, IChatData, IPlasticCard,
   IHomeLoanStatus
} from './models';
import { ISelectNumbersVm, IReplayData } from '../../buy/game/models';
import { IAutoPayDetail } from '../../cards/apo/apo.model';

@Injectable()
export class PreFillService {
   private _preFillReplayData: ISelectNumbersVm;
   private _preFillActiveData: IReplayData;
   private _preFillChatData: IChatData;
   selectedAccount: IDashboardAccount;
   private _preFillBeneficiaryData: IBeneficiaryData;
   private _settlementDetail: ISettlementDetail;
   private selectedBuildingAccount: IAccountBalanceDetail;
   private _preFillAutoPayDetail: IAutoPayDetail;
   private _preFillOperationMode: string;
   // Home loan status data
   private _homeLoanStatusData: IHomeLoanStatus;

   set preFillBeneficiaryData(data: IBeneficiaryData) {
      this._preFillBeneficiaryData = data;
   }
   get preFillBeneficiaryData(): IBeneficiaryData {
      const temp = this._preFillBeneficiaryData;
      this._preFillBeneficiaryData = null;
      return temp;
   }

   set preFillReplayData(data: ISelectNumbersVm) {
      this._preFillReplayData = data;
   }

   get preFillReplayData(): ISelectNumbersVm {
      const temp = this._preFillReplayData;
      return temp;
   }

   set activeData(data: IReplayData) {
      this._preFillActiveData = data;
   }

   get activeData(): IReplayData {
      const temp = this._preFillActiveData;
      return temp;
   }

   set settlementDetail(data: ISettlementDetail) {
      this._settlementDetail = data;
   }

   get settlementDetail(): ISettlementDetail {
      return this._settlementDetail;
   }

   set chatData(data: IChatData) {
      this._preFillChatData = data;
   }

   get chatData(): IChatData {
      const temp = this._preFillChatData;
      return temp;
   }
   set buildingBalanceData(data: IAccountBalanceDetail) {
      this.selectedBuildingAccount = data;
   }

   get buildingBalanceData(): IAccountBalanceDetail {
      return this.selectedBuildingAccount;
   }

   set preFillAutoPayDetail(value: IAutoPayDetail) {
      this._preFillAutoPayDetail = value;
   }

   get preFillAutoPayDetail() {
      return this._preFillAutoPayDetail;
   }

   set preFillOperationMode(value: string) {
      this._preFillOperationMode = value;
   }

   get preFillOperationMode() {
      return this._preFillOperationMode;
   }

   /**
   * Fetch the stored home loan status details
   *
   * @returns {IHomeLoanStatus}
   * @memberof PreFillService
   *
   */
   get homeLoanStatusData(): IHomeLoanStatus {
      return this._homeLoanStatusData;
   }

   /**
    * Store the home loan status details
    *
    * @param {IHomeLoanStatus} homeLoanStatusData
    * @memberof PreFillService
    *
    */
   set homeLoanStatusData(homeLoanStatusData: IHomeLoanStatus) {
      this._homeLoanStatusData = homeLoanStatusData;
   }

   constructor() { }
}
