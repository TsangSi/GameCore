/* eslint-disable max-len */
/*
 * @Author: kexd
 * @Date: 2022-08-25 21:23:56
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\plan\com\PlanPos.ts
 * @Description: 位置点控件
 */
import BaseCmp from '../../../../../app/core/mvc/view/BaseCmp';
import { ACTION_DIRECT, ACTION_TYPE, ANIM_TYPE } from '../../../../base/anim/AnimCfg';
import { UtilGame } from '../../../../base/utils/UtilGame';
import EntityCfg from '../../../../entity/EntityCfg';
import EntityUiMgr from '../../../../entity/EntityUiMgr';
import { IPlanMsg, PlanState } from '../PlanConst';
import ControllerMgr from '../../../../manager/ControllerMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { EntityUnitType } from '../../../../entity/EntityConst';
import { RoleMgr } from '../../../role/RoleMgr';
import { FuncId } from '../../../../const/FuncConst';
import MsgToastMgr from '../../../../base/msgtoast/MsgToastMgr';
import { GuideMgr } from '../../../../com/guide/GuideMgr';
import { GuideBtnIds } from '../../../../com/guide/GuideConst';

const { ccclass, property } = cc._decorator;
@ccclass
export default class PlanPos extends BaseCmp {
    @property(cc.Node)
    private NdAnim: cc.Node = null;
    @property(cc.Label)
    private LabMsg: cc.Label = null;
    @property(cc.RichText)
    private RichLock: cc.RichText = null;
    @property(cc.Node)
    private BtnUpFight: cc.Node = null;
    @property(cc.Node)
    private BtnDownFight: cc.Node = null;
    @property(cc.Node)
    private BtnReplace: cc.Node = null;

    private _data: IPlanMsg;

    protected start(): void {
        super.start();

        UtilGame.Click(this.BtnUpFight, () => {
            if (this._data.selectId) {
                ControllerMgr.I.BattleUnitController.reqGeneralLineupPos(this._data.planType, this._data.pos, this._data.selectId);
            } else {
                MsgToastMgr.Show(i18n.tt(Lang.general_plan_battle));
            }
        }, this);

        UtilGame.Click(this.BtnDownFight, () => {
            const str = i18n.tt(Lang.general_plan_down);
            ModelMgr.I.MsgBoxModel.ShowBox(`<color=${UtilColor.NorV}>${str}</c>`, () => {
                ControllerMgr.I.BattleUnitController.reqGeneralLineupPos(this._data.planType, this._data.pos, '');
            });
        }, this);

        UtilGame.Click(this.BtnReplace, () => {
            if (this._data.planType === EntityUnitType.Beauty) {
                ControllerMgr.I.BattleUnitController.reqGeneralLineupPos(this._data.planType, this._data.pos, this._data.selectId);
            } else {
                const posFv = ModelMgr.I.PlanModel.getFightValue(this._data.onlyId, this._data.planType);
                const selectFv = ModelMgr.I.PlanModel.getFightValue(this._data.selectId, this._data.planType);
                if (posFv > selectFv) {
                    const str = i18n.tt(Lang.general_plan_replace);
                    ModelMgr.I.MsgBoxModel.ShowBox(`<color=${UtilColor.NorV}>${str}</c>`, () => {
                        ControllerMgr.I.BattleUnitController.reqGeneralLineupPos(this._data.planType, this._data.pos, this._data.selectId);
                    });
                } else {
                    ControllerMgr.I.BattleUnitController.reqGeneralLineupPos(this._data.planType, this._data.pos, this._data.selectId);
                }
            }
        }, this);
    }

    /**
     * setData
     */
    public setData(data: IPlanMsg): void {
        const isUptAnim = !this._data || data.resId !== this._data.resId;

        // console.log('PlanPos.setData-------------->', isUptAnim, data);

        this._data = data;

        if (this._data.isLock) {
            this.RichLock.string = this._data.lockStr;
        }
        this.LabMsg.string = `${this._data.title}`;
        // 按钮
        this.updateBtnActive();
        // 动画展示
        if (isUptAnim) {
            this.uptAnim();
        }
        if (this.BtnUpFight.active && !GuideMgr.I.getNodeInfoById(GuideBtnIds.GeneralFight)) {
            GuideMgr.I.bindScript(GuideBtnIds.GeneralFight, this.BtnUpFight, this.node.parent.parent);
        }
    }

