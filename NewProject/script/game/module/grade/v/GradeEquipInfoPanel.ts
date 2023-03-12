/*
 * @Author: hwx
 * @Date: 2022-07-12 11:55:44
 * @Description: 进阶装备信息面板
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { AttrInfo } from '../../../base/attribute/AttrInfo';
import { DynamicImage } from '../../../base/components/DynamicImage';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilEquip } from '../../../base/utils/UtilEquip';
import UtilFunOpen from '../../../base/utils/UtilFunOpen';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { AttrsStyleA } from '../../../com/attr/AttrsStyleA';
import { ItemQuality, ItemWhere } from '../../../com/item/ItemConst';
import { ItemIcon } from '../../../com/item/ItemIcon';
import ItemModel from '../../../com/item/ItemModel';
import { E } from '../../../const/EventName';
import { FuncId } from '../../../const/FuncConst';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import { BagMgr } from '../../bag/BagMgr';
import { RID } from '../../reddot/RedDotConst';
import { SmeltViewId } from '../../smelt/SmeltConst';
import {
    GradeType,
    GRADE_MAX_LEVEL,
    GRADE_STRENGTH_MAX_LEVEL,
} from '../GradeConst';
import { GradeMgr } from '../GradeMgr';
import { GradeModel } from '../GradeModel';

const { ccclass, property } = cc._decorator;

@ccclass
export class GradeEquipInfoPanel extends BaseCmp {
    @property(cc.Node)
    private NdBuildBtn: cc.Node = null;

    @property(cc.Node)
    private NdSmeltBtn: cc.Node = null;

    @property(cc.Node)
    private NdMeltGoldBtn: cc.Node = null;

    @property(cc.Node)
    private NdOneKeyStrengthBtn: cc.Node = null;

    @property(cc.Node)
    private NdOneKeyWearBtn: cc.Node = null;

    @property(cc.Node)
    private NdEquips: cc.Node = null;

    @property(cc.Node)
    private NdCost: cc.Node = null;

    @property(DynamicImage)
    private SprCostIcon: DynamicImage = null;

    @property(cc.Label)
    private LabPrice: cc.Label = null;

    @property(AttrsStyleA)
    private NdAttrsStyleA: AttrsStyleA = null;

    @property(cc.Node)
    private NdFull: cc.Node = null;
    @property(cc.Label)
    private LabelEquipTitle: cc.Label = null;

    /** 升阶数据模型 */
    private _gradeModel: GradeModel;
    private _gradeId: number;

    private _costItemId: number = 0;
    private _costItemNum: number = 0;
    private _ownCostItemNum: number = 0;

    private _onEquipPartMap: Map<number, ItemModel> = new Map();

    public init(...param: unknown[]): void {
        const gradeModel = param[0] as GradeModel;
        this.updateModel(gradeModel);
        this.updataRedPoint();
    }

    protected start(): void {
        UtilGame.Click(this.NdBuildBtn, this.onClickBuildBtn, this);
        UtilGame.Click(this.NdSmeltBtn, this.onClickSmeltBtn, this);
        UtilGame.Click(this.NdMeltGoldBtn, this.onClickMeltGoldBtn, this);
        UtilGame.Click(this.NdOneKeyWearBtn, this.onClickOneKeyWearBtn, this);
        UtilGame.Click(this.NdOneKeyStrengthBtn, this.onClickOneKeyStrengthBtn, this);

        EventClient.I.on(E.Grade.GradeEquipChange, this.refEquipNumChange, this);
        EventClient.I.on(E.Grade.GradeEquipItemNum, this.setNum, this);
    }

    protected onDestroy(): void {
        EventClient.I.off(E.Grade.GradeEquipChange, this.refEquipNumChange, this);
        EventClient.I.off(E.Grade.GradeEquipItemNum, this.setNum, this);
        super.onDestroy();
    }

    private updataRedPoint(): void {
        // 取消红点绑定
        UtilRedDot.Unbind(this.NdMeltGoldBtn);
        UtilRedDot.Unbind(this.NdOneKeyWearBtn);
        UtilRedDot.Unbind(this.NdOneKeyStrengthBtn);
        UtilRedDot.Unbind(this.NdBuildBtn);
        let labelTitle = i18n.tt(Lang.grade_equip_attr_title);
        const redData = GradeMgr.I.getRedEquipDataByGradeId(this._gradeId);
        // 绑定红点
        UtilRedDot.Bind(redData.BE_GOLD, this.NdMeltGoldBtn, cc.v2(15, 22));
        UtilRedDot.Bind(redData.BETTER, this.NdOneKeyWearBtn, cc.v2(80, 20));
        UtilRedDot.Bind(redData.STRENGTH, this.NdOneKeyStrengthBtn, cc.v2(80, 20));
        UtilRedDot.Bind(redData.Build, this.NdBuildBtn, cc.v2(24, 30));
        if (this._gradeId === FuncId.BeautyGrade) {
            labelTitle = i18n.tt(Lang.grade_beauty_equip_attr_title);
        }
        this.LabelEquipTitle.string = labelTitle;
    }

    private refEquipNumChange(): void {
        // 不好抽出来，直接刷model吧
        this.updateModel(this._gradeModel);
        GradeMgr.I.checkRedGradeEquip(this._gradeId, this._gradeModel.data);
    }

    /**
     * 打造
     */
    private onClickBuildBtn(): void {
        if (UtilFunOpen.isOpen(FuncId.EquipBuild, true)) {
            const sys = GradeMgr.I.getGradeEquipType(this._gradeId);
            const lv = this._gradeModel.data.GradeLv.BigLv;
            WinMgr.I.open(ViewConst.EquipWin, 2, { sys, lv });
        }
    }

    /**
     * 熔炼
     */
    private onClickSmeltBtn(): void {
        if (UtilFunOpen.isOpen(FuncId.Smelt, true)) {
            ControllerMgr.I.SmeltController.linkOpen(SmeltViewId.GRADE_MELT);
        }
    }

    /**
     * 化金
     */
    private onClickMeltGoldBtn(): void {
        const hjEquips: ItemModel[] = []; // 检查打开化金的条件
        this._onEquipPartMap.forEach((v) => {
            if (v.cfg.Level === GRADE_MAX_LEVEL && v.cfg.Quality >= ItemQuality.RED) {
                hjEquips.push(v);
            }
        });

        if (hjEquips.length > 0) {
            WinMgr.I.open(ViewConst.GradeToGoldWin, this._gradeId);
            GradeMgr.I.checkRedbeGold(this._gradeId, this._gradeModel.data);
        } else {
            MsgToastMgr.Show(`穿戴10阶红色装备后开启化金`);
        }
    }

    /**
     * 一键穿戴
     */
    private onClickOneKeyWearBtn(): void {
        ControllerMgr.I.GradeController.reqC2SGradeEquipAutoWear(this._gradeId);
    }

    /** 一键强化 */
    private onClickOneKeyStrengthBtn(): void {
        if (this._ownCostItemNum < this._costItemNum) {
            WinMgr.I.open(ViewConst.ItemSourceWin, this._costItemId);
        } else if (this._onEquipPartMap) {
            const parts: number[] = [];
            this._onEquipPartMap.forEach((v, k) => parts.push(k));
            ControllerMgr.I.GradeController.reqC2SGradeEquipPosLevelUp(this._gradeId, parts);
        }
    }

    public updateModel(gradeModel: GradeModel): void {
        this._gradeModel = gradeModel;
        this._gradeId = this._gradeModel.data.GradeId;
        // 化金红点检查
        GradeMgr.I.checkRedbeGold(this._gradeId, this._gradeModel.data);
        /** 不是没有装备 ===有装备 */
        let isNoEquip: boolean = false;
        // 强化装备部位等级
        const equipPosLvs = gradeModel.data.GradeEquip.PosLv || [];
        equipPosLvs.sort((a, b) => b.K - a.K);

        const onEquipPartMap = GradeMgr.I.getGradeOnEquipPartMap(this._gradeId);
        const betterEquipMap = GradeMgr.I.getGradeBetterEquipMap(this._gradeId, gradeModel.data.GradeLv.BigLv, onEquipPartMap);
        this._onEquipPartMap = onEquipPartMap;

        let curStrengthMinLvPart = 1;
        let curStrengthMinLv = GRADE_STRENGTH_MAX_LEVEL;
        console.log(this.NdEquips);

        this.NdEquips.children.forEach((item, idx) => {
            const NdBg = item.getChildByName('SprBg');
            const ndIcon = item.getChildByName('NdIcon');
            const labGradeLv = item.getChildByName('LabGradeLv').getComponent(cc.Label);
            const labStrengthLv = item.getChildByName('LabStrengthLv').getComponent(cc.Label);
            const labName = item.getChildByName('LabName').getComponent(cc.Label);
            const ndAdd = item.getChildByName('SprAdd');

            // 强化等级
            const part = idx + 1;
            const intAttr: IntAttr = UtilGame.GetIntAttrByKey(equipPosLvs, part);
            const strengthLv = intAttr ? intAttr.V : 0;
            labStrengthLv.string = `+${strengthLv}`;
            labStrengthLv.node.active = strengthLv > 0;

            const equip = onEquipPartMap.get(part);

            // 判断是否一个装备都没有
            isNoEquip = isNoEquip || !!equip;
            if (equip) {
                NdBg.targetOff(this);
                // 显示装备
                UtilItem.Show(ndIcon, equip, { where: ItemWhere.GRADE_EQUIP, needName: true }, (itemIcon: ItemIcon) => {
                    itemIcon.clickTarget = item;
                    const opts = UtilEquip.GetEquipItemTipsOptions(equip, this._gradeModel);
                    itemIcon.setTipsOptions(opts);
                });
                // 显示装备阶级
                labGradeLv.string = `${equip.cfg.Level}${i18n.jie}`;
            } else {
                ndIcon.destroyAllChildren();
                ndIcon.removeAllChildren();
                // 空装备时点击查看装备来源
                UtilGame.Click(NdBg, () => {
                    const cfgItem: Cfg_Item = GradeMgr.I.getMinEquipPartCfg(this._gradeId, part);
                    if (cfgItem) {
                        WinMgr.I.open(ViewConst.ItemSourceWin, cfgItem.Id);
                    }
                }, this, { scaleTarget: ndAdd });

                labName.string = UtilItem.GetEquipPartName(part, GradeMgr.I.getGradeEquipType(this._gradeId));
            }
            labGradeLv.node.active = !!equip;
            labName.node.active = !equip;
            ndAdd.active = !equip;
            NdBg.active = !equip;

            let hasRed = betterEquipMap.has(part);
            if (equip && !hasRed) {
                // if (this._gradeId === GradeType.HORSE) {
                //     hasRed = RedDotMgr.I.getStatus(RID.Grade.Horse.Equip.STRENGTH);
                // } else if (this._gradeId === GradeType.WING) {
                //     hasRed = RedDotMgr.I.getStatus(RID.Grade.Wing.Equip.STRENGTH);
                // } else if (this._gradeId === GradeType.WEAPON) {
                //     hasRed = RedDotMgr.I.getStatus(RID.Grade.Weapon.Equip.STRENGTH);
                // }
                hasRed = GradeMgr.I.checkRedGradeEquipOne(this._gradeId, this._gradeModel.data, part);
            }

            // 获得所有部位中强化最低的等级
            if (equip && strengthLv >= 0 && strengthLv < curStrengthMinLv && strengthLv < GRADE_STRENGTH_MAX_LEVEL) {
                curStrengthMinLvPart = part;
                curStrengthMinLv = strengthLv;
            }

            // 此处是否缺少了 判断消耗物品没有的时候@hwx
            if (!hasBetterEquip) {
                // 获取最小强化等级配置，取它的材料做展示
                // const minLv = Math.max(curStrengthMinLv, GRADE_STRENGTH_MIN_LEVEL);
                const cfg = GradeMgr.I.getGradeStrengthCfg(curStrengthMinLvPart, curStrengthMinLv);
                if (cfg) {
                    const [itemId, itemNum] = UtilItem.ParseItemStr(cfg.NeedItem);
                    const own = BagMgr.I.getItemNum(itemId);
                    if (own < itemNum) {
                        hasRed = false;
                    }
                }
            }

            UtilRedDot.UpdateRed(item, hasRed, cc.v2(40, 40));
        });

        const hasBetterEquip = betterEquipMap.size > 0;
        this.NdOneKeyWearBtn.active = hasBetterEquip;

        if (!hasBetterEquip) {
            // 获取最小强化等级配置，取它的材料做展示
            const minLv = Math.min(curStrengthMinLv + 1, GRADE_STRENGTH_MAX_LEVEL);
            const cfg = GradeMgr.I.getGradeStrengthCfg(curStrengthMinLvPart, minLv);
            if (cfg) {
                // 设置消耗
                const [itemId, itemNum] = UtilItem.ParseItemStr(cfg.NeedItem);
                const itemCfg = UtilItem.GetCfgByItemId(itemId);
                this.SprCostIcon.loadImage(UtilItem.GetItemIconPath(itemCfg.PicID), 1, true);
                const own = BagMgr.I.getItemNum(itemId);
                this.LabPrice.string = `${UtilNum.Convert(own)}/${itemNum}`;
                this.LabPrice.node.color = own < itemNum ? UtilColor.Red() : UtilColor.Green();
                this._costItemId = itemId;
                this._costItemNum = itemNum;
                this._ownCostItemNum = own;
            }
        }
        const isFullLv = curStrengthMinLv === GRADE_STRENGTH_MAX_LEVEL && isNoEquip;
        this.NdOneKeyStrengthBtn.active = onEquipPartMap.size > 0 && !hasBetterEquip && !isFullLv;
        this.NdCost.active = this.NdOneKeyStrengthBtn.active;
        this.NdFull.active = isFullLv && !hasBetterEquip;

        this.refreshAttrs(onEquipPartMap, equipPosLvs);
    }

    /** 用于刷新强化石数量 */
    private setNum() {
        const own = BagMgr.I.getItemNum(this._costItemId);
        if (own <= this._ownCostItemNum) return;
        this._ownCostItemNum = own;
        this.LabPrice.string = `${own}/${this._costItemNum}`;
        this.LabPrice.node.color = own < this._costItemNum ? UtilColor.Red() : UtilColor.Green();
        GradeMgr.I.checkRedGradeEquip(this._gradeId, this._gradeModel.data);

        this.updateModel(this._gradeModel);
    }

    private refreshAttrs(onEquipMap: Map<number, ItemModel>, equipPosLvs: IntAttr[]): void {
        /** 计算属性 */
        const totalAttrInfo: AttrInfo = new AttrInfo();
        const onEquips: ItemModel[] = [];
        onEquipMap.forEach((itemModel, part) => {
            // 计算强化属性值
            for (let i = 0; i < equipPosLvs.length; i++) {
                const posLv = equipPosLvs[i];
                if (posLv.K === part && posLv.V > 0) {
                    const attrInfo = GradeMgr.I.getStrengthAttrInfo(posLv.K, posLv.V);
                    totalAttrInfo.add(attrInfo);
                    break;
                }
            }
            onEquips.push(itemModel);
        });

        if (onEquips.length > 0) {
            // 获取道具基础属性值
            const equipAttrInfo = UtilItem.GetItemsAttrBaseList(onEquips);
            totalAttrInfo.add(equipAttrInfo);
        }
        this.NdAttrsStyleA.init(totalAttrInfo);
        if (this._gradeId === FuncId.BeautyGrade) {
            this.NdAttrsStyleA.setLabelEmptyTips(i18n.tt(Lang.grade_beauty_equip_attr_empty_tips));
        }
    }
}
