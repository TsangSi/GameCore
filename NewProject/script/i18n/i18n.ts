/*
 * @Author: zs
 * @Date: 2022-04-08 10:13:33
 * @FilePath: \SanGuo2.4\assets\script\i18n\i18n.ts
 * @Description:
 *
 */
import { Polyglot, PolyglotOptionsFace } from './polyglot';
import { data } from './zh-CN';

const polyglot = new Polyglot({
    phrases: data,
    allowMissing: true,
    locale: 'zh',
    interpolation: { prefix: '{{', suffix: '}}' },
});

export const Lang = data;

export class i18n {
    private static curLang = '';
    private static inst: Polyglot | null = null;
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

    /** 星 “级” 使用比较频繁 直接放入这里 */
    public static get lv(): string { return i18n.tt(Lang.equip_lev); }// 级
    public static get star(): string { return i18n.tt(Lang.equip_star); }// 星
    public static get jie(): string { return i18n.tt(Lang.com_reborn); }// 阶
    public static get ci(): string { return i18n.tt(Lang.onhook_ci); }// 次

    public static get jade(): string { return i18n.tt(Lang.com_jade); }// 玉璧
    public static get ingot(): string { return i18n.tt(Lang.com_ingot); }// 元宝
    public static get coin(): string { return i18n.tt(Lang.com_coin); }// 铜钱
    public static get exp(): string { return i18n.tt(Lang.com_exp); }// 经验
    public static get skillCoin(): string { return i18n.tt(Lang.com_skillCoin); }// 技战积分
    public static get arenacoin(): string { return i18n.tt(Lang.com_arenacoin); }// 竞技声望
    public static get skillExp(): string { return i18n.tt(Lang.com_skillExp); }// 技能经验
    public static get generalScore(): string { return i18n.tt(Lang.com_general_score); } // 武将招募积分
    public static get familyCoin(): string { return i18n.tt(Lang.family_coin); }
    public static get day(): string { return i18n.tt(Lang.com_day); }
    /**
     * 通过该接口获取文字，避免是undefined
     * @param text 文字
     * @param _opt 扩展信息
     * @returns 字符串
     */
    public static tt(text: string, ...fmt: any[]): string {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        return cc.js.formatStr(text || '多语言', ...fmt) as string;
    }
    /**
     * 根据key获取当前语言文字
     * @deprecated Please use [[ i18n.tt ]]
     * @param key key
     * @param opt 扩展信息
     * @returns 字符串
     */
    public static t(key: string, opt?: PolyglotOptionsFace): string {
        return polyglot.t(key, opt);
    }
}
