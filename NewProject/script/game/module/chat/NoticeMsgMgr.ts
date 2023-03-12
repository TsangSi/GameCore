/*
 * @Author: kexd
 * @Date: 2022-06-28 11:57:38
 * @FilePath: \SanGuo\assets\script\game\module\chat\NoticeMsgMgr.ts
 * @Description:
 */
import { EventClient } from '../../../app/base/event/EventClient';
import { E } from '../../const/EventName';

export class NoticeMsgMgr {
    private nomalMsgs: string[] = [];
    private importantMsgs: string[] = [];
    private static MsgMgr: NoticeMsgMgr = null;

    public static get I(): NoticeMsgMgr {
        if (this.MsgMgr == null) {
            this.MsgMgr = new NoticeMsgMgr();
        }
        return this.MsgMgr;
    }

    public insertMsg(noticeMsg: Cfg_Notice, msg: string): void {
        if (!noticeMsg) return;
        if (noticeMsg.Important === 1) {
            this.importantMsgs.push(msg);
        } else {
            this.nomalMsgs.push(msg);
        }

        EventClient.I.emit(E.Chat.ShowNoticeWin);
    }

    /** 进入游戏主场景  播放未完成的跑马灯 */
    public defaultPlay(): void {
        if (this.nomalMsgs.length === 0 && this.importantMsgs.length === 0) {
            console.log('没有未播放的系统公告');
        } else {
            EventClient.I.emit(E.Chat.ShowNoticeWin);
        }
    }

    public getPlayMsg(): string {
        return this.importantMsgs.length > 0 ? this.importantMsgs.splice(0, 1)[0] : this.nomalMsgs.splice(0, 1)[0];
    }
}
