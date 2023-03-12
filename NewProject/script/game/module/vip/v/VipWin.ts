/*
 * @Author: myl
 * @Date: 2022-08-15 14:51:08
 * @Description:
 */
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { TabContainer } from '../../../com/tab/TabContainer';
import { TabData } from '../../../com/tab/TabData';
import { TabItem } from '../../../com/tab/TabItem';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import ModelMgr from '../../../manager/ModelMgr';
import { RID } from '../../reddot/RedDotConst';
import { RedDotMgr } from '../../reddot/RedDotMgr';
import { RoleAN } from '../../role/RoleAN';
import { RoleMgr } from '../../role/RoleMgr';
import { Max_Vip_Level, UpdateViewEvent } from '../VipConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class VipWin extends WinTabPage {
    @property(TabContainer)
    private tabContainer: TabContainer = null;
    @property(cc.Node)
    private NdBg: cc.Node = null;

    private _NdContents: Map<string, cc.Node> = new Map();
    private _selectId: number = 0;

    private _vipLv: number = RoleMgr.I.d.VipLevel; // 记录历史vip等级

    public init(winId: number, param: unknown, tabIdx: number = 0): void {
        super.init(winId, param, tabIdx);
        // 当玩家是svip 此时需要根据红点来判断选中
        if (!this.userIsSvip) {
            this._selectId = 1;
        } else if (!ModelMgr.I.VipModel.svipRed(RID.Vip.Vip.Svip.Base) && ModelMgr.I.VipModel.vipRed(RID.Vip.Vip.Vip)) {
            this._selectId = 1;
        } else {
            this._selectId = 0;
        }

        this.tabContainer.setData(this.VipPageTabs, this._selectId);
        if (!this.userIsSvip) {
            this.tabContainer.changeTabState(0);
        }
    }

    public refreshPage(winId: number, param: unknown, tabIdx: number): void {
        super.refreshPage(winId, param, tabIdx);
        // 清空选择的装备
        // this.getWinTabFrame().setTitle(this.VipPageTabs[this._selectId].title.replace(' ', ''));
    }

    protected start(): void {
        super.start();
        if (RedDotMgr.I.getStatus(RID.Vip.Id)) {
            if (ModelMgr.I.VipModel.svipRed(RID.Vip.Vip.Svip.Base)) {
                ModelMgr.I.VipModel.dailyRed();
            }
        }
        RoleMgr.I.on(this.vipUpdate, this, RoleAN.N.VipLevel);
    }

    private vipUpdate() {
        if (RoleMgr.I.d.VipLevel >= Max_Vip_Level && this._vipLv <= Max_Vip_Level) {
            this.tabContainer.changeTabState(0, true);
            // 需要更新红点
            ModelMgr.I.VipModel.svipRed(RID.Vip.Vip.Svip.Base);
        }
        this._vipLv = RoleMgr.I.d.VipLevel;
    }

    protected onDestroy(): void {
        super.onDestroy();
        RoleMgr.I.off(this.vipUpdate, this, RoleAN.N.VipLevel);
    }

    /** 底部tab选中事件 */
    private tabClickEvents(item: TabItem) {
        this.addNdContents(item);
    }

    private addNdContents(item: TabItem) {
        const data = item.getData();
        // 重新赋值名称
        // this.getWinTabFrame().setTitle(data.title.replace(' ', ''));
        this._selectId = data.id;
        console.log(this._selectId, '选中索引');

        const nd = this._NdContents.get(data.uiPath);
        this.hideOthersNd(nd);
        if (nd) {
            nd.active = true;
            // 发送事件 刷新界面
            nd.emit(UpdateViewEvent, this._selectId);
            // nd.getComponent(VipView).updateUI();
        } else {
            this.initTabView(data);
        }
    }

    private hideOthersNd(newNode: cc.Node) {
        this._NdContents.forEach((nd) => {
            if (nd !== newNode) {
                nd.active = false;
            }
        });
    }

    private initTabView(data: TabData) {
        ResMgr.I.showPrefabOnce(data.uiPath, this.NdBg, (err, node) => {
            if (err) return;
            if (!this.NdBg || !this.NdBg.isValid) return;
            node.emit(UpdateViewEvent, this._selectId);
            if (err) {
                console.log('添加界面出错', data.uiPath);
                return;
            }
            this._NdContents.set(data.uiPath, node);
        });
    }

    /** 用户是否是svip */
    private get userIsSvip(): boolean {
        return (RoleMgr.I.d.VipLevel ?? 0) >= Max_Vip_Level;
    }

    /** 二级页签类别 */
    protected get VipPageTabs(): TabData[] {
        const tabs: TabData[] = [
            {
                id: 0,
                title: i18n.tt(Lang.svip_title),
                uiPath: UI_PATH_ENUM.VipView,
                redId: RID.Vip.Vip.Svip.Base,
            },
            {
                id: 1,
                title: i18n.tt(Lang.vip_title),
                uiPath: UI_PATH_ENUM.VipView,
                redId: RID.Vip.Vip.Vip,
            },
        ];
        return tabs;
    }
}
