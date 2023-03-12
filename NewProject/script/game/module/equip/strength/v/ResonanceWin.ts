import { EventClient } from '../../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { IAttrBase } from '../../../../base/attribute/AttrConst';
import MsgToastMgr from '../../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../../base/utils/UtilGame';
import { NdAttrBaseContainer } from '../../../../com/attr/NdAttrBaseContainer';
import WinBase from '../../../../com/win/WinBase';
import { E } from '../../../../const/EventName';
import ControllerMgr from '../../../../manager/ControllerMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import FamilyModel from '../../../family/FamilyModel';
import { ResonanceType } from '../../EquipConst';
import { StrengthModel } from '../StrengthModel';

const { ccclass, property } = cc._decorator;

@ccclass
export class ResonanceWin extends WinBase {
    @property(cc.Node)
    private LabNd: cc.Node = null;

    @property(cc.Node)
    private NdUpLvBtn: cc.Node = null;

    @property(cc.Label)
    private LabLv: cc.Label = null;

    @property(cc.Label)
    private LabPower: cc.Label = null;

    @property(cc.Label)
    private LabAttrTitle1: cc.Label = null;
    @property(cc.Label)
    private LabAttrActive1: cc.Label = null;
    @property(cc.Label)
    private LabAttrTitle2: cc.Label = null;
    @property(cc.Label)
    private LabAttrActive2: cc.Label = null;

    @property(cc.Node)
    private NdCurr: cc.Node = null;
    @property(cc.Node)
    private NdNext: cc.Node = null;
    @property(cc.Node)
    private NdFull: cc.Node = null;

    @property(cc.Node)
    private SprRed: cc.Node = null;

    @property(cc.Label)// 标题
    private LabTitle: cc.Label = null;

