/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { data } from '../../../../../../resources/i18n/en-US';
import { EventClient } from '../../../../../app/base/event/EventClient';
import { StorageMgr } from '../../../../../app/base/manager/StorageMgr';
import { UtilString } from '../../../../../app/base/utils/UtilString';
import BaseModel from '../../../../../app/core/mvc/model/BaseModel';
import { Config } from '../../../../base/config/Config';
import { ConfigConst } from '../../../../base/config/ConfigConst';
import { ConfigIndexer } from '../../../../base/config/indexer/ConfigIndexer';
import { ConfigShopIndexer } from '../../../../base/config/indexer/ConfigShopIndexer';
import UtilItem from '../../../../base/utils/UtilItem';
import ItemModel from '../../../../com/item/ItemModel';
import { E } from '../../../../const/EventName';
import ModelMgr from '../../../../manager/ModelMgr';
import { RoleMgr } from '../../../role/RoleMgr';
import { ShopChildType } from '../../../shop/ShopConst';
import { ClientFlagEnum } from './GeneralRecruitConst';

const { ccclass } = cc._decorator;
@ccclass('GeneralRecruitModel')
export class GeneralRecruitModel extends BaseModel {
    public clearAll(): void {
        //
    }
    public clear(): void {
        //
    }

    public isOpenTip: boolean = true;

    private _JumpAni = new Map<number, boolean>();
    public setJumpAni(ActFuncId: number, bol: boolean): void {
        // this._JumpAni.set(ActFuncId, bol);
        StorageMgr.I.setValue(`${ActFuncId}_${RoleMgr.I.d.UserId}`, bol);
    }
    public getJumpAni(ActFuncId: number): boolean {
        return !!StorageMgr.I.getValue(`${ActFuncId}_${RoleMgr.I.d.UserId}`);
        // return this._JumpAni.get(ActFuncId);
    }

    /** 初始数据 */
    private _genearlData: { [ActKey: number]: S2CZhaoMuUIData } = cc.js.createMap(true);
    private _zhaoMuQueueLog: { [ActKey: number]: Array<ZhaoMuLog> } = cc.js.createMap(true);
    public setZhaoMuUIData(data: S2CZhaoMuUIData): void {
        this._genearlData[data.FuncId] = data;
        // 队列里的招募日志
        this._zhaoMuQueueLog = {};
        this._zhaoMuQueueLog[data.FuncId] = data.ActData.ZhaoMuLog;
        EventClient.I.emit(E.GeneralRecruit.InitData, data);
    }
    public updateMainUIData(data: S2CZhaoMuLuckyDraw): void {
        this._genearlData[data.FuncId].ActData = data.ActData;// 更新基础数据
        EventClient.I.emit(E.GeneralRecruit.ZhaoMuSuccess, data);
    }

    /** 总的招募次数 */
    public getTotalNum(FuncId: number): number {
        return this._genearlData[FuncId].ActData.TotalNum;
    }
    /** 获取剩余购买次数 */
    public getBuyTimes(FuncId: number): number {
        return this._genearlData[FuncId].ActData.BuyTimes;
    }

    // private _preData;
    public pushIntoZhaoMuQueueLog(data: S2CZhaoMuOpenLog): void {
        // if (data === this._preData) {
        //     return;
        // }
        // this._preData = data;

        if (this._zhaoMuQueueLog[data.FuncId] && this._zhaoMuQueueLog[data.FuncId].length) {
            // 判断服务端下来的，是否在当前列表里
            for (let i = 0, len = data.ZhaoMuLog.length; i < len; i++) {
                if (!this._isInLocalQueue(data.ZhaoMuLog[i], data.FuncId)) {
                    this._zhaoMuQueueLog[data.FuncId].push(data.ZhaoMuLog[i]);
                }
            }
        } else {
            this._zhaoMuQueueLog[data.FuncId] = [];
            for (let i = 0, len = data.ZhaoMuLog.length; i < len; i++) {
                this._zhaoMuQueueLog[data.FuncId].push(data.ZhaoMuLog[i]);
            }
        }
    }

    private _zhaoMuDeleteQueueLog: { [ActKey: number]: Array<ZhaoMuLog> } = cc.js.createMap(true);

