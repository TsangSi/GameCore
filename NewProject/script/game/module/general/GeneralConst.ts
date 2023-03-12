/*
 * @Author: kexd
 * @Date: 2022-08-15 16:38:53
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\GeneralConst.ts
 * @Description: 武将
 *
 */

import { IWinTabData } from '../../../app/core/mvc/WinConst';
import { i18n, Lang } from '../../../i18n/i18n';
import { GuideBtnIds } from '../../com/guide/GuideConst';
import { TabData } from '../../com/tab/TabData';
import { FuncId } from '../../const/FuncConst';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { RID } from '../reddot/RedDotConst';

/** 武将品质 */
export const enum GeneralQuality {
    /** 全部 */
    ALL = 0,
    /** 绿色 */
    GREEN = 1,
    /** 蓝色 */
    BLUE = 2,
    /** 紫色 */
    PURPLE = 3,
    /** 橙色 */
    ORANGE = 4,
    /** 红色 */
    RED = 5,
    /** 金色 */
    GOLD = 6,
    /** 彩色 */
    COLORFUL = 7,
}

/** 武将稀有度 */
export const enum GeneralRarity {
    /** 全部 */
    ALL = 0,
    /** 大将 */
    Rarity1 = 1,
    /** 良将 */
    Rarity2 = 2,
    /** 虎将 */
    Rarity3 = 3,
    /** 名将 */
    Rarity4 = 4,
    /** 名将-无双 */
    Rarity5 = 5,
}

/** 武将头衔（非名将123，名将4头衔是789入世-盖世-绝世，名将5头衔是456入世-盖世-无双） */
export const enum GeneralTitle {
    /** 草芥 */
    Title1 = 1,
    /** 精英 */
    Title2 = 2,
    /** 非凡 */
    Title3 = 3,

    /** 入世 */
    Title4 = 4,
    /** 盖世 */
    Title5 = 5,
    /** 无双 */
    Title6 = 6,

    /** 入世 */
    Title7 = 7,
    /** 盖世 */
    Title8 = 8,
    /** 绝世 */
    Title9 = 9,
}

/** 阵营 */
export const enum GeneralCamp {
    /** 全部 */
    All = 0,
    /** 蜀 */
    CampShu = 1,
    /** 魏 */
    CampWei = 2,
    /** 吴 */
    CampWu = 3,
    /** 群 */
    CampQun = 4,
}

/** 技能类型 */
export const enum EGeneralSkillType {
    /** 专属（主动） */
    SkillActive = 1,
    /** 公共 */
    SkillCommon = 2,
    /** 觉醒 */
    SkillAwaken = 3,
    /** 天赋（被动） */
    SkillTalent = 4,
}

/** 武将-技能状态 */
export enum ESkillState {
    /** 未激活 */
    UnActive = 0,
    /** 可激活 */
    CanActive = 1,
    /** 已激活 */
    Actived = 2,
    /** 满级 */
    Full = 3,
}

export enum ESkillQuality {
    /** 低级 */
    Low = 3,
    /** 高级 */
    Mid = 4,
    /** 顶级 */
    Top = 5,
}

export enum ESkillItemShow {
    /** 0:不显示名字也不显示等级 */
    AllUnShow = 0,
    /** 1:只显示名字 */
    OnlyName = 1,
    /** 2:名字的位置显示等级 */
    OnlyLvAtNamePosition = 2,
    /** 3:同时显示名字和等级 */
    AllShow = 3,
}
export interface ISkillEx {
    /** 技能id */
    skillId: number,
    /** 技能类型 */
    skillType?: EGeneralSkillType,
    /** 技能等级 */
    skillLv?: number,
    /** 技能状态 */
    skillState?: ESkillState,
    /** 激活条件 */
    activeDesc?: string,
    /** 是否已锁定 */
    isLock?: boolean,
    /** 是否显示锁 */
    isShowLock?: boolean,
    /** 是否未学习的 */
    isUnStudy?: boolean,
    /** 是否显示未学习的icon */
    isShowUnStudy?: boolean,
    /** 显示名字还是等级 0:不显示名字也不显示等级 1:只显示名字 2:名字的位置显示等级 3:同时显示名字和等级 */
    showNameOrLv?: ESkillItemShow,
}

/** 头像是在哪个界面展示用的 */
export const enum HeadType {
    /** 不需要点击 */
    None = 0,
    /** 信息界面（主界面） */
    Info = 1,
    /** 升品 */
    QualityUp = 2,
    /** 布阵 */
    Plan = 3,
    /** 升阶消耗 */
    GradeCost = 4,
    /** 升阶选择 */
    GradeChoose = 5,
}

/** 头像是在哪个界面展示用的 */
export const enum ClickType {
    /** 不需要点击 */
    None = 0,
    /** 信息界面（主界面） */
    Info = 1,
    /** 升品 */
    QualityUp = 2,
    /** 布阵 */
    Plan = 3,
    /** 升阶消耗本体 */
    GradeCost = 4,
    /** 升阶选择 */
    GradeChoose = 5,
    /** 装备消耗本体 */
    EquipCost = 6,
    /** 重生 */
    Reborn = 7,
    /** 遣散 */
    Disband = 8,
}

