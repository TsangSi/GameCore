/*
 * @Author: hwx
 * @Date: 2022-06-17 14:18:18
 * @FilePath: \SanGuo\assets\script\game\com\tips\part\ItemTipsBaseInfoPart.ts
 * @Description: 道具Tips基本信息部件
 */
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { AttrModel } from '../../../base/attribute/AttrModel';
import { DynamicImage } from '../../../base/components/DynamicImage';
import { ConfigAttributeIndexer } from '../../../base/config/indexer/ConfigAttributeIndexer';
import { UtilColorFull } from '../../../base/utils/UtilColorFull';
import { UtilEquip } from '../../../base/utils/UtilEquip';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import { RES_ENUM } from '../../../const/ResPath';
import { ViewConst } from '../../../const/ViewConst';
import ModelMgr from '../../../manager/ModelMgr';
import { BagMgr } from '../../../module/bag/BagMgr';
import { GradeMgr } from '../../../module/grade/GradeMgr';
import { ItemQuality, ItemType } from '../../item/ItemConst';
import { ItemIcon } from '../../item/ItemIcon';
import { BaseItemTipsPart } from './BaseItemTipsPart';

const { ccclass, property } = cc._decorator;

@ccclass
export class ItemTipsBaseInfoPart extends BaseItemTipsPart {
    @property(DynamicImage)
    private SprQuality: DynamicImage = null;

    @property(ItemIcon)
    public NdIcon: ItemIcon = null;

    @property(cc.Label)
    public LabName: cc.Label = null;

    @property(cc.Label)
    public LabType: cc.Label = null;

    @property(cc.Label)
    public LabCount: cc.Label = null;

    @property(cc.Node)
    public NdEquipInfo: cc.Node = null;

    @property(cc.Label)
    public LabEquipPos: cc.Label = null;

    @property(cc.Label)
    public LabWearLevel: cc.Label = null;

    @property(cc.Sprite)
    public SprWearFlag: cc.Sprite = null;

    @property(cc.Node)
    public NdFightInfo: cc.Node = null;

    @property(cc.Label)
    public LabFightTitle: cc.Label = null;

    @property(cc.Label)
    public LabFightValue: cc.Label = null;

    @property(cc.Sprite)
    public SprFightValueDetailButton: cc.Sprite = null;

