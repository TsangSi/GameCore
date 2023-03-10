/*
 * @Author: myl
 * @Date: 2022-08-04 14:28:15
 * @Description:
 */

import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { UtilString } from '../../../../../app/base/utils/UtilString';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { AssetType } from '../../../../../app/core/res/ResConst';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { DynamicImage } from '../../../../base/components/DynamicImage';
import { Config } from '../../../../base/config/Config';
import MsgToastMgr from '../../../../base/msgtoast/MsgToastMgr';
import { UtilCurrency } from '../../../../base/utils/UtilCurrency';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItem from '../../../../base/utils/UtilItem';
import { BattleCommon } from '../../../../battle/BattleCommon';
import { GuideBtnIds } from '../../../../com/guide/GuideConst';
import { GuideMgr } from '../../../../com/guide/GuideMgr';
import ItemModel from '../../../../com/item/ItemModel';
import { RES_ENUM } from '../../../../const/ResPath';
import { ViewConst } from '../../../../const/ViewConst';
import ControllerMgr from '../../../../manager/ControllerMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import { EBattleType } from '../../../battleResult/BattleResultConst';
import { Link } from '../../../link/Link';
import { RoleMgr } from '../../../role/RoleMgr';
import { EVipFuncType } from '../../../vip/VipConst';
import { MaterialRewardScanWin } from './MaterialRewardScanWin';

const { ccclass, property } = cc._decorator;

@ccclass
export class MaterialItem extends cc.Component {
    @property(cc.Node)
    private btnSweep: cc.Node = null;
    @property(cc.Node)
    private btnChallenge: cc.Node = null;
    @property(cc.Node)
    private btnAdd: cc.Node = null;
    @property(cc.Node)
    private btnCheckDesc: cc.Node = null;

    @property(cc.ProgressBar)
    private progress: cc.ProgressBar = null;

    @property(cc.Sprite)
    private sprBg: cc.Sprite = null;

    // ??????
    @property(cc.Label)
    private labTimes: cc.Label = null;
    // ??????
    @property(cc.Label)
    private labStarCount: cc.Label = null;
    // ????????????
    @property(cc.Label)
    private labProgress: cc.Label = null;

    // ????????????
    @property(cc.Label)
    private labTip: cc.Label = null;
    // ????????????
    @property(DynamicImage)
    private sprTitle: DynamicImage = null;

    @property(cc.Node)
    private NdOperate: cc.Node = null;
    @property(cc.Node)
    private NdTip: cc.Node = null;

    @property(cc.Node)
    private redNode: cc.Node = null;

    private _data: { config: Cfg_FB_Material, data: MaterialData, guideId?: number } = null;

    protected start(): void {
        UtilGame.Click(this.btnCheckDesc, () => {
            // ????????????
            const DropPrize1 = this._data.config.DropPrize.split('|');
            const DropPrizeAdd = this._data.config.DropInc.split('|');
            const star = this._data?.data?.Star || 1;
            const ItemModels: ItemModel[] = [];
            const ItemModels1: ItemModel[] = [];
            for (let i = 0; i < DropPrize1.length; i++) {
                const itm = DropPrize1[i].split(':');
                const num = parseInt(itm[1]);
                const addNum = parseInt(DropPrizeAdd[i]) * (star - 1);
                const addNum1 = parseInt(DropPrizeAdd[i]) * star;
                const nuwNum = num + addNum;
                const nuwNum1 = num + addNum1;
                const item = UtilItem.NewItemModel(parseInt(itm[0]), nuwNum);
                const item1 = UtilItem.NewItemModel(parseInt(itm[0]), nuwNum1);
                ItemModels.push(item);
                ItemModels1.push(item1);
            }
            // WinMgr.I.open(ViewConst.MaterialRewardScanWin, this._data);
            MaterialRewardScanWin.Show(ItemModels, ItemModels1);
            // WinMgr.I.open(ViewConst.DescWinTip, this._data.config.ClientMsg);
        }, this);
        UtilGame.Click(this.btnAdd, () => {
            const { tip, vipLv } = ModelMgr.I.VipModel.getMinTimesCfg(EVipFuncType.MITime);
            if (RoleMgr.I.d.VipLevel < vipLv) {
                MsgToastMgr.Show(tip);
                return;
            }
            this.showBuyView();
        }, this);
        UtilGame.Click(this.btnChallenge, () => {
            // ??????
            WinMgr.I.setViewStashParam(ViewConst.MaterialWin, [0]);
            if (this._data && this._data.data) {
                BattleCommon.I.enter(EBattleType.MaterialFb, this._data.data.MaterialId);
                // ControllerMgr.I.MaterialController.challengeFB(this._data.data.MaterialId);
            }
            // else {
            //     MsgToastMgr.Show(i18n.tt(Lang.com_err));
            // }
        }, this);
        UtilGame.Click(this.btnSweep, () => {
            // ??????
            const controller = ControllerMgr.I.MaterialController;
            controller.sweep(this._data.data.MaterialId);
        }, this);

        UtilGame.Click(this.NdTip, () => {
            // ???????????????????????????
            Link.To(this._data.config.JumpId);
        }, this);
    }

