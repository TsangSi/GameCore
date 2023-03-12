/*
 * @Author: hwx
 * @Date: 2022-06-17 14:18:35
 * @FilePath: \SanGuo-2.4-main\assets\script\game\com\tips\part\ItemTipsButtonsPart.ts
 * @Description: 道具Tips按钮部件
 */
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { ItemType, ItemWhere } from '../../item/ItemConst';
import { BaseItemTipsPart } from './BaseItemTipsPart';

const { ccclass, property } = cc._decorator;

@ccclass
export class ItemTipsButtonsPart extends BaseItemTipsPart {
    @property(cc.Button)
    private BtnUse: cc.Button = null;

    @property(cc.Button)
    private BtnWear: cc.Button = null;

    @property(cc.Button)
    private BtnShow: cc.Button = null;

    /**
     * 刷新
     */
    public refresh(): void {
        // 隐藏所有按钮
        this.setUseButtonActive(false);
        this.setWearButtonActive(false);
        this.setShowButtonActive(false);

        // 解析按钮数量
        const clientFunc = this.itemModel.cfg.ClientFunc;
        if (clientFunc) {
            const btnIds = clientFunc.split('|');
            if (this.opts?.where === ItemWhere.BAG) {
                // 使用按钮
                this.setUseButtonActive(btnIds.includes('1'));
                // 穿戴按钮
                this.setWearButtonActive(btnIds.includes('2'));
                // 展示按钮
                this.setShowButtonActive(btnIds.includes('3'));
            } else if (this.opts?.where === ItemWhere.ROLE_EQUIP && this.itemModel.cfg.SubType === ItemType.EQUIP_ROLE) {
                // 角色装备界面仅显示，展示按钮
                this.setShowButtonActive(btnIds.includes('3'));
            }
        }

        this.node.active = this.hasButtonActive();
    }

    private setUseButtonActive(active: boolean): void {
        if (this.BtnUse) this.BtnUse.node.active = active;
        if (active && this.itemModel.cfg.OneKeyUse) {
            // UtilRedDot.New(this.BtnUse.node, v3(55, 23, 0));
            UtilRedDot.UpdateRed(this.BtnUse.node, true, cc.v2(65, 20));
        }
    }

    private setWearButtonActive(active: boolean): void {
        if (this.BtnWear) this.BtnWear.node.active = active;
    }

    private setShowButtonActive(active: boolean): void {
        if (this.BtnShow) this.BtnShow.node.active = active;
    }

    private hasButtonActive(): boolean {
        let has = false;
        if (!has && this.BtnUse) has = this.BtnUse.node.active;
        if (!has && this.BtnWear) has = this.BtnWear.node.active;
        if (!has && this.BtnShow) has = this.BtnShow.node.active;
        return has;
    }
}