    /** 轮播删除，放入这里 */
    public pushIntoDeleteQueue(data: ZhaoMuLog, actId: number): void {
        if (!this._zhaoMuDeleteQueueLog[actId]) {
            this._zhaoMuDeleteQueueLog[actId] = [];
        }
        this._zhaoMuDeleteQueueLog[actId].push(data);
    }

    public clearDeleteQueue(actId: number): void {
        this._zhaoMuDeleteQueueLog[actId] = [];
    }

    private _isInLocalQueue(data: ZhaoMuLog, actId: number): boolean {
        let isInQueue = false;
        // 是否在当前列表
        // const curStr: string = UtilString.parseLog(data);// 当前
        const curId = data.LogId;
        const arr = this._zhaoMuQueueLog[actId];
        for (let i = 0; i < arr.length; i++) {
            // const qstr = UtilString.parseLog(arr[i]);
            const qsId = arr[i].LogId;
            if (qsId === curId) {
                isInQueue = true;
                break;
            }
            // if (qstr === curStr) {
            //     isInQueue = true;
            //     break;
            // }
        }

        // 是否在删除列表里。防止删除了，又放入
        if (!isInQueue) {
            if (this._zhaoMuDeleteQueueLog[actId] && this._zhaoMuDeleteQueueLog[actId].length) {
                for (let i = 0; i < this._zhaoMuDeleteQueueLog[actId].length; i++) {
                    // const qstr = UtilString.parseLog(this._zhaoMuDeleteQueueLog[actId][i]);
                    const qssId = this._zhaoMuDeleteQueueLog[actId][i].LogId;
                    if (qssId === curId) {
                        isInQueue = true;
                        break;
                    }
                    // if (qstr === curStr) {
                    //     isInQueue = true;
                    //     break;
                    // }
                }
            }
        }
        return isInQueue;
    }

    public getQueueZhaoMuLog(ActFuncId: number): Array<ZhaoMuLog> {
        return this._zhaoMuQueueLog[ActFuncId];
    }

    /** 更新阶段奖励 */
    public updateStageInfo(data: S2CZhaoMuGetStageRw): void {
        // 领取奖励后 更新领奖信息
        this._genearlData[data.FuncId].ActData.StageRwGet = data.StageRwGet;
        this._genearlData[data.FuncId].ActData.StageRwNum = data.StageRwNum;
        EventClient.I.emit(E.GeneralRecruit.getStageReward, data);
    }

    /** 判断活动数据是否为空 */
    private _hasData(ActFuncId: number) {
        if (this._genearlData && this._genearlData[ActFuncId] && this._genearlData[ActFuncId].ActData) {
            return true;
        }
        return false;
    }

    /** 还需多少次 获得xxx品质 */
    public getBaseRwNeedNum(ActFuncId: number): number {
        if (this._hasData(ActFuncId)) {
            return this._genearlData[ActFuncId].ActData.BaseRwNeedNum || 0;
        }
        return 0;
    }

    /** 免费抽奖次数 */
    public getFreeNum(ActFuncId: number): number {
        if (this._hasData(ActFuncId)) {
            return this._genearlData[ActFuncId].ActData.FreeNum || 0;
        }
        return 0;
    }
    /** 当前阶段奖励次数 */
    public getStageRwNum(ActFuncId: number): number {
        if (this._hasData(ActFuncId)) {
            return this._genearlData[ActFuncId].ActData.StageRwNum || 0;
        }
        return 0;
    }
    /** 已经领取的阶段 */
    public getStageRwGet(ActFuncId: number): number {
        if (this._hasData(ActFuncId)) {
            return this._genearlData[ActFuncId].ActData.StageRwGet || 0;
        }
        return 0;
    }

    private _zhaoMuLog;// 招募日志
    public setZhaoMuLog(data: S2CZhaoMuOpenLog): void {
        this._zhaoMuLog = {};
        if (data.ClientFlag === ClientFlagEnum.ClientOut && data.Type === 2) {
            this.pushIntoZhaoMuQueueLog(data);
        } else {
            const obj = {};
            obj[`${data.Type}`] = data.ZhaoMuLog;
            this._zhaoMuLog[`${data.FuncId}`] = obj;
            EventClient.I.emit(E.GeneralRecruit.getZhaoMuLog, data);
        }
    }
    /** 获取招募日志数据 */
    public getZhaoMuLog(ActFuncId: number, Type: number): string[] {
        if (this._zhaoMuLog && this._zhaoMuLog[`${ActFuncId}`]) {
            return this._zhaoMuLog[`${ActFuncId}`][`${Type}`];
        }
        return [];
    }

