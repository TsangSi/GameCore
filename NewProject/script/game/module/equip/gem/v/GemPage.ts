import { EventClient } from '../../../../../app/base/event/EventClient';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { ResMgr } from '../../../../../app/core/res/ResMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { AttrBase } from '../../../../base/attribute/AttrBase';
import { EAttrType } from '../../../../base/attribute/AttrConst';
import MsgToastMgr from '../../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItem from '../../../../base/utils/UtilItem';
import UtilRedDot from '../../../../base/utils/UtilRedDot';
import { FightValue } from '../../../../com/fightValue/FightValue';
import { ItemWhere, ROLE_EQUIP_PART_NUM } from '../../../../com/item/ItemConst';
import { WinTabPage } from '../../../../com/win/WinTabPage';
import { E } from '../../../../const/EventName';
import { FuncId } from '../../../../const/FuncConst';
import { UI_PATH_ENUM } from '../../../../const/UIPath';
import { ViewConst } from '../../../../const/ViewConst';
import ControllerMgr from '../../../../manager/ControllerMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import { BagMgr } from '../../../bag/BagMgr';
import { Link } from '../../../link/Link';
import { EquipPartGem } from '../GemModel';
import { GemEquipItem } from './GemEquipItem';

const { ccclass, property } = cc._decorator;

@ccclass
export class GemPage extends WinTabPage {
    /** 属性按钮 */
    @property(cc.Node)
    private NdProperty: cc.Node = null;
    /** 获取途径按钮 */
    @property(cc.Node)
    private NdGet: cc.Node = null;
    /** 一键升级 */
    @property(cc.Node)
    private NdOneKeyUpdate: cc.Node = null;
    /** 一键镶嵌 */
    @property(cc.Node)
    private NdOneKeyInlaid: cc.Node = null;
    /** 选中框 */
    @property(cc.Node)
    private NdSprCk: cc.Node = null;

    /** 战力组件类 */
    @property(FightValue)
    private scriptFightValue: FightValue = null;

    // /** 容器 */
    @property(cc.Node)
    private NdItems: cc.Node = null;
    // /** 容器 */
    @property(cc.Node)
    private NdEquipContainer: cc.Node = null;

    /** 当前选中的部位 */
    private currentEquipPart: number = null;

    private currentEquipItem: any = null;

    private gemData: EquipPartGem[] = null;

