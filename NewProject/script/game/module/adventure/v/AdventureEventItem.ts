import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import BaseUiView from '../../../../app/core/mvc/view/BaseUiView';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import ListItem from '../../../base/components/listview/ListItem';
import { TickTimer } from '../../../base/components/TickTimer';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { E } from '../../../const/EventName';

const { ccclass, property } = cc._decorator;

@ccclass
export default class AdventureEventItem extends ListItem {
    @property(cc.Sprite)
    private bk: cc.Sprite = null;

    @property(cc.Sprite)
    private select: cc.Sprite = null;

    @property(cc.Node)
    private NdFinish: cc.Node = null;

    @property(cc.Node)
    private NdEnd: cc.Node = null;

    @property(cc.Node)
    private NdXuYuan: cc.Node = null;

    /** 剩余时间 */
    @property(TickTimer)
    private LabOutTime: TickTimer = null;

    public setEvent(ev: AdventureEvent): void {
        this.setEventType(ev.EventId);
        this.showTime(-1);
        if (ev.State === 0) {
            const show = UtilTime.NowSec() >= ev.OverTime;
            const xuyuan = ev.EventId === 3 && ev.EventWish.WishState === 1;
            this.showFinish(show && !xuyuan);
            this.showXuYuan(xuyuan);
            this.showEnd(false);
            if (!show) this.showTime(ev.OverTime - UtilTime.NowSec());
        } else {
            this.showFinish(false);
            this.showEnd(true);
            this.showXuYuan(false);
        }

        let red = false;

        if (ev.EventId === 3 && ev.EventWish.WishState === 1 && UtilTime.NowSec() >= ev.EventWish.CanGetTime) {
            red = true;
        }

        UtilRedDot.UpdateRed(this.node, red, cc.v2(22, 34));
    }

    public showFinish(active: boolean): void {
        if (this.NdFinish) this.NdFinish.active = active;
    }

    public showXuYuan(active: boolean): void {
        if (this.NdXuYuan) this.NdXuYuan.active = active;
    }

    public showEnd(active: boolean): void {
        if (this.NdEnd) this.NdEnd.active = active;
    }

    public setEventType(type: number): void {
        let def = '';
        let sel = '';

        if (type === 1) {
            def = '/texture/adventure/icon_yltx_LLSR01@ML';
            sel = '/texture/adventure/icon_yltx_LLSR02@ML';
        } else if (type === 3) {
            def = '/texture/adventure/icon_yltx_xyc01@ML';
            sel = '/texture/adventure/icon_yltx_xyc02@ML';
        } else if (type === 5) {
            def = '/texture/adventure/icon_yltx_QJT01@ML';
            sel = '/texture/adventure/icon_yltx_QJT02@ML';
        } else {
            def = '/texture/adventure/icon_yltx_qwwd01@ML';
            sel = '/texture/adventure/icon_yltx_qwwd02@ML';
        }

        ResMgr.I.loadLocal(def, cc.SpriteFrame, (err, res: cc.SpriteFrame) => {
            if (res) this.bk.spriteFrame = res;
        });

        ResMgr.I.loadLocal(sel, cc.SpriteFrame, (err, res: cc.SpriteFrame) => {
            if (res) this.select.spriteFrame = res;
        });
    }

    /** 显示时间 */
    private showTime(time: number = 0) {
        if (time > 0) this.LabOutTime.tick(time, `%HH:%mm:%ss`, true, true, false);
        this.LabOutTime.node.active = time > 0;
    }

    /** 刷新全部UI */
    private onTimer() {
        EventClient.I.emit(E.Adventure.syncEventList);
    }
}
