import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { UtilString } from '../../../../app/base/utils/UtilString';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import {
    EAttrType, IAttrBase,
} from '../../../base/attribute/AttrConst';
import { DynamicImage } from '../../../base/components/DynamicImage';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilAttr } from '../../../base/utils/UtilAttr';
import { UtilEffectPath } from '../../../base/utils/UtilEffectPath';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import { NdAttrBaseAddition } from '../../../com/attr/NdAttrBaseAddition';
import { IAttrData } from '../../../com/attr/v/AttrTips';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import { EffectMgr } from '../../../manager/EffectMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { BagMgr } from '../../bag/BagMgr';
import { ResonanceType } from '../../equip/EquipConst';
import { FamilyDGConstId } from '../FamilyConst';
import FamilyModel from '../FamilyModel';

const { ccclass, property } = cc._decorator;
@ccclass
export default class FamilyDrillGroundPage extends WinTabPage {
    @property(cc.Label)// 战力
    private LabFightValue: cc.Label = null;
    @property(cc.Node)// 战力详情
    private NdPowerDetail: cc.Node = null;

    @property(cc.Node)// 升级按钮
    private BtnLvUp: cc.Node = null;
    @property(cc.Label)// 升级按钮文本
    private LabLv: cc.Label = null;
    @property(cc.Label)// 升级描述文本文本
    private LabLevelDesc: cc.Label = null;

    @property(cc.Label)// 标题
    private LabTitle: cc.Label = null;

    @property(cc.Node)// 属性容器
    private NdAttrContainer: cc.Node = null;
    @property(cc.Node)// 属性容器
    private NdAttrLineContainer: cc.Node = null;

    @property([cc.Node])// 力
    private NdItem: cc.Node[] = [];
    @property(cc.Node)// 选中框
    private NdSelectBg: cc.Node = null;

    @property([cc.Label])// 力敏 智勇 武统 等级
    private NdLabel: cc.Label[] = [];

    @property(cc.Prefab)// 属性预设
    private prefabAttr: cc.Prefab = null;
    @property(cc.Prefab)// 线条
    private linePrefab: cc.Prefab = null;

    // 消耗
    @property(cc.Node)
    private NdCost1: cc.Node = null;
    @property(DynamicImage)// 消耗
    private SprCost: DynamicImage = null;
    @property(cc.Label)// 消耗
    private LabCost: cc.Label = null;
    // 消耗2
    @property(cc.Node)
    private NdCost2: cc.Node = null;
    @property(DynamicImage)// 消耗
    private SprCost1: DynamicImage = null;
    @property(cc.Label)// 消耗
    private LabCost1: cc.Label = null;

    @property(cc.Node)// 共鸣动画
    private NdAnimation: cc.Node = null;
    @property(cc.Node) // 共鸣
    private NdResonance: cc.Node = null;

    @property(cc.Node) // 红点，是否可以共鸣
    private NdRed: cc.Node = null;

    public start(): void {
        super.start();
        UtilGame.Click(this.BtnLvUp, this._onLvUpClick, this, { unRepeat: true, time: 500 });// 点击升级
        UtilGame.Click(this.NdPowerDetail, this._onNdPowerDetailClick, this);// 战力详情
        UtilGame.Click(this.NdResonance, () => WinMgr.I.open(ViewConst.ResonanceWin, ResonanceType.FAMILY), this);// 共鸣
        EventClient.I.on(E.Family.FamilyDrillGroundLvUp, this._onFamilyDGLvUp, this);// 校场升级成功

        for (let i = 0; i < this.NdItem.length; i++) { // 选中某个
            UtilGame.Click(this.NdItem[i], this._onSelectItem, this, { customData: i });
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.Family.FamilyDrillGroundInfo, this._onFamilyDGInfo, this);// 校场基础信息
        EventClient.I.off(E.Family.FamilyDrillGroundLvUp, this._onFamilyDGLvUp, this);// 校场升级成功
        EventClient.I.off(E.Strength.UpRsonateSuccess, this._onUpRsonateSuccess, this);
    }

