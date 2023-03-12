import UtilItem from '../../../base/utils/UtilItem';
/** 根据军衔等级 获取名称颜色 */
export class ArmyLvConst {
    public static getLvColorByArmyLV(armyLevel: number, isDark = false): string {
        if (armyLevel === 0) {
            return UtilItem.GetItemQualityColor(1, isDark);
        } else {
            const n = Math.floor((armyLevel - 1) / 3) + 1;
            return UtilItem.GetItemQualityColor(n, isDark);
        }
    }
}
