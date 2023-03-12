/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-unused-expressions */
/*
 * @Author: kexd
 * @Date: 2022-05-12 17:01:34
 * @FilePath: \SanGuo2.4\assets\script\game\entity\EntityRole.ts
 * @Description: 玩家
 *
 */

import MapCfg from '../map/MapCfg';
import { ENUM_ROAD } from '../base/mapBase/road/MapRoadUtils';
import PathFindingAgent from '../base/mapBase/road/PathFindingAgent';
import RoadNode from '../base/mapBase/road/RoadNode';
import { ACTION_DIRECT, ANIM_TYPE, ACTION_TYPE } from '../base/anim/AnimCfg';
import Entity from './Entity';
import { RoleInfo } from '../module/role/RoleInfo';
import { Distance } from './EntityConst';

export class EntityRole extends Entity {
    protected _moving: boolean = false;
    private _isWinBigAllClose: boolean = true;
    private _moveSpeed: number = 200;
    private _moveAngle: number = 0;
    private _roadNodeArr: RoadNode[] = [];
    private _nodeIndex: number = 0;
    private _currentNode: RoadNode;
    /** 玩家的属性数据 */
    private _roleInfo: RoleInfo = null;
    /** 是否是主玩家 */
    // private _isMainRole: boolean = false;
    /** 当前的寻路是否会开启范围检查 */
    protected _isCheckDistance: boolean = true;

    public constructor(
        resId: number | string,
        resType: ANIM_TYPE,
        dir: ACTION_DIRECT = ACTION_DIRECT.DOWN,
        actType: ACTION_TYPE = ACTION_TYPE.STAND,
        wrapMode: number = cc.WrapMode.Loop,
        isFight: boolean = false,
    ) {
        super(resId, resType, dir, actType, wrapMode, isFight);
        this.name = 'EntityRole';
    }

    // 重写设置位置的接口 待添加

    public get isMoving(): boolean {
        return this._moving;
    }

    public set isWinBigAllClose(isWinBigAllClose: boolean) {
        if (this._isWinBigAllClose === isWinBigAllClose) {
            return;
        }
        if (isWinBigAllClose && MapCfg.I.isYeWai) {
            this.playAction(ACTION_TYPE.RUN);
        }
        this._isWinBigAllClose = isWinBigAllClose;
    }

    public get isWinBigAllClose(): boolean {
        return this._isWinBigAllClose;
    }

    private _direction: number = ACTION_DIRECT.RIGHT_DOWN;
    public get direction(): number {
        return this._direction;
    }
    public set direction(value: number) {
        if (this._direction !== value) {
            this._direction = value;
            this.playAction(this._moving ? ACTION_TYPE.RUN : ACTION_TYPE.STAND, this._direction);
        }
    }

    public set roleInfo(myData: RoleInfo) {
        this._roleInfo = myData;
        // this._isMainRole = myData.userID === RoleMgr.I.info.userID;
    }
    public get roleInfo(): RoleInfo {
        return this._roleInfo;
    }

    public setRoleAlpha(): void {
        const pos = this.position;
        const node: RoadNode = PathFindingAgent.I.getRoadNodeByPixel(pos.x, pos.y);

        if (!node || node === this._currentNode) {
            return;
        }

        this._currentNode = node;

        if (this._currentNode) {
            switch (this._currentNode.value) {
                case ENUM_ROAD.Half:// 如果是透明节点时
                    if (this.alpha !== 0.4) {
                        this.alpha = 0.4;
                    }
                    break;
                case ENUM_ROAD.Trans:// 如果是传送点时
                    this.alpha > 0 && (this.alpha = 0);
                    break;
                default:
                    this.alpha < 1 && (this.alpha = 1);
                    break;
            }
        }
    }

