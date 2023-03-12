/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prefer-const */
/* eslint-disable dot-notation */
/*
 * @Author: hrd
 * @Date: 2022-03-28 20:33:08
 * @Description:
 *
 */
import * as $protobuf from 'protobufjs';
import ProtoManager from './ProtoManager';
import { EventClient } from '../../app/base/event/EventClient';
import { EventProto } from '../../app/base/event/EventProto';
import GameSocket from '../../app/core/net/socket/GameSocket';
import NetParse from '../../app/core/net/socket/NetParse';
import { AppEvent } from '../../app/AppEventConst';
import MsgToastMgr from '../base/msgtoast/MsgToastMgr';
import { RedDotCheckMgr } from '../module/reddot/RedDotCheckMgr';
import { E } from '../const/EventName';
import { UtilPaltform } from '../../app/base/utils/UtilPaltform';

// console.warn('$protobuf$protobuf$protobuf$protobuf$protobuf$protobuf$protobuf$protobuf=', $protobuf);
// let $Reader = $protobuf['default'].Reader;
// let $Writer = $protobuf['default'].Writer;

export default class NetMgr {
    private _webSocketType = 'ws';
    private _webSocketTypeS = 'wss';
    /** 当前的webSocket的对象 */
    private _gameSocket: GameSocket = null;
    /** debug 状态 */
    public Debug: boolean = true;
    /** 协议索引值 */
    private _handleIndex = -1;
    /** 上次重连时间 */
    private _lastReconnectTime: number = 0;
    /** 重连失败 */
    private _reconnectFail: boolean = false;
    private _url: string;

    /**
     * 不需要打印的协议
     */
    public excludeLogPack: { [name: string]: boolean; } = {
        3: true,
        88: true,
        85: true,
        94: true,
        2: true,
        // 52: true,
        // 53: true,
        // 54: true,
        // 55: true,
    };

    private static Instance: NetMgr;
    public static get I(): NetMgr {
        if (!this.Instance) {
            this.Instance = new NetMgr();
            this.Instance._init();
        }
        return this.Instance;
    }

    public get gameSocket(): GameSocket {
        if (!this._gameSocket) {
            this._gameSocket = new GameSocket();
        }
        return this._gameSocket;
    }

    private _init() {
        EventClient.I.on(AppEvent.SocketConnect, this.onOpen, this);
        EventClient.I.on(AppEvent.SocketClose, this.onClose, this);
        EventClient.I.on(AppEvent.SocketMessage, this.onMessage, this);
        EventClient.I.on(AppEvent.SocketReconnectFail, this.onReconnectFail, this);
        EventClient.I.on(AppEvent.SocketStartReconnect, this.onSocketStartReconnect, this);
    }

    public connectNet(url?: string): void {
        //
        if (url) {
            this._url = url;
        }
        if (!this._url) {
            return;
        }
        let _url = this._url;
        this.gameSocket.connect(_url);
    }

    private _taskReConnect: any = null;
    private _timer: any = null;

    private reconnectNet(): void {
        if (this._reconnectFail === true) {
            return;
        }
        if (this._gameSocket.isConnecting()) {
            return;
        }
        if (!this._gameSocket.needReconnect) {
            return;
        }

        let now = new Date().getTime();
        if (this._lastReconnectTime && now - this._lastReconnectTime < 3000) { // 不足3秒
            if (this._taskReConnect) {
                return;
            }
            this._taskReConnect = setTimeout(() => {
                clearTimeout(this._taskReConnect);
                this._taskReConnect = null;
                // this.gameSocket.reconnect();
                this.reconnectNet();
            }, 1000);

            return;
        }
        if (this._timer) {
            return;
        }
        console.log('===========reconnectNet================', now - this._lastReconnectTime);
        // 重置时间
        this._lastReconnectTime = now;
        if (this._taskReConnect) clearTimeout(this._taskReConnect);
        this._taskReConnect = null;
        this.gameSocket.reconnect();
        this._timer = setTimeout(() => {
            if (this._timer) {
                clearTimeout(this._timer);
                this._timer = null;
            }
            if (!this._gameSocket.isConnecting()) {
                this.reconnectNet();
                // console.log('=======do reconnectNet=========', this._lastReconnectTime);
            }
        }, 3000);
    }
    /**
     *  关闭网络
     * @param needReconnect 断开后是否需要重连
     */
    public closeNet(needReconnect = true): void {
        this._gameSocket.needReconnect = needReconnect;
        this._gameSocket.close();
        if (needReconnect) {
            // 重置重连失败标记
            this._reconnectFail = false;
            this.reconnectNet();
        }
    }

