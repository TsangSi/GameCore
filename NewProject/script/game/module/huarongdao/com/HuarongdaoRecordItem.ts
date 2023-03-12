/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: lijun
 * @Date: 2023-02-22 12:18:48
 * @Description:
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { UtilString } from '../../../../app/base/utils/UtilString';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import UtilItem from '../../../base/utils/UtilItem';
import { RES_ENUM } from '../../../const/ResPath';
import ModelMgr from '../../../manager/ModelMgr';
import ActivityMgr from '../../activity/timerActivity/ActivityMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export default class HuarongdaoRecordItem extends BaseCmp {
    @property(cc.Label)
    private LblTimes: cc.Label = null;
    @property(cc.Label)
    private LblActiviteTime: cc.Label = null;
    @property(cc.Label)
    private LblNoStart: cc.Label = null;
    @property(cc.Label)
    private LblWin: cc.Label = null;
    @property(cc.Label)
    private LblOdds: cc.Label = null;
    @property(cc.Label)
    private LblName: cc.Label = null;
    @property(cc.Label)
    private LblSupport: cc.Label = null;
    @property(cc.Label)
    private LblTotalTime: cc.Label = null;
    @property(cc.Label)
    private LblSupportResult: cc.Label = null;
    @property(cc.Label)
    private LblReward: cc.Label = null;
    @property(cc.Label)
    private LblOver: cc.Label = null;

    @property(DynamicImage)
    private SprIcon: DynamicImage = null;
    @property(DynamicImage)
    private SprQualityBg: DynamicImage = null;
    @property(DynamicImage)
    private SprQualityKuang: DynamicImage = null;
    @property(DynamicImage)
    private SprCoin: DynamicImage = null;

    @property(cc.Node)
    private NdMatchInfo: cc.Node = null;
    @property(cc.Node)
    private NdSuccess: cc.Node = null;
    @property(cc.Node)
    private NdFail: cc.Node = null;

    private _cycNo: number;// 活动编号
    private _winInfo: HuarongEntryInfo;// 获胜武将
    private _betInfo: HuarongBetInfo;// 押注数据
    private _genCfg: Cfg_HuarongdaoGen;// 配置表
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    /**
     * setData
     * @param data 押注数据
     * @param index 今天第几场
     * @param isOver 是否已结算
     */
    public setData(index: number, cycNo?: number): void {
        this._cycNo = cycNo;
        const activityCfg = ActivityMgr.I.getActData(2001);
        const activityTimeArray = activityCfg.ActTime.split('|');
        this.LblTimes.string = UtilString.FormatArgs(i18n.tt(Lang.huarongdao_record_times), UtilNum.ToChinese(index + 1));
        if (!this._cycNo) { // 无活动编号即未开始
            this.NdMatchInfo.active = false;
            this.LblNoStart.node.active = true;
        } else {
            this._winInfo = ModelMgr.I.HuarongdaoModel.getActivityWinEntryLog(this._cycNo);
            this._betInfo = ModelMgr.I.HuarongdaoModel.getActivityBetLog(this._cycNo, this._winInfo.Id);
            this.showGenView();
            // 倍率
            this.LblOdds.string = UtilString.FormatArgs(i18n.tt(Lang.huarongdao_odds_num), this._winInfo.OddsRatio);
            // 支持率
            this.LblSupport.string = UtilString.FormatArgs(i18n.tt(Lang.huarongdao_support_num), this._winInfo.SupportRatio / 10);
            // 总用时
            const totalTime = this._winInfo.EndTimes - this._winInfo.StartTimes - ModelMgr.I.HuarongdaoModel.getStakeTime();
            this.LblTotalTime.string = UtilString.FormatArgs(i18n.tt(Lang.huarongdao_record_total_time.replace(/\s/g, ':')), totalTime);
            this.LblWin.string = i18n.tt(Lang.huarongdao_record_win);
            if (!this._betInfo || this._betInfo.BetNum === 0) { // 无押注信息，显示已结束
                this.NdMatchInfo.active = true;
                this.LblNoStart.node.active = false;
                this.NdSuccess.active = this.NdFail.active = false;
                this.LblOver.node.active = true;
                this.LblOver.string = i18n.tt(Lang.huarongdao_support_over);
            } else {
                const winState = this._betInfo.Id === this._winInfo.Id;// 是否押中
                this.NdSuccess.active = winState;

                this.NdFail.active = !winState;
                this.LblOver.node.active = false;
                this.LblSupportResult.node.active = true;
                this.LblSupportResult.string = i18n.tt(winState ? Lang.huarongdao_support_success : Lang.huarongdao_support_fail);

                if (winState && this._betInfo) {
                    this.LblReward.string = `+${this._betInfo.ItemInfos[0] ? this._betInfo.ItemInfos[0].ItemNum : 0}`;
                    const cost = ModelMgr.I.HuarongdaoModel.getNormalByKey('HuarongStakeCost');

                    const cfg = UtilItem.GetCfgByItemId(Number(cost.CfgValue));
                    this.SprCoin.loadImage(UtilItem.GetItemIconPath(cfg.PicID, 1), 1, true);
                }
            }
        }

        if (activityTimeArray[index]) { // 展示当前场活动时间（读表，按序号显示）
            this.LblActiviteTime.string = activityTimeArray[index];
        } else if (this._winInfo) { // 超出配置表的额外场次显示实际时间（目前只显示了4场，额外场次没展示）
            const date1 = new Date(this._winInfo.StartTimes * 1000);
            const date2 = new Date(this._winInfo.EndTimes * 1000);
            const h1 = date1.getHours() < 10 ? `0${date1.getHours()}` : date1.getHours();
            const m1 = date1.getMinutes() < 10 ? `0${date1.getMinutes()}` : date1.getMinutes();
            const h2 = date2.getHours() < 10 ? `0${date2.getHours()}` : date2.getHours();
            const m2 = date2.getMinutes() < 10 ? `0${date2.getMinutes()}` : date2.getMinutes();
            this.LblActiviteTime.string = `${h1}:${m1}-${h2}:${m2} `;
        } else {
            this.LblActiviteTime.string = '';
        }
    }

    /** 显示武将 */
    private showGenView(): void {
        this._genCfg = ModelMgr.I.HuarongdaoModel.getGenValueByKey(this._winInfo.Id);
        this.LblName.string = i18n.tt(this._genCfg.Name);
        UtilCocos.setLableQualityColor(this.LblName, this._genCfg.OddsTime);
        const headIcon = this._genCfg.Image === 1001 ? 20001 : this._genCfg.Image;
        this.SprIcon.loadImage(`${RES_ENUM.HeadIcon}${headIcon}`, 1, true);
        // 品质底图
        // this.SprQualityBg.loadImage(UtilItem.GetItemQualityBgPath(this._genCfg.OddsTime), 1, true);
        this.SprQualityKuang.loadImage(UtilItem.GetItemIconPath('200110'), 1, true);
    }

    // update (dt) {}
}
