/* eslint-disable no-prototype-builtins */
import BaseModel from '../../../app/core/mvc/model/BaseModel';
import { Config } from '../../base/config/Config';
import { ConfigConst } from '../../base/config/ConfigConst';
import { ConfigItemIndexer } from '../../base/config/indexer/ConfigItemIndexer';
import { EntityAnimName } from '../../entity/EntityConst';
import ControllerMgr from '../../manager/ControllerMgr';
import MapMgr from '../../map/MapMgr';
import { RoleMgr } from '../role/RoleMgr';
import { ISysInfo } from './SettingConst';

const { ccclass } = cc._decorator;
@ccclass('SettingModel')
export class SettingModel extends BaseModel {
    public clearAll(): void {
        //
    }
    public clear(): void {
        //
    }
    /** 获取系统对象 */
    private _sysInfoObj: ISysInfo;
    public getSysInfo(): ISysInfo {
        if (!this._sysInfoObj && RoleMgr.I.d.SysSettingsInfo) {
            this._sysInfoObj = JSON.parse(RoleMgr.I.d.SysSettingsInfo);
        }
        return this._sysInfoObj;
    }
    private _checkInit(): void {
        if (!this._sysInfoObj) {
            // eslint-disable-next-line
            this[`_sysInfoObj`] = {};
        }
    }
    /** 音乐开关 */
    public setMusicSwitch(bol: boolean): void {
        this._checkInit();
        // eslint-disable-next-line dot-notation
        this._sysInfoObj[`musicSwitch`] = bol;
        this._saveToServer();
    }
    public getMusicSwitch(): boolean {
        const obj: ISysInfo = this.getSysInfo();
        if (obj && obj.hasOwnProperty('musicSwitch')) {
            return obj.musicSwitch;
        }
        return true;// 默认音乐开启
    }
    /** 获取音乐音量 */
    public getMusicVol(): number {
        const obj: ISysInfo = this.getSysInfo();
        if (obj && obj.hasOwnProperty('musicVol')) {
            return obj.musicVol;
        }
        return 0.5;// 没有存储，默认0.5
    }
    public setMusicVol(proNum: number): void {
        this._checkInit();
        // eslint-disable-next-line dot-notation
        this._sysInfoObj[`musicVol`] = proNum;
        this._saveToServer();
    }

    /** 音效开关 */
    public setMusicEffSwitch(bol: boolean): void {
        this._checkInit();
        // eslint-disable-next-line dot-notation
        this._sysInfoObj[`musicEffSwitch`] = bol;
        this._saveToServer();
    }
    public getMusicEffSwitch(): boolean {
        const obj: ISysInfo = this.getSysInfo();
        if (obj && obj.hasOwnProperty('musicEffSwitch')) {
            return obj.musicEffSwitch;
        }
        return true;// 默认音乐开启
    }
    /** 获取音效音量 */
    public getEffVol(): number {
        const obj: ISysInfo = this.getSysInfo();
        if (obj && obj.hasOwnProperty('effVol')) {
            return obj.effVol;
        }
        return 0.5;// 没有存储，默认0.5
    }
    public setEffVol(proNum: number): void {
        this._checkInit();
        // eslint-disable-next-line dot-notation
        this._sysInfoObj[`effVol`] = proNum;
        this._saveToServer();
    }
    //
    //
    //
    /** 是否显示特效 */
    public getSkillEff(): boolean {
        const obj: ISysInfo = this.getSysInfo();
        if (obj && obj.hasOwnProperty('pbSkillEff')) {
            return obj.pbSkillEff;
        }
        return true;// 默认屏蔽特效 不显示
    }
    public setSkillEff(bol: boolean, isSave: boolean = true): void {
        this._checkInit();
        // eslint-disable-next-line dot-notation
        this._sysInfoObj[`pbSkillEff`] = bol;
        //* *********bol=== true 屏蔽   false  不屏蔽******************** */
        //
        //
        //
        if (isSave) {
            this._saveToServer();
        }
    }
    /** 是否显示背饰 */
    public getBeiShi(): boolean {
        const obj: ISysInfo = this.getSysInfo();
        if (obj && obj.hasOwnProperty('pbBeiShi')) {
            return obj.pbBeiShi;
        }
        return true;// 默认开启
    }
    public setBeiShi(bol: boolean, isSave: boolean = true): void {
        this._checkInit();
        // eslint-disable-next-line dot-notation
        this._sysInfoObj[`pbBeiShi`] = bol;
        MapMgr.I.setEntityAnimActive(EntityAnimName.WING, bol);
        if (isSave) {
            this._saveToServer();
        }
    }
    /** 是否显示场景模型 */
    public getModel(): boolean {
        const obj: ISysInfo = this.getSysInfo();
        if (obj && obj.hasOwnProperty('pbModel')) {
            return obj.pbModel;
        }
        return true;
    }
    public setModel(bol: boolean, isSave: boolean = true): void {
        this._checkInit();
        // eslint-disable-next-line dot-notation
        this._sysInfoObj[`pbModel`] = bol;
        MapMgr.I.setEntityAnimActive(EntityAnimName.ALL, bol);
        if (isSave) {
            this._saveToServer();
        }
    }

