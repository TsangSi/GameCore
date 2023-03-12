/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: kexd
 * @Date: 2023-02-01 15:28:03
 * @FilePath: \SanGuo2.4\assets\script\game\module\daily\DailyConst.ts
 * @Description:
 *
 */

import { IWinTabData, EMarkType } from '../../../app/core/mvc/WinConst';
import { FuncId } from '../../const/FuncConst';
import { FuncDescConst } from '../../const/FuncDescConst';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { RID } from '../reddot/RedDotConst';

/** 一级页签类型 */
export enum EDailyPageType {
    /** 日常任务 */
    Daily = 1,
    /** 周常任务 */
    Weekly = 2,
    /** 资源找回 */
    ResRecovery = 3,
    /** 押镖 */
    Escort = 4,
    /** 西域 */
    SILK_ROAD = 5,
    /** 游历天下 */
    ADVENTURE = 6,
    /** 华容道 */
    Huarongdao = 7,
    /** 功能预告 */
    FuncPreviw = 8,
}

/** 一级页签数据 */
export const DailyTabDataArr: IWinTabData[] = [
    {
        TabId: EDailyPageType.Daily,
        className: 'DailyWeeklyTaskPage',
        prefabPath: UI_PATH_ENUM.DailyWeeklyTaskPage,
        redId: RID.DailyTask.Daily,
        funcId: FuncId.DailyTask,
    },
    {
        TabId: EDailyPageType.Weekly,
        className: 'DailyWeeklyTaskPage',
        prefabPath: UI_PATH_ENUM.DailyWeeklyTaskPage,
        redId: RID.DailyTask.Weekly,
        funcId: FuncId.WeeklyTask,
    },
    {
        TabId: EDailyPageType.ResRecovery,
        className: 'ResRecoveryPage',
        prefabPath: UI_PATH_ENUM.ResRecoveryPage,
        redId: RID.DailyTask.ResRecovery.Id,
        funcId: FuncId.ResRecovery,
    },
    {
        TabId: EDailyPageType.Escort,
        className: 'EscortPage',
        prefabPath: UI_PATH_ENUM.EscortPage,
        redId: RID.DailyTask.Escort,
        funcId: FuncId.Escort,
        descId: FuncDescConst.Escort,
        markType: EMarkType.None,
    },
    {
        TabId: EDailyPageType.SILK_ROAD,
        className: 'SilkRoadPage',
        prefabPath: UI_PATH_ENUM.SilkRoadPage,
        redId: RID.DailyTask.SilkRoad,
        funcId: FuncId.SilkRoad,
        descId: FuncDescConst.SilkRoad,
    },
    {
        TabId: EDailyPageType.ADVENTURE,
        className: 'AdventurePage',
        prefabPath: UI_PATH_ENUM.AdventurePage,
        /** 待修改 红点 funcId descId */
        redId: RID.DailyTask.Adventure,
        funcId: FuncId.Adventure,
        descId: 131701,
    },
    {
        TabId: EDailyPageType.Huarongdao,
        className: 'HuarongdaoPage',
        prefabPath: UI_PATH_ENUM.HuarongdaoPage,
        redId: RID.DailyTask.Huarongdao.Id,
        funcId: FuncId.Huarongdao,
        descId: FuncDescConst.Huarongdao,
    },
    {
        TabId: EDailyPageType.FuncPreviw,
        className: 'FuncPreviewPage',
        prefabPath: UI_PATH_ENUM.FuncPreviewPage,
        redId: RID.DailyTask.FuncPreview.Id,
        funcId: FuncId.FuncPreview,
    },
];
