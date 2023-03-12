import { EventClient } from '../../../app/base/event/EventClient';
import { UtilTime } from '../../../app/base/utils/UtilTime';
import BaseModel from '../../../app/core/mvc/model/BaseModel';
import { Config } from '../../base/config/Config';
import { ConfigConst } from '../../base/config/ConfigConst';
import { ConfigMgr } from '../../base/config/ConfigMgr';
import { ConfigLimitConditionIndexer } from '../../base/config/indexer/ConfigLimitConditionIndexer';
import { E } from '../../const/EventName';
import { RoleMgr } from '../role/RoleMgr';

const { ccclass } = cc._decorator;
@ccclass('AdventureModel')
export class AdventureModel extends BaseModel {
    private _info: S2CAdventureInfo = null;

    public clearAll(): void {
        //
    }
    public clear(): void {
        //
    }

    public clearInfo(): void {
        this._info = null;
    }

    public setInfo(info: S2CAdventureInfo): void {
        if (this._info) {
            info.AdventureEventList.forEach((v) => {
                this.updateEvent(v);
            });
            info.AdventureEventList = this._info.AdventureEventList;
        }
        this._info = info;
    }

    public getInfo(): S2CAdventureInfo {
        return this._info;
    }

    public setPos(pos: number): void {
        if (this._info) this._info.Pos = pos;
    }

    /** sort */
    public sortEventTime(): void {
        if (this._info) {
            this._info.AdventureEventList.sort((a, b) => b.OverTime - a.OverTime);
            this._info.AdventureEventList.sort((a, b) => {
                if (a.EventId === 3 && a.EventWish.WishState !== 0) return 1;
                return -1;
            });
        }
    }

    /** 获取题目 */
    public getQuestion(id: number): Cfg_AdventureQuestion {
        const config = Config.Get(Config.Type.Cfg_AdventureQuestion);
        return config.getValueByKey(id);
    }

    /** 获取移动速度 */
    public getEventIcon(key: number): number {
        const config = Config.Get(Config.Type.Cfg_AdventureEvent);
        const item: Cfg_AdventureEvent = config.getValueByKey(key);
        return item.Icon;
    }

    /** 获取移动速度 */
    public getMoveSpeed(): number {
        const config = Config.Get(Config.Type.Cfg_AdventureNormal);
        const item: Cfg_AdventureNormal = config.getValueByKey('AdventureModelSpeed');
        return Number(item.CfgValue) / 1000.0;
    }

    /** 获取答题正确奖励 */
    public getQuestionRight(): string {
        const config = Config.Get(Config.Type.Cfg_AdventureNormal);
        const item: Cfg_AdventureNormal = config.getValueByKey('AdventureQuestionRight');
        return item.CfgValue;
    }

    /** 获取答题失败奖励 */
    public getQuestionWrong(): string {
        const config = Config.Get(Config.Type.Cfg_AdventureNormal);
        const item: Cfg_AdventureNormal = config.getValueByKey('AdventureQuestionWrong');
        return item.CfgValue;
    }

    /** 获取自动投注条件 */
    public getAutoLimit(): { state: boolean, info: Cfg_LimitCondition, desc: string } {
        const config = Config.Get(Config.Type.Cfg_AdventureNormal);
        const item: Cfg_AdventureNormal = config.getValueByKey('AdventureAutoLimit');
        const indexer: ConfigLimitConditionIndexer = Config.Get(ConfigConst.Cfg_LimitCondition);
        console.log(item.CfgValue);
        return indexer.getCondition(Number(item.CfgValue));
    }

    /** 获取跳过动画条件 */
    public getSkipLimit(): { state: boolean, info: Cfg_LimitCondition, desc: string } {
        const config = Config.Get(Config.Type.Cfg_AdventureNormal);
        const item: Cfg_AdventureNormal = config.getValueByKey('AdventureSkipLimit');
        console.log(item.CfgValue);
        const indexer: ConfigLimitConditionIndexer = Config.Get(ConfigConst.Cfg_LimitCondition);
        return indexer.getCondition(Number(item.CfgValue));
    }

    /** 获取模型 */
    public getModelSkin(): number {
        const config = Config.Get(Config.Type.Cfg_AdventureNormal);
        const item: Cfg_AdventureNormal = config.getValueByKey('AdventureModel');
        return Number(item.CfgValue.split('|')[RoleMgr.I.d.Sex - 1]);
    }

