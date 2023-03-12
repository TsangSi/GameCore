/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: lijun
 * @Date: 2023-02-20 16:26:38
 * @Description:
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import { ANIM_TYPE } from '../../../base/anim/AnimCfg';
import SpineBase from '../../../base/spine/SpineBase';
import { E } from '../../../const/EventName';
import ModelMgr from '../../../manager/ModelMgr';
import {
    HuarongdaoGenType, HuarongdaoMatchState, HuarongdaoRoleState, IHuarongdaoBulletChat,
} from '../HuarongdaoConst';
import HuarongdaoBubble from './HuarongdaoBubble';
import MatchRoleInfo from './MatchRoleInfo';

const { ccclass, property } = cc._decorator;

@ccclass
export default class RoleItem extends cc.Component {
    @property(cc.Prefab)
    private PrefabMatchRoleInfo: cc.Prefab = null;
    @property(cc.Prefab)
    private PrefabBubble: cc.Prefab = null;

    private spine: SpineBase = null;
    // @property(sp.Skeleton)
    // private spine: sp.Skeleton = null;

    private cfg_Gen: Cfg_HuarongdaoGen = null;
    private id: number = 0;
    private conversion: number = 0;// 米对应像素
    private startPos: number = 100;// 起始100像素
    private startY: number = 0;// 起始y坐标
    private mainRoleStartPos: number = 0;// 曹操起始再靠前x米

    private roleInfo: MatchRoleInfo = null;
    private bubble: HuarongdaoBubble = null;

    public position: cc.Vec3 = null;

    private state: number = -1;
    private _secondListIndex: number = -1;// 距离列表索引
    private _eventListIndex: number = 0;// 事件列表索引

    private _initState: boolean = false;

    private _entryInfo: HuarongEntryInfo = null;
    private nowTime: number = 0;
    private _bubbleTime1: number = 0;// 支持气泡时间
    private _bubbleTime2: number = 0;// 追逐气泡时间
    private _bubbleRadio1: number = 0;// 支持气泡比率
    private _bubbleRadio2: number = 0;// 支持气泡比率
    private distance: number = 0;// 当前跑多少米
    private _baseSpeed: number = 0;// 基础速度
    private _speed: number = 0;// 实际速度
    private _effectTime: number = 0;// 效果持续时间
    private _effectState: number = -1;// spine效果
    private _scaleTime: number = 1;// spine速度
    private _runBaseScaleTime: number = 1;// 跑动时基础spine速度

    private _ccDistance: number = 0;// 曹操的终点距离
    private _ccPosY: number = 0;// 曹操纵坐标 结束时移到曹操身后抓曹操用
    private isCatchState: boolean = false;// 抓取曹操中

    protected start(): void {
        // this.startY = this.node.y;
    }
    /**
     *
     * @param id
     * @param speed 速度
     * @param conversion 米像素比
     * @param mainRoleStartPos 曹操起始距离 米
     * @param ccDistance 曹操的终点距离 米
     * @param ccPosY 曹操的纵坐标
     */
    public setRoleId(id: number, speed: number, conversion: number, mainRoleStartPos: number, ccDistance: number = 0, ccPosY: number = 0): void {
        if (!id) {
            this.node.active = false;
        } else {
            this.node.active = true;
            this._baseSpeed = this._speed = speed;
            this.conversion = conversion;
            this.distance = this.mainRoleStartPos = mainRoleStartPos;
            this._ccDistance = ccDistance;
            this._ccPosY = ccPosY;
            if (this.id !== id) {
                this.clearData();
                this.id = id;
                this.updateModel();
            }
            this.loadNormal();
            this.showInfo();
            // this.upadteSupportState();
        }
    }

    /** 清除数据 */
    public clearData(): void {
        this.id = 0;
        this.distance = 0;
        this.isCatchState = false;
        this._initState = false;
        this.state = -1;
        this._entryInfo = null;
        this._secondListIndex = -1;
        this.nowTime = 0;
        this._eventListIndex = 0;
        if (this.startY) { this.node.y = this.startY; }
        if (this.spine) {
            this.spine.destroy();
            this.spine = null;
        }
    }
    /** 配置表常量加载 */
    private loadNormal(): void {
        const costCfg = ModelMgr.I.HuarongdaoModel.getNormalByKey('HuarongdaoGenRun');
        this._runBaseScaleTime = Number(costCfg.CfgValue);
        const cfg_bubble1 = ModelMgr.I.HuarongdaoModel.getNormalByKey('HuarongdaoBubble1');
        const cfg_bubble2 = ModelMgr.I.HuarongdaoModel.getNormalByKey('HuarongdaoBubble2');
        const cfg_array1 = UtilString.SplitToArray(cfg_bubble1.CfgValue);
        const cfg_array2 = UtilString.SplitToArray(cfg_bubble2.CfgValue);
        this._bubbleTime1 = Number(cfg_array1[0][0]);
        this._bubbleTime2 = Number(cfg_array2[0][0]);
        this._bubbleRadio1 = Number(cfg_array1[0][1]);
        this._bubbleRadio2 = Number(cfg_array2[0][1]);
    }

