/*
 * @Author: kexd
 * @Date: 2022-10-26 17:22:18
 * @FilePath: \SanGuo2.4\assets\script\game\base\utils\UtilCurrency.ts
 * @Description:
 *
 */
import { i18n } from '../../../i18n/i18n';
import { ItemCurrencyId } from '../../com/item/ItemConst';
import { RES_ENUM } from '../../const/ResPath';
import UtilItem from './UtilItem';

export class UtilCurrency {
    /**
     * 根据货币类型 获取货币图标
     * @param currencyType 属性类型
     * @returns 图标路径
     * @author ylj
     */
    public static getIconByCurrencyType(currencyType: number, isBig?: boolean): string {
        if (isBig) {
            return `${RES_ENUM.Item}${currencyType}`; // 大图标;
        }
        return `${RES_ENUM.Item}${currencyType}_h`; // 小图标
    }

    public static getNameByType(CurrencyType: number): string {
        return UtilItem.GetCfgByItemId(CurrencyType).Name;
        switch (CurrencyType) {
            case ItemCurrencyId.JADE:// 玉璧
                return i18n.jade;
            case ItemCurrencyId.INGOT:// 元宝
                return i18n.ingot;
            case ItemCurrencyId.COIN:// 铜钱
                return i18n.coin;
            case ItemCurrencyId.VIP_EXP:// 经验
                return i18n.exp;
            case ItemCurrencyId.SKILL_COIN:// 技能积分
                return i18n.skillCoin;
            case ItemCurrencyId.ARENA_COIN:// 竞技声望
                return i18n.arenacoin;
            case ItemCurrencyId.SKILL_EXP:// 技能经验
                return i18n.skillExp;
            case ItemCurrencyId.GENERAL_SCORE: // 武将积分
                return i18n.generalScore;
            case ItemCurrencyId.FAMILY_COIN: // 世家币
                return i18n.familyCoin;
            default:
                return i18n.ingot;
        }
    }
}