    /**
     * 玩家在移动过程中需再度优化下以下几点：
     * 1. 不允许其他地方直接设置玩家的位置，若要设置，就通过调用resetPos或调用stop再设置
     * 2. mainUpdate里的通过dis > speed * speed来判断是否到达下个节点需加多防护措施防止越走越远的情况
     * 3. 角度及位移计算优化
     */
    public mainUpdate(dt: number): void {
        if (this._moving && this._isWinBigAllClose) {
            const nextNode: RoadNode = this._roadNodeArr[this._nodeIndex];
            if (!nextNode) return;
            let x = this.position.x;
            let y = this.position.y;
            const dx: number = nextNode.px - x;
            const dy: number = nextNode.py - y;
            const dis: number = dx * dx + dy * dy;
            const speed: number = this._moveSpeed * dt; // 玩家每帧的位移，约为6-7像素

            /** 检测是否有异常导致跑出场景外 */
            if (x < 0 || x > MapCfg.I.mapWidth || y < 0 || y > MapCfg.I.mapHeight) {
                const len = this._roadNodeArr.length;
                this.x = this._roadNodeArr[len - 1].px;
                this.y = this._roadNodeArr[len - 1].py;
                this.runToEnd();
            } else if (dis > speed * speed) {
                // 正常行走
                if (this._moveAngle === 0) {
                    this._moveAngle = Math.atan2(dy, dx);
                    this.direction = MapCfg.I.useCellSerial2Direct(x, y, nextNode.px, nextNode.py);
                }
                const xspeed: number = Math.cos(this._moveAngle) * speed;
                const yspeed: number = Math.sin(this._moveAngle) * speed;
                x += xspeed;
                y += yspeed;

                // 范围检测
                if (this._isCheckDistance && this._nodeIndex === this._roadNodeArr.length - 1) {
                    if (dis < Distance) {
                        // console.log('进入范围内，认为达到了目的地');
                        this.runToEnd();
                    }
                }
            } else {
                this._moveAngle = 0;

                if (this._nodeIndex === this._roadNodeArr.length - 1) {
                    x = nextNode.px;
                    y = nextNode.py;
                    this.runToEnd();
                } else {
                    this._walk();
                }
            }
            this.setPosition(x, y);
        }
        this.setRoleAlpha();
    }

    /**
     * 根据路节点路径行走
     * @param roadNodeArr 路点数据
     * @param moveEndCallback 到达目的地后的回调
     * @param isCheckDistance 是否开启范围检测
     */
    protected _moveEndCallback: () => void;
    public walkByRoad(roadNodeArr: RoadNode[], moveEndCallback?: () => void, isCheckDistance: boolean = true): void {
        // console.log('开始走 walkByRoad ---------范围检测', isCheckDistance);
        this._isCheckDistance = isCheckDistance;
        this._moveEndCallback = moveEndCallback;
        this._roadNodeArr = roadNodeArr;
        this._nodeIndex = 0;
        this._moveAngle = 0;
        this._walk();
        this._move();
        // if (this._isMainRole) {
        //     EventClient.I.emit(E.Map.MoveStart);
        // }
    }

    private _walk() {
        if (this._nodeIndex < this._roadNodeArr.length - 1) {
            this._nodeIndex++;
        }
    }

    protected _move(): void {
        // console.log('***** _move');
        this._moving = true;
        this.playAction(ACTION_TYPE.RUN, this._direction);
        // this.sendStartMove();
    }

    public stop(): void {
        // console.log('***** stop');
        this._moving = false;
        this._nodeIndex = 0;
        this._roadNodeArr = [];
        this.playAction(ACTION_TYPE.STAND, this._direction);
    }

    public resetPos(x: number, y: number): void {
        this.stop();
        this.x = x;
        this.y = y;
    }

    /**
     * 走到了目的地
     */
    protected runToEnd(): void {
        // console.log('***** runToEnd');
        this.stop();
        // if (this._isMainRole) {
        //     EventClient.I.emit(E.Map.MoveEnd);
        //     this.sendStopMove();
        //     if (this._moveEndCallback) {
        //         this._moveEndCallback();
        //         // this._moveEndCallback = undefined;
        //     }
        // }
    }

    public cleanRoad(): void {
        this._roadNodeArr = [];
    }

    /**
     * 销毁
     */
    public release(): void {
        super.release();
        this._roadNodeArr = [];
        this._roleInfo = null;
        if (this.isValid) {
            this.destroy();
        }
    }
}
