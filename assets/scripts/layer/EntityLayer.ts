/*
 * @Author: zs
 * @Date: 2023-02-14 18:01:15
 * @Description:
 *
 */
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import {
 Component, EventTouch, Node, v2, Vec2, _decorator,
} from 'cc';
import Monster from '../action/Monster';
import EntityManager from '../map/EntityManager';
import { EntityType } from '../global/GConst';
import { ACTION_DIRECT, ACTION_RES_TYPE, ACTION_STATUS_TYPE } from '../action/ActionConfig';
import { EventM } from '../core/event/EventManager';
import Utils from '../utils/Utils';
import { UtilsNumber } from '../utils/UtilsNumber';
import MsgToast from '../ui/Toast/MsgToast';

const { ccclass } = _decorator;

/**
 * 物体层
 */
@ccclass
export default class EntityLayer extends Component {
    // LIFE-CYCLE CALLBACKS:
    private poss = [
        v2(3030, 2205),
        v2(3530, 2205),
        v2(3030, 2555),
        v2(3030, 1800),
        v2(4000, 2205),
        v2(4500, 2205),
    ];
    // protected _PlayerAvatar: PlayerAvatar = undefined;
    // private get PlayerAvatar() {
    //     if (!this._PlayerAvatar) {
    //         this._PlayerAvatar = EntityManager.I.getPlayerAvatar();
    //     }
    //     return this._PlayerAvatar;
    // }

    protected onLoad(): void {
        // const node = new PlayerAvatar(10001);
        // node.layer = this.node.layer;
        // node.updateAttri('Show_Role_Skin', 3048);
        // node.updateAttri('Show_Horse_Skin', 4046);
        // node.updateAttri('x', 3330);
        // node.updateAttri('y', 2415);
        // this.PlayerAvatar = node;
        // this.node.addChild(node);
        EventM.I.on(EventM.Type.Battle.BattleEnd, this.onBattleEnd, this);
    }

    public getRandomPos(): Vec2 {
        return this.poss[UtilsNumber.RandomNum(0, this.poss.length - 1)];
    }

    protected start(): void {
//
    }

    private monsterId = 100000;
    public getNewMonsterId(): number {
        return ++this.monsterId;
    }

    private onBattleEnd(): void {
        EntityManager.I.destoryEntity(this.monsterId);
        const pos = this.getRandomPos();
        this.addMonster(this.getNewMonsterId(), 1213, pos.x, pos.y);
    }
    private dt = 0;
    protected update(dt: number): void {
        // if (this.PlayerAvatar) {
        //     this.PlayerAvatar.update(dt);
        // }
        // this.dt++;
        // if (this.dt >= 5) {
            const entitys = EntityManager.I.getEntities();
            for (const handle in entitys) {
                entitys[handle].update(dt);
            }
        //     this.dt = 0;
        // }
    }

    public addMonster(handler: number, AnimId: number, x: number, y: number): void {
        // const monster: Monster = EntityManager.I.createEntity(EntityType.Monster);
        // // monster.updateAttri('AnimId', AnimId);
        // monster.updateModeBody(AnimId, ACTION_RES_TYPE.PET);
        // monster.updateAttri('x', x);
        // monster.updateAttri('y', y);
    }
}