    private model: FamilyModel;
    public init(winId: number, param: unknown[], tabIdx: number, tabId?: number): void {
        super.init(winId, param, 0);
        this.model = ModelMgr.I.FamilyModel;

        const resonanceEff = UtilEffectPath.getResonanceEffUrl();
        this.NdAnimation.destroyAllChildren();
        EffectMgr.I.showEffect(resonanceEff, this.NdAnimation);

        EventClient.I.on(E.Family.FamilyDrillGroundInfo, this._onFamilyDGInfo, this);// 校场基础信息
        ControllerMgr.I.FamilyController.reqC2SGetDrillGroundInfo();
        EventClient.I.on(E.Strength.UpRsonateSuccess, this._onUpRsonateSuccess, this);
    }
    public refreshPage(winId: number, params: any[]): void {
        // 刷新UI无需请求
    }

    /** 升阶成功，判断是否可以共鸣 */
    private _onUpRsonateSuccess(): void {
        this._updateRed();
    }

    /** 选中某个 */
    private _onSelectItem(e, idx: number): void {
        if (this._curIdx === idx) return;
        this._curIdx = idx;
        this._initSelectIcon();
        this._initInfoByIdx();
    }

    /** 选中图标变化 */
    private _initSelectIcon(): void {
        this.NdSelectBg.x = this.NdItem[this._curIdx].x;
        this.NdSelectBg.y = this.NdItem[this._curIdx].y;
        if (this._curIdx === 5) {
            this.NdSelectBg.scale = 1;
        } else {
            this.NdSelectBg.scale = 0.72;
        }
    }

    /** 校场基础信息 */
    private DGIdArr = ModelMgr.I.FamilyModel.idsArr;

    // 当前默认选中哪一个
    private _curIdx: number = -1;
    /** 返回校场信息 */
    private _onFamilyDGInfo(data: any): void {
        this._curIdx = this._selectWhichOne();
        this._initSelectIcon();
        this._initInfoByIdx();

        this._updateRed();
    }

    /** 升级之后，共鸣执行之后 */
    private _updateRed(): void {
        const isCanResonace = this.model.isCanResonance();
        this.NdRed.active = isCanResonace;
    }

    /** 根据选中改的索引做显示 */
    private _initInfoByIdx(): void {
        // 初始化等级
        this._initFightVal();

        this._initLevel();
        this._initTitle();

        this._initAttr();

        this._initBtnLvUp();
    }

    /** 每个校场的等级 */
    private _initLevel(): void {
        for (let i = 0; i < this.NdLabel.length; i++) {
            const dgId: number = this.DGIdArr[i];// 0--5
            const level: number = this.model.getDgLvById(dgId);
            this.NdLabel[i].string = `${level}${i18n.lv}`;
        }
    }

    /** 战力信息 */
    private _initFightVal(): void {
        const fv = this.model.getDrillAllFightVal();
        this.LabFightValue.string = UtilNum.ConvertFightValue(fv);
    }

    /** 战力详情 */
    private _onNdPowerDetailClick(): void {
        const attrData: IAttrData[] = [];
        const attr: IAttrData = {
            title: i18n.tt(Lang.attr_detail), // 属性详情
            sub: [],
        };
        // 后续得统一换成  AttrDetailTips
        const map: Map<number, number> = this.model.getDrillAllAttrMap(this.model.idsArr);
        map.forEach((v: number, k: number) => {
            const name = UtilAttr.GetAttrName(k);
            attr.sub.push({ name, value: `+${v}` });
        });
        attrData.push(attr);
        WinMgr.I.open(ViewConst.AttrTips, attrData, 1);
    }