    protected start(): void {
        super.start();

        EventClient.I.on(E.Role.WearEquipSuccess, this.onSyncUI, this);
        EventClient.I.on(E.Bag.ItemChange, this.onSyncUI, this);
        EventClient.I.on(E.Gem.Inlay, this.onSyncUI, this);
        EventClient.I.on(E.Gem.OneKeyInlay, this.onSyncUI, this);
        EventClient.I.on(E.Gem.OneKeyLevelUp, this.onSyncUI, this);

        /** 一键升级 */
        UtilGame.Click(this.NdOneKeyUpdate, this.onOneKeyUpdate, this);
        /** 一键镶嵌 */
        UtilGame.Click(this.NdOneKeyInlaid, this.onOneKeyInlai, this);
        /** 点击属性 */
        UtilGame.Click(this.NdProperty, this.onClickProperty, this);

        /** 点击属性 */
        UtilGame.Click(this.NdGet, () => {
            // WinMgr.I.open(ViewConst.ItemSourceWin, 220101);
            Link.To(FuncId.FBExplorePage);
        }, this);
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.Role.WearEquipSuccess, this.onSyncUI, this);
        EventClient.I.off(E.Bag.ItemChange, this.onSyncUI, this);
        EventClient.I.off(E.Gem.Inlay, this.onSyncUI, this);
        EventClient.I.off(E.Gem.OneKeyInlay, this.onSyncUI, this);
        EventClient.I.off(E.Gem.OneKeyLevelUp, this.onSyncUI, this);
    }

    public init(winId: number, param: unknown, tabIdx: number): void {
        super.init(winId, param, tabIdx);
        this.initEquipLayout();
    }

    /** 同步UI界面 */
    private onSyncUI(gems: number[][]): void {
        this.initEquipInfo();
        this.updateFight();
        const model = ModelMgr.I.GemModel;
        if (gems) {
            const ary: number[][] = [];
            gems.forEach((v: number[]) => {
                if (model.isSkillGem(v[1])) {
                    ary.push(v);
                }
            });
            /* 显示特性提升 */
            if (ary.length > 0) {
                WinMgr.I.open(ViewConst.GemCompare, ary);
            }
        }

        if (this.currentEquipPart != null) this.selectItem(this.currentEquipPart);
    }

    /* 升级 */
    private onOneKeyUpdate(): void {
        if (!this.currentEquipItem) {
            MsgToastMgr.Show(i18n.tt(Lang.equip_gem_tip7));
            return;
        }

        let update = false;

        if (this.gemData) {
            for (let i = 0; i < this.gemData.length; ++i) {
                if (this.gemData[i].update) {
                    update = true;
                    break;
                }
            }
        }

        // 暂无宝石可升级
        if (!update) {
            console.log(i18n.tt(Lang.equip_gem_tip8));
            MsgToastMgr.Show(i18n.tt(Lang.equip_gem_tip8));
            return;
        }

        // console.log('升级');

        ControllerMgr.I.StrengthController.reqC2SEquipGemOneKeyLevelUp();
    }

    /* 镶嵌 */
    private onOneKeyInlai(): void {
        if (!this.currentEquipItem) {
            MsgToastMgr.Show(i18n.tt(Lang.equip_gem_tip4));
            return;
        }

        let inlays = false;
        if (this.gemData) {
            for (let i = 0; i < this.gemData.length; ++i) {
                if (this.gemData[i].inlaysRed) {
                    inlays = true;
                    break;
                }
            }
        }

        if (!inlays) {
            MsgToastMgr.Show(i18n.tt(Lang.equip_gem_tip6));
            return;
        }

        ControllerMgr.I.StrengthController.reqC2SEquipGemOneKeyInlay();
    }

    /** 点击孔位 */
    private onClickGemItem(node: cc.Node, index: number): void {
        if (!this.gemData) return;

        const data = this.gemData ? this.gemData[index - 1] : null;

        const model = ModelMgr.I.GemModel;

        if (data) {
            if (data.curGemId) {
                const itemModel = UtilItem.NewItemModel(data.curGemId, 1);
                WinMgr.I.open(ViewConst.ItemTipsWin, itemModel, { where: ItemWhere.OTHER, showGem: true });
                return;
            }

            if (!data.upGemId) {
                // 允许镶嵌不存在物品
                if (data.inlays && !data.inlaysRed) {
                    WinMgr.I.open(ViewConst.ItemSourceWin, model.getOneLevelGemInfo(data.sourceGemItemId));
                    // MsgToastMgr.Show(i18n.tt(Lang.equip_gem_tip6));
                    return;
                }
                // 显示默认的提示
                if (data.tip) MsgToastMgr.Show(data.tip);
                return;
            }
            // 未穿戴装备
            if (!this.currentEquipItem) {
                MsgToastMgr.Show(i18n.tt(Lang.equip_gem_tip4));
                return;
            }

            if (!data.inlaysRed && data.tip && data.tip.length) {
                MsgToastMgr.Show(data.tip);
                return;
            }
        }

        // console.log('单个镶嵌', '部位', this.currentEquipPart, '孔位', index, '宝石', data.upGemId);

        ControllerMgr.I.StrengthController.reqC2SEquipGemInlay(this.currentEquipPart, index, data.upGemId);
    }

    /* 点击属性总览 */
    private onClickProperty() {
        const model = ModelMgr.I.GemModel;
        const info = model.getOnEquipGemAttrInfo();
        if (info.attrs.length) {
            let str = '';
            info.attrs.forEach((value: AttrBase) => {
                /* 万分比判断显示 */
                if (str.length) str += '\n';
                if (value.attrType >= EAttrType.Attr_19 && value.attrType <= EAttrType.Attr_22) {
                    str += `${value.name} +${(value.value / 10000 * 100).toFixed(2)}%\n`;
                } else {
                    str += `${value.name} +${value.value}`;
                }
            });
            const cfgs = [];
            cfgs.push({ title: Lang.item_tips_attr_gem, data: str });
            cfgs.push({ title: Lang.con_skill_property, data: model.getAllGemSkillDesc() });
            WinMgr.I.open(ViewConst.AttrDetailTips, cfgs);
        } else {
            MsgToastMgr.Show(i18n.tt(Lang.com_no_add_property));
        }
    }

    /** 刷新战斗力 */
    private updateFight() {
        const fightValue = ModelMgr.I.GemModel.getOnEquipGemFightValue();
        this.scriptFightValue?.setValue(fightValue);
        this.NdProperty.active = fightValue !== 0;
    }

    /** 检测默认可升级或镶嵌并选中 */
    private checkDefaultSelect(index: number) {
        const model = ModelMgr.I.GemModel;
        const roleEquipList = BagMgr.I.getOnEquipMapWithEquipPart();
        if (model.checkEquipPart(roleEquipList.get(index), index)) {
            // 选中装备不挂红点
            if (this.currentEquipPart == null) {
                this.selectItem(index);
            }
            return true;
        }
        return false;
    }

    /** 创建8个节点 */
    private initEquipLayout(): void {
        // eslint-disable-next-line no-void
        void this.init8PosInfo().then(() => {
            this.initEquipInfo();
            this.initEvent();
            this.updateFight();
            if (this.currentEquipPart == null) {
                this.selectItem(1);
            }
        });
    }

    private init8PosInfo(): Promise<void> {
        return new Promise((resolve) => {
            ResMgr.I.showPrefab(UI_PATH_ENUM.Module_Equip_Gem_GemEquipItem, this.NdEquipContainer, (err, n: cc.Node) => {
                for (let i = 0; i < ROLE_EQUIP_PART_NUM - 1; i++) {
                    this.scheduleOnce(() => {
                        this.NdEquipContainer.addChild(cc.instantiate(n));
                        if (i === ROLE_EQUIP_PART_NUM - 2) {
                            resolve();
                        }
                    }, i * 0.02);
                }
            });
        });
    }

    /** 显示装备信息 */
    private initEquipInfo(): void {
        const roleEquipList = BagMgr.I.getOnEquipMapWithEquipPart();
        const idxs = [0, 2, 4, 6, 1, 3, 5, 7];
        for (let i = 0; i < idxs.length; ++i) {
            const idx = idxs[i];
            const node = this.NdEquipContainer.children[idx];
            if (!node) continue;
            const equipItemNode: cc.Node = node;
            const item = roleEquipList.get(idx + 1);
            const equipItem = equipItemNode.getComponent(GemEquipItem);
            if (item) {
                const model = ModelMgr.I.GemModel;
                const gems = model.getEquipPartGem(item, idx + 1);
                equipItem.initDefaultIcon(false);
                equipItem.setGems(gems);
                equipItem.loadIcon(item, {
                    where: ItemWhere.OTHER,
                    needName: true,
                    needNum: false,
                    hideEffect: true,
                    hideStar: true,
                    hideQualityBg: false,
                    levelStar: true,
                });
                // 因为需要挂红点 每个装备都检测一遍吧
                const red = this.checkDefaultSelect(idx + 1);
                UtilRedDot.UpdateRed(equipItemNode, red, cc.v2(45, 45));
            } else {
                equipItem.setGems(null);
                equipItem.initDefaultIcon(true, idx + 1);
                UtilRedDot.UpdateRed(equipItemNode, false);
            }
        }
    }

    private initEvent(): void {
        this.NdEquipContainer.children.forEach((node, idx) => {
            const gemItemNode: cc.Node = node;
            UtilGame.Click(gemItemNode.getChildByName('NdEvent'), () => {
                this.selectItem(idx + 1);
            }, this, { scale: 1 });
        });
        for (let i = 1; i <= 5; ++i) {
            const gemNode: cc.Node = this.NdItems.children[i];
            UtilGame.Click(gemNode.getChildByName('NdEvent'), () => {
                this.onClickGemItem(gemNode, i);
            }, this, { scale: 1 });
        }

        const equipNode = this.NdItems.children[0];

        UtilGame.Click(equipNode.getChildByName('NdEvent'), () => {
            if (this.currentEquipItem) {
                WinMgr.I.open(ViewConst.ItemTipsWin, this.currentEquipItem, { where: ItemWhere.OTHER, showGem: true });
            }
        }, this);
    }

    /* 设置宝石数据 */
    private setGemData(itemExist: boolean, data: EquipPartGem[]): void {
        this.gemData = data;
        let update = false;
        let inlaid = false;

        if (data && data.length) {
            const model = ModelMgr.I.GemModel;
            for (let i = 1; i <= 5; ++i) {
                const v = data[i - 1];
                const node = this.NdItems.children[i];
                UtilRedDot.UpdateRed(node, itemExist && (v.inlaysRed || v.update), cc.v2(35, 35));
                const cmp = node.getComponent(GemEquipItem);
                const show = v.tip != null;
                cmp.hideIcon().showTip(show, !!v.curGemId, v.tip).setAddNodeShow(v.inlays, v.inlaysRed).setLockNodeShow(!v.inlays && !v.curGemId);
                if (v.inlaysRed) inlaid = true;
                if (v.curGemId) {
                    const item = UtilItem.NewItemModel(v.curGemId, 1);
                    cmp.setLevel(model.getGemItem(v.curGemId).Level);
                    cmp.loadIcon(item, {
                        where: ItemWhere.OTHER,
                        needName: true,
                        needNum: false,
                        hideEffect: true,
                        hideStar: true,
                        hideQualityBg: true,
                        isCustomName: true,
                        // levelStar: true,
                    });
                }
                if (v.update) {
                    update = true;
                }
            }
        }

        UtilRedDot.UpdateRed(this.NdOneKeyUpdate, itemExist && update, cc.v2(72, 20));

        UtilRedDot.UpdateRed(this.NdOneKeyInlaid, itemExist && inlaid, cc.v2(72, 20));
    }

    /**
         * 选中某个部位
         * @param pos 0 1 2 3 4 5 6 7
         */
    private selectItem(equipPart: number): void {
        const srcNode: cc.Node = this.NdEquipContainer.children[equipPart - 1];

        const roleEquipList = BagMgr.I.getOnEquipMapWithEquipPart();

        /** 恢复红点 */
        // const model = ModelMgr.I.GemModel;

        // const lastItem = roleEquipList.get(this.currentEquipPart);

        // if (lastItem && this.currentEquipPart !== -1 && model.checkEquipPart(lastItem, this.currentEquipPart)) {
        // const lastNode: cc.Node = this.NdEquipContainer.children[this.currentEquipPart - 1];
        // UtilRedDot.UpdateRed(lastNode, true, cc.v2(45, 45));
        // }

        this.currentEquipPart = equipPart;

        // UtilRedDot.UpdateRed(srcNode, false);

        this.NdSprCk.active = true;
        this.NdSprCk.position = srcNode.position;
        this.NdSprCk.x = srcNode.position.x;
        this.NdSprCk.y = srcNode.position.y + this.NdEquipContainer.position.y;
        const equipItemNode: cc.Node = this.NdItems.children[0];
        const item = roleEquipList.get(equipPart);
        const equipItem = equipItemNode.getComponent(GemEquipItem);
        const gems = ModelMgr.I.GemModel.getEquipPartGem(item, equipPart);
        this.setGemData(!!item, gems);
        this.currentEquipItem = item;
        if (item) {
            equipItem.initDefaultIcon(false);
            equipItem.loadIcon(item, {
                where: ItemWhere.OTHER,
                needName: true,
                needNum: false,
                hideEffect: true,
                hideStar: true,
                hideQualityBg: false,
                levelStarName: true,
            });
        } else {
            equipItem.initDefaultIcon(true, equipPart);
            equipItem.loadIcon(null);
            equipItem.showTip(true);
        }
    }
}
