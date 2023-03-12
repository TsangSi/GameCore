/*
 * @Author: dcj
 * @Date: 2022-08-29 14:26:05
 * @FilePath: \SanGuo-2.4-main\assets\script\game\module\worldBoss\v\WorldBossInspireWin.ts
 * @Description:
 */
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { RoleMgr } from '../../role/RoleMgr';
import { UtilCurrency } from '../../../base/utils/UtilCurrency';
import { UtilGame } from '../../../base/utils/UtilGame';
import { WinCmp } from '../../../com/win/WinCmp';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import ModelMgr from '../../../manager/ModelMgr';
import { ItemCurrencyId } from '../../../com/item/ItemConst';
import { i18n, Lang } from '../../../../i18n/i18n';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { WorldBossModel } from '../WorldBossModel';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import ControllerMgr from '../../../manager/ControllerMgr';
import { EventClient } from '../../../../app/base/event/EventClient';
import { E } from '../../../const/EventName';

const { ccclass, property } = cc._decorator;
@ccclass
export class WorldBossInspireWin extends WinCmp {
    @property(cc.Node)
    private BtnCancel: cc.Node = null;
    @property(cc.Node)
    private BtnInspire: cc.Node = null;
    @property(cc.Label)
    private CurAttr: cc.Label = null;
    @property(cc.Label)
    private NextAttr: cc.Label = null;
    @property(cc.Node)
    private NdLastTime: cc.Node = null;
    @property(cc.Node)
    private ConsumeNode: cc.Node = null;

    private _level: number = null;
    private _time: number = 0;
    private _costType: number = ItemCurrencyId.JADE;
    private _M: WorldBossModel = null;
    protected start(): void {
        super.start();
        UtilGame.Click(this.BtnCancel, () => {
            this.close();
        }, this);
        UtilGame.Click(this.BtnInspire, () => {
            if (this._level + 1 > this._M.CfgWorldBossInspireConfig.length) {
                MsgToastMgr.Show(i18n.tt(Lang.world_boss_inspire_max));
                return;
            }
            ModelMgr.I.MsgBoxModel.ShowBox(UtilString.FormatArray(
                i18n.tt(Lang.world_boss_inspire),
                [UtilColor.NorV, UtilCurrency.getNameByType(this._costType)],
            ), () => {
                ControllerMgr.I.WorldBossController.C2SWorldBossBuyBuff();
            }, { showToggle: 'WorldBossInspireWin', tipTogState: false });
        }, this);

        EventClient.I.on(E.WorldBoss.UpdateInspireWin, this.updateView, this);
    }

    public init(winId: number, param: unknown): void {
        super.init(winId, param);
        this._M = ModelMgr.I.WorldBossModel;
        this.updatePerSecond();
        this.updateView();
    }

    protected updatePerSecond(): void {
        const lastTime = this.NdLastTime.getChildByName('endTime');
        const endLab = lastTime.getComponent(cc.Label);
        this._time = this._M.endTime - UtilTime.NowSec();

        if (this._time > 0) {
            this._time--;
            endLab.string = UtilTime.FormatHourDetail(this._time);
        } else {
            this.node.destroy();
        }
    }

    private updateView(): void {
        this._level = this._M.buffNum || 0;
        this.updateAttr();
        this.updateCostNode();
    }

    private updateAttr(): void {
        const curRatio = this._M.getInspireRatio(this._level);
        const nextRadio = this._M.getInspireRatio(this._level + 1);
        this.CurAttr.string = curRatio;
        this.NextAttr.string = nextRadio;
    }

    private updateCostNode(): void {
        if (this._level + 1 > this._M.CfgWorldBossInspireConfig.length) {
            this.ConsumeNode.active = false;
            UtilCocos.SetSpriteGray(this.BtnInspire, true);
            return;
        }
        const data: Cfg_WorldBoss_Inspire = this._M.CfgWorldBossInspireConfig.getValueByKey(this._level + 1);
        const list = data.Cost.split(':');
        const needCost = +list[1];
        const costType = +list[0];
        const costSpr = this.ConsumeNode.getChildByName('CostSpr').getComponent(cc.Sprite);
        const costLabel = this.ConsumeNode.getChildByName('Ndcost').getComponent(cc.Label);
        const bagNum = RoleMgr.I.getCurrencyById(costType);
        const color: cc.Color = bagNum >= needCost ? UtilColor.Hex2Rgba(UtilColor.GreenV) : UtilColor.Hex2Rgba(UtilColor.RedV);

        costLabel.string = `${UtilNum.Convert(needCost)}/${UtilNum.Convert(bagNum)}`;
        costLabel.node.color = color;
        UtilCocos.LoadSpriteFrameRemote(costSpr, UtilCurrency.getIconByCurrencyType(costType));
        this._costType = costType;
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.WorldBoss.UpdateInspireWin, this.updateView, this);
    }
}