    /** 默认要选中哪一个  0 1 2 3 4 5 */
    private _selectWhichOne(): number {
        return 0;
        // const dGArr: DrillGround[] = ModelMgr.I.FamilyModel.getDrillGroundArr();
        // for (let i = 0; i < dGArr.length; i++) {
        //     // 遍历6个是否都能升级
        //     // dGArr[i].Id

        //     // 1 是否达到最大等级
        //     const max = false;
        //     if (!max) {
        //         // 判断每个升级消耗是否足够
        //         // 读取消耗表
        //         // let
        //         // if()
        //     }
        // }
        // return 0;
    }

    /** 标题 */
    private _initTitle(): void {
        const strName = i18n.tt(Lang[`family_drillName_${this._curIdx}`]);
        const dgId: number = this.DGIdArr[this._curIdx];
        const level: number = this.model.getDgLvById(dgId);
        this.LabTitle.string = `[${strName}]${i18n.tt(Lang.family_drillName)} ${level}${i18n.lv}`;
    }

    /** 属性信息 */
    private _initAttr(): void {
        const dgId: number = this.DGIdArr[this._curIdx];
        const level: number = this.model.getDgLvById(dgId);
        const data = this.model.getCfgDrillGroundLevel(dgId);
        const len = data.length;
        const maxLv: number = this.model.getMaxLevelByDgId(dgId);// 是否满级

        // val值
        const mapVal: Map<number, number> = this.model.getDrillAllAttrMap([dgId]);// 当前这个就2条有值
        const attr = [];
        mapVal.forEach((v: number, k: number) => {
            const name = UtilAttr.GetAttrName(k);
            attr.push({ name, value: `+${v}` });
        });

        // 所有的key
        const curDgAllCfgArr: Cfg_DrillGroundLevel[] = this.model.getCfgDrillGroundLevel(dgId);
        const attrMap = this.model.getDrillAllKeyMap(curDgAllCfgArr);
        attrMap.forEach((v: number, k: number) => {
            if (mapVal.get(k)) {
                attrMap.set(k, mapVal.get(k));
            }
        });
        // 删除多余的
        const arr = [...attrMap];
        for (let index = arr.length; index < this.NdAttrContainer.children.length; index++) {
            const element = this.NdAttrContainer.children[index];
            element.destroy();
        }

        const nextLevel = level + 1;
        const leftNum = nextLevel % len;// 余数1 2 3 4 0
        const curLen: number = curDgAllCfgArr.length;

        let addCfg: Cfg_DrillGroundLevel;
        if (leftNum === 0) { // 最后一条的加成值
            addCfg = curDgAllCfgArr[curLen - 1];
        } else {
            for (let i = 0; i < curLen; i++) {
                const curCfg = curDgAllCfgArr[i];
                if (curCfg.Mod === leftNum) {
                    addCfg = curCfg;
                    break;
                }
            }
        }

        const lineNum = Math.ceil(arr.length / 2);
        this.NdAttrLineContainer.removeAllChildren();
        this.NdAttrLineContainer.destroyAllChildren();
        for (let i = 0; i < lineNum; i++) {
            const nd = cc.instantiate(this.linePrefab);
            this.NdAttrLineContainer.addChild(nd);
        }

        for (let i = 0; i < arr.length; i++) {
            // const item: Cfg_DrillGroundLevel = data[i];
            let nd: cc.Node;
            // 已经存在，则只需要刷新
            if (i < this.NdAttrContainer.children.length) {
                nd = this.NdAttrContainer.children[i];
            } else { // 新增
                nd = cc.instantiate(this.prefabAttr);
                this.NdAttrContainer.addChild(nd);
            }

            const kv = arr[i];
            const k = kv[0];
            const v = kv[1];
            const base: IAttrBase = {
                key: EAttrType[k],
                name: UtilAttr.GetAttrName(k),
                attrType: k,
                value: v,
            };

            let add: IAttrBase = {
                key: EAttrType[k],
                name: UtilAttr.GetAttrName(k),
                attrType: k,
                value: 0,
            };

            if (level !== maxLv) { // 未满级
                const baseAdd = this.model.calcDrillAddAttr(addCfg, k);
                if (baseAdd) {
                    add.value = baseAdd;
                } else {
                    add = null;// 没有值 直接空
                }
            } else {
                add = null;// 没有值 直接空
            }

            const param = {
                isShowAdd: !!add,
                isShowAddSign: true,
                signVal: '+',
                baseAddwidth: 256, // 所有总宽度

                NdAttrWidth: 170, // 左边总宽度
                NdAttrSpaceX: 10,
                NdAttrColor: UtilColor.AttrColor,

                NdAddWidth: 82, // 右边总宽度
                NdAddSpaceX: 5,
                // isShowLine: true,

            };
            nd.getComponent(NdAttrBaseAddition).setAttr(base, add, param);
        }
    }

