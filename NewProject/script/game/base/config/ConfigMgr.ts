/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { EventClient } from '../../../app/base/event/EventClient';
import HttpReq from '../../../app/core/net/http/HttpReq';
import { ResMgr } from '../../../app/core/res/ResMgr';
import { E } from '../../const/EventName';
import GameApp from '../GameApp';
import UtilObject from '../utils/UtilObject';
import { ConfigConst, ConfigInfo, MPQ_FILE_INFO } from './ConfigConst';

type ExcelToConfigStruct = {
    begin: number,
    data: ArrayBuffer,
    length: number,
    suffix: string
}

type TmpJsonData = { Items: { [key: string]: ExcelToConfigStruct | any }; }

export class ConfigMgr {
    private static _I: ConfigMgr;
    public static get I(): ConfigMgr {
        if (!this._I) {
            this._I = new ConfigMgr();
            this._I.init();
        }
        return this._I;
    }
    public do(): void {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, dot-notation
        // cc.resources.load(`i18n/prefab-${window['_Lang'].Name}`, cc.JsonAsset, (e, d) => {
        // console.log('d=', d);
        // eslint-disable-next-line dot-notation
        // window['_Lang'].Data = d.json as { [k: string]: string };
        // });
    }
    private init(): void {
        EventClient.I.on(E.Config.InitConfigStart, this.onInitConfigStart, this);
    }

    private onInitConfigStart() {
        EventClient.I.off(E.Config.InitConfigStart, this.onInitConfigStart, this);
        this.loadMergeJson();
    }

    public CfgData: { [name: string]: object[]; } = cc.js.createMap(true);
    private jsonData: TmpJsonData = undefined;
    public inited = false;
    // 属性数量（常量）
    public ATTRNUM = 20;
    private load(jsonData: TmpJsonData): void {
        this.initData(jsonData);
        jsonData = null;
    }

    private initData(jsonData: TmpJsonData): void {
        this.jsonData = jsonData;
        this.initStruct();
        this.inited = true;
    }
    private structs: { [key: string]: any; };
    // 初始化表结构
    private initStruct() {
        this.structs = cc.js.createMap(true);
        const items = this.jsonData.Items;
        const tmpStruct: ExcelToConfigStruct = items.d as ExcelToConfigStruct;
        const str = this.transDataView(tmpStruct);
        items.d = JSON.parse(str);
        for (const name in items.d) {
            this.structs[name] = items.d[name];
        }
        delete items.d;
    }

