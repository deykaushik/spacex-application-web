import { DecimalPipe } from '@angular/common';

import { Constants } from './../../../core/utils/constants';
import { CommonUtility } from './../../../core/utils/common';

import { IGameDrawDetails } from './../models';
import { IWorkflowModel } from '../../../shared/components/work-flow/work-flow.models';
import { ISelectNumbersVm, Board } from '../models';
import { IAccountDetail } from '../../../core/services/models';
import { AmountTransformPipe } from './../../../shared/pipes/amount-transform.pipe';

export class SelectNumbersModel implements IWorkflowModel {

   BoardDetails: Board[];
   IsLottoPlus?: boolean;
   IsLottoPlusTwo: boolean;
   BoardsPlayed: number;
   DrawsPlayed: number;
   DrawNumber: IGameDrawDetails;
   TotalCost: number;
   FromAccount: IAccountDetail;
   isValid: boolean;
   game: string;
   method: string;
   amountTransform = new AmountTransformPipe();
   accountNumberFromDashboard?: string;
   getStepTitle(isNavigated: boolean, isDefault: boolean): string {
      let title = '';
      if (isNavigated && !isDefault) {
         title =
            `You're playing ${CommonUtility.convertNumbertoWords(this.BoardsPlayed)} board${this.BoardsPlayed > 1 ? 's' : ''}`;
         if (this.IsLottoPlus || this.IsLottoPlusTwo) {
            title = title + ` with`;
         }
         if (this.IsLottoPlus) {
            title = title + (this.game === Constants.VariableValues.gameTypes.LOT.code ? ' LOTTO PLUS 1' : ' PowerBall PLUS');
         }
         if (this.IsLottoPlus && this.IsLottoPlusTwo) {
            title = title + ` and`;
         }
         if (this.IsLottoPlusTwo) {
            title = title + ` LOTTO PLUS 2`;
         }
         const total = this.amountTransform.transform((this.TotalCost).toFixed(2) + '');
         title = title +
            ` for ${CommonUtility.convertNumbertoWords(this.DrawsPlayed)} draw${(this.DrawsPlayed > 1 ? 's' : '')}. ` +
            `${total} will be paid from your account-${this.FromAccount.nickname}`;
      } else {
         if (this.method === Constants.VariableValues.playMethods.quickPick.code) {
            title = Constants.labels.lottoLabels.selectBoardsTitle;
         } else {
            title = Constants.labels.lottoLabels.selectNumbersTitle;
         }
      }
      return title;
   }

   getViewModel(): ISelectNumbersVm {
      return {
         BoardDetails: this.BoardDetails,
         IsLottoPlus: this.IsLottoPlus,
         IsLottoPlusTwo: this.IsLottoPlusTwo,
         BoardsPlayed: this.BoardsPlayed,
         DrawsPlayed: this.DrawsPlayed,
         DrawNumber: this.DrawNumber,
         DrawDate: new Date(),
         TotalCost: this.TotalCost,
         FromAccount: this.FromAccount,
         isValid: this.isValid,
         game: this.game,
         method: this.method,
         accountNumberFromDashboard: this.accountNumberFromDashboard
      };
   }
   updateGameMethod(method: string) {
      this.method = method;
   }
   updateModel(vm: ISelectNumbersVm) {
      this.BoardDetails = vm.BoardDetails;
      this.IsLottoPlus = vm.IsLottoPlus;
      this.IsLottoPlusTwo = vm.IsLottoPlusTwo;
      this.BoardsPlayed = vm.BoardsPlayed;
      this.DrawsPlayed = vm.DrawsPlayed;
      this.DrawNumber = vm.DrawNumber;
      this.TotalCost = vm.TotalCost;
      this.FromAccount = vm.FromAccount;
      this.isValid = vm.isValid;
      this.game = vm.game;
      this.method = vm.method;
      this.accountNumberFromDashboard = vm.accountNumberFromDashboard;
   }
}
