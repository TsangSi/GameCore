/*
 * @Author: zs
 * @Date: 2022-07-15 15:46:31
 * @FilePath: \SanGuo2.4\assets\script\game\module\roleskin\v\com\RoleSkinSuitItem.ts
 * @Description:
 *
 */

import { EventClient } from '../../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import { UtilString } from '../../../../../app/base/utils/UtilString';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { Config } from '../../../../base/config/Config';
import { ConfigConst } from '../../../../base/config/ConfigConst';
import { ConfigIndexer } from '../../../../base/config/indexer/ConfigIndexer';
import { ConfigRoleSkinIndexer } from '../../../../base/config/indexer/ConfigRoleSkinIndexer';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItem from '../../../../base/utils/UtilItem';
import UtilRedDot from '../../../../base/utils/UtilRedDot';
import { ItemIcon } from '../../../../com/item/ItemIcon';
import { E } from '../../../../const/EventName';
import { ViewConst } from '../../../../const/ViewConst';
import ModelMgr from '../../../../manager/ModelMgr';
import { BagItemChangeInfo } from '../../../bag/BagConst';
import { RoleMgr } from '../../../role/RoleMgr';
import { ERoleSkinPageIndex, SUIT_PART_COUNT } from '../RoleSkinConst';

const { ccclass } = cc._decorator;

@ccclass
export class RoleSkinSuitItem extends cc.Component {
    /** 角色时装配置表索引器 */
    private roleskinIndexer: ConfigRoleSkinIndexer;
    /** 角色时装配置表索引器 */
    private gradeskinIndexer: ConfigIndexer;
    private NodeItem: { [skinId: number]: cc.Node } = cc.js.createMap(true);
    private suitId: number;

    protected start(): void {
        EventClient.I.on(E.RoleSkin.NewAddSkin, this.updateUi, this);
        EventClient.I.on(E.RoleSkin.SkinUpStar, this.updateUi, this);
        EventClient.I.on(E.Bag.ItemChange, this.itemChange, this);
    }