    /** 是否当前自己的类型（武将、红颜、军师） */
    private isCurFuncId() {
        return this._data.selectFuncId === FuncId[EntityUnitType[this._data.planType]];
    }

    /** 更新当前选中的类型 */
    public updateSelectFuncId(funcId: FuncId): void {
        if (this._data) {
            this._data.selectFuncId = funcId;
        }
        this.updateBtnActive();
    }

    private lastBtnActive;
    private lastBtnState;

    /**
     * 设置按钮显示隐藏
     * @param active 显示或者隐藏
     */
    private updateBtnActive() {
        const active = this.isCurFuncId() && !this._data.isLock;
        const btnState = this.btnState;
        this.BtnUpFight.getChildByName('NdRed').active = this._data.btnRed;
        if (this._data.planType !== EntityUnitType.Beauty) {
            this.BtnReplace.getChildByName('NdRed').active = this._data.btnRed;
        }
        if (this.lastBtnState === btnState && this.lastBtnActive === active) { return; }
        this.BtnUpFight.active = active && btnState === PlanState.UpFight;
        this.BtnDownFight.active = active && btnState === PlanState.DownFight;
        this.BtnReplace.active = active && btnState === PlanState.Replace;
        this.lastBtnActive = active;
        this.lastBtnState = btnState;
    }

    public get btnState(): PlanState {
        let btnState = PlanState.None;
        if (this._data && this._data.planType !== EntityUnitType.Player) {
            btnState = ModelMgr.I.PlanModel.getBtnState(this._data.isLock, this._data.onlyId, this._data.selectId);
            if (this._data.planType === EntityUnitType.Beauty && btnState === PlanState.DownFight) {
                btnState = PlanState.None;
            }
        }
        return btnState;
    }

    /**
     * 更新状态：比如选中不同的武将或改变出阵，这里的位置点的 selectId、onlyId、 btnState、btnRed、resId 会变
     * @param selectId 选中的id
     * @param onlyId 自己的id
     * @param btnState 按钮状态
     * @param btnRed 按钮红点
     * @param resId 资源id
     */
    public uptState(onlyId: string, btnRed: boolean, resId: string): void {
        if (this._data) {
            this._data.onlyId = onlyId;
            this._data.btnRed = btnRed;
            // console.log('-============', onlyId, btnRed, resId);
            // 更新按钮状态
            this.updateBtnActive();

            // 检查展示的出战武将资源id是否有变化
            if (resId !== this._data.resId) {
                this._data.resId = resId;
                this.uptAnim();
            }
        }
    }

    /**
     * 更新选中的id
     * @param selectId 选中的id
     */
    public updateSelectId(selectFuncId: FuncId, selectId: string, selectFv: number): void {
        if (this._data) {
            this._data.selectFuncId = selectFuncId;
            this._data.selectId = selectId;
            this._data.selectFv = selectFv;
            this._data.btnRed = ModelMgr.I.PlanModel.getBtnRed(this.btnState, this._data.fv, selectFv, selectId);
            this.updateBtnActive();
        }
    }

    /** 更新动画 */
    private uptAnim(): void {
        this.NdAnim.destroyAllChildren();
        this.NdAnim.removeAllChildren();
        if (!this._data.isLock) {
            switch (this._data.planType) {
                case EntityUnitType.Player:
                    {
                        const resId = EntityCfg.I.roleInitSkin(RoleMgr.I.d.Sex, false);
                        EntityUiMgr.I.createAnim(this.NdAnim, resId, ANIM_TYPE.ROLE, ACTION_TYPE.STAND, ACTION_DIRECT.LEFT_UP);
                    }
                    break;
                default:
                    if (this._data.resId && this.btnState !== PlanState.UpFight) {
                        EntityUiMgr.I.createAnim(this.NdAnim, this._data.resId, this._data.resType ? this._data.resType : ANIM_TYPE.PET, ACTION_TYPE.STAND, ACTION_DIRECT.LEFT_UP);
                    }
                    break;
            }
        }
    }
}
