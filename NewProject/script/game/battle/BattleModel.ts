/*
 * @Author: hrd
 * @Date: 2022-06-21 14:35:49
 * @FilePath: \SanGuo\assets\script\game\battle\BattleModel.ts
 * @Description:
 *
 */

import { UtilArray } from '../../app/base/utils/UtilArray';
import { UtilString } from '../../app/base/utils/UtilString';
import BaseModel from '../../app/core/mvc/model/BaseModel';
import { Config } from '../base/config/Config';
import { ConfigConst } from '../base/config/ConfigConst';
import { ConfigIndexer } from '../base/config/indexer/ConfigIndexer';
import { ConfigModIndexer } from '../base/config/indexer/ConfigModIndexer';
import { UtilSkillInfo } from '../base/utils/UtilSkillInfo';
import MapCfg from '../map/MapCfg';
import { BattleMgr } from './BattleMgr';
import { DamagResultType } from './WarConst';

const { ccclass } = cc._decorator;
@ccclass('BattleModel')
export class BattleModel extends BaseModel {
    public clearAll(): void {
        throw new Error('Method not implemented.');
    }

    /** 获取技能配置数据 */
    public getSkillCfg(skillId: number): Cfg_Skill {
        const skillCfg: Cfg_Skill = Config.Get(ConfigConst.Cfg_Skill).getValueByKey(skillId);
        return skillCfg;
    }

    public getSkillName(skillId: number): string {
        return UtilSkillInfo.GetSkillName(skillId);
    }

    /**
     * 获取技能行为id
     * @param skillId 技能id
     * @param animId 目标战斗对象模型id
     * @returns ActionId
     */
    public getSkillActionId(skillId: number, animId: number): number {
        const skillCfg = this.getSkillCfg(skillId);
        if (!skillCfg) {
            return 0;
        }
        let actId = skillCfg.ActionId;
        if (skillCfg.ActionCond) {
            const ret = this.parseActionCond(skillCfg.ActionCond, animId);
            if (ret) actId = ret;
        }
        return actId;
    }

    /** 解析技能行为触发条件参数 */
    private parseActionCond(ActionCond: string, animId: number): number {
        const paramArr = UtilString.SplitToArray(ActionCond);
        let actId = 0;
        for (let i = 0; i < paramArr.length; i++) {
            const element = paramArr[i];
            if (+element[0] === animId) {
                actId = +element[1];
            }
        }
        return actId;
    }

    /** 获取技能行为数据 */
    public getSkillActionCfg(ActionId: number): Cfg_SkillActions {
        if (!ActionId) {
            return null;
        }
        const actCfg: Cfg_SkillActions = Config.Get(ConfigConst.Cfg_SkillActions).getValueByKey(ActionId);
        return actCfg;
    }

    /** 获取buff数据 */
    public getClintBuffCfg(bufType: number): Cfg_BuffClint {
        const cfg: Cfg_BuffClint = Config.Get(ConfigConst.Cfg_BuffClint).getValueByKey(bufType);
        return cfg;
    }

    /** 获取模型挂载点 */
    public getModelMountPoint(animId: number, index: number): cc.Vec2 {
        const indexer: ConfigModIndexer = Config.Get(Config.Type.Cfg_Mod);
        const c: cc.Vec2[] = indexer.getMountPoint(animId);
        if (!c || c.length === 0) {
            return cc.v2(0, 0);
        }
        return c[index];
    }

    /** 获取战斗喊话 */
    public getBattleChatStr(talkId: number): string {
        const indexer: ConfigIndexer = Config.Get(Config.Type.Cfg_TalkWord);
        const talks: number[] = indexer.getValueByKey(talkId);
        // console.log('===========talks++++++++++++');

        console.log(talks);

        const randomIndex = UtilArray.GetRandom(talks);
        const config: Cfg_TalkWord = indexer.getValueByIndex(randomIndex);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        return config.Word;
    }

    /**
     * 获取飘字文本
     * @param effId 效果id
     * @param value 效果值
     * @returns
     */
    public getWordStrByEffId(effId: number, value: number): string {
        const EffId = effId;
        const hitVal = value;
        const CfgAtk: Cfg_AtkEffect = Config.Get(ConfigConst.Cfg_AtkEffect).getValueByKey(EffId);
        if (!CfgAtk) return '';
        if (!CfgAtk.ResultType) {
            return '';
        }
        let make = '';
        if (CfgAtk.ResultType === DamagResultType.AddHp) {
            make = '+';
        } else if (CfgAtk.ResultType === DamagResultType.SubHp) {
            make = '-';
        }
        let percentMake = '';
        if (CfgAtk.PercentSign) { // 是否显示百分号
            percentMake = '%';
        }
        const strVal = `${make}${hitVal}${percentMake}`;
        return strVal;
    }

    /**
     * 是否显示跳过战斗
     * @param turnNum
     * @returns
     */
    public isShowJumpWar(turnNum: number): boolean {
        const fbType = BattleMgr.I.curBattleType;
        if (!fbType) {
            return false;
        }
        const cfg: Cfg_FightScene = Config.Get(ConfigConst.Cfg_FightScene).getValueByKey(fbType);
        if (!cfg || !cfg.Jump) {
            return false;
        }
        if (turnNum >= cfg.Jump) {
            return true;
        }
        return false;
    }

    /**
     * 获取战背景
     * @returns
     */
    public getBattleBgId(): number {
        let bgId: number = MapCfg.I.mapData.BattleBg;
        const fbType = BattleMgr.I.curBattleType;
        if (fbType) {
            const cfg: Cfg_FightScene = Config.Get(ConfigConst.Cfg_FightScene).getValueByKey(fbType);

            if (cfg && cfg.BattleBg) {
                bgId = cfg.BattleBg;
            }
        }
        return bgId;
    }
}
