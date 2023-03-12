/*
 * @Author: dcj
 * @Date: 2022-11-02 12:21:59
 * @FilePath: \SanGuo2.4\assets\script\game\module\beaconWar\v\BeaconWarQuickWin.ts
 * @Description:快速使用
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilString } from '../../../../app/base/utils/UtilString';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import { ItemIcon } from '../../../com/item/ItemIcon';
import ItemModel from '../../../com/item/ItemModel';
import { WinCmp } from '../../../com/win/WinCmp';
import { E } from '../../../const/EventName';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { BagMgr } from '../../bag/BagMgr';
import { RoleMgr } from '../../role/RoleMgr';
import { BeaconWarCfgKey } from '../BeaconWarConst';
import { BeaconWarModel } from '../BeaconWarModel';

const { ccclass, property } = cc._decorator;
@ccclass
export class BeaconWarQuickWin extends WinCmp {
    @property(cc.Node)
    private LabDesc: cc.Node = null;
    @property(cc.Label)
    private LabNum: cc.Label = null;
    @property(cc.Node)
    private BtnDefine: cc.Node = null;
    @property(cc.Node)
    private BtnConsume: cc.Node = null;
    @property(cc.Node)
    private ItemMaterial: cc.Node = null;
    @property(cc.Toggle)
    private tipTog: cc.Toggle = null;
    @property(cc.Label)
    private LabTime: cc.Label = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.tipTog.node, () => {
            if (this.tipTog.isChecked) {
                EventClient.I.emit(E.MsgBox.AddTogleFlag, this._M.tipsKey);
            }
        }, this);
        UtilGame.Click(this.BtnDefine, () => {
            if (this.isMaxEnergy) { // 体力满了
                MsgToastMgr.Show(i18n.tt(Lang.beaconWar_energy));
                return;
            } else if (!ModelMgr.I.BeaconWarModel.isHaveEnergyId()) {
                MsgToastMgr.Show(i18n.tt(Lang.beaconWar_less));
                WinMgr.I.open(ViewConst.ItemSourceWin, ModelMgr.I.BeaconWarModel.getEnergyIdAndNeed().id);
                return;
            }
            ControllerMgr.I.BeaconWarController.reqBossHomeBuyEnergy();
            this.close();
        }, this);
        UtilGame.Click(this.BtnConsume, () => {
            this.closeWin();
        }, this);
    }

    private upView(): void {
        const num = ModelMgr.I.BossModel.getValByKey(BeaconWarCfgKey.BeaconWarStrengthKill) || 0;
        const refNum = ModelMgr.I.BossModel.getValByKey(BeaconWarCfgKey.BeaconWarStrengthReply) || 0;
        // 道具
        const _model = this._M.getQuickUseModel();
        const item = this.ItemMaterial.getComponent(ItemIcon);
        if (!item.getData()) {
            item.setData(_model);
        }
        this._itemModel = item.getData();
        // 改描述
        const rich = this.LabDesc.getComponent(cc.RichText);
        if (this._type) {
            rich.string = UtilString.FormatArray(
                i18n.tt(Lang.beaconWar_quick_desc),
                [num, _model.cfg?.Name, refNum, UtilColor.NorV, UtilColor.RedD],
            );
        } else {
            rich.string = UtilString.FormatArray(
                i18n.tt(Lang.beaconWar_quick_desc2),
                [refNum, _model.cfg?.Name, UtilColor.NorV, UtilColor.Red],
            );
        }

        // 拥有多少个
        const hasNum = BagMgr.I.getItemNum(_model.data.ItemId);
        this.LabNum.string = `${hasNum}${i18n.tt(Lang.com_ge)}`;
        // const needNum = _model.data.ItemNum;
        // this.isEngCount = hasNum < needNum;

        this.upMaxEnergy();

        //
        this.tipTog.node.active = !this._type;
        //
        if (this._type) {
            this.LabTime.string = `${this._time}秒`;
            this.unschedule(this.uptTime);
            this.schedule(this.uptTime, 1);
        } else {
            this.LabTime.string = '';
        }
    }

    private uptTime() {
        if (this._time > 0) {
            this._time--;
            this.LabTime.string = `${this._time}秒`;
        } else {
            this.closeWin();
        }
    }

    private upMaxEnergy() {
        const have: number = RoleMgr.I.d.BossHomeEnergyVal;
        const need: number = this._M.getNeedEnergy();
        this.isMaxEnergy = have >= need;
    }

    private _M: BeaconWarModel = null;
    private isMaxEnergy = false;
    private _itemModel: ItemModel = null;
    private _type: number = 0;
    private _time: number = 10;

    public init(param: unknown): void {
        super.init(param);
        // console.log(param);
        if (param && param[0]) {
            this._type = param[0];
        }

        this._M = ModelMgr.I.BeaconWarModel;
        this.upView();
    }

    private closeWin() {
        if (this._type && RoleMgr.I.d.BossHomeEnergyVal < 10) {
            ModelMgr.I.BeaconWarModel.exit(false, true);
        }
        this.close();
    }

    protected onDestroy(): void {
        super.onDestroy();
    }
}
