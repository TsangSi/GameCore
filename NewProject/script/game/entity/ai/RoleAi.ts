/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * @Author: kexd
 * @Date: 2022-05-12 14:08:40
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-01-13 20:20:29
 * @FilePath: \SanGuo2.4\assets\script\game\entity\ai\RoleAi.ts
 * @Description: 野外地图挂机AI
 *
 */
import { ACTION_TYPE } from '../../base/anim/AnimCfg';
import MapCfg, { MapType, MEET_MONSTER_DIS } from '../../map/MapCfg';
import { EntityRole } from '../EntityRole';
import { EventClient } from '../../../app/base/event/EventClient';
import { E } from '../../const/EventName';
import MapMgr from '../../map/MapMgr';
import { EntityMonster } from '../EntityMonster';
import BaseCmp from '../../../app/core/mvc/view/BaseCmp';

enum AiState {
    /** 巡逻 */
    Run = 0,

    /** 找到目标 */
    Meet = 1,

    /** 战斗 */
    Fight = 2,
}

const { ccclass, property } = cc._decorator;

@ccclass
export class RoleAi extends BaseCmp {
    /** 遇到的怪物id */
    private _meetMonsterId: number = 0;
    /** 攻击的怪物id */
    private _atkMonsterId: number = 0;
    /** 该组件所在的节点 */
    private _role: EntityRole;
    /** 状态 */
    private _state: AiState = AiState.Run;

    protected start(): void {
        this._meetMonsterId = 0;
        this._atkMonsterId = 0;
        this._state = AiState.Run;
        this._role = this.node as EntityRole;
        this.onE();
    }

    private onE() {
        EventClient.I.on(E.Map.MoveEnd, this.checkYWMonster, this);
    }

    private remE() {
        EventClient.I.off(E.Map.MoveEnd, this.checkYWMonster, this);
    }

    /** 检测野外地图移动过程中是否到达怪物旁边 */
    public checkYWMonster(): number {
        if (MapCfg.I.mapData && MapCfg.I.mapData.MapType === MapType.WBosType) {
            if (this._state === AiState.Run) {
                const meetMonsterId = this.meetMonster();
                // 遇到怪物，开始战斗
                if (meetMonsterId[0] > 0) {
                    // this._meetMonsterId = meetMonsterId;
                    this._state = AiState.Meet;
                    this.atkMeetMonster(meetMonsterId);
                    return meetMonsterId[0];
                }
            }
        }
        return 0;
    }

    /** 遇上怪物的距离判断 */
    private meetMonster(): number[] {
        let meetMonsterId: number = 0;
        let monsterPosX: number = 0;
        let monsterPosY: number = 0;

        const all = MapMgr.I.mapAllMonster;
        for (const key in all) {
            const monster: EntityMonster = all[key];
            const mlx = Math.abs(monster.cellSerial.x - this._role.cellSerial.x);
            const mly = Math.abs(monster.cellSerial.y - this._role.cellSerial.y);
            if (mlx <= MEET_MONSTER_DIS && mly <= MEET_MONSTER_DIS) {
                meetMonsterId = parseInt(key);
                monsterPosX = monster.position.x;
                monsterPosY = monster.position.y;
                break;
            }
        }

        return [meetMonsterId, monsterPosX, monsterPosY];
    }

    /** 进入战斗 */
    private atkMeetMonster(meetMonsterId: number[]) {
        // console.log('*** atkMeetMonster ***', meetMonsterId);

        this._atkMonsterId = meetMonsterId[0];

        this._role.playAction(ACTION_TYPE.ATTACK);

        this.scheduleOnce(() => {
            EventClient.I.emit(E.Map.RemoveVMMonsterToMap, meetMonsterId[0], meetMonsterId[1], meetMonsterId[2]);
            this._role.playAction(ACTION_TYPE.RUN);
            this._state = AiState.Run;
            // console.log('*** 战斗结束，RemoveVMMonsterToMap，移除怪物，继续寻下一个怪 ***', meetMonsterId);
        }, 1);
    }

    private _removeMonster() {
        EventClient.I.emit(E.Map.RemoveVMMonsterToMap, this._atkMonsterId[0], this._atkMonsterId[1], this._atkMonsterId[2]);
        this._role.playAction(ACTION_TYPE.RUN);
        this._state = AiState.Run;
    }

    /**
     * 重置状态
     */
    public resetState(): void {
        this._state = AiState.Run;
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
