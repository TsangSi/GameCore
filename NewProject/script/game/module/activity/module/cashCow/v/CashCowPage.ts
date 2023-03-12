/*
 * @Author: myl
 * @Date: 2022-12-21 11:14:13
 * @Description:
 */

import { EventClient } from '../../../../../../app/base/event/EventClient';
import { UtilNum } from '../../../../../../app/base/utils/UtilNum';
import WinMgr from '../../../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../../../i18n/i18n';
import { DynamicImage } from '../../../../../base/components/DynamicImage';
import { Config } from '../../../../../base/config/Config';
import { ConfigConst } from '../../../../../base/config/ConfigConst';
import MsgToastMgr from '../../../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../../../base/utils/UtilGame';
import UtilRedDot from '../../../../../base/utils/UtilRedDot';
import { WinTabPage } from '../../../../../com/win/WinTabPage';
import { E } from '../../../../../const/EventName';
import { RES_ENUM } from '../../../../../const/ResPath';
import { ViewConst } from '../../../../../const/ViewConst';
import ControllerMgr from '../../../../../manager/ControllerMgr';
import { EffectMgr } from '../../../../../manager/EffectMgr';
import ModelMgr from '../../../../../manager/ModelMgr';
import { RoleAN } from '../../../../role/RoleAN';
import { RoleMgr } from '../../../../role/RoleMgr';
import { ActData } from '../../../ActivityConst';
import { CashCowConst, CashCowShakeType } from '../CashCowConst';
import CashCowShakeItem from './CashCowShakeItem';

const { ccclass, property } = cc._decorator;

@ccclass
export default class CashCowPage extends WinTabPage {
    // 节点
    @property(cc.Node)
    private NdFree: cc.Node = null;
    @property(cc.Node)
    private NdFreeAuto: cc.Node = null;
    @property(cc.Node)
    private NdCoin: cc.Node = null;
    @property(cc.Node)
    private NdCoin1: cc.Node = null;

    @property(cc.Node)
    private NdFreeTip: cc.Node = null;

    // 按钮
    @property(cc.Node)
    private BtnFree: cc.Node = null;
    @property(cc.Node)
    private BtnFreeAuto: cc.Node = null;
    @property(cc.Node)
    private BtnCoin: cc.Node = null;
    @property(cc.Node)
    private BtnCoin1: cc.Node = null;

    // 提示
    @property(cc.RichText)
    private richFreeTimesTip: cc.RichText = null;
    @property(cc.RichText)
    private richFreeVipTip: cc.RichText = null;
    @property(cc.RichText)
    private richCoinTimesTip: cc.RichText = null;
    @property(cc.RichText)
    private richCoinVipTip: cc.RichText = null;
    @property(cc.RichText)
    private richCoin1TimesTip: cc.RichText = null;
    @property(cc.RichText)
    private richCoin1VipTip: cc.RichText = null;

    @property(cc.Label)
    private LabTreeLv: cc.Label = null;
    @property(cc.Label)
    private LabExpProg: cc.Label = null;
    @property(cc.Label)
    private LabCountGet: cc.Label = null;
    @property(cc.ProgressBar)
    private progTree: cc.ProgressBar = null;

    @property(cc.Node)
    private NdShake: cc.Node = null;
    @property(cc.Node)
    private NdTree: cc.Node = null;

    @property(cc.Label)
    private priceCoin: cc.Label = null;
    @property(cc.Label)
    private priceCoin1: cc.Label = null;

    @property(DynamicImage)
    private SprTree: DynamicImage = null;
    // 概率公示
    @property(cc.Node)
    private NdRate: cc.Node = null;

    public init(winId: number, param: unknown, tabIdx: number, tabId?: number): void {
        super.init(winId, param, tabIdx, tabId);

        EventClient.I.on(E.CashCow.Data, this.uptUI, this);
        EventClient.I.on(E.CashCow.Shake, this.shakeResult, this);
        RoleMgr.I.on(this.uptUI, this, RoleAN.N.VipLevel);
        this.getData(tabId);

        UtilGame.Click(this.BtnFree, () => {
            ControllerMgr.I.CashCowController.shakeCashCow(this._actData.FuncId, this._actData.CycNo, CashCowShakeType.Free);
        }, this);
        UtilGame.Click(this.BtnFreeAuto, () => {
            ControllerMgr.I.CashCowController.shakeCashCow(this._actData.FuncId, this._actData.CycNo, CashCowShakeType.Free, 1);
        }, this);
        UtilGame.Click(this.BtnCoin, () => {
            const timesCfg = ModelMgr.I.CashCowModel.userTimes(CashCowShakeType.Coin);
            if (timesCfg.n1 <= 0) {
                MsgToastMgr.Show(i18n.tt(Lang.cashCow_no_times));
                return;
            }
            WinMgr.I.open(ViewConst.CashCowBuyWin, CashCowShakeType.Coin, (num: number) => {
                //
                ControllerMgr.I.CashCowController.shakeCashCow(this._actData.FuncId, this._actData.CycNo, CashCowShakeType.Coin, 0, num);
            });
        }, this);
        UtilGame.Click(this.BtnCoin1, () => {
            const timesCfg = ModelMgr.I.CashCowModel.userTimes(CashCowShakeType.Coin1);
            if (timesCfg.n1 <= 0) {
                MsgToastMgr.Show(i18n.tt(Lang.cashCow_no_times));
                return;
            }
            WinMgr.I.open(ViewConst.CashCowBuyWin, CashCowShakeType.Coin1, (num: number) => {
                //
                ControllerMgr.I.CashCowController.shakeCashCow(this._actData.FuncId, this._actData.CycNo, CashCowShakeType.Coin1, 0, num);
            });
        }, this);

        UtilGame.Click(this.NdRate, () => {
            const data = ModelMgr.I.CashCowModel.userData;
            WinMgr.I.open(ViewConst.CashCowRateWin, data.Level);
        }, this);
    }

