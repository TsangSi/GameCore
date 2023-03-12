/*
 * @Author: kexd
 * @Date: 2022-11-07 11:06:51
 * @FilePath: \SanGuo2.4\assets\script\game\entity\MainRole.ts
 * @Description: 主玩家
 *
 */

import { EventClient } from '../../app/base/event/EventClient';
import { ANIM_TYPE, ACTION_DIRECT, ACTION_TYPE } from '../base/anim/AnimCfg';
import RoadNode from '../base/mapBase/road/RoadNode';
import { E } from '../const/EventName';
import NetMgr from '../manager/NetMgr';
import MapCfg from '../map/MapCfg';
import { RoleAi } from './ai/RoleAi';
import { EntityRole } from './EntityRole';

export class MainRole extends EntityRole {
    private _stopCellX: number = 0;
    private _stopCellY: number = 0;

    public constructor(
        resId: number | string,
        resType: ANIM_TYPE,
        dir: ACTION_DIRECT = ACTION_DIRECT.DOWN,
        actType: ACTION_TYPE = ACTION_TYPE.STAND,
        wrapMode: number = cc.WrapMode.Loop,
        isFight: boolean = false,
    ) {
        super(resId, resType, dir, actType, wrapMode, isFight);
        this.name = 'MainRole';
        this.addComponent(RoleAi);
    }

    public get stopCellX(): number {
        return this._stopCellX;
    }

    public get stopCellY(): number {
        return this._stopCellY;
    }

    /**
     * 根据路节点路径行走
     * @param roadNodeArr 路点数据
     * @param moveEndCallback 到达目的地后的回调
     * @param isCheckDistance 是否开启范围检测
     */
    public walkByRoad(roadNodeArr: RoadNode[], moveEndCallback?: () => void, isCheckDistance: boolean = true): void {
        super.walkByRoad(roadNodeArr, moveEndCallback, isCheckDistance);
        EventClient.I.emit(E.Map.MoveStart);
    }

    protected _move(): void {
        super._move();
        this.sendStartMove();
    }

    /**
     * 走到了目的地
     */
    protected runToEnd(): void {
        super.runToEnd();
        EventClient.I.emit(E.Map.MoveEnd);
        this.sendStopMove();
        if (this._moveEndCallback) {
            this._moveEndCallback();
        }
    }

    /**
     * sendStartMove
     */
    private sendStartMove(): void {
        const d = new C2SStartMove();
        d.Source = new Point();
        d.Source.X = (this.position.x / MapCfg.I.cellWidth) ^ 0;
        d.Source.Y = (this.position.y / MapCfg.I.cellHeight) ^ 0;
        d.Target = new Point();
        d.Target.X = (MapCfg.I.targetPos.x / MapCfg.I.cellWidth) ^ 0;
        d.Target.Y = (MapCfg.I.targetPos.y / MapCfg.I.cellHeight) ^ 0;
        d.Param = this._isCheckDistance ? 1 : 0;
        NetMgr.I.sendMessage(ProtoId.C2SStartMove_ID, d);

        // console.log(RoleMgr.I.info.userID, '=====> sendStartMove,起点：', d.Source.X, d.Source.Y, '终点：', d.Target.X, d.Target.Y, '范围检测', d.Param);
    }

    /**
     * sendStopMove
     */
    private sendStopMove(): void {
        const d = new C2SStopMove();
        d.P = new Point();
        d.P.X = (this.position.x / MapCfg.I.cellWidth) ^ 0;
        d.P.Y = (this.position.y / MapCfg.I.cellHeight) ^ 0;
        this._stopCellX = d.P.X;
        this._stopCellY = d.P.Y;
        NetMgr.I.sendMessage(ProtoId.C2SStopMove_ID, d);

        // console.log('=====> sendStopMove', d.P.X, d.P.Y);
    }
}