    /** 背包信息 */
    private _bagInfo: { [ActKey: number]: ItemModel[] } = cc.js.createMap(true);
    public initBagInfo(data: S2CZhaoMuBagData): void {
        if (data.TempBagData && data.TempBagData.length) {
            const arrItemModel: ItemModel[] = [];
            for (let i = 0, len = data.TempBagData.length; i < len; i++) {
                const item: ItemModel = UtilItem.NewItemModel(data.TempBagData[i]);
                arrItemModel.push(item);
            }
            this._bagInfo[data.FuncId] = arrItemModel;
        }
        EventClient.I.emit(E.GeneralRecruit.ZhaoMuBagInfo, data);
    }
    // public bagFuncId: number = 0;//出于是否有多个仓库的考虑
    public getBagData(ActFuncId: number): ItemModel[] {
        return this._bagInfo[ActFuncId];
    }

    // 判断武将是否仓库超出最大容量
    public checkMax(actId: number): boolean {
        const len = this.getCurBagLen(actId);
        const cfg: Cfg_Config_General = ModelMgr.I.GeneralRecruitModel.cfgActZhaoMuConfig.getValueByKey('WareHouse1');
        const maxGeneralLen = Number(cfg.CfgValue);
        return len >= maxGeneralLen;
    }

    /** 获取当前背包容量 */
    public getCurBagLen(FuncId: number): number {
        return this._genearlData[FuncId].ActData.BagLen;
    }

    /** 取出 更新背包 */
    public updateBagInfo(data: S2CZhaoMuBagTakeOut): void {
        if (data.IsAll) {
            this._bagInfo[data.FuncId] = [];
        } else {
            for (let i = 0; i < this._bagInfo[data.FuncId].length; i++) {
                if (data.OnlyId.indexOf(this._bagInfo[data.FuncId][i].data.OnlyId) !== -1) {
                    this._bagInfo[data.FuncId].splice(i, 1);
                }
            }
        }
        EventClient.I.emit(E.GeneralRecruit.TakeOutSuccess, data);
    }

    public updateWishInfo(data: S2CZhaoMuSetWish): void {
        if (data.WishList.length) {
            const already: number[] = [];
            const setList: number[] = [];
            for (let i = 0; i < data.WishList.length; i++) {
                const tableIdx = data.WishList[i];
                if (this.isInAlready(data.FuncId, tableIdx)) {
                    already.push(tableIdx);
                } else {
                    setList.push(tableIdx);
                }
            }
            this._genearlData[data.FuncId].ActData.WishGet = already;
            this._genearlData[data.FuncId].ActData.Wish = setList;
        } else {
            this._genearlData[data.FuncId].ActData.WishGet = [];
            this._genearlData[data.FuncId].ActData.Wish = [];
        }
        EventClient.I.emit(E.GeneralRecruit.SetWish, data);
    }
    /** 获取许愿信息 */
    public getWishArrInfo(ActFuncId: number): number[] {
        const wish = [];// 当前心愿单
        const wishGet = [];// 已领取
        const serverWish = this._genearlData[ActFuncId].ActData.Wish;
        const serverWishGet = this._genearlData[ActFuncId].ActData.WishGet;

        if (serverWish.length) {
            for (let i = 0; i < serverWish.length; i++) {
                wish.push(serverWish[i]);
            }
        }
        if (serverWishGet.length) {
            for (let i = 0; i < serverWishGet.length; i++) {
                wishGet.push(serverWishGet[i]);
            }
        }

        if (wishGet && wish) {
            if (wish && wish.length) {
                for (let i = 0; i < wish.length; i++) {
                    const tabId = wish[i];
                    if (wishGet.indexOf(tabId) !== -1) {
                        //
                        wish.splice(i, 1);
                    }
                }
            }
        }

        // const arr2 = this._genearlData[ActFuncId].ActData.Wish;// 当前心愿单
        // const arr1 = this._genearlData[ActFuncId].ActData.WishGet;// 已领取
        return wish.concat(wishGet);
    }
    /** 已完成数量 */
    public getCurGetWishInfo(ActFuncId: number): number[] {
        const arr = this._genearlData[ActFuncId].ActData.WishGet;// 已完成数量
        return arr;
    }

