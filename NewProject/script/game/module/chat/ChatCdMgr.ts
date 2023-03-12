/*
 * @Author: myl
 * @Date: 2022-10-27 11:15:58
 * @Description:
 */
import { Config } from '../../base/config/Config';

export enum EChatSetType {
    WorldMsgCD = 'WorldMsgCD',
    SignleSeverMsgCD = 'SignleSeverMsgCD',
    MultipleMsgSave = 'MultipleMsgSave',
    WorldMsgSave = 'WorldMsgSave',
    SingleSeverMsgSave = 'SingleSeverMsgSave',
    SeviceMsgSave = 'SeviceMsgSave',
    SingleMsgLimit = 'SingleMsgLimit',
    RepeatMsgLimit = 'RepeatMsgLimit',
    BlackListLimit = 'BlackListLimit',
}

export class ChatCdMgr {
    private static _mgr: ChatCdMgr;
    public static get I(): ChatCdMgr {
        if (!this._mgr) {
            this._mgr = new ChatCdMgr();
        }
        return this._mgr;
    }

    public getValue(key: EChatSetType): number {
        const config = Config.Get(Config.Type.Cfg_ChatSet);
        const cfg: Cfg_ChatSet = config.getValueByKey(key);
        return Number(cfg.Value);
    }

    public canWorldSend: boolean = true;
    public canSingleServerSend: boolean = true;
    public resetWorldCd(): void {
        if (!this.resetWorldCd) {
            return;
        }
        const cd = this.getValue(EChatSetType.WorldMsgCD);
        this.canWorldSend = false;
        let timer = setTimeout(() => {
            clearTimeout(timer);
            timer = null;
            this.canWorldSend = true;
        }, cd * 1000);
    }

    public resetSingleServerCd(): void {
        const cd = this.getValue(EChatSetType.WorldMsgCD);
        this.canSingleServerSend = false;
        let timer = setTimeout(() => {
            clearTimeout(timer);
            timer = null;
            this.canSingleServerSend = true;
        }, cd * 1000);
    }

    public getBlackListMax(): number {
        const num = this.getValue(EChatSetType.BlackListLimit);
        return num;
    }
}
