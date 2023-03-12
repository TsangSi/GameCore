/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/*
 * @Author: kexd
 * @Date: 2022-12-03 17:20:50
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\com\GeneralCombo.ts
 * @Description:
 *
 */

import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import BaseUiView from '../../../../app/core/mvc/view/BaseUiView';
import { i18n, Lang } from '../../../../i18n/i18n';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import { GeneralMsg } from '../GeneralConst';
import ModelMgr from '../../../manager/ModelMgr';
import { RES_ENUM } from '../../../const/ResPath';

const { ccclass, property } = cc._decorator;

@ccclass
export class GeneralCombo extends BaseUiView {
    @property(cc.Node)
    private NdBg: cc.Node = null;
    @property(cc.Node)
    private NdContent: cc.Node = null;

    @property(cc.Node)
    private NdSelect: cc.Node = null;
    @property(cc.Node)
    private NdTriangle: cc.Node = null;
    @property(cc.Label)
    private LabSelect: cc.Label = null;

    @property(cc.Node)
    private NdComb: cc.Node = null;
    @property(cc.Node)
    private NdCombList: cc.Node[] = [];

    private _combIndex: number = 0;
    private _callback: (index: number) => void = null;
    private _context: any = null;

    public setData(combIndex: number, pos: cc.Vec2, callback: (index: number) => void, context: any): void {
        this._combIndex = combIndex;
        this._callback = callback;
        this._context = context;

        const pos1 = this.node.convertToNodeSpaceAR(pos);
        this.NdContent.setPosition(pos1);

        this.uptSelect();
        this.uptComb();
    }

    protected start(): void {
        UtilGame.Click(this.NdBg, this.uptSelect, this);

        UtilGame.Click(this.NdSelect, this.onSelect, this);

        // UtilGame.Click(this.NdComb, this.uptSelect, this, { scaleTarget: this.NdComb.getChildByName('NdContent') });

        for (let i = 0; i < this.NdCombList.length; i++) {
            UtilGame.Click(this.NdCombList[i], () => {
                this.onComb(i);
            }, this);
        }
    }

    /** 下拉 */
    private onSelect() {
        if (this.NdComb.active) {
            this.NdComb.active = false;
            this.NdBg.active = false;
            this.NdTriangle.setScale(1, 1, 1);
        } else {
            this.NdComb.active = true;
            this.NdBg.active = true;
            this.NdTriangle.setScale(1, -1, 1);
        }
    }

    /** 选择稀有度页签 */
    private onComb(index: number) {
        const list: GeneralMsg[] = ModelMgr.I.GeneralModel.getGeneralListByNewRarity(index);
        if (list.length === 0) {
            const str = i18n.tt(Lang.general_rarity_none) + i18n.tt(Lang[`general_rarity_${index}`]);
            MsgToastMgr.Show(str);
        } else {
            this._combIndex = index;
            this.uptSelect();
        }
        this.uptComb();
    }

    private uptSelect() {
        this.NdComb.active = false;
        this.NdBg.active = false;
        this.NdTriangle.setScale(1, 1, 1);
        this.LabSelect.string = i18n.tt(Lang[`general_rarity_${this._combIndex}`]);
        //
        this._callback.call(this._context, this._combIndex);
    }

    private uptComb() {
        for (let i = 0; i < this.NdCombList.length; i++) {
            if (this._combIndex !== i) {
                UtilCocos.LoadSpriteFrame(this.NdCombList[i].getComponent(cc.Sprite), RES_ENUM.Com_Btn_Com_Btn_Tips);
            } else {
                UtilCocos.LoadSpriteFrame(this.NdCombList[i].getComponent(cc.Sprite), RES_ENUM.Com_Btn_Com_Btn_B_03);
            }
        }
    }
}
