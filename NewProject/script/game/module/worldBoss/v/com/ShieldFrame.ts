/*
 * @Author: zs
 * @Date: 2022-09-01 20:28:14
 * @FilePath: \SanGuo-2.4-main\assets\script\game\module\worldBoss\v\com\ShieldFrame.ts
 * @Description:
 *
 */
import { EventClient } from '../../../../../app/base/event/EventClient';
import { UtilBool } from '../../../../../app/base/utils/UtilBool';
import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import { UtilTime } from '../../../../../app/base/utils/UtilTime';
import BaseCmp from '../../../../../app/core/mvc/view/BaseCmp';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import Progress from '../../../../base/components/Progress';
import { Config } from '../../../../base/config/Config';
import { UtilGame } from '../../../../base/utils/UtilGame';
import { UtilSkillInfo } from '../../../../base/utils/UtilSkillInfo';
import { E } from '../../../../const/EventName';
import { RES_ENUM } from '../../../../const/ResPath';
import { ViewConst } from '../../../../const/ViewConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class ShieldFrame extends BaseCmp {
    @property(cc.Node)
    private BtnHelp: cc.Node = null;
    @property(Progress)
    private Progress: Progress = null;
    @property(cc.Label)
    private LabelCamp: cc.Label = null;
    @property(cc.RichText)
    private LabelDesc: cc.RichText = null;
    @property(cc.Label)
    private LabelTime: cc.Label = null;
    @property(cc.Sprite)
    private SpriteSkillIcon: cc.Sprite = null;
    @property(cc.Label)
    private LabelSkillName: cc.Label = null;
    @property(cc.Node)
    private NodelFunnel: cc.Node = null;
    private helpId: number = 0;
    private endTimeStamp = 0;
    /**
     * 设置护盾数据
     * @param endTimeStamp 结束时间戳
     * @param toalTime 总时间
     * @param camp 阵营
     * @param skillId 技能id
     * @param opts 可选的扩展参数
     */
    // eslint-disable-next-line max-len
    public setData(endTimeStamp: number, curNum: number, maxNum: number, camp: string, skillId: number, opts?: { helpId?: number, skillName?: string }): void {
        this.endTimeStamp = endTimeStamp;
        this.Progress.updateProgress(curNum, maxNum, false);
        this.LabelCamp.string = camp;
        const cfgSkill = UtilSkillInfo.GetCfg(skillId);
        this.LabelDesc.string = UtilSkillInfo.GetSkillDesc(cfgSkill);
        UtilCocos.LoadSpriteFrameRemote(this.SpriteSkillIcon, `${RES_ENUM.Skill}${cfgSkill.SkillIconID}`);
        if (opts && !UtilBool.isNullOrUndefined(opts.skillName)) {
            this.LabelSkillName.string = opts.skillName;
        } else {
            this.LabelSkillName.string = cfgSkill.SkillName;
        }
        const action = cc.tween(this.NodelFunnel).delay(1).by(0.5, { angle: 180 });
        cc.tween(this.NodelFunnel).then(action).repeatForever()
            .start();
        this.LabelTime.string = UtilTime.FormatTime(this.endTimeStamp - UtilTime.NowSec());
        this.helpId = opts?.helpId;
        UtilCocos.SetActive(this.BtnHelp, !!this.helpId);
    }

    protected onLoad(): void {
        super.onLoad();
        EventClient.I.on(E.ShieldFrame.UpdateProgress, this.onUpdateProgress, this);
        UtilGame.Click(this.BtnHelp, this.onBtnHelpClicked, this);
    }

    private onBtnHelpClicked() {
        WinMgr.I.open(ViewConst.DescWinTip, this.helpId);
    }

    private onUpdateProgress(curNum: number): void {
        this.Progress.updateProgress(curNum, false);
    }

    private lastTime: number = 0;
    protected update(dt: number): void {
        super.update(dt);
        const time = this.endTimeStamp - UtilTime.NowSec();
        if (this.lastTime !== time) {
            this.lastTime = time;
            if (time > 0) {
                this.LabelTime.string = UtilTime.FormatTime(time);
            } else {
                this.node.destroy();
            }
        }
    }

    protected onDestroy(): void {
        EventClient.I.off(E.ShieldFrame.UpdateProgress, this.onUpdateProgress, this);
    }
}
