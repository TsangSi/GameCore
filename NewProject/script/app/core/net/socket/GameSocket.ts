/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable dot-notation */
/*
 * @Author: hrd
 * @Date: 2022-04-14 12:22:54
 * @LastEditors: Please set LastEditors
 * @Description:
 */
import { AppEvent } from '../../../AppEventConst';
import { EventClient } from '../../../base/event/EventClient';

export default class GameSocket {
    private _url: string = '';
    /** 当前的webSocket的对象 */
    private _socket: WebSocket = null;
    /** 重置重连状态 */
    private _needReconnect = true;
    /** Socket 唯一id */
    private _sessionId = 1;
    /** 最大重连次数 */
    private _maxReconnectCount = 5;
    /** 重连次数 */
    private _reconnectCount: number = 0;
    /** 连接状态 */
    private _isConnecting: boolean = false;
    /** 标记已连接成功过 */
    private _connectFlag: boolean;

    public connect(url?: string): void {
        this._needReconnect = true; // 重置重连状态
        if (this._socket && this._socket.readyState === WebSocket.OPEN) {
            // 当前处于连接状态
            return;
        }
        if (url) {
            this._url = url;
        }

        if (!this._url) {
            return;
        }
        this._socket = new WebSocket(this._url);
        this._socket.binaryType = 'arraybuffer';
        this._socket['sessionId'] = this._sessionId++;
        this.registerCallBack();
    }

    public reconnect(): void {
        // console.log('=====reconnect=====', this._socket);
        this.closeCurrentSocket();
        this._reconnectCount++;
        if (this._reconnectCount <= this._maxReconnectCount) {
            this.connect();
            console.log('====do reconnect=======', this._reconnectCount);
        } else {
            this._reconnectCount = 0;
            this._needReconnect = false;
            // this._connectFlag = false;
            // if (this._connectFlag) {
            //     EventClient.I.emit(AppEvent.SocketClose);
            // } else {
            EventClient.I.emit(AppEvent.SocketReconnectFail);
            // }
            console.log('====do reconnect faill=======', this._reconnectCount);
        }
    }

    private registerCallBack() {
        this._socket.onopen = (ev: Event) => {
            // if (this._socket === ev.target) {
            //     console.log('======socket.onopen===========4444444');
            // } else {
            //     console.log('======socket.onopen===========5555555');
            // }
            console.log('===Socket==onopen==', this._connectFlag, this._needReconnect);
            this._reconnectCount = 0;
            this._isConnecting = true;
            if (this._connectFlag && this._needReconnect) {
                EventClient.I.emit(AppEvent.SocketReconnectSucc);
            } else {
                EventClient.I.emit(AppEvent.SocketConnect);
            }
            this._connectFlag = true;
        };

        this._socket.onclose = (ev: CloseEvent) => {
            console.log('===Socket==onclose==', this._needReconnect, this._connectFlag);
            if (this._socket === ev.target) {
                // console.log('======socket.onclose===========2222222');
            } else {
                // console.log('======socket.onclose===========3333333');
                return;
            }
            this._socket = null;
            this._isConnecting = false;
            if (this._needReconnect && this._connectFlag) {
                EventClient.I.emit(AppEvent.SocketStartReconnect);
            } else {
                EventClient.I.emit(AppEvent.SocketClose);
            }
        };

        this._socket.onmessage = (ev: MessageEvent) => {
            if (ev.data instanceof ArrayBuffer) {
                EventClient.I.emit(AppEvent.SocketMessage, ev);
            }
            // console.log('===Socket==onmessage==');
        };

        this._socket.onerror = (ev: MessageEvent) => {
            this._isConnecting = false;
            if (this._needReconnect) {
                EventClient.I.emit(AppEvent.SocketStartReconnect);
            } else {
                EventClient.I.emit(AppEvent.SocketNoConnect);
            }
            console.log('===Socket==onerror==');
        };
    }

    public getState(): number {
        return this._socket ? this._socket.readyState : null;
    }

    /**
     * 关闭Socket连接
     */
    public close(): void {
        // this._connectFlag = false;
        this.closeCurrentSocket();
    }

    /**
     * 清理当前的Socket连接
     */
    private closeCurrentSocket() {
        if (this._socket) {
            this._socket.close();
            this._socket = null;
            console.error('======closeCurrentSocket======');
        }
        this._isConnecting = false;
    }

    public send(msg: string | ArrayBuffer | Blob | ArrayBufferView) {
        if (!this._socket) {
            return;
        }
        const readyState = this._socket.readyState;
        let func: () => void = null;
        switch (readyState) {
            case WebSocket.CONNECTING:
                // TODOO 等待链接遮罩
                func = () => {
                    EventClient.I.off(AppEvent.SocketConnect, func, this);
                    this._socket.send(msg);
                };
                EventClient.I.on(AppEvent.SocketConnect, func, this);
                // this._socket.onopen = () => {
                //     this._socket.send(msg);
                // };
                break;

            case WebSocket.OPEN:
                this._socket.send(msg);
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

    /**
     * Socket是否在连接中
     * @returns {boolean}
     */
    public isConnecting(): boolean {
        return this._isConnecting;
    }

    public get needReconnect(): boolean {
        return this._needReconnect;
    }

    public set needReconnect(v: boolean) {
        this._needReconnect = v;
    }
}
