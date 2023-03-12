/*
 * @Author: myl
 * @Date: 2022-10-11 20:21:18
 * @Description:
 */

import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { Config } from '../../base/config/Config';
import { UtilAttr } from '../../base/utils/UtilAttr';
import UtilItem from '../../base/utils/UtilItem';
import { ViewConst } from '../../const/ViewConst';
import ModelMgr from '../../manager/ModelMgr';
import NetMgr from '../../manager/NetMgr';
import { ChatShowItemType } from '../../module/chat/ChatConst';
import { ItemWhere } from '../item/ItemConst';

const { ccclass, property } = cc._decorator;

@ccclass('ItemTipsExController')
export class ItemTipsExController extends BaseController {
    /** 监听网络事件 子类实现 */
    public addNetEvent(): void {
        // 获取展示物品的详情
        EventProto.I.on(ProtoId.S2CGetShowInfo_ID, this.onS2CGetShowInfo, this);
    }

    /** 移除网络事件 子类实现 */
    public delNetEvent(): void {
        // 获取展示物品的详情
        EventProto.I.off(ProtoId.S2CGetShowInfo_ID, this.onS2CGetShowInfo, this);
    }

    /** 监听业务事件 子类实现 */
    public addClientEvent(): void {
        //
    }

    /** 移除网络事件 子类实现 */
    public delClientEvent(): void {
        //
    }

    /** 清理数据 */
    public clearAll(): void {
        //
    }
    /** 获取展示物品的信息
     * chatType 聊天频道类型
     * showid  展示id
    */
    private getShowItemInfo(chatType: number, showId: number): void {
        const d: C2SGetShowInfo = {
            ChatType: chatType,
            ShowId: showId,
        };
        console.log('点击展示物品提交参数', d);
        NetMgr.I.sendMessage(ProtoId.C2SGetShowInfo_ID, d);
    }

    private onS2CGetShowInfo(data: S2CGetShowInfo): void {
        console.log('返回的展示内容', data);
        // 展示物品
        if (data.ItemInfo) {
            const equipPos = data.EquipPos;
            const item = UtilItem.NewItemModel(data.ItemInfo);
            const strengthModel = ModelMgr.I.StrengthModel;
            const attrInfo = strengthModel.getStrengthLevelAttrInfo(item.cfg.EquipPart, equipPos?.StrengthLevel || 0);
            const [strengthFv, strengthAttrStr] = UtilAttr.GetTipsStrengthFvAttrStr(item.cfg.AttrId, attrInfo);
            const equipGemInfoArr = ModelMgr.I.GemModel.getEquipGemShowInfoArr(equipPos);
            WinMgr.I.open(ViewConst.ItemTipsWin, item, {
                where: ItemWhere.OTHER,
                strengthFv,
                strengthLv: equipPos?.StrengthLevel || 0,
                strengthAttrStr,
                equipGemFv: attrInfo.fightValue || 0,
                equipGemInfoArr,
            });
            return;
        }

        // 展示武将
        if (data.GeneralInfo) {
            return;
        }

        // 展示虎符官印
        if (data.OfficeInfo1) {
            WinMgr.I.open(ViewConst.SealAmuletTipWin, data.OfficeInfo1, false);
            return;
        }

        if (data.OfficeInfo2) {
            WinMgr.I.open(ViewConst.SealAmuletTipWin, data.OfficeInfo2, false);
            return;
        }
        // 展示称号
        if (data.Title) {
            WinMgr.I.open(ViewConst.TitleDetail, data.Title);
            return;
        }
        if (data.BeautyInfo) {
            console.log('红颜展示跳转');
            WinMgr.I.open(ViewConst.BeautyTipsView, data.BeautyInfo);
        }
    }

    /**
     * 打开界面
     * @param tab 页签id
     * @param params 配置表的参数列表
     * @param itemId 道具id
     * @returns
     */
    public linkOpen(tab?: number, params?: any[], ...itemIds: number[]): boolean {
        if (itemIds && itemIds[2]) {
            const type: number = itemIds[2];
            if (type === ChatShowItemType.team) {
                return ModelMgr.I.TeamModel.checkLinkJoinTeam(+itemIds[4], +itemIds[3]);
            } else if (type === ChatShowItemType.plot) {
                const cfgCollBook: Cfg_CollectionBook = Config.Get(Config.Type.Cfg_CollectionBook).getValueByKey(+itemIds[3]);
                ModelMgr.I.CollectionBookModel.showCollectionPicDetailsWin(cfgCollBook, true);
                return true;
            }
            return true;
        } else if (itemIds) {
            console.log(itemIds);
            this.getShowItemInfo(itemIds[1], itemIds[0]);
            return true;
        } else {
            return false;
        }
    }
}
