import { RES_ENUM } from '../../const/ResPath';

/*
 * @Author: wangxin
 * @Date: 2022-08-01 10:30:58
 * @FilePath: \SanGuo\assets\script\game\base\utils\UtilEffectPath.ts
 */
export class UtilEffectPath {
    /** 获取强化共鸣特效 */
    public static getResonanceEffUrl(): string {
        return RES_ENUM.Strength_Ui_7002;
    }
    /** 获取强化共鸣特效 */
    public static getRoleEquipEffUrl(): string {
        return RES_ENUM.Strength_Ui_7001;
    }
    public static getRoleArmyLvStarEffUrl(): string {
        return RES_ENUM.Strength_Ui_105;
    }
}
