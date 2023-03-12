/*
 * @Author: zs
 * @Date: 2022-10-31 14:20:18
 * @FilePath: \SanGuo\assets\script\game\module\beauty\com\BeautyStar.ts
 * @Description:
 *
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilString } from '../../../../app/base/utils/UtilString';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { IAttrBase } from '../../../base/attribute/AttrConst';
import ListView from '../../../base/components/listview/ListView';
import { UtilColorFull } from '../../../base/utils/UtilColorFull';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { NdAttrBase } from '../../../com/attr/NdAttrBase';
import { ItemQuality } from '../../../com/item/ItemConst';
import { E } from '../../../const/EventName';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { BagMgr } from '../../bag/BagMgr';

const { ccclass, property } = cc._decorator;
@ccclass()
export class AdviserStar extends BaseCmp {
    @property(ListView)
    private ListView: ListView = null;
    @property(cc.Node)
    private NodeCurAttr: cc.Node = null;
    @property(cc.Node)
    private NodeNextAttr: cc.Node = null;
    @property(cc.Node)
    private NodeItem: cc.Node = null;
    @property(cc.Label)
    private LabelItemName: cc.Label = null;
    @property(cc.Label)
    private LabelCostNum: cc.Label = null;
    @property(cc.Node)
    private NodeBtnUp: cc.Node = null;
    @property(cc.Node)
    private NodeFull: cc.Node = null;
    @property(cc.Node)
    private NodeItemBtn: cc.Node = null;

    /** 升星需要的数量 */
    private needNum: number = 0;
    protected onLoad(): void {
        UtilGame.Click(this.NodeBtnUp, this.onBtnUpClicked, this);
        EventClient.I.on(E.Beauty.UpdateStar, this.onUpdateStar, this);
    }

    /** 红颜id */
    private id: number;
    /** 道具id */
    private itemId: number = 0;
    // private beauty: BeautyInfo = null;
    public setData(id: number): void {
        // this.id = id;
        // this.beauty = ModelMgr.I.BeautyModel.getBeauty(id);
        // this.saveItemId();
        // this.onUpdateStar();
        // this.onItemChange();
    }

    /**
     * 保存道具物品id，监听道具变化
     */
    private saveItemId() {
        // const itemId: number = this.beauty.cfg.getValueByKey(this.id, 'StarUpItem');
        // if (itemId && this.itemId !== itemId) {
        //     if (this.itemId) {
        //         EventClient.I.off(`${E.Bag.ItemChangeOfId}${this.itemId}`, this.onItemChange, this);
        //     }
        //     if (!this.beauty.isFullStar()) {
        //         EventClient.I.on(`${E.Bag.ItemChangeOfId}${itemId}`, this.onItemChange, this);
        //     }
        //     this.itemId = itemId;
        //     const item = UtilItem.NewItemModel(itemId);
        //     UtilItem.Show(this.NodeItem, item, { option: { needName: false } });
        //     UtilItem.ItemNameScrollSet(item, this.LabelItemName, item.cfg.Name, false);
        // }
    }
    /** 道具变化 */
    private onItemChange() {
        // if (!this.beauty.isFullStar()) {
        //     this.needNum = this.beauty.cfg.getValueByKeyFromStar(this.id, this.beauty.Star + 1, 'NeedItemCount');
        //     const hasNum = BagMgr.I.getItemNum(this.itemId);
        //     this.LabelCostNum.string = `${hasNum}/${this.needNum}`;
        //     const isCanUpStar = hasNum >= this.needNum;
        //     this.LabelCostNum.node.color = isCanUpStar ? UtilColor.ColorEnoughV : UtilColor.Red();
        //     UtilRedDot.UpdateRed(this.NodeBtnUp, isCanUpStar, cc.v2(65, 15));
        // } else {
        //     UtilRedDot.UpdateRed(this.NodeBtnUp, false, cc.v2(65, 15));
        // }
    }

    /**
     * 更新属性
     * @param node 节点
     * @param star 星级
     * @param attrs 属性列表
     */
    private updateAttr(node: cc.Node, star: number, attrs: IAttrBase[]) {
        UtilCocos.SetString(node, 'NdStar/Label', star);
        const content = node.getChildByName('NdAttr');
        for (let i = 0, n = Math.max(attrs.length, content.childrenCount); i < n; i++) {
            if (attrs[i]) {
                const child = content.children[i] || cc.instantiate(content.children[0]);
                const s = child.getComponent(NdAttrBase);
                s.setAttr(attrs[i], { s: ' ' });
                child.active = true;
                if (!content.children[i]) {
                    content.addChild(child);
                }
            } else if (i !== 0) {
                content.children[i].destroy();
            } else {
                content.children[i].active = false;
            }
        }
        const skill: string = ModelMgr.I.BeautyModel.cfg.getValueByKeyFromStar(this.id, star, 'SkillId');
        if (skill) {
            UtilCocos.SetString(node, 'AttrDesc', UtilString.FormatArgs(i18n.tt(Lang.beauty_main_skill_level_desc), skill.split(':')[1]));
        } else {
            UtilCocos.SetString(node, 'AttrDesc', '');
        }
    }

    /** 星级变化 */
    private onUpdateStar() {
        // if (!this.beauty.isFullStar()) {
        //     // 下一星级属性
        //     this.updateAttr(this.NodeNextAttr, this.beauty.Star + 1, this.beauty.nextStarAttrInfo.attrs);
        //     this.NodeNextAttr.active = true;
        //     this.NodeFull.active = false;
        //     this.NodeItemBtn.active = true;
        // } else {
        //     this.NodeNextAttr.active = false;
        //     this.NodeFull.active = true;
        //     this.NodeItemBtn.active = false;
        // }
        // // 当前星级属性
        // if (!this.beauty.starAttrInfo?.attrs?.length) {
        //     // 当前星级没有属性
        //     const attrs: IAttrBase[] = [];
        //     for (let i = 0, n = this.beauty.nextStarAttrInfo.attrs.length; i < n; i++) {
        //         const attr = this.beauty.nextStarAttrInfo.attrs[i];
        //         attrs.push({
        //             attrType: attr.attrType,
        //             value: 0,
        //             name: attr.name,
        //             key: attr.key,
        //         });
        //     }
        //     this.updateAttr(this.NodeCurAttr, this.beauty.Star, attrs);
        // } else {
        //     this.updateAttr(this.NodeCurAttr, this.beauty.Star, this.beauty.starAttrInfo.attrs);
        // }
        // this.onItemChange();
    }

    private onBtnUpClicked() {
        if (BagMgr.I.getItemNum(this.itemId) >= this.needNum) {
            ControllerMgr.I.BeautyController.C2SBeautyStarUp(this.id);
        } else {
            this.onItemChange();
            EventClient.I.emit(E.Beauty.UpdateHead, this.id);
            WinMgr.I.open(ViewConst.ItemSourceWin, this.itemId);
            ModelMgr.I.BeautyModel.onCheckUpStar();
        }
    }

    protected onDestroy(): void {
        EventClient.I.off(`${E.Bag.ItemChangeOfId}${this.itemId}`, this.onItemChange, this);
        EventClient.I.off(E.Beauty.UpdateStar, this.onUpdateStar, this);
    }
}
