/*
 * @Author: myl
 * @Date: 2023-01-29 11:08:52
 * @Description:
 */

import { EventClient } from '../../../../../../app/base/event/EventClient';
import { TabContainer } from '../../../../../com/tab/TabContainer';
import { TabItem } from '../../../../../com/tab/TabItem';
import { WinTabPage } from '../../../../../com/win/WinTabPage';
import { E } from '../../../../../const/EventName';
import ControllerMgr from '../../../../../manager/ControllerMgr';
import ModelMgr from '../../../../../manager/ModelMgr';
import { ActData } from '../../../ActivityConst';
import { TabData } from '../../../../../com/tab/TabData';
import GeneralPassItem from './GeneralPassItem';
import ListView from '../../../../../base/components/listview/ListView';
import { GeneralPassItemData } from '../GeneralPassModel';
import { RoleMgr } from '../../../../role/RoleMgr';
import { RoleAN } from '../../../../role/RoleAN';
import { EGeneralPassType } from '../GeneralPassConst';
import { UtilNum } from '../../../../../../app/base/utils/UtilNum';
import { UtilGame } from '../../../../../base/utils/UtilGame';
import WinMgr from '../../../../../../app/core/mvc/WinMgr';
import { ViewConst } from '../../../../../const/ViewConst';
import { i18n, Lang } from '../../../../../../i18n/i18n';
import { UtilString } from '../../../../../../app/base/utils/UtilString';
import { EActivityGeneralPassRedId } from '../../../../reddot/RedDotConst';
import UtilRedDot from '../../../../../base/utils/UtilRedDot';
import { RedDotMgr } from '../../../../reddot/RedDotMgr';
import UtilItem from '../../../../../base/utils/UtilItem';
import { DynamicImage } from '../../../../../base/components/DynamicImage';
import { Config } from '../../../../../base/config/Config';
import { MaterialRewardScanWin } from '../../../../material/v/material/MaterialRewardScanWin';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GeneralPassPage extends WinTabPage {
    @property(TabContainer)
    protected tabContainer: TabContainer = null;

    @property(DynamicImage)
    private SprBanner: DynamicImage = null;

    @property(ListView)
    private list: ListView = null;

    @property(cc.Label)
    private UserInfoLab: cc.Label = null;
    @property(cc.Label)
    private passPayNameLab: cc.Label = null;
    @property(cc.Node)
    private NdLock: cc.Node = null;

    @property(cc.Node)
    private NdReward: cc.Node = null;
    @property(cc.Node)
    private NdRewardParent: cc.Node = null;

    @property(cc.Node)
    private ndRecharge: cc.Node = null;
    @property(cc.Label)
    private LabMoney: cc.Label = null;
    @property(cc.Node)
    private NdItemInfo: cc.Node = null;

    @property(cc.Node)
    private NdWelfare: cc.Node = null;
    @property(cc.Label)
    private LabTimes: cc.Label = null;

    /** 当前选中index 此处动态加载 赋值为通行证的id */
    private _selectId = 0;
    private _tabData: TabData[] = [];

    private _actData: ActData = null;
    private _listData: GeneralPassItemData[] = [];

    @property(cc.Node)
    private NdTip: cc.Node = null;
    @property(cc.Label)
    private labTp0: cc.Label = null;
    @property(cc.Label)
    private labTp1: cc.Label = null;
    @property(DynamicImage)
    private SprTp: DynamicImage = null;

    public init(winId: number, param: unknown, tabIdx: number, tabId?: number): void {
        super.init(winId, param, tabIdx, tabId);
        EventClient.I.on(E.GeneralPass.Data, this.setUpUI, this);
        EventClient.I.on(E.GeneralPass.UpdateData, this.refreshList, this);
        EventClient.I.on(E.GeneralPass.WelfareData, this._welfareUpdate, this);
        RoleMgr.I.on(this.refreshList, this, RoleAN.N.FightValue, RoleAN.N.Level, RoleAN.N.LoginDay);
        this.regData(tabId);

        UtilGame.Click(this.NdWelfare, () => {
            const passCfg = ModelMgr.I.GeneralPassModel.getPassConfig(this._selectId);
            WinMgr.I.open(ViewConst.WelfareWin, this._actData, passCfg);
        }, this);

        EventClient.I.on(E.Recharge.BuyShopSuccess, this.rechargeBack, this);

        UtilGame.Click(this.ndRecharge, () => {
            const pass = ModelMgr.I.GeneralPassModel.getPassConfig(this._selectId);
            if (pass.Popup > 0) {
                MaterialRewardScanWin.ShowByRewardString(this.tcRewardString, this.cRewardString, {
                    btnFunc: () => {
                        // 请求充值
                        ControllerMgr.I.RechargeController.reqC2SChargeMallBuyReq(pass.GoodsId);
                    },
                    btnName: this.LabMoney.string,
                    title1: i18n.tt(Lang.general_scan_title1),
                    title2: i18n.tt(Lang.general_scan_title2),
                    nullTip2: i18n.tt(Lang.general_pass_null_tip),
                });
            } else {
                ControllerMgr.I.RechargeController.reqC2SChargeMallBuyReq(pass.GoodsId);
            }
        }, this);
    }

    private regData(tabId) {
        this._actData = ModelMgr.I.ActivityModel.getActivityData(tabId);
        ControllerMgr.I.ActivityController.reqC2SGetActivityConfig(this._actData.FuncId);
        ControllerMgr.I.ActivityController.reqC2SPlayerActModelData(this._actData.FuncId);

        this.SprBanner.loadImage(this._actData.Config.BannerPath, 2, true);
    }

    private _canRefreshWelfareRed = true;
    public refreshPage(winId: number, param: unknown, tabIdx: number, tabId?: number): void {
        super.refreshPage(winId, param, tabIdx, tabId);
        this._selectId = 0;
        this._rechargeNum = 0;
        this._canRefreshWelfareRed = true;
        this.regData(tabId);
    }

    private refreshList() {
        this.fvChange();
        this.updateList();
    }
    protected start(): void {
        super.start();
        this.schedule(() => {
            if (this._actData) {
                this._canRefreshWelfareRed = true;
                this.welfareRed();
            }
        }, 1, cc.macro.REPEAT_FOREVER, 0.2);
    }
    private rechargeBack(gid: number) {
        const model = ModelMgr.I.GeneralPassModel;
        const pass = model.getPassConfig(this._selectId);
        const userData = model.getUserData(this._actData.FuncId, this._actData.CycNo);
        userData.data.ChargeList.push(gid);

        WinMgr.I.close(ViewConst.MaterialRewardScanWin);
        if (gid === pass.GoodsId) {
            // 领取奖励 购买完之后自动购买奖励
            this.regData(this.tabId);
            this.updateList();
        }
    }

    /** UI刷新 */
    private setUpUI(data: S2CPlayerActModelData | S2CGetGeneralPassReward | ActData) {
        if (data.FuncId !== this._actData.FuncId || data.CycNo !== this._actData.CycNo) return;
        const model = ModelMgr.I.GeneralPassModel;
        const tabCfgData = model.getPasses(this._actData.Config.ArgsGroup);
        tabCfgData.sort((a, b) => a.PassId - b.PassId);
        this._tabData = [];
        for (let i = 0; i < tabCfgData.length; i++) {
            const ele = tabCfgData[i];
            const rid = EActivityGeneralPassRedId + ele.PassId;
            RedDotMgr.I.register(rid, rid.toString());
            const item: TabData = {
                id: ele.PassId,
                title: ele.Name,
                redId: rid,
            };
            let needPush = false;
            const val = Number(ele.Value.split(':')[0]);
            if (ele.ConditionType === EGeneralPassType.FightValue) {
                const userValue = RoleMgr.I.d.FightValueMax;
                if (userValue >= val) {
                    needPush = true;
                }
            } else if (ele.ConditionType === EGeneralPassType.Level) {
                const userValue = RoleMgr.I.d.Level;
                if (userValue >= val) {
                    needPush = true;
                }
            } else if (ele.ConditionType === EGeneralPassType.LoginDay) {
                const userValue = RoleMgr.I.d.LoginDay;
                if (userValue >= val) {
                    needPush = true;
                }
            }
            if (needPush) {
                this._tabData.push(item);
            }
        }
        this._selectId = this._selectId <= 0 ? this._tabData[0].id : this._selectId;
        this.tabContainer.setData(this._tabData, this._selectId);
        this.fvChange();
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.GeneralPass.Data, this.setUpUI, this);
        EventClient.I.off(E.GeneralPass.UpdateData, this.refreshList, this);
        EventClient.I.off(E.Recharge.BuyShopSuccess, this.rechargeBack, this);
        EventClient.I.on(E.GeneralPass.WelfareData, this._welfareUpdate, this);
        RoleMgr.I.off(this.refreshList, this, RoleAN.N.FightValue, RoleAN.N.Level, RoleAN.N.LoginDay);
    }

    private fvChange() {
        const model = ModelMgr.I.GeneralPassModel;
        const pass = model.getPassConfig(this._selectId);
        if (pass.ConditionType === EGeneralPassType.FightValue) {
            this.UserInfoLab.string = UtilNum.ConvertFightValue(RoleMgr.I.d.FightValue);
        } else if (pass.ConditionType === EGeneralPassType.Level) {
            this.UserInfoLab.string = UtilNum.Convert(RoleMgr.I.d.Level) + i18n.lv;
        } else if (pass.ConditionType === EGeneralPassType.LoginDay) {
            this.UserInfoLab.string = UtilNum.Convert(RoleMgr.I.d.LoginDay) + i18n.day;
        }
        this.passPayNameLab.string = pass.GoodName;

        for (let i = 0; i < this._tabData.length; i++) {
            const ele = this._tabData[i];
            model.passRed(ele.id, this._actData.Config.ArgsGroup, this._actData.FuncId, this._actData.CycNo);
        }
        // 充值返回 更新状态
        const isCharge = model.getIsBuyPass(this._actData.FuncId, this._actData.CycNo, pass.PassId);
        this.NdLock.active = !isCharge;
        this.ndRecharge.active = !isCharge;
        this.NdRewardParent.active = !isCharge && pass.RewardShow > 0 && this._currentPayReward;

        this.welfareRed();
    }

    private _rechargeNum = 0;

    private _welfareUpdate() {
        this._canRefreshWelfareRed = true;
        this.welfareRed(false);
    }

    private welfareRed(needRef: boolean = true) {
        // 全民福利红点
        if (!this._canRefreshWelfareRed) {
            return;
        }

        this._canRefreshWelfareRed = false;
        const model = ModelMgr.I.GeneralPassModel;
        const userData = model.getUserData(this._actData.FuncId, this._actData.CycNo);
        if (!userData) return;
        if (this._rechargeNum === userData.data.ChargeNum && this._rechargeNum > 0 && needRef) {
            return;
        }
        this._rechargeNum = userData.data.ChargeNum;
        this.LabTimes.string = UtilString.FormatArray(i18n.tt(Lang.generalPass_buy_times), [userData.data.ChargeNum]);
        const welfareRed = model.welfareRed(this._actData.Config.ArgsGroup, this._actData.FuncId, this._actData.CycNo);
        UtilRedDot.UpdateRed(this.NdWelfare, welfareRed, cc.v2(35, 40));
    }

    private tabClickEvents(item: TabItem) {
        const tbData = item.getData();
        this._selectId = tbData.id;
        this.updateList();
    }

    /** 更新列表 */
    private updateList() {
        const model = ModelMgr.I.GeneralPassModel;
        const listD = model.getListData(this._actData.FuncId, this._actData.CycNo, this._selectId, this._actData.Config.ArgsGroup);
        this._listData = listD.list;
        this.list.setNumItems(this._listData.length, listD.index);
        this.setTopReward(listD);
    }

    private listScrollEvent(nd: cc.Node, index: number) {
        const itemCmp = nd.getComponent(GeneralPassItem);
        itemCmp.setData(this._listData[index], index, this._actData.FuncId, this._actData.CycNo);
    }

    private cRewardString = '';
    private tcRewardString = '';
    /** 标记用户是否达到最低要求 */
    private _currentPayReward = true;
    /** 顶部数据处理 */
    private setTopReward(listD: { list: GeneralPassItemData[], index: number }) {
        const model = ModelMgr.I.GeneralPassModel;
        const { c, t, tc } = model.getPayReward(listD.list, listD.index);
        const cArr = t.split('|').slice(0, -1);
        const pass = model.getPassConfig(this._selectId);
        this.NdReward.children.forEach((n) => {
            n.active = false;
        });
        let iscurRew = true;
        if (cArr.length > 0) {
            iscurRew = true;
            for (let i = 0; i < cArr.length; i++) {
                const ele = cArr[i].split(':');
                const itemId = Number(ele[0]);
                const itemNum = Number(ele[1]);
                const itemIcon = `${UtilItem.GetItemIconPathByItemId(itemId)}_h`;
                const nd = this.NdReward.children[i] || cc.instantiate(this.NdItemInfo);
                nd.active = true;
                if (!nd.parent) this.NdReward.addChild(nd);
                const sprIcon = nd.getChildByName('SprIcon').getComponent(DynamicImage);
                const labNum = nd.getChildByName('LabNum').getComponent(cc.Label);
                sprIcon.loadImage(itemIcon, 1, true);
                labNum.string = UtilNum.Convert(itemNum);
            }
        } else {
            iscurRew = false;
        }
        this.cRewardString = c;
        this.tcRewardString = tc;

        const cfgMoney: number = Config.Get(Config.Type.Cfg_ChargeMall).getValueByKey(pass.GoodsId, 'Money');
        const money = cfgMoney / 100;
        this.LabMoney.string = UtilString.FormatArray(i18n.tt(Lang.generalPass_charge_money), [money]);

        const passTip = pass.Desc;
        const imgPath = `texture/activity/generalPass/font_djzl_${pass.DescPic}@ML`;
        const params = pass.DescNum.split('|');
        passTip.split('-');
        let idx = 0;
        let nPassTip = '';
        for (let k = 0; k < passTip.length; k++) {
            const tp = passTip[k];
            if (tp === '-') {
                nPassTip += idx.toString();
                idx++;
            } else {
                nPassTip += tp;
            }
        }
        this.NdTip.destroyAllChildren();
        this.NdTip.removeAllChildren();
        for (let m = 0; m < nPassTip.length; m++) {
            const char = nPassTip[m];
            if (char === '0') {
                this.createSprTy(imgPath);
            } else if (char === '1' || char === '2') {
                this.createTp1(params[Number(char) - 1]);
            } else {
                this.createTp0(char);
            }
        }
        // 充值返回 更新状态
        const isCharge = model.getIsBuyPass(this._actData.FuncId, this._actData.CycNo, pass.PassId);
        this.NdLock.active = !isCharge;
        this.ndRecharge.active = !isCharge;
        this.NdRewardParent.active = !isCharge && iscurRew && pass.RewardShow > 0;
        this._currentPayReward = iscurRew;
    }

    private createTp0(str: string) {
        const nd: cc.Label = cc.instantiate(this.labTp0.node).getComponent(cc.Label);
        nd.string = str;
        nd.node.active = true;
        nd.node.parent = this.NdTip;
    }

    private createSprTy(str: string) {
        const nd: DynamicImage = cc.instantiate(this.SprTp.node).getComponent(DynamicImage);
        nd.loadImage(str, 1, true);
        nd.node.active = true;
        nd.node.parent = this.NdTip;
    }

    private createTp1(str: string) {
        const nd: cc.Label = cc.instantiate(this.labTp1.node).getComponent(cc.Label);
        nd.string = str;
        nd.node.active = true;
        nd.node.parent = this.NdTip;
    }
}
