import { IWorkflowModel } from '../../../shared/components/work-flow/work-flow.models';
import { ISelectGameVm } from '../models';
import { Constants } from '../../../core/utils/constants';

export class SelectGameModel implements IWorkflowModel {

   game = Constants.VariableValues.gameTypes.LOT.code;
   method = Constants.VariableValues.playMethods.quickPick.code;

   getStepTitle(isNavigated: boolean, isDefault: boolean): string {
      let title: string;
      if (isNavigated && !isDefault) {
         title = 'You\'re playing ' + (this.game === Constants.VariableValues.gameTypes.LOT.code ? 'LOTTO' : 'PowerBall');
      } else {
         title = Constants.labels.lottoLabels.selectGameTitle;
      }
      return title;
   }

   getViewModel(): ISelectGameVm {
      return {
         game: this.game,
         method: this.method
      };
   }

   updateModel(vm: ISelectGameVm) {
      this.game = vm.game;
      this.method = vm.method;
   }
}
