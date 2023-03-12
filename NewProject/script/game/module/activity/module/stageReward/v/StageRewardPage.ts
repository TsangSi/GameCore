/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/*
 * @Author: kexd
 * @Date: 2023-01-09 09:43:05
 * @FilePath: \SanGuo2.4\assets\script\game\module\activity\module\stageReward\v\StageRewardPage.ts
 * @Description: 阶段奖励（等级、战力、vip等）
 *
 */

import { EventClient } from '../../../../../../app/base/event/EventClient';
import ListView from '../../../../../base/components/listview/ListView';
import { WinTabPage } from '../../../../../com/win/WinTabPage';
import { E } from '../../../../../const/EventName';
import ControllerMgr from '../../../../../manager/ControllerMgr';
import ModelMgr from '../../../../../manager/ModelMgr';
import { ActData } from '../../../ActivityConst';
import { DynamicImage } from '../../../../../base/components/DynamicImage';
import { ERewardState, EStageType, IStageReward } from '../StageRewardConst';
import StageRewardItem from './StageRewardItem';
import { Config } from '../../../../../base/config/Config';
import { ConfigConst } from '../../../../../base/config/ConfigConst';
import { RoleMgr } from '../../../../role/RoleMgr';
import { UtilNum } from '../../../../../../app/base/utils/UtilNum';
import { i18n } from '../../../../../../i18n/i18n';
import { RoleAN } from '../../../../role/RoleAN';

const { ccclass, property } = cc._decorator;

@ccclass
export default class StageRewardPage extends WinTabPage {
    @property(DynamicImage)
    private Banner: DynamicImage = null;
    @property(cc.Label)
    private LabDesc: cc.Label = null;
    @property(cc.Label)
    private LabCurType: cc.Label = null;
    @property(cc.Label)
    private LabCurVal: cc.Label = null;
    @property(ListView)
    private ListReward: ListView = null;

    private _actData: ActData = null;
    // private _stageData: S2CGetStageReward = null;
    private _listData: IStageReward[] = [];

    public init(winId: number, param: unknown, tabIdx: number, tabId?: number): void {
        super.init(winId, param, tabIdx, tabId);
        this.addE();
        this.getData(tabId);
    }

    public refreshPage(winId: number, param: unknown, tabIdx: number, tabId?: number): void {
        super.refreshPage(winId, param, tabIdx, tabId);
        this.getData(tabId);
    }

    private getData(tabId: number) {
        this._actData = ModelMgr.I.ActivityModel.getActivityData(tabId);
        // this._stageData = ModelMgr.I.StageRewardModel.getStageData(this._actData.FuncId);
        ControllerMgr.I.ActivityController.reqC2SGetActivityConfig(this._actData.FuncId);
        ControllerMgr.I.ActivityController.reqC2SPlayerActModelData(this._actData.FuncId);
        this.uptUI();
    }

    private addE() {
        EventClient.I.on(E.Activity.Data, this.uptActData, this);
        EventClient.I.on(E.StageReward.UptStage, this.uptReward, this);
        // 监听人物的等级、战力，若阶段奖励有新类型，需添加新的监听
        RoleMgr.I.on(this.uptRoleLevel, this, RoleAN.N.Level);
        RoleMgr.I.on(this.uptRoleFightValue, this, RoleAN.N.FightValue);
    }

    private remE() {
        EventClient.I.off(E.Activity.Data, this.uptActData, this);
        EventClient.I.off(E.StageReward.UptStage, this.uptReward, this);
        // 监听人物的等级、战力，若阶段奖励有新类型，需添加新的监听
        RoleMgr.I.off(this.uptRoleLevel, this, RoleAN.N.Level);
        RoleMgr.I.off(this.uptRoleFightValue, this, RoleAN.N.FightValue);
    }

    private uptRoleLevel() {
        if (this._listData && this._listData[0] && this._listData[0].cfg.ConditionType === EStageType.Level) {
            this.uptCur();
            this.updateList();
        }
    }

    private uptRoleFightValue() {
        if (this._listData && this._listData[0] && this._listData[0].cfg.ConditionType === EStageType.Power) {
            this.uptCur();
            this.updateList();
        }
    }

    private uptActData(data: S2CPlayerActModelData) {
        if (data.FuncId === this._actData.FuncId && data.CycNo === this._actData.CycNo) {
            this.updateList();
        }
    }
    private uptReward(data: S2CGetStageReward) {
        if (data.FuncId === this._actData.FuncId && data.CycNo === this._actData.CycNo) {
            this.updateList();
        }
    }

    private uptCur() {
        if (this._actData) {
            const cfgUI: Cfg_StageRewardsUI = Config.Get(ConfigConst.Cfg_StageRewardsUI).getValueByKey(this._actData.Config.ArgsGroup);
            // Banner上的描述
            this.LabDesc.string = cfgUI.Desc1;
            // 根据类型显示不同的数值
            let values: string = '';
            switch (cfgUI.ConditionType) {
                case EStageType.Power:
                    values = UtilNum.ConvertFightValue(RoleMgr.I.d.FightValue);
                    break;
                case EStageType.Level:
                    values = `${RoleMgr.I.d.Level}${i18n.lv}`;
                    break;
                default:
                    break;
            }
            this.LabCurType.string = `${cfgUI.Desc3}:`;
            this.LabCurVal.string = values;
        }
    }

    private uptUI() {
        this.uptCur();
        // Banner
        if (this._actData && this._actData.Config.BannerPath) {
            this.Banner.loadImage(this._actData.Config.BannerPath, 1, true);
        }
    }

    private updateList(): void {
        this._listData = ModelMgr.I.StageRewardModel.getStageRewards(this._actData.FuncId, this._actData.Config.ArgsGroup);
        this.ListReward.setNumItems(this._listData.length);
    }

    private onRenderList(nd: cc.Node, index: number): void {
        const item = nd.getComponent(StageRewardItem);
        item.setData(this._listData[index]);
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
