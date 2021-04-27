import { ISelectGameNotification, IPurchaseAccount } from './../../core/services/models';

import { SelectGameModel } from './select-game/select-game-model';
import { SelectNumbersModel } from './select-numbers/select-numbers-model';
import { SelectGameForModel } from './select-game-for/select-game-for.model';
import { SelectGameReviewModel } from './select-game-review/select-game-review.model';

import * as models from '../../core/services/models';
import { IWorkflowStepModel } from '../../shared/components/work-flow/work-flow.models';

import { IAccountDetail } from '../../core/services/models';

export enum GameTypes {
   lotto = 1
}

export enum GameCodes {
   PWB,
   LOT
}
export enum GameSteps {
   selectGame = 1,
   selectNumbers = 2,
   selectGameFor = 3,
   selectGameReview = 4
}

export enum LottoGameSteps {
   buyTicket = 1
}

export interface IGameWorkflowSteps {
   selectGame: IWorkflowStepModel<SelectGameModel>;
   selectNumbers: IWorkflowStepModel<SelectNumbersModel>;
   selectGameFor: IWorkflowStepModel<SelectGameForModel>;
   selectGameReview: IWorkflowStepModel<SelectGameReviewModel>;
}

export interface ISelectGameVm {
   game: string;
   method: string;
}

export interface IGameDrawInfo {
   drawDate: Date;
}

export interface IBoard {
   BoardNumber: string;
   NumbersPlayed: string;
}

export interface ISelectedBalls {
   numberValue: number;
   className: string;
}

export class Board implements IBoard {
   BoardNumber: string;
   NumbersPlayed: string;
   isValid: boolean;
   SelectedBalls?: ISelectedBalls[];
   boardNumber?: string;
   numbersPlayed?: string;
}

export class DummyBoard implements IBoard {
   BoardNumber: string;
   NumbersPlayed: string;
   isValid: boolean;
   SelectedBalls?: ISelectedBalls;
   boardNumber?: string;
   numbersPlayed?: string;
   selectedBalls?: ISelectedBalls;
}

export interface ISelectNumbersVm {
   BoardDetails: Board[];
   boardDetails?: Board[];
   BoardsPlayed: number;
   DrawsPlayed: number;
   DrawNumber: IGameDrawDetails;
   DrawDate: Date;
   TotalCost: number;
   IsLottoPlus?: boolean;
   IsLottoPlusTwo?: boolean;
   boardsPlayed?: number;
   drawsPlayed?: number;
   drawNumber?: IGameDrawDetails;
   drawDate?: Date;
   totalCost?: number;
   FromAccount: IAccountDetail;
   fromAccount?: IAccountDetail;
   isValid: boolean;
   game: string;
   method: string;
   accountNumberFromDashboard?: string;
   isReplay?: boolean;
   isViewMore?: boolean;
   gameType?: string;
   isLottoPlus?: boolean;
   isLottoPlusTwo?: boolean;
   batchID?: number;
}

export interface IGameMetaData {
   boardPrice: number;
   gameType: string;
   gameTypeName: string;
   lottoBallMatrixMax?: number;
   lottoBallMatrixMin?: number;
   lottoPlusPrice: number;
   lottoPlusTwoPrice: number;
   maxNumberOfBoardsAllowed: number;
   maxNumberOfDrawsAllowed: number;
   minimumNumberOfBoardsAllowed: number;
   minimumNumberOfDrawsAllowed: number;
   powerBallMatrixMax?: number;
   powerBallMatrixMin?: number;
   powerBallBonusBallMatrixMax?: number;
   powerBallBonusBallMatrixMin?: number;
}
export interface IGameTimeMetaData {
   gameType: string;
   gameTypeName: string;
   startTime: string;
   cutOffTimes: Array<any>;
   drawDays: Array<any>;
   postponed?: boolean;
   boardPrice?: number;
   lottoPlusPrice?: number;
   lottoPlusTwoPrice?: number;
   maxNumberOfBoardsAllowed?: number;
   maxNumberOfDrawsAllowed?: number;
   minimumNumberOfBoardsAllowed?: number;
   minimumNumberOfDrawsAllowed?: number;
   lottoBallMatrixMin?: number;
   lottoBallMatrixMax?: number;
   powerBallMatrixMin?: number;
   powerBallMatrixMax?: number;
   powerBallBonusBallMatrixMin?: number;
   powerBallBonusBallMatrixMax?: number;
}

export interface IGameDrawDetails {
   drawDate: Date;
   drawName: String;
   gameName?: String;
   game?: string;
   drawNumber: number;
   nextDrawDate: Date;
   jackpotAmount?: number;
}
export interface ISelectGameForVm {
   yourReference: string;
   notificationInput: string;
   notification: any;
   accountNumberFromDashboard?: string;
}
export class SelectGameNotification implements ISelectGameNotification {
   notificationType: string;
   notificationAddress: string;
   constructor(NotificationType, NotificationAddress) {
      this.notificationType = String(NotificationType.value).toUpperCase().toString();
      this.notificationAddress = NotificationAddress || '';
   }
}
export class GameDetail implements models.IGameData {
   ClientRequestedDate?: string;
   FromAccount: IPurchaseAccount;
   Game?: string;
   GameType?: string;
   DrawNumber?: number;
   DrawDate?: string;

   DrawsPlayed?: number;
   BoardsPlayed?: number;
   isLottoPlus?: boolean;
   isLottoPlusTwo?: boolean;
   MyDescription?: string;
   Favourite?: boolean;
   BoardDetails?: IBoard[];
   NotificationDetails?: SelectGameNotification[];
}
export interface IGameDayTimeSheet {
   code: string;
   startTime: string;
   endTime: string;
   text?: string;
}

export interface ILottoHistoryList {
   capturedDate: string;
   amount: number;
   clientRequestedDate: string;
   purchaseDate: string;
   ticketRequestedTime: string;
   myDescription: string;
   game: string;
   gameType: string;
   drawNumber: number;
   drawDate: string;
   drawsPlayed: number;
   boardsPlayed: number;
   isLottoPlus: boolean;
   isLottoPlusTwo: boolean;
   ticketStatus: string;
}
export interface IBallDetail {
   sequenceNumber: string;
   ballNumber: number;
}

export interface IWinnerDetail {
   divisionNumber: number;
   payoutAmount: number;
   numberOfWinners: number;
   winnerLabel?: string;
}

export interface IProvincialWinner {
   wCWinners: number;
   nCWinners: number;
   eCWinners: number;
   mPWinners: number;
   lPWinners: number;
   fSWinners: number;
   kZNWinners: number;
   nWWinners: number;
}

export interface IDrawResult {
   drawName: string;
   drawDate: string;
   nextDrawDate: string;
   drawNumber: number;
   ballDetails: IBallDetail[];
   winnerDetails: IWinnerDetail[];
   rolloverAmount: number;
   rolloverNumber: number;
   totalPrizePoolAmount: number;
   totalSalesAmount: number;
   estimatedJackpotAmount: number;
   guaranteedJackpotAmount: number;
   drawMachineName: string;
   ballSetNumber: string;
   provincialWinners: IProvincialWinner;
}

export interface IReplayData {
   isReplay?: boolean;
   isEdit?: boolean;
   drawName?: string;
}

export interface ILottoDrawDays {
   code?: string;
   text?: string;
}

export interface ILottoCutOfTime {
   DRAW?: string;
   NORM?: string;
   SUN?: string;
}
