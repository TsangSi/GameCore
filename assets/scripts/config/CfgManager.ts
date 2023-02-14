/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: your name
 * @Date: 2020-05-20 11:51:43
 * @LastEditTime: 2020-06-30 15:25:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \RPG_Cocos\assets\script\m\cfg\GlobalConfig.js
 */
import {
 instantiate, js, JsonAsset, Prefab, resources, sys,
} from 'cc';
import { ResManager } from '../common/ResManager';
import HttpManager from '../net/HttpManager';
import { ReportManager } from '../net/ReportManager';
import UtilsUrl from '../utils/UtilsUrl';
import GlobalConfig from './GlobalConfig';
import ProtoManager from '../net/ProtoManager';
import {
 AssetType, BundleType, MPQ_FILE_INFO, Type,
} from '../global/GConst';
import Utils from '../utils/Utils';
import CfgIndexer from './CfgIndexer';
import { EventM } from '../common/EventManager';
import UtilsTime from '../utils/UtilsTime';
// 所有任务结构
export class CfgTask {
    public CounterType = 0;
    public Id = 0;
    public Param = 0;
    public Type = 0;
    public constructor(data: any) {
        for (const k in data) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            this[k] = data[k];
        }
    }
}

export default class CfgManager {
    private static _I: CfgManager = null;
    public static get I(): CfgManager {
        if (this._I == null) {
            this._I = new CfgManager();
        }
        return this._I;
    }
    public CfgData: { [name: string]: Record<string, unknown>[]; } = Object.create(null);
    private jsonData = undefined;
    public inited = false;
    // 属性数量（常量）
    public ATTRNUM = 20;
    // 程序入口处调用 this.load();
    public load(jsonData): void {
        this.init(jsonData);
        jsonData = null;
    }

    public init(jsonData: JsonAsset): void {
        this.jsonData = jsonData;
        // Tool.I.log("jsonData init");
        this.initStruct();
        this.initTask();
        this.inited = true;
    }
    private initTask() {
        const task = new CfgTask({});
        task.CounterType = 116;
        task.Id = 0;
        task.Param = 0;
        task.Type = 18;
    }
    private structs: { [key: string]: any; };
    // 初始化表结构
    private initStruct() {
        this.structs = js.createMap(true);
        const items = this.jsonData.Items;
        items.d = this.transDataView(items.d);
        items.d = JSON.parse(items.d);
        for (const name in items.d) {
            this.structs[name] = items.d[name];
        }
        delete items.d;
    }

    /**
     * 构造一个数据对象
     * @param tableName 表名(数据类型名字)
     * @param obj 原始数据,如果不传或者传null,则会所有字段都将是默认值
     */
    private initItem(tableName: string, obj?: any): any {
        if (Utils.isNullOrUndefined(obj)) {
            obj = js.createMap(true);
        }
        const s = this.structs[tableName];
        if (s) {
            for (const k in s) {
                if (Utils.isNullOrUndefined(obj[k])) {
                    obj[k] = s[k];
                }
            }
        }
        return obj;
    }

