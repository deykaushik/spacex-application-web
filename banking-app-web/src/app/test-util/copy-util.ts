import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class TestCopyUtil {
   static toString = Object.prototype.toString;
   public static deepCopy(obj): any {
       let rv;

       switch (typeof obj) {
          case 'object':
                if (obj === null) {
                   rv = null;
               } else if (obj instanceof Subject ||
                  obj instanceof BehaviorSubject ||
                  obj instanceof Observable) {
                   rv = obj;
               } else {
                   switch (toString.call(obj)) {
                       case '[object Array]':
                           rv = obj.map(TestCopyUtil.deepCopy);
                           break;
                       case '[object Date]':
                           rv = new Date(obj);
                           break;
                       case '[object RegExp]':
                           rv = new RegExp(obj);
                           break;
                       default:
                           rv = Object.keys(obj).reduce(function(prev, key) {
                               prev[key] = TestCopyUtil.deepCopy(obj[key]);
                               return prev;
                           }, {});
                           break;
                   }
               }
               break;
           default:
               rv = obj;
               break;
       }
       return rv;
   }
}
