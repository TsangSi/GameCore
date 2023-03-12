/*
 * @Author: dcj
 * @Date: 2022-11-02 12:21:59
 * @FilePath: \SanGuo\assets\script\game\module\beaconWar\v\BeaconWarInspireWin.ts
 * @Description:
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import { i18n, Lang } from '../../../../i18n/i18n';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilCurrency } from '../../../base/utils/UtilCurrency';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import { WinCmp } from '../../../com/win/WinCmp';
import { E } from '../../../const/EventName';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { WinAutoPayTipsModel, AutoPayKey } from '../../pay/WinAutoPayTipsModel';
import { RoleAN } from '../../role/RoleAN';
import { RoleMgr } from '../../role/RoleMgr';
import { BeaconWarCfgKey } from '../BeaconWarConst';
import { BeaconWarModel } from '../BeaconWarModel';

const { ccclass, property } = cc._decorator;
@ccclass
export class BeaconWarInspireWin extends WinCmp {
    @property(cc.Node)
    private NdInspireEff: cc.Node = null;
    @property(cc.Node)
    private NdInspireTime: cc.Node = null;
    @property(cc.Node)
    private BtnInspire: cc.Node = null;
    @property(cc.Toggle)
    private Toggle: cc.Toggle = null;
    @property(cc.Node)
    private NdConsume: cc.Node = null;
    @property(cc.RichText)
    private Labdesc: cc.RichText = null;

    private LabinsEff: cc.Label = null;
    private LabinsEffMax: cc.Label = null;
    private LabinsTime: cc.Label = null;
    private LabinsTimeMax: cc.Label = null;
    private buffEndTime: number = 0;
    private _inspireCost: string[] = [];
    private costLabel: cc.Label = null;
    private addAttack: number = null;
    private addEndTime: number = null;
    private isChoose: boolean = false;

    private _M: BeaconWarModel = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.BtnInspire, () => {
            const checkInspire: { state: boolean, str: string } = this._M.isCanInspire();
            if (checkInspire.state) {
                ControllerMgr.I.BeaconWarController.reqBossHomeBuyBuff();
            }
            MsgToastMgr.Show(checkInspire.str);
        }, this);
        EventClient.I.on(E.BeaconWar.UptInspire, this.upView, this);
        RoleMgr.I.on(this.updateCost, this, RoleAN.N.ItemType_Coin2);
        EventClient.I.on(E.MsgBox.Close, this._closeAutoHandle, this);
    }

    protected updatePerSecond(): void {
        this.buffEndTime = this._M.inspireData.endTime - UtilTime.NowSec();
        if (this.buffEndTime >= 0) {
            this.LabinsTime.string = `${this.buffEndTime}${i18n.tt(Lang.com_second)}`;
        }
    }

    private initUI(): void {
        this._M = ModelMgr.I.BeaconWarModel;
        this.LabinsEff = this.NdInspireEff.getChildByName('LabVal').getComponent(cc.Label);
        this.LabinsEffMax = this.NdInspireEff.getChildByName('LabMaxVal').getComponent(cc.Label);
        this.LabinsTime = this.NdInspireTime.getChildByName('LabVal').getComponent(cc.Label);
        this.LabinsTimeMax = this.NdInspireTime.getChildByName('LabMaxVal').getComponent(cc.Label);
        const costSpr = this.NdConsume.getChildByName('CostSpr').getComponent(cc.Sprite);
        this.costLabel = this.NdConsume.getChildByName('Ndcost').getComponent(cc.Label);

        const maxAttack = +ModelMgr.I.BossModel.getValByKey(BeaconWarCfgKey.BeaconWarMaxAtt);
        const maxEndTime = +ModelMgr.I.BossModel.getValByKey(BeaconWarCfgKey.BeaconWarTimeLimit);
        this.addAttack = +ModelMgr.I.BossModel.getValByKey(BeaconWarCfgKey.BeaconWarAddAtt);
        this.addEndTime = +ModelMgr.I.BossModel.getValByKey(BeaconWarCfgKey.BeaconWarAddSeconds);
        const inspireCost = ModelMgr.I.BossModel.getValByKey(BeaconWarCfgKey.BeaconWarInspireCost);
        this._inspireCost = inspireCost.split(':');
        // 初始化上限
        this.Labdesc.string = UtilString.FormatArray(
            i18n.tt(Lang.com_inspire),
            [this.addAttack / 100, this.addEndTime, UtilColor.NorV, UtilColor.GreenV],
        );

        this.LabinsEffMax.string = UtilString.FormatArray(
            i18n.tt(Lang.beaconWar_max),
            [`${maxAttack / 100}%`],
        );
        this.LabinsTimeMax.string = UtilString.FormatArray(
            i18n.tt(Lang.beaconWar_max),
            [`${maxEndTime}${i18n.tt(Lang.com_second)}`],
        );
        // 更新消耗
        UtilCocos.LoadSpriteFrameRemote(costSpr, UtilCurrency.getIconByCurrencyType(+this._inspireCost[0]));
        this.updateCost();
    }

    private updateCost(): void {
        const needCost = +this._inspireCost[1];
        const bagNum = RoleMgr.I.getCurrencyById(+this._inspireCost[0]);
        const color: cc.Color = bagNum >= needCost ? UtilColor.Hex2Rgba(UtilColor.GreenV) : UtilColor.Hex2Rgba(UtilColor.RedV);
        this.costLabel.string = `${UtilNum.Convert(bagNum)}/${UtilNum.Convert(needCost)}`;
        this.costLabel.node.color = color;
    }

    public init(winId: number, param: unknown): void {
        super.init(winId, param);
        this.initUI();
        this.upView();
    }

    private upView(): void {
        const num = (this._M.inspireData.buffNum * this.addAttack) / 100;
        this.LabinsEff.string = `${i18n.tt(Lang.com_attr_2_name)}+${num}%`;
        this.buffEndTime = this._M.inspireData.endTime - UtilTime.NowSec();
        this.LabinsTime.string = `${this.buffEndTime > 0 ? this.buffEndTime : 0}${i18n.tt(Lang.com_second)}`;

        // 更新自动鼓舞
        const isAuto = WinAutoPayTipsModel.getState(AutoPayKey.BeaconWarAutoBuff);
        this.Toggle.isChecked = isAuto;
        this.isChoose = isAuto;
    }
    private toggleClick() {
        if (this.Toggle.isChecked) {
            ModelMgr.I.MsgBoxModel.ShowBox(UtilString.FormatArray(
                i18n.tt(Lang.beaconWar_auto_inspire_tips),
                [`${UtilItem.GetCfgByItemId(+this._inspireCost[0]).Name}`, UtilColor.NorV, UtilColor.RedD],
            ), () => {
                this.isChoose = true;
                this._M.autoInspire();
                WinAutoPayTipsModel.setState(AutoPayKey.BeaconWarAutoBuff, true);
            }, null, () => {
                this.Toggle.isChecked = false;
                WinAutoPayTipsModel.setState(AutoPayKey.BeaconWarAutoBuff, false);
            });
        } else {
            this.isChoose = false;
            this.Toggle.isChecked = false;
            WinAutoPayTipsModel.setState(AutoPayKey.BeaconWarAutoBuff, false);
        }
    }

    private _closeAutoHandle(): void {
        this.Toggle.isChecked = this.isChoose;
        WinAutoPayTipsModel.setState(AutoPayKey.BeaconWarAutoBuff, this.isChoose);
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.BeaconWar.UptInspire, this.upView, this);
        EventClient.I.off(E.MsgBox.Close, this._closeAutoHandle, this);
        RoleMgr.I.off(this.updateCost, this, RoleAN.N.ItemType_Coin2);
    }
}
