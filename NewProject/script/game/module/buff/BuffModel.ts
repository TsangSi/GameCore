/*
 * @Author: zs
 * @Date: 2023-02-16 11:08:06
 * @Description:
 *
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { EventClient } from '../../../app/base/event/EventClient';
import { UtilArray } from '../../../app/base/utils/UtilArray';
import { UtilString } from '../../../app/base/utils/UtilString';
import { UtilTime } from '../../../app/base/utils/UtilTime';
import BaseModel from '../../../app/core/mvc/model/BaseModel';
import { i18n, Lang } from '../../../i18n/i18n';
import { Config } from '../../base/config/Config';
import { ConfigConst } from '../../base/config/ConfigConst';
import { E } from '../../const/EventName';
import { EIncreaseType, IBuffAddEffectData } from './BuffConst';

export interface IIncreaseSkillEx extends IncreaseSkill {
    /** 描述 */
    desc?: string,
    /** 标题文字 */
    title?: string
}

const { ccclass, property } = cc._decorator;
@ccclass
export default class BuffModel extends BaseModel {
    public clearAll(): void {
        // throw new Error("Method not implemented.");
    }

    /** buff数量 */
    private buffNum: number = 0;
    private buffData: { [skillId: number]: IIncreaseSkillEx } = cc.js.createMap(true);
    /** 更新技能 */
    public updateBuff(buffs: IncreaseSkill[]): void {
        const adds: number[] = [];
        const updates: number[] = [];
        buffs.forEach((b) => {
            if (!this.buffData[b.SkillId]) {
                adds.push(b.SkillId);
            }
            updates.push(b.SkillId);
            this.buffData[b.SkillId] = b;
        });

        if (adds.length > 0) {
            this.buffNum += adds.length;
            EventClient.I.emit(E.Buff.Add, adds);
        }
        if (updates.length > 0) {
            EventClient.I.emit(E.Buff.Update, updates);
        }
    }

    /** 删除技能 */
    public delBuff(skillId: number): void {
        if (this.buffData[skillId]) {
            this.buffData[skillId] = undefined;
            delete this.buffData[skillId];
            this.buffNum--;
        }
        EventClient.I.emit(E.Buff.Del, skillId);
    }

    public getBuff(skillId: number): IncreaseSkill {
        return this.buffData[skillId];
    }

    /** 获取buff数量 */
    public getBuffNum(): number {
        return this.buffNum;
    }

    /**
     * 根据buffid获取buff描述
     * @param skillId buffID
     */
    public getBuffDesc(skillId: number): string
    /**
     * 根据buff配置获取buff描述
     * @param cfgIncreaseSkill buff配置
     */
    public getBuffDesc(cfgIncreaseSkill: Cfg_IncreaseSkill): string
    public getBuffDesc(skillId: number | Cfg_IncreaseSkill): string {
        let cfgInc: Cfg_IncreaseSkill;
        if (typeof skillId === 'number') {
            cfgInc = Config.Get(Config.Type.Cfg_IncreaseSkill).getValueByKey(skillId);
        } else {
            cfgInc = skillId;
        }
        if (cfgInc) {
            const pers: number[] = [];
            cfgInc.SkillEffect.split('|').forEach((element) => {
                if (element) {
                    const p = +element.split(':')[1];
                    if (p) {
                        pers.push(p / 100);
                    } else {
                        pers.push(0);
                    }
                }
            });
            return UtilString.FormatArray(cfgInc.SkillDesc, pers);
        }
        return '';
    }

