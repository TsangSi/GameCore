import { Polyglot } from './polyglot';
import { data } from '../../resources/i18n/zh-CN';

const polyglot = new Polyglot({ phrases: data, allowMissing: true });

export class i18n {
    static curLang = '';
    static inst: Polyglot | null = null;
    /**
      * This method allow you to switch language during runtime, language argument should be the same as your data file name
      * such as when language is 'zh', it will load your 'zh.js' data source.
      * @method init
      * @param language - the language specific data file name, such as 'zh' to load 'zh.js'
      */
    // static init (language:string) {
    //     if (this.curLang === language) {
    //         return;
    //     }
    //     this.curLang = language;
    //     if (data) {
    //         polyglot.replace(data);
    //     }
    //     this.inst = polyglot;
    // }

    static t (key?:any, opt?:any) {
        return <string>polyglot.t(key, opt);
    }
}
