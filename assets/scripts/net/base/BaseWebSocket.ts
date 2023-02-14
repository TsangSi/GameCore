export default class BaseWebSocket {
    private _sock: WebSocket = null;
    public sessionId = 0;

    constructor (url: string, wspath?: string) {
        const _WebSocket: any = WebSocket;
        if (wspath) {
            this._sock = new _WebSocket(url, [], wspath);
        } else {
            this._sock = new _WebSocket(url);
        }
        this._sock.binaryType = 'arraybuffer';
    }
    public get sock () {
        return this._sock;
    }
    public set onopen (v: any) {
        this._sock.onopen = v;
    }
    public set onclose (v: any) {
        this._sock.onclose = v;
    }
    public set onmessage (v: any) {
        this._sock.onmessage = v;
    }

    public set onerror (v: any) {
        this._sock.onerror = v;
    }

    public get readyState () {
        return this._sock.readyState;
    }

    public send (msg: any) {
        this._sock.send(msg);
    }
    public close () {
        if (this._sock) {
            this._sock.close();
        }
    }
}
