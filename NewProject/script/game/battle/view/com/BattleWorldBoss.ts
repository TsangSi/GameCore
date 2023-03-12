/*
 * @Author: zs
 * @Date: 2022-09-08 18:51:50
 * @FilePath: \SanGuo\assets\script\game\battle\view\com\BattleWorldBoss.ts
 * @Description:
 *
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import Progress from '../../../base/components/Progress';
import { Config } from '../../../base/config/Config';
import { ConfigDropRewardIndexer } from '../../../base/config/indexer/ConfigDropRewardIndexer';
import { E } from '../../../const/EventName';
import { FuncDescConst } from '../../../const/FuncDescConst';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { RollFrame } from '../../../module/worldBoss/v/com/RollFrame';
import { EBossEventType, ECfgWorldBossConfigKey, IRollFrameOpts } from '../../../module/worldBoss/WorldBossConst';
import { IBattleCampAtkInfo } from '../../WarConst';

const { ccclass, property } = cc._decorator;

interface IBattleWorldBossNode extends cc.Node {
    /** 护盾值 */
    shieldValue?: number
}
@ccclass
export class BattleWorldBoss extends BaseCmp {
    /** 护盾条 */
    @property(Progress)
    private ProgressShield: Progress = null;
    /** 血条 */
    @property(Progress)
    private ProgressHp: Progress = null;

    /** 剩余时间 */
    private leftTime: number = 0;

    /** 护盾值 */
    private shieldValue: number = 0;
    private keepTime: number = 0;
    protected onLoad(): void {
        super.onLoad();
        const node: IBattleWorldBossNode = this.node;
        this.shieldValue = node.shieldValue;

        const model = ModelMgr.I.WorldBossModel;
        this.keepTime = model.endTime - model.startTime;
        this.leftTime = model.endTime - UtilTime.NowSec();
        this.ProgressShield.node.active = false;
        EventClient.I.on(E.Battle.MyCampAtkCount, this.onMyCampAtkCount, this);
        EventClient.I.on(E.Battle.NoticeBossShieldVal, this.onNoticeBossShieldVal, this);
        EventClient.I.on(E.WorldBoss.UpdateRollFrameStatus, this.onUpdateRollFrameStatus, this);
        this.udpateHP();
    }

    protected start(): void {
        super.start();
        const rollS = ModelMgr.I.WorldBossModel.getRollShowStatus();
        if (rollS && rollS.IsOpen) {
            this.onUpdateRollFrameStatus(!!rollS.IsOpen, rollS.EndTime);
        }
    }

    /** 一秒执行一次 */
    protected updatePerSecond(): void {
        if (this.leftTime > 0) {
            this.leftTime--;
            this.udpateHP();
        }
    }

    /** 更新血量 */
    private udpateHP() {
        this.ProgressHp.updateProgress(this.leftTime, this.keepTime, false);
        // console.log('this.keepTime, this.leftTime=', this.keepTime, this.leftTime);
        EventClient.I.emit(E.Battle.UpBossEnittyHp, { currHp: this.leftTime, maxHp: this.keepTime });
    }

    /** 战斗中-我方攻击事件 */
    private onMyCampAtkCount(obj: IBattleCampAtkInfo) {
        if (obj.campId === ModelMgr.I.WorldBossModel.bossCamp) {
            this.shieldValue -= +ModelMgr.I.WorldBossModel.getCfgValue(ECfgWorldBossConfigKey.ShieldCamp);
        } else {
            this.shieldValue -= 1;
        }
        if (this.shieldValue >= 0 && this.ProgressShield.node.active) {
            this.ProgressShield.updateProgress(this.shieldValue, false);
        }
    }

    /** 护盾初始值 */
    private onNoticeBossShieldVal(FBossShield: number) {
        this.shieldValue += FBossShield;
        if (FBossShield > 0) {
            this.ProgressShield.node.active = true;
            this.ProgressShield.updateProgress(this.shieldValue, ModelMgr.I.WorldBossModel.shieldMaxValue, false);
        } else {
            this.ProgressShield.node.active = false;
        }
        this.udpateHP();
    }

    private onUpdateRollFrameStatus(isOpen: boolean, endTime: number) {
        if (isOpen) {
            this.showRollFrame(endTime);
        } else {
            this.closeRollFrame();
        }
    }

    /** 显示拼点弹窗 */
    private showRollFrame(endTime: number) {
        ResMgr.I.showPrefabOnce(UI_PATH_ENUM.RollFrame, this.node, this.showRollFrameCallback, { target: this, customData: endTime });
    }

    /** 显示拼点弹窗回调 */
    private showRollFrameCallback(e: Error, node: cc.Node, endTime: number) {
        const model = ModelMgr.I.WorldBossModel;
        if (!model.getRollShowStatus()) {
            this.closeRollFrame();
            return;
        }
        const keepTime = +model.getCfgValue(ECfgWorldBossConfigKey.RollOpenTime);
        const topName = model.getRollTopName();
        const topValue = model.getRollTopValue();

        const groupId = ModelMgr.I.WorldBossModel.getCfgValue(ECfgWorldBossConfigKey.RollPrize);
        const cfgRwd = Config.Get<ConfigDropRewardIndexer>(Config.Type.Cfg_DropReward).getValueByDay(+groupId);
        const strItem = cfgRwd.ShowItems.split('|')[0];
        const item = strItem.split(':');

        const opts: IRollFrameOpts = {
            target: this,
            value: model.curRollValue,
            autoRoll: model.getAutoRoll(),
            topName,
            topValue,
            ItemId: +item[0],
            ItemNum: +item[1],
            helpId: FuncDescConst.RollFrame,
        };
        node.getComponent(RollFrame).setData(endTime, keepTime, this.onBtnRollClicked, this.onToggleAutoRoll, opts);
    }

    /** 点击开始拼点 */
    private onBtnRollClicked() {
        ControllerMgr.I.WorldBossController.C2SWorldBossRandomDice();
    }

    /** 勾选自动拼点 */
    private onToggleAutoRoll(b: boolean) {
        ModelMgr.I.WorldBossModel.setAutoRoll(b);
    }

    /** 关闭拼点弹窗 */
    private closeRollFrame() {
        this.node.getChildByName('RollFrame')?.destroy();
        this.onClearCurRollValue();
    }

    private onClearCurRollValue() {
        ModelMgr.I.WorldBossModel.clearRoll();
    }
    protected onDestroy(): void {
        EventClient.I.off(E.Battle.MyCampAtkCount, this.onMyCampAtkCount, this);
        EventClient.I.off(E.Battle.NoticeBossShieldVal, this.onNoticeBossShieldVal, this);
        EventClient.I.off(E.WorldBoss.UpdateRollFrameStatus, this.onUpdateRollFrameStatus, this);
    }
}