    /** 是否显示特权等级 */
    public getSpecialPower(): boolean {
        const obj: ISysInfo = this.getSysInfo();
        if (obj && obj.hasOwnProperty('pbSpecialPower')) {
            return obj.pbSpecialPower;
        }
        return true;// 默认显示
    }
    public setSpecialPower(bol: boolean, isSave: boolean = true): void {
        this._checkInit();
        // eslint-disable-next-line dot-notation
        this._sysInfoObj[`pbSpecialPower`] = bol;
        if (isSave) {
            this._saveToServer();
        }
    }
    /** 挂机战斗 */
    public getAutoFight(): boolean {
        const obj: ISysInfo = this.getSysInfo();
        if (obj && obj.hasOwnProperty('autoFight')) {
            return obj.autoFight;
        }
        return true;// 默认是挂机战斗
    }

    public setAutoFight(bol: boolean, isSave: boolean = true): void {
        this._checkInit();
        // eslint-disable-next-line dot-notation
        this._sysInfoObj[`autoFight`] = bol;
        if (isSave) {
            this._saveToServer();
        }
    }

    /** 武将 军师 红颜》》》》》》》》》》》》》》》 */
    /** 武将 */
    public getWuJiang(): boolean {
        const obj: ISysInfo = this.getSysInfo();
        if (obj && obj.hasOwnProperty('wuJiang')) {
            return obj.wuJiang;
        }
        return true;// 默认显示
    }
    public setWuJiang(bol: boolean, isSave: boolean = true): void {
        this._checkInit();
        // eslint-disable-next-line dot-notation
        this._sysInfoObj[`wuJiang`] = bol;
        if (isSave) {
            this._saveToServer();
        }
    }
    /** 红颜 */
    public getHongYan(): boolean {
        const obj: ISysInfo = this.getSysInfo();
        if (obj && obj.hasOwnProperty('hongYan')) {
            return obj.hongYan;
        }
        return true;// 默认显示
    }
    public setHongYan(bol: boolean, isSave: boolean = true): void {
        this._checkInit();
        // eslint-disable-next-line dot-notation
        this._sysInfoObj[`hongYan`] = bol;
        if (isSave) {
            this._saveToServer();
        }
    }
    /** 军师 */
    public getJunShi(): boolean {
        const obj: ISysInfo = this.getSysInfo();
        if (obj && obj.hasOwnProperty('junShi')) {
            return obj.junShi;
        }
        return true;// 默认显示
    }
    public setJunShi(bol: boolean, isSave: boolean = true): void {
        this._checkInit();
        // eslint-disable-next-line dot-notation
        this._sysInfoObj[`junShi`] = bol;
        if (isSave) {
            this._saveToServer();
        }
    }

    /** 助战跟随 是否勾选 */
    public getFightFollow(): boolean {
        const obj: ISysInfo = this.getSysInfo();
        if (obj) {
            // eslint-disable-next-line dot-notation
            if (obj.junShi === undefined) {
                obj.junShi = true;
            }
            if (obj.hongYan === undefined) {
                obj.hongYan = true;
            }
            if (obj.wuJiang === undefined) {
                obj.wuJiang = true;
            }

            return !obj.junShi || !obj.hongYan || !obj.wuJiang;
        }
        return false;
    }
    public setFightFollow(bol: boolean): void {
        this._checkInit();

        this.setJunShi(!bol, false);
        this.setWuJiang(!bol, false);
        this.setHongYan(!bol, false);

        this._saveToServer();
    }

    /** 帧率 */
    public getFrameRate(): number {
        const obj: ISysInfo = this.getSysInfo();
        if (obj && obj.hasOwnProperty('frameRate')) {
            return obj.frameRate;
        }
        return 30;
    }
    public setFrameRate(fps: number): void {
        this._checkInit();
        // eslint-disable-next-line dot-notation
        this._sysInfoObj[`frameRate`] = fps;
        this._saveToServer();
    }
    //
    //
    //
    /** 获取是否是流畅 */
    public getLcMode(): boolean {
        const obj: ISysInfo = this.getSysInfo();
        if (obj && obj.hasOwnProperty('lcMode')) {
            return obj.lcMode;
        }
        return false;// 默认false 显示各种技能特效 等
    }
    public setLcMode(bol: boolean): void {
        this._checkInit();
        // eslint-disable-next-line dot-notation
        this._sysInfoObj[`lcMode`] = bol;// 流畅模式

        this.setSkillEff(!bol, false);// 技能特效
        this.setBeiShi(!bol, false);// 背饰
        this.setModel(!bol, false);// 模型
        this.setSpecialPower(!bol, false);// 特权等级
        this.setAutoFight(bol, false);// 自动挂机
        // 武将 军师 红颜
        this.setJunShi(!bol, false);
        this.setWuJiang(!bol, false);
        this.setHongYan(!bol, false);

        this._saveToServer();
    }

    //
    //
    /** 获取改名卡配置 */
    public getCfgItem(): Cfg_Item {
        const indexer = Config.Get(Config.Type.Cfg_Config);
        const key = Number(indexer.getValueByKey('ChangeNickNeedItem', 'CfgValue'));
        const indexer1: ConfigItemIndexer = Config.Get(ConfigConst.Cfg_Item);
        const itm: Cfg_Item = indexer1.getValueByKey(key);
        return itm;
    }

    /** 改动就发送一次存储到服务器 */
    private _saveToServer() {
        const str = JSON.stringify(this._sysInfoObj);
        // console.log(str);
        ControllerMgr.I.SettingController.reqC2SSysSettingsInfo(str);
    }
}
