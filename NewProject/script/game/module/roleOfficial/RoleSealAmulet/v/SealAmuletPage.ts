/*
 * @Author: myl
 * @Date: 2022-10-11 22:11:18
 * @Description:
 */

import { i18n, Lang } from '../../../../../i18n/i18n';
import { TabData } from '../../../../com/tab/TabData';
import { WinTabPageView } from '../../../../com/win/WinTabPageView';
import { UI_PATH_ENUM } from '../../../../const/UIPath';
import { RID } from '../../../reddot/RedDotConst';
import { SealAmuletContentType } from '../SealAmuletConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class SealAmuletPage extends WinTabPageView {
    @property(cc.Node)
    private otherBg: cc.Node = null;

    /** 配置当前界面的子页面配置数据 */
    public tabPages(): TabData[] {
        return this.pageConfig();
    }

    /** 商城类型中 判断当前商城中的子商店 */
    private pageConfig(): TabData[] {
        const items: TabData[] = [
            {
                id: SealAmuletContentType.Grade,
                uiPath: UI_PATH_ENUM.SealAmuletView,
                title: i18n.tt(Lang.com_up),
                redId: this.tabId === 1
                    ? RID.Role.RoleOfficial.Official.SealAmulet.Seal.Grade.Id
                    : RID.Role.RoleOfficial.Official.SealAmulet.Amulet.Grade.Id,
                // descId: 130701,
            },
            {
                id: SealAmuletContentType.Star,
                uiPath: UI_PATH_ENUM.SealAmuletView,
                title: i18n.tt(Lang.equip_upStar),
                redId: this.tabId === 1
                    ? RID.Role.RoleOfficial.Official.SealAmulet.Seal.Star.Id
                    : RID.Role.RoleOfficial.Official.SealAmulet.Amulet.Star.Id,
                // descId: 130702,
            },
            {
                id: SealAmuletContentType.Quality,
                uiPath: UI_PATH_ENUM.SealAmuletView,
                title: i18n.tt(Lang.refinement_title),
                redId: this.tabId === 1
                    ? RID.Role.RoleOfficial.Official.SealAmulet.Seal.Refine.Id
                    : RID.Role.RoleOfficial.Official.SealAmulet.Amulet.Refine.Id,
                // descId: 130703,
            },
        ];
        return items;
    }

    protected addNdContents(data: TabData): void {
        super.addNdContents(data);
        this.otherBg.active = data.id === SealAmuletContentType.Quality;
    }
}
