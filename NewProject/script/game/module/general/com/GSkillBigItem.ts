/* eslint-disable max-len */
/*
 * @Author: kexd
 * @Date: 2022-11-21 17:57:43
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\com\GSkillBigItem.ts
 * @Description:
 *
 */

import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { i18n, Lang } from '../../../../i18n/i18n';
import { UtilGame } from '../../../base/utils/UtilGame';
import { ItemIcon } from '../../../com/item/ItemIcon';
import ItemModel from '../../../com/item/ItemModel';
import { RES_ENUM } from '../../../const/ResPath';
import { BagMgr } from '../../bag/BagMgr';

const { ccclass, property } = cc._decorator;
@ccclass
export default class GSkillBigItem extends BaseCmp {
    @property(ItemIcon)
    private ItemIcon: ItemIcon = null;
    @property(cc.Sprite)
    private SprBg: cc.Sprite = null;
    @property(cc.Node)
    private NdClick: cc.Node = null;
    @property(cc.Node)
    private NdSelect: cc.Node = null;
    @property(cc.Label)
    private LabName: cc.Label = null;
    @property(cc.Label)
    private LabNum: cc.Label = null;
    @property(cc.Node)
    private NdFlag: cc.Node = null;

    private _itemId: number = 0;
    private _skillId: number = 0;
    private _isLearned: boolean = false;
    private _callback: (itemId: number, skillId: number) => void = null;
    private _context: any;

    protected start(): void {
        super.start();

        UtilGame.Click(this.NdClick, () => {
            if (this._callback) {
                this._callback.call(this._context, this._itemId, this._skillId);
            }
        }, this);
    }

    /**
     * 展示
     * @param itemId 道具id
     * @param exp 经验
     * @param isSelected 选中状态
     * @param callback 回调
     */
    public setData(item: ItemModel, isLearned: boolean, isSelected: boolean, callback: (itemId: number, skillId: number) => void = null, context: any = null): void {
        this._itemId = item.cfg.Id;
        this._skillId = item.cfg.Param;
        this._isLearned = isLearned;
        this._callback = callback;
        this._context = context;

        this.ItemIcon.setData(item, { needNum: true, needName: false });
        this.NdSelect.active = !!isSelected;
        UtilCocos.LoadSpriteFrame(this.SprBg, isSelected ? RES_ENUM.Com_Img_Com_Img_Htd_02 : RES_ENUM.Com_Img_Com_Img_Htd);
        this.LabName.string = item.cfg.Name;
        UtilCocos.setLableQualityColor(this.LabName, item.cfg.Quality);

        const have: number = BagMgr.I.getItemNum(item.data.ItemId);
        this.LabNum.string = `${i18n.tt(Lang.general_skill_have)}${have}`;

        this.NdFlag.active = isLearned;
    }

    /**
     * 选中状态
     */
    public setSelected(isSelected: boolean): void {
        this.NdSelect.active = !!isSelected;
    }
}
