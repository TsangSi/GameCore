/*
 * @Author: dcj
 * @Date: 2022-10-26 10:16:05
 * @FilePath: \SanGuo-2.4-main\assets\script\game\module\equip\EquipConst.ts
 * @Description:
 */
import { IWinTabData } from '../../../app/core/mvc/WinConst';
import { i18n, Lang } from '../../../i18n/i18n';
import { GuideBtnIds } from '../../com/guide/GuideConst';
import { FuncId } from '../../const/FuncConst';
import { FuncDescConst } from '../../const/FuncDescConst';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { RID } from '../reddot/RedDotConst';

export enum ItemPopType {
    /** 打造 */
    build = 1,
    /** 升星 */
    upStar = 2,
    /** 合成材料 */
    MergeMat = 3,
    /** 关卡通行证 */
    StagePass = 4,
    /** 宝石 */
    Gem = 4,
}

/** 装备窗口TAB类型 */
export enum EquipWinTabType {
    /** 强化 */
    STRENGTH = 0,
    /** 升星 */
    UP_STAR = 1,
    /** 打造 */
    BUILD = 2,
    /** 打造 */
    GEM = 3,
}

export enum ResonanceType {
    /** 强化 */
    STRENGTH = 0,
    /** 世家-校场 */
    FAMILY = 1,
}

export const equipTabDataArr: IWinTabData[] = [
    {
        TabId: EquipWinTabType.STRENGTH,
        className: 'StrengthPage',
        prefabPath: UI_PATH_ENUM.StrengthPage,

        redId: RID.Equip.Strength.Id,
        funcId: FuncId.EquipStrength,
        descId: FuncDescConst.EquipStrength,
    },
    {
        TabId: EquipWinTabType.UP_STAR,
        className: 'UpStarPage',
        prefabPath: UI_PATH_ENUM.EquipUpStarPage,

        redId: RID.Equip.UpStar,
        funcId: FuncId.EquipUpStar,
        guideId: GuideBtnIds.EquipStarUp,
    },
    {
        TabId: EquipWinTabType.BUILD,
        className: 'BuildPage',
        prefabPath: UI_PATH_ENUM.BuildPage,

        redId: RID.Equip.Build,
        funcId: FuncId.EquipBuild,
        guideId: GuideBtnIds.EquipBuild,
    },
    {
        TabId: EquipWinTabType.GEM,
        className: 'GemPage',
        prefabPath: UI_PATH_ENUM.GemPage,
        redId: RID.Equip.Gem,
        funcId: FuncId.EquipGem,
        guideId: GuideBtnIds.EquipGem,
        descId: FuncDescConst.EquipGem,
    },
];