    public setData(_data: { config: Cfg_FB_Material, data: MaterialData, guideId?: number }, index: number): void {
        this._data = _data;
        UtilCocos.LoadSpriteFrameRemote(this.sprBg, `${RES_ENUM.Material_Item_Bg}${index % 2}`, AssetType.SpriteFrame, () => {
            //
        });

        this.sprTitle.loadImage(`${RES_ENUM.Material}Material_${_data.config.Id}_Name@ML`, 1, true);
        // UtilCocos.LoadSpriteFrameRemote(this.sprTitle, `${RES_ENUM.Material}${_data.config.Name}`, AssetType.SpriteFrame, () => {
        //     //
        // });
        const config: Cfg_FB_Material = Config.Get(Config.Type.Cfg_FB_Material).getValueByKey(_data.config.Id);

        // if (_data.data) {
        this.labTimes.string = _data.data.Num.toString();
        this.labTimes.node.color = _data.data.Num > 0 ? UtilColor.ColorEnoughV : UtilColor.ColorUnEnoughV;
        this.labStarCount.string = _data.data.Star.toString();
        const exp = _data.data.Exp === null ? 0 : _data.data.Exp;
        const rankConfig = config.StarUp.split('|');
        const rank = rankConfig[_data.data.Star];
        let hisRank = rankConfig[_data.data.Star - 1];
        if (hisRank === null || hisRank === undefined) {
            hisRank = '0';
        }
        this.progress.progress = exp / (parseInt(rank) - parseInt(hisRank));
        this.labProgress.string = `${exp}/${parseInt(rank) - parseInt(hisRank)}`;
        this.labProgress.node.active = true;
        // if(_data.data.BuyNum)
        this.btnSweep.active = !!_data.data.CanSweep;
        this.btnChallenge.active = !this.btnSweep.active;
        // } else {
        const condition = ModelMgr.I.MaterialModel.condition(config.Unlock);
        this.NdTip.active = !condition.unlock;
        this.NdOperate.active = condition.unlock;
        if (condition.unlock) {
            // ????????????
        } else {
            // ????????? ??????????????????
            this.labTip.string = condition.cond;
        }
        // }

        if (ModelMgr.I.MsgBoxModel.isOpen(`MaterialView${this._data.config.Id}`)) {
            this.showBuyView();
        }

        const node = this.btnChallenge.active ? this.btnChallenge : this.btnSweep;
        if (this._data.guideId) {
            GuideMgr.I.bindScript(this._data.guideId, node);
        } else {
            GuideMgr.I.unbind(GuideBtnIds.MaterialFightMount, node);
            GuideMgr.I.unbind(GuideBtnIds.MaterialFightReiki, node);
            GuideMgr.I.unbind(GuideBtnIds.MaterialFightKotake, node);
            GuideMgr.I.unbind(GuideBtnIds.MaterialFightWing, node);
        }

        this.redNode.active = _data.data.Num > 0 && condition.unlock;
    }

    private showBuyView() {
        // ?????????????????? ??????id ???????????????1
        const conf = ModelMgr.I.MaterialModel.buyOneConfig(this._data.config.Id, this._data.data.BuyNum);
        // ????????????
        const coinTip = UtilItem.GetItemTipString(conf.config.Coin);

        const vipName = ModelMgr.I.VipModel.vipName(RoleMgr.I.d.VipLevel);
        // const cfgItem = conf.config.Coin.split(':');
        // const cfgNum = Number(cfgItem[1]);
        // const cfgitemName = UtilCurrency.getNameByType(Number(cfgItem[0]));

        const config = [
            UtilColor.NorV,
            UtilColor.GreenV,
            coinTip.num,
            1,
            vipName,
            conf.maxTimes - this._data.data.BuyNum,
            conf.maxTimes,
            conf.maxTimes > this._data.data.BuyNum ? UtilColor.GreenV : UtilColor.RedV,
            coinTip.name,
        ];
        const tip = UtilString.FormatArray(
            i18n.tt(Lang.material_buy_tip),
            config,
        );
        ModelMgr.I.MsgBoxModel.ShowBox(tip, () => {
            if (conf.maxTimes <= this._data.data.BuyNum) {
                MsgToastMgr.Show(i18n.tt(Lang.arena_buy_times_unenough));
                return;
            }
            if (RoleMgr.I.checkByConfig(conf.config.Coin)) {
                ControllerMgr.I.MaterialController.buyTimes(this._data.data.MaterialId);
                MsgToastMgr.Show(i18n.tt(Lang.com_buy_success));
            } else {
                MsgToastMgr.Show(coinTip.name + i18n.tt(Lang.com_buzu));
            }
        }, { showToggle: '', cbCloseFlag: `MaterialView${this._data.config.Id}` }, null);
    }
}