    /** 在已完成列表里 */
    public isInWishGet(ActFuncId: number, tableIdx: number): boolean {
        const arr = this._genearlData[ActFuncId].ActData.WishGet;// 已完成数量
        if (arr && arr.length) {
            if (arr.indexOf(tableIdx) !== -1) {
                return true;
            }
        }
        return false;
    }
    /** 在已选中列表里 */
    public inInSelectList(tableIdx: number): boolean {
        const arr = this.getCurSelectNum();
        if (arr && arr.length) {
            if (arr.indexOf(tableIdx) !== -1) {
                return true;
            }
        }
        return false;
    }

    /** 许愿功能全部走表格索引 */
    public isInAlready(ActFuncId: number, tableIdx: number): boolean {
        return this._genearlData[ActFuncId].ActData.WishGet.indexOf(tableIdx) !== -1;
    }

    // 当前选中的放入一个临时列表
    private _tempWishList: number[] = [];
    public getCurSelectNum(): number[] {
        return this._tempWishList;
    }

    /** 将已领取未领取全部放入一个list */
    public initTempWishList(ActFuncId: number): void {
        this._tempWishList = [];
        const wish = [];// 当前心愿单
        const wishGet = [];// 已领取
        const serverWish = this._genearlData[ActFuncId].ActData.Wish;
        const serverWishGet = this._genearlData[ActFuncId].ActData.WishGet;

        if (serverWish.length) {
            for (let i = 0; i < serverWish.length; i++) {
                wish.push(serverWish[i]);
            }
        }
        if (serverWishGet.length) {
            for (let i = 0; i < serverWishGet.length; i++) {
                wishGet.push(serverWishGet[i]);
            }
        }

        if (wishGet && wish) {
            if (wish && wish.length) {
                for (let i = 0; i < wish.length; i++) {
                    const tabId = wish[i];
                    if (wishGet.indexOf(tabId) !== -1) {
                        //
                        wish.splice(i, 1);
                    }
                }
            }
        }

        // console.log(wish, wishGet);

        this._tempWishList = [...wish, ...wishGet];// 1  2
        // console.log('一开始这个列表', this._tempWishList);
    }
    /** 添加 */
    public addTempWishList(tabIdx: number): void {
        this._tempWishList.push(tabIdx);// 放入
        // console.log('增加一个后', this._tempWishList);
        EventClient.I.emit(E.GeneralRecruit.UpdateWishSelectNum);
    }
    /** 删除这个 */
    public deleteTempWishListItem(tabIdx: number): void {
        for (let i = 0, len = this._tempWishList.length; i < len; i++) {
            if (this._tempWishList[i] === tabIdx) {
                this._tempWishList.splice(i, 1);
                // console.log('删除后剩余', this._tempWishList);
            }
        }
        EventClient.I.emit(E.GeneralRecruit.UpdateWishSelectNum);
    }

    // ------------配置操作------------
    public group(ActFuncId: number): string {
        const groupArg = ModelMgr.I.ActivityModel.getGroup(ActFuncId);
        return groupArg;
    }
    // 获取常驻招募配置表
    public getCfgActZhaoMu(ActFuncId: number): Cfg_Server_ActZhaoMu {
        const group: string = this.group(ActFuncId);
        const indexer = Config.Get(ConfigConst.Cfg_Server_ActZhaoMu);
        const idxArr = indexer.getValueByKey(group);
        // 表上只有一条数据
        return indexer.getValueByIndex(idxArr[0]);
        // 是否缓存当前配置？
    }

    /** 获取常量配置 */
    public get cfgActZhaoMuConfig(): ConfigIndexer {
        return Config.Get(Config.Type.Cfg_Server_ZhaoMuConfig);
    }