    @property(cc.Node)
    private BtnClose: cc.Node = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.NodeBlack, () => { this.close(); }, this, { scale: 1 });
        UtilGame.Click(this.LabNd, () => { this.close(); }, this);

        UtilGame.Click(this.NdUpLvBtn, this._onBtnLvUpClick, this);// 点击升阶
        UtilGame.Click(this.BtnClose, this.close, this);
        this._updateRed();
        EventClient.I.on(E.Strength.UpRsonateSuccess, this._onUpRsonateSuccess, this);
    }
    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.Strength.UpRsonateSuccess, this._onUpRsonateSuccess, this);
    }

    /** 升阶 */
    private _onBtnLvUpClick(): void {
        const lv = this._getLvByType();// 当前等级
        const MaxLevel: number = this._getMaxLv();

        if (lv === MaxLevel) {
            MsgToastMgr.Show(i18n.tt(Lang.resonance_jie_full));// 已满阶
            return;
        }

        const bol = this._checkConditionByType();
        if (!bol) {
            if (this.uiType === ResonanceType.STRENGTH) { // 强化
                MsgToastMgr.Show(i18n.tt(Lang.build_cannot_lvup));// 强化等级未达到,无法升阶
            } else {
                MsgToastMgr.Show(i18n.tt(Lang.family_cannot_lvup));// 校场等级未达到,无法升阶
            }
            return;
        }

        this._sendReq();
    }

    private _sendReq(): void {
        if (this.uiType === ResonanceType.STRENGTH) { // 强化
            ControllerMgr.I.StrengthController.reqC2SResonateEquipPos();
        } else {
            ControllerMgr.I.FamilyController.reqC2SDrillGroundResonateLevelUp();
        }
    }

    /** 根据类型判断是否可以升阶 */
    private _checkConditionByType(): boolean {
        let bol: boolean = false;
        const lv = this._getLvByType();// 当前等级
        if (this.uiType === ResonanceType.STRENGTH) { // 强化
            bol = ModelMgr.I.StrengthModel.isCanUpResonate(lv + 1);
        } else {
            bol = ModelMgr.I.FamilyModel.checkResonateCondition(lv + 1);// 检测下级是否可以升阶
        }
        return bol;
    }

    /** 更新红点 */
    private _updateRed(): void {
        this.SprRed.active = this._canResonate();
    }

    private _canResonate(): boolean {
        const lv = this._getLvByType();
        const MaxLevel: number = this._getMaxLv();
        if (lv !== MaxLevel) {
            const bol: boolean = this._checkConditionByType();
            return bol;
        }
        return false;
    }

    /** 升阶成功 */
    private _onUpRsonateSuccess(): void {
        this._updateLvInfo();
        this._updateRed();
    }

    private uiType: number = -1;// 1 是强化升阶 2 是世家校场共鸣
    public init(params: any[]): void {
        this.uiType = params[0];
        this._initTitle();// 标题
        this._updateLvInfo();
    }

    // 标题 '强化共鸣' : '校场共鸣'
    private _initTitle(): void {
        this.LabTitle.string = this.uiType === ResonanceType.STRENGTH
            ? i18n.tt(Lang.family_strengthGM)
            : i18n.tt(Lang.family_drillGGM);// '强化共鸣' : '校场共鸣';
    }

    // 根据类型获取当前等级
    private _getLvByType(): number {
        let lv = 0;
        if (this.uiType === ResonanceType.STRENGTH) { // 强化
            lv = ModelMgr.I.StrengthModel.getResonateLev();
        } else {
            lv = ModelMgr.I.FamilyModel.getResonateLev();
        }
        /** 顶部 大师 战力 */
        this.LabLv.string = `${lv}${i18n.jie}`;// 阶
        return lv;
    }
    /** 获取最大等级 */
    private _getMaxLv(): number {
        let maxLv = 0;
        if (this.uiType === ResonanceType.STRENGTH) { // 强化
            maxLv = ModelMgr.I.StrengthModel.getMaxLv();
        } else {
            maxLv = ModelMgr.I.FamilyModel.getCfgMaxLevel();
        }
        return maxLv;
    }

    // 战力 不同的类型 属性id不一样
    private _initFightPower(lv): void {
        if (!lv) {
            this.LabPower.string = '0';
        } else { // 根据等级获取战力
            let attrId: number;
            const model: StrengthModel = ModelMgr.I.StrengthModel;
            if (this.uiType === ResonanceType.STRENGTH) {
                const cfg: Cfg_EquipStrengthS = model.getResonateByLv(lv);
                attrId = cfg.AttrId;
            } else {
                attrId = ModelMgr.I.FamilyModel.getCfgDgAttrIdByLv(lv);
            }
            this.LabPower.string = `${model.getResonateFightPowerByLv(attrId)}`;
        }
    }

    private _updateLvInfo(): void {
        const lv = this._getLvByType();// 当前等级

        this._initFightPower(lv); // 战力

        const MaxLevel: number = this._getMaxLv();
        const isMax: boolean = lv === MaxLevel;

        UtilCocos.SetSpriteGray(this.NdUpLvBtn, isMax, true);

        let lan = i18n.tt(Lang.resonance_buildall);
        let curLv = 0;
        if (this.uiType !== ResonanceType.STRENGTH) { // 强化
            curLv = 5;
            lan = i18n.tt(Lang.family_resonace);
        } else {
            curLv = 10;
        }
        this.LabAttrTitle1.string = `${lan}+${lv * curLv}`;// 全身强化
        this.LabAttrActive1.string = `(${i18n.tt(Lang.com_active)})`;
        this.LabAttrTitle2.string = isMax ? i18n.tt(lan) : `${i18n.tt(lan)}+${(lv + 1) * curLv}`;
        this.LabAttrActive2.string = isMax ? `(${i18n.tt(Lang.resonance_jie_full)})` : `(${i18n.tt(Lang.com_unactive)})`;

        this._initAttr();
    }

    private _initAttr(): void {
        const lv = this._getLvByType();// 当前等级
        const MaxLevel: number = this._getMaxLv();
        /** 属性标题 */
        const isMax: boolean = lv === MaxLevel;
        // 属性列表
        if (lv === 0) {
            const attrCurr: IAttrBase[] = this._getAttr(lv + 1);
            for (let i = 0; i < attrCurr.length; i++) {
                attrCurr[i].value = 0;
            }
            const attrNext: IAttrBase[] = this._getAttr(lv + 1);
            this.NdCurr.getComponent(NdAttrBaseContainer).init(attrCurr, null, { ASize: 20 });
            this.NdNext.getComponent(NdAttrBaseContainer).init(attrNext, null, { ASize: 20 });
            this.NdCurr.active = true;
            this.NdNext.active = true;
            this.NdFull.active = false;
        } else if (isMax) {
            const attrCurr: IAttrBase[] = this._getAttr(lv);
            this.NdCurr.getComponent(NdAttrBaseContainer).init(attrCurr, null, { ASize: 20 });

            this.NdCurr.active = true;
            this.NdNext.active = false;
            this.NdFull.active = true;
        } else {
            const attrCurr: IAttrBase[] = this._getAttr(lv);
            const attrNext: IAttrBase[] = this._getAttr(lv + 1);
            this.NdCurr.getComponent(NdAttrBaseContainer).init(attrCurr, null, { ASize: 20 });
            this.NdNext.getComponent(NdAttrBaseContainer).init(attrNext, null, { ASize: 20 });
            this.NdCurr.active = true;
            this.NdNext.active = true;
            this.NdFull.active = false;
        }
    }

    private _getAttr(lv: number): IAttrBase[] {
        let attr: IAttrBase[];
        if (this.uiType === ResonanceType.STRENGTH) {
            const model: StrengthModel = ModelMgr.I.StrengthModel;
            attr = model.getResonateAttrByLv(lv);
        } else {
            const model: FamilyModel = ModelMgr.I.FamilyModel;
            attr = model.getResonateAttrByLv(lv);
        }
        return attr;
    }
}