    /** 校场升级成功 */
    private _onFamilyDGLvUp(data: any): void {
        this._initInfoByIdx();
        this._updateRed();
    }

    /** 升级 */
    private _onLvUpClick(): void {
        const dgId: number = this.DGIdArr[this._curIdx];
        const level: number = this.model.getDgLvById(dgId);
        const maxLv: number = this.model.getMaxLevelByDgId(dgId);
        if (level === maxLv) return;
        // 【升级条件】 未满级 判断条件 发送升级
        const cfg: Cfg_DrillGroundLimit = this.model.getCfgDrillGroundLimit(level);// level
        if (dgId === FamilyDGConstId.TONG && cfg) { // 得判断等级
            const needLevel: number = cfg.LevelLimit;
            const idsArr = [FamilyDGConstId.LI, FamilyDGConstId.MING, FamilyDGConstId.ZHI, FamilyDGConstId.YONG, FamilyDGConstId.WU];
            const bol: boolean = this.model.isDrillGroundLimitLvCheck(needLevel, idsArr);
            if (bol) { // 判断所有校场等级是否达到该值;
                this._checkCost();
            } else {
                MsgToastMgr.Show(`${i18n.tt(Lang.family_levelUpLimit)}${needLevel}${i18n.lv}`);// `升级需要所有校场达到${needLevel}级`
            }
        } else {
            this._checkCost();
        }
    }

    private _checkCost(): void {
        const dgId: number = this.DGIdArr[this._curIdx];
        const level: number = this.model.getDgLvById(dgId);
        const costStr: string = this.model.getDrillGroundCostStr(dgId, level);
        const arrStr: any[][] = UtilString.SplitToArray(costStr);

        if (arrStr.length === 1) {
            const itemId = Number(arrStr[0][0]);
            const itemNum = Number(arrStr[0][1]);
            const bagNum = BagMgr.I.getItemNum(itemId);
            if (bagNum >= itemNum) { // 发送协议
                ControllerMgr.I.FamilyController.reqC2SDrillGroundLevelUp(dgId);
            } else {
                WinMgr.I.open(ViewConst.ItemSourceWin, itemId);
            }
        } else {
            const itemId = Number(arrStr[0][0]);
            const itemNum = Number(arrStr[0][1]);
            const bagNum = BagMgr.I.getItemNum(itemId);

            const itemId1 = Number(arrStr[1][0]);
            const itemNum1 = Number(arrStr[1][1]);
            const bagNum1 = BagMgr.I.getItemNum(itemId1);

            if (bagNum1 >= itemNum1 && bagNum >= itemNum) { // 发送协议
                ControllerMgr.I.FamilyController.reqC2SDrillGroundLevelUp(dgId);
            } else if (bagNum < itemNum) {
                WinMgr.I.open(ViewConst.ItemSourceWin, itemId);
            } else {
                WinMgr.I.open(ViewConst.ItemSourceWin, itemId1);
            }
        }
    }