    public getCfgRt(ActFuncId: number): string {
        return this.getCfgActZhaoMu(ActFuncId).ShowSpecialGroup;
    }
    /** 1次消耗 */
    public getCfgCost(ActFuncId: number, num: number): number[] {
        let str = '';
        if (num === 1) {
            str = 'OneTimeCost';// 1次消耗
        } else if (num === 10) {
            str = 'TenTimeCost';// 1次消耗
        } else if (num === 50) {
            str = 'FiftyTimeCost';// 1次消耗
        }
        const costStr: string = this.getCfgActZhaoMu(ActFuncId)[`${str}`];
        const itemArr = costStr.split(':');// itemId itemNum

        // itemId item数量
        return [Number(itemArr[0]), Number(itemArr[1])];
    }

    // 获取常量配置
    public getCfgTimesArr(ActFuncId: number): number[] {
        const arrTimes: number[] = [];
        const group: string = this.group(ActFuncId);// 组
        const indexer = Config.Get(ConfigConst.Cfg_Server_ZhaoMuStageReward);
        const idxArr: number[] = indexer.getValueByKey(group);
        for (let i = 0; i < idxArr.length; i++) {
            const idx = idxArr[i];
            const cfg: Cfg_Server_ZhaoMuStageReward = indexer.getValueByIndex(idx);
            const time = cfg.Times;
            arrTimes.push(time);
        }
        return arrTimes;
    }

    // 下一阶段数量
    public getCfgNextStageNum(ActFuncId: number, curGet: number): number {
        // 当前领取的阶段是多少 获取下一阶段
        const arr = this.getCfgTimesArr(ActFuncId);
        arr.sort((a, b) => a - b);
        if (curGet === 0) {
            return arr[0];
        }
        let n = 0;
        for (let i = 0; i < arr.length; i++) {
            if (curGet === arr[i]) {
                n = i;
                break;
            }
        }
        if (n === arr.length - 1) return arr[0];
        return arr[n + 1];
    }

    /** 根据当前已领取，获取下一阶段配置 */
    public getCfgNextStageCfg(ActFuncId: number, curGet: number): Cfg_Server_ZhaoMuStageReward {
        // 整个配置
        const group: string = this.group(ActFuncId);// 组
        const indexer = Config.Get(ConfigConst.Cfg_Server_ZhaoMuStageReward);
        // 后端下发的是乱序的

        const len = indexer.length;// 总表长度
        const arr: Cfg_Server_ZhaoMuStageReward[] = [];
        for (let i = 0; i < len; i++) {
            arr.push(indexer.getValueByIndex(i));
        }

        arr.sort((l, r) => l.Times - r.Times);

        if (curGet === 0) { // 第一次进入游戏
            const cfg: Cfg_Server_ZhaoMuStageReward = arr[0];
            return cfg;
        }

        let n = 0;
        for (let i = 0; i < arr.length; i++) {
            const cfg: Cfg_Server_ZhaoMuStageReward = arr[i];
            if (cfg.Times === curGet) {
                n = i;
                break;
            }
        }

        if (n === arr.length - 1) { // 领取第一档
            const cfg: Cfg_Server_ZhaoMuStageReward = arr[0];
            return cfg;
        }
        const cfg: Cfg_Server_ZhaoMuStageReward = arr[n + 1];
        return cfg;
    }

    /** 根据当前已更新过的阶段，获取上一次阶段配置 */
    public getCfgPreStageCfg(ActFuncId: number, curGet: number): Cfg_Server_ZhaoMuStageReward {
        // 阶段奖励 表格
        const group: string = this.group(ActFuncId);// 组
        const indexer = Config.Get(ConfigConst.Cfg_Server_ZhaoMuStageReward);

        const len = indexer.length;// 总表长度
        const arr: Cfg_Server_ZhaoMuStageReward[] = [];
        for (let i = 0; i < len; i++) {
            arr.push(indexer.getValueByIndex(i));
        }

        arr.sort((l, r) => l.Times - r.Times);

        if (curGet === 0) { // 当前是第一档位
            const cfg: Cfg_Server_ZhaoMuStageReward = arr[arr.length - 1];
            return cfg;
        }

        let n = 0;
        for (let i = 0; i < arr.length; i++) {
            const cfg: Cfg_Server_ZhaoMuStageReward = arr[i];
            if (cfg.Times === curGet) {
                n = i;
                break;
            }
        }

        const cfg: Cfg_Server_ZhaoMuStageReward = arr[n];
        return cfg;
    }