    protected refresh(): void {
        // 道具品阶图标
        this.SprQuality.loadImage(`${RES_ENUM.Com_Bg_Com_Bg_Tips}${this.itemModel.cfg.Quality}`, 1, true);

        // 设置图标
        this.NdIcon.setData(this.itemModel, { where: this.opts?.where, needNum: false });

        // 道具名称
        const itemName = UtilItem.GetEquipName(this.itemModel);
        UtilItem.ItemNameScrollSet(this.itemModel, this.LabName, itemName, true);

        const isWearing = this.itemModel.data.Pos === 2; // 穿戴中

        // 装备属性战力值
        let fightValue = this.itemModel.fightValue || BagMgr.I.getItemFightValue(this.itemModel, true);
        // 装备部位
        const equipPart = this.itemModel.cfg.EquipPart;
        if (equipPart > 0) {
            // 隐藏普通道具信息
            this.LabType.node.parent.active = false;
            this.LabCount.node.parent.active = false;

            // 装备部位
            this.LabEquipPos.string = UtilItem.GetEquipPartName(equipPart, this.itemModel.cfg.SubType);// UtilItem.GetRoleEquipPartName(equipPart);
            this.NdEquipInfo.active = true;

            // 装备穿戴等级
            const level = this.itemModel.cfg.Level;
            let lvDesc: string = '';
            if (level > 0) {
                lvDesc = GradeMgr.I.getEquipLevelDesc(this.itemModel.cfg.SubType, level);
                this.LabWearLevel.string = lvDesc;
                this.NdEquipInfo.active = true;
            } else {
                this.NdEquipInfo.active = false;
            }

            // 显示已穿戴标识
            this.SprWearFlag.node.active = isWearing;
        } else {
            // 隐藏装备信息
            this.NdEquipInfo.active = false;
            this.NdFightInfo.active = false;

            // 道具类型
            this.LabType.string = UtilItem.GetItemTypeName(this.itemModel.cfg.SubType);
            this.LabType.node.parent.active = true;

            // 道具数量
            if (this.itemModel.data.ItemNum > 0) {
                this.LabCount.string = this.itemModel.data.ItemNum.toString();
                this.LabCount.node.parent.active = true;
            } else {
                this.LabCount.node.parent.active = false;
            }
        }

        if (this.opts?.strengthFv) {
            fightValue += this.opts.strengthFv || 0;
        }
        if (this.opts?.goldFv) {
            fightValue += this.opts.goldFv || 0;
        }
        if (this.opts?.equipGemFv) {
            fightValue += this.opts?.equipGemFv || 0;
        }

        if (fightValue && fightValue > 0) {
            this.LabFightValue.string = fightValue.toString();
            this.NdFightInfo.active = true;

            if (isWearing) { // 穿戴中的道具
                this.LabFightTitle.string = i18n.tt(Lang.item_tips_all_fightvalue_title);
            } else if (equipPart > 0) { // 未穿戴中的装备
                this.LabFightTitle.string = i18n.tt(Lang.item_tips_base_fightvalue_title);
            } else { // 未穿戴中的道具
                this.LabFightTitle.string = i18n.tt(Lang.com_txt_fv);
            }
            this.SprFightValueDetailButton.node.active = isWearing; // 显示总战力详情按钮
            if (isWearing) {
                UtilGame.Click(this.SprFightValueDetailButton.node, this.onClickFightValueDetailButton, this);
            }
        } else {
            fightValue = BagMgr.I.getItemFightValue(this.itemModel, true);
            this.LabFightValue.string = fightValue.toString();
            this.NdFightInfo.active = fightValue > 0;
        }
    }

    private onClickFightValueDetailButton(): void {
        // 基础、附加值详情
        let attrFvStr = UtilItem.GetFightValueDetailStr(this.itemModel);
        // 强化详情
        if (this.opts?.strengthFv) {
            attrFvStr += `${i18n.tt(Lang.item_tips_attr_detail_strength)}     ${this.opts?.strengthFv || 0}\n`;
        }
        if (this.opts?.goldFv) {
            attrFvStr += `${i18n.tt(Lang.item_tips_attr_detail_gold)}     ${this.opts?.goldFv || 0}\n`;
        }
        if (this.opts?.equipGemFv) {
            attrFvStr += `${i18n.tt(Lang.item_tips_attr_gem)}     ${this.opts?.equipGemFv || 0}\n`;
        }

        // const transform = this.SprFightValueDetailButton.node.getComponent(UITransform);3.4
        // const worldPos = transform.convertToWorldSpaceAR(v3(-80, -10, 0));
        const worldPos = this.SprFightValueDetailButton.node.convertToWorldSpaceAR(cc.v2(-80, -10));

        WinMgr.I.open(ViewConst.FightValueDetailWin, attrFvStr, worldPos);
    }

    // /** 获取装备战力 */
    // private getEquipFightValue(): number {
    //     let fightvalue: number = 0;
    //     const attrId: number = UtilEquip.GetEquipAttrId(this.itemModel.cfg.SubType, this.itemModel.cfg.EquipPart, this.itemModel.data.OnlyId);
    //     if (attrId) {
    //         fightvalue += ConfigAttributeIndexer.I.getFightValueById(attrId);
    //     }
    //     const strngth = UtilEquip.GetEquipItemStrength(this.itemModel);
    //     if (strngth) {
    //         fightvalue += strngth.fv;
    //     }
    //     return fightvalue;
    // }
}