export const enum EGeneralUiType {
    /** 不需要展示的 */
    None = 0,
    /** 信息界面（主界面） */
    Info = 1,
    /** 装备界面 */
    Equip = 2,
    /** 图鉴详情界面 */
    Books = 3,
}

export interface GeneralMsg {
    /** 协议数据 */
    generalData: GeneralData,

    /** 出战位置123. 0是未出战 */
    battlePos?: number,

    /** 配置数据 */
    cfg?: Cfg_General,

    /** 是否能升品（该品质下的副武将数量足够） */
    deputyEnough?: boolean,
}

export interface exMsg {
    /** 点击类型 */
    clickType?: ClickType,
    /** 是否选中 */
    isSelected?: boolean,
    /** 不显示选中 */
    unshowSelect?: boolean,
    /** 红点 */
    isRed?: boolean,
    /** 升品界面里是否有选了主武将 */
    qualityupSelect?: boolean,
    /** 不显示等级 */
    unshowLevel?: boolean,

    /** 点击回调 */
    callback?: (msg: GeneralMsg) => void,
    /** 回调上下文 */
    context?: any,
}

export interface GEquipMsg {
    /** 该位置是否已装备 */
    isEquiped: boolean,
    /** 数据 */
    cfg: Cfg_Genera_Equip,
    /** onlyId */
    onlyId: string,
}

/** 属性索引 */
export enum AttrIndex {
    /** 攻击 */
    Atk,
    /** 防御 */
    Def,
    /** 生命 */
    Hp,
}

/** 武将二级页签-信息下的子页签 */
export enum InfoPageType {
    /** 武将主界面 */
    Main = 0,
    /** 升级 */
    LevelUp = 1,
    /** 升阶 */
    GradeUp = 2,
    /** 觉醒 */
    Awaken = 3,
    /** 装备 */
    Equip = 4,
    /** 技能 */
    Skill = 5,
    /** 有新页签往下添加 */
}

/** 武将二级页签-信息下的数据 */
export const GeneralPageTabs: TabData[] = [
    {
        id: InfoPageType.Main,
        title: i18n.tt(Lang.general_tab_0),
        redId: RID.General.Main.Id,
    },
    {
        id: InfoPageType.LevelUp,
        title: i18n.tt(Lang.general_tab_1),
        redId: RID.General.Cur.CurLvUp,
        funcId: FuncId.GeneralLevelUp,
        guideId: GuideBtnIds.GeneralLevelUp,
    },
    {
        id: InfoPageType.GradeUp,
        title: i18n.tt(Lang.grade_page_tab_grade),
        redId: RID.General.Cur.CurGradeUp,
        funcId: FuncId.GeneralGradeUp,
    },
    {
        id: InfoPageType.Awaken,
        title: i18n.tt(Lang.prefab_awaken_juexing),
        redId: RID.General.Cur.CurAwaken,
        funcId: FuncId.GeneralAwaken,
    },
    {
        id: InfoPageType.Equip,
        title: i18n.tt(Lang.bag_item_tab_equip),
        redId: RID.General.Cur.CurEquip.Id,
        funcId: FuncId.GeneralEquip,
    },
    {
        id: InfoPageType.Skill,
        title: i18n.tt(Lang.general_tab_2),
        redId: RID.General.Main.Skill,
        funcId: FuncId.GeneralSkill,
    },
    /** 有新页签往下添加 */
];

/** 武将二级页签-重生下的子页签类型 */
export enum ERebornType {
    /** 重生 */
    Reborn = 0,
    /** 遣散 */
    Disband,
}

/** 页签类别 */
export const RebornPageTabs: TabData[] = [
    {
        id: ERebornType.Reborn,
        uiPath: UI_PATH_ENUM.GRebornPanel,
        title: i18n.tt(Lang.general_reborn_title1),
        // redId: RID.Boss.CrossBoss.WorldBoss,
        funcId: FuncId.GeneralReborn,
        // descId: 130301,
    },
    {
        id: ERebornType.Disband,
        uiPath: UI_PATH_ENUM.GDisbandPanel,
        title: i18n.tt(Lang.general_reborn_title2),
        // redId: RID.Boss.CrossBoss.BeaconWar.Id,
        // funcId: FuncId.GeneralReborn,
    },
];

/** 武将一级页签 */
export enum GeneralPageType {
    /** 信息界面 */
    Info = 0,
    /** 升品 */
    QualityUp,
    /** 重生 */
    Reborn,
}

/** 一级页签数据 */
export const generalTabDataArr: IWinTabData[] = [
    {
        TabId: GeneralPageType.Info,
        className: 'GeneralPage',
        prefabPath: UI_PATH_ENUM.GeneralPage,
        redId: RID.General.Main.Id,
        funcId: FuncId.General,
    },
    {
        TabId: GeneralPageType.QualityUp,
        className: 'QualityUpPage',
        prefabPath: UI_PATH_ENUM.QualityUpPage,
        redId: RID.General.QualityUp.Id,
        guideId: GuideBtnIds.GeneralGradeUp,
        funcId: FuncId.GeneralQualityUp,
    },
    {
        TabId: GeneralPageType.Reborn,
        className: 'GRebornPage',
        prefabPath: UI_PATH_ENUM.GRebornPage,
        funcId: FuncId.GeneralReborn,
    },
];
