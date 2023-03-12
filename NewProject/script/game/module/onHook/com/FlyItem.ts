/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/*
 * @Author: kexd
 * @Date: 2022-09-15 14:33:28
 * @FilePath: \SanGuo\assets\script\game\module\onHook\com\FlyItem.ts
 * @Description:
 *
 */
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { RES_ENUM } from '../../../const/ResPath';
import { EffectMgr } from '../../../manager/EffectMgr';

const { ccclass, property } = cc._decorator;

enum EFlyState {
    /** 爆开 */
    Explode = 1,
    /** 飞到目标点 */
    Fly,
    /** 结束 */
    End,
}

@ccclass
export class FlyItem extends BaseCmp {
    /** 终点 */
    private _end: cc.Vec2;
    private _dir: number = 1;
    private _state: EFlyState = 0;
    private _x: number = 0;
    private _y: number = 0;
    private _xSpeed: number = 0;
    private _ySpeed: number = 0;
    private _xAcc: number = 0;
    private _yAcc: number = 10;
    /** 总的移动时间 */
    private _moveT: number = 0;
    /** 上升的时间 */
    private _upT: number = 0;

    protected start(): void {
        super.start();
    }

    /**
     *
     * @param end 终点位置
     * @param dir 左-1 右1
     */
    public setData(end: cc.Vec2, dir: number): void {
        this._end = end;
        this._dir = dir;

        const itemid = UtilNum.RandomInt(6, 7);

        EffectMgr.I.showAnim(`${RES_ENUM.Onhook}${itemid}`, (node: cc.Node) => {
            if (this.node && this.node.isValid) {
                this.node.addChild(node);
                this.startMove();
            }
        });
    }

    /** 第一步：爆开 */
    private startMove(): void {
        this._state = EFlyState.Explode;

        const pos = this.node.position;
        const addX = UtilNum.RandomInt(10, 200);
        const addy = UtilNum.RandomInt(10, 120);
        const x = pos.x + addX * this._dir;
        const y = pos.y + addy * this._dir;
        this._moveT = 20;
        this._upT = 6;
        this.calc_parabola(new cc.Vec2(pos.x, pos.y), new cc.Vec2(x, y), 20);
    }

    /** 第二步：跳动 */
    private jump(): void {
        const pos = this.node.position;
        const addX = UtilNum.RandomInt(20, 30);
        const addy = 0;
        const x = pos.x + addX * this._dir;
        const y = pos.y + addy * this._dir;
        this._moveT = 8;
        this._upT = 3;
        this.calc_parabola(new cc.Vec2(pos.x, pos.y), new cc.Vec2(x, y), 20);
    }

    private calc_parabola(start_pos: cc.Vec2, end_pos: cc.Vec2, tiaoH: number = 100) {
        this._x = start_pos.x;
        this._y = start_pos.y;
        const x_distance = Math.abs(start_pos.x - end_pos.x);
        const y_distance = Math.abs(start_pos.y - end_pos.y);
        this._xSpeed = x_distance / this._moveT;
        this._xAcc = 0;
        const highest_y = y_distance + tiaoH; // 计算最高点的位置，距离设为2倍高度差，可以调整参数y_distance的系数来改变抛物线最高点，来调整抛物线形状
        this._ySpeed = highest_y / this._upT + this._yAcc * this._upT / 2; // 计算Y轴的初始速度，因为是匀减速，且到达最高点时速度一定为零，所以可以直接计算得出Y轴初始速度
    }

    private move(step: number, dt: number = 1): void {
        this._x -= this._xSpeed * dt * this._dir; // 更新X轴坐标
        this._moveT -= dt; // 每帧更新移动时间
        let my = this._ySpeed * dt - this._yAcc / 2;

        // console.log('this._moveT=', this._moveT, step, 'my=', my, 'this._ySpeed=', this._ySpeed);

        if (this._ySpeed > 0 && my < 0) {
            my = this._ySpeed;
        } else if (this._ySpeed < 0) {
            if (step === 1 && this._moveT < 4) {
                this.jump();
                this._state = 2;
                return;
            }
            my = -this._yAcc;
        }
        this._y += my;
        this.node.setPosition(this._x, this._y);

        this._xSpeed -= this._xAcc * dt;
        this._ySpeed -= this._yAcc;
    }

    /** 第三步：移动到目标点 */
    private moveToEnd(): void {
        const t1 = cc.tween(this.node).to(0.8, { position: new cc.Vec3(this._end.x, this._end.y, 0) }, { easing: 'quintIn' });
        const t2 = cc.tween(this.node).to(0.8, { scale: 0.5 }, { easing: 'quintIn' });
        const t3 = cc.tween(this.node).call(() => {
            this.release();
        });
        const parallel = cc.tween(this.node).parallel(t1, t2);
        cc.tween(this.node).sequence(parallel, t3).start();
    }

    public update(dt: number): void {
        const dtime = 1;
        if (this._state === 1) {
            if (this._moveT > 0) {
                this.move(1, dtime);
            } else {
                this._state = 2;
            }
        } else if (this._state === 2) {
            if (this._moveT > 0) {
                this.move(2, dtime);
            } else {
                this._state = 3;
            }
        } else if (this._state === 3) {
            this._state = 4;
            this.moveToEnd();
        }
    }

    private release() {
        if (this.node && this.node.isValid) {
            this.node.destroy();
        }
    }

    protected close(): void {
        super.close();
    }

    public onDestroy(): void {
        super.onDestroy();
    }
}
