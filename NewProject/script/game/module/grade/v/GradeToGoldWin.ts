/* eslint-disable max-len */
/**
 * @Author: wx
 * @Date: 2022-07-20 17:13:13
 * @FilePath: \SanGuo\assets\script\game\module\grade\v\GradeToGoldWin.ts
 * @Description: 进阶 化金窗口
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilString } from '../../../../app/base/utils/UtilString';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { IAttrBase } from '../../../base/attribute/AttrConst';
import { AttrModel } from '../../../base/attribute/AttrModel';
import { DynamicImage } from '../../../base/components/DynamicImage';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { NdAttrBaseAdditionContainer } from '../../../com/attr/NdAttrBaseAdditionContainer';
import { FightValue } from '../../../com/fightValue/FightValue';
import { ItemQuality } from '../../../com/item/ItemConst';
import { ItemIconCost } from '../../../com/item/ItemIconCost';
import ItemModel from '../../../com/item/ItemModel';
import { WinCmp } from '../../../com/win/WinCmp';
import { E } from '../../../const/EventName';
import { FuncId } from '../../../const/FuncConst';
import { RES_ENUM } from '../../../const/ResPath';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import { BagItemChangeInfo } from '../../bag/BagConst';
import { BagMgr } from '../../bag/BagMgr';
import { GRADE_MAX_LEVEL, GRADE_MIN_LEVEL } from '../GradeConst';
import { GradeMgr } from '../GradeMgr';
import { GradeToGoldEquipItem } from './GradeToGoldEquipItem';

const { ccclass, property } = cc._decorator;

@ccclass
export class GradeToGoldWin extends WinCmp {
    @property(FightValue)
    protected NdFightValue: FightValue = null;
    // 化金等级
    @property(cc.Label)
    protected LbHuajinLv: cc.Label = null;
    // 装备名
    @property(cc.Label)
    protected LdEquipName: cc.Label = null;
    // 等级变化
    @property(cc.Node)
    protected NdLvChange: cc.Node = null;
    // 属性变化
    @property(NdAttrBaseAdditionContainer)
    protected NdAttrContainer: NdAttrBaseAdditionContainer = null;
    // 消耗道具
    @property(cc.Node)
    protected NdItemContent: cc.Node = null;
    @property(cc.Node)
    protected NdItemLabel: cc.Node = null;
    @property(cc.Node)
    protected HuajinBtn: cc.Node = null;

    @property(cc.Node)
    protected NdFull: cc.Node = null;

    @property(GradeToGoldEquipItem)
    protected CenterEquipItem: GradeToGoldEquipItem = null;

    @property(GradeToGoldEquipItem)
    protected EquipItems: GradeToGoldEquipItem[] = [];

    @property(DynamicImage)
    protected DyBg: DynamicImage = null;

    /** 选择展示装备 */
    private selectEquipIdx: number = -1;
    private _gradeId: number = 0;
    /** 红点id */
    private rid: number = 0;

    private hjEquipMap: Map<number, ItemModel> = new Map();
    private hjPosLvMap: Map<number, number> = new Map();

    // private hjCostItems: [number, number, number][] = [];

    /** 消耗的道具id列表 */
    private costItemIds: number[] = [];
    /** 消耗的道具已有的数量 */
    private costHasNums: number[] = [];
    /** 消耗的道具需要的数量 */
    private costNeedNums: number[] = [];

    public init(params: any[]): void {
        super.init(params);
        this._gradeId = params[0];

        this.updateData();
    }

    private isCanHuaJin(isShowSource: boolean = false) {
        for (let i = 0; i < this.costNeedNums.length; i++) {
            if (this.costHasNums[i] < this.costNeedNums[i]) {
                if (isShowSource) {
                    WinMgr.I.open(ViewConst.ItemSourceWin, this.costItemIds[i]);
                }
                return false;
            }
        }
        return true;
    }

    protected start(): void {
        super.start();
        this.DyBg.loadImage(RES_ENUM.Grade_Img_Jinjie_Huajin, 1, true);
        UtilGame.Click(this.HuajinBtn, () => {
            // console.log('请求化金操作', this._gradeId, this.selectEquipIdx + 1);
            if (this.isCanHuaJin(true)) {
                ControllerMgr.I.GradeController.reqC2SGradeBeGoldLevelUp(this._gradeId, this.selectEquipIdx + 1);
            }
        }, this);

        EventClient.I.on(E.Grade.UpdateInfo, this.onUpdateInfo, this);
        // UtilRedDot.Unbind(this.HuajinBtn);
        EventClient.I.on(E.Bag.ItemChange, this.onItemChange, this);
    }

    /** 收到道具变化，更新 */
    private onItemChange(items: BagItemChangeInfo[]) {
        /** 更新了多少个Item */
        let updateItemCount = 0;
        for (let i = 0, n = items.length; i < n; i++) {
            const item = items[i];
            const index = this.costItemIds.indexOf(item.itemModel.cfg.Id);
            if (index >= 0) {
                this.updateItem(this.NdItemContent.children[index], index);
                updateItemCount++;
            }
            // 消耗的item已经都更新完了，就跳出循环
            if (updateItemCount >= this.costItemIds.length) {
                break;
            }
        }

        /** 需要的道具有变化 */
        if (updateItemCount) {
            /** 能化金了,并且当前红点是不亮的，才需要检查红点 */
            const isCanHJ = this.isCanHuaJin();
            if (isCanHJ) {
                const gradeData = GradeMgr.I.getGradeData(this._gradeId);
                GradeMgr.I.checkRedbeGold(this._gradeId, gradeData);
            }
            this.refreshEquips();
            UtilRedDot.UpdateRed(this.HuajinBtn, isCanHJ, cc.v2(82, 15));
        }
    }

    protected onDestroy(): void {
        EventClient.I.off(E.Grade.UpdateInfo, this.onUpdateInfo, this);
        EventClient.I.off(E.Bag.ItemChange, this.onItemChange, this);
        super.onDestroy();
    }

    private updateData(): void {
        // 获取幻金装备等级
        const gradeData = GradeMgr.I.getGradeData(this._gradeId);
        if (gradeData && gradeData.GradeBeGold) {
            const hjPosLvs = gradeData.GradeBeGold.PosLv || [];
            hjPosLvs.forEach((v) => {
                this.hjPosLvMap.set(v.K, v.V);
            });
        }

        // 获取幻金装备
        this.hjEquipMap = GradeMgr.I.getGradeOnEquipPartMap(this._gradeId);
        const hjAttrFvId = GradeMgr.I.getGradeHjAttrFvId(this._gradeId);
        this.NdFightValue.setOnFvAttrId(hjAttrFvId);

        this.refreshEquips();
    }

    /**
     *  设置装备部位图标的
     * @param equips 装备数组
     */
    private refreshEquips(): void {
        let hasEquip = false;
        let selectIdx = this.selectEquipIdx;
        let backIdx = -1;

        // 刷新化金道具
        this.EquipItems.forEach((item, index) => {
            const part = index + 1;
            const hjLv = this.hjPosLvMap.get(part) || 0;
            const itemModel = this.hjEquipMap.get(part);
            let hasRed = false;

            if (itemModel && itemModel.cfg.Level === GRADE_MAX_LEVEL && itemModel.cfg.Quality >= ItemQuality.RED) {
                hasEquip = true;

                // 推荐红点
                const isRecommendSelect = this.isRecommendSelect(part);
                hasRed = isRecommendSelect;

                // 下标备胎
                if (backIdx === -1) {
                    backIdx = index;
                }
                if (selectIdx === -1 || this.selectEquipIdx === index) {
                    // 可升级就设置为推荐选中
                    if (isRecommendSelect) {
                        selectIdx = index;
                    }
                }
                item.setData({
                    index, lock: false, select: this.selectEquipIdx === index, grade: GRADE_MAX_LEVEL, itemModel, level: hjLv,
                });
                UtilGame.Click(item.NdTouch, () => {
                    if (this.selectEquipIdx === index) {
                        return;
                    }
                    this.selectEquipItem(index);
                }, this);
            } else {
                item.setData({
                    index, lock: true, select: false, grade: 0, itemModel: null, level: hjLv,
                });
                item.NdTouch.targetOff(this);
            }

            UtilRedDot.UpdateRed(item.node, hasRed, cc.v2(37, 37));
        });

        if (hasEquip) {
            // 没有推荐的就选中第一个
            selectIdx = selectIdx <= -1 ? backIdx : selectIdx;
            this.selectEquipItem(selectIdx);
        }
    }

    /**
     * 是否推荐选中
     * @param part
     * @returns boolean
     */
    private isRecommendSelect(part: number): boolean {
        const hjLv = this.hjPosLvMap.get(part) || 0;
        if (hjLv < GRADE_MAX_LEVEL) {
            // 检查升级道具是否足够
            let canUp = true;
            const nextGoldData = GradeMgr.I.getGradeHJCfg(this._gradeId, part, hjLv + 1);
            const itemList = UtilItem.ParseAwardItems(nextGoldData.CostItem);
            itemList.forEach((item) => {
                const ownNum = BagMgr.I.getItemNum(item.data.ItemId);
                if (ownNum < item.data.ItemNum) {
                    canUp = false;
                }
            });
            return canUp;
        }
        return false;
    }

    /**
     * 选中装备
     * @param index
     * @returns
     */
    private selectEquipItem(index: number): void {
        if (this.selectEquipIdx === index) {
            this.refreshHJInfo(index);
            return;
        }
        if (this.selectEquipIdx >= 0) {
            this.EquipItems[this.selectEquipIdx].setSelect(false);
        }
        this.selectEquipIdx = index;
        this.EquipItems[index].setSelect(true);

        this.refreshHJInfo(index);
        UtilRedDot.UpdateRed(this.HuajinBtn, this.isCanHuaJin(), cc.v2(82, 15));
    }
    /**
     * 刷新化金信息
     * @param index
     */
    private refreshHJInfo(index: number) {
        const part = index + 1;
        const itemModel = this.hjEquipMap.get(part);
        const hjLv = this.hjPosLvMap.get(part) || 0;

        // 化金道具
        this.CenterEquipItem.setData({
            index: -1, lock: false, select: false, grade: GRADE_MAX_LEVEL, itemModel, level: hjLv, hide: true,
        });

        // 化金等级名称
        this.LdEquipName.string = itemModel.cfg.Name;
        const nextHjlv = Math.min(hjLv + 1, GRADE_MAX_LEVEL);
        this.LbHuajinLv.string = `${i18n.tt(Lang.grade_to_gold)} ${UtilString.FormatArgs(i18n.tt(Lang.com_level), nextHjlv)}`;

        // 当前属性
        let currAttr: IAttrBase[] = [];
        // 下级属性
        let nextGoldData: Cfg_GradeHJ;
        let nextAttr: IAttrBase[] = [];

        const labCurrLv = this.NdLvChange.getChildByName('LbLeftLv').getComponent(cc.Label);
        const labNextLv = this.NdLvChange.getChildByName('LbRightLv').getComponent(cc.Label);
        const ndBg = this.NdLvChange.getChildByName('NdBg');
        const isMax = hjLv >= GRADE_MAX_LEVEL;
        const nextLv = hjLv + 1;

        if (isMax) {
            labNextLv.node.active = false;
            ndBg.active = false;
            labCurrLv.string = `${hjLv}${i18n.lv}`;// i18n.tt(Lang.com_bg_full);
        } else {
            labNextLv.node.active = true;
            ndBg.active = true;
            labCurrLv.string = `${hjLv}${i18n.lv}`;
            labNextLv.string = `${nextLv}${i18n.lv}`;
        }

        const currLv = Math.max(hjLv, GRADE_MIN_LEVEL);
        const currGoldData = GradeMgr.I.getGradeHJCfg(this._gradeId, part, currLv);
        const currAttrInfo = AttrModel.MakeAttrInfo(currGoldData.AttrId);
        currAttr = currAttrInfo.attrs;
        // 如果真实等级为0，那么属性值置0
        if (hjLv === 0) {
            currAttr.forEach((v) => v.value = 0);
        }

        if (nextLv <= GRADE_MAX_LEVEL) {
            nextGoldData = GradeMgr.I.getGradeHJCfg(this._gradeId, part, nextLv);
            const nextAttrInfo = AttrModel.MakeAttrInfo(nextGoldData.AttrId);
            nextAttr = nextAttrInfo.attrs;
        }

        // 设置属性数值的变更，这个位置要求可配置，撑死赛四个
        this.NdAttrContainer.init(currAttr, nextAttr, {
            baseAddwidth: 350, NdAttrWidth: 240, isShowAdd: nextAttr.length > 0, resizeMode: cc.Layout.ResizeMode.CONTAINER,
        });

        // 传消耗道具信息
        this.costItemIds.length = 0;
        this.costHasNums.length = 0;
        this.costNeedNums.length = 0;
        if (nextGoldData) {
            const itemList = nextGoldData.CostItem.split('|');
            itemList.forEach((value) => {
                const item = value.split(':');
                this.costItemIds.push(+item[0]);
                this.costNeedNums.push(+item[1]);
                this.costHasNums.push(BagMgr.I.getItemNum(item[0]));
            });
            UtilCocos.LayoutFill(this.NdItemContent, (node, idx) => {
                this.updateItem(node, idx);
            }, itemList.length);
        }
        this.NdItemContent.active = !!nextGoldData;
        this.HuajinBtn.active = !!nextGoldData;
        // this.NdItemLabel.active = !!nextGoldData;
        this.NdFull.active = !nextGoldData;
    }

    /**
     * 更新item道具
     * @param node 节点
     * @param index 索引
     */
    private updateItem(node: cc.Node, index: number) {
        const itemId = this.costItemIds[index];
        const itemNum = this.costNeedNums[index];
        const ownNum = this.costHasNums[index] = BagMgr.I.getItemNum(itemId);
        const itemIcon = node.getComponent(ItemIconCost);
        if (itemIcon) {
            const itemMode = UtilItem.NewItemModel(itemId, ownNum);
            itemIcon.setData(itemMode, ownNum, itemNum);
        }
    }

    /**
     * 监听信息更新
     * @param gradeId
     */
    private onUpdateInfo(changeGradeIds: number[]): void {
        if (!changeGradeIds.includes(this._gradeId)) {
            return;
        }
        this.updateData();
    }
}
