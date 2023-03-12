/*
 * @Author: zs
 * @Date: 2022-06-06 12:17:30
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-12-09 11:57:42
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\recharge\v\RechargeItem.ts
 * @Description:
 *
 */

import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { AssetType } from '../../../../app/core/res/ResConst';
import { i18n, Lang } from '../../../../i18n/i18n';
import { Config } from '../../../base/config/Config';
import { UtilGame } from '../../../base/utils/UtilGame';
import { RES_ENUM } from '../../../const/ResPath';
import ControllerMgr from '../../../manager/ControllerMgr';
import { EMallType, EProductType } from '../RechargeConst';

const { ccclass, property } = cc._decorator;

/**
 * Predefined variables
 * Name = RechargeItem
 * DateTime = Mon Jun 06 2022 12:17:30 GMT+0800 (中国标准时间)
 * Author = knuth520
 * FileBasename = RechargeItem.ts
 * FileBasenameNoExtension = RechargeItem
 * URL = db://assets/script/game/module/recharge/RechargeItem.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

// declare class GoodsList {
//     Gid: number;
//     Gn: string;
//     Mt: number;
//     S: number;
//     P: number;
//     Pid: number;
//     Gt: number;
//     I: number;
//     constructor(data?);
// }

const Double = 2;

@ccclass
export class RechargeItem extends cc.Component {
    @property(cc.Sprite)
    private SpriteIcon: cc.Sprite = null;
    @property(cc.Node)
    private NodeLabelBg: cc.Node = null;
    @property(cc.Label)
    private LabelName: cc.Label = null;
    @property(cc.Label)
    private LabelRmb: cc.Label = null;
    private curdata: GoodsData = null;
    protected start(): void {
        UtilGame.Click(this.node, () => {
            if (this.curdata.Mt === EMallType.GDShop && this.curdata.Gt !== EProductType.Other) {
                //
            } else {
                ControllerMgr.I.RechargeController.reqC2SChargeMallBuyReq(this.curdata.Gid);
            }
        }, this);
    }

    public setData(data: GoodsData, index: number): void {
        if (!data) {
            this.node.destroy();
        } else {
            this.curdata = data;
            if (this.curdata.Mt === EMallType.GDShop) {
                //
            } else {
                this.chargeYB();
            }
        }
    }

    private chargeYB() {
        // if (this.curdata.I === Double) {
        // } else {
        // }
        const cfg: Cfg_ChargeMall = Config.Get(Config.Type.Cfg_ChargeMall).getValueByKey(this.curdata.Gid);
        if (cfg) {
            this.LabelName.string = cfg.GoodsTitle;
            const ybex = cfg.ItemString.split(':')[1];

            if (this.curdata.I === Double) {
                this.NodeLabelBg.active = true;
                if (cfg.DoubleForever === 1) {
                    UtilCocos.SetString(this.NodeLabelBg, 'LabelSend', UtilString.FormatArgs(i18n.tt(Lang.recharge_life_song), ybex));
                } else {
                    UtilCocos.SetString(this.NodeLabelBg, 'LabelSend', UtilString.FormatArgs(i18n.tt(Lang.recharge_song), ybex));
                }
            } else {
                this.NodeLabelBg.active = false;
            }
            const path = `${RES_ENUM.Recharge_Img_Chongzhi_Yubi}${UtilNum.FillZero(cfg.PicId, 2)}`;
            UtilCocos.LoadSpriteFrameRemote(this.SpriteIcon, path, AssetType.SpriteFrame);
            this.LabelRmb.string = UtilString.FormatArgs(i18n.tt(Lang.recharge_rmb), this.curdata.P / 100);
        }
    }
}
