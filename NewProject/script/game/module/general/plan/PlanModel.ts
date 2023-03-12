/* eslint-disable max-len */
/*
 * @Author: kexd
 * @Date: 2022-08-15 16:29:57
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\plan\PlanModel.ts
 * @Description:
 */
import BaseModel from '../../../../app/core/mvc/model/BaseModel';
import { Config } from '../../../base/config/Config';
import { GeneralMsg } from '../GeneralConst';
import { RoleMgr } from '../../role/RoleMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import ModelMgr from '../../../manager/ModelMgr';
import { PlanState } from './PlanConst';
import { EntityUnitType } from '../../../entity/EntityConst';
import { UtilBool } from '../../../../app/base/utils/UtilBool';
import { i18n, Lang } from '../../../../i18n/i18n';

const { ccclass } = cc._decorator;
@ccclass('PlanModel')
export class PlanModel extends BaseModel {
    public clearAll(): void {
        //
    }

    // 因信息界面里也需要展示布阵相关的红点情况，红点处理都在GeneralModel里
    public init(): void {
        // 红点检测(统一做在GeneralModel里了)
    }

    public registerRedDotListen(): void {
        //
    }

    /** 已出战武将的总战力 */
    public getLineupTotalFv(): number {
        let fv: number = 0;
        const lineup: LineupUnit[] = ModelMgr.I.BattleUnitModel.getBattleLineup(EntityUnitType.General);
        if (lineup) {
            for (let i = 0; i < lineup.length; i++) {
                const general: GeneralMsg = ModelMgr.I.GeneralModel.generalData(lineup[i].OnlyId);
                if (general) {
                    fv += general.generalData.Fv;
                }
            }
        }
        return fv;
    }

    /** 检查武将布阵位置是否解锁 */
    public checkGeneralPosLock(): string[]
    public checkGeneralPosLock(pos: number): string
    public checkGeneralPosLock(pos?: number): string | string[] {
        const Indexer = Config.Get(Config.Type.Cfg_Config_General);
        if (pos) {
            const condition: string = Indexer.getValueByKey(`Pos${pos - 1}`, 'CfgValue');
            if (condition) {
                return this.getCondition(condition);
            }
            return '';
        } else {
            const pos1: Cfg_Config_General = Indexer.getValueByKey('Pos1');
            const pos2: Cfg_Config_General = Indexer.getValueByKey('Pos2');
            const pos3: Cfg_Config_General = Indexer.getValueByKey('Pos3');
            if (pos1 && pos2 && pos3) {
                return [this.getCondition(pos1.CfgValue), this.getCondition(pos2.CfgValue), this.getCondition(pos3.CfgValue)];
            }
            return ['', '', ''];
        }
    }

    /** 解析出战位置条件 */
    public getCondition(condition: string): string {
        const d = condition.split('|');
        let result: string = '';
        for (let i = 0; i < d.length; i++) {
            const data = d[i].split(':');
            const id: number = +data[0];
            const value: number = +data[1];

            // 只需要满足一个条件即可
            if (id === 1) {
                if (RoleMgr.I.d.Level < value) {
                    result = `<color=#462112>${i18n.tt(Lang.general_plan_role)}</c><color=#d33e2c>${value}${i18n.lv}</c><color=#462112>${i18n.tt(Lang.open_open)}</c>`;
                } else {
                    result = '';
                    break;
                }
            } else if (id === 3) {
                if (RoleMgr.I.d.VipLevel < value) {
                    const vip = UtilGame.GetVipNL(value);
                    result += `<color=#462112>${i18n.tt(Lang.com_or)}</c><color=#d33e2c>${vip.N}${vip.L}</c><color=#462112>${i18n.tt(Lang.open_open)}</c>`;
                } else {
                    result = '';
                    break;
                }
            }
        }
        return result;
    }

    /**
     * 获取位置点的状态
     * 0不显示按钮 1显示出战按钮(未出战) 2显示下阵按钮（已出战,且选中自己）3显示替换按钮（已出战，选中其它武将）
     * @param onlyId 该位置点已上阵的武将id
     * @param selectId 选中的武将id
     */
    public getBtnState(isLock: boolean, onlyId: string, selectId: string): PlanState {
        if (isLock) {
            return PlanState.None;
        } else if (!onlyId) {
            return PlanState.UpFight;
        } else if (onlyId === selectId) {
            return PlanState.DownFight;
        }
        return PlanState.Replace;
    }

    /**
     * 按钮状态为3：替换的时候才需要判断是否有红点
     * @param btnState 上阵位置的按钮状态
     * @param posFv 上阵位置的战力
     * @param selectFv 选中的战力
     * @returns
     */
    public getBtnRed(btnState: PlanState, posFv: number, selectFv: number, selectOnlyId: string): boolean {
        if (!selectFv) { return false; }
        if (btnState === PlanState.Replace) {
            const msg: GeneralMsg = ModelMgr.I.GeneralModel.generalData(selectOnlyId);
            if (msg && msg.battlePos) {
                return false;
            }
            return selectFv > posFv;
        } else if (btnState === PlanState.UpFight) {
            const msg: GeneralMsg = ModelMgr.I.GeneralModel.generalData(selectOnlyId);
            if (msg && msg.battlePos) {
                return false;
            }
            return true;
        }
        return false;
    }

    /** 获取位置点的出战id */
    public getOnlyIdByPos(pos: number, lineup?: LineupUnit[]): string {
        if (UtilBool.isNullOrUndefined(lineup)) {
            lineup = ModelMgr.I.BattleUnitModel.getBattleLineup(EntityUnitType.General);
        }
        if (lineup) {
            for (let i = 0; i < lineup.length; i++) {
                if (lineup[i].Pos === pos) {
                    return lineup[i].OnlyId;
                }
            }
        }
        return '';
    }

    /** 获取3个位置点的出战武将id */
    public getPosOnly(lineup?: LineupUnit[]): string[] {
        if (lineup === null || lineup === undefined) {
            lineup = ModelMgr.I.BattleUnitModel.getBattleLineup(EntityUnitType.General);
        }
        const ids: string[] = [];
        for (let i = 0; i < 3; i++) {
            ids.push(this.getOnlyIdByPos(i + 2));
        }
        return ids;
    }

    /** 是否有布阵红点 */
    public isPlanRed(d: GeneralMsg, onlyIds?: string[], isLocks?: string[]): boolean {
        if (!d || !d.battlePos) {
            if (!onlyIds || onlyIds.length === 0) {
                onlyIds = this.getPosOnly();
            }
            if (!isLocks || isLocks.length === 0) {
                isLocks = this.checkGeneralPosLock();
            }
            for (let i = 0; i < 3; i++) {
                // 按钮状态
                const state = this.getBtnState(!!isLocks[i], onlyIds[i], d.generalData.OnlyId);
                // 按钮红点
                const posFv: number = ModelMgr.I.GeneralModel.generalData(onlyIds[i])?.generalData?.Fv;
                const selectFv: number = d.battlePos ? 0 : d.generalData.Fv;
                const red = this.getBtnRed(state, posFv, selectFv, d.generalData.OnlyId);

                if (red) {
                    return true;
                }
            }
        }

        return false;
    }

    public getFightValue(onlyId: string, type: EntityUnitType): number {
        switch (type) {
            case EntityUnitType.General:
                return ModelMgr.I.GeneralModel.generalData(onlyId).generalData.Fv;
            case EntityUnitType.Beauty:
                return ModelMgr.I.BeautyModel.getBeauty(+onlyId).fightValue;
            default:
                return 0;
        }
    }
}
