import { Observable } from 'rxjs/Observable';
import { Component, OnInit, HostListener } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Router, ActivatedRoute } from '@angular/router';

import { GameService } from '../game.service';
import { ComponentCanDeactivate } from '../../../core/guards/unsaved-changes-guard.service';
import { IWorkflowStep, IWorkflow } from '../../../shared/components/work-flow/work-flow.models';
import { GameSteps } from '../models';
import { Constants } from '../../../core/utils/constants';
import { SelectGameComponent } from '../select-game/select-game.component';
import { SelectNumbersComponent } from '../select-numbers/select-numbers.component';
import { SelectGameForComponent } from '../select-game-for/select-game-for.component';
import { SelectGameReviewComponent } from './../select-game-review/select-game-review.component';
import { ClientProfileDetailsService } from '../../../core/services/client-profile-details.service';
import { IClientDetails } from '../../../core/services/models';
import { LoaderService } from '../../../core/services/loader.service';
import { PreFillService } from '../../../core/services/preFill.service';

@Component({
   selector: 'app-landing',
   templateUrl: './landing.component.html',
   styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, ComponentCanDeactivate {
   data: {};
   isReplay: any;
   gameName: string;
   game: string;
   activeStep: number;
   code: any;
   workflowInfo: IWorkflow;
   steps: IWorkflowStep[];
   accountTypes = Constants.VariableValues.accountTypes;
   emptyStateUrl = Constants.links.nedBankEmptyStatePage;
   isAccountsOverlay = false;
   allowedAccountTypes =
      [
         this.accountTypes.currentAccountType.code,
         this.accountTypes.savingAccountType.code,
         this.accountTypes.creditCardAccountType.code
      ];
   accountNumberFromDashboard?: string;

   constructor(public gameService: GameService, private clientProfileDetailsService: ClientProfileDetailsService,
      private router: Router, private route: ActivatedRoute, private loader: LoaderService, private preFillService: PreFillService) {
      this.route.params.subscribe(params => this.accountNumberFromDashboard = params.accountnumber);
   }

   ngOnInit() {
      this.loader.show();
      if (this.preFillService.activeData) {
         this.isReplay = this.preFillService.activeData.isReplay;
      }
      if (this.isReplay) {
         this.activeStep = 2;
      } else {
         this.activeStep = 1;
      }
      this.gameService.accountsDataObserver.subscribe(response => {
         if (response) {
            response = response.filter((account) => {
               return this.allowedAccountTypes.indexOf(account.accountType) >= 0;
            });
            this.loader.hide();
            this.isAccountsOverlay = (!this.gameService.checkGameTimeOuts() && !response.length);
         }
      });
      this.gameService.initializeGameWorkflow();
      this.subscribeClientDetails();
      this.initializeWorkFlowSteps();
      this.gameService.gameWorkflowSteps.selectNumbers.model.accountNumberFromDashboard = this.accountNumberFromDashboard;
      this.workflowInfo = <IWorkflow>{
         title: 'purchase',
         cancelButtonText: Constants.VariableValues.cancelButtonText,
         cancelRouteLink: '/dashboard'
      };
   }

   canDeactivate(): Observable<boolean> | boolean {
      return !this.gameService.checkDirtySteps();
   }

   nextClick(event) {
      // setting isEdit to false so that in select-numbers component
      // it doesnt go inside replay code if user edits
      this.data = {
         isReplay: this.isReplay,
         isEdit: false
      };

      if (this.isReplay && this.preFillService.activeData) {
         this.preFillService.activeData = this.data;
      }
      this.gameService.nextClickEmitter.emit(event);
   }

   subscribeClientDetails() {
      this.clientProfileDetailsService.clientDetailsObserver.subscribe((data: IClientDetails) => {
         if (data && data.BirthDate) {
            this.checkAge(data.BirthDate);
         }
      });
   }

   checkAge(date) {
      const age = moment.duration(moment().diff(date)).years();
      if (age < Constants.VariableValues.lottoAgeLimit) {
         this.router.navigateByUrl(Constants.routeUrls.dashboard);
      }
   }

   private initializeWorkFlowSteps() {
      this.steps = [{
         summary: this.gameService.getStepSummary(GameSteps.selectGame, true),
         buttons: {
            next: this.gameService.selectGameNext,
            edit: {
               text: Constants.labels.editText
            }
         },
         component: SelectGameComponent
      },
      {
         summary: this.gameService.getStepSummary(GameSteps.selectNumbers, true),
         buttons: {
            next: {
               text: Constants.labels.nextText
            },
            edit: {
               text: Constants.labels.editText
            }
         },
         component: SelectNumbersComponent
      },
      {
         summary: this.gameService.getStepSummary(GameSteps.selectGameFor, true),
         buttons: {
            next: {
               text: Constants.labels.nextText
            },
            edit: {
               text: Constants.labels.editText
            }
         },
         component: SelectGameForComponent
      },
      {
         summary: this.gameService.getStepSummary(GameSteps.selectGameReview, true),
         buttons: {
            next: {
               text: Constants.labels.buyLabels.buyReviewBtnText
            },
            edit: {
               text: Constants.labels.editText
            }
         },
         component: SelectGameReviewComponent
      }];
      if (this.isReplay) {
         this.game = this.preFillService.preFillReplayData.game;
         if (this.game === Constants.lottoConst.lottoType) {
            this.gameName = Constants.lottoConst.lottoLable;
         } else {
            this.gameName = Constants.lottoConst.pwbLable;
         }
         if (this.steps[0].summary && this.steps[0].buttons) {
            this.steps[0].summary.title = Constants.lottoConst.playingText + this.gameName;
            this.steps[0].buttons.edit.text = Constants.lottoConst.emptyString;
         }
      }
   }
}
