/*
 * @Author: kexd
 * @Date: 2022-12-23 14:35:47
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\gBook\v\GComposeItem.ts
 * @Description:
 *
 */

import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../../app/base/utils/UtilNum';
import BaseCmp from '../../../../../app/core/mvc/view/BaseCmp';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { UtilGame } from '../../../../base/utils/UtilGame';
import { ViewConst } from '../../../../const/ViewConst';
import ControllerMgr from '../../../../manager/ControllerMgr';
import { GeneralMsg } from '../../GeneralConst';
import GeneralHead from '../../com/GeneralHead';
import { BagMgr } from '../../../bag/BagMgr';
import { EventClient } from '../../../../../app/base/event/EventClient';
import { ItemQuality, ItemType } from '../../../../com/item/ItemConst';
import { E } from '../../../../const/EventName';
import { BagItemChangeInfo } from '../../../bag/BagConst';
import { UtilColorFull } from '../../../../base/utils/UtilColorFull';
import UtilItem from '../../../../base/utils/UtilItem';

const { ccclass, property } = cc._decorator;
@ccclass
export default class GComposeItem extends BaseCmp {
    @property(GeneralHead)
    private GeneralHead: GeneralHead = null;
    @property(cc.Label)
    private LabName: cc.Label = null;
    @property(cc.Label)
    private LabHave: cc.Label = null;
    @property(cc.Node)
    private NdGet: cc.Node = null;
    @property(cc.Node)
    private BtnCompose: cc.Node = null;

    private _data: GeneralMsg = null;
    private _costId: number = 0;
    private _costNum: number = 0;

    protected start(): void {
        super.start();

        UtilGame.Click(this.NdGet, () => {
            const have = BagMgr.I.getItemNum(this._costId);
            if (have < this._costNum) {
                WinMgr.I.open(ViewConst.ItemSourceWin, this._costId);
            }
        }, this);

        UtilGame.Click(this.BtnCompose, () => {
            const have = BagMgr.I.getItemNum(this._costId);
            const num = Math.floor(have / this._costNum);
            if (num > 0) {
                ControllerMgr.I.GeneralController.reqGeneralCompose(this._data.cfg.Id, num);
            }
        }, this);

        this.addE();
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }

    private addE() {
        EventClient.I.on(E.Bag.ItemChange, this.onBagChange, this);
    }

    private remE() {
        EventClient.I.off(E.Bag.ItemChange, this.onBagChange, this);
    }

    private onBagChange(changes: BagItemChangeInfo[]) {
        let check: boolean = false;
        if (changes) {
            for (let i = 0; i < changes.length; i++) {
                if (changes[i].itemModel && changes[i].itemModel.cfg
                    && changes[i].itemModel.cfg.SubType === ItemType.GENERAL_ITEM) {
                    check = true;
                    break;
                }
            }
        }
        if (check) {
            this.uptState();
        }
    }

    /**
     * 展示
     * @param data GeneralMsg
     */
    public setData(data: GeneralMsg): void {
        if (!data) return;
        this._data = data;

        this.GeneralHead.setData(data, {});

        this.LabName.string = data.cfg.Name;
        // 用道具品质对应的颜色，若不对再重新定义对应颜色吧
        UtilColorFull.resetMat(this.LabName);
        if (data.generalData.Quality === ItemQuality.COLORFUL) {
            UtilColorFull.setColorFull(this.LabName, false);
        } else {
            this.LabName.node.color = UtilColor.Hex2Rgba(UtilItem.GetItemQualityColor(data.generalData.Quality, true));
        }
        //
        const cost = data.cfg.StickCost.split(':');
        this._costId = +cost[0];
        this._costNum = +cost[1];

        this.uptState();
    }

    private uptState() {
        const have = BagMgr.I.getItemNum(this._costId);
        const color: cc.Color = have >= this._costNum ? UtilColor.Hex2Rgba(UtilColor.GreenG) : UtilColor.Hex2Rgba(UtilColor.RedG);
        this.LabHave.node.color = color;
        this.LabHave.string = `${UtilNum.Convert(have)}/${this._costNum}`;
        // 红点
        const isRed: boolean = have >= this._costNum;
        this.NdGet.active = !isRed;
        this.BtnCompose.active = isRed;
    }
}