    /** 按钮状态 是否满级 */
    private _initBtnLvUp(): void {
        const dgId: number = this.DGIdArr[this._curIdx];
        const level: number = this.model.getDgLvById(dgId);
        const maxLv: number = this.model.getMaxLevelByDgId(dgId);
        const isMax = level === maxLv; // 判断是否达到最大等级

        // 按钮
        UtilCocos.SetSpriteGray(this.BtnLvUp, isMax, true);
        const strLv: string = isMax ? `${i18n.tt(Lang.com_level_max)}` : `${i18n.tt(Lang.beauty_page_uplevel)}`;// '已满级' : '升级';
        this.LabLv.string = strLv;
        if (isMax) {
            this.LabLevelDesc.node.active = false;
            this.NdCost1.active = false;
            this.NdCost2.active = false;
            return;
        }

        // 判断当前是否是选中统校场
        if (dgId === FamilyDGConstId.TONG) { // 得判断等级
            const cfg: Cfg_DrillGroundLimit = this.model.getCfgDrillGroundLimit(level);// level
            if (cfg) {
                const needLevel = cfg.LevelLimit;
                const idsArr = [FamilyDGConstId.LI, FamilyDGConstId.MING, FamilyDGConstId.ZHI, FamilyDGConstId.YONG, FamilyDGConstId.WU];
                // 其他校场是否都达到需要的等级
                const bol: boolean = this.model.isDrillGroundLimitLvCheck(needLevel, idsArr);

                this.NdCost1.active = bol;
                this.NdCost2.active = bol;
                this.LabLevelDesc.node.active = !bol;
                // 判断所有校场等级是否达到该值;
                if (bol) { // 都达到该值
                    this._initCostInfo();
                } else {
                    const lvMin: number = this.model.getDrillGroundMinLv(idsArr);
                    this.LabLevelDesc.string = `${i18n.tt(Lang.family_otherReach)}(${lvMin}/${needLevel})${i18n.tt(Lang.family_afterUnlock)}`;
                }
            } else {
                this._initCostInfo();
            }
        } else { // 显示消耗
            this._initCostInfo();
        }
    }

    /** 根据有多少个消耗显示多少个 */
    private _initCostInfo(): void {
        this.LabLevelDesc.node.active = false;
        const dgId: number = this.DGIdArr[this._curIdx];
        const level: number = this.model.getDgLvById(dgId);
        const costStr: string = this.model.getDrillGroundCostStr(dgId, level);
        const arrStr: any[][] = UtilString.SplitToArray(costStr);

        if (arrStr.length === 1) {
            // 1个消耗
            this.NdCost1.active = true;
            this.NdCost2.active = false;

            const itemId = Number(arrStr[0][0]);
            const itemNum = Number(arrStr[0][1]);
            const bagNum = BagMgr.I.getItemNum(itemId);

            // // 已经使用数量

            const p = UtilItem.GetItemIconPathByItemId(itemId);
            this.SprCost.pngPath(p);
            this.LabCost.string = `${UtilNum.Convert(bagNum)}/${UtilNum.Convert(Number(itemNum))}`;
            this.LabCost.node.color = UtilColor.costColor(bagNum, Number(itemNum));
        } else {
            // 2个消耗
            this.NdCost1.active = true;
            this.NdCost2.active = true;
            const itemId = Number(arrStr[0][0]);
            const itemNum = Number(arrStr[0][1]);

            const bagNum = BagMgr.I.getItemNum(itemId);
            const p = UtilItem.GetItemIconPathByItemId(itemId);
            this.SprCost.pngPath(p);
            this.LabCost.string = `${UtilNum.Convert(bagNum)}/${UtilNum.Convert(Number(itemNum))}`;
            this.LabCost.node.color = UtilColor.costColor(bagNum, Number(itemNum));

            const itemId1 = Number(arrStr[1][0]);
            const itemNum1 = Number(arrStr[1][1]);

            const bagNum1 = BagMgr.I.getItemNum(itemId1);
            const p1 = UtilItem.GetItemIconPathByItemId(itemId1);
            this.SprCost1.pngPath(p1);
            this.LabCost1.string = `${UtilNum.Convert(bagNum1)}/${UtilNum.Convert(Number(itemNum1))}`;
            this.LabCost1.node.color = UtilColor.costColor(bagNum1, Number(itemNum1));
        }
    }
}
