/* eslint-disable no-cond-assign */
/*
 * @Author: hrd
 * @Date: 2022-06-23 15:58:17
 * @FilePath: \SanGuo\assets\script\game\battle\actions\base\UnitMoveAction.ts
 * @Description:
 *
 */
import { ActionReturn } from '../../WarConst';
import { ActionBase } from './ActionBase';

export class UnitMoveAction extends ActionBase {
    private mSpeed: number = 1.2;
    /** 对当前配置 */
    private mCurPos: cc.Vec2;
    /** 目标位置 */
    private mTagPos: cc.Vec2;
    /** 移动时间 */
    private mTime: number;
    /** 示例对象 */
    private mTarget: cc.Node = null;
    /** 移动方向 */
    private mDir_x: number = 0; // 0 x轴负方向 1 x轴正方向
    private mDir_y: number = 0; // 0 y轴负方向 1 y轴正方向

    private _posDelta = cc.v2(0, 0);
    private _startPos = cc.v2(0, 0);
    private _oldPos = cc.v2(0, 0);
    private _endPos = cc.v2(0, 0);
    private _isMoveTo: boolean = false;

    public static Create(target: cc.Node, deltaPos: cc.Vec2, time: number): UnitMoveAction {
        const action = new UnitMoveAction();
        action.mTime = time;
        // action.mTime = 2000;
        action.mTarget = target;
        action._posDelta = deltaPos;
        return action;
    }

    /** 创建 moveBy Action
     * target 目标示例
     * deltaPos 需要移动的位置
     * time 移动时长
     */
    public static CreateMoveBy(target: cc.Node, deltaPos: cc.Vec2, time: number): UnitMoveAction {
        return UnitMoveAction.Create(target, deltaPos, time);
    }

    /** 创建 moveTo action
     * target 目标示例
     * tagPos 需要移动到的位置
     * time 移动时长
    */
    public static CreateMoveTo(target: cc.Node, tagPos: cc.Vec2, time: number): UnitMoveAction {
        const action = UnitMoveAction.Create(target, tagPos, time);
        action._endPos = tagPos;
        action._isMoveTo = true;

        return action;
    }

    public onEnter(): void {
        super.onEnter();
        const locPosX = this.mTarget.position.x;
        const locPosY = this.mTarget.position.y;
        this.mCurPos = cc.v2(locPosX, locPosY);
        if (this._isMoveTo) {
            this._posDelta.x = this._endPos.x - locPosX;
            this._posDelta.y = this._endPos.y - locPosY;
        }

        this._oldPos.x = this.mCurPos.x;
        this._oldPos.y = this.mCurPos.y;

        this._startPos.x = this.mCurPos.x;
        this._startPos.y = this.mCurPos.y;

        const _x = this._startPos.x + this._posDelta.x;
        const _y = this._startPos.y + this._posDelta.y;
        this.mTagPos = cc.v2(_x, _y);

        if (this._startPos.x > this.mTagPos.x) {
            this.mDir_x = 0; // x轴负方向
        }

        if (this._startPos.x <= this.mTagPos.x) {
            this.mDir_x = 1; // x轴正方向
        }

        if (this._startPos.y > this.mTagPos.y) {
            this.mDir_y = 0; // x轴负方向
        }

        if (this._startPos.y <= this.mTagPos.y) {
            this.mDir_y = 1; // y轴正方向
        }

        if (this.mTime) {
            const distance = cc.Vec2.distance(this._startPos, this.mTagPos);
            const sp = Math.abs(distance) / this.mTime;
            const frame_speed = sp; // 主循环每帧移动速度
            this.mSpeed = frame_speed;
        } else {
            const distance = cc.Vec2.distance(this._startPos, this.mTagPos);
            this.mTime = Math.abs(distance) / this.mSpeed;
        }
    }

    public onExit(): void {
        super.onExit();
    }

    public onUpdate(delta: number): ActionReturn {
        if ((this.mTime -= delta) > 0) {
            this._doMoveBy(delta);
            return ActionReturn.CONTINUE;
        }
        this.checkEnd();
        return ActionReturn.NEXT;
    }

    private speedLen: cc.Vec2 = cc.v2(0, 0);
    private _doMoveBy(dt: number) {
        if (this.mTarget && cc.isValid(this.mTarget)) {
            const mPI = Math.atan2(
                this.mTagPos.y - this.mCurPos.y,
                this.mTagPos.x - this.mCurPos.x,
            );

            this.speedLen.x = (this.mSpeed * dt) * Math.cos(mPI);
            if (Math.abs(this.speedLen.x) < 0.001) {
                this.speedLen.x = 0;
            }
            this.speedLen.y = (this.mSpeed * dt) * Math.sin(mPI);
            if (Math.abs(this.speedLen.y) < 0.001) {
                this.speedLen.y = 0;
            }
            this.mCurPos.x += this.speedLen.x;
            this.mCurPos.y += this.speedLen.y;
            this.setPos(this.mCurPos.x, this.mCurPos.y);
        }
    }

    /** 设置目标坐标 */
    private setPos(_x: number, _y: number) {
        if (this.mDir_x === 0) {
            if (this.mTarget.position.x <= this.mTagPos.x) {
                _x = this.mTagPos.x;
            }
        } else if (this.mDir_x === 1) {
            if (this.mTarget.position.x >= this.mTagPos.x) {
                _x = this.mTagPos.x;
            }
        }

        if (this.mDir_y === 0) {
            if (this.mTarget.position.y <= this.mTagPos.y) {
                _y = this.mTagPos.y;
            }
        } else if (this.mDir_y === 1) {
            if (this.mTarget.position.y >= this.mTagPos.y) {
                _y = this.mTagPos.y;
            }
        }

        this.mTarget.setPosition(_x, _y);
    }

    /** 检测是否结束 */
    public checkEnd(): void {
        if (this.mTarget && cc.isValid(this.mTarget)) {
            if (this.mTarget.position.x !== this.mTagPos.x) {
                this.mTarget.position = cc.v3(this.mTagPos.x, this.mTarget.position.y);
            }

            if (this.mTarget.position.y !== this.mTagPos.y) {
                this.mTarget.position = cc.v3(this.mTarget.position.x, this.mTagPos.y);
            }
        }
        this.mWar.setEntitySiblingIndex();
    }
}
