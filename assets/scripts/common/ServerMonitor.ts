import { _decorator, __private } from 'cc';
import GameProto from '../net/GameProto';
import { ExecutorList } from '../core/executor/ExecutorList';
import UtilsPlatform from '../utils/UtilsPlatform';

const { ccclass } = _decorator;

interface GameServer {
    accountId: 0,
    serverId: 0,
    areaId: 0,
    ws: '',
    wss: '',
    userId: 0,
}

@ccclass('ServerMonitor')
export class ServerMonitor {
    private static _I: ServerMonitor = null;
    public static get I(): ServerMonitor {
        if (this._I == null) {
            this._I = new ServerMonitor();
            this._I.Game = new GameProto();
            // this._I.Login = new LoginProto();
        }
        return this._I;
    }
    /** 登录的proto */
    // private Login: LoginProto = undefined;
    /** 游戏的proto */
    private Game: GameProto = undefined;
    /** 连接socke后的回调列表 */
    private joinExectors = new ExecutorList();
    /** 能否发送协议 */
    private canSendMsg = true;

    private webSocketType = 'ws';
    private webSocketTypeS = 'wss';

    private _gameServer: GameServer = {
        accountId: 0,
        serverId: 0,
        areaId: 0,
        ws: '',
        wss: '',
        userId: 0,
    };
    public get gameServer(): GameServer {
        return this._gameServer;
    }
    public set gameServer(v: GameServer) {
        this._gameServer = v;
    }

    public join(wspath?: string): void {
        this.joinExectors.invoke();
        let url;
        if (this.getWSType() === 'ws') {
            url = `ws://${this.gameServer.ws}`;
        } else if (this.getWSType() === 'wss') {
            url = `wss://${this.gameServer.wss}`;
        }
        this.Game.connect(url, false, wspath);
    }

    /** 添加join后的回调 */
    public addJoinReact(callback: (...arg: any[]) => void, target: unknown): void {
        this.joinExectors.pushUnique(callback, target);
    }

    /** 移除 */
    public removeJoinReact(callback: (...arg: any[]) => void, target: unknown): void {
        this.joinExectors.remove(callback, target);
    }

    /** 协议监听 */
    public proxyOn(protocolId: number, callback: (...arg: any)=>void, target: unknown): void {
        this.Game.on(protocolId, callback, target);
    }

    /** 协议监听单次 */
    public proxyOnce(protocolId: number, callback: (...arg: any)=>void, target: unknown): void {
        this.Game.once(protocolId, callback, target);
    }

    /** 移除监听 */
    public proxyOff(protocolId: number, callback: (...arg: any)=>void, target: unknown): void {
        this.Game.off(protocolId, callback, target);
    }

    /** 发送协议 */
    public post(protocolId: number, msg?: unknown): void {
        if (this.canSendMsg || protocolId === ProtoId.C2SReLogin_ID) {
            this.Game.sendProtoPacket(protocolId, msg);
        }
    }

    public getWSType(): string {
        if (UtilsPlatform.isSmallGame()) {
            const indexGlobal = window.IndexGlobal;
            if (indexGlobal) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                return indexGlobal.config ? indexGlobal.config.protocol as string : 'wss';
            }
            return undefined;
        } else if (window.location.protocol === 'https:') {
            return this.webSocketTypeS;
        } else if (UtilsPlatform.isPrimitive()) {
            return this.webSocketTypeS;
        } else {
            return this.webSocketType;
        }
    }
}