    private itemChange(items: BagItemChangeInfo[]) {
        const itemids = [];
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            itemids.push(item.itemModel.cfg.Id);
        }
        const indexer = Config.Get(ConfigConst.Cfg_SkinSuit);
        const suitCfg: Cfg_SkinSuit = indexer.getValueByKey(this.suitId);
        const partIds = UtilString.StringToNumberArray(suitCfg.SkinRequire);
        for (let j = 0; j < partIds.length; j++) {
            const partId = partIds[j];
            const skinIndexer = Config.Get(ConfigConst.Cfg_RoleSkin);
            const skinCfg: Cfg_RoleSkin = skinIndexer.getValueByKey(partId);
            if (skinCfg) {
                const needItemId = skinCfg.NeedItem;
                if (itemids.indexOf(needItemId) > -1) {
                    this.updateUi();
                    return;
                }
            }
        }
    }

    private updateUi() {
        this.setData(this.suitId);
    }
    protected onDestroy(): void {
        EventClient.I.off(E.RoleSkin.NewAddSkin, this.updateUi, this);
        EventClient.I.off(E.RoleSkin.SkinUpStar, this.updateUi, this);
        EventClient.I.off(E.Bag.ItemChange, this.itemChange, this);
    }
    /** 活动套装的激活状态 */
    private activitySuitActive: boolean = true;
    public setData(suitId: number): void {
        this.roleskinIndexer = Config.Get(Config.Type.Cfg_RoleSkin);
        this.gradeskinIndexer = Config.Get(Config.Type.Cfg_GradeSkin);
        this.suitId = suitId;
        // const skin: string = this.roleskinIndexer.getSkinSuitValueByKey(suitId, 'SkinRequire');
        const suitCfg: Cfg_SkinSuit = this.roleskinIndexer.getSkinSuitValueByKey(suitId);
        const skin: string = suitCfg.SkinRequire;
        const skins = skin.split('|');
        let skinId = 0;
        this.activitySuitActive = ModelMgr.I.RoleSkinModel.getSuitActiveByNum(this.suitId, SUIT_PART_COUNT);
        for (let i = 0, n = skins.length; i < n; i++) {
            const node = this.node.children[i] || cc.instantiate(this.node.children[0]);
            if (!this.node.children[i]) {
                this.node.addChild(node);
            }
            skinId = +skins[i];
            this.NodeItem[skinId] = node;
            this.renderItem(node, skinId, i, suitCfg.Type === ERoleSkinPageIndex.ActitySuit || suitCfg.Type === ERoleSkinPageIndex.SpecialSuit);
        }
    }

    private type: ERoleSkinPageIndex = ERoleSkinPageIndex.Skin;
    public setType(tp: ERoleSkinPageIndex): void {
        this.type = tp;
    }

    public updateItem(skinId: number, index: number = 0): void {
        const node = this.NodeItem[skinId];
        if (node && node.isValid) {
            // 根据时装获取到套装信息
            const suitId = this.roleskinIndexer.getSuitIdBySkinId(skinId);
            const suitCfg: Cfg_SkinSuit = this.roleskinIndexer.getSkinSuitValueByKey(suitId);
            this.renderItem(node, skinId, index, suitCfg.Type === ERoleSkinPageIndex.ActitySuit || suitCfg.Type === ERoleSkinPageIndex.SpecialSuit);
        }
    }

    /**
     * 套装时装部位从时装表读数据， 坐骑，光武，羽翼从进阶表中读取 （活动套装/荣誉套装直接从时装表读数据）
     * @param node
     * @param skinId
     * @param index
     * @param isActivity
     */
    private renderItem(node: cc.Node, skinId: number, index: number, isActivity: boolean = false) {
        let itemId: number = 0;
        if (!index || isActivity) {
            itemId = this.roleskinIndexer.getValueByKey(skinId, 'NeedItem');
        } else {
            itemId = this.gradeskinIndexer.getValueByKey(skinId, 'NeedItem');
        }
        const star = ModelMgr.I.RoleSkinModel.getSkinStar(skinId, index, isActivity ? ERoleSkinPageIndex.SpecialSuit : 1);
        /** 单个时装的激活 */
        const isActive = !!star;
        const itemIcon: ItemIcon = node.getChildByName('ItemIcon')?.getComponent(ItemIcon);
        if (itemIcon) {
            itemIcon.setData(UtilItem.NewItemModel(itemId), { offClick: true, sex: RoleMgr.I.d.Sex });
            node.getChildByName('NdSuo').active = !(isActive || this.activitySuitActive);

            // itemIcon.setGray(!(isActive || this.activitySuitActive), 2);
        }
        if (star) {
            UtilCocos.SetString(node, 'LabelStar', `${star}`) as cc.Label;
        }
        UtilCocos.SetActive(node, 'LabelStar', isActive);
        UtilCocos.SetActive(node, 'NodeStar', isActive);
        if (!isActive && !this.activitySuitActive) {
            const activeDesc: string = Config.Get(Config.Type.Cfg_SkinSuit).getValueByKey(this.suitId, 'ActiveDesc1');
            const activeNode = UtilCocos.SetActive(node, 'ActiveDesc', activeDesc !== '' && activeDesc !== undefined);
            UtilCocos.SetString(activeNode, 'DescLabel', `${activeDesc}`);
            activeNode.active = !(isActive || this.activitySuitActive);
        } else {
            node.getChildByName('ActiveDesc').active = false;
        }
        const NdMask = itemIcon.node.getChildByName('NdMask');
        if (NdMask) {
            NdMask.active = star === 0;
        }
        node.targetOff(this);
        UtilGame.Click(node, () => {
            WinMgr.I.open(ViewConst.RoleSuitPartWin, skinId, index, this.suitId, this.type);
        }, this);
        if (isActivity) {
            const red = ModelMgr.I.RoleSpecialSuitModel.sepicalSuitPartRedDot(skinId, index);
            UtilRedDot.UpdateRed(node, red, cc.v2(45, 45));
        } else {
            UtilRedDot.UpdateRed(node, false, cc.v2(45, 45));
        }
    }
}
