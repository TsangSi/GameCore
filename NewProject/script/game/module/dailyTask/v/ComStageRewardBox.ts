/*
 * @Author: myl
 * @Date: 2023-02-08 11:23:29
 * @Description:
 */

import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { DynamicImage } from '../../../base/components/DynamicImage';
import { UtilGame } from '../../../base/utils/UtilGame';
import ItemModel from '../../../com/item/ItemModel';

const { ccclass, property } = cc._decorator;

export enum ComStageRewardBoxStatus {
    /** 未达到条件 */
    CannotGet = 3,
    /** 可领取 */
    CanGet = 2,
    /** 已领取 */
    Gated = 1,
}

/** 宝箱入参字段 */
export interface IComStageRewardData {
    /** Id */
    Id: number,
    /** 状态 */
    state: ComStageRewardBoxStatus,
    /** 配置值 */
    cfgValue: number,
    /** 奖励信息 */
    reward: ItemModel[],
    /** 点击回调 */
    cb?: (i: ItemModel[], j: number) => void,
    /** 双倍标记 */
    doubleFlag?: boolean,
}

@ccclass
export default class ComStageRewardBox extends cc.Component {
    @property(DynamicImage)
    private SprBox: DynamicImage = null;

    @property(cc.Label)
    private LabValue: cc.Label = null;

    /** 双倍标识 */
    @property(cc.Node)
    private NdDoubleFlag: cc.Node = null;
    @property(cc.Node)
    private NdGated: cc.Node = null;

    /** 点击回调 */
    private _cb: (index: ItemModel[], state: number) => void = null;
    private _state: number = 0;
    private _Id = 0;
    private _reward: ItemModel[] = [];
    private _action: cc.Tween<cc.Node> = null;
    /**
     * 更新宝箱状态
     * @param index 索引
     * @param state 状态
     * @param reward 奖励信息
     * @param doubleFlag 双倍标识
     */
    public updateState(data: IComStageRewardData): void {
        this._Id = data.Id;
        this._cb = data.cb;
        this._state = data.state;
        this._reward = data.reward;
        this.NdDoubleFlag.active = !!data.doubleFlag
            && (data.state === ComStageRewardBoxStatus.CanGet || data.state === ComStageRewardBoxStatus.CannotGet);
        this.LabValue.string = data.cfgValue.toString();
        this.SprBox.loadImage(`texture/com/img/icon_mrrw_bx_0${data.state}`, 1, true);
        if (data.state === ComStageRewardBoxStatus.CanGet) {
            if (!this._action) {
                this._action = cc.tween(this.SprBox.node).repeatForever(cc.tween().to(0.3, { angle: 5 }).to(0.3, { angle: -5 })).start();
            }
        } else if (this._action) {
            this._action.stop();
            this._action = null;
            this.SprBox.node.angle = 0;
        }
        this.NdGated.active = data.state === ComStageRewardBoxStatus.Gated;
    }

    protected start(): void {
        UtilGame.Click(this.node, () => {
            if (this._cb) this._cb(this._reward, this._state);
        }, this);
    }
}
