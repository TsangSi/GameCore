/*
 * @Author: hwx
 * @Date: 2022-06-14 20:12:25
 * @FilePath: \SanGuo\assets\script\game\com\tips\content\ItemTipsEquipContent.ts
 * @Description: 装备Tips
 */

import { EventClient } from '../../../../app/base/event/EventClient';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { E } from '../../../const/EventName';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import { BagMgr } from '../../../module/bag/BagMgr';
import { ChatShowItemType } from '../../../module/chat/ChatConst';
import { RoleMgr } from '../../../module/role/RoleMgr';
import { ShopItem } from '../../../module/shop/v/ShopItem';
import { ShareToChat } from '../../ShareToChat';
import { BaseItemTipsContent } from './BaseItemTipsContent';

const { ccclass, property } = cc._decorator;

@ccclass
export class ItemTipsEquipContent extends BaseItemTipsContent {
    @property(cc.ScrollView)
    private SvAttrs: cc.ScrollView = null;

    @property(cc.Sprite)
    private SprArrow: cc.Sprite = null;

    /** 属性可滚动高度 */
    private canScrollHeight = 1200;

    protected start(): void {
        this.changeSize();
        EventClient.I.on(E.Game.ItemTipChangeSize, this.changeSize, this);
    }

    protected onDestroy(): void {
        EventClient.I.off(E.Game.ItemTipChangeSize, this.changeSize, this);
    }

    private changeSize(): void {
        this.scheduleOnce(() => {
            // 更新滚动视图的大小
            // const svTrans = this.SvAttrs.getComponent(UITransform);3.4
            const svTrans = this.SvAttrs.node;
            // 动态大小，需要立即更新
            this.SvAttrs.content.getComponent(cc.Layout).updateLayout();
            // const contentTrans = this.SvAttrs.content.getComponent(UITransform);3.4
            const contentTrans = this.SvAttrs.content;

            if (contentTrans.height < this.canScrollHeight) {
                svTrans.height = contentTrans.height;
                this.SvAttrs.vertical = false;
                this.SprArrow.node.active = false;
            } else {
                svTrans.height = this.canScrollHeight;
                this.SvAttrs.vertical = true;
                this.SprArrow.node.active = true;
            }
        }, 0.1);
    }

    /**
     * 点击穿戴按钮
     */
    protected onClickUseButton(): void {
        // 人物基础等级 lv
        const userLevel: number = RoleMgr.I.d.Level;
        const armyLevel: number = RoleMgr.I.getArmyLevel();// 军衔等级
        const userStar: number = RoleMgr.I.getArmyStar(); // 星级

        // 装备等级  Cfg_Item_Equip  Level
        const equipLevel: number = this.itemModel.cfg.Level;
        // 装备军衔  Reborn   Star(星级)
        const equipRebornLv: number = this.itemModel.cfg.ArmyLevel;
        const equipStar: number = this.itemModel.cfg.Star;

        /** 角色已穿戴 */
        const roleEquipMap = BagMgr.I.getOnEquipMapWithEquipPart();
        const equipModel = roleEquipMap.get(this.itemModel.cfg.EquipPart);

        // 如果有军衔
        if (equipRebornLv) {
            if (armyLevel > equipRebornLv) { // 判断星级
                this._wearEquip();
            } else if (armyLevel === equipRebornLv && userStar >= equipStar) {
                this._wearEquip();
            } else {
                MsgToastMgr.Show(i18n.tt(Lang.build_army_not_enough));// '军衔等级不足'
            }
        } else if (userLevel >= equipLevel) { // 玩家等级大于装备等级
            this._wearEquip();
        } else {
            MsgToastMgr.Show(i18n.tt(Lang.tip_userLv_notenaugh));// '人物等级不足'
        }
    }

    private _wearEquip(): void {
        ControllerMgr.I.RoleController.reqC2SWearEquip([this.itemModel.data.OnlyId]);
        WinMgr.I.close(ViewConst.ItemTipsWin);
    }

    /**
     * 点击展示按钮
     */
    private onClickShowButton(target: cc.Event): void {
        // TODO: 显示频道菜单
        const nd = target.currentTarget as cc.Node;
        const pos = nd.convertToWorldSpaceAR(nd.position);
        ShareToChat.show(
            ChatShowItemType.default,
            this.itemModel.data.OnlyId,
            cc.v2(pos.x, pos.y + 100),
        );
        // ControllerMgr.I.ChatController.showItem(ChatShowItemType.default, this.itemModel.data.OnlyId);
    }
}
