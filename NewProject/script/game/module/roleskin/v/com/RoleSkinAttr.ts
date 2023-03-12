import { EventClient } from '../../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../../app/base/utils/UtilNum';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { IAttrBase } from '../../../../base/attribute/AttrConst';
import Progress from '../../../../base/components/Progress';
import { Config } from '../../../../base/config/Config';
import { ConfigIndexer } from '../../../../base/config/indexer/ConfigIndexer';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItem from '../../../../base/utils/UtilItem';
import UtilRedDot from '../../../../base/utils/UtilRedDot';
import { NdAttrBase } from '../../../../com/attr/NdAttrBase';
import { NdAttrBaseAddition } from '../../../../com/attr/NdAttrBaseAddition';
import { ItemIcon } from '../../../../com/item/ItemIcon';
import ItemModel from '../../../../com/item/ItemModel';
import { E } from '../../../../const/EventName';
import { ViewConst } from '../../../../const/ViewConst';
import ControllerMgr from '../../../../manager/ControllerMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import { BagMgr } from '../../../bag/BagMgr';
import { ICfgRoleSkin } from '../RoleSkinConst';

/*
 * @Author: zs
 * @Date: 2022-07-15 15:46:31
 * @FilePath: \SanGuo\assets\script\game\module\roleskin\v\com\RoleSkinAttr.ts
 * @Description:
 *
 */
const { ccclass, property } = cc._decorator;
@ccclass
export class RoleSkinAttr extends cc.Component {
    @property(cc.Node)
    private NodeAttrs: cc.Node = null;
    @property(cc.Label)
    private LabelAdd: cc.Label = null;
    @property(ItemIcon)
    private SItemIcon: ItemIcon = null;
    @property(cc.Node)
    private NdMask: cc.Node = null;
    @property(cc.Label)
    private LabelNum: cc.Label = null;
    @property(cc.Label)
    private LabelNeedNum: cc.Label = null;
    @property(cc.Node)
    private BtnUpStar: cc.Node = null;
    @property(cc.Node)
    private NodeFull: cc.Node = null;
    /** 最多显示三条属性 */
    private showAttrMaxCount = 3;
    private cfgRoleSkinStar: ConfigIndexer;
    private itemId: number = 0;
    private needCount: number = 0;
    protected onLoad(): void {
        EventClient.I.on(E.Bag.ItemChange, this.onItemChange, this);
    }

    public setData(data: ICfgRoleSkin, addStr: string = ''): void {
        if (!this.cfgRoleSkinStar) {
            this.cfgRoleSkinStar = Config.Get(Config.Type.Cfg_RoleSkinStar);
        }
        const star = ModelMgr.I.RoleSkinModel.getSkinStar(data.Id);
        const index = this.cfgRoleSkinStar.getIntervalIndex(star);
        const cfgStar: Cfg_RoleSkinStar = this.cfgRoleSkinStar.getValueByIndex(index);
        const itemId = data.NeedItem;
        this.itemId = itemId;
        this.needCount = cfgStar.LevelUpItem;
        /** 额外加成描述 */
        this.LabelAdd.string = addStr || '';
        const maxIndex = this.cfgRoleSkinStar.length - 1;
        const maxStar = this.cfgRoleSkinStar.getValueByIndex(maxIndex, 'MaxLevel');
        const isFull = star >= maxStar;
        this.BtnUpStar.active = !isFull;
        this.SItemIcon.node.active = !isFull;
        this.NdMask.active = star === 0;
        // this.Progress.node.active = !isFull;
        this.NodeFull.active = isFull;
        if (isFull) { // 满星
            this.BtnUpStar.targetOff(this);
        } else {
            this.setBtnClick(data.Id, itemId, cfgStar.LevelUpItem);
            this.updateItemNum();
            this.updateBtnLabel(data.Id);
        }
        this.updateAttrs(data.Attrs, data.AddAttrs);
    }

    private updateItemNum() {
        /** 道具icon显示，进度条显示 */
        const count = BagMgr.I.getItemNum(this.itemId);
        this.SItemIcon.setData(UtilItem.NewItemModel(this.itemId, count));
        // this.Progress.updateProgress(count, this.needCount);
        this.LabelNeedNum.string = `/${this.needCount}`;
        this.LabelNum.string = UtilNum.Convert(count);
        const result = count >= this.needCount;
        if (result) {
            this.LabelNum.node.color = UtilColor.Green();
        } else {
            this.LabelNum.node.color = UtilColor.Red();
        }
        UtilRedDot.UpdateRed(this.BtnUpStar, result, cc.v2(60, 13));
    }

    private onItemChange(data: { itemModel: ItemModel }[]) {
        for (let i = 0, n = data.length; i < n; i++) {
            if (data[i].itemModel?.cfg?.Id === this.itemId) {
                this.updateItemNum();
                return;
            }
        }
    }

    /** 属性 */
    private updateAttrs(attrs: IAttrBase[], addAttrs: IAttrBase[]) {
        const firstNode = this.NodeAttrs.children[0];
        const x = firstNode.x;
        const y = firstNode.y;
        for (let i = 0, n = Math.max(attrs.length, this.NodeAttrs.children.length); i < n; i++) {
            let node = this.NodeAttrs.children[i];
            if (attrs[i]) {
                node = node || cc.instantiate(firstNode);
                if (!this.NodeAttrs.children[i]) {
                    this.NodeAttrs.addChild(node);
                }
                node.active = true;
                const s = node.getComponent(NdAttrBaseAddition);

                if (addAttrs) {
                    s.setAttr(attrs[i], addAttrs[i], {
                        NdAttrColor: UtilColor.NorN, isShowAddSign: true, signkey: '  ', signVal: '+',
                    });
                } else {
                    s.setAttr(attrs[i], undefined, { NdAttrColor: UtilColor.NorN, isShowAdd: false, signkey: '  ' });
                }
                node.setPosition(x, y);
            } else if (node) {
                if (i === 0) {
                    node.active = false;
                } else {
                    node.destroy();
                }
            }
        }
    }

    /** 按钮显示升星/激活 */
    private updateBtnLabel(id: number) {
        if (ModelMgr.I.RoleSkinModel.getSkinStar(id) > 0) {
            UtilCocos.SetString(this.BtnUpStar, 'Label', i18n.tt(Lang.com_button_up_star));
        } else {
            UtilCocos.SetString(this.BtnUpStar, 'Label', i18n.tt(Lang.com_button_active));
        }
    }

    /** 升星注册事件 */
    private setBtnClick(skinId: number, itemId: number, needNum: number) {
        this.BtnUpStar.targetOff(this);
        UtilGame.Click(this.BtnUpStar, () => {
            if (BagMgr.I.getItemNum(itemId) >= needNum) {
                if (ModelMgr.I.RoleSkinModel.getSkinStar(skinId) > 0) {
                    // 升星
                    ControllerMgr.I.RoleSkinController.C2SRoleSkinRiseStar(skinId);
                } else {
                    // 激活
                    ControllerMgr.I.RoleSkinController.C2SRoleSkinActive(skinId);
                }
            } else {
                WinMgr.I.open(ViewConst.ItemSourceWin, itemId);
            }
        }, this);
    }
}