    private loadMergeJson(): void {
        this.loadExcel();
    }
    private loadZipRes(zipName: string, out: { [name: string]: MPQ_FILE_INFO; }, callback: () => void, context) {
        HttpReq.I.getMpq(GameApp.I.ResDirUrl() + zipName, (data: ArrayBuffer) => {
            this.getMPQData(data, out, () => {
                callback.call(context);
                out = null;
            }, this);
        }, () => {
            console.log(`${zipName}载入失败,50毫秒后重试:${zipName}`);
            let timer = setTimeout(() => {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
                this.loadZipRes(zipName, out, callback, context);
            }, 50);
        });
    }
    private getMPQData(buffMPQ: ArrayBuffer | cc.BufferAsset, out: { [name: string]: MPQ_FILE_INFO; }, callBack: () => void, context) {
        let buff: ArrayBuffer = null;
        if (buffMPQ instanceof ArrayBuffer) {
            buff = buffMPQ;
        } else {
            // eslint-disable-next-line dot-notation
            buff = buffMPQ['_buffer'];
        }
        const mpqData = new DataView(buff);
        const offset = 0;
        const filesLen: number = mpqData.getInt16(offset);
        this.parseMPQ(0, filesLen, 2, mpqData, buff, out, callBack, context);
        out = null;
    }
    private parseMPQ(
        currentIdx: number,
        length: number,
        offset: number,
        mpqData: DataView,
        mpqBuff: ArrayBuffer,
        out: { [name: string]: MPQ_FILE_INFO; },
        callBack: () => void,
        context,
    ) {
        // var mpqBuff = mpqBuff.slice(0, mpqBuff.length);
        for (let findex = 0; findex < length; findex++) {
            const fileInfo: MPQ_FILE_INFO = {};
            const fileNameLen: number = mpqData.getInt16(offset);
            offset += 2;
            // var name_buf = mpqBuff.slice(offset, offset +fileNameLen);
            const name8buf = new Uint8Array(mpqBuff, offset, fileNameLen);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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

    private loadExcel() {
        let clientJson: { [name: string]: MPQ_FILE_INFO; } = {};
        let loadNum = 4;
        const needDelTables = [
            'Cfg_Server_Activity',
            'Cfg_Server_GeneralZhaoMu',
            'Cfg_Server_ActZhaoMu',
            'Cfg_Server_ZhaoMuConfig',
            'Cfg_Server_ZhaoMuStageReward',
            'Cfg_Server_EventReward',
            'Cfg_Server_DailySignConst',
            'Cfg_Server_DailySignNumReward',
            'Cfg_Server_DailySignReward',
            'Cfg_Server_OnlineRewards',
            'Cfg_Server_StageRewards',
            'Cfg_Server_CashCow',
            'Cfg_Server_CashCowNormal',
            'Cfg_Server_CashCowEffect',
        ];
        const loadZipResFunc = () => {
            loadNum--;
            if (loadNum <= 0) {
                // 加载完成
                let content: { Items: any; } = { Items: {} };
                for (const key in clientJson) {
                    const fileInfo = clientJson[key];
                    const tableName = key.replace('.json', '');
                    const index = needDelTables.indexOf(tableName);
                    if (index >= 0) {
                        needDelTables.splice(index, 1);
                    } else {
                        content.Items[key.replace('.json', '')] = fileInfo;
                    }
                }
                this.load(content);
                EventClient.I.emit(E.Config.InitConfigSuccess);
                clientJson = null;
                content = null;
            }
        };

        for (let i = 0; i < loadNum; i++) {
            const _str: string = GameApp.I.getConfigUrl(i);
            this.loadZipRes(_str, clientJson, loadZipResFunc, this);
        }
    }

    private transDataView(fileInfo: ExcelToConfigStruct): string {
        const mpqBuff: ArrayBuffer = fileInfo.data;
        if (!mpqBuff) {
            const f: unknown = fileInfo;
            return f as string;
        }
        let encodedString = '';
        const chunk = 8 * 1024;
        const fcount = Math.ceil(fileInfo.length / chunk);
        for (let i = 0; i < fcount * chunk; i += chunk) {
            let tLen = chunk;
            if ((i + chunk) > fileInfo.length) {
                tLen = fileInfo.length - i;
            }
            const tmp = new Uint8Array(mpqBuff, fileInfo.begin + i, tLen);
            encodedString += String.fromCharCode.apply(null, tmp);
        }
        const decodedString = decodeURIComponent(escape(encodedString));// 没有这一步中文会乱码
        return decodedString;
    }
    public transJsonDatas<T>(name: string): T[] {
        const fileInfo = this.jsonData.Items[name];
        const baseStruct = this.structs[name];
        let newObj: T;
        if (!fileInfo.k || !fileInfo.l || typeof fileInfo.k !== 'object' || typeof fileInfo.l !== 'object') {
            const newObjs: T[] = [];
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            fileInfo.forEach((element, i) => {
                newObj = cc.js.createMap(true);
                for (const k in baseStruct) {
                    newObj[k] = element[k] || baseStruct[k];
                }
                newObjs.push(newObj);
            });
            return newObjs;
        }
        const newData: T[] = [];
        const flist: [] = fileInfo.l;
        const keys: string[] = fileInfo.k;
        flist.forEach((f) => {
            newObj = cc.js.createMap(true);
            keys.forEach((k, index) => {
                newObj[k] = f[index] || baseStruct[k];
            });
            newData.push(newObj);
        });
        return newData;
    }
    /**
    * 构造一个数据对象
    * @param tableName 表名(数据类型名字)
    * @param obj 原始数据,如果不传或者传null,则会所有字段都将是默认值
    */
    public initItem(name: string, obj?: object): object {
        if (obj == null || obj === undefined) obj = {};
        const baseStruct = this.structs[name];
        if (baseStruct) {
            for (const k in baseStruct) {
                if (!Object.prototype.hasOwnProperty.call(obj, k)) {
                    obj[k] = baseStruct[k];
                }
            }
        }
        return obj;
    }
    private transJsonData<T>(name: string): T[] {
        const fileInfo = this.jsonData.Items[name];
        if (!fileInfo.k || !fileInfo.l || typeof fileInfo.k !== 'object' || typeof fileInfo.l !== 'object') {
            return fileInfo as T[];
        }
        const newData: T[] = [];
        const flist: object[] = fileInfo.l;
        const keys: string[] = fileInfo.k;
        let newObj: T;
        flist.forEach((f) => {
            newObj = cc.js.createMap(true);
            for (const k in f) {
                newObj[keys[k]] = f[k];
            }
            newData.push(newObj);
        });
        return newData;
    }
    /**
     * 获取配置表单行数据
     * @param cfgName 表名
     * @param index 索引
     * @returns 单个表数据
     */
    public getOneData<T>(cfgName: string, index: number): T {
        const cfgDatas: unknown = this.getDatas(cfgName);
        return cfgDatas[index] as T;
    }

    public getDataValue<T>(cfgName: string, index: number, key: string): T | undefined {
        const cfgDatas = this.getDatas(cfgName);
        const data = cfgDatas[index];
        if (data && data[key] && data[key] !== null && data[key] !== undefined) {
            return data[key] as T;
        }
        return undefined;
    }

    public getDatas(cfgName: string): object[] {
        if (this.CfgData[cfgName]) {
            return this.CfgData[cfgName];
        }
        if (this.jsonData && this.jsonData.Items[cfgName]) {
            if (this.jsonData.Items[cfgName].data) {
                this.jsonData.Items[cfgName] = this.transDataView(this.jsonData.Items[cfgName] as ExcelToConfigStruct);
            }
            if (typeof this.jsonData.Items[cfgName] === 'string') {
                this.jsonData.Items[cfgName] = JSON.parse(this.jsonData.Items[cfgName] as string);
            }
            const data: object[] = this.transJsonData(cfgName);
            const cfgInfo = ConfigConst[cfgName] as ConfigInfo;
            if (!cfgInfo || !cfgInfo.ex || !cfgInfo.ex.deleteSource) {
                this.CfgData[cfgName] = data;
            }
            delete this.jsonData.Items[cfgName];
            return data;
        } else {
            return [];
        }
    }

    /**
     * 用于活动表数据的转换和缓存。配置的数据可能会变化，也可能会多次插入，这里已存在缓存还可以刷新
     * @param cfgName 表名
     * @param jsonData 数据
     * @param needCheck 暂未发现会存在相同数据重复插入的情况，若有，优先联合服务端检查活动数据版本号，再考虑设为true
     * @returns
     */
    public setActivityDatas(cfgName: string, jsonData: string[], needCheck: boolean = false): object[] {
        if (jsonData) {
            const newData: object[] = [];
            jsonData.forEach((f) => {
                const data = JSON.parse(f);

                let canAdd: boolean = true;
                if (needCheck && this.CfgData[cfgName]) {
                    for (let i = 0; i < this.CfgData[cfgName].length; i++) {
                        if (UtilObject.equals(this.CfgData[cfgName][i], data)) {
                            canAdd = false;
                            break;
                        }
                    }
                }
                if (canAdd) {
                    newData.push(data);
                }
            });

            if (!this.CfgData[cfgName] || this.CfgData[cfgName].length === 0) {
                this.CfgData[cfgName] = newData;
                return newData;
            } else {
                this.CfgData[cfgName] = this.CfgData[cfgName].concat(newData);
                return newData;
            }

            // console.log(cfgName, this.CfgData[cfgName]);
        }
        return [];
    }

    public getActivityDatas(cfgName: string): object[] {
        return this.CfgData[cfgName];
    }
}