    // 加载本地的配置文件，给安卓ios本地包使用
    private loadLocal(cfgPath: string) {
        // const _self = this;
        resources.load(cfgPath, JsonAsset, (err, jsonData: JsonAsset) => {
            this.init(jsonData);
            jsonData = null;
        });
    }
    private loadMergeJson(jsonArray: string[]) {
        // const _self = this;
        let loadingNum = jsonArray.length;
        const loadZipFunc = () => {
            loadingNum--;
            if (loadingNum < 1) {
                // merge 加载完成
                this.loadProto();
                ReportManager.I.SendDelay(ReportManager.Type.LoadMpqSuc);
            }
        };
        for (let index = 0; index < jsonArray.length; index++) {
            CfgManager.I.loadZipRes(`/client_json/merge/${jsonArray[index]}`, ResManager.I.resFileData, loadZipFunc, this);
        }
    }
    private loadZipRes(zipName: string, out: { [name: string]: MPQ_FILE_INFO; }, callback: any, context) {
        HttpManager.I.getMpq(GlobalConfig.getProjectResURL() + zipName, (data) => {
            CfgManager.I.getMPQData(data, out, () => {
                callback.call(context);
                out = null;
            }, this);
        }, () => {
            console.log(`${zipName}载入失败,50毫秒后重试:${zipName}`);
            setTimeout(() => {
                this.loadZipRes(zipName, out, callback, context);
            }, 50);
        });
    }
    private getMPQData(buffMPQ: ArrayBuffer, out: { [name: string]: MPQ_FILE_INFO; }, callBack, context) {
        const mpqData = new DataView(buffMPQ);
        const offset = 0;
        const filesLen: number = mpqData.getInt16(offset);
        this.parseMPQ(0, filesLen, 2, mpqData, buffMPQ, out, callBack, context);
        out = null;
    }
    private parseMPQ(currentIdx: number, length: number, offset: number, mpqData, mpqBuff, out: { [name: string]: MPQ_FILE_INFO; },
        callBack, context) {
        // var mpqBuff = mpqBuff.slice(0, mpqBuff.length);
        for (let findex = 0; findex < length; findex++) {
            const fileInfo: MPQ_FILE_INFO = {};
            const fileNameLen: number = mpqData.getInt16(offset);
            offset += 2;
            // var name_buf = mpqBuff.slice(offset, offset +fileNameLen);
            const name8buf = new Uint8Array(mpqBuff, offset, fileNameLen);
            const fileName: string[] = String.fromCharCode.apply(null, name8buf).split('.');
            offset += fileNameLen;
            fileInfo.begin = mpqData.getUint32(offset);
            offset += 4;
            fileInfo.length = mpqData.getUint32(offset);
            offset += 4;
            // var data_buf = new Uint8Array(mpqBuff,fileInfo.begin,fileInfo.length);
            // mpqBuff.slice(fileInfo.begin, fileInfo.begin + fileInfo.length);
            fileInfo.suffix = fileName[1];
            if (fileInfo.suffix === 'json' || fileInfo.suffix === 'txt') {
                out[`${fileName[0]}.${fileName[1]}`] = fileInfo;
                fileInfo.data = mpqBuff;// new Uint8Array(mpqBuff,fileInfo.begin,fileInfo.length);
            }
        }
        callBack.call(context);
        out = null;
    }
    private loadProto() {
        if (ProtoManager.ProtoJSON) {
            if (sys.platform !== sys.Platform.WECHAT_GAME) {
                ProtoManager.I.initProto(ProtoManager.ProtoJSON);
            }
            this.loadActionMap();
        } else {
            setTimeout(() => {
                this.loadProto();
            }, 1000);
        }
    }
    /** 步骤2 加载proto 结束 */
    /** 步骤3 加载资源配置 开始 */
    private loadActionMap() {
        // if (Utils.I.IsMobileNative()) {
        //     LoginView.I.loadExcel();
        // } else {
        const _url = '/0c89c921b.json';
        const url = sys.os === sys.OS.IOS && sys.isNative ? UtilsUrl.I.get0CURL(_url) : UtilsUrl.I.getResURL2(_url);
        ResManager.I.loadRemote(url, AssetType.JsonAsset, (err, object: JsonAsset) => {
            if (err) {
                setTimeout(() => {
                    this.loadActionMap();
                }, 1000);
                return;
            }
            ResManager.I.actionResMap = object.json as { [name: string]: Record<string, unknown>; };
            const tmp = js.createMap(true);
            for (const key in ResManager.I.actionResMap) {
                let newKey = key;
                for (let i = 0; i < ResManager.I.spMark.length; i++) {
                    newKey = newKey.replace(ResManager.I.spMark[i], ResManager.I.spRepl[i]);
                }
                tmp[`${newKey}.plist`] = ResManager.I.actionResMap[key];
            }
            ResManager.I.actionResMap = tmp;
            this.loadExcel();
        }, this);
        // }
        ReportManager.I.SendDelay(ReportManager.Type.LoadJsonConfig);
    }
    /** 步骤3 加载资源配置 结束 */
    /** 步骤4 加载数值表配置 开始 */
    private loadExcel() {
        let clientJson: { [name: string]: MPQ_FILE_INFO; } = {};
        let loadNum = 4;
        const loadZipResFunc = () => {
            loadNum--;
            if (loadNum <= 0) {
                // 加载完成
                let content: { Items: any; } = { Items: {} };
                for (const key in clientJson) {
                    const fileInfo = clientJson[key];
                    // const mpqBuff: any = fileInfo.data;
                    // let encodedString = '';
                    // const chunk = 8 * 1024;
                    // const fcount = Math.ceil(fileInfo.length / chunk);
                    // for (let i = 0; i < fcount * chunk; i += chunk) {
                    //     let t_len = chunk;
                    //     if ((i + chunk) > fileInfo.length) {
                    //         t_len = fileInfo.length - i;
                    //     }
                    //     const s = (fileInfo.begin || 0) + i;
                    //     const tmp = new Uint8Array(mpqBuff, s, t_len);
                    //     encodedString += String.fromCharCode.apply(null, tmp);
                    // }
                    // const decodedString = decodeURIComponent(escape(encodedString));
                    // // 没有这一步中文会乱码// tmp = JSON.parse(decodedString + "");
                    // // content.Items[key.replace(".json", "")] = tmp
                    content.Items[key.replace('.json', '')] = fileInfo;
                }
                this.load(content);
                EventM.I.fire(EventM.Type.Config.InitConfig);
                clientJson = null;
                content = null;
                ReportManager.I.SendDelay(ReportManager.Type.LoadGameConfig);
                this.loadResInit();
            }
        };
        for (let i = 0; i < loadNum; i++) {
            let _str = `/client_json/cfg_${i}_data.txt`;

            if (window.IndexGlobal && window.IndexGlobal.mode === 'DEV') {
                const val: string = window.Dev_Config_Ver || '';
                if (val && val !== '') {
                    const ver = `?v${UtilsTime.dateFormat2(new Date().getTime(), 'Y:m:d:H:i')}`;
                    _str = `/client_json/cfg_${i}_data_test${val}.txt${ver}`;
                }
            }
            CfgManager.I.loadZipRes(_str, clientJson, loadZipResFunc, this);
        }
    }
    /** 步骤4 加载数值表配置 结束 */
    /** 步骤5 加载资源-进游戏必备(INIT)资源 开始 */
    private loadResInit() {
        // const _self = this;
        // ResMgr.I.loadAdvance(GAME_BLOCK.INIT, (currentCount: number, currentTotalCount: number, completedCount: number, totalCount: number) => {
        //     let p = completedCount / totalCount;
        //     _self.loadCurrs[1] = p * 0.1;
        //     if (completedCount == totalCount) {
        this.loadResLoad();
        this.loadSub();
        //     }
        // });
    }
    /** 步骤5 加载资源-进游戏必备(init)资源 结束 */
    /** 步骤6 加载资源-预加载(LOAD)资源 开始 */
    private timeID = null;
    private loadResLoad() {
        // const _self = this;
        const loadComplete = () => {
            ReportManager.I.SendDelay(ReportManager.Type.ResourceLoaded);
            this.timeID = null;
        };
        loadComplete();
        // ResMgr.I.loadAdvance(GAME_BLOCK.LOAD, (currentCount: number, currentTotalCount: number, completedCount: number, totalCount: number) => {
        //     let p: number = completedCount / totalCount;
        //     if (_self.loadCurrs) _self.loadCurrs[2] = p * 0.8;

        //     if (completedCount == totalCount) {
        //         clearTimeout(this.timeID);
        //         loadComplete();
        //     }
        // });
        // this.timeID = TaskQueue.I.setTimeout(() => {
        //     //长时间加载未完成，直接进入
        //     loadComplete();
        // }, 10000);
    }
    /** 步骤6 加载资源-预加载(LOAD)资源 结束 */
    /** 步骤6并列 通知登录 开始 */
    private loadSub() {
        // let _self = this;
        // if (this.isSubPackageLoaded) {
        //     E.I.onE(EId.On_StartSub);
        // } else {
        //     setTimeout(function () {
        //         _self.loadSub();
        //     }, 1000);
        // }
        ResManager.I.load(`prefabs/${BundleType.gamelogic}`, Prefab, (e, s: Prefab) => {
            if (e) {
                console.error(`not found bundler err`);
                return;
            }
            const n = instantiate(s);
            const g = n.getComponent(BundleType.gamelogic);
            // eslint-disable-next-line dot-notation
            g['startLoad']();
            EventM.I.fire(EventM.Type.Config.InitConfigComplete);
            n.destroy();
            s.destroy();
        }, this, undefined, BundleType.gamelogic);
    }
    /** 步骤6并列 通知登录 结束 */

