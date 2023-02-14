/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// eslint-disable-next-line import/no-extraneous-dependencies
import { resources, sys } from 'cc';
import * as $protobuf from 'protobufjs';
import { EventM } from '../common/EventManager';
import MsgToast from '../ui/Toast/MsgToast';
import UtilsPlatform from '../utils/UtilsPlatform';
import UtilsString from '../utils/UtilsString';
import UtilsUrl from '../utils/UtilsUrl';
import BaseWebSocket from './base/BaseWebSocket';
import ProtoManager from './ProtoManager';

const $Reader = $protobuf.Reader; const $Writer = $protobuf.Writer; const $util = $protobuf.util;

export default class GameProto {
    public server = {
        accountId: 0,
        serverId: 0,
        areaId: 0,
        ws: '',
        wss: '',
        userId: 0,
    };
    /**
     * 不需要打印的协议
     */
    public excludeLogPack: { [name: string]: boolean } = {
        52: true,
        53: true,
        54: true,
        55: true,
    }
    private MaxSize: number = 1024 * 20;
    private addProtoIdBuffer: Uint8Array = new Uint8Array(this.MaxSize);
    private offset = 0;
    private idx = 0;
    private _sock: BaseWebSocket = null // 当前的webSocket的对象
    // private static _i: GameProto = null;
    public Debug = false;

    // public static get I(): GameProto {
    //     if (!GameProto._i) { //判断是否连接状态
    //         GameProto._i = new GameProto();
    //         // GameProto._i.connect();
    //     }
    //     return GameProto._i;
    // }

    // public static set I(value: GameProto) {
    //     GameProto._i = value;

    // }
    private EMI = EventM.I;

    private needReconnect = true;
    private _handleIndex = -1;
    private _sessionId = 1;
    public connect(url: string, force = false, wspath?: string): this {
        this.needReconnect = true; // 重置重连状态
        if (force) {
            if (this._sock) {
                this._sock.close();
                this._sock = null;
            }
        } else if (this._sock && this._sock.readyState === WebSocket.OPEN) {
            return this;
        }
        let _url = url;
        // this.server.areaId = 258
        // this.server.serverId = 277
        // this.server.ws = "192.168.44.162:10001"
        /*
         * http://localhost:7456?url=ws://192.168.44.13:8200
         * 指定ip和端口
         */
        const _s = UtilsUrl.getQueryString('url');
        if (_s) {
            _url = _s;
        }
        console.log('sys.platform=', sys.platform);
        console.log('_url=', _url);
        this._sock = new BaseWebSocket(_url, wspath);
        this._sock.sessionId = this._sessionId++;

        // 使用bind改变了回调的运行环境，更改如下： this -> 当前sock，  this._sock -> 最终执行的sock
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const __self = this;
        // eslint-disable-next-line func-names
        this._sock.onopen = function (event: Event) {
            // let aa = this._sock;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (this._sock && this === __self._sock.sock) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                this.onOpen(event);
            } else {
                this.close();
            }
            __self.EMI.fire(EventM.Type.Socket.SocketOpen);
        };

        this._sock.onclose = this.onClose.bind(this);

        this._sock.onmessage = this.onMessage.bind(this);

        this._sock.onerror = this.onError.bind(this);

