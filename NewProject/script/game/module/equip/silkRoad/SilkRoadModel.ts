import { EventClient } from '../../../../app/base/event/EventClient';
import BaseModel from '../../../../app/core/mvc/model/BaseModel';
import { i18n, Lang } from '../../../../i18n/i18n';
import { Config } from '../../../base/config/Config';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import UtilFunOpen from '../../../base/utils/UtilFunOpen';
import UtilItem from '../../../base/utils/UtilItem';
import { ROLE_EQUIP_PART_NUM, ItemBagType, ItemType } from '../../../com/item/ItemConst';
import ItemModel from '../../../com/item/ItemModel';
import { E } from '../../../const/EventName';
import { FuncId } from '../../../const/FuncConst';
import { ViewConst } from '../../../const/ViewConst';
import { BagMgr } from '../../bag/BagMgr';
import { RedDotCheckMgr } from '../../reddot/RedDotCheckMgr';
import { IListenInfo, REDDOT_ADD_LISTEN_INFO, RID } from '../../reddot/RedDotConst';
import { RedDotMgr } from '../../reddot/RedDotMgr';
import { RoleAN } from '../../role/RoleAN';
import { RoleMgr } from '../../role/RoleMgr';
import { RoadDataReward, RoadData, RoadPoint } from './SilkRoadConst';
// import { EquipSys } from './BuildConst';

const { ccclass } = cc._decorator;
@ccclass('SilkRoadModel')
export class SilkRoadModel extends BaseModel {
    private _info: SilkRoadInfo = null;

    public clearAll(): void {
        //
    }
    public clear(): void {
        //
    }

    /** 是否空信息 */
    public isEmptyInfo(): boolean {
        return this._info == null;
    }

    public getInfo(): SilkRoadInfo {
        return this._info;
    }

    public setInfo(v: SilkRoadInfo): void {
        this._info = v;
    }

    public setBuyCount(v: number): void {
        if (this._info) {
            if (this._info.BuyCount !== v) {
                MsgToastMgr.Show(i18n.tt(Lang.com_buy_success));
            }
            this._info.BuyCount = v;
        }
    }

    public getCityName(id: number): string {
        const config = Config.Get(Config.Type.Cfg_SilkRoadTown);
        const item: Cfg_SilkRoadTown = config.getValueByKey(id);
        return item.Name;
    }

    /**
     * 获取事件显示内容
     * @param id 事件ID
    */
    public getEventDesc(id: number): Cfg_SilkRoadEvent {
        const config = Config.Get(Config.Type.Cfg_SilkRoadEvent);
        return config.getValueByKey(id);
    }

    /**
     * 获取每日行商次数上限
    */
    public getSilkRoadTimes(): number {
        const config = Config.Get(Config.Type.Cfg_SilkRoadNormal);
        const v: Cfg_SilkRoadNormal = config.getValueByKey('SilkRoadTimes');
        return Number(v.CfgValue);
    }

    /**
     * 获取每日行商消耗
    */
    public getSilkRoadOneKey(): { id: number, num: number } {
        const config = Config.Get(Config.Type.Cfg_SilkRoadNormal);
        const v: Cfg_SilkRoadNormal = config.getValueByKey('SilkRoadOnekey');
        const ary = v.CfgValue.split(':');
        return { id: Number(ary[0]), num: Number(ary[1]) };
    }

    /**
     * 获取一键完成消耗
    */
    public getSilkRoadTimesCost(): { id: number, num: number } {
        const config = Config.Get(Config.Type.Cfg_SilkRoadNormal);
        const v: Cfg_SilkRoadNormal = config.getValueByKey('SilkRoadTimesCost');
        const ary = v.CfgValue.split(':');
        return { id: Number(ary[0]), num: Number(ary[1]) };
    }

    /**
     * 获取每日行商次数上限
    */
    public getSilkRoadNormalCD(): number {
        const config = Config.Get(Config.Type.Cfg_SilkRoadNormal);
        const v: Cfg_SilkRoadNormal = config.getValueByKey('SilkRoadNormalCD');
        return Number(v.CfgValue);
    }

    /**
     * 获取事件预览奖励
     * @param id 事件ID
    */
    public getEventReward(): string {
        const config = Config.Get(Config.Type.Cfg_SilkRoadNormal);
        const v: Cfg_SilkRoadNormal = config.getValueByKey('SilkRoadEventShow');
        return v.CfgValue;
    }

    /**
     * 获取全部路线配置
    */
    public getAllRoadData(level: number = 1): RoadData[] {
        const result: RoadData[] = [];
        const config = Config.Get(Config.Type.Cfg_SilkRoad);
        config.forEach((v: Cfg_SilkRoad) => {
            result.push(this.getRoadData(v.Id, level));
            return true;
        });
        return result;
    }

    /**
     * 获取路线配置
     * @param id 路线ID
    */
    public getRoadData(id: number, level: number = 1): RoadData {
        const result = <RoadData>{};
        const config = Config.Get(Config.Type.Cfg_SilkRoad);
        const config2 = Config.Get(Config.Type.Cfg_SilkRoadTown);
        const config3 = Config.Get(Config.Type.Cfg_SilkRoadReward);
        const sr: Cfg_SilkRoad = config.getValueByKey(id);
        const srr: Cfg_SilkRoadReward = config3.getIntervalData(id, level);
        const ary = sr.Cost.split(':');
        const points = sr.Road.split(':');
        const rewards = srr.Reward.split('|');
        result.id = sr.Id;
        result.name = sr.Name;
        result.costType = Number(ary[0]);
        result.costNum = Number(ary[1]);
        result.points = [];
        result.reward = [];
        result.time = 0;
        result.img = sr.Img;
        result.quality = sr.Quality;
        result.eventPriority = sr.EventPriority;

        rewards.forEach((v) => {
            const ary = v.split(':');
            result.reward.push(<RoadDataReward>{ itemId: Number(ary[0]), itemNum: Number(ary[1]) });
        });

        let time = 0;

        points.forEach((v, index: number) => {
            const nextPointId = points[index + 1];
            const srt: Cfg_SilkRoadTown = config2.getValueByKey(Number(v));
            if (srt) {
                const p = <RoadPoint>{};
                p.id = srt.Id;
                p.name = srt.Name;
                p.time = time;
                time = 0;
                const ary = srt.NextTown.split(':');
                const ary2 = srt.NextTownCD.split(':');
                if (nextPointId && ary.length > 0) {
                    for (let i = 0; i < ary.length; ++i) {
                        if (ary[i] === nextPointId) {
                            time = Number(ary2[i]);
                            result.time += time;
                            break;
                        }
                    }
                }
                result.points.push(p);
            }
        });

        const cd = this.getSilkRoadNormalCD();

        result.time += cd * (result.points.length - 2);

        return result;
    }
}
