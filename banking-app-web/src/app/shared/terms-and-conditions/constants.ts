export class TermsAndConditionsConstants {

   public static excludeGeneralTermsTypes: string[] = ['OOO', 'LTO', 'PPE', 'LLL', 'TTT', 'AAB', 'HLN', 'AAC', 'HHH', 'DDD', 'EEE'];
   public static includeTermsPrepaid: string[] = ['PPE'];
   public static includeTermsLotto: string[] = ['LTO'];
   public static includeTermsUnitTrusts: string[] = ['TTT'];
   public static includeTermsGBEnrolment: string[] = ['LLL'];
   public static includeTermsUpdateMFC: string[] = ['DDD'];
   public static includeTermsUpdateHLN: string[] = ['HLN'];

   public static contentLatest = 'latest';
   public static contentAccepted = 'accepted';

   public static TermsGeneralHtml = 'https://www.nedbank.co.za/content/nedbank/desktop/gt/en/aboutus/legal/terms-conditions.html';
   public static removeSpecialChars = /[^ -~]/g;
   public static lessThanCode = '&lt;';
   public static lessThanSign = '<';
   public static greaterThanCode = '&gt;';
   public static greaterThanSign = '>';
   public static removeNbsp = /&nbsp;/g;
}