    // public doReconnectNet(): void {
    //     if (this._reconnectFail === true) {
    //         this._reconnectFail = false;
    //     }
    //     if (this._gameSocket) {
    //         this._gameSocket.needReconnect = true;
    //     }
    //     this.reconnectNet();
    // }

    public getWSType(): string {
        // todo 小游戏处理
        if (this.isSmallGame()) {
            let indexGlobal = window['IndexGlobal'];
            return indexGlobal && indexGlobal['config'] ? indexGlobal['config']['protocol'] : 'wss';
        } else if (window.location.protocol === 'https:') {
            return this._webSocketTypeS;
        } else {
            return this._webSocketType;
        }
        return '';
    }

    public getState(): number {
        return this.gameSocket ? this.gameSocket.getState() : null;
    }

    private onOpen() {
        //
    }

    private onClose() {
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
        if (this._taskReConnect) {
            clearTimeout(this._taskReConnect);
            this._taskReConnect = null;
        }
    }

    private onMessage(obj: MessageEvent) {
        if (obj.data instanceof ArrayBuffer) {
            // leaf 前两位为协议序号，需要解一下啊协议序号
            let retdata = NetParse.parseProtoBufId(obj);
            let id = retdata.id;
            let data = retdata.data;
            let mid = retdata.mid;
            let gameMsg: any;
            if (this.isSmallGame()) {
                gameMsg = window['PCK'].getPCK(id, null);
                if (!gameMsg) {
                    return;
                }
                // gameMsg.decode($Reader.create(data));
            } else {
                let cls = ProtoManager.I.getMsgClass(id);
                if (!cls) {
                    return;
                }
                gameMsg = cls.decode(data);
            }

            if (this.Debug === true && !this.excludeLogPack[id]) {
                console.log('收包', id, gameMsg);
            }
            // 检测模块是否初始化
            EventClient.I.emit(AppEvent.ControllerCheck, mid);

            if (NetParse.Idx > this._handleIndex
                || (this._handleIndex === 65535 && NetParse.Idx < 9999)
                || NetParse.Idx === 0) {
                const isErrorTag = gameMsg && gameMsg.Tag;
                if (isErrorTag) {
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    MsgToastMgr.ShowErrTips(gameMsg.Tag);
                }
                EventProto.I.emit(id, gameMsg);
                if (!isErrorTag) {
                    RedDotCheckMgr.I.onProto(id);
                }
                this._handleIndex = NetParse.Idx;
            }
        }
    }

    /**
     * 无法连接网络 重连失败
     */
    private onReconnectFail() {
        // todo 弹窗
        this._reconnectFail = true;
    }

    /** 需要断线重连 */
    private onSocketStartReconnect() {
        this.reconnectNet();
    }

    /**
     * 请求包封装
     * */
    public sendMessage(protocolId: number, data: any = null): void {
        // if (MConfig.I.canSendMsg || protocolId == ProtoId.C2SReLogin_ID) {
        //     // console.log("====" + protocolId + ":" + data)
        //     this.sendProtoPacket(protocolId, data);
        // }
        this.sendProtoPacket(protocolId, data);
    }

    private sendProtoPacket(protocolId: number, data: any = null) {
        if (this.Debug === true && this.excludeLogPack && !this.excludeLogPack[protocolId]) {
            console.log('发包', protocolId, data);
        }
        let buffer = new Uint8Array(0);
        if (data) {
            if (this.isSmallGame()) {
                // data = window['PCK'].getPCK(protocolId, data);
                // buffer = data.encode($Writer.create()).finish();
            } else {
                let cls = ProtoManager.I.getMsgClass(protocolId);
                if (!cls) {
                    return;
                }
                data = cls.create(data);
                buffer = cls.encode(data).finish();
            }
        }
        let array = NetParse.protoBufAddtag(protocolId, buffer);
        let ccs = array[0].slice(array[1], array[1] + buffer.length + NetParse.HeadLen);
        this.gameSocket.send(ccs.buffer);
    }
    /* 當前是否所有websocket連接 */
    public ifHasWebsocket(): boolean {
        if (NetMgr.I) {
            return true;
        } else {
            return false;
        }
    }

    private isSmallGame(): boolean {
        return UtilPaltform.isWeChatGame;
    }
}
