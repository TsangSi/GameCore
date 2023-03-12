/*
 * @Author: hrd
 * @Date: 2022-09-19 18:29:28
 * @Description: 音效行为
 *
 */

import { AudioMgr } from '../../../app/base/manager/AudioMgr';
import ModelMgr from '../../manager/ModelMgr';
import { ActionBase } from './base/ActionBase';

export class TAudioEffAction extends ActionBase {
    /** 技能行为id */
    private mSkillActionId: number = 0;

    public static Create(skillActionId: number): TAudioEffAction {
        const action = new TAudioEffAction();
        action.mSkillActionId = skillActionId;

        return action;
    }

    public onEnter(): void {
        super.onEnter();
        this.onPlay();
    }

    private onPlay() {
        const actCfg: Cfg_SkillActions = ModelMgr.I.BattleModel.getSkillActionCfg(this.mSkillActionId);
        if (!actCfg) {
            return;
        }
        const skillSound = actCfg.SkillSound;
        if (!skillSound) {
            return;
        }
        const paht = `audio/battle/skill/${skillSound}`;
        AudioMgr.I.playEffect(paht, { isRemote: true });
    }
}
