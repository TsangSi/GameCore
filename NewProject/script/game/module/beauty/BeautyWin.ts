/*
 * @Author: myl
 * @Date: 2022-08-30 16:28:23
 * @Description:
 */

import { IWinTabData } from '../../../app/core/mvc/WinConst';
import { i18n, Lang } from '../../../i18n/i18n';
import WinTabFrame from '../../com/win/WinTabFrame';
import { FuncId } from '../../const/FuncConst';
import { FuncDescConst } from '../../const/FuncDescConst';
import { TabBtnId } from '../../const/TabBtnConst';
import { UI_PATH_ENUM } from '../../const/UIPath';
import ModelMgr from '../../manager/ModelMgr';
import { GradeType } from '../grade/GradeConst';
import { RID } from '../reddot/RedDotConst';
import { RedDotMgr } from '../reddot/RedDotMgr';
import { EBeautyIndexId } from './BeautyVoCfg';

const { ccclass } = cc._decorator;

@ccclass
export class BeautyWin extends WinTabFrame {
    public getTabData(): IWinTabData[] {
        return this.getPageConfig();
    }

    /** 获取商城页签配置数据 */
    private getPageConfig() {
        const tabs: IWinTabData[] = [];
        tabs.push({
            TabId: EBeautyIndexId.Level,
            className: 'BeautyPage',
            // TabBtnId: TabBtnId.BeautyPage_Up,
            funcId: FuncId.BeautyUpLevel,
            prefabPath: UI_PATH_ENUM.BeautyPage,
            descId: FuncDescConst.Beauty,
            redId: RID.Forge.Beauty.UpLevel,
        });
        tabs.push({
            TabId: EBeautyIndexId.Star,
            className: 'BeautyPage',
            // TabBtnId: TabBtnId.BeautyPage_Star,
            prefabPath: UI_PATH_ENUM.BeautyPage,
            descId: FuncDescConst.Beauty,
            funcId: FuncId.BeautyUpStar,
            redId: RID.Forge.Beauty.UpStar,
        });
        tabs.push({
            TabId: FuncId.BeautyGrade,
            className: 'GradePage',
            // TabBtnId: TabBtnId.BeautyPage_Grade,
            prefabPath: UI_PATH_ENUM.GradePage,
            descId: FuncDescConst.Beauty,
            funcId: FuncId.BeautyGrade,
            redId: RID.Forge.Beauty.Grade.Id,
        });
        return tabs;
    }

    public initWin(...param: unknown[]): void {
        if (RedDotMgr.I.getStatus(RID.Forge.Beauty.UpLevel)) {
            ModelMgr.I.BeautyModel.onCheckUpStar();
        }
    }
}
