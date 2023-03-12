/*
 * @Author: wx
 * @Date: 2022-07-11 11:32:20
 * @FilePath: \SanGuo-2.4-main\assets\script\game\module\gradeGift\v\GradeGiftItem.ts
 * @Description: 进阶豪礼
 */

import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { ItemIcon } from '../../../com/item/ItemIcon';
import ItemModel from '../../../com/item/ItemModel';
import { RES_ENUM } from '../../../const/ResPath';
import ControllerMgr from '../../../manager/ControllerMgr';
import { GradeGiftController } from '../GradeGiftController';

const { ccclass, property } = cc._decorator;

export enum EGiftGetStatus {
    /** 未达成 */
    unGet = 0,
    /** 可领取 */
    get = 1,
    /** 已领取 */
    got = 2,
}

@ccclass
export class GradeGiftItem extends cc.Component {
    @property(cc.Label)
    protected LbTitle: cc.Label = null;
    @property(cc.ScrollView)
    protected listView: cc.ScrollView = null;
    @property(cc.Node)
    protected btnClick: cc.Node = null;

    public ItemModelData: ItemModel[] = null;
    // 领取按钮状态值：0 未达成 1领取 2已领取
    private btnStatus: string[] = [i18n.tt(Lang.com_unreach), i18n.tt(Lang.com_receive), i18n.tt(Lang.com_received)];
    private btnImg: string[] = [
        RES_ENUM.Com_Btn_Com_Btn_Weidacheng,
        RES_ENUM.Com_Btn_Com_Btn_C01,
        RES_ENUM.Com_Btn_Com_Btn_Yilingqu];
    private btnColor: string[] = ['#fff5e4', '#723223', '#fff5e4'];
    private btnSize = [cc.v2(108, 38), cc.v2(134, 49), cc.v2(108, 38)];
    /**
     * 设置基本信息
     * @param title 标题
     * @param stats 领取状态 0 未领取  1 待领取 2 已领取
     */
    public setItemData(title: string, status: EGiftGetStatus, itemInfo: ItemModel[], gradeId: number, bigLv: number): void {
        this.LbTitle.string = title;
        UtilCocos.LoadSpriteFrame(this.btnClick.getComponent(cc.Sprite), this.btnImg[status]);
        this.btnClick.getComponentInChildren(cc.Label).string = this.btnStatus[status];
        this.btnClick.getComponentInChildren(cc.Label).node.color = UtilColor.Hex2Rgba(this.btnColor[status]);
        this.btnClick.width = this.btnSize[status].x;
        this.btnClick.height = this.btnSize[status].y;
        // 读取gradid和bigLv
        const GradeId = gradeId;
        if (status === EGiftGetStatus.get) {
            this.setItemClick(this.btnClick, GradeId, bigLv);
            // UtilRedDot.New(this.btnClick, v3(45, 10));
        } else {
            this.btnClick.targetOff(this);
            // UtilRedDot.Delete(this.btnClick);
        }
        UtilRedDot.UpdateRed(this.btnClick, status === EGiftGetStatus.get, cc.v2(50, 13));
        this.setItemIconList(itemInfo);
    }

    public setItemIconList(itemInfo: ItemModel[]): void {
        this.ItemModelData = itemInfo;
        // const listChild = this.listView.content.children;
        this.listView.content.removeAllChildren();
        this.listView.content.destroyAllChildren();
        // console.log(itemInfo);
        // if (listChild.length > itemInfo.length) {
        //     for (let i = 0; i < listChild.length; i++) {
        //         if (i < itemInfo.length) {
        //             listChild[i].active = true;
        //             listChild[i].getComponent(ItemIcon).setData(itemInfo[i]);
        //         } else {
        //             listChild[i].active = false;
        //             // listChild[i].destroy(); //多出来的不销毁了，用active吧
        //         }
        //     }
        // } else {
        //     for (let i = listChild.length; i < itemInfo.length; i++) {
        //         const item = cc.instantiate(this.node.getChildByName('ItemIcon'));
        //         item.active = true;
        //         item.getComponent(ItemIcon).setData(itemInfo[i], { needNum: true });
        //         this.listView.content.addChild(item);
        //     }
        // }

        for (let i = 0; i < itemInfo.length; i++) {
            const item = cc.instantiate(this.node.getChildByName('ItemIcon'));
            item.active = true;
            item.getComponent(ItemIcon).setData(itemInfo[i], { needNum: true });
            this.listView.content.addChild(item);
        }
        // 当配置数量小于4时，屏蔽掉物品栏滑动操作
        if (itemInfo.length < 4) {
            this.listView.enabled = false;
        } else {
            this.listView.enabled = true;
        }
    }

    private setItemClick(item: cc.Node, GradeId: number, bigLv: number): void {
        UtilGame.Click(item, () => {
            ControllerMgr.I.GradeController.reqC2SGradeGetUpGift(GradeId, bigLv);
        }, this);
    }
}