    /** 获取事件数量上限 */
    public getEventMax(): number {
        const config = Config.Get(Config.Type.Cfg_AdventureNormal);
        const item: Cfg_AdventureNormal = config.getValueByKey('AdventureEventMax');
        return Number(item.CfgValue);
    }

    /** 获取终点奖励 */
    public getEndEventReward(key: number): string {
        const config = Config.Get(Config.Type.Cfg_AdventureBg);
        key %= config.keysLength;
        if (key === 0) key = 10;
        const item: Cfg_AdventureBg = config.getValueByKey(key);
        return item.EndReward;
    }

    /** 获取事件名称 */
    public getEventName(id: number): string {
        const config = Config.Get(Config.Type.Cfg_AdventureEvent);
        const item: Cfg_AdventureEvent = config.getValueByKey(id);
        return item.Name;
    }

    /** 获取事件描述 */
    public getEventDesc(id: number): string {
        const config = Config.Get(Config.Type.Cfg_AdventureEvent);
        const item: Cfg_AdventureEvent = config.getValueByKey(id);
        return item.Desc;
    }

    /** 获取骰子对应物品 0.普通 1.黄金 */
    public getDiceItem(type: number): number {
        const config = Config.Get(Config.Type.Cfg_AdventureNormal);
        const item: Cfg_AdventureNormal = config.getValueByKey('AdventureDice');
        return Number(item.CfgValue.split('|')[type]);
    }

    /** 获取商品信息 */
    public getShopInfo(id: number): Cfg_AdventureShop {
        const config = Config.Get(Config.Type.Cfg_AdventureShop);
        return config.getValueByKey(id);
    }

    /** 获取事件数量 */
    public getEventCount(): number {
        if (this._info) return this._info.AdventureEventList.length;
        return 0;
    }

    /** 获取事件最小时间 */
    public getEventMinTime(): number {
        let time: number = null;
        const sec = UtilTime.NowSec();
        this._info.AdventureEventList.forEach((ev) => {
            if (ev.State === 0 && sec < ev.OverTime) {
                if (ev.EventId === 3 && ev.EventWish.WishState !== 0) { return; }
                const cmp = ev.OverTime;
                if (time == null || time > cmp) {
                    time = cmp;
                }
            }
        });
        if (time) { return time - sec; }
        return 0;
    }

    /** 增加事件 */
    public pushEvent(ev: AdventureEvent): void {
        this.updateEvent(ev);
        EventClient.I.emit(E.Adventure.syncEventList);
    }

    /** 更新或插入事件 */
    public updateEvent(ev: AdventureEvent): void {
        if (this._info) {
            for (let i = 0; i < this._info.AdventureEventList.length; ++i) {
                if (this._info.AdventureEventList[i].OnlyId === ev.OnlyId) {
                    this._info.AdventureEventList[i] = ev;
                    return;
                }
            }
            this._info.AdventureEventList.push(ev);
        }
    }

    /** 获取事件 */
    public getEvent(idx: number): AdventureEvent {
        if (this._info) {
            const ev = this._info.AdventureEventList[idx];
            return ev;
        }
        return null;
    }

    /** 清除无效事件 */
    public clearEmptyEvent(notEmit: boolean = false): void {
        const sec = UtilTime.NowSec();
        for (let i = this._info.AdventureEventList.length - 1; i >= 0; --i) {
            const ev = this._info.AdventureEventList[i];
            if ((ev.State === 0 && sec < ev.OverTime) || (ev.EventId === 3 && ev.EventWish.WishState === 1)) {
                continue;
            }
            this._info.AdventureEventList.splice(i, 1);
        }
        if (!notEmit) EventClient.I.emit(E.Adventure.syncEventCount);
        console.log('清除无效事件');
    }

    /** 获取事件数量 格式化显示 */
    public getEventCountFmt(): string {
        if (this._info) {
            const max = this.getEventMax();
            // const count = 0;
            // const sec = UtilTime.NowSec();
            // this._info.AdventureEventList.forEach((v) => {
            //     if ((v.State === 0 && sec < v.OverTime) || (v.EventId === 3 && v.EventWish.WishState === 1)) ++count;
            // });
            return `${this._info.AdventureEventList.length}/${max}`;
        }
        return '';
    }
}