    public getCfgDatas(name: string): Record<string, unknown>[] {
        if (this.CfgData[name]) {
            return this.CfgData[name];
        }
        if (this.jsonData && this.jsonData.Items[name]) {
            if (this.jsonData.Items[name].data) {
                this.jsonData.Items[name] = this.transDataView(this.jsonData.Items[name]);
            }
            if (typeof this.jsonData.Items[name] === Type.String) {
                this.jsonData.Items[name] = JSON.parse(this.jsonData.Items[name]);
            }
            this.CfgData[name] = this.transJsonData(name);
            delete this.jsonData.Items[name];
            return this.CfgData[name];
        } else {
            return [];
        }
    }
    private transDataView(fileInfo: any) {
        const mpqBuff: any = fileInfo.data;
        if (!mpqBuff) {
            return <unknown>fileInfo;
        }
        let encodedString = '';
        const chunk = 8 * 1024;
        const fcount = Math.ceil(fileInfo.length / chunk);
        for (let i = 0; i < fcount * chunk; i += chunk) {
            let tLen = chunk;
            if ((i + chunk) > fileInfo.length) {
                tLen = fileInfo.length - i;
            }
            const tmp = new Uint8Array(mpqBuff, parseInt(fileInfo.begin) + i, tLen);
            encodedString += String.fromCharCode.apply(null, tmp);
        }
        const decodedString = decodeURIComponent(escape(encodedString));// 没有这一步中文会乱码
        return decodedString;
    }
    private transJsonData<T>(name: string) {
        const fileInfo = this.jsonData.Items[name];
        let newObj;
        const baseStruct = this.structs[name];
        if (!fileInfo.k || !fileInfo.l || typeof fileInfo.k !== 'object' || typeof fileInfo.l !== 'object') {
            fileInfo.forEach((element, i) => {
                newObj = js.createMap(true);
                for (const k in baseStruct) {
                    if (Utils.isNullOrUndefined(element[k])) { // 没有配置的，从默认数据结构默认字段取值
                        fileInfo[i][k] = baseStruct[k];
                    }
                }
            });
            return <T>fileInfo;
        }
        const newData: Record<string, unknown>[] = [];
        const flist: [] = fileInfo.l;
        const keys: string[] = fileInfo.k;
        flist.forEach((f) => {
            newObj = js.createMap(true);
            keys.forEach((k, kIdx) => {
                newObj[k] = f[kIdx] || baseStruct[k];
            });
            newData.push(newObj);
        });
        return newData;
    }
    /**
     * 获取配置表单行数据
     * @param name 表名
     * @param index 索引
     * @returns 单个表数据
     */
    public getCfgOneData<T>(name: string, index: number): T {
        const cfgDatas = this.getCfgDatas(name);
        return <T>cfgDatas[index];
    }

    public getCfgDataValue<T>(name: string, index: number, key: string): T | undefined {
        const cfgDatas = this.getCfgDatas(name);
        const data = cfgDatas[index];
        if (data && !Utils.isNullOrUndefined(data[key])) {
            return <T>data[key];
        }
        return undefined;
    }

    public getCfgIndexer<T>(TableName: string, key?, value?: string): T {
        const k = `_${TableName}`;
        if (this[k]) {
            return <T> this[k];
        }
        this[k] = new CfgIndexer(this, TableName, key, value);
        return <T> this[k];
    }
}
