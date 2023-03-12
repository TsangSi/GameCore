/*
 * @Author: hwx
 * @Date: 2022-07-20 14:26:49
 * @FilePath: \SanGuo\assets\script\game\module\grade\v\GradeSkinItem.ts
 * @Description: 进阶皮肤项
 */
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { ItemIcon } from '../../../com/item/ItemIcon';
import ItemModel from '../../../com/item/ItemModel';
import { BagMgr } from '../../bag/BagMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export class GradeSkinItem extends BaseCmp {
    @property(ItemIcon)
    private NdIcon: ItemIcon = null;
    @property(cc.Node)
    private NdMask: cc.Node = null;
    @property(cc.Node)
    private NdStar: cc.Node = null;

    @property(cc.Label)
    private LabStar: cc.Label = null;

    @property(cc.Sprite)
    private SprSelect: cc.Sprite = null;

    /** 是否选中 */
    private isSelected: boolean = false;

    /** 下标 */
    private _idx: number = 0;

    private _onSelected: (comp: GradeSkinItem, idx: number) => void;

    public canUp: boolean = false;

    public init(...param: unknown[]): void {
        this._idx = param[0] as number;
        const itemId = param[1] as number;
        const star = param[2] as number || 0;
        const levelUpItemNum = param[3] as number || 0;

        const ownNum = BagMgr.I.getItemNum(itemId);
        const itemModel = UtilItem.NewItemModel(itemId, ownNum);
        this.NdIcon.setData(itemModel, { hideLeftLogo: true, hideRightLogo: false });
        this.NdMask.active = star === 0;
        this.NdStar.active = star > 0;
        this.LabStar.string = `${star}`;

        this.canUp = ownNum >= levelUpItemNum;
        UtilRedDot.UpdateRed(this.node, this.canUp, cc.v2(35, 35));
    }

    public select(): void {
        this.isSelected = true;
        this.SprSelect.node.active = true;
        this.node.targetOff(this);

        if (this._onSelected) {
            this._onSelected(this, this._idx);
        }
    }

    public unselect(): void {
        this.isSelected = false;
        this.SprSelect.node.active = false;

        UtilGame.Click(this.node, () => {
            if (!this.isSelected) this.select();
        }, this);
    }

    /**
     * 监听回调
     * @param cb
     * @param target
     */
    public onSelected(cb: (comp: GradeSkinItem, idx: number) => void, target: unknown): void {
        this._onSelected = cb.bind(target);
    }

    public getIconData(): ItemModel {
        return this.NdIcon.getData();
    }
}