    public refreshPage(winId: number, param: unknown, tabIdx: number, tabId?: number): void {
        super.refreshPage(winId, param, tabIdx, tabId);
        this.getData(tabId);
    }

    private _actData: ActData = null;
    private getData(tabId: number) {
        this._actData = ModelMgr.I.ActivityModel.getActivityData(tabId);
        ControllerMgr.I.ActivityController.reqC2SGetActivityConfig(this._actData.FuncId);
        ControllerMgr.I.CashCowController.GetCashCowData(this._actData.FuncId, this._actData.CycNo);
    }

    /** 更新UI */
    private uptUI(): void {
        const model = ModelMgr.I.CashCowModel;
        // 提示文字
        const freeTimes = model.userTimes(CashCowShakeType.Free);
        this.NdFreeTip.active = this.NdFree.active = this.NdFreeAuto.active = freeTimes.n1 > 0;
        this.NdCoin.active = this.NdCoin1.active = freeTimes.n1 <= 0;
        // 红点
        UtilRedDot.UpdateRed(this.NdFree, freeTimes.n1 > 0, cc.v2(80, 25));
        UtilRedDot.UpdateRed(this.NdFreeAuto, freeTimes.n1 > 0, cc.v2(80, 25));

        const tipFreeTimesCfg = model.getTimesTip(CashCowShakeType.Free);
        this.richFreeTimesTip.string = tipFreeTimesCfg.s;
        this.richFreeVipTip.string = tipFreeTimesCfg.s1;

        const tipCoinTimesCfg = model.getTimesTip(CashCowShakeType.Coin);
        this.richCoinTimesTip.string = tipCoinTimesCfg.s;
        this.richCoinVipTip.string = tipCoinTimesCfg.s1;

        const tipCoin1TimesCfg = model.getTimesTip(CashCowShakeType.Coin1);
        this.richCoin1TimesTip.string = tipCoin1TimesCfg.s;
        this.richCoin1VipTip.string = tipCoin1TimesCfg.s1;

        // 进度条等级
        const userData = model.userData;
        this.LabTreeLv.string = `${userData.Level}${i18n.lv}`;
        const progCfg = model.getExpCfg(userData.Level || 1, userData.Exp || 0);
        this.progTree.progress = progCfg.t0 / progCfg.t1;
        this.LabExpProg.string = `${progCfg.t0}/${progCfg.t1}`;

        this.LabCountGet.string = model.getBaseCashRowReward(userData.Level).toString();

        this.priceCoin.string = model.getCashCowConst(CashCowConst.Price1).CfgValue.split(':')[1];
        this.priceCoin1.string = model.getCashCowConst(CashCowConst.Price2).CfgValue.split(':')[1];

        const indexer = Config.Get(ConfigConst.Cfg_Server_CashCowEffect);

        const cfgIndex: number = indexer.getIntervalIndex(userData.Level);
        const cfg: Cfg_Server_CashCowEffect = indexer.getValueByIndex(cfgIndex);

        this.SprTree.loadImage(`${RES_ENUM.Activity_CashCow_Tree}${cfg.EffectUI}`, 1, true);
        this.SprTree.node.y = cfg.EffectY;
    }

    private shakeResult(data: CashCowShakeReward[]) {
        // 展示特效
        const indexer = Config.Get(ConfigConst.Cfg_Server_CashCowEffect);
        const lv = ModelMgr.I.CashCowModel.userData.Level;
        const cfgIndex: number = indexer.getIntervalIndex(lv);
        const cfg: Cfg_Server_CashCowEffect = indexer.getValueByIndex(cfgIndex);
        const effectY = cfg.EffectY;
        const effectPath = `${RES_ENUM.Effect}${cfg.EffectUI}`;
        // EffectMgr.I.showEffect
        let delay = 0;
        for (let i = 0; i < data.length; i++) {
            const d = data[i];
            const rate = d.Rate;
            if (rate > 1) {
                const nd = cc.instantiate(this.NdShake);
                const itm = nd.getComponent(CashCowShakeItem);
                itm.setTip(rate, delay, this.NdTree);
                delay += 0.3;
            }
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.CashCow.Data, this.uptUI, this);
        EventClient.I.off(E.CashCow.Shake, this.shakeResult, this);
        RoleMgr.I.off(this.uptUI, this, RoleAN.N.VipLevel);
    }
}