    /** 概率预览 */
    public getCfgActZhaoMuGLCfg(ActFuncId: number): Cfg_Server_GeneralZhaoMu[] {
        const group: string = this.group(ActFuncId);
        const indexer = Config.Get(ConfigConst.Cfg_Server_GeneralZhaoMu);
        const idxArr: number[] = indexer.getValueByKey(group);
        const arr: Cfg_Server_GeneralZhaoMu[] = [];

        for (let i = 0, len = idxArr.length; i < len; i++) {
            const cfg: Cfg_Server_GeneralZhaoMu = indexer.getValueByIndex(idxArr[i]);
            arr.push(cfg);
        }
        arr.sort((l: Cfg_Server_GeneralZhaoMu, r: Cfg_Server_GeneralZhaoMu) => {
            if (l.Sort - r.Sort > 0) {
                return 1;
            } else if (l.Sort - r.Sort < 0) {
                return -1;
            } else {
                return l.Id - r.Id;
            }
        });
        return arr;
    }
    // 获取轮播武将
    public getCfgBannerGeneral(ActFuncId: number): Cfg_Server_GeneralZhaoMu[] {
        const group: string = this.group(ActFuncId);
        const indexer = Config.Get(ConfigConst.Cfg_Server_GeneralZhaoMu);
        const idxArr: number[] = indexer.getValueByKey(group);

        const arr: Cfg_Server_GeneralZhaoMu[] = [];
        for (let i = 0, len = idxArr.length; i < len; i++) {
            const cfg: Cfg_Server_GeneralZhaoMu = indexer.getValueByIndex(idxArr[i]);
            if (cfg.ShowOrder) {
                arr.push(cfg);
            }
        }
        arr.sort((l: Cfg_Server_GeneralZhaoMu, r: Cfg_Server_GeneralZhaoMu) => l.ShowOrder - r.ShowOrder);
        return arr;
    }

    /**
     *
     * @param ActFuncId
     * @param arrWishType 仓库类型
     * @returns Cfg_Server_GeneralZhaoMu 表格Id
     */
    public getAllCfg(ActFuncId: number, arrWishType: number[]): number[] {
        const arr: Cfg_Server_GeneralZhaoMu[] = this.getCfgActZhaoMuGLCfg(ActFuncId);

        const arrId: number[] = [];
        for (let i = 0, len = arr.length; i < len; i++) {
            if (arrWishType.indexOf(arr[i].WishType) !== -1) {
                arrId.push(arr[i].Id);
            }
        }
        return arrId;
    }

    /**
     *
     * @param allCfgIdx Cfg_Server_GeneralZhaoMu 表格索引
     * @param idx 当前选中某个标签类型索引 全 魏 蜀 吴 群
     * @returns Cfg_Server_GeneralZhaoMu 表格索引
     */
    private _listMap = new Map<number, number[]>();
    private _allList: number[] = [];

    public setListByAllCfg(allCfgId: number[]): void {
        this._listMap.clear();
        this._allList = [];
        if (allCfgId.length) {
            for (let i = 0, len = allCfgId.length; i < len; i++) {
                const tableId = allCfgId[i];// 这个不是表格索引
                const cfgItem = this.getItemInfoByIdx(tableId);
                // 武将ID
                const generalId = cfgItem.DetailId;
                const cfgGeneral: Cfg_General = this.getGeneralInfo(generalId);
                const camp = cfgGeneral.Camp;// 阵营
                let tempArr = this._listMap.get(camp);
                if (!tempArr || !tempArr.length) {
                    tempArr = [];
                }
                tempArr.push(tableId);
                this._listMap.set(camp, tempArr);
                this._allList.push(tableId);
            }
        }
    }

    /** 根据阵营 获取列表 */
    public getListByCamp(camp: number): number[] {
        if (camp === 0) {
            // 返回所有数组
            // this._listMap.get(HeroCamp.qun)
            return this._allList;
        } else {
            return this._listMap.get(camp);
        }
    }

