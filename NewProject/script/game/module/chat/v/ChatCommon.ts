/*
 * @Author: lijun
 * @Date: 2023-02-23 11:13:47
 * @Description:
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { EventClient } from '../../../../app/base/event/EventClient';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { WinCmp } from '../../../com/win/WinCmp';
import { E } from '../../../const/EventName';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { ViewConst } from '../../../const/ViewConst';
import ModelMgr from '../../../manager/ModelMgr';
import { IChatCommonData } from '../ChatConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends WinCmp {
    @property(cc.Node)
    private NdActive: cc.Node = null;

    @property(cc.Node)
    private NdBg: cc.Node = null;

    @property(cc.Label)
    private LblNum: cc.Label = null;

    private moveState = false;
    private _data: IChatCommonData = null;
    private startPos: cc.Vec2 = null;

    private _chatWinState = false;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    protected start(): void {
        super.start();

        this.node.on('touchstart', (event) => {
            this.touchStartHandler(event);
        });

        this.node.on('touchmove', (event) => {
            this.touchMoveHandler(event);
        });

        this.node.on('touchend', (event) => {
            this.touchEndHandler(event);
        });

        this.node.on('touchcancel', (event) => {
            this.touchCancelHandler();
        });

        EventClient.I.on(E.Chat.OpenChatWinState, this.changeWinState, this);
        EventClient.I.on(E.Chat.RedUpdate, this.redUpdate, this);
        WinMgr.I.close(ViewConst.ChatWin);
    }

    private changeWinState(state: boolean): void {
        this._chatWinState = state;
        this.NdActive.active = !state;
        if (!state) {
            WinMgr.I.close(ViewConst.ChatWin);
        }
        this.redUpdate();
    }

    public setData(data: IChatCommonData): void {
        this._data = data;
        const record: IChatCommonData = ModelMgr.I.ChatModel.getComponentRecord(data.id);
        if (record) {
            this.node.position = record.pos;
            this._data.pos = record.pos;
        } else {
            this.node.position = data.pos;
            ModelMgr.I.ChatModel.setComponentRecord(data);
        }
    }

    private touchStartHandler(event: cc.Event.EventTouch): void {
        this.startPos = event.getLocation();
    }

    private touchMoveHandler(event: cc.Event.EventTouch): void {
        if (this._chatWinState) return;
        const _pos = event.touch.getDelta();
        if (!this.moveState) {
            const pos = event.getLocation();
            if (pos.sub(this.startPos).mag() > 5) {
                this.moveState = true;
            }
        }

        if (this.moveState && this._data.moveContent.contains(cc.v2(this.node.x + _pos.x, this.node.y + _pos.y))) {
            this.node.x += _pos.x;
            this.node.y += _pos.y;
        }
    }

    private touchEndHandler(event: cc.Event.EventTouch): void {
        if (this._chatWinState) return;
        if (!this.moveState) {
            WinMgr.I.open(ViewConst.ChatWin);
        } else {
            this._data.pos = this.node.position;
            ModelMgr.I.ChatModel.setComponentRecord(this._data);
        }

        this.moveState = false;
    }

    private touchCancelHandler() {
        if (this._chatWinState) return;
        this._data.pos = this.node.position;
        ModelMgr.I.ChatModel.setComponentRecord(this._data);

        this.moveState = false;
    }

    private redUpdate() {
        const redMap = ModelMgr.I.ChatModel.getRed();

        let all = 0;
        for (const key in redMap) {
            const e = redMap[key];
            all += e;
        }

        if (!all) {
            this.NdBg.active = this.LblNum.node.active = false;
        } else {
            this.NdBg.active = this.LblNum.node.active = true;
            this.LblNum.string = `${all}${all > 99 ? '+' : ''}`;
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.Chat.OpenChatWinState, this.changeWinState, this);
        EventClient.I.off(E.Chat.RedUpdate, this.redUpdate, this);
    }

    protected onDisable(): void {
        super.onDisable();
        WinMgr.I.close(ViewConst.ChatWin);
    }
    // update (dt) {}
}
