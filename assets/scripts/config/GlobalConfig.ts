/*
 * @Author: your name
 * @Date: 2020-05-20 11:51:43
 * @LastEditTime: 2020-06-30 15:25:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \RPG_Cocos\assets\script\m\cfg\GlobalConfig.js
 */

import { sys } from 'cc';

export default class GlobalConfig {
    private static _I: GlobalConfig = null;
    static get I(): GlobalConfig {
        if (this._I == null) {
            this._I = new GlobalConfig();
        }
        return this._I;
    }
    // 控制此文件长度，文件太长，批处理打包工具读不全
    // (function(g) {
    // 全局变量
    // window['GlobalConfig'] = {
    private static isOpenHearBeat: true;
    private static mergePrefabJson: false;
    private static showLog: true;

    private static VER = '';
    private static httpUri = 'http://192.168.22.135:8185';
    static BuryingpointUrl = 'http://10.10.10.22:8186/r/button';
    private static ReportPrefabUrl = 'http://10.10.10.22:8186/r/prefab';
    private static ReportInfoUrl = 'http://10.10.10.22:8186/r/info';
    // private static projectResURL:string = "http://192.168.123.95/HLRes";
    private static projectResURL = 'http://192.168.123.95/h5';
    private static HLResUrl = 'http://192.168.123.95/h5';
    private static ResPath = 'http://192.168.123.95/HLRes'; // 资源目录
    private static ResTestPath = 'http://192.168.22.187:8002'; // 测试资源目录 给灰度服使用
    static pingTaiUrl = 'http://192.168.44.123:8000';

    private static openAppId = 'wx9a95d598acdd55bf'; // 微信开放平台appId
    private static mpAppId = 'wx074b8b014ca18d19'; // 微信公众平台的appId
    // }

    // private _httpUrl: string = "http://10.10.10.22:8185";
    private _httpUrl = 'http://huanling1_dev_yxlogin.kaixinxiyou.com:8185';
    get httpUrl() {
        return this._httpUrl;
    }
    set httpUrl(url: string) {
        this._httpUrl = url;
    }

    static getHLResUrl() {
        return this.HLResUrl;
    }

    static getProjectResURL() {
        return this.projectResURL;
    }

    static getHttpUrl() {
        return this.httpUri;
    }

    static getHttpLoginUrl() {
        return `${this.getHttpUrl()}/api/login`;
    }
    // if (UtilsPlatform.isWechatGame()) {
    // wxDownloader.REMOTE_SERVER_ROOT = "http://192.168.22.207:8001/__VER__";
    // wxDownloader.ERROR_REPORT_URL = "http://192.168.22.207:8186/r/error";
    // wxDownloader.RES_DOWN_TIME_REPORT_URL = "http://192.168.22.207:8186/r/restime";
    // wxDownloader.REPORT_ISOPEN_URL = "http://192.168.22.207:8186/r/open";
    // }
}
// }(window))
