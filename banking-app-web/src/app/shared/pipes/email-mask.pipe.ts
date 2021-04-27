import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
   name: 'emailMask'
})
export class EmailMaskPipe implements PipeTransform {

   OBFUSCATE_EMAIL_NAME_TWO_CHARS_PATTERN = /([^\s])([^\s])+/;
   OBFUSCATE_EMAIL_NAME_PATTERN = /([^\s]{2})([^\s])+/;
   OBFUSCATE_EMAIL_DOMAIN_PATTERN = /(\w)+(\.[^\s.]+)/;
   OBFUSCATE_EMAIL_NAME_MASK = '$1***';
   OBFUSCATE_EMAIL_DOMAIN_MASK = '***$2';

   transform(value: string): any {
      return value ? this.emailMask(value) : value;
   }

   private emailMask(email: String) {
      const index = email.split('@');
      const atSignSplit = email.split('@');
      if (atSignSplit.length !== 2) {
          return '';
      }
      const emailName = atSignSplit[0];
      const domainName = atSignSplit[1];
      const obfuscatedName = this.obfuscateName(emailName);
      const obfuscatedDomain = domainName.replace(this.OBFUSCATE_EMAIL_DOMAIN_PATTERN, this.OBFUSCATE_EMAIL_DOMAIN_MASK);

       return obfuscatedName + '@' + obfuscatedDomain;
   }

   obfuscateName(name: String): String {
      switch (name.length) {
          case 1:
              return name;
          case 2:
              return name.replace(this.OBFUSCATE_EMAIL_NAME_TWO_CHARS_PATTERN, this.OBFUSCATE_EMAIL_NAME_MASK);
          default:
              return name.replace(this.OBFUSCATE_EMAIL_NAME_PATTERN, this.OBFUSCATE_EMAIL_NAME_MASK);
      }
   }

}