    /** 显示名字等信息 */
    public showInfo(): void {
        if (!this.roleInfo) {
            const nd: cc.Node = cc.instantiate(this.PrefabMatchRoleInfo);
            this.node.addChild(nd);
            this.roleInfo = nd.getComponent(MatchRoleInfo);
        }

        this.roleInfo.setRoleId(this.id);
        this.roleInfo.node.setSiblingIndex(cc.macro.MAX_ZINDEX);
    }

    /** 加载模型 */
    private updateModel(): void {
        this.cfg_Gen = ModelMgr.I.HuarongdaoModel.getGenValueByKey(this.id);
        const spineId = 10001;
        const sp = new SpineBase({
            path: SpineBase.getSpineResPath(spineId, ANIM_TYPE.ROLE, 4),
            actionName: '',
            loop: true,
            callback: () => {
                this._initState = true;
            },
        });
        sp.setScale(-0.8, 0.8);
        this.node.addChild(sp);
        this.spine = sp;
    }

    /** 更新支持状态 */
    public upadteSupportState(): void {
        // eslint-disable-next-line no-unused-expressions
        this.roleInfo && this.roleInfo.showSupportState();
    }

    public mainUpdate(dt: number): void {
        // this.triggerBubbleSche(dt);
        if (!this._initState || !this.node.active || this.isCatchState) {
            return;
        }
        if (ModelMgr.I.HuarongdaoModel.getMatchState() < HuarongdaoMatchState.match) {
            this._secondListIndex = -1;
            this.setState(HuarongdaoRoleState.stand);
            return;
        }

        this.move(dt);
    }

    /** 移动 */
    private move(dt: number): void {
        // 效果持续时间,时间到移除效果
        if (this._effectTime > 0) {
            this._effectTime -= dt;
            if (this._effectTime <= 0) {
                this.removeEffect();
            }
        } else if (this._effectState >= 0) { // 效果时间到但效果状态未重置，继续移除效果
            this.removeEffect();
        }
        if (this._secondListIndex < 0) { // 默认值为-1,根据当前时间检测运动到哪一个距离
            this.checkCurrentDistanceIndex();
        } else if (this._entryInfo && this._secondListIndex < this._entryInfo.SecondList.length) { // 跑步中
            this.nowTime += dt;
            this.roleMove(dt, this._secondListIndex);
            const targetTime = this._entryInfo.SecondList[this._secondListIndex].Times;
            if (this.nowTime >= targetTime) { // 跑完当前秒
                this.checkTriggerEvent(targetTime);// 检测当前秒是否触发事件
                const distance = this._entryInfo.SecondList[this._secondListIndex].Distance;
                if (this._secondListIndex === this._entryInfo.SecondList.length - 1) {
                    this.distance = distance / 10;// 跑完后可能有些许距离误差，进行校准
                }

                // 测试打印
                // if (this.id === 1) {
                //     cc.log(`${distance / 10 * this.conversion + this.startPos} ${this.node.x} ${distance / 10} ${this.distance}`);
                // }
                this._secondListIndex++;
            }
        } else if (this._entryInfo && this._entryInfo.IsWin) {
            this.setState(HuarongdaoRoleState.stand);// 胜者，播放胜利动作（没有就站着）
        } else {
            this.setState(HuarongdaoRoleState.stand);// 败者，站着
        }
    }