    /** 根据武将ID 获取武将信息 */
    public getGeneralInfo(gid: number): Cfg_General {
        const indexer = Config.Get(ConfigConst.Cfg_General);
        return indexer.getValueByKey(gid);
    }

    /** 获取道具信息 */
    public getItemInfoByIdx(idx: number): Cfg_Item {
        const cfg = this.getCfgZhaoMu(idx);
        const itemId = cfg.ItemId;
        const cfgItem = UtilItem.GetCfgByItemId(itemId);
        return cfgItem;
    }

    /** 心愿是否开启 */
    public isOpenWishCfg(actId: number): boolean {
        if (this.getCfgActZhaoMu(actId).WishGroupOpen === 1) {
            return true;
        }
        return false;
    }
    /** 开启心愿需要的次数 */
    public getCfgWishOpenNum(actId: number): number {
        return this.getCfgActZhaoMu(actId).WishGroupTimes;
    }

    /** 获取总共可以选几个心愿单 */
    public getCfgWishNum(actId: number): number {
        const numStr = this.getCfgActZhaoMu(actId).WishGroupParam;
        const arr = numStr.split('|');
        if (arr.length === 1) {
            return Number(arr[0].split(':')[1]);
        }
        if (arr.length === 2) {
            const num = Number(arr[0].split(':')[1]) + Number(arr[1].split(':')[1]);
            return num;
        }
        return 1;
    }

    /** 获取总共可以选几个心愿单 */
    public getCfgWishTypeArr(actId: number): number[] {
        const numStr = this.getCfgActZhaoMu(actId).WishGroupParam;

        const arr = numStr.split('|');
        if (arr.length === 1) {
            return [Number(arr[0].split(':')[0])];
        }
        if (arr.length === 2) {
            return [Number(arr[0].split(':')[0]), Number(arr[1].split(':')[0])];
        }
        return [];
    }

    public getCfgZhaoMu(id: number): Cfg_Server_GeneralZhaoMu {
        const indexer = Config.Get(ConfigConst.Cfg_Server_GeneralZhaoMu);
        let cfgTemp = null;

        indexer.forEach((cfg: any) => {
            if (cfg.Id === id) {
                cfgTemp = cfg;
                return true;
            }
        });
        return cfgTemp;
    }

    /** 当前的库类型 */
    public getWishTypeByTbaleIdx(idx: number): number {
        const wishType: number = this.getCfgZhaoMu(idx).WishType;
        return wishType;
    }

    /** 当前许愿库可以选多少个 */
    public getWishNumByType(actId: number, type: number): number {
        const numStr = this.getCfgActZhaoMu(actId).WishGroupParam;
        const arr = numStr.split('|');
        if (arr.length === 1) { // 只有一个库
            if (type === Number(arr[0].split(':')[0])) {
                return Number(arr[0].split(':')[1]);
            }
        }
        if (arr.length === 2) {
            if (type === Number(arr[0].split(':')[0])) {
                return Number(arr[0].split(':')[1]);
            } else {
                return Number(arr[1].split(':')[1]);
            }
        }
        return 1;
    }

    public getAlreadySelectNum(wishType: number): number {
        const curSelectNum = this.getCurSelectNum();// 当前已经选中多少个
        if (curSelectNum.length === 0) {
            return 0;
        }

        let n = 0;
        for (let i = 0; i < curSelectNum.length; i++) {
            const tabIdx = curSelectNum[i];

            const type = this.getWishTypeByTbaleIdx(tabIdx);// 当前类型
            if (Number(type) === wishType) {
                n++;
            }
        }
        return n;
    }

    /** 从商店表获取配置 */
    public getShopCfgByItemId(itemId: number): Cfg_ShopCity {
        const indexer: ConfigShopIndexer = Config.Get(Config.Type.Cfg_ShopCity);
        const shopitems = indexer.getShopItemsByShopType(ShopChildType.Quick);
        let curItem: Cfg_ShopCity = null;
        for (let i = 0; i < shopitems.length; i++) {
            const item = shopitems[i];
            if (item.ItemID === itemId) {
                curItem = item;
                break;
            }
        }

        return curItem;
    }
}
