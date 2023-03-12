/*
 * @Author: myl
 * @Date: 2022-08-04 10:32:59
 * @Description:
 */

import { EventClient } from '../../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { UtilString } from '../../../../../app/base/utils/UtilString';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import ListView from '../../../../base/components/listview/ListView';
import MsgToastMgr from '../../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../../base/utils/UtilGame';
import { GuideBtnIds } from '../../../../com/guide/GuideConst';
import { WinTabPage } from '../../../../com/win/WinTabPage';
import { E } from '../../../../const/EventName';
import { ViewConst } from '../../../../const/ViewConst';
import ControllerMgr from '../../../../manager/ControllerMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import { MaterialItem } from './MaterialItem';

const { ccclass, property } = cc._decorator;

@ccclass
export class MaterialPage extends WinTabPage {
    @property(ListView)
    private list: ListView = null;

    @property(cc.Node)
    private BtnBuy: cc.Node = null;
    @property(cc.Node)
    private BtnSweep: cc.Node = null;
    @property(cc.Node)
    private BtnSclBottom: cc.Node = null;
    @property(cc.Node)
    private NdRed: cc.Node = null;

    private _source: Array<{ config: Cfg_FB_Material, data: MaterialData }> = [];
    protected start(): void {
        // [3]
        super.start();
        UtilGame.Click(this.BtnBuy, () => {
            const model = ModelMgr.I.MaterialModel;
            const tipConfig = model.totalBuyTip();
            const num = tipConfig.num;
            if (num <= 0) {
                MsgToastMgr.Show(i18n.tt(Lang.arena_buy_times_unenough));
            } else {
                this.buyAll();
            }
        }, this);

        UtilGame.Click(this.BtnSweep, () => {
            if (!ModelMgr.I.MaterialModel.canSweepAll()) {
                ModelMgr.I.MsgBoxModel.ShowBox(UtilString.FormatArray(i18n.tt(Lang.material_svip_unenough), [UtilColor.NorV]), () => {
                    WinMgr.I.open(ViewConst.VipSuperWin, 1);
                }, { showToggle: '' });
            } else {
                this.sweepAll();
            }
        }, this);

        UtilGame.Click(this.BtnSclBottom, () => {
            this.list.scrollTo(this._source.length - 1, 0.618);
        }, this);

        EventClient.I.on(E.MaterialFuBen.MaterialUpdateUI, this.setUpListView, this);

        this.setUpListView();
    }

    private setUpListView() {
        this._source = [];
        const datas = ModelMgr.I.MaterialModel.getFbList();
        const configs = ModelMgr.I.MaterialModel.materialConfig();
        let redState = false;
        for (let i = 0; i < configs.length; i++) {
            const conf = configs[i];
            const dta = datas.get(i + 1);
            const item: { config: Cfg_FB_Material, data: MaterialData, guideId?: number } = { config: conf, data: dta };
            if (conf.Id === 1) {
                item.guideId = GuideBtnIds.MaterialFightMount;
            } else if (conf.Id === 2) {
                item.guideId = GuideBtnIds.MaterialFightReiki;
            } else if (conf.Id === 3) {
                item.guideId = GuideBtnIds.MaterialFightKotake;
            } else if (conf.Id === 4) {
                item.guideId = GuideBtnIds.MaterialFightWing;
            }
            if (dta) {
                redState = redState || (dta.CanSweep && dta.Num > 0);
                this._source.push(item);
            }
        }
        this.BtnSclBottom.active = this._source.length > 5;
        this.list.setNumItems(this._source.length);

        this.NdRed.active = ModelMgr.I.MaterialModel.canSweepAll() && redState;
    }

    private scrollEvent(nd: cc.Node, idx: number) {
        const item = nd.getComponent(MaterialItem);
        item.setData(this._source[idx], idx);
    }

    /** 一键扫荡 */
    private sweepAll() {
        const controller = ControllerMgr.I.MaterialController;
        controller.sweepAll();
    }

    /** 一键购买 */
    private buyAll() {
        const model = ModelMgr.I.MaterialModel;
        const tipConfig = model.totalBuyTip();
        const tip = tipConfig.tip;
        const num = tipConfig.num;
        if (num <= 0) {
            MsgToastMgr.Show(i18n.tt(Lang.arena_buy_times_unenough));
            return;
        }
        const tipStr = UtilString.FormatArray(i18n.tt(Lang.material_total_buy_tip), [tip, num, UtilColor.NorV, UtilColor.GreenV]);
        ModelMgr.I.MsgBoxModel.ShowBox(tipStr, () => {
            ControllerMgr.I.MaterialController.buyAllTimes();
        }, { showToggle: '' });
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.MaterialFuBen.MaterialUpdateUI, this.setUpListView, this);
    }

    public init(winId: number, param: unknown, tabIdx: number = 0): void {
        super.init(winId, param, tabIdx);
    }
}