    /** 角色移动 */
    private roleMove(dt: number, secondListIndex: number): void {
        if (!this._entryInfo.SecondList[secondListIndex]) {
            return;
        }
        const distance = this._entryInfo.SecondList[secondListIndex].Distance;
        /** 根据时间比换算出坐标，效果差，不适合 */
        // const startTime = this._entryInfo.StartTimes;
        // this.distance = (this.nowTime - startTime) / (targetTime - startTime) * distance;
        // const targetX = this.distance * this.conversion;
        // this.node.x = targetX + this.startPos;

        /** 归一化向量 */
        const targetPos: cc.Vec2 = cc.v2(distance / 10, 0);
        const curPos: cc.Vec2 = cc.v2(this.distance, 0);
        const normalizeVec: cc.Vec2 = targetPos.subtract(curPos).normalize();
        this.distance += normalizeVec.x * this._speed * dt;

        // if (this.distance > distance / 10) {
        //     cc.log(`${this.id}  1111`);
        // }
        this.node.x = this.distance * this.conversion + this.startPos;

        if (this._effectState >= 0) {
            this.setState(this._effectState);
        } else {
            this.setState(HuarongdaoRoleState.run);
        }
    }

    /** 检索当前时间跑到哪个距离列表 */
    private checkCurrentDistanceIndex(): void {
        if (!this._entryInfo) {
            this._entryInfo = ModelMgr.I.HuarongdaoModel.getEntryInfoById(this.id);
        }
        if (!this._entryInfo) { return; }
        if (!this.nowTime) {
            this.nowTime = UtilTime.NowSec() - ModelMgr.I.HuarongdaoModel.getCountDownTime();
        }
        let current = -1;
        if (this._entryInfo) {
            for (let i = 0; i < this._entryInfo.SecondList.length; i++) {
                if (this.nowTime === this._entryInfo.SecondList[i].Times) {
                    current = i;
                } else if (this.nowTime < this._entryInfo.SecondList[i].Times) {
                    this._secondListIndex = i;
                    break;
                }
            }
        }

        if (this._secondListIndex < 0) {
            this._secondListIndex = this._entryInfo.SecondList.length;
            this.moveToPos(this._entryInfo.SecondList.length - 1);
        } else if (current >= 0) {
            this.moveToPos(current);
        }
    }

    // 移动到指定索引位置
    private moveToPos(index: number): void {
        if (this._entryInfo.SecondList.length > 0 && this._entryInfo.SecondList[index]) {
            this.distance = this._entryInfo.SecondList[index].Distance / 10;// 开始是米，改成了分米

            if (this._secondListIndex >= this._entryInfo.SecondList.length && this._entryInfo.IsWin
                && ModelMgr.I.HuarongdaoModel.getGenType(this.id) === HuarongdaoGenType.other) {
                const targetX = this._ccDistance / 10 * this.conversion;
                this.node.x = targetX + this.startPos - 80;
                this.savePosY();
                this.node.y = this._ccPosY;
                this.isCatchState = true;
                this.setState(HuarongdaoRoleState.stand);
            } else {
                const targetX = this.distance * this.conversion;
                this.node.x = targetX + this.startPos;
            }
        }
    }

    /** 保存一下y坐标 */
    private savePosY(): void {
        if (!this.startY) {
            this.startY = this.node.y;
        }
    }

    /** 检查是否触发事件 */
    private checkTriggerEvent(time: number): void {
        for (let i = this._eventListIndex; i < this._entryInfo.EventList.length; i++) {
            if (time >= this._entryInfo.EventList[i].StartTimes && time < this._entryInfo.EventList[i].EndTimes) { // 检测到事件
                this._eventListIndex = i;
                this.triggerEvent(this._entryInfo.EventList[i].EventId, this._entryInfo.EventList[i].EndTimes - time);
                break;
            } else if (time >= this._entryInfo.EventList[i].EndTimes) { // 已过期事件
                this._eventListIndex = i;
            }
        }
    }

    /** 触发事件 */
    private triggerEvent(id: number, effectTime: number): void {
        // 解析效果
        const cfg = ModelMgr.I.HuarongdaoModel.getBulletChatByKey(id);
        let effect = cfg.Effect / 10000;
        if (effect < -1) {
            effect = -1;
        }
        this._effectTime = effectTime;
        this.showEffect(effect);
        if (effectTime === cfg.Time) {
            // 发送弹幕事件
            const eventData: Array<IHuarongdaoBulletChat> = [
                {
                    chatId: id,
                    genId: this.id,
                },
            ];
            EventClient.I.emit(E.Huarongdao.BulletChat, eventData);
        }
    }

    /** 事件效果 */
    private showEffect(effect: number): void {
        if (effect >= 0.5) {
            this._scaleTime = 2;
        } else if (effect >= 0.2) {
            this._scaleTime = 1.5;
        } else if (effect <= -0.5) {
            this._scaleTime = 0.6;
        } else if (effect <= -0.2) {
            this._scaleTime = 0.8;
        } else {
            this._scaleTime = 1;
        }
        this._speed = this._baseSpeed * (1 + effect);
        this.setTimeScale();
        // this.spine.timeScale = this._scaleTime;
        this._effectState = this._speed > 0 ? HuarongdaoRoleState.run : HuarongdaoRoleState.yun;
    }

