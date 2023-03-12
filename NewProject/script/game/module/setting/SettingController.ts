import { EventClient } from '../../../app/base/event/EventClient';
import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import NetMgr from '../../manager/NetMgr';
import { E } from '../../const/EventName';

const { ccclass } = cc._decorator;
@ccclass('SettingController')
export class SettingController extends BaseController {
    public constructor() {
        super();
    }

    public addNetEvent(): void {
        EventProto.I.on(ProtoId.S2CSysSettingsInfo_ID, this.onSysSettingsInfo, this);
        EventProto.I.on(ProtoId.S2CChangeNick_ID, this.onChangeNick, this);
    }
    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CChangeNick_ID, this.onChangeNick, this);
        EventProto.I.off(ProtoId.S2CSysSettingsInfo_ID, this.onSysSettingsInfo, this);
    }

    public addClientEvent(): void {
        // EventClient.I.on(E.GM.SendGMMsg, this.reqC2SGm, this);
    }
    public delClientEvent(): void {
        //
        // EventClient.I.off(E.GM.SendGMMsg, this.reqC2SGm, this);
    }
    public clearAll(): void {
        //
    }

    /**
     * 设置系统
      */
    public reqC2SSysSettingsInfo(jsonStr: string): void {
        const req = new C2SSysSettingsInfo();
        req.SysSettingsInfo = jsonStr;
        NetMgr.I.sendMessage(ProtoId.C2SSysSettingsInfo_ID, req);
    }

    private onSysSettingsInfo(data: S2CSysSettingsInfo): void {
        if (!data.Tag) {
            //
        } else {
            //
        }
    }

    private onChangeNick(data: S2CChangeNick): void {
        if (!data.Tag) {
            EventClient.I.emit(E.SysSetting.ModifyName);
        } else if (data.Tag === 24) {
            // MsgToastMgr.Show('重名');
        } else {
            // MsgToastMgr.Show('改名失败');
        }
    }
    /**
     * 修改昵称
      */
    public reqC2SChangeNick(sex: number, name: string): void {
        const req = new C2SChangeNick();
        req.Sex = sex;
        req.Nick = name;
        NetMgr.I.sendMessage(ProtoId.C2SChangeNick_ID, req);
    }
}
