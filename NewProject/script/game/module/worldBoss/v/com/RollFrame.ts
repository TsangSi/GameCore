/*
 * @Author: zs
 * @Date: 2022-09-01 20:28:00
 * @FilePath: \SanGuo2.4\assets\script\game\module\worldBoss\v\com\RollFrame.ts
 * @Description:
 *
 */
import { EventClient } from '../../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import { UtilNum } from '../../../../../app/base/utils/UtilNum';
import { UtilTime } from '../../../../../app/base/utils/UtilTime';
import BaseCmp from '../../../../../app/core/mvc/view/BaseCmp';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import Progress from '../../../../base/components/Progress';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItem from '../../../../base/utils/UtilItem';
import { E } from '../../../../const/EventName';
import { ViewConst } from '../../../../const/ViewConst';
import { RoleMgr } from '../../../role/RoleMgr';
import { ECfgWorldBossConfigKey, IRollFrameOpts } from '../../WorldBossConst';
import ModelMgr from '../../../../manager/ModelMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export class RollFrame extends BaseCmp {
    @property(cc.Node)
    private BtnHelp: cc.Node = null;
    @property(cc.Node)
    private NodeItem: cc.Node = null;
    @property(cc.Label)
    private LabelTopRoll: cc.Label = null;
    @property(cc.Label)
    private LabelTopName: cc.Label = null;
    @property(cc.Node)
    private BtnRoll: cc.Node = null;
    @property(cc.Label)
    private LabelRoll: cc.Label = null;
    @property(cc.Node)
    private NodeRollResult: cc.Node = null;
    @property(cc.Toggle)
    private ToggleAuto: cc.Toggle = null;
    @property(Progress)
    private Progress: Progress = null;
    /** 是否随机 */
    private isRandom: boolean = false;
    /** 随机时间 */
    private randomTime: number = 0;
    /** 记录自己的拼点值 */
    private rollValue: number = 0;
    /** 记录最高值 */
    private topValue: number = 0;
    /** 记录最高值的玩家显示的名字 */
    private topName: string = '';
    /** 记录最高值的玩家的id */
    private topUserId: number = 0;
    private endTimeStamp: number = 0;
    private helpId: number = 0;
    protected onLoad(): void {
        super.onLoad();
        EventClient.I.on(E.RollFrame.UpdateTopRoll, this.onUpdateTopRoll, this);
        EventClient.I.on(E.RollFrame.UpdateRoll, this.onUpdateRoll, this);
        EventClient.I.on(E.RollFrame.UpdateAutoRoll, this.onUpdateAutoRoll, this);
        UtilGame.Click(this.BtnHelp, this.onBtnHelpClicked, this);
    }

    /**
     * 设置拼点弹窗的数据
     * @param endTimeStamp 结束时间戳
     * @param toalTime 总时间
     * @param autoRoll 是否已勾选自动拼点
     * @param clickFunc 点击拼点的回调
     * @param toggleFunc 勾选自动拼点的回调
     * @param opts - { target，topName，topValue，value }
    */
    // eslint-disable-next-line max-len
    public setData(endTimeStamp: number, toalTime: number, clickFunc: () => void, toggleFunc: (isChecked: boolean) => void, opts: IRollFrameOpts): void {
        this.endTimeStamp = endTimeStamp;
        if (opts.value) {
            this.showRollValueResult(opts.value);
        } else {
            this.onUpdateTopRoll(i18n.tt(Lang.com_noman_is), this.topValue);
            this.BtnRoll.active = true;
            this.NodeRollResult.active = false;
        }
        UtilGame.Click(this.BtnRoll, () => {
            this.startRoll(clickFunc, opts.target);
        }, this);

        // 设置勾选框回调
        if (toggleFunc) {
            this.ToggleAuto.node.on('toggle', (toggle: cc.Toggle) => {
                if (opts.target) {
                    toggleFunc.call(opts.target, toggle.isChecked);
                } else {
                    toggleFunc(toggle.isChecked);
                }
                if (toggle.isChecked) {
                    this.startRoll(clickFunc, opts.target);
                }
            }, this);
        }

        if (opts.topName || opts.topValue) {
            this.onUpdateTopRoll(opts.topName, opts.topValue);
        }

        this.Progress.updateProgress(endTimeStamp - UtilTime.NowSec(), toalTime, false);

        // 设置是否已经勾选上自动拼点
        this.onUpdateAutoRoll(opts.autoRoll || false);
        if (opts.autoRoll) {
            // 之前有设置过自动拼点，那么就开始拼点
            this.startRoll(clickFunc, opts.target);
        }
        const boxIconId = ModelMgr.I.WorldBossModel.getCfgValue(ECfgWorldBossConfigKey.RollIcon);
        UtilItem.Show(this.NodeItem, UtilItem.NewItemModel(+boxIconId, opts.ItemNum || 1), { option: { offClick: true } });
        this.helpId = opts.helpId;
        UtilCocos.SetActive(this.BtnHelp, !!this.helpId);
    }

    private lastTime = 0;
    /** 开始拼点 */
    private startRoll(clickFunc: () => void, target?: any) {
        if (!this.isRandom && !this.LabelRoll.string) {
            if (target) {
                clickFunc.call(target);
            } else {
                clickFunc();
            }
        }
    }

    /** 更新最高拼点的玩家姓名和拼点值 */
    private onUpdateTopRoll(name: string, rollValue: number, userId: number = 0): void {
        this.topValue = rollValue;
        this.topName = name;
        if (userId) {
            this.topUserId = userId;
        }
        if (userId !== RoleMgr.I.info.userID) {
            this.LabelTopName.string = name || '';
            this.LabelTopRoll.string = `${rollValue || 0}${i18n.tt(Lang.com_dian)}`;
        }
    }

    /** 更新自动拼点勾选框 */
    private onUpdateAutoRoll(b: boolean) {
        this.ToggleAuto.isChecked = b;
    }

    /** 更新自己的拼点值，先随机3秒，3秒后再显示结果 */
    private onUpdateRoll(rollValue: number): void {
        this.rollValue = rollValue;
        if (!this.isRandom) {
            this.randomTime = 1;
            this.isRandom = true;
            this.BtnRoll.active = false;
            this.NodeRollResult.active = true;
        }
    }

    /** 显示拼点值的结果 */
    private showRollValueResult(value: number) {
        this.rollValue = this.rollValue || value;
        this.isRandom = false;
        this.BtnRoll.active = false;
        this.NodeRollResult.active = true;
        this.LabelRoll.string = `${value}`;
        if (this.topUserId === RoleMgr.I.info.userID) {
            this.onUpdateTopRoll(this.topName, this.topValue);
        }
    }

    /** 点击拼点 */
    private onBtnRollClicked() {
        if (!this.isRandom) {
            this.isRandom = true;
            this.BtnRoll.active = false;
            this.NodeRollResult.active = true;
        }
    }

    private onBtnHelpClicked() {
        WinMgr.I.open(ViewConst.DescWinTip, this.helpId);
    }

    protected update(dt: number): void {
        super.update(dt);
        if (this.isRandom) {
            this.randomTime -= dt;
            if (this.randomTime <= 0) {
                this.showRollValueResult(this.rollValue);
            } else {
                this.LabelRoll.string = `${UtilNum.RandomInt(1, 100)}`;
            }
        }
        const time = this.endTimeStamp - UtilTime.NowSec();
        if (this.lastTime !== time) {
            this.lastTime = time;
            if (time >= 0) {
                this.Progress.updateProgress(time, false);
            } else {
                this.node.destroy();
                EventClient.I.emit(E.RollFrame.ClearCurRollValue);
            }
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.RollFrame.UpdateTopRoll, this.onUpdateTopRoll, this);
        EventClient.I.off(E.RollFrame.UpdateRoll, this.onUpdateRoll, this);
        EventClient.I.off(E.RollFrame.UpdateAutoRoll, this.onUpdateAutoRoll, this);
    }
}
