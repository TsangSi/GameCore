/*
 * @Author: myl
 * @Date: 2022-11-16 11:16:45
 * @Description:
 */

import { EventClient } from '../../../app/base/event/EventClient';
import BaseModel from '../../../app/core/mvc/model/BaseModel';
import { AttrInfo } from '../../base/attribute/AttrInfo';
import { AttrModel } from '../../base/attribute/AttrModel';
import { Config } from '../../base/config/Config';
import { ConfigConst } from '../../base/config/ConfigConst';
import ConfigPhotoIndexer from '../../base/config/indexer/ConfigPhotoIndexer';
import { E } from '../../const/EventName';
import { BagMgr } from '../bag/BagMgr';
import { HeadItemData, HeadPhotoType } from './HeadConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class HeadModel extends BaseModel {
    public clearAll(): void {
        // throw new Error('Method not implemented.');
    }

    /**
     * 获取头像头像框配置信息
     */
    public getPhotoInfoConfig(type: HeadPhotoType, id: number): Cfg_Photo {
        const indexer: ConfigPhotoIndexer = Config.Get(ConfigConst.Cfg_PhotoStar);
        return indexer.getPhotoConfig(type, id);
    }

    public getPhotoConfig(type: HeadPhotoType): Cfg_Photo[] {
        const indexer: ConfigPhotoIndexer = Config.Get(ConfigConst.Cfg_PhotoStar);
        const cfg = indexer.getPhotoList(type);
        const result: Cfg_Photo[] = [];
        cfg.forEach((v, k) => {
            result.push(v);
        });
        return result;
    }

    /**
     * 获取基础属性
     * 返回值为 基础属性 和 关联的funcId
     *
     */
    public getBaseAttr(type: HeadPhotoType, id: number): { attrInfo: AttrInfo, funcId: number } {
        const cfg = this.getPhotoInfoConfig(type, id);
        if (!cfg) {
            return null;
        } else {
            const attr = cfg.Attr;
            const attrInfo = AttrModel.MakeAttrInfo(attr);
            return { attrInfo, funcId: cfg.FuncId };
        }
    }

    /** 获取物品当前升星属性 */
    public getCurStarAttr(type: HeadPhotoType, id: number, lv: number): AttrInfo {
        const { attrInfo, funcId } = this.getBaseAttr(type, id);
        if (funcId) {
            const starCfg = this.getStar(funcId, lv);
            if (!starCfg) {
                return null;
            }
            return attrInfo.mul((starCfg.TotalRatio - (starCfg.MaxLevel - lv) * starCfg.AttrRatio) / 10000);
        } else {
            return null;
        }
    }

    /**
     * 获取星级配置
     */
    public getStar(funcId: number, lv: number): Cfg_PhotoStar {
        const indexer: ConfigPhotoIndexer = Config.Get(ConfigConst.Cfg_Photo);
        return indexer.getStarConfig(funcId, lv);
    }

    /** *********************** 网络数据相关 */

    private _HeadData: Map<number, HeadInfo> = new Map();
    private _HeadFrameData: Map<number, HeadInfo> = new Map();
    public setHeadData(type: HeadPhotoType, v: HeadInfo[]): void {
        if (type === HeadPhotoType.Head) {
            v.forEach((e) => {
                this._HeadData.set(e.HeadId, e);
            });
        } else {
            v.forEach((e) => {
                this._HeadFrameData.set(e.HeadId, e);
            });
        }
        EventClient.I.emit(E.Head.List);
    }

    // 更新头像数据
    public updateHeadData(dta: S2CHeadUpdate): void {
        if (dta.HeadType === HeadPhotoType.Head) {
            dta.UpdateList.forEach((e) => {
                this._HeadData.set(e.HeadId, e);
            });
        } else {
            dta.UpdateList.forEach((e) => {
                this._HeadFrameData.set(e.HeadId, e);
            });
        }
        EventClient.I.emit(E.Head.Update);
    }

    /** 服务端原始数据 */
    public getHeadData(type: HeadPhotoType): Map<number, HeadInfo> {
        return type === HeadPhotoType.Head ? this._HeadData : this._HeadFrameData;
    }

    /** 组装后的列表数据 */
    public getHeadListData(type: HeadPhotoType): HeadItemData[] {
        const cfgs = this.getPhotoConfig(type);
        const datas = this.getHeadData(type);
        const result: HeadItemData[] = [];
        for (let i = 0; i < cfgs.length; i++) {
            const cfg = cfgs[i];
            const data = datas.get(cfg.Id);
            result.push({ data, cfg, sort: data ? 1 : 0 });
        }
        // 配置表字段排序
        result.sort((a, b) => a.cfg.Sort - b.cfg.Sort);
        // 拥有与否
        result.sort((m, n) => n.sort - m.sort);
        return result;
    }

    /** 获取节点的红点状态 */
    public getRedState(data: HeadItemData): { active: boolean, star: boolean } {
        let active = false;
        let star = false;
        if (data.data) {
            const starId = data.cfg.StarUpItem;
            const funcid = data.cfg.FuncId;
            // 获取升星数据
            const starCfg = this.getStar(funcid, data.data.Star);
            const needNum = starCfg.LevelUpItem;
            const haveNum = BagMgr.I.getItemNum(starId);
            star = haveNum >= needNum;
            if (!this.getStar(funcid, data.data.Star + 1)) { // 满级
                star = false;
            }
            active = false;
        } else {
            const actData = data.cfg.UnlockItem.split(':');
            const actId = parseInt(actData[0]);
            const needNum = parseInt(actData[1]);
            const haveNum = BagMgr.I.getItemNum(actId);
            active = haveNum >= needNum;
            star = false;
        }
        return { active, star };
    }
}