        return this;
    }

    private onOpen(ev: Event) {
        // if (MConfig.I.isOffLine) {
        //     E.I.onE(EId.On_StartHearBeat, null);
        // }
        console.log('open');
    }
    private getCurSocket() {
        return this._sock;
    }

    private onClose(ev: Event) {
        this._sock = null;
        this.EMI.fire(EventM.Type.Socket.SocketClose);

        if (this.needReconnect) {
            this.EMI.fire(EventM.Type.Socket.SocketClose);
            this.EMI.fire(EventM.Type.Socket.NeedConnect);
        }
    }

    public protoBufAddtag(protoId: number, buffer: Uint8Array): [Uint8Array, number] {
        if (buffer.length + 4 > this.MaxSize) {
            return [this.addProtoIdBuffer, this.offset];
        }

        if (this.offset + buffer.length + 4 > this.MaxSize) {
            this.offset = 0;
        }
        this.addProtoIdBuffer[this.offset + 0] = (this.idx >> 8) & 0xFF;
        this.addProtoIdBuffer[this.offset + 1] = this.idx & 0xFF;
        this.addProtoIdBuffer[this.offset + 2] = (protoId >> 8) & 0xFF;
        this.addProtoIdBuffer[this.offset + 3] = protoId & 0xFF;

        this.addProtoIdBuffer.set(buffer.subarray(0, buffer.length), this.offset + 4);

        const oldOffset = this.offset;
        this.offset += buffer.length + 4;
        return [this.addProtoIdBuffer, oldOffset];
    }

    public Uint8ArrayToInt(uint8Ary: Uint8Array): number {
        let retInt = 0;
        for (let i = 0; i < uint8Ary.length; i++) { retInt |= uint8Ary[i] << (8 * (uint8Ary.length - i - 1)); }

        return retInt;
    }

    public parseProtoBufId(obj: MessageEvent): { id: number, data: Uint8Array } {
        const arrayBuffer: ArrayBuffer = obj.data;
        let dataUnit8Array = new Uint8Array(arrayBuffer);

        const id = this.Uint8ArrayToInt(dataUnit8Array.slice(2, 4));

        if (id !== ProtoId.S2CRoutePath_ID) { // 如果是寻路包，不增加这个
            this.idx = this.Uint8ArrayToInt(dataUnit8Array.slice(0, 2));
            if (this.idx === 0) { // 记录一下idx是0的情况，方便查询
                // console.error("__FILETER__ this.idx == 0, id:", id);
            }
        }

        dataUnit8Array = dataUnit8Array.slice(4);

        return { id, data: dataUnit8Array };
    }
    private onError(event: MessageEvent) {
        this.EMI.fire(EventM.Type.Socket.SocketError);
        console.error('websocket connect fail');
    }

    private onMessage(obj: MessageEvent) {
        if (obj.data instanceof ArrayBuffer) {
            // leaf 前两位为协议序号，需要解一下啊协议序号
            const retdata = this.parseProtoBufId(obj);
            const id = retdata.id;
            const data = retdata.data;
            let gameMsg: any;
            if (UtilsPlatform.isSmallGame()) {
                gameMsg = window.PCK.getPCK(id, null);
                if (!gameMsg) {
                    return;
                }
                gameMsg.decode($Reader.create(data));
            } else {
                const cls = ProtoManager.I.getMsgClass(id);
                if (!cls) {
                    return;
                }
                gameMsg = cls.decode(data);
            }

            if (this.Debug === true && !this.excludeLogPack[id]) {
                console.warn('收包', id, gameMsg);
            }
            // 转化一下

            if (gameMsg.Tag && id !== ProtoId.S2CReLogin_ID) {
                let str: string = null;
                if (gameMsg.Tag === -1) {
                    str = gameMsg.msg;

                // } else if (Config.I.Cfg_Msg_Data) {
                //     str = Config.I.Cfg_Msg_Data[gameMsg["Tag"]];
                }
                if (str == null) {
                    str = `编号[${parseInt(gameMsg.Tag)}]无提示`;
                } else if (gameMsg.TagP) {
                    str = UtilsString.Format(str, gameMsg.TagP.split(':'));
                }
                if (str && str !== '') {
                    MsgToast.Show(str);
                }
            }
            if (id === 1582) {
                //
            }
            // eslint-disable-next-line max-len
            if (this.idx > this._handleIndex || (this._handleIndex === 65535 && this.idx < 9999) || this.idx === 0 || id === ProtoId.S2CRoutePath_ID) {
                // E.I.onNE(id, gameMsg);
                this.proxyFire(id, gameMsg);
                this._handleIndex = this.idx;
            }
        }
    }
    public Close(needReconnect = true): void {
        console.log('Close');
        this.needReconnect = needReconnect;
        if (this._sock) {
            this._sock.close();
            this._sock = null;
        }
        if (this.needReconnect) {
            // E.I.onE(EId.On_NeedConnect_ID, null);
            this.EMI.fire(EventM.Type.Socket.NeedConnect);
        }
    }

    public sendLoginEnd(): void {
        console.log('sendLoginEnd=');
    }

    private send(msg) {
        if (!this._sock) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const __self: GameProto = this;
        switch (this._sock.readyState) {
            case WebSocket.CONNECTING:
                // TODOO 等待链接遮罩
                // eslint-disable-next-line func-names
                this._sock.onopen = function () {
                    // __self.onOpen(null);
                    __self.send(msg);
                };
                break;

            case WebSocket.OPEN:
                this._sock.send(msg);
                break;

            case WebSocket.CLOSING:
                // do something
                break;

            case WebSocket.CLOSED:
                // MsgToast.ShowWithColor("网络中断,请刷新!!!!!", 10000);
                // TODOO 清理旧连接残余内容，重新连接
                break;
            default:
                break;
        }
    }

    public getState(): any {
        return this._sock ? this._sock.readyState : null;
    }

    public proxyFire(protocolId: number, data: unknown): void {
        this.EMI.fire(protocolId, data);
    }

    public sendProtoPacket(protocolId: number, data: any = null): void {
        if (this.Debug === true && this.excludeLogPack && !this.excludeLogPack[protocolId]) {
            console.log('发包', protocolId, data);
        }
        let buffer = new Uint8Array(0);
        if (data) {
            if (UtilsPlatform.isSmallGame()) {
                // data = window['PCK'].getPCK(protocolId, data);
                // buffer = data.encode($Writer.create()).finish();
            } else {
                const cls = ProtoManager.I.getMsgClass(protocolId);
                if (!cls) {
                    return;
                }
                data = cls.create(data);
                buffer = cls.encode(data).finish();
            }
        }

        const array = this.protoBufAddtag(protocolId, buffer);
        const ccs = array[0].slice(array[1], array[1] + buffer.length + 4);
        this.send(ccs.buffer);
    }
    /* 當前是否所有websocket連接 */
    public ifHasWebsocket(): boolean {
        if (this) {
            return true;
        } else {
            return false;
        }
    }

    public on(name: number, callback: (...arg)=> void, target: unknown): void {
        this.EMI.on(name, callback, target);
    }

    public once(name: number, callback: (...arg)=> void, target: unknown): void {
        this.EMI.once(name, callback, target);
    }

    public off(name: number, callback: (...arg)=> void, target: unknown): void {
        this.EMI.off(name, callback, target);
    }

    // public aaa() {
    //     if (this) {
    //         AudEng.I.isSlient = !(Tool.I.getStatus4Binary(CommSwitch.Sound, RoleM.I.d.ClientSwitch);
    //     }
    // }
}
