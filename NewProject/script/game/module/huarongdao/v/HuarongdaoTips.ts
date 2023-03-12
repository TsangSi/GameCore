/*
 * @Author: lijun
 * @Date: 2023-03-07 21:36:59
 * @Description:
 */

import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { i18n, Lang } from '../../../../i18n/i18n';
import ModelMgr from '../../../manager/ModelMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export default class HuarongdaoTips extends BaseCmp {
    @property(cc.Label)
    private LblTitle: cc.Label = null;

    @property(cc.Label)
    private LblTime: cc.Label = null;

    private _startTime: number = 0;// 活动开始时间
    private _waitTime: number = 0;// 活动开始剩余时间
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    protected onEnable(): void {
        super.onEnable();
        this.initView();
    }

    /** 刷新界面 */
    private initView(): void {
        this._startTime = ModelMgr.I.HuarongdaoModel.getActivityStartTime();
        this._waitTime = this._startTime - UtilTime.NowSec();
        if (!this._startTime || this._waitTime <= 0) {
            this.node.active = false;
        } else {
            this.updateSecond();
        }
    }

    /** 显示标题和倒计时 */
    private showTime(): void {
        if (UtilTime.IsSameDay(new Date(UtilTime.NowMSec()), new Date(this._startTime * 1000))) {
            this.LblTitle.string = UtilString.FormatArgs(
                i18n.tt(Lang.huarongdao_activity_tip3),
                UtilNum.ToChinese(ModelMgr.I.HuarongdaoModel.getActivityCycNo()),
            );
            this.LblTime.string = UtilTime.FormatHourDetail(this._waitTime, true);
        } else {
            this.LblTitle.string = i18n.tt(Lang.huarongdao_activity_tip1);
            this.LblTime.string = i18n.tt(Lang.huarongdao_activity_tip2);
        }
    }

    /** 倒计时，由HuarongdaoPage统一调用 */
    public updateSecond(): void {
        if (this._waitTime <= 0) { return; }
        this._waitTime = ModelMgr.I.HuarongdaoModel.getActivityLeastTime(ModelMgr.I.HuarongdaoModel.getMatchState());
        this.showTime();
        if (this._waitTime <= 0) {
            this.node.active = false;
        }
    }
}