    /** 移除效果 */
    private removeEffect(): void {
        this._speed = this._baseSpeed;
        this._scaleTime = 1;
        this.setTimeScale();
        // this.spine.timeScale = this._scaleTime;
        this._effectState = -1;
    }

    /** 设置动作 */
    private setState(state: HuarongdaoRoleState) {
        if (this.state === state || !this.spine) {
            return;
        }

        switch (state) {
            case HuarongdaoRoleState.stand:
                this.spine.playAction('stand', true);
                // this.spine.animation = 'stand';
                break;
            case HuarongdaoRoleState.run:
                this.spine.playAction('run', true);
                // this.spine.animation = 'run';
                break;
            case HuarongdaoRoleState.yun:
                this.spine.playAction('stand', true);
                // this.spine.animation = 'stand';
                break;
            case HuarongdaoRoleState.win:
                this.spine.playAction('stand', true);
                // this.spine.animation = 'win';
                break;
            default:
                break;
        }

        this.state = state;
        this.setTimeScale();
    }
    /** 设置播放速率 */
    private setTimeScale(): void {
        if (!this.spine) { return; }
        if (this.state === HuarongdaoRoleState.run) {
            this.spine.setTimeScale(this._scaleTime * this._runBaseScaleTime);
        } else {
            this.spine.setTimeScale(1);
        }
    }

    // 获取当前实际跑了多少米
    public getCurrentDistance(): [number, number, string, number, number] {
        if (this.id) {
            const distance = Math.floor(this.distance * 10) / 10;
            return [this.id, distance, this.cfg_Gen.Name, this.cfg_Gen.OddsTime, this._entryInfo ? this._entryInfo.IsWin : 0];
        } else { return [0, 0, '', 0, 0]; }
    }

    private _triggerBubble = 0;
    /** 触发气泡计时（弃用，需求修改，由每人自己独自触发，修改为统一随机一人触发，参考HarongdaoMapView里的triggerBubbleSche） */
    private triggerBubbleSche(dt: number): void {
        if (ModelMgr.I.HuarongdaoModel.getMatchState() !== HuarongdaoMatchState.match
            && ModelMgr.I.HuarongdaoModel.getMatchState() !== HuarongdaoMatchState.support) { return; }
        this._triggerBubble += dt;
        let radio = 0;
        if (ModelMgr.I.HuarongdaoModel.getMatchState() === HuarongdaoMatchState.match && this._triggerBubble >= this._bubbleTime2) {
            radio = this._bubbleRadio2;
        } else if (ModelMgr.I.HuarongdaoModel.getMatchState() === HuarongdaoMatchState.support && this._triggerBubble >= this._bubbleTime1) {
            radio = this._bubbleRadio1;
        }
        if (radio > 0) {
            const random = UtilNum.RandomInt(1, 10);
            if (random <= radio / 1000) {
                this.triggerBubble();
            }
            this._triggerBubble = 0;
        }
    }

    /** 触发气泡 */
    public triggerBubble(): void {
        const bubbleId = ModelMgr.I.HuarongdaoModel.getRandomBubbleId(this.id);
        if (!this.bubble) {
            const nd: cc.Node = cc.instantiate(this.PrefabBubble);
            this.node.addChild(nd);
            nd.setSiblingIndex(cc.macro.MAX_ZINDEX);
            this.bubble = nd.getComponent(HuarongdaoBubble);
        }

        this.bubble.setBubbleId(bubbleId);
    }

    /** 抓曹操 */
    public catchCaocaoAnim(): void {
        if (this._entryInfo.IsWin) {
            this.scheduleOnce(() => {
                const targetX = this._ccDistance / 10 * this.conversion;
                this.isCatchState = true;
                this.setState(HuarongdaoRoleState.run);
                this.savePosY();
                cc.tween(this.node)
                    .to(0.4, { x: targetX + this.startPos - 80, y: this._ccPosY })
                    .call(() => {
                        this.setState(HuarongdaoRoleState.win);
                        this.distance = this._ccDistance / 10;
                    })
                    .start();
            }, 0.5);
        }
    }

    protected onDisable(): void {
        this.clearData();
    }

    // update (dt) {}
}
