/* eslint-disable no-lonely-if */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable max-len */
/*
 * @Author: kexd
 * @Date: 2022-08-15 16:38:10
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\battleUnit\BattleUnitModel.ts
 * @Description: 作战单位
 *
 */

import { EventClient } from '../../../app/base/event/EventClient';
import { UtilString } from '../../../app/base/utils/UtilString';
import BaseModel from '../../../app/core/mvc/model/BaseModel';
import { i18n, Lang } from '../../../i18n/i18n';
import { Config } from '../../base/config/Config';
import MsgToastMgr from '../../base/msgtoast/MsgToastMgr';
import UtilItem from '../../base/utils/UtilItem';
import { E } from '../../const/EventName';
import { EntityUnitType } from '../../entity/EntityConst';
import ModelMgr from '../../manager/ModelMgr';
import { GeneralMsg } from '../general/GeneralConst';

const { ccclass } = cc._decorator;
@ccclass('BattleUnitModel')
export class BattleUnitModel extends BaseModel {
    /** 出战单位 */
    private _battleLineup: { [Type: number]: LineupUnit[] } = cc.js.createMap(true);

    public getAllBattleLineup(): { [Type: number]: LineupUnit[] } {
        return this._battleLineup;
    }

    /** 根据类型获取出战对象 */
    public getBattleLineup(type: EntityUnitType): LineupUnit[] {
        return this._battleLineup[type] || [];
    }

    public getBattleLineupPos(type: EntityUnitType, onlyId: string): number {
        const list = this._battleLineup[type];
        if (list && list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                if (list[i].OnlyId === onlyId) {
                    return list[i].Pos;
                }
            }
        }
        return 0;
    }

    public getBattleLineupRes(type: EntityUnitType, pos: number): string {
        const list = this._battleLineup[type];
        if (list && list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                if (list[i].Pos === pos) {
                    switch (type) {
                        case EntityUnitType.General:
                            return ModelMgr.I.GeneralModel.getGeneralRes(list[i].OnlyId);
                        default:
                            break;
                    }
                }
            }
        }
        return '';
    }

    public clearAll(): void {
        //
    }

    /** 登录就返回的出战单位 */
    public setBattleLineup(d: S2CLineupInfo): void {
        let hasGeneral: boolean = false;
        for (let i = 0; i < d.Lineup.length; i++) {
            if (d.Lineup[i] && d.Lineup[i].OnlyId) {
                if (!this._battleLineup[d.Lineup[i].Type]) {
                    this._battleLineup[d.Lineup[i].Type] = [];
                }
                this._battleLineup[d.Lineup[i].Type].push(d.Lineup[i]);
                if (d.Lineup[i].Type === EntityUnitType.General) {
                    hasGeneral = true;
                }
            }
        }
        // 更新武将系统里的出战
        if (hasGeneral) {
            ModelMgr.I.GeneralModel.uptGeneralLineup();
        }
    }

    /**
     * 获取某个出战类型是否已出战，如果有传唯一id，那么就判断该单位是否已出战
     * @param type 出战类型
     * @param onlyId 唯一id
     * @returns
     */
    public isLineupByOnlyId(type: EntityUnitType, onlyId?: string): boolean {
        if (!this._battleLineup[type]) {
            return false;
        }
        if (onlyId) {
            return this._battleLineup[type].findIndex((v) => v.OnlyId === onlyId) >= 0;
        } else {
            return this._battleLineup[type].length > 0;
        }
    }

    /** 设置出战 */
    public changeLineup(d: S2CChangeLineup): void {
        const data: LineupUnit = {
            Type: d.Type,
            Pos: d.Pos,
            OnlyId: d.OnlyId,
        };

        if (!this._battleLineup[d.Type]) {
            this._battleLineup[d.Type] = [];
        }
        // 1.出战的作战单位是否已存在，不存在就加入
        const index = this._battleLineup[d.Type].findIndex((v) => v.Pos === d.Pos);
        if (index < 0) {
            this._battleLineup[d.Type].push(data);
        } else {
            // 已存在就刷新, 若没有OnlyId，就移除掉
            if (!d.OnlyId) {
                this._battleLineup[d.Type].splice(index, 1);
            } else {
                this._battleLineup[d.Type][index] = data;
            }
        }

        // 3.更新武将系统里的出战
        if (d.Type === EntityUnitType.General) {
            ModelMgr.I.GeneralModel.uptGeneralLineup();
        } else if (d.Type === EntityUnitType.Beauty) {
            const cfg: Cfg_Beauty = ModelMgr.I.BeautyModel.cfg.getValueByKey(+d.OnlyId);
            if (cfg) {
                const color = UtilItem.GetItemQualityColor(cfg.Quality);
                MsgToastMgr.Show(UtilString.FormatArgs(i18n.tt(Lang.beauty_plan_up_success), color, cfg.Name));
            }
        }

        // console.log('changeLineup-------->', d, this._battleLineup);

        EventClient.I.emit(E.BattleUnit.UptUnit, d.Pos, d.OnlyId, d.Type);
    }
}
