/*
 * @Author: myl
 * @Date: 2022-10-12 18:30:07
 * @Description:
 */

import { UtilTime } from '../../../../../app/base/utils/UtilTime';
import { ResMgr } from '../../../../../app/core/res/ResMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { DynamicImage } from '../../../../base/components/DynamicImage';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItemList from '../../../../base/utils/UtilItemList';
import UtilRedDot from '../../../../base/utils/UtilRedDot';
import { ItemWhere } from '../../../../com/item/ItemConst';
import { RES_ENUM } from '../../../../const/ResPath';
import { UI_PATH_ENUM } from '../../../../const/UIPath';
import ControllerMgr from '../../../../manager/ControllerMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import { RoleOfficialItemIcon } from './RoleOfficialItemIcon';

const { ccclass, property } = cc._decorator;

@ccclass
export class RoleOfficialRewardItem extends cc.Component {
    @property(cc.Node)
    private NdReward: cc.Node = null;

    @property(cc.Node)
    private NdGetReward: cc.Node = null;

    @property(cc.Node)
    private NdUnlock: cc.Node = null;

    @property(cc.Node)
    private NdGatedReward: cc.Node = null;

    @property(cc.Label)
    private OfficialNameLab: cc.Label = null;

    @property(cc.Label)
    private LabTime: cc.Label = null;
    @property(cc.Label)
    private LabOfficial: cc.Label = null;

    @property(DynamicImage)
    private RankSpr: DynamicImage = null;

    private _data: OfficeTargetReward = null;
    private _configData: {
        name1: string,
        name2: string,
        conf: Cfg_Official
    } = null;
    protected start(): void {
        UtilGame.Click(this.NdGetReward, this.getReward, this);
    }

    private scheduleCallback: Function = null;
    public setData(data: OfficeTargetReward): void {
        this._data = data;
        const model = ModelMgr.I.RoleOfficeModel;
        this._configData = model.getOfficialInfo(data.Level);
        if (this.NdReward) {
            UtilItemList.ShowItems(this.NdReward, this._configData.conf.Gift, { option: { needNum: true, where: ItemWhere.OTHER } });
        }
        const officialCfg = ModelMgr.I.RoleOfficeModel.getOfficialInfo(data.Level);
        this.OfficialNameLab.string = officialCfg.name1;

        if (model.officialLevel < data.Level) {
            this.NdUnlock.active = true;
            this.NdGetReward.active = false;
            this.NdGatedReward.active = false;
            this.LabOfficial.string = i18n.tt(Lang.official_rank_reward_tip).replace('xx', `${officialCfg.name1}•${officialCfg.name2}`);
        } else {
            this.NdUnlock.active = false;
            this.NdGetReward.active = data.State === 0;
            this.NdGatedReward.active = data.State === 1;
            UtilRedDot.UpdateRed(this.NdGetReward, data.State === 0, cc.v2(55, 25));
        }

        // 处理显示限时的item 和提示
        const date = UtilTime.NowSec();
        // 日期过期 并且 官职为未达到
        if (date > data.LimitExpireTimestamp) {
            // 不显示倒计时奖励
        } else {
            // 显示倒计时奖励
            ResMgr.I.showPrefab(UI_PATH_ENUM.Module_RoleOfficial_Official_RoleOfficialItemIcon, this.NdReward, (err, nd: cc.Node) => {
                const itm = nd.getComponent(RoleOfficialItemIcon);
                itm.setData(this._configData.conf.GiftLimit);
            });
        }

        if (date < data.LimitExpireTimestamp && model.officialLevel < data.Level) {
            // 显示倒计时
            this.LabTime.node.active = true;
            this.LabTime.string = i18n.tt(Lang.official_time_reward) + UtilTime.FormatDate(data.LimitExpireTimestamp - date);
        } else {
            // 不显示倒计时
            this.LabTime.node.active = false;
        }

        this.RankSpr.loadImage(`${RES_ENUM.Com_Img_Img_Gz_Pinjie_0}${this._configData.conf.Quality}`, 1, true);
        if (this.scheduleCallback) {
            this.unschedule(this.scheduleCallback);
            this.scheduleCallback = null;
        }
        this.scheduleCallback = this.resetTimer.bind(this);
        this.schedule(this.scheduleCallback, 1, cc.macro.REPEAT_FOREVER);
    }

    private resetTimer() {
        if (this.LabTime.node.active) {
            const date = UtilTime.NowSec();
            this.LabTime.string = i18n.tt(Lang.official_time_reward) + UtilTime.FormatDate(this._data.LimitExpireTimestamp - date);
        }
    }

    private getReward(): void {
        // 领取官职等级任务奖励
        ControllerMgr.I.RoleOfficialController.getOfficialRankReward(this._data.Level);
    }
}
