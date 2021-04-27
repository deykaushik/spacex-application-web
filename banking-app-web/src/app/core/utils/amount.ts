import { Constants } from './constants';

export class AmountUtility {

   /*  */
   public static amountSplit(value, splitBy) {
      const pattern = Constants.patterns.split;
      return value.replace(pattern, splitBy);
   }
   public static amountOnly(value) {
      const pattern = Constants.patterns.amountOnly;
      return value.replace(pattern, '');
   }
   public static removeDecimal(value) {
      const pattern = Constants.patterns.removeDecimal;
      return value.replace(pattern, '');
   }

}