    public getAddEffectByTypes(types: EIncreaseType[]): IBuffAddEffectData {
        const addData: IBuffAddEffectData = cc.js.createMap(true);
        addData.skillIds = [];
        addData.addEffect = cc.js.createMap(true);
        for (const id in this.buffData) {
            const data = this.buffData[id];
            const cfg = Config.Get(Config.Type.Cfg_IncreaseSkill).getValueByKey<Cfg_IncreaseSkill>(data.SkillId);
            if (cfg.SkillEffect) {
                let has: boolean = false;
                cfg.SkillEffect.split('|').forEach((effect) => {
                    const es = effect?.split(':');
                    if (es && es[0] && es[0] !== '0') {
                        const type = +es[0];
                        if (types.indexOf(type) >= 0) {
                            has = true;
                            addData.addEffect[type] = addData.addEffect[type] || 0;
                            addData.addEffect[type] += +es[1];
                        }
                    }
                });
                if (has) {
                    addData.skillIds.push(+id);
                }
            }
        }
        return addData;
    }

    /**
     * 获取所有buff
     * @param isViewShow 是否界面显示
     * @returns
     */
    public getAllBuff(isViewShow: boolean = true): IIncreaseSkillEx[] {
        const buffs: IIncreaseSkillEx[] = [];
        /** 最长时间的显示加成结束时间戳 */
        let maxEndTime: number = 9999999999;
        /** 是否有限时加成buff */
        let isHasTime = false;
        /** 是否有永久加成buff */
        let isHasPermanent = false;
        /** 限时加成buff的数量 */
        let timeNum: number = 0;
        const curTime: number = UtilTime.NowSec();
        for (const id in this.buffData) {
            const data = this.buffData[id];
            if (data && Config.Get(Config.Type.Cfg_IncreaseSkill).getValueByKey<Cfg_IncreaseSkill>(data.SkillId)?.ShowBuff) {
                if (data.LifeTime > 0) {
                    if (data.LifeTime <= curTime) {
                        this.delBuff(data.SkillId);
                        continue;
                    }
                    if (!isHasTime) {
                        isHasTime = true;
                    }
                    timeNum++;
                }
                if (!isHasPermanent && data.LifeTime === 0) {
                    isHasPermanent = true;
                }
                // eslint-disable-next-line no-loop-func
                UtilArray.Insert(buffs, data, (n: IncreaseSkill) => {
                    if (n.LifeTime > 0) {
                        maxEndTime = Math.max(maxEndTime, n.LifeTime);
                        return n.LifeTime;
                    } else {
                        return maxEndTime + 1;
                    }
                });
            }
        }
        if (isViewShow) {
            if (!isHasTime) {
                // 没有限时加成buff，在头部插入没有限时buff的显示内容
                const p: IIncreaseSkillEx = new IncreaseSkill();
                p.desc = i18n.tt(Lang.bufflist_item_time_empty);
                buffs.unshift(p);
                timeNum++;
            }
            if (!isHasPermanent) {
                // 没有永久加成buff，在尾部插入没有永久加成的显示内容
                const p: IIncreaseSkillEx = new IncreaseSkill();
                p.desc = i18n.tt(Lang.bufflist_item_permanent_empty);
                buffs.push(p);
            }
            // 在头部插入限时加成标题
            const timeP: IIncreaseSkillEx = new IncreaseSkill();
            timeP.title = i18n.tt(Lang.bufflist_item_time_title);
            buffs.unshift(timeP);
            timeNum++;
            // 在最后一个限时加成后面插入一个永久加成的标题
            const p: IIncreaseSkillEx = new IncreaseSkill();
            p.title = i18n.tt(Lang.bufflist_item_permanent_title);
            buffs.splice(timeNum, 0, p);
        }
        return buffs;
    }

    public getSkillCfg(skillId: number, lv: number): Cfg_IncreaseSkill {
        const indexer = Config.Get(ConfigConst.Cfg_IncreaseSkill);
        return indexer.getValueByKey(skillId);
    }

    public getSkillCfgDesc(skillId: number, lv: number): string {
        const cfg = this.getSkillCfg(skillId, lv);
        let val = cfg.SkillEffect.split(':')[1];
        if (val) {
            val /= 100;
        }
        return UtilString.FormatArray(cfg.SkillDesc, [val]);
    }
}
